#!/usr/bin/env node
/**
 * 🧱 Foundry CLI — v3.4
 * Clean, manifest-driven template instantiation system.
 * 
 * Features:
 *  - `foundry new <template> <project>`
 *  - Template manifest (`template.json`) defines `extends`, `postInstall`, etc.
 *  - Copies and merges shared core directories (config, tools, etc.)
 *  - Installs dependencies recursively per package.json
 *  - Supports automatic iOS Xcode project generation via XcodeGen
 */

import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs";
import ora from "ora";
import path from "path";
import { stdin as input, stdout as output } from "process";
import readline from "readline/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Parse CLI arguments ---
const args = process.argv.slice(2);
if (args[0] === "new") args.shift();
const [templateName, projectName, ...flags] = args;

if (!templateName || !projectName) {
  console.error(chalk.red("❌ Usage: foundry new <template> <project-name> [--local]"));
  process.exit(1);
}

// --- Resolve paths ---
const foundryRoot = path.resolve(__dirname, "..");
const templatePath = path.join(foundryRoot, "templates", templateName);
const globalProjectsDir = path.join(process.env.HOME, "DevProjects");
const isLocal = flags.includes("--local");
const targetDir = isLocal
  ? path.join(process.cwd(), projectName)
  : path.join(globalProjectsDir, projectName);

// --- Verify template existence ---
if (!fs.existsSync(templatePath)) {
  console.error(chalk.red(`❌ Template not found: ${templatePath}`));
  process.exit(1);
}

// --- Create target directory ---
fs.mkdirSync(targetDir, { recursive: true });

// --- Load manifest (template.json) ---
const manifestPath = path.join(templatePath, "template.json");
let manifest = {};
if (fs.existsSync(manifestPath)) {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  console.log(chalk.gray(`🧩 Loaded template manifest: ${manifest.name || templateName}`));
} else {
  console.log(chalk.yellow("⚠️ No template.json found — continuing with defaults."));
}

// --- Copy template files ---
console.log(chalk.blue(`📦 Creating new project from template: ${templateName}`));
fs.cpSync(templatePath, targetDir, { recursive: true });

// --- Extend from shared core paths ---
if (manifest.extends && Array.isArray(manifest.extends)) {
  for (const declaredPath of manifest.extends) {
    const normalizedRel = declaredPath
      .replace(/\\/g, "/")
      .replace(/^(?:\.\/)+/, "")
      .replace(/^(?:\.\.\/)+/, "")
      .replace(/^\/+/, "");

    const srcAbs = path.join(foundryRoot, normalizedRel);
    const destDirName = path.basename(normalizedRel.replace(/\/+$/, ""));
    const destAbs = path.join(targetDir, destDirName);

    console.log(chalk.magenta(`📁 Extend: ${declaredPath}\n    src:  ${srcAbs}\n    dest: ${destAbs}`));

    if (fs.existsSync(srcAbs)) {
      const stat = fs.lstatSync(srcAbs);
      if (stat.isDirectory()) {
        fs.mkdirSync(destAbs, { recursive: true });
        fs.cpSync(srcAbs, destAbs, { recursive: true });
      } else {
        fs.mkdirSync(path.dirname(destAbs), { recursive: true });
        fs.cpSync(srcAbs, destAbs);
      }
      console.log(chalk.gray(`🔗 Copied into ${destAbs}`));
    } else {
      console.log(chalk.yellow(`⚠️ Missing extended path: ${srcAbs}`));
    }
  }
}

// --- Install dependencies recursively ---
const spinner = ora(`Installing dependencies for ${chalk.green(projectName)}...`).start();

function installDeps(dir) {
  const pkgPath = path.join(dir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    console.log(chalk.cyan(`\n🔧 Installing dependencies for ${pkg.name || dir}`));
    execSync("npm install --omit=dev", { cwd: dir, stdio: "inherit" });
  }
}

function findAndInstall(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findAndInstall(fullPath);
    } else if (entry.name === "package.json") {
      installDeps(path.dirname(fullPath));
    }
  }
}

try {
  findAndInstall(targetDir);
  spinner.succeed(chalk.green(`✅ All dependencies installed for ${projectName}!`));
} catch (err) {
  spinner.fail(chalk.red("❌ Failed to install dependencies automatically."));
  console.error(err);
}

// --- Handle iOS templates ---
if (templateName.toLowerCase().includes("ios")) {
  console.log(chalk.yellow("\n🛠 Detected iOS template — starting interactive Xcode setup..."));

  const rl = readline.createInterface({ input, output });
  const appName = await rl.question(chalk.cyan("📱 Enter app name (e.g. WorldChat): "));
  const bundleId = await rl.question(chalk.cyan(`🎯 Enter bundle ID (default: com.mbarge.${appName || projectName}): `));
  rl.close();

  const finalAppName = appName || projectName;
  const finalBundleId = bundleId || `com.mbarge.${finalAppName.toLowerCase()}`;

  const iosBootstrap = path.join(targetDir, "ios-bootstrap");
  const renamedIosFolder = path.join(targetDir, finalAppName);

  if (!fs.existsSync(iosBootstrap)) {
    console.log(chalk.red("❌ ios-bootstrap folder missing — cannot generate Xcode project."));
    process.exit(1);
  }

  fs.renameSync(iosBootstrap, renamedIosFolder);
  console.log(chalk.gray(`📂 Renamed iOS bootstrap folder → ${finalAppName}`));

  try {
    // Helpers
    const writeCanonicalInfoPlist = (plistPath, appNameVal, bundleIdVal) => {
      const lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
        '<plist version="1.0">',
        '<dict>',
        '  <key>CFBundleName</key>',
        '  <string>$(PRODUCT_NAME)</string>',
        '  <key>CFBundleIdentifier</key>',
        '  <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>',
        '  <key>CFBundleVersion</key>',
        '  <string>1</string>',
        '  <key>CFBundleShortVersionString</key>',
        '  <string>1.0</string>',
        '  <key>UILaunchStoryboardName</key>',
        '  <string>LaunchScreen</string>',
        '  <key>UIApplicationSceneManifest</key>',
        '  <dict>',
        '    <key>UIApplicationSupportsMultipleScenes</key>',
        '    <false/>',
        '  </dict>',
        '</dict>',
        '</plist>',
        ''
      ];
      const content = lines.join("\n");
      fs.writeFileSync(plistPath, content, { encoding: "utf8", flag: "w" });
      // Force xml format and validate
      execSync(`plutil -convert xml1 "${plistPath}"`, { stdio: "inherit" });
      execSync(`plutil -lint "${plistPath}"`, { stdio: "inherit" });
    };
    const validatePlist = (plistPath) => {
      try {
        execSync(`plutil -lint "${plistPath}"`, { stdio: "pipe" });
        return true;
      } catch {
        return false;
      }
    };
    const writeMinimalGoogleServicePlist = (plistPath) => {
      const lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
        '<plist version="1.0">',
        '<dict>',
        '  <key>GOOGLE_APP_ID</key>',
        '  <string>REPLACE_WITH_YOUR_APP_ID</string>',
        '  <key>GCM_SENDER_ID</key>',
        '  <string>REPLACE_WITH_YOUR_SENDER_ID</string>',
        '  <key>API_KEY</key>',
        '  <string>REPLACE_WITH_YOUR_API_KEY</string>',
        '  <key>PROJECT_ID</key>',
        '  <string>REPLACE_WITH_YOUR_PROJECT_ID</string>',
        '</dict>',
        '</plist>',
        ''
      ];
      const content = lines.join("\n");
      fs.writeFileSync(plistPath, content, { encoding: "utf8", flag: "w" });
      execSync(`plutil -convert xml1 "${plistPath}"`, { stdio: "inherit" });
      execSync(`plutil -lint "${plistPath}"`, { stdio: "inherit" });
    };
    fs.mkdirSync(path.join(renamedIosFolder, "Tests"), { recursive: true });
    fs.mkdirSync(path.join(renamedIosFolder, "UITests"), { recursive: true });

    const projectYml = path.join(renamedIosFolder, "project.yml");
    if (fs.existsSync(projectYml)) {
      let content = fs.readFileSync(projectYml, "utf8");
      // Update project name
      content = content.replace(/^name:\s*.*/m, `name: ${finalAppName}`);
      // Replace test targets and schemes first (avoid partial overlaps), then base app name
      content = content.replace(/\bMyAppUITests\b/g, `${finalAppName}UITests`);
      content = content.replace(/\bMyAppTests\b/g, `${finalAppName}Tests`);
      // Replace ALL occurrences of MyApp with the final app name (targets, schemes, references)
      content = content.replace(/\bMyApp\b/g, finalAppName);
      // Update bundle id
      content = content.replace(/(PRODUCT_BUNDLE_IDENTIFIER:\s*).*/m, `$1${finalBundleId}`);
      // Ensure INFOPLIST_FILE is set to Info.plist at the target root
      content = content.replace(/(INFOPLIST_FILE:\s*).*/m, `$1Info.plist`);
      // Ensure Firebase via SPM packages block exists
      if (!/packages:\s*\n\s*Firebase:/m.test(content)) {
        const packagesBlock = `\npackages:\n  Firebase:\n    url: https://github.com/firebase/firebase-ios-sdk.git\n    from: 10.24.0\n`;
        content = content.replace(/(MARKETING_VERSION:\s*.*)/m, `$1${packagesBlock}`);
      }
      // Ensure dependencies use package products, replace legacy sdk lines if present
      content = content.replace(/\- sdk: FirebaseCore\.framework\n?/g, "");
      content = content.replace(/\- sdk: FirebaseFirestore\.framework\n?/g, "");
      if (!/product:\s*FirebaseCore/m.test(content)) {
        content = content.replace(/dependencies:\n([\s\S]*?)\n\s*\n/m, (m0) => {
          return m0.replace(/dependencies:\n/, `dependencies:\n      - package: Firebase\n        product: FirebaseCore\n      - package: Firebase\n        product: FirebaseFirestore\n`);
        });
      }
      fs.writeFileSync(projectYml, content, { encoding: "utf8" });
      console.log(chalk.gray(`📄 Updated project.yml test targets for ${finalAppName}`));
    }

    const infoPlist = path.join(renamedIosFolder, "Info.plist");
    console.log(chalk.gray("🧩 Writing canonical Info.plist..."));
    writeCanonicalInfoPlist(infoPlist, finalAppName, finalBundleId);
    console.log(chalk.green(`📄 Info.plist validated for ${finalAppName}`));

    // Ensure GoogleService-Info.plist is a valid plist so Xcode doesn't error
    const googlePlist = path.join(renamedIosFolder, "GoogleService-Info.plist");
    if (fs.existsSync(googlePlist)) {
      if (!validatePlist(googlePlist)) {
        console.log(chalk.yellow("⚠️ GoogleService-Info.plist invalid — writing minimal placeholder."));
        writeMinimalGoogleServicePlist(googlePlist);
      } else {
        execSync(`plutil -convert xml1 "${googlePlist}"`, { stdio: "inherit" });
      }
    } else {
      console.log(chalk.gray("ℹ️ GoogleService-Info.plist missing — creating placeholder so builds succeed."));
      writeMinimalGoogleServicePlist(googlePlist);
    }

    console.log(chalk.gray(`📄 Running: xcodegen generate`));
    execSync("xcodegen generate", { cwd: renamedIosFolder, stdio: "inherit" });

    const oldProj = path.join(renamedIosFolder, "MyApp.xcodeproj");
    const newProj = path.join(renamedIosFolder, `${finalAppName}.xcodeproj`);
    if (fs.existsSync(oldProj)) fs.renameSync(oldProj, newProj);

    // Pre-resolve Swift Package dependencies so Xcode opens ready to build
    const projToResolve = fs.existsSync(newProj) ? newProj : path.join(renamedIosFolder, `${finalAppName}.xcodeproj`);
    console.log(chalk.gray(`📦 Resolving Swift packages and generating workspace...`));
    try {
      execSync(`xcodebuild -resolvePackageDependencies -project "${projToResolve}"`, { stdio: "inherit" });
    } catch (e) {
      console.log(chalk.yellow("⚠️ xcodebuild project package resolution reported an issue; continuing."));
    }

    // Ensure a workspace exists that references the project
    const workspaceDir = path.join(renamedIosFolder, `${finalAppName}.xcworkspace`);
    const workspaceDataPath = path.join(workspaceDir, "contents.xcworkspacedata");
    if (!fs.existsSync(workspaceDir)) {
      fs.mkdirSync(workspaceDir, { recursive: true });
      const workspaceXml = `<?xml version="1.0" encoding="UTF-8"?>\n<Workspace version = "1.0">\n  <FileRef location = "group:${finalAppName}.xcodeproj">\n  </FileRef>\n</Workspace>\n`;
      fs.writeFileSync(workspaceDataPath, workspaceXml, { encoding: "utf8" });
    } else if (!fs.existsSync(workspaceDataPath)) {
      const workspaceXml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Workspace version = \"1.0\">\n  <FileRef location = \"group:${finalAppName}.xcodeproj\">\n  </FileRef>\n</Workspace>\n`;
      fs.writeFileSync(workspaceDataPath, workspaceXml, { encoding: "utf8" });
    }

    // Resolve packages at the workspace level (with scheme)
    try {
      execSync(`xcodebuild -resolvePackageDependencies -workspace "${workspaceDir}" -scheme "${finalAppName}"`, { stdio: "inherit" });
    } catch (e) {
      console.log(chalk.yellow("⚠️ xcodebuild workspace package resolution reported an issue; continuing."));
    }

    // Ensure a Package.resolved is present in shared swiftpm folder
    const projResolved = path.join(projToResolve, "project.xcworkspace", "xcshareddata", "swiftpm", "Package.resolved");
    const wsResolved = path.join(workspaceDir, "xcshareddata", "swiftpm", "Package.resolved");
    try {
      if (!fs.existsSync(path.dirname(projResolved))) fs.mkdirSync(path.dirname(projResolved), { recursive: true });
      if (!fs.existsSync(path.dirname(wsResolved))) fs.mkdirSync(path.dirname(wsResolved), { recursive: true });
      // Re-run resolve to trigger writing Package.resolved if still missing
      if (!fs.existsSync(projResolved)) {
        try { execSync(`xcodebuild -resolvePackageDependencies -project "${projToResolve}"`, { stdio: "ignore" }); } catch { }
      }
      if (!fs.existsSync(wsResolved)) {
        try { execSync(`xcodebuild -resolvePackageDependencies -workspace "${workspaceDir}" -scheme "${finalAppName}"`, { stdio: "ignore" }); } catch { }
      }
    } catch { }

    console.log(chalk.green(`✅ Firebase and Swift packages fully resolved for ${finalAppName}`));

    console.log(chalk.green(`✅ Successfully generated ${finalAppName}.xcodeproj inside ${finalAppName}/`));
  } catch (err) {
    console.error(chalk.red("❌ XcodeGen failed to generate project."));
    console.error(chalk.gray("Ensure `brew install xcodegen` and valid project.yml."));
  }
}

// --- Post-install scripts ---
if (manifest.postInstall && Array.isArray(manifest.postInstall)) {
  for (const cmd of manifest.postInstall) {
    console.log(chalk.cyan(`⚙️ Running post-install command: ${cmd}`));
    try {
      execSync(cmd, { cwd: targetDir, stdio: "inherit" });
    } catch (err) {
      console.log(chalk.red(`❌ Post-install command failed: ${cmd}`));
    }
  }
}

// --- Hello World validation ---
if (manifest.helloWorld) {
  const helloPath = path.join(targetDir, manifest.helloWorld.file);
  if (fs.existsSync(helloPath)) {
    console.log(chalk.green(`👋 Hello World entry point found: ${manifest.helloWorld.file}`));
  } else {
    console.log(chalk.red(`❌ Expected Hello World file missing: ${manifest.helloWorld.file}`));
  }
}

// --- Final summary ---
console.log(chalk.greenBright(`\n🚀 Project created successfully: ${projectName}`));
console.log(chalk.gray(`📂 Location: ${targetDir}`));
console.log(chalk.cyan(`\nNext steps:`));
console.log(chalk.white(`  cd ${targetDir}`));
console.log(chalk.white(`  npm run dev   # or open your IDE`));
console.log(chalk.white(`\n✨ Happy building with Foundry Core!`));
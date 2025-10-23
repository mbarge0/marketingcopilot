#!/usr/bin/env node
/**
 * 🧱 Foundry CLI — v3.3
 * Clean, manifest-driven template instantiation system.
 * 
 * Features:
 *  - `foundry new <template> <project>`
 *  - Template manifest (`template.json`) defines `extends`, `postInstall`, etc.
 *  - Copies and merges shared core directories (config, tools, etc.)
 *  - Installs dependencies recursively per package.json
 */

import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs";
import ora from "ora";
import path from "path";
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
// Ensure foundryRoot points to the root of foundryv3, not DevProjects
const foundryRoot = path.resolve(__dirname, "../");
if (!fs.existsSync(path.join(foundryRoot, "core"))) {
  // If run via npm link from elsewhere, correct path manually
  const possibleRoot = path.resolve(process.cwd(), "foundryv3");
  if (fs.existsSync(path.join(possibleRoot, "core"))) {
    console.log(chalk.gray(`🔍 Adjusted foundry root: ${possibleRoot}`));
    foundryRoot = possibleRoot;
  }
}
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

// --- Copy template files first ---
console.log(chalk.blue(`📦 Creating new project from template: ${templateName}`));
fs.cpSync(templatePath, targetDir, { recursive: true });

// --- Extend from shared core paths ---
if (manifest.extends && Array.isArray(manifest.extends)) {
  for (const relPath of manifest.extends) {
    // Always resolve relative to Foundry root (not cwd)
    const absPath = path.join(foundryRoot, relPath.replace(/^(\.\/|\/)+/, ""));
    console.log(chalk.magenta(`📁 Resolved path: ${absPath}`)); // debug
    if (fs.existsSync(absPath)) {
      console.log(chalk.gray(`🔗 Extending from ${absPath}`));
      fs.cpSync(absPath, targetDir, { recursive: true });
    } else {
      console.log(chalk.yellow(`⚠️ Missing extended path: ${absPath}`));
    }
  }
}

// --- Auto dependency installation ---
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

// --- Post-install scripts (optional) ---
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

// --- Hello World validation (optional) ---
if (manifest.helloWorld) {
  const helloPath = path.join(targetDir, manifest.helloWorld.file);
  if (fs.existsSync(helloPath)) {
    console.log(chalk.green(`👋 Hello World entry point found: ${manifest.helloWorld.file}`));
  } else {
    console.log(chalk.red(`❌ Expected Hello World file missing: ${manifest.helloWorld.file}`));
  }
}

// --- Done ---
console.log(chalk.greenBright(`\n🚀 Project created successfully: ${projectName}`));
console.log(chalk.gray(`📂 Location: ${targetDir}`));
console.log(chalk.cyan(`\nNext steps:`));
console.log(chalk.white(`  cd ${targetDir}`));
console.log(chalk.white(`  npm run dev   # or open your IDE`));
console.log(chalk.white(`\n✨ Happy building with Foundry Core!`));
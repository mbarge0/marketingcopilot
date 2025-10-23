#!/usr/bin/env node

/**
 * 🧱 Foundry CLI (Simplified)
 * Creates new projects from templates, installs dependencies,
 * but does NOT generate an Xcode project automatically.
 *
 * Example:
 *   foundry new ios-firebase myworldchat
 *   foundry new web-supabase mycoolapp --local
 */

import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs";
import ora from "ora";
import path from "path";
import { stdin as input, stdout as output } from "process";
import readline from "readline/promises";
import { fileURLToPath } from "url";

// --- Fix __dirname in ESM scope ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CLI argument parsing ---
const args = process.argv.slice(2);
const command = args[0];
const templateName = args[1];
const projectName = args[2];
const flags = args.slice(3);

if (command !== "new" || !templateName || !projectName) {
  console.error(chalk.red("❌ Usage: foundry new <template> <project-name> [--local]"));
  process.exit(1);
}

// --- Helper for interactive prompts (still useful for future) ---
async function ask(question, def = "") {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(chalk.cyan(`${question}${def ? ` (${def})` : ""}: `));
  rl.close();
  return answer || def;
}

// --- Determine template paths ---
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

// --- Copy all template files into target directory ---
console.log(chalk.blue(`📦 Creating new project from template: ${templateName}`));
// --- Copy all template files except Xcode projects or bootstrap folders ---
function copyTemplate(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip Xcode projects and iOS bootstrap folders
    if (entry.name.endsWith(".xcodeproj") || entry.name === "ios-bootstrap") continue;

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyTemplate(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log(chalk.blue(`📦 Creating new project from template: ${templateName}`));
copyTemplate(templatePath, targetDir);

// --- Auto dependency installation ---
const spinner = ora(`Installing dependencies for ${chalk.green(projectName)}...`).start();

function installDeps(dir) {
  const pkgPath = path.join(dir, "package.json");
  if (fs.existsSync(pkgPath)) {
    console.log(chalk.cyan(`\n🔧 Installing dependencies in ${dir}`));
    execSync("npm install", { cwd: dir, stdio: "inherit" });
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

// --- Final success message ---
console.log(chalk.greenBright(`\n🚀 Project created successfully: ${projectName}`));
console.log(chalk.gray(`📂 Location: ${targetDir}`));
console.log(chalk.cyan(`\nNext steps:`));
console.log(chalk.white(`  cd ${targetDir}`));
console.log(chalk.white(`  open Xcode and create your iOS project manually`));
console.log(chalk.white(`  or continue building your Firebase backend first`));
console.log(chalk.white(`\n✨ Happy building with Foundry Core!`));
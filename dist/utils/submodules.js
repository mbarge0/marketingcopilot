"use strict";
/**
 * Foundry Submodule Loader
 * Dynamically detects and initializes submodules under /submodules.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSubmodules = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const loadSubmodules = (baseDir = path_1.default.resolve(__dirname, "..", "submodules")) => {
    if (!fs_1.default.existsSync(baseDir))
        return [];
    const modules = fs_1.default.readdirSync(baseDir).filter((f) => {
        const fullPath = path_1.default.join(baseDir, f);
        return fs_1.default.lstatSync(fullPath).isDirectory();
    });
    const loaded = [];
    for (const mod of modules) {
        const manifestPath = path_1.default.join(baseDir, mod, "manifest.json");
        if (fs_1.default.existsSync(manifestPath)) {
            try {
                const data = JSON.parse(fs_1.default.readFileSync(manifestPath, "utf8"));
                loaded.push({ ...data, name: mod });
            }
            catch (e) {
                console.warn(`⚠️  Could not parse manifest for submodule: ${mod}`);
            }
        }
    }
    console.log(`🧩 Foundry Core loaded ${loaded.length} submodules:`, loaded.map((m) => m.name).join(", "));
    return loaded;
};
exports.loadSubmodules = loadSubmodules;

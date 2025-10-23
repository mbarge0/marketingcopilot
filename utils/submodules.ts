/**
 * Foundry Submodule Loader
 * Dynamically detects and initializes submodules under /submodules.
 */

import fs from "fs";
import path from "path";

export type SubmoduleMeta = {
    name: string;
    version: string;
    description?: string;
    entry?: string;
};

export const loadSubmodules = (baseDir = path.resolve(__dirname, "..", "submodules")): SubmoduleMeta[] => {
    if (!fs.existsSync(baseDir)) return [];

    const modules = fs.readdirSync(baseDir).filter((f) => {
        const fullPath = path.join(baseDir, f);
        return fs.lstatSync(fullPath).isDirectory();
    });

    const loaded: SubmoduleMeta[] = [];

    for (const mod of modules) {
        const manifestPath = path.join(baseDir, mod, "manifest.json");
        if (fs.existsSync(manifestPath)) {
            try {
                const data = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
                loaded.push({ ...data, name: mod });
            } catch (e) {
                console.warn(`⚠️  Could not parse manifest for submodule: ${mod}`);
            }
        }
    }

    console.log(`🧩 Foundry Core loaded ${loaded.length} submodules:`, loaded.map((m) => m.name).join(", "));
    return loaded;
};
# Foundry Utilities

The `utils` directory contains maintenance and helper scripts used by the Foundry Core system.

## Typical Files
- `auto-update-core.js` → Sync improvements from projects back into Foundry Core.
- `version-sync.json` → Tracks version alignment between templates and submodules.
- `env-helper.js` → Validates .env setup, ensures all required keys exist.
- `diff-tools.js` → CLI comparison helpers for sync-up command.

## Next Steps
- Add `env-helper.js` to standardize .env variable validation.
- Create `auto-update-core.js` for merging upstream changes from projects.
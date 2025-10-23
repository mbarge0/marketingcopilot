# Foundry Templates

This folder contains stack-specific project templates.

## Purpose
Each template represents a preconfigured environment setup for a major stack:
- `ios-swift/` → Native iOS SwiftUI
- `web-firebase/` → Web app with Firebase backend
- `web-supabase/` → Web app with Supabase backend
- `rn-expo/` → Cross-platform React Native app

## Usage
When you run:
npx foundry init –stack ios-swift
Foundry copies the appropriate template folder, merges in any selected submodules,
and runs setup scripts automatically.

## Next Steps
- Create minimal `web-firebase` and `ios-swift` templates.
- Link Firebase and OpenAI setup scripts from `core/scripts`.
# Foundry Submodules

Submodules are modular feature packs that can be plugged into any Foundry template.

## Purpose
Provide reusable logic for common app capabilities:
- `ai-agent/` → OpenAI-powered assistants and response generation.
- `messaging/` → Realtime chat infrastructure and presence management.
- `auth/` → Authentication and profile logic.
- `storage/` → File upload and retrieval helpers.

## Next Steps
- Extract AI agent functions (`askAI`, `generateSmartReplies`) from WorldChat into `submodules/ai-agent/`.
- Add Firestore presence + read receipts to `submodules/messaging/`.
- Document each module’s dependencies in its own `manifest.json`.
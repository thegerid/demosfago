# Demo SFA Go Project Map

## Canonical Entry

- Root entry: `index.html`
- Default flow: `meetings`

## Canonical Modules

- `meetings/`
  - Canonical unified meetings screen for the project.
  - Contains meeting cards, tabs, search, side menu and meeting status transitions.
  - Opens linked standalone flows for product and meeting transfer.
  - Contains the canonical in-place call bottom sheet opened over the meetings list.
  - Contains the canonical in-place SMS bottom sheet opened over the meetings list.

- `debit-card/`
  - Canonical standalone debit-card product flow.
  - Opened from `meetings/` for a specific meeting.
  - Returns completion status back into the shared meetings store.

- `sms/`
  - Standalone mirror of the SMS block for direct opening and isolated review.
  - Not the primary SMS entry point from `meetings/`.

- `meeting-transfer/`
  - Standalone transfer-meeting flow for a selected meeting.
  - Opened from `meetings/`.
  - Writes transfer result back into the shared meetings store.

- `acts/`
  - Canonical `Акты` module.
  - Opened from the shared side menu.

- `no-answer/`
  - Shared flow for the `Не дозвонился` action.
  - Reused from the meetings module without merging it into product flows.

- `shared/meetings-store.js`
  - Shared local-storage state for meetings.
  - Keeps linked modules consistent without tying them into one file.

## Navigation Contract

- `meetings` is the canonical `Встречи` screen.
- Product flow is `debit-card`, not the meetings screen.
- SMS and transfer flows are project-linked, but live in separate folders.
- The primary call interaction for meeting cards lives inside `meetings/` as a local bottom sheet over the meetings background.
- The primary SMS interaction for meeting cards lives inside `meetings/` as a local bottom sheet over the meetings background.
- Cross-module navigation uses direct module routes inside the project.
- The side menu must stay visually and behaviorally identical across all modules that expose the burger button.

## State Contract

- Meeting data is seeded from the meetings screen DOM into `shared/meetings-store.js`.
- `meetings/` reads that store on load and applies address, time and status back onto cards.
- `meeting-transfer/` updates the selected meeting in the shared store.
- `debit-card/` marks the selected meeting as completed in the shared store before returning to `meetings/`.

## Cleanup Rule

- New flows should get separate folders only if they are standalone project flows.
- Product-specific logic must not be stored inside the canonical meetings module when it can live in its own flow folder.

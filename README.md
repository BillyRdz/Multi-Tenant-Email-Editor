# PartnerPulse — Multi-Tenant Email Design System

A visual email editor for building and previewing multi-brand email templates with dynamic partner theming. Built for teams managing emails across multiple delivery partners in Salesforce Marketing Cloud (SFMC).

**Live demo:** https://billyrdz.github.io/Multi-Tenant-Email-Editor/

## Features

- **17 sample partners** with full brand tokens. They are made-up loyalty programs (airlines, hotels, cards, retailers), not real brands
- **Canvas model** — drag components from the library or use the Add button, reorder blocks, edit per-instance content
- **Dynamic style tokens** — arbitrary key-value pairs per partner (colors, fonts, spacing, etc.)
- **AMPscript variable syntax** — `%%=v(@variable)=%%` for direct SFMC compatibility
- **Two-category variable system** — style tokens auto-replace from partner; content variables are editable per canvas instance
- **SFMC Export** — style tokens replaced, content variables preserved as AMPscript for personalization
- **Developer Mode** — Monaco code editor with auto-detected variable chips (style vs content)
- **Manage Partners** — expandable token editor with color swatches, duplicate key validation, save/discard
- **Partner contrast check** — the Theme panel tests each partner's palette against WCAG AA (4.5:1) and flags the color pairs that fail
- **Keyboard accessible** — add, select, reorder, and remove blocks without a mouse; modals trap focus and close on Escape
- **Neutral gray workspace** — the editor chrome is gray and ink only, so each partner's colors are the only color on screen
- **Version Manager** — save/load named snapshots of canvas state
- **Confirm + Undo** — math problem confirmation on all deletes, undo toast to restore
- **Desktop/Mobile preview toggle**
- **localStorage persistence** — a Supabase adapter exists in `src/lib` but is not wired into the store yet

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Zustand (state management)
- Monaco Editor (code editing)
- Lucide React (icons)
- Vitest + Testing Library + axe-core (123 tests)
- GitHub Actions (lint, test, build, deploy to GitHub Pages)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Testing

```bash
npm test        # 123 unit and component tests
npm run lint    # ESLint, including the React hooks rules
npm run build   # type check and production build
```

The same three commands run in CI on every push and pull request.

## Accessibility

The editor targets WCAG 2.1 AA.

- Everything works from the keyboard. Blocks have Add, Move up, Move down, and Remove buttons next to drag and drop, and the partner picker is a listbox with arrow-key support.
- Modals move focus in, keep Tab inside, close on Escape, and return focus to the button that opened them (`src/hooks/useModalDialog.ts`).
- Fields, icon buttons, and toggles have accessible names and states.
- UI text meets 4.5:1 contrast on every surface, and there is a visible focus ring.
- `src/App.a11y.test.tsx` runs axe-core against the app on every test run. A scan with axe-core in Chrome reports no WCAG 2.1 A or AA violations across the main view and each modal.

The same standard applies to the emails: `src/utils/contrast.ts` checks each partner's palette, and a test fails if a sample partner drops below 4.5:1.

## Deployment

`.github/workflows/ci.yml` builds the app and publishes it to GitHub Pages on every push to the default branch.

One-time setup: in the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**.

## Project Structure

```
src/
  types/index.ts              # Core type system (Partner, EmailComponent, CanvasInstance, etc.)
  utils/templateEngine.ts     # AMPscript variable extraction, classification, rendering
  utils/contrast.ts           # WCAG contrast ratio and the per-partner palette check
  store/useStore.ts           # Zustand store (partners, components, canvas, versions)
  data/
    defaultPartners.ts        # 17 sample partners (made up), migrated from legacy schema to dynamic tokens
    defaultComponents.ts      # 5 email components (header, body, RA card, CTA, footer)
    defaultPreviewWrapper.ts  # HTML email wrapper template
    migrations.ts             # Legacy fixed schema to dynamic token migration
  hooks/
    useDeleteWithUndo.ts      # Confirm + undo pattern for all destructive operations
    useModalDialog.ts         # Focus trap, Escape to close, and focus return for modals
  lib/
    supabase.ts               # Supabase client setup (not wired in yet)
    persistence.ts            # Persistence adapter: Supabase primary, localStorage fallback (not wired in yet)
    supabase-schema.sql       # Database schema for 4 tables
  components/
    layout/                   # AppShell, Panel
    library/                  # ComponentLibrary, ComponentCard, PartnerDropdown
    canvas/                   # Canvas (droppable zone), CanvasBlock (instance preview)
    inspector/                # Inspector, ContentFieldEditor
    preview/                  # EmailPreview (iframe), SFMCExportTab
    modals/                   # DeveloperMode, ManagePartners, PartnerTokenEditor, Settings, ConfirmModal, ComponentEditor
    shared/                   # UndoToast, VersionManager, ThemeInspector
```

## How It Works

1. **Components** use `%%=v(@variableName)=%%` AMPscript syntax for all dynamic values
2. **Variables are classified** into style tokens (matched against partner tokens) and content variables (everything else)
3. **Preview rendering** replaces ALL variables — style tokens from the active partner, content values from user input
4. **SFMC export** replaces ONLY style tokens, preserving content variables as `%%=v(@var)=%%` for SFMC personalization
5. **Switching partners** instantly re-themes the entire email with that brand's tokens

## Supabase (Not Wired In Yet)

The store currently saves to localStorage only. `src/lib/persistence.ts` is an adapter for Supabase that the store does not call yet. To finish it, load and save through that adapter in `src/store/useStore.ts`.

Add to your `.env`:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Run `src/lib/supabase-schema.sql` against your Supabase project to create the tables.

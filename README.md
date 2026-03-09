# PartnerPulse — Multi-Tenant Email Design System

A visual email editor for building and previewing multi-brand email templates with dynamic partner theming. Built for teams managing emails across multiple delivery partners in Salesforce Marketing Cloud (SFMC).

## Features

- **17 pre-loaded partners** (Grubhub, Seamless, DoorDash, Uber Eats, Deliveroo, etc.) with full brand tokens
- **Canvas model** — drag components from the library, reorder blocks, edit per-instance content
- **Dynamic style tokens** — arbitrary key-value pairs per partner (colors, fonts, spacing, etc.)
- **AMPscript variable syntax** — `%%=v(@variable)=%%` for direct SFMC compatibility
- **Two-category variable system** — style tokens auto-replace from partner; content variables are editable per canvas instance
- **SFMC Export** — style tokens replaced, content variables preserved as AMPscript for personalization
- **Developer Mode** — Monaco code editor with auto-detected variable chips (style vs content)
- **Manage Partners** — expandable token editor with color swatches, duplicate key validation, save/discard
- **Dark theme** — full dark UI via CSS custom properties
- **Version Manager** — save/load named snapshots of canvas state
- **Confirm + Undo** — math problem confirmation on all deletes, undo toast to restore
- **Desktop/Mobile preview toggle**
- **Supabase persistence** with localStorage fallback

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Zustand (state management)
- Monaco Editor (code editing)
- Lucide React (icons)
- Vitest + Testing Library (78 tests)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Testing

```bash
npm test
```

## Project Structure

```
src/
  types/index.ts              # Core type system (Partner, EmailComponent, CanvasInstance, etc.)
  utils/templateEngine.ts     # AMPscript variable extraction, classification, rendering
  store/useStore.ts           # Zustand store (partners, components, canvas, versions)
  data/
    defaultPartners.ts        # 17 partners migrated from legacy schema to dynamic tokens
    defaultComponents.ts      # 5 email components (header, body, RA card, CTA, footer)
    defaultPreviewWrapper.ts  # HTML email wrapper template
    migrations.ts             # Legacy fixed schema to dynamic token migration
  hooks/
    useDeleteWithUndo.ts      # Confirm + undo pattern for all destructive operations
  lib/
    supabase.ts               # Supabase client setup
    persistence.ts            # Persistence abstraction (Supabase primary, localStorage fallback)
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

## Supabase Setup (Optional)

Add to your `.env`:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Run `src/lib/supabase-schema.sql` against your Supabase project to create the tables. Without Supabase configured, the app falls back to localStorage.

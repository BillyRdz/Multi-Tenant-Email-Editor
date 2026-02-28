import { useMemo } from 'react';
import { useStore } from './store/useStore';
import { renderFullEmail } from './utils/renderEmail';
import { PartnerSwitcher } from './components/PartnerSwitcher';
import { EmailPreview } from './components/EmailPreview';
import { ComponentRegistry } from './components/ComponentRegistry';
import { RACardEditor } from './components/RACardEditor';
import { VersionManager } from './components/VersionManager';
import { ExportPanel } from './components/ExportPanel';
import { ThemeInspector } from './components/ThemeInspector';
import { PartnerEditor } from './components/PartnerEditor';

function App() {
  const store = useStore();

  const emailHtml = useMemo(
    () =>
      renderFullEmail(
        store.components,
        store.activeComponentIds,
        store.activePartner,
        store.raCardData,
        store.raCards
      ),
    [store.components, store.activeComponentIds, store.activePartner, store.raCardData, store.raCards]
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-lg font-bold text-gray-900 shrink-0">
              PartnerPulse
            </h1>
            <span className="text-xs text-gray-400 shrink-0">Email Design System Manager</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <PartnerSwitcher
              partners={store.partners}
              activePartnerId={store.activePartnerId}
              onSelect={store.setActivePartnerId}
            />
            <PartnerEditor
              partners={store.partners}
              activePartnerId={store.activePartnerId}
              onUpdatePartner={store.updatePartner}
              onCreatePartner={store.createPartner}
              onDeletePartner={store.deletePartner}
            />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_320px] gap-6">
          {/* Left Panel - Component Registry + RA Card Editor */}
          <aside className="space-y-6 order-2 lg:order-1">
            <ComponentRegistry
              components={store.components}
              activeComponentIds={store.activeComponentIds}
              onToggle={store.toggleComponentActive}
              onCreate={store.createComponent}
              onUpdate={store.updateComponent}
              onDelete={store.deleteComponent}
              onReorder={store.reorderActiveComponents}
            />
            <RACardEditor
              cards={store.raCards}
              onAdd={store.addRACard}
              onUpdate={store.updateRACard}
              onRemove={store.removeRACard}
            />
          </aside>

          {/* Center - Preview */}
          <main className="order-1 lg:order-2 min-h-[600px]">
            <EmailPreview html={emailHtml} />
          </main>

          {/* Right Panel - Theme Inspector + Versions + Export */}
          <aside className="space-y-6 order-3">
            <ThemeInspector theme={store.activePartner} />
            <VersionManager
              versions={store.versions}
              partners={store.partners}
              onSave={store.saveVersion}
              onLoad={store.loadVersion}
              onDelete={store.deleteVersion}
            />
            <ExportPanel html={emailHtml} />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;

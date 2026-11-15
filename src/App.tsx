import { useState, useMemo, useCallback } from 'react';
import { useStore } from './store/useStore';
import { useDeleteWithUndo } from './hooks/useDeleteWithUndo';
import { renderForPreview, wrapBlockForPreview } from './utils/templateEngine';
import { AppShell } from './components/layout/AppShell';
import { PartnerDropdown } from './components/library/PartnerDropdown';
import { ComponentLibrary } from './components/library/ComponentLibrary';
import { Canvas } from './components/canvas/Canvas';
import { Inspector } from './components/inspector/Inspector';
import { EmailPreview } from './components/preview/EmailPreview';
import { SFMCExportTab } from './components/preview/SFMCExportTab';
import { ThemeInspector } from './components/shared/ThemeInspector';
import { VersionManager } from './components/shared/VersionManager';
import { UndoToast } from './components/shared/UndoToast';
import { ConfirmModal } from './components/modals/ConfirmModal';
import { DeveloperModeModal } from './components/modals/DeveloperModeModal';
import { ManagePartnersModal } from './components/modals/ManagePartnersModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { Code, Users, Settings as SettingsIcon } from 'lucide-react';

function App() {
  const store = useStore();
  const activePartner = useStore(s => s.partners.find(p => p.id === s.activePartnerId) || s.partners[0]);
  const { requestDelete, modalProps, toastProps } = useDeleteWithUndo(store);

  const [devModeOpen, setDevModeOpen] = useState(false);
  const [partnersModalOpen, setPartnersModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Build full email preview
  const emailHtml = useMemo(() => {
    const sortedInstances = [...store.canvas.instances].sort((a, b) => a.order - b.order);
    const bodyHtml = sortedInstances
      .map(inst => {
        const comp = store.components.find(c => c.id === inst.componentId);
        if (!comp) return '';
        return wrapBlockForPreview(inst.id, renderForPreview(comp.html, activePartner, inst.contentValues));
      })
      .filter(Boolean)
      .join('\n');

    return store.canvas.previewWrapper.replace('%%CANVAS_CONTENT%%', bodyHtml);
  }, [store.canvas, store.components, activePartner]);

  // Selected instance for inspector
  const selectedInstance = store.canvas.instances.find(i => i.id === store.selectedInstanceId) || null;
  const selectedComponent = selectedInstance
    ? store.components.find(c => c.id === selectedInstance.componentId) || null
    : null;

  // Delete handlers
  const handleDeleteComponent = useCallback((id: string) => {
    const comp = store.components.find(c => c.id === id);
    requestDelete({ type: 'component', id, label: comp?.name || 'component' });
  }, [store.components, requestDelete]);

  const handleRemoveInstance = useCallback((id: string) => {
    const inst = store.canvas.instances.find(i => i.id === id);
    const comp = inst ? store.components.find(c => c.id === inst.componentId) : null;
    requestDelete({ type: 'instance', id, label: comp?.name || 'block' });
  }, [store.canvas.instances, store.components, requestDelete]);

  const handleDeleteVersion = useCallback((id: string) => {
    const version = store.versions.find(v => v.id === id);
    requestDelete({ type: 'version', id, label: version?.name || 'version' });
  }, [store.versions, requestDelete]);

  const handleDeletePartner = useCallback((id: string) => {
    const partner = store.partners.find(p => p.id === id);
    requestDelete({ type: 'partner', id, label: partner?.name || 'partner' });
  }, [store.partners, requestDelete]);

  // Header
  const toolbarButton = 'flex items-center gap-1.5 rounded px-2.5 py-1.5 text-sm hover:bg-[var(--bg-hover)]';
  const header = (
    <div className="flex min-h-12 flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1.5">
      <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
        PartnerPulse
      </h1>
      <span aria-hidden="true" className="h-5 w-px" style={{ backgroundColor: 'var(--border-secondary)' }} />
      <PartnerDropdown
        partners={store.partners}
        activePartnerId={store.activePartnerId}
        onSelect={store.setActivePartnerId}
      />
      <div className="flex-1" />
      <div className="flex gap-1">
        <button
          onClick={() => setDevModeOpen(true)}
          className={toolbarButton}
          style={{ color: 'var(--text-primary)' }}
          title="Developer Mode"
        >
          <Code size={14} />
          Dev
        </button>
        <button
          onClick={() => setPartnersModalOpen(true)}
          className={toolbarButton}
          style={{ color: 'var(--text-primary)' }}
          title="Manage Partners"
        >
          <Users size={14} />
          Partners
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          className={toolbarButton}
          style={{ color: 'var(--text-primary)' }}
          title="Settings"
          aria-label="Settings"
        >
          <SettingsIcon size={14} />
        </button>
      </div>
    </div>
  );

  // Left: what the email is made of
  const left = (
    <>
      <ComponentLibrary
        components={store.components}
        onDragStart={() => {}}
        onAdd={store.addInstance}
      />
      <Canvas
        instances={store.canvas.instances}
        components={store.components}
        partner={activePartner}
        selectedInstanceId={store.selectedInstanceId}
        onSelectInstance={store.selectInstance}
        onDropComponent={store.addInstance}
        onReorder={store.reorderInstances}
        onRemoveInstance={handleRemoveInstance}
      />
    </>
  );

  // Center: the email itself
  const center = (
    <EmailPreview
      html={emailHtml}
      selectedInstanceId={store.selectedInstanceId}
      onSelectInstance={store.selectInstance}
    />
  );

  // Right: the selected block, the partner's theme, and output
  const right = (
    <>
      <Inspector
        instance={selectedInstance}
        component={selectedComponent}
        partner={activePartner}
        onUpdateContent={store.updateInstanceContent}
      />
      <ThemeInspector partner={activePartner} />
      <VersionManager
        versions={store.versions}
        onSave={store.saveVersion}
        onLoad={store.loadVersion}
        onDelete={handleDeleteVersion}
      />
      <SFMCExportTab
        instances={store.canvas.instances}
        components={store.components}
        partner={activePartner}
        previewWrapper={store.canvas.previewWrapper}
      />
    </>
  );

  return (
    <>
      <AppShell header={header} left={left} center={center} right={right} />

      {/* Modals */}
      <DeveloperModeModal
        isOpen={devModeOpen}
        onClose={() => setDevModeOpen(false)}
        components={store.components}
        onCreate={store.createComponent}
        onUpdate={store.updateComponent}
        onDelete={handleDeleteComponent}
      />
      <ManagePartnersModal
        isOpen={partnersModalOpen}
        onClose={() => setPartnersModalOpen(false)}
        partners={store.partners}
        activePartnerId={store.activePartnerId}
        onCreatePartner={store.createPartner}
        onUpdatePartner={store.updatePartner}
        onDeletePartner={handleDeletePartner}
      />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        previewWrapper={store.canvas.previewWrapper}
        onUpdatePreviewWrapper={store.updatePreviewWrapper}
      />
      <ConfirmModal {...modalProps} />
      {toastProps && <UndoToast {...toastProps} />}
    </>
  );
}

export default App;

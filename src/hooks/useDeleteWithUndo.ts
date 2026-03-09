import { useState, useCallback, useRef } from 'react';
import type { Partner, EmailComponent, EmailVersion, CanvasState } from '../types';
import type { StoreSnapshot } from '../store/useStore';

interface DeleteConfig {
  type: 'component' | 'instance' | 'version' | 'partner';
  id: string;
  label: string;
}

interface StoreFunctions {
  partners: Partner[];
  components: EmailComponent[];
  versions: EmailVersion[];
  canvas: CanvasState;
  activePartnerId: string;
  deleteComponent: (id: string) => void;
  removeInstance: (id: string) => void;
  deleteVersion: (id: string) => void;
  deletePartner: (id: string) => void;
  restoreState: (snapshot: Partial<StoreSnapshot>) => void;
}

export function useDeleteWithUndo(store: StoreFunctions) {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const pendingConfig = useRef<DeleteConfig | null>(null);
  const undoSnapshot = useRef<Partial<StoreSnapshot> | null>(null);

  const requestDelete = useCallback((config: DeleteConfig) => {
    pendingConfig.current = config;
    setModalOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    const config = pendingConfig.current;
    if (!config) return;

    let snapshot: Partial<StoreSnapshot> = {};

    switch (config.type) {
      case 'component':
        snapshot = {
          components: [...store.components],
          canvas: JSON.parse(JSON.stringify(store.canvas)),
        };
        store.deleteComponent(config.id);
        break;
      case 'instance':
        snapshot = {
          canvas: JSON.parse(JSON.stringify(store.canvas)),
        };
        store.removeInstance(config.id);
        break;
      case 'version':
        snapshot = {
          versions: [...store.versions],
        };
        store.deleteVersion(config.id);
        break;
      case 'partner':
        snapshot = {
          partners: [...store.partners],
          activePartnerId: store.activePartnerId,
        };
        store.deletePartner(config.id);
        break;
    }

    undoSnapshot.current = snapshot;
    setModalOpen(false);
    setToastMessage(`Deleted "${config.label}"`);
    setToastVisible(true);
  }, [store]);

  const handleCancel = useCallback(() => {
    pendingConfig.current = null;
    setModalOpen(false);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoSnapshot.current) {
      store.restoreState(undoSnapshot.current);
      undoSnapshot.current = null;
    }
    setToastVisible(false);
  }, [store]);

  const handleToastDismiss = useCallback(() => {
    setToastVisible(false);
    undoSnapshot.current = null;
  }, []);

  const modalProps = {
    isOpen: modalOpen,
    title: pendingConfig.current
      ? `Delete ${pendingConfig.current.label}?`
      : 'Confirm Delete',
    message: pendingConfig.current
      ? `Are you sure you want to delete "${pendingConfig.current.label}"? You can undo this action briefly after confirming.`
      : '',
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  };

  const toastProps = toastVisible
    ? {
        message: toastMessage,
        onUndo: handleUndo,
        onDismiss: handleToastDismiss,
      }
    : null;

  return { requestDelete, modalProps, toastProps };
}

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDeleteWithUndo } from './useDeleteWithUndo';
import type { Partner, EmailComponent, CanvasState } from '../types';

function createMockStore(overrides = {}) {
  const mockComponent: EmailComponent = {
    id: 'comp-1',
    name: 'Test Header',
    type: 'header',
    html: '<div>Header</div>',
    detectedVariables: [],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };

  const mockPartner: Partner = {
    id: 'partner-1',
    name: 'Test Partner',
    slug: 'test-partner',
    tokens: [{ key: 'colorPrimary', value: '#000' }],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };

  const mockCanvas: CanvasState = {
    id: 'canvas-1',
    name: 'Test Canvas',
    partnerId: 'partner-1',
    instances: [
      { id: 'inst-1', componentId: 'comp-1', contentValues: {}, order: 0 },
    ],
    previewWrapper: '<html>%%CANVAS_CONTENT%%</html>',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };

  return {
    components: [mockComponent],
    canvas: mockCanvas,
    versions: [{ id: 'ver-1', name: 'v1', canvasState: mockCanvas, createdAt: '2026-01-01' }],
    partners: [mockPartner, { ...mockPartner, id: 'partner-2', name: 'Partner 2' }],
    activePartnerId: 'partner-1',
    deleteComponent: vi.fn(),
    removeInstance: vi.fn(),
    deleteVersion: vi.fn(),
    deletePartner: vi.fn(),
    restoreState: vi.fn(),
    ...overrides,
  };
}

describe('useDeleteWithUndo', () => {
  it('starts with modal closed and no toast', () => {
    const store = createMockStore();
    const { result } = renderHook(() => useDeleteWithUndo(store));
    expect(result.current.modalProps.isOpen).toBe(false);
    expect(result.current.toastProps).toBeNull();
  });

  it('opens modal on requestDelete', () => {
    const store = createMockStore();
    const { result } = renderHook(() => useDeleteWithUndo(store));

    act(() => {
      result.current.requestDelete({ type: 'component', id: 'comp-1', label: 'Test Header' });
    });

    expect(result.current.modalProps.isOpen).toBe(true);
    expect(result.current.modalProps.title).toContain('Test Header');
  });

  it('closes modal on cancel', () => {
    const store = createMockStore();
    const { result } = renderHook(() => useDeleteWithUndo(store));

    act(() => {
      result.current.requestDelete({ type: 'component', id: 'comp-1', label: 'Test Header' });
    });
    act(() => {
      result.current.modalProps.onCancel();
    });

    expect(result.current.modalProps.isOpen).toBe(false);
  });

  it('calls deleteComponent and shows toast on confirm', () => {
    const store = createMockStore();
    const { result } = renderHook(() => useDeleteWithUndo(store));

    act(() => {
      result.current.requestDelete({ type: 'component', id: 'comp-1', label: 'Test Header' });
    });
    act(() => {
      result.current.modalProps.onConfirm();
    });

    expect(store.deleteComponent).toHaveBeenCalledWith('comp-1');
    expect(result.current.modalProps.isOpen).toBe(false);
    expect(result.current.toastProps).not.toBeNull();
    expect(result.current.toastProps!.message).toContain('Test Header');
  });

  it('calls restoreState on undo', () => {
    const store = createMockStore();
    const { result } = renderHook(() => useDeleteWithUndo(store));

    act(() => {
      result.current.requestDelete({ type: 'component', id: 'comp-1', label: 'Test Header' });
    });
    act(() => {
      result.current.modalProps.onConfirm();
    });
    act(() => {
      result.current.toastProps!.onUndo();
    });

    expect(store.restoreState).toHaveBeenCalledWith(
      expect.objectContaining({ components: store.components })
    );
  });

  it('handles instance deletion', () => {
    const store = createMockStore();
    const { result } = renderHook(() => useDeleteWithUndo(store));

    act(() => {
      result.current.requestDelete({ type: 'instance', id: 'inst-1', label: 'Test Block' });
    });
    act(() => {
      result.current.modalProps.onConfirm();
    });

    expect(store.removeInstance).toHaveBeenCalledWith('inst-1');
  });

  it('handles version deletion', () => {
    const store = createMockStore();
    const { result } = renderHook(() => useDeleteWithUndo(store));

    act(() => {
      result.current.requestDelete({ type: 'version', id: 'ver-1', label: 'v1' });
    });
    act(() => {
      result.current.modalProps.onConfirm();
    });

    expect(store.deleteVersion).toHaveBeenCalledWith('ver-1');
  });

  it('handles partner deletion with snapshot including activePartnerId', () => {
    const store = createMockStore();
    const { result } = renderHook(() => useDeleteWithUndo(store));

    act(() => {
      result.current.requestDelete({ type: 'partner', id: 'partner-1', label: 'Test Partner' });
    });
    act(() => {
      result.current.modalProps.onConfirm();
    });

    expect(store.deletePartner).toHaveBeenCalledWith('partner-1');

    act(() => {
      result.current.toastProps!.onUndo();
    });

    expect(store.restoreState).toHaveBeenCalledWith({
      partners: store.partners,
      activePartnerId: 'partner-1',
    });
  });

  it('clears undo snapshot on toast dismiss', () => {
    const store = createMockStore();
    const { result } = renderHook(() => useDeleteWithUndo(store));

    act(() => {
      result.current.requestDelete({ type: 'component', id: 'comp-1', label: 'Test Header' });
    });
    act(() => {
      result.current.modalProps.onConfirm();
    });
    act(() => {
      result.current.toastProps!.onDismiss();
    });

    expect(result.current.toastProps).toBeNull();
  });
});

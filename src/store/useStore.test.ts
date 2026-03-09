import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from './useStore';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('useStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    // Reset Zustand store to initial state
    useStore.setState(useStore.getInitialState());
  });

  it('initializes with default partners', () => {
    const state = useStore.getState();
    expect(state.partners.length).toBeGreaterThan(0);
    expect(state.partners[0].name).toBe('Grubhub');
  });

  it('initializes with default components', () => {
    const state = useStore.getState();
    expect(state.components.length).toBeGreaterThan(0);
  });

  it('creates a component', () => {
    const initialCount = useStore.getState().components.length;
    useStore.getState().createComponent('New Comp', 'custom', '<div>%%=v(@headline)=%%</div>');
    expect(useStore.getState().components.length).toBe(initialCount + 1);
    const last = useStore.getState().components[useStore.getState().components.length - 1];
    expect(last.name).toBe('New Comp');
    expect(last.detectedVariables).toContain('headline');
  });

  it('deletes a component and removes canvas instances', () => {
    const state = useStore.getState();
    const firstComp = state.components[0];
    const initialCompCount = state.components.length;
    const instancesBefore = state.canvas.instances.filter(i => i.componentId === firstComp.id).length;

    useStore.getState().deleteComponent(firstComp.id);

    expect(useStore.getState().components.length).toBe(initialCompCount - 1);
    expect(useStore.getState().components.find(c => c.id === firstComp.id)).toBeUndefined();
    // Should also remove canvas instances for that component
    const instancesAfter = useStore.getState().canvas.instances.filter(i => i.componentId === firstComp.id).length;
    expect(instancesAfter).toBe(0);
    if (instancesBefore > 0) {
      expect(useStore.getState().canvas.instances.length).toBeLessThan(state.canvas.instances.length);
    }
  });

  it('updates a component', () => {
    const firstId = useStore.getState().components[0].id;
    useStore.getState().updateComponent(firstId, { name: 'Updated Name' });
    expect(useStore.getState().components.find(c => c.id === firstId)!.name).toBe('Updated Name');
  });

  it('updates detectedVariables when html changes', () => {
    const firstId = useStore.getState().components[0].id;
    useStore.getState().updateComponent(firstId, { html: '<div>%%=v(@newVar)=%% %%=v(@anotherVar)=%%</div>' });
    const comp = useStore.getState().components.find(c => c.id === firstId)!;
    expect(comp.detectedVariables).toContain('newVar');
    expect(comp.detectedVariables).toContain('anotherVar');
  });

  it('adds and removes canvas instances', () => {
    const initialCount = useStore.getState().canvas.instances.length;
    const compId = useStore.getState().components[0].id;

    const inst = useStore.getState().addInstance(compId);
    expect(useStore.getState().canvas.instances.length).toBe(initialCount + 1);
    expect(inst.componentId).toBe(compId);

    useStore.getState().removeInstance(inst.id);
    expect(useStore.getState().canvas.instances.length).toBe(initialCount);
  });

  it('reorders canvas instances', () => {
    const state = useStore.getState();
    const ids = state.canvas.instances.map(i => i.id);
    if (ids.length >= 2) {
      const reversed = [...ids].reverse();
      useStore.getState().reorderInstances(reversed);
      const newInstances = useStore.getState().canvas.instances;
      expect(newInstances[0].id).toBe(reversed[0]);
    }
  });

  it('updates instance content values', () => {
    const inst = useStore.getState().canvas.instances[0];
    if (inst) {
      useStore.getState().updateInstanceContent(inst.id, 'headline', 'New Headline');
      const updated = useStore.getState().canvas.instances.find(i => i.id === inst.id)!;
      expect(updated.contentValues.headline).toBe('New Headline');
    }
  });

  it('saves and loads versions', () => {
    const ver = useStore.getState().saveVersion('Test Version');
    expect(useStore.getState().versions.length).toBe(1);
    expect(ver.name).toBe('Test Version');
    expect(ver.canvasState).toBeDefined();

    useStore.getState().loadVersion(ver.id);
    expect(useStore.getState().activePartnerId).toBeDefined();
  });

  it('deletes versions', () => {
    const ver = useStore.getState().saveVersion('To Delete');
    useStore.getState().deleteVersion(ver.id);
    expect(useStore.getState().versions.length).toBe(0);
  });

  it('does not delete the last partner', () => {
    const partnerIds = useStore.getState().partners.map(p => p.id);
    for (const id of partnerIds) {
      useStore.getState().deletePartner(id);
    }
    expect(useStore.getState().partners.length).toBeGreaterThanOrEqual(1);
  });

  it('restores state from snapshot', () => {
    const originalComponents = [...useStore.getState().components];
    const firstId = originalComponents[0].id;

    useStore.getState().deleteComponent(firstId);
    expect(useStore.getState().components.length).toBe(originalComponents.length - 1);

    useStore.getState().restoreState({ components: originalComponents });
    expect(useStore.getState().components.length).toBe(originalComponents.length);
  });

  it('creates a partner with auto-generated id', () => {
    const initialCount = useStore.getState().partners.length;
    const partner = useStore.getState().createPartner({
      name: 'New Brand',
      slug: 'new-brand',
      tokens: [{ key: 'colorPrimary', value: '#ff0000' }],
    });
    expect(useStore.getState().partners.length).toBe(initialCount + 1);
    expect(partner.id).toBeTruthy();
    expect(useStore.getState().activePartnerId).toBe(partner.id);
  });
});

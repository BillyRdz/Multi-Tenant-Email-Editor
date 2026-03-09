import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Partner, EmailComponent, EmailVersion, CanvasInstance, CanvasState } from '../types';
import { defaultPartners } from '../data/defaultPartners';
import { defaultComponents } from '../data/defaultComponents';
import { defaultPreviewWrapper } from '../data/defaultPreviewWrapper';
import { extractVariables } from '../utils/templateEngine';

const STORAGE_PREFIX = 'partnerpulse_v2_';

function load<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

// Default canvas with one instance of each default component
function createDefaultCanvas(): CanvasState {
  const now = new Date().toISOString();
  const instances: CanvasInstance[] = defaultComponents.map((comp, idx) => ({
    id: `inst-${uuidv4()}`,
    componentId: comp.id,
    contentValues: getDefaultContentValues(comp),
    order: idx,
  }));

  return {
    id: `canvas-${uuidv4()}`,
    name: 'Default Canvas',
    partnerId: defaultPartners[0].id,
    instances,
    previewWrapper: defaultPreviewWrapper,
    createdAt: now,
    updatedAt: now,
  };
}

function getDefaultContentValues(comp: EmailComponent): Record<string, string> {
  const tokenKeys = new Set(defaultPartners[0].tokens.map(t => t.key));
  const contentVars = comp.detectedVariables.filter(v => !tokenKeys.has(v));
  const defaults: Record<string, string> = {};

  for (const v of contentVars) {
    defaults[v] = getDefaultValueForVariable(v);
  }
  return defaults;
}

function getDefaultValueForVariable(varName: string): string {
  const map: Record<string, string> = {
    headline: 'Your order is on its way!',
    bodyText: 'Great news! Your food is being prepared and will arrive soon. Track your order in the app for real-time updates.',
    ctaText: 'Track Your Order',
    ctaLink: '#',
    restaurantName: 'Bella Italia',
    restaurantRating: '★★★★½',
    restaurantDistance: '1.2 mi away',
    restaurantMessage: 'Fresh pasta made daily with locally sourced ingredients. Try our new summer menu!',
    restaurantCtaLink: 'https://example.com/order',
    restaurantImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=480&h=320&fit=crop',
    copyrightText: '© 2025 Partner. All rights reserved.',
    unsubscribeLink: '#',
    privacyLink: '#',
  };
  return map[varName] || '';
}

interface StoreState {
  // Data
  partners: Partner[];
  components: EmailComponent[];
  versions: EmailVersion[];
  canvas: CanvasState;
  activePartnerId: string;
  selectedInstanceId: string | null;

  // Computed
  activePartner: Partner;

  // Partner CRUD
  createPartner: (partner: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>) => Partner;
  updatePartner: (id: string, updates: Partial<Partner>) => void;
  deletePartner: (id: string) => void;
  setActivePartnerId: (id: string) => void;

  // Component CRUD
  createComponent: (name: string, type: string, html: string) => EmailComponent;
  updateComponent: (id: string, updates: Partial<Pick<EmailComponent, 'name' | 'type' | 'html'>>) => void;
  deleteComponent: (id: string) => void;

  // Canvas operations
  addInstance: (componentId: string) => CanvasInstance;
  removeInstance: (instanceId: string) => void;
  reorderInstances: (instanceIds: string[]) => void;
  updateInstanceContent: (instanceId: string, key: string, value: string) => void;
  selectInstance: (instanceId: string | null) => void;
  updatePreviewWrapper: (html: string) => void;

  // Version management
  saveVersion: (name: string) => EmailVersion;
  loadVersion: (versionId: string) => void;
  deleteVersion: (id: string) => void;

  // State restoration (for undo)
  restoreState: (snapshot: Partial<StoreSnapshot>) => void;
}

export interface StoreSnapshot {
  partners: Partner[];
  components: EmailComponent[];
  versions: EmailVersion[];
  canvas: CanvasState;
  activePartnerId: string;
}

const initialPartners = load<Partner[]>('partners', defaultPartners);
const initialComponents = load<EmailComponent[]>('components', defaultComponents);
const initialVersions = load<EmailVersion[]>('versions', []);
const initialCanvas = load<CanvasState>('canvas', createDefaultCanvas());
const initialActivePartnerId = load<string>('activePartnerId', defaultPartners[0].id);

export const useStore = create<StoreState>((set, get) => ({
  partners: initialPartners,
  components: initialComponents,
  versions: initialVersions,
  canvas: initialCanvas,
  activePartnerId: initialActivePartnerId,
  selectedInstanceId: null,

  get activePartner(): Partner {
    const state = get();
    return state.partners.find(p => p.id === state.activePartnerId) || state.partners[0];
  },

  // Partner CRUD
  createPartner: (data) => {
    const now = new Date().toISOString();
    const partner: Partner = {
      ...data,
      id: `partner-${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    };
    set(state => {
      const partners = [...state.partners, partner];
      save('partners', partners);
      save('activePartnerId', partner.id);
      return { partners, activePartnerId: partner.id };
    });
    return partner;
  },

  updatePartner: (id, updates) => {
    set(state => {
      const partners = state.partners.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      save('partners', partners);
      return { partners };
    });
  },

  deletePartner: (id) => {
    set(state => {
      const filtered = state.partners.filter(p => p.id !== id);
      if (filtered.length === 0) return state;
      const partners = filtered;
      const activePartnerId = state.activePartnerId === id ? partners[0].id : state.activePartnerId;
      save('partners', partners);
      save('activePartnerId', activePartnerId);
      return { partners, activePartnerId };
    });
  },

  setActivePartnerId: (id) => {
    save('activePartnerId', id);
    set({ activePartnerId: id });
  },

  // Component CRUD
  createComponent: (name, type, html) => {
    const now = new Date().toISOString();
    const comp: EmailComponent = {
      id: `comp-${uuidv4()}`,
      name,
      type,
      html,
      detectedVariables: extractVariables(html),
      createdAt: now,
      updatedAt: now,
    };
    set(state => {
      const components = [...state.components, comp];
      save('components', components);
      return { components };
    });
    return comp;
  },

  updateComponent: (id, updates) => {
    set(state => {
      const components = state.components.map(c => {
        if (c.id !== id) return c;
        const updated = { ...c, ...updates, updatedAt: new Date().toISOString() };
        if (updates.html !== undefined) {
          updated.detectedVariables = extractVariables(updates.html);
        }
        return updated;
      });
      save('components', components);
      return { components };
    });
  },

  deleteComponent: (id) => {
    set(state => {
      const components = state.components.filter(c => c.id !== id);
      const canvas = {
        ...state.canvas,
        instances: state.canvas.instances
          .filter(inst => inst.componentId !== id)
          .map((inst, idx) => ({ ...inst, order: idx })),
        updatedAt: new Date().toISOString(),
      };
      save('components', components);
      save('canvas', canvas);
      return { components, canvas };
    });
  },

  // Canvas operations
  addInstance: (componentId) => {
    const comp = get().components.find(c => c.id === componentId);
    const instance: CanvasInstance = {
      id: `inst-${uuidv4()}`,
      componentId,
      contentValues: comp ? getDefaultContentValues(comp) : {},
      order: get().canvas.instances.length,
    };
    set(state => {
      const canvas = {
        ...state.canvas,
        instances: [...state.canvas.instances, instance],
        updatedAt: new Date().toISOString(),
      };
      save('canvas', canvas);
      return { canvas };
    });
    return instance;
  },

  removeInstance: (instanceId) => {
    set(state => {
      const canvas = {
        ...state.canvas,
        instances: state.canvas.instances
          .filter(i => i.id !== instanceId)
          .map((inst, idx) => ({ ...inst, order: idx })),
        updatedAt: new Date().toISOString(),
      };
      const selectedInstanceId = state.selectedInstanceId === instanceId ? null : state.selectedInstanceId;
      save('canvas', canvas);
      return { canvas, selectedInstanceId };
    });
  },

  reorderInstances: (instanceIds) => {
    set(state => {
      const instanceMap = new Map(state.canvas.instances.map(i => [i.id, i]));
      const instances = instanceIds
        .map((id, idx) => {
          const inst = instanceMap.get(id);
          return inst ? { ...inst, order: idx } : null;
        })
        .filter((i): i is CanvasInstance => i !== null);
      const canvas = { ...state.canvas, instances, updatedAt: new Date().toISOString() };
      save('canvas', canvas);
      return { canvas };
    });
  },

  updateInstanceContent: (instanceId, key, value) => {
    set(state => {
      const canvas = {
        ...state.canvas,
        instances: state.canvas.instances.map(i =>
          i.id === instanceId
            ? { ...i, contentValues: { ...i.contentValues, [key]: value } }
            : i
        ),
        updatedAt: new Date().toISOString(),
      };
      save('canvas', canvas);
      return { canvas };
    });
  },

  selectInstance: (instanceId) => set({ selectedInstanceId: instanceId }),

  updatePreviewWrapper: (html) => {
    set(state => {
      const canvas = { ...state.canvas, previewWrapper: html, updatedAt: new Date().toISOString() };
      save('canvas', canvas);
      return { canvas };
    });
  },

  // Version management
  saveVersion: (name) => {
    const state = get();
    const version: EmailVersion = {
      id: `ver-${uuidv4()}`,
      name,
      canvasState: JSON.parse(JSON.stringify(state.canvas)),
      createdAt: new Date().toISOString(),
    };
    set(s => {
      const versions = [...s.versions, version];
      save('versions', versions);
      return { versions };
    });
    return version;
  },

  loadVersion: (versionId) => {
    const state = get();
    const version = state.versions.find(v => v.id === versionId);
    if (!version) return;
    const canvas = JSON.parse(JSON.stringify(version.canvasState));
    save('canvas', canvas);
    save('activePartnerId', canvas.partnerId);
    set({ canvas, activePartnerId: canvas.partnerId, selectedInstanceId: null });
  },

  deleteVersion: (id) => {
    set(state => {
      const versions = state.versions.filter(v => v.id !== id);
      save('versions', versions);
      return { versions };
    });
  },

  // State restoration
  restoreState: (snapshot) => {
    set(() => {
      const newState: Partial<StoreState> = {};
      if (snapshot.partners) { newState.partners = snapshot.partners; save('partners', snapshot.partners); }
      if (snapshot.components) { newState.components = snapshot.components; save('components', snapshot.components); }
      if (snapshot.versions) { newState.versions = snapshot.versions; save('versions', snapshot.versions); }
      if (snapshot.canvas) { newState.canvas = snapshot.canvas; save('canvas', snapshot.canvas); }
      if (snapshot.activePartnerId) { newState.activePartnerId = snapshot.activePartnerId; save('activePartnerId', snapshot.activePartnerId); }
      return newState;
    });
  },
}));

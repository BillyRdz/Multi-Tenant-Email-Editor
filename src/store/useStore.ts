import { useState, useEffect, useCallback } from 'react';
import type { PartnerTheme, EmailComponent, EmailVersion, RACardData } from '../types';
import { defaultPartners } from '../data/partners';
import { defaultComponents } from '../data/components';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  partners: 'partnerpulse_partners',
  components: 'partnerpulse_components',
  versions: 'partnerpulse_versions',
  activePartnerId: 'partnerpulse_active_partner',
  activeComponentIds: 'partnerpulse_active_components',
  raCardData: 'partnerpulse_ra_card_data',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

const defaultRACardData: RACardData = {
  name: 'Bella Italia',
  rating: 4.5,
  milesAway: 1.2,
  message: 'Fresh pasta made daily with locally sourced ingredients. Try our new summer menu!',
  ctaLink: 'https://example.com/order',
  imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=480&h=320&fit=crop',
};

export function useStore() {
  const [partners] = useState<PartnerTheme[]>(() =>
    loadFromStorage(STORAGE_KEYS.partners, defaultPartners)
  );
  const [components, setComponents] = useState<EmailComponent[]>(() =>
    loadFromStorage(STORAGE_KEYS.components, defaultComponents)
  );
  const [versions, setVersions] = useState<EmailVersion[]>(() =>
    loadFromStorage(STORAGE_KEYS.versions, [])
  );
  const [activePartnerId, setActivePartnerId] = useState<string>(() =>
    loadFromStorage(STORAGE_KEYS.activePartnerId, defaultPartners[0].id)
  );
  const [activeComponentIds, setActiveComponentIds] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.activeComponentIds, defaultComponents.map(c => c.id))
  );
  const [raCardData, setRACardData] = useState<RACardData>(() =>
    loadFromStorage(STORAGE_KEYS.raCardData, defaultRACardData)
  );

  // Persist to localStorage on change
  useEffect(() => saveToStorage(STORAGE_KEYS.partners, partners), [partners]);
  useEffect(() => saveToStorage(STORAGE_KEYS.components, components), [components]);
  useEffect(() => saveToStorage(STORAGE_KEYS.versions, versions), [versions]);
  useEffect(() => saveToStorage(STORAGE_KEYS.activePartnerId, activePartnerId), [activePartnerId]);
  useEffect(() => saveToStorage(STORAGE_KEYS.activeComponentIds, activeComponentIds), [activeComponentIds]);
  useEffect(() => saveToStorage(STORAGE_KEYS.raCardData, raCardData), [raCardData]);

  const activePartner = partners.find(p => p.id === activePartnerId) || partners[0];

  // Component CRUD
  const createComponent = useCallback((name: string, type: EmailComponent['type'], html: string) => {
    const now = new Date().toISOString();
    const newComp: EmailComponent = {
      id: `comp-${uuidv4()}`,
      name,
      type,
      html,
      createdAt: now,
      updatedAt: now,
    };
    setComponents(prev => [...prev, newComp]);
    setActiveComponentIds(prev => [...prev, newComp.id]);
    return newComp;
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<Pick<EmailComponent, 'name' | 'type' | 'html'>>) => {
    setComponents(prev =>
      prev.map(c =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      )
    );
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
    setActiveComponentIds(prev => prev.filter(cid => cid !== id));
  }, []);

  const toggleComponentActive = useCallback((id: string) => {
    setActiveComponentIds(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  }, []);

  const reorderActiveComponents = useCallback((newOrder: string[]) => {
    setActiveComponentIds(newOrder);
  }, []);

  // Version management
  const saveVersion = useCallback((name: string) => {
    const version: EmailVersion = {
      id: `ver-${uuidv4()}`,
      name,
      partnerId: activePartnerId,
      componentIds: [...activeComponentIds],
      raCardData: { ...raCardData },
      createdAt: new Date().toISOString(),
    };
    setVersions(prev => [...prev, version]);
    return version;
  }, [activePartnerId, activeComponentIds, raCardData]);

  const loadVersion = useCallback((versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return;
    setActivePartnerId(version.partnerId);
    setActiveComponentIds(version.componentIds);
    if (version.raCardData) setRACardData(version.raCardData);
  }, [versions]);

  const deleteVersion = useCallback((id: string) => {
    setVersions(prev => prev.filter(v => v.id !== id));
  }, []);

  return {
    partners,
    components,
    versions,
    activePartner,
    activePartnerId,
    activeComponentIds,
    raCardData,
    setActivePartnerId,
    setRACardData,
    createComponent,
    updateComponent,
    deleteComponent,
    toggleComponentActive,
    reorderActiveComponents,
    saveVersion,
    loadVersion,
    deleteVersion,
  };
}

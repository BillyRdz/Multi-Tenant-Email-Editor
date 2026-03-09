import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import type { Partner, EmailComponent, CanvasState, EmailVersion } from '../types';

// Persistence abstraction: Supabase primary, localStorage fallback
// All methods are async-safe and gracefully fall back

const LS_PREFIX = 'partnerpulse_v2_';

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet<T>(key: string, value: T) {
  localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
}

// --- Partners ---

export async function loadPartners(fallback: Partner[]): Promise<Partner[]> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client.from('partners').select('*').order('name');
    if (!error && data && data.length > 0) {
      return data.map(row => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        tokens: row.tokens || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  }
  return lsGet('partners', fallback);
}

export async function savePartners(partners: Partner[]): Promise<void> {
  lsSet('partners', partners);
  const client = getSupabaseClient();
  if (client) {
    for (const p of partners) {
      await client.from('partners').upsert({
        id: p.id,
        name: p.name,
        slug: p.slug,
        tokens: p.tokens,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
      });
    }
  }
}

// --- Components ---

export async function loadComponents(fallback: EmailComponent[]): Promise<EmailComponent[]> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client.from('email_components').select('*').order('name');
    if (!error && data && data.length > 0) {
      return data.map(row => ({
        id: row.id,
        name: row.name,
        type: row.type,
        html: row.html,
        detectedVariables: row.detected_variables || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }
  }
  return lsGet('components', fallback);
}

export async function saveComponents(components: EmailComponent[]): Promise<void> {
  lsSet('components', components);
  const client = getSupabaseClient();
  if (client) {
    for (const c of components) {
      await client.from('email_components').upsert({
        id: c.id,
        name: c.name,
        type: c.type,
        html: c.html,
        detected_variables: c.detectedVariables,
        created_at: c.createdAt,
        updated_at: c.updatedAt,
      });
    }
  }
}

// --- Canvas ---

export async function loadCanvas(fallback: CanvasState): Promise<CanvasState> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client.from('canvas_states').select('*').order('updated_at', { ascending: false }).limit(1).single();
    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        partnerId: data.partner_id,
        instances: data.instances || [],
        previewWrapper: data.preview_wrapper || fallback.previewWrapper,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  }
  return lsGet('canvas', fallback);
}

export async function saveCanvas(canvas: CanvasState): Promise<void> {
  lsSet('canvas', canvas);
  const client = getSupabaseClient();
  if (client) {
    await client.from('canvas_states').upsert({
      id: canvas.id,
      name: canvas.name,
      partner_id: canvas.partnerId,
      instances: canvas.instances,
      preview_wrapper: canvas.previewWrapper,
      created_at: canvas.createdAt,
      updated_at: canvas.updatedAt,
    });
  }
}

// --- Versions ---

export async function loadVersions(): Promise<EmailVersion[]> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client.from('versions').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map(row => ({
        id: row.id,
        name: row.name,
        canvasState: row.canvas_snapshot,
        createdAt: row.created_at,
      }));
    }
  }
  return lsGet('versions', []);
}

export async function saveVersions(versions: EmailVersion[]): Promise<void> {
  lsSet('versions', versions);
  const client = getSupabaseClient();
  if (client) {
    for (const v of versions) {
      await client.from('versions').upsert({
        id: v.id,
        name: v.name,
        canvas_snapshot: v.canvasState,
        created_at: v.createdAt,
      });
    }
  }
}

// --- Supabase status ---

export { isSupabaseConfigured };

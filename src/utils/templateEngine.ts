import type { Partner } from '../types';

// Matches %%=v(@variableName)=%%
const VARIABLE_PATTERN = /%%=v\(@(\w+)\)=%%/g;

export function extractVariables(html: string): string[] {
  const matches = new Set<string>();
  let match;
  const re = new RegExp(VARIABLE_PATTERN.source, VARIABLE_PATTERN.flags);
  while ((match = re.exec(html)) !== null) {
    matches.add(match[1]);
  }
  return Array.from(matches);
}

export function classifyVariables(
  vars: string[],
  partnerTokenKeys: string[]
): { styleVars: string[]; contentVars: string[] } {
  const tokenSet = new Set(partnerTokenKeys);
  const styleVars: string[] = [];
  const contentVars: string[] = [];

  for (const v of vars) {
    if (tokenSet.has(v)) {
      styleVars.push(v);
    } else {
      contentVars.push(v);
    }
  }

  return { styleVars, contentVars };
}

/** Wrap a variable name in AMPscript syntax */
export function ampVar(name: string): string {
  return `%%=v(@${name})=%%`;
}

export function renderForPreview(
  html: string,
  partner: Partner,
  contentValues: Record<string, string>
): string {
  const tokenMap = new Map(partner.tokens.map(t => [t.key, t.value]));

  return html.replace(new RegExp(VARIABLE_PATTERN.source, VARIABLE_PATTERN.flags), (_, varName: string) => {
    // Style tokens first
    if (tokenMap.has(varName)) {
      return tokenMap.get(varName)!;
    }
    // Then content values
    if (varName in contentValues) {
      return contentValues[varName];
    }
    // Leave unreplaced vars visible in preview
    return ampVar(varName);
  });
}

export function renderForSFMC(
  html: string,
  partner: Partner
): string {
  const tokenMap = new Map(partner.tokens.map(t => [t.key, t.value]));

  return html.replace(new RegExp(VARIABLE_PATTERN.source, VARIABLE_PATTERN.flags), (fullMatch, varName: string) => {
    // Only replace style tokens
    if (tokenMap.has(varName)) {
      return tokenMap.get(varName)!;
    }
    // Preserve content variables as %%=v(@var)=%%
    return fullMatch;
  });
}

export function minifyHtml(html: string): string {
  return html
    .replace(/<!--(?!\[if).*?-->/gs, '')
    .replace(/\n\s*/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

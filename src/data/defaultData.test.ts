import { describe, it, expect } from 'vitest';
import { defaultPartners } from './defaultPartners';
import { defaultComponents } from './defaultComponents';
import { defaultPreviewWrapper } from './defaultPreviewWrapper';

describe('defaultPartners', () => {
  it('has 17 partners', () => {
    expect(defaultPartners.length).toBe(17);
  });

  it('all partners have dynamic tokens', () => {
    for (const p of defaultPartners) {
      expect(p.tokens.length).toBeGreaterThan(0);
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.slug).toBeTruthy();
    }
  });

  it('each partner has colorPrimary token', () => {
    for (const p of defaultPartners) {
      const hasPrimary = p.tokens.some(t => t.key === 'colorPrimary');
      expect(hasPrimary).toBe(true);
    }
  });

  it('each partner has partnerName token matching name', () => {
    for (const p of defaultPartners) {
      const nameToken = p.tokens.find(t => t.key === 'partnerName');
      expect(nameToken).toBeDefined();
      expect(nameToken!.value).toBe(p.name);
    }
  });
});

describe('defaultComponents', () => {
  it('has 5 components', () => {
    expect(defaultComponents.length).toBe(5);
  });

  it('all components have detectedVariables populated', () => {
    for (const c of defaultComponents) {
      expect(c.detectedVariables.length).toBeGreaterThan(0);
    }
  });

  it('uses %%=v(@variable)=%% AMPscript syntax, not ${theme.x} syntax', () => {
    for (const c of defaultComponents) {
      expect(c.html).not.toContain('${theme.');
      expect(c.html).toMatch(/%%=v\(@\w+\)=%%/);
    }
  });

  it('header component has partnerName variable', () => {
    const header = defaultComponents.find(c => c.type === 'header');
    expect(header).toBeDefined();
    expect(header!.detectedVariables).toContain('partnerName');
  });

  it('body component has content variables', () => {
    const body = defaultComponents.find(c => c.type === 'body');
    expect(body).toBeDefined();
    expect(body!.detectedVariables).toContain('headline');
    expect(body!.detectedVariables).toContain('bodyText');
  });

  it('ra-card component has restaurant content variables', () => {
    const card = defaultComponents.find(c => c.type === 'ra-card');
    expect(card).toBeDefined();
    expect(card!.detectedVariables).toContain('restaurantName');
    expect(card!.detectedVariables).toContain('restaurantImage');
  });
});

describe('defaultPreviewWrapper', () => {
  it('contains CANVAS_CONTENT placeholder', () => {
    expect(defaultPreviewWrapper).toContain('%%CANVAS_CONTENT%%');
  });

  it('is a valid HTML document', () => {
    expect(defaultPreviewWrapper).toContain('<!DOCTYPE html>');
    expect(defaultPreviewWrapper).toContain('</html>');
  });
});

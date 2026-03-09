import { describe, it, expect } from 'vitest';
import {
  extractVariables,
  classifyVariables,
  renderForPreview,
  renderForSFMC,
  minifyHtml,
  ampVar,
} from './templateEngine';
import type { Partner } from '../types';

const mockPartner: Partner = {
  id: 'partner-1',
  name: 'TestBrand',
  slug: 'testbrand',
  tokens: [
    { key: 'colorPrimary', value: '#FF0000' },
    { key: 'colorSecondary', value: '#0000FF' },
    { key: 'fontFamily', value: 'Arial, sans-serif' },
    { key: 'partnerName', value: 'TestBrand' },
  ],
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

describe('ampVar', () => {
  it('wraps a variable name in AMPscript syntax', () => {
    expect(ampVar('headline')).toBe('%%=v(@headline)=%%');
  });
});

describe('extractVariables', () => {
  it('extracts unique variable names from AMPscript HTML', () => {
    const html = '<div style="color: %%=v(@colorPrimary)=%%">%%=v(@headline)=%% %%=v(@headline)=%%</div>';
    const vars = extractVariables(html);
    expect(vars).toEqual(['colorPrimary', 'headline']);
  });

  it('returns empty array for no variables', () => {
    expect(extractVariables('<div>Hello</div>')).toEqual([]);
  });

  it('handles multiple variables across lines', () => {
    const html = `
      <td style="color: %%=v(@colorPrimary)=%%; font-family: %%=v(@fontFamily)=%%;">
        %%=v(@headline)=%%
        <p>%%=v(@bodyText)=%%</p>
      </td>
    `;
    const vars = extractVariables(html);
    expect(vars).toContain('colorPrimary');
    expect(vars).toContain('fontFamily');
    expect(vars).toContain('headline');
    expect(vars).toContain('bodyText');
    expect(vars.length).toBe(4);
  });

  it('only matches word characters in variable names', () => {
    const html = '%%=v(@valid)=%% %%=v(@ spaced)=%% %%=v(@with-dash)=%%';
    const vars = extractVariables(html);
    expect(vars).toEqual(['valid']);
  });

  it('does not match mustache syntax', () => {
    const html = '{{notMatched}} %%=v(@matched)=%%';
    const vars = extractVariables(html);
    expect(vars).toEqual(['matched']);
  });
});

describe('classifyVariables', () => {
  it('separates style tokens from content variables', () => {
    const vars = ['colorPrimary', 'headline', 'fontFamily', 'bodyText'];
    const tokenKeys = ['colorPrimary', 'fontFamily', 'partnerName'];
    const { styleVars, contentVars } = classifyVariables(vars, tokenKeys);
    expect(styleVars).toEqual(['colorPrimary', 'fontFamily']);
    expect(contentVars).toEqual(['headline', 'bodyText']);
  });

  it('returns all as content when no tokens match', () => {
    const { styleVars, contentVars } = classifyVariables(['foo', 'bar'], []);
    expect(styleVars).toEqual([]);
    expect(contentVars).toEqual(['foo', 'bar']);
  });

  it('returns all as style when all are tokens', () => {
    const { styleVars, contentVars } = classifyVariables(['colorPrimary'], ['colorPrimary']);
    expect(styleVars).toEqual(['colorPrimary']);
    expect(contentVars).toEqual([]);
  });
});

describe('renderForPreview', () => {
  it('replaces both style tokens and content values', () => {
    const html = '<div style="color: %%=v(@colorPrimary)=%%">%%=v(@headline)=%%</div>';
    const result = renderForPreview(html, mockPartner, { headline: 'Hello World' });
    expect(result).toBe('<div style="color: #FF0000">Hello World</div>');
  });

  it('preserves unreplaced variables in AMPscript syntax', () => {
    const html = '<div>%%=v(@unknownVar)=%%</div>';
    const result = renderForPreview(html, mockPartner, {});
    expect(result).toBe('<div>%%=v(@unknownVar)=%%</div>');
  });

  it('prioritizes style tokens over content values', () => {
    const html = '<div>%%=v(@colorPrimary)=%%</div>';
    const result = renderForPreview(html, mockPartner, { colorPrimary: 'CONTENT_VALUE' });
    expect(result).toBe('<div>#FF0000</div>');
  });

  it('replaces partner name token', () => {
    const html = '<h1>%%=v(@partnerName)=%%</h1>';
    const result = renderForPreview(html, mockPartner, {});
    expect(result).toBe('<h1>TestBrand</h1>');
  });
});

describe('renderForSFMC', () => {
  it('replaces only style tokens, preserves content vars as AMPscript', () => {
    const html = '<div style="color: %%=v(@colorPrimary)=%%">%%=v(@headline)=%%</div>';
    const result = renderForSFMC(html, mockPartner);
    expect(result).toBe('<div style="color: #FF0000">%%=v(@headline)=%%</div>');
  });

  it('preserves all non-token variables in AMPscript format', () => {
    const html = '%%=v(@partnerName)=%% says %%=v(@greeting)=%%';
    const result = renderForSFMC(html, mockPartner);
    expect(result).toBe('TestBrand says %%=v(@greeting)=%%');
  });
});

describe('minifyHtml', () => {
  it('removes comments except conditional', () => {
    const html = '<!-- Regular comment -->\n<!--[if mso]>Keep this<![endif]-->';
    const result = minifyHtml(html);
    expect(result).toContain('<!--[if mso]>');
    expect(result).not.toContain('Regular comment');
  });

  it('collapses whitespace', () => {
    const html = '<div>\n    <p>  Hello  </p>\n</div>';
    const result = minifyHtml(html);
    expect(result).not.toContain('\n');
    expect(result).toBe('<div><p> Hello </p></div>');
  });

  it('trims the result', () => {
    const html = '  <div>Hello</div>  ';
    expect(minifyHtml(html)).toBe('<div>Hello</div>');
  });

  it('preserves AMPscript variables during minification', () => {
    const html = '  <div>%%=v(@headline)=%%</div>  ';
    expect(minifyHtml(html)).toBe('<div>%%=v(@headline)=%%</div>');
  });
});

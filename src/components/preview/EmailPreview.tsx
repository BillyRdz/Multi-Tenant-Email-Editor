import { useRef, useEffect, useEffectEvent, useState } from 'react';

interface Props {
  html: string;
  /** The canvas block to outline in the email, if any. */
  selectedInstanceId?: string | null;
  /** Called with a block's id when it is clicked in the email. */
  onSelectInstance?: (id: string) => void;
}

const WIDTHS = { desktop: 620, mobile: 375 } as const;
type ViewMode = keyof typeof WIDTHS;

// Selection styling lives inside the preview document, where the email's own CSS cannot reach it.
const SELECTION_CSS = `
  [data-instance] { cursor: pointer; }
  [data-instance]:hover { outline: 1px solid #0b57f0; outline-offset: -1px; }
  [data-instance][data-selected] { outline: 2px solid #0b57f0; outline-offset: -2px; }
`;

/**
 * The rendered email, at a real inbox width, on the desk.
 * Clicking a block selects it, the same as choosing it in the canvas outline.
 */
export function EmailPreview({ html, selectedInstanceId = null, onSelectInstance }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  // The frame is capped at its container's width, so on a narrow screen it is
  // shown smaller than the chosen size. The readout reports the real width.
  const [shownWidth, setShownWidth] = useState<number | null>(null);
  const selectInstance = useEffectEvent((id: string) => onSelectInstance?.(id));

  // Write the email into the frame whenever it changes.
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();

    const style = doc.createElement('style');
    style.textContent = SELECTION_CSS;
    doc.head?.appendChild(style);

    const onClick = (event: MouseEvent) => {
      // Links in a preview should not navigate the frame away from the email.
      event.preventDefault();
      const target = event.target as Element | null;
      const id = target?.closest?.('[data-instance]')?.getAttribute('data-instance');
      if (id) selectInstance(id);
    };
    doc.addEventListener('click', onClick);
    return () => doc.removeEventListener('click', onClick);
  }, [html]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setShownWidth(Math.round(entry.contentRect.width)));
    observer.observe(iframe);
    return () => observer.disconnect();
  }, []);

  // Outline the selected block and bring it into view.
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.querySelectorAll('[data-selected]').forEach(el => el.removeAttribute('data-selected'));
    if (!selectedInstanceId) return;
    const block = doc.querySelector(`[data-instance="${CSS.escape(selectedInstanceId)}"]`);
    block?.setAttribute('data-selected', '');
    block?.scrollIntoView?.({ block: 'nearest' });
  }, [html, selectedInstanceId]);

  const widthOption = (mode: ViewMode, label: string) => (
    <button
      type="button"
      onClick={() => setViewMode(mode)}
      aria-pressed={viewMode === mode}
      className="px-2.5 py-1 text-xs"
      style={{
        backgroundColor: viewMode === mode ? 'var(--accent-primary)' : 'var(--bg-primary)',
        color: viewMode === mode ? '#fff' : 'var(--text-secondary)',
        fontWeight: viewMode === mode ? 600 : 400,
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-3 px-4 py-2.5">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Preview
        </h2>
        <span className="tabular text-xs" style={{ color: 'var(--text-secondary)' }}>
          {shownWidth ?? WIDTHS[viewMode]} px wide
        </span>
        <div
          role="group"
          aria-label="Preview width"
          className="ml-auto inline-flex overflow-hidden rounded"
          style={{ border: '1px solid var(--border-input)' }}
        >
          {widthOption('desktop', 'Desktop')}
          {widthOption('mobile', 'Mobile')}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 justify-center px-4 pb-6">
        <iframe
          ref={iframeRef}
          title="Email Preview"
          className="shadow-xl"
          style={{
            width: `${WIDTHS[viewMode]}px`,
            maxWidth: '100%',
            height: '100%',
            minHeight: '560px',
            border: 'none',
            backgroundColor: '#fff',
          }}
        />
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';

interface Props {
  header: ReactNode;
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

/**
 * The editor frame: a toolbar, the email in the middle of the desk, and a
 * panel on each side. On wide screens each column scrolls on its own and the
 * page itself does not move. On narrow screens the columns stack.
 */
export function AppShell({ header, left, center, right }: Props) {
  const panel = { backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-secondary)' };

  return (
    <div className="min-h-screen flex flex-col lg:h-screen lg:overflow-hidden" style={{ backgroundColor: 'var(--booth)' }}>
      <header className="sticky top-0 z-40 shrink-0 border-b lg:static" style={panel}>
        {header}
      </header>
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[17rem_minmax(0,1fr)_19.5rem]">
        <aside
          aria-label="Component library and canvas"
          className="min-w-0 border-b lg:border-b-0 lg:border-r lg:overflow-y-auto"
          style={panel}
        >
          {left}
        </aside>
        <main className="min-w-0 lg:min-h-0 lg:overflow-hidden">
          {center}
        </main>
        <aside
          aria-label="Inspector, theme, versions, and export"
          className="min-w-0 border-t lg:border-t-0 lg:border-l lg:overflow-y-auto"
          style={panel}
        >
          {right}
        </aside>
      </div>
    </div>
  );
}

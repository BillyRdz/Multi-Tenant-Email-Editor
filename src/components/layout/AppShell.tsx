import type { ReactNode } from 'react';

interface Props {
  header: ReactNode;
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

export function AppShell({ header, left, center, right }: Props) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <header
        className="sticky top-0 z-50 border-b"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
      >
        {header}
      </header>
      <div className="flex-1 max-w-[1800px] w-full mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] gap-4 h-full">
          <aside className="space-y-4 order-2 lg:order-1 overflow-y-auto max-h-[calc(100vh-80px)]">
            {left}
          </aside>
          <main className="order-1 lg:order-2 min-h-[600px]">
            {center}
          </main>
          <aside className="space-y-4 order-3 overflow-y-auto max-h-[calc(100vh-80px)]">
            {right}
          </aside>
        </div>
      </div>
    </div>
  );
}

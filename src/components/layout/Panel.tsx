import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

/** One section of a side panel: a plain heading, its content, and a divider below. */
export function Panel({ title, children, actions }: Props) {
  return (
    <section className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
      <div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        {actions}
      </div>
      <div className="px-4 pb-4">
        {children}
      </div>
    </section>
  );
}

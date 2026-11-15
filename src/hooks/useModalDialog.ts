import { useEffect, useEffectEvent, useRef } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

// Open dialogs, bottom to top. Only the top one reacts to the keyboard, so a
// confirm dialog opened over another modal does not close both on Escape.
const openDialogs: HTMLElement[] = [];

/**
 * Keyboard and focus behavior for a modal dialog (WCAG 2.1.2 and 2.4.3):
 * - moves focus into the dialog when it opens
 * - keeps Tab and Shift+Tab inside it
 * - closes it on Escape
 * - returns focus to the element that opened it
 *
 * Attach the returned ref to the element that has role="dialog" and tabIndex={-1}.
 * To start on a specific field, mark it with data-autofocus. (The autoFocus
 * prop would move focus before this hook can remember the opener.)
 */
export function useModalDialog(isOpen: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  // Always calls the latest onClose without re-running the effect when the
  // parent passes a new function on every render.
  const close = useEffectEvent(onClose);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusables = () => Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));

    openDialogs.push(dialog);
    if (!dialog.contains(document.activeElement)) {
      const preferred = dialog.querySelector<HTMLElement>('[data-autofocus]');
      (preferred ?? focusables()[0] ?? dialog).focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (openDialogs[openDialogs.length - 1] !== dialog) return;

      if (event.key === 'Escape') {
        // A widget inside the dialog (the code editor) may have used Escape already.
        if (event.defaultPrevented) return;
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (!first || !last) {
        event.preventDefault();
        dialog.focus();
      } else if (!dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      openDialogs.splice(openDialogs.indexOf(dialog), 1);
      if (opener?.isConnected) {
        opener.focus();
      } else {
        // The opener is gone (for example, the deleted row). Fall back to the dialog underneath.
        openDialogs[openDialogs.length - 1]?.focus();
      }
    };
  }, [isOpen]);

  return dialogRef;
}

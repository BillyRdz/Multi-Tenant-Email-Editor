import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Canvas } from './Canvas';
import { ComponentLibrary } from '../library/ComponentLibrary';
import { defaultPartners } from '../../data/defaultPartners';
import { defaultComponents } from '../../data/defaultComponents';
import type { CanvasInstance } from '../../types';

const [header, body, card] = defaultComponents;
const instances: CanvasInstance[] = [header, body, card].map((comp, order) => ({
  id: `inst-${order}`,
  componentId: comp.id,
  contentValues: {},
  order,
}));

function setup() {
  const handlers = {
    onSelectInstance: vi.fn(),
    onDropComponent: vi.fn(),
    onReorder: vi.fn(),
    onRemoveInstance: vi.fn(),
  };
  render(
    <Canvas
      instances={instances}
      components={defaultComponents}
      partner={defaultPartners[0]}
      selectedInstanceId={null}
      {...handlers}
    />
  );
  return { ...handlers, user: userEvent.setup() };
}

describe('Canvas keyboard controls', () => {
  it('moves a block up with its button', async () => {
    const { user, onReorder } = setup();

    await user.click(screen.getByRole('button', { name: `Move ${body.name} up` }));

    expect(onReorder).toHaveBeenCalledWith(['inst-1', 'inst-0', 'inst-2']);
    expect(screen.getByRole('status')).toHaveTextContent(`${body.name} moved to position 1 of 3`);
  });

  it('moves a block down with its button', async () => {
    const { user, onReorder } = setup();

    await user.click(screen.getByRole('button', { name: `Move ${body.name} down` }));

    expect(onReorder).toHaveBeenCalledWith(['inst-0', 'inst-2', 'inst-1']);
  });

  it('disables moving past either end', () => {
    setup();
    expect(screen.getByRole('button', { name: `Move ${header.name} up` })).toBeDisabled();
    expect(screen.getByRole('button', { name: `Move ${card.name} down` })).toBeDisabled();
  });

  it('selects and removes a block from the keyboard', async () => {
    const { user, onSelectInstance, onRemoveInstance } = setup();

    screen.getByRole('button', { name: body.name }).focus();
    await user.keyboard('{Enter}');
    expect(onSelectInstance).toHaveBeenCalledTimes(1);
    expect(onSelectInstance).toHaveBeenCalledWith('inst-1');

    await user.click(screen.getByRole('button', { name: `Remove ${body.name}` }));
    expect(onRemoveInstance).toHaveBeenCalledWith('inst-1');
    expect(onSelectInstance).toHaveBeenCalledTimes(1);
  });
});

describe('ComponentLibrary', () => {
  it('adds a component to the canvas without dragging', async () => {
    const onAdd = vi.fn();
    render(<ComponentLibrary components={defaultComponents} onDragStart={() => {}} onAdd={onAdd} />);

    await userEvent.setup().click(screen.getByRole('button', { name: `Add ${card.name} to canvas` }));

    expect(onAdd).toHaveBeenCalledWith(card.id);
  });
});

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Tracks the cursor for every `.spotlight-card` inside it. Each card gets the
 * cursor position relative to itself, so the glow crosses card boundaries.
 */
const SpotlightGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, onPointerMove, ...props }, ref) => {
  const frame = React.useRef(0);

  React.useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (event.pointerType !== 'mouse') return;

    const group = event.currentTarget;
    const { clientX, clientY } = event;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      group.querySelectorAll<HTMLElement>('.spotlight-card').forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${clientX - rect.left}px`);
        card.style.setProperty('--spot-y', `${clientY - rect.top}px`);
      });
    });
  };

  return (
    <div
      ref={ref}
      className={cn('spotlight-group', className)}
      onPointerMove={handlePointerMove}
      {...props}
    />
  );
});
SpotlightGroup.displayName = 'SpotlightGroup';

export { SpotlightGroup };

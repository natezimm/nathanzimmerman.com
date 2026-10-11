import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type SectionCaptionProps = {
  /** Shell command shown as a decorative prompt line. */
  command: string;
  /** Optional readable note shown opposite the command. */
  meta?: ReactNode;
  className?: string;
};

export const SectionCaption = ({
  command,
  meta,
  className,
}: SectionCaptionProps) => (
  <div
    className={cn(
      'flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted-foreground',
      className
    )}
  >
    <span aria-hidden="true">
      <span className="text-emerald-600 dark:text-emerald-400">$</span>{' '}
      {command}
    </span>
    {meta && <span>{meta}</span>}
  </div>
);

export default SectionCaption;

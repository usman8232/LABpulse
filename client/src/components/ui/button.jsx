import { cn } from '../../lib/utils';

export function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-white shadow-sm transition hover:bg-accentDark disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

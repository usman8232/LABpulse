import { cn } from '../../lib/utils';

export function Badge({ label, tone = 'neutral' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        tone === 'success' && 'bg-emerald-50 text-emerald-600',
        tone === 'warning' && 'bg-amber-50 text-amber-600',
        tone === 'danger' && 'bg-rose-50 text-rose-600',
        tone === 'neutral' && 'bg-slate-100 text-slate-600',
      )}
    >
      {label}
    </span>
  );
}

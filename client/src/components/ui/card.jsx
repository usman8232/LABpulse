import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('rounded-2xl border border-slate-100 bg-panel shadow-shell', className)} {...props}>
      {children}
    </div>
  );
}

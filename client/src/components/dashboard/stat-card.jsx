import { Card } from '../ui/card';

export function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="rounded-xl bg-sky-50 p-2 text-accent">
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{helper}</p>
    </Card>
  );
}

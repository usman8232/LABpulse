import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card } from '../ui/card';

export function UsageChart({ title, data }) {
  const chartData = [...data].reverse().map((item, index) => ({
    name: `${index + 1}`,
    cpu: item.cpuUsage,
    ram: item.ramUsage,
    disk: item.diskUsage,
  }));

  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <p className="text-sm text-slate-500">Live and historical resource usage trends.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="cpu" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#2ba8ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2ba8ff" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="ram" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#1a6dff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1a6dff" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eef2ff" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip />
            <Area dataKey="cpu" stroke="#2ba8ff" fill="url(#cpu)" strokeWidth={2} />
            <Area dataKey="ram" stroke="#1a6dff" fill="url(#ram)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

import { AlertTriangle, Cpu, MonitorCheck, ServerCog } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DeviceTable } from '../components/dashboard/device-table';
import { StatCard } from '../components/dashboard/stat-card';
import { UsageChart } from '../components/dashboard/usage-chart';
import { Card } from '../components/ui/card';
import { useAlerts, useDevices } from '../hooks/use-host-data';
import { useSocket } from '../hooks/use-socket';

export function HostDashboardPage() {
  const [deviceEvents, setDeviceEvents] = useState([]);
  const [alertEvents, setAlertEvents] = useState([]);
  const { data: devicesData } = useDevices();
  const { data: alertsData } = useAlerts();

  useSocket(
    (payload) => setDeviceEvents((current) => [payload, ...current].slice(0, 12)),
    (payload) => setAlertEvents((current) => [payload, ...current].slice(0, 12)),
  );

  const devices = devicesData?.devices ?? [];
  const alerts = alertsData?.alerts ?? [];

  const chartData = useMemo(
    () =>
      devices.map((device, index) => ({
        id: `${index}`,
        cpuUsage: device.cpuUsage,
        ramUsage: device.ramUsage,
        diskUsage: device.diskUsage,
        uptimeSeconds: device.uptimeSeconds,
        recordedAt: device.lastSeenAt ?? new Date().toISOString(),
      })),
    [devices],
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Host overview</p>
        <h1 className="text-2xl font-semibold text-ink md:text-3xl">Live Lab Command Center</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Registered Devices" value={`${devices.length}`} helper="Tracked fleet endpoints" icon={MonitorCheck} />
        <StatCard
          label="Online Devices"
          value={`${devices.filter((device) => device.isOnline).length}`}
          helper="Devices actively reporting"
          icon={ServerCog}
        />
        <StatCard
          label="Active Alerts"
          value={`${alerts.filter((alert) => alert.status !== 'RESOLVED').length}`}
          helper="Incidents needing attention"
          icon={AlertTriangle}
        />
        <StatCard
          label="Average CPU"
          value={`${Math.round(devices.reduce((sum, device) => sum + device.cpuUsage, 0) / Math.max(devices.length, 1))}%`}
          helper="Recent fleet load"
          icon={Cpu}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <UsageChart title="Fleet Resource Trends" data={chartData} />

        <Card className="p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-ink">Live Event Feed</h3>
            <p className="text-sm text-slate-500">Recent device and alert activity from the socket stream.</p>
          </div>

          <div className="space-y-3">
            {deviceEvents.slice(0, 4).map((device, index) => (
              <div key={`${device.hostname}-${index}`} className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="font-medium text-ink">{device.hostname}</p>
                <p className="text-sm text-slate-500">
                  CPU {device.cpuUsage}% | RAM {device.ramUsage}% | {device.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            ))}
            {alertEvents.slice(0, 4).map((alert, index) => (
              <div key={`${alert.type}-${index}`} className="rounded-xl bg-rose-50 px-4 py-3">
                <p className="font-medium text-rose-600">{alert.type}</p>
                <p className="text-sm text-rose-500">{alert.message ?? 'New alert received.'}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <DeviceTable devices={devices} />
    </div>
  );
}

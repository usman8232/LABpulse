import { useParams } from 'react-router-dom';

import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { UsageChart } from '../components/dashboard/usage-chart';
import { useAlerts, useDevice, useDeviceHistory } from '../hooks/use-host-data';
import { formatRelativeAge, getDeviceFreshness, getDeviceHealthTone } from '../lib/device-status';

export function HostDeviceDetailPage() {
  const { deviceId = '' } = useParams();
  const { data: deviceData } = useDevice(deviceId);
  const { data: historyData } = useDeviceHistory(deviceId);
  const { data: alertsData } = useAlerts();

  const device = deviceData?.device;
  const history = historyData?.history ?? [];
  const alerts = alertsData?.alerts ?? [];

  if (!device) {
    return <p className="text-sm text-slate-500">Device not found.</p>;
  }

  const freshness = getDeviceFreshness(device);
  const deviceAlerts = alerts.filter((alert) => {
    const alertDeviceId = alert.deviceId?._id ?? alert.deviceId?.id ?? alert.deviceId;
    const currentDeviceId = device._id ?? device.id;
    return alertDeviceId === currentDeviceId;
  });
  const activeAlerts = deviceAlerts.filter((alert) => alert.status !== 'RESOLVED');
  const latestMetric = history[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Device detail</p>
        <h1 className="text-2xl font-semibold text-ink md:text-3xl">{device.hostname}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-slate-500">Operating System</p>
          <p className="mt-2 text-lg font-semibold text-ink">{device.os}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">IP Address</p>
          <p className="mt-2 text-lg font-semibold text-ink">{device.ipAddress}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Current Status</p>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-lg font-semibold text-ink">{device.isOnline ? 'Online' : 'Offline'}</p>
            <Badge
              label={device.isOnline ? device.currentAlertState : 'OFFLINE'}
              tone={getDeviceHealthTone(device)}
            />
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Freshness</p>
          <div className="mt-2 flex items-center gap-3">
            <Badge label={freshness.label} tone={freshness.tone} />
            <p className="text-sm text-slate-500">{freshness.summary}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-ink">Current Metrics</h2>
            <p className="text-sm text-slate-500">Latest known health snapshot for this device.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricItem label="CPU Usage" value={`${device.cpuUsage}%`} />
            <MetricItem label="RAM Usage" value={`${device.ramUsage}%`} />
            <MetricItem label="Disk Usage" value={`${device.diskUsage}%`} />
            <MetricItem label="Uptime" value={formatUptime(device.uptimeSeconds)} />
            <MetricItem
              label="Last Seen"
              value={device.lastSeenAt ? `${formatRelativeAge(Math.round((Date.now() - new Date(device.lastSeenAt).getTime()) / 1000))} ago` : 'Unknown'}
            />
            <MetricItem
              label="Latest Sample"
              value={latestMetric?.recordedAt ? new Date(latestMetric.recordedAt).toLocaleTimeString() : 'Unavailable'}
            />
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-ink">Device Alerts</h2>
            <p className="text-sm text-slate-500">Active and recent alert state for this endpoint.</p>
          </div>
          <div className="space-y-3">
            {deviceAlerts.length === 0 && <p className="text-sm text-slate-500">No alerts recorded for this device.</p>}
            {deviceAlerts.slice(0, 4).map((alert) => (
              <div key={alert._id ?? alert.id} className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-ink">{alert.type}</p>
                  <Badge
                    label={alert.status}
                    tone={alert.status === 'RESOLVED' ? 'success' : alert.status === 'ACKNOWLEDGED' ? 'warning' : 'danger'}
                  />
                </div>
                <p className="mt-1 text-sm text-slate-500">{alert.message}</p>
              </div>
            ))}
            {activeAlerts.length > 0 && (
              <p className="text-xs text-slate-400">{activeAlerts.length} active alert(s) currently need attention.</p>
            )}
          </div>
        </Card>
      </div>

      <UsageChart title="Usage History" data={history} />
    </div>
  );
}

function MetricItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-ink">{value}</p>
    </div>
  );
}

function formatUptime(totalSeconds) {
  if (!totalSeconds) return '0m';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

import { useParams } from 'react-router-dom';

import { Card } from '../components/ui/card';
import { UsageChart } from '../components/dashboard/usage-chart';
import { useDevice, useDeviceHistory } from '../hooks/use-host-data';

export function HostDeviceDetailPage() {
  const { deviceId = '' } = useParams();
  const { data: deviceData } = useDevice(deviceId);
  const { data: historyData } = useDeviceHistory(deviceId);

  const device = deviceData?.device;
  const history = historyData?.history ?? [];

  if (!device) {
    return <p className="text-sm text-slate-500">Device not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Device detail</p>
        <h1 className="text-3xl font-semibold text-ink">{device.hostname}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
          <p className="mt-2 text-lg font-semibold text-ink">{device.isOnline ? 'Online' : 'Offline'}</p>
        </Card>
      </div>

      <UsageChart title="Usage History" data={history} />
    </div>
  );
}

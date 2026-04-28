import { Link } from 'react-router-dom';

import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { getDeviceFreshness, getDeviceHealthTone } from '../../lib/device-status';

export function DeviceTable({ devices }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="text-base font-semibold text-ink">Fleet Overview</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Hostname</th>
              <th className="px-5 py-3 font-medium">OS</th>
              <th className="px-5 py-3 font-medium">IP Address</th>
              <th className="px-5 py-3 font-medium">CPU</th>
              <th className="px-5 py-3 font-medium">RAM</th>
              <th className="px-5 py-3 font-medium">Last Seen</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => {
              const freshness = getDeviceFreshness(device);

              return (
                <tr key={device.id ?? device._id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-medium text-ink">
                    <Link to={`/host/devices/${device.id ?? device._id}`} className="hover:text-accent">
                      {device.hostname}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{device.os}</td>
                  <td className="px-5 py-4 text-slate-500">{device.ipAddress}</td>
                  <td className="px-5 py-4 text-slate-500">{device.cpuUsage}%</td>
                  <td className="px-5 py-4 text-slate-500">{device.ramUsage}%</td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <Badge label={freshness.label} tone={freshness.tone} />
                      <p className="text-xs text-slate-400">{freshness.summary}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      label={device.isOnline ? device.currentAlertState : 'OFFLINE'}
                      tone={getDeviceHealthTone(device)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

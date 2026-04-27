import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAlertAction, useAlerts } from '../hooks/use-host-data';

export function HostAlertsPage() {
  const { data, refetch } = useAlerts();
  const acknowledge = useAlertAction('acknowledge');
  const resolve = useAlertAction('resolve');

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Monitoring</p>
        <h1 className="text-2xl font-semibold text-ink md:text-3xl">Alerts and Faults</h1>
      </div>

      <div className="grid gap-4">
        {data?.alerts.map((alert) => (
          <Card key={alert.id ?? alert._id} className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-ink">{alert.type}</p>
                <p className="mt-1 text-sm text-slate-500">{alert.message}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Device: {alert.deviceId.hostname} · Status: {alert.status}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="h-9 rounded-lg px-3"
                  onClick={async () => {
                    await acknowledge.mutateAsync(alert.id ?? alert._id ?? '');
                    await refetch();
                  }}
                >
                  Acknowledge
                </Button>
                <Button
                  className="h-9 rounded-lg bg-slate-200 px-3 text-slate-700 hover:bg-slate-300"
                  onClick={async () => {
                    await resolve.mutateAsync(alert.id ?? alert._id ?? '');
                    await refetch();
                  }}
                >
                  Resolve
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

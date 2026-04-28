import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAlertAction, useAlerts } from '../hooks/use-host-data';

export function HostAlertsPage() {
  const { data } = useAlerts();
  const acknowledge = useAlertAction('acknowledge');
  const resolve = useAlertAction('resolve');
  const alerts = data?.alerts ?? [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Monitoring</p>
        <h1 className="text-2xl font-semibold text-ink md:text-3xl">Alerts and Faults</h1>
      </div>

      <div className="grid gap-4">
        {alerts.length === 0 && <Card className="p-5 text-sm text-slate-500">No active or historical alerts yet.</Card>}

        {alerts.map((alert) => {
          const isAcknowledged = alert.status === 'ACKNOWLEDGED';
          const isResolved = alert.status === 'RESOLVED';
          const tone = isResolved ? 'success' : isAcknowledged ? 'warning' : 'danger';

          return (
            <Card key={alert.id ?? alert._id} className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-ink">{alert.type}</p>
                    <Badge label={alert.status} tone={tone} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{alert.message}</p>
                  <p className="mt-2 text-xs text-slate-400">Device: {alert.deviceId.hostname} | Status: {alert.status}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="h-9 rounded-lg px-3"
                    disabled={isAcknowledged || isResolved || acknowledge.isPending}
                    onClick={async () => {
                      await acknowledge.mutateAsync(alert.id ?? alert._id ?? '');
                    }}
                  >
                    {acknowledge.isPending ? 'Working...' : 'Acknowledge'}
                  </Button>
                  <Button
                    className="h-9 rounded-lg bg-slate-200 px-3 text-slate-700 hover:bg-slate-300"
                    disabled={isResolved || resolve.isPending}
                    onClick={async () => {
                      await resolve.mutateAsync(alert.id ?? alert._id ?? '');
                    }}
                  >
                    {resolve.isPending ? 'Working...' : 'Resolve'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

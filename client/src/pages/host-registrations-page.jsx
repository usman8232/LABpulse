import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useRegistrationDecision, useRegistrations } from '../hooks/use-host-data';

export function HostRegistrationsPage() {
  const { data, refetch } = useRegistrations();
  const decisionMutation = useRegistrationDecision();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Host workflow</p>
        <h1 className="text-2xl font-semibold text-ink md:text-3xl">Device Registrations</h1>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Hostname</th>
                <th className="px-5 py-3 font-medium">OS</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.registrations.map((registration) => (
                <tr key={registration.id ?? registration._id} className="border-t border-slate-100">
                  <td className="px-5 py-4">{registration.userId.displayName}</td>
                  <td className="px-5 py-4">{registration.deviceId.hostname}</td>
                  <td className="px-5 py-4">{registration.deviceId.os}</td>
                  <td className="px-5 py-4">{registration.status}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={async () => {
                          await decisionMutation.mutateAsync({
                            id: registration.id ?? registration._id ?? '',
                            approved: true,
                          });
                          await refetch();
                        }}
                        className="h-9 rounded-lg px-3"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={async () => {
                          await decisionMutation.mutateAsync({
                            id: registration.id ?? registration._id ?? '',
                            approved: false,
                          });
                          await refetch();
                        }}
                        className="h-9 rounded-lg bg-slate-200 px-3 text-slate-700 hover:bg-slate-300"
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

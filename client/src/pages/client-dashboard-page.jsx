import { zodResolver } from '@hookform/resolvers/zod';
import { LaptopMinimal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useClientRegistration, useMyDevice } from '../hooks/use-client-data';

const schema = z.object({
  hostname: z.string().min(2),
  fingerprint: z.string().min(3),
  ipAddress: z.string().min(3),
  os: z.string().min(2),
});

export function ClientDashboardPage() {
  const { data, refetch } = useMyDevice();
  const registerMutation = useClientRegistration();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      hostname: 'LAB-PC-01',
      fingerprint: 'device-fingerprint-01',
      ipAddress: '192.168.0.15',
      os: 'Windows 11',
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Client access</p>
        <h1 className="text-3xl font-semibold text-ink">Register This PC</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-sky-50 p-3 text-accent">
              <LaptopMinimal size={20} />
            </div>
            <div>
              <p className="font-semibold text-ink">Current Registration</p>
              <p className="text-sm text-slate-500">Track approval and monitoring status for this device.</p>
            </div>
          </div>

          {data?.registration ? (
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Hostname</p>
              <p className="font-medium text-ink">{data.registration.deviceId.hostname}</p>
              <p className="text-sm text-slate-500">Approval Status</p>
              <p className="font-medium text-ink">{data.registration.status}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No device has been registered yet.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-ink">Device Registration Form</h2>
          <form
            className="mt-5 grid gap-4 md:grid-cols-2"
            onSubmit={handleSubmit(async (values) => {
              await registerMutation.mutateAsync(values);
              await refetch();
            })}
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Hostname</label>
              <input
                {...register('hostname')}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Fingerprint</label>
              <input
                {...register('fingerprint')}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">IP Address</label>
              <input
                {...register('ipAddress')}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Operating System</label>
              <input
                {...register('os')}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-accent"
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">{registerMutation.isPending ? 'Submitting...' : 'Register PC'}</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

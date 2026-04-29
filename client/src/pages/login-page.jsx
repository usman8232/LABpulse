import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useLogin } from '../hooks/use-auth';
import { useAuthStore } from '../stores/auth-store';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginPage() {
  const user = useAuthStore((state) => state.user);
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'host@labpulse.local',
      password: 'Host12345!',
    },
  });

  if (user) {
    return <Navigate to={user.role === 'HOST' ? '/host' : '/client'} replace />;
  }

  return (
    <div className="min-h-screen bg-shell-wave p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden rounded-[28px] bg-ink px-10 py-12 text-white shadow-shell lg:block"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <Activity size={28} />
            </div>
            <div>
              <p className="text-sm text-sky-200">LABPulse</p>
              <h1 className="text-2xl font-semibold">Real-time Computer Lab Monitoring</h1>
            </div>
          </div>
          <p className="max-w-xl text-lg leading-8 text-slate-200">
            Monitor fleet health, approve client device registrations, review alerts, and print operational reports
            from one clean command center.
          </p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center">
          <Card className="w-full rounded-[28px] p-8">
            <p className="text-sm text-slate-500">Welcome back</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Sign in to LABPulse</h2>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
                <input
                  {...register('email')}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none transition focus:border-accent"
                />
                {errors.email && <p className="mt-1 text-sm text-rose-500">{errors.email.message}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Password</label>
                <input
                  type="password"
                  {...register('password')}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none transition focus:border-accent"
                />
                {errors.password && <p className="mt-1 text-sm text-rose-500">{errors.password.message}</p>}
              </div>
              {loginMutation.isError && (
                <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
                  {loginMutation.error.message}
                </p>
              )}
              <Button type="submit" className="w-full">
                {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              Default accounts:
              <div className="mt-2 space-y-1">
                <p>host@labpulse.local / Host12345!</p>
                <p>client@labpulse.local / Client12345!</p>
              </div>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}

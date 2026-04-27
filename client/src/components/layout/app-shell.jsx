import { motion } from 'framer-motion';
import { Activity, Bell, FileText, LayoutDashboard, LogOut, MonitorSmartphone, UserSquare2 } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

import { useAuthStore } from '../../stores/auth-store';
import { cn } from '../../lib/utils';

const hostNavigation = [
  { to: '/host', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/host/registrations', label: 'Registrations', icon: UserSquare2 },
  { to: '/host/alerts', label: 'Alerts', icon: Bell },
  { to: '/host/reports', label: 'Reports', icon: FileText },
];

const clientNavigation = [{ to: '/client', label: 'My Device', icon: MonitorSmartphone }];

export function AppShell() {
  const { user, clearSession } = useAuthStore();
  const navigation = user?.role === 'HOST' ? hostNavigation : clientNavigation;

  return (
    <div className="min-h-screen bg-shell-wave p-4 md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl gap-4 rounded-[28px] bg-white/70 p-4 shadow-shell backdrop-blur-xl md:p-6">
        <aside className="print-hidden hidden w-64 shrink-0 rounded-2xl bg-white/90 p-5 md:flex md:flex-col">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-accent/10 p-2 text-accent">
              <Activity size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">LABPulse</p>
              <p className="font-semibold text-ink">{user?.role === 'HOST' ? 'Host Console' : 'Client Access'}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/host' || item.to === '/client'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition',
                    isActive && 'bg-sky-50 text-accent',
                  )
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={clearSession}
            className="mt-auto flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </aside>

        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="flex-1 rounded-2xl bg-white p-4 md:p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}

import { useState } from 'react';

import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useGenerateReport, useReports } from '../hooks/use-host-data';

export function HostReportsPage() {
  const [title, setTitle] = useState('Daily Fleet Summary');
  const reportMutation = useGenerateReport();
  const { data } = useReports();
  const reports = data?.reports ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Operational reporting</p>
          <h1 className="text-2xl font-semibold text-ink md:text-3xl">Reports</h1>
        </div>
        <div className="print-hidden flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-11 flex-1 rounded-xl border border-slate-200 px-3 outline-none focus:border-accent"
          />
          <Button onClick={() => reportMutation.mutate({ title, filters: { scope: 'fleet' } })}>
            {reportMutation.isPending ? 'Generating...' : 'Generate'}
          </Button>
          <Button className="bg-slate-200 text-slate-700 hover:bg-slate-300" onClick={() => window.print()}>
            Print
          </Button>
        </div>
      </div>

      {reportMutation.isError && (
        <Card className="p-4 text-sm text-rose-600">
          {reportMutation.error.message}
        </Card>
      )}

      {reportMutation.data?.summary && (
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-ink">{reportMutation.data.report.title}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">Devices</p>
              <p className="text-2xl font-semibold text-ink">{reportMutation.data.summary.deviceCount}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Alerts</p>
              <p className="text-2xl font-semibold text-ink">{reportMutation.data.summary.alertCount}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg CPU</p>
              <p className="text-2xl font-semibold text-ink">{Math.round(reportMutation.data.summary.averageCpu)}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg RAM</p>
              <p className="text-2xl font-semibold text-ink">{Math.round(reportMutation.data.summary.averageRam)}%</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h3 className="text-base font-semibold text-ink">Generated Reports</h3>
        <div className="mt-4 space-y-3">
          {reports.length === 0 && (
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              No reports generated yet.
            </p>
          )}
          {reports.map((report) => (
            <div key={report._id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <div>
                <p className="font-medium text-ink">{report.title}</p>
                <p className="text-sm text-slate-500">{new Date(report.generatedAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

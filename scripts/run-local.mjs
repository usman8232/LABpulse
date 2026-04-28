import { spawn } from 'node:child_process';

const withAgent = process.argv.includes('--with-agent');
const tasks = [
  { name: 'server', args: ['run', 'dev:server'] },
  { name: 'client', args: ['run', 'dev:client'] },
];

if (withAgent) {
  tasks.push({ name: 'agent', args: ['run', 'dev:agent'] });
}

const children = [];

function startTask(task) {
  const child = spawn('npm', task.args, {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      return;
    }

    if (code !== 0) {
      shutdown(code ?? 1);
    }
  });

  children.push(child);
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGINT');
    }
  }

  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

for (const task of tasks) {
  startTask(task);
}

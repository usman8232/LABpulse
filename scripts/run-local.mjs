import net from 'node:net';
import { spawn } from 'node:child_process';

const withAgent = process.argv.includes('--with-agent');
const children = [];
const isWindows = process.platform === 'win32';

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });

    server.listen(port, '127.0.0.1');
  });
}

async function findOpenPort(startPort, limit = 20) {
  for (let port = startPort; port < startPort + limit; port += 1) {
    if (await isPortFree(port)) {
      return port;
    }
  }

  throw new Error(`No open port found from ${startPort} to ${startPort + limit - 1}.`);
}

function startTask(task) {
  const command = isWindows ? process.env.ComSpec || 'cmd.exe' : 'npm';
  const args = isWindows ? ['/d', '/s', '/c', `npm ${task.args.join(' ')}`] : task.args;

  const child = spawn(command, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...task.env,
    },
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

async function main() {
  const serverPort = await findOpenPort(4000);
  const clientPort = await findOpenPort(5173);
  const clientOrigin = `http://localhost:${clientPort}`;
  const socketUrl = `http://localhost:${serverPort}`;

  console.log(`LABPulse local mode`);
  console.log(`- server: ${socketUrl}`);
  console.log(`- client: ${clientOrigin}`);

  const tasks = [
    {
      name: 'server',
      args: ['--workspace', 'server', 'run', 'dev'],
      env: {
        SERVER_PORT: String(serverPort),
        CLIENT_URL: clientOrigin,
      },
    },
    {
      name: 'client',
      args: ['--workspace', 'client', 'run', 'dev', '--', '--host', '0.0.0.0', '--port', String(clientPort)],
      env: {
        VITE_API_URL: '',
        VITE_SOCKET_URL: '',
        VITE_PROXY_TARGET: socketUrl,
      },
    },
  ];

  if (withAgent) {
    tasks.push({
      name: 'agent',
      args: ['--workspace', 'agent', 'run', 'dev'],
      env: {
        LABPULSE_SERVER_URL: `${socketUrl}/api/monitoring/heartbeat`,
      },
    });
  }

  for (const task of tasks) {
    startTask(task);
  }
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

main().catch((error) => {
  console.error(error.message);
  shutdown(1);
});

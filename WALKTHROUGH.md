# LABPulse Walkthrough

This file explains:
- how to start the project with one command
- how to register a device
- what must be set up on another laptop
- how monitoring actually works in real use

## 1. Run the project with one command

There are two supported paths:
- **local mode**: runs directly with Node.js and npm
- **Docker mode**: runs in containers

Use local mode if Docker is not installed.

### Prerequisites
- Node.js 20+
- npm

### Local mode

From the project root:

```bash
npm run local
```

This command:
- creates missing local `.env` files from the examples
- starts the LABPulse backend on port `4000` or the next free port
- starts the LABPulse frontend on port `5173` or the next free port
- prints the exact local URLs in the terminal

If you want to run the monitoring agent on the same machine too:

```bash
npm run local:with-agent
```

### Docker mode

Prerequisite:
- Docker Desktop installed and running

From the project root:

```bash
npm run up
```

This command:
- creates missing local `.env` files from the examples
- starts MongoDB
- starts the LABPulse backend on port `4000`
- builds and serves the LABPulse frontend on port `8080`

### URLs
- Local mode web app: check the terminal output from `npm run local`
- Docker mode web app: [http://localhost:8080](http://localhost:8080)
- Backend health: [http://localhost:4000/health](http://localhost:4000/health)

### Stop the stack

```bash
npm run down
```

For local mode, stop with `Ctrl+C` in the terminal.

### View container logs

```bash
npm run logs
```

## 2. Default accounts

Use these built-in accounts for testing:

- Host
  - Email: `host@labpulse.local`
  - Password: `Host12345!`

- Client
  - Email: `client@labpulse.local`
  - Password: `Client12345!`

## 3. What the app does

LABPulse has two sides:

- **Host**
  - approves device registrations
  - sees all monitored devices
  - sees alerts, reports, and device detail pages

- **Client**
  - registers the current laptop/PC
  - sees the approval status for that device

The web app alone does **not** monitor hardware continuously. Real monitoring happens when the **agent** sends heartbeat data to the backend.

## 4. Real-life test flow with a second laptop

To test this properly, use two machines on the same network:

- **Laptop A** = Host machine running the LABPulse stack
- **Laptop B** = Client machine being monitored

## 5. Setup on the Host machine

Run the stack on Laptop A.

Recommended if Docker is unavailable:

```bash
npm run local
```

Or with Docker:

```bash
npm run up
```

Then find Laptop A's LAN IP address. Example:

```text
192.168.0.20
```

If using local mode, other devices on the same network should open:

```text
http://192.168.0.20:5173
```

If using Docker mode:

```text
http://192.168.0.20:8080
```

The monitoring agent on other laptops will send heartbeats to:

```text
http://192.168.0.20:4000/api/monitoring/heartbeat
```

### Important firewall note

Laptop A must allow inbound connections on:
- `5173` for the local web app path
- `8080` for the Docker web app path
- `4000` for the backend API and agent heartbeats

If Windows Firewall blocks those ports, the second laptop will not be able to connect.

## 6. Setup on the second laptop

Yes, you need setup on the other laptop if you want **real monitoring**.

The Client web screen only registers the device.  
The **agent** is what actually reports CPU, RAM, uptime, and heartbeat data.

### Prerequisites on Laptop B
- Node.js 20+ installed
- access to this repo, or at minimum the `agent/` folder plus root `package.json` and `package-lock.json`

### Recommended approach
Clone the repo on Laptop B, then run:

```bash
npm ci
```

Create `agent/.env` based on `agent/.env.example`.

Use values like this:

```env
LABPULSE_SERVER_URL=http://192.168.0.20:4000/api/monitoring/heartbeat
LABPULSE_AGENT_SECRET=change-me-agent
LABPULSE_DEVICE_HOSTNAME=LAPTOP-B
LABPULSE_DEVICE_FINGERPRINT=laptop-b-001
LABPULSE_DEVICE_OS=Windows 11
LABPULSE_DEVICE_IP=192.168.0.25
LABPULSE_HEARTBEAT_MS=30000
```

Then run the agent:

```bash
npm run dev:agent
```

Or for a plain runtime command:

```bash
npm run start:agent
```

## 7. Full end-to-end test

### Step A: Register the device
On Laptop B:
1. Open `http://192.168.0.20:8080`
2. Sign in as Client
3. Open the Client page
4. Register the device using the same fingerprint/hostname values that the agent will use

### Step B: Approve it
On Laptop A:
1. Sign in as Host
2. Open **Registrations**
3. Approve the device

### Step C: Start real monitoring
On Laptop B:
1. Start the agent
2. Wait for heartbeats to reach the server

### Step D: Observe Host behavior
On Laptop A:
1. Open **Dashboard**
2. Confirm the device appears in the fleet
3. Open **Device Detail**
4. Confirm current metrics and freshness update

## 8. How monitoring works internally

The runtime flow is:

1. Client registers a device in the web app
2. Host approves the registration
3. Agent sends heartbeat payloads to `/api/monitoring/heartbeat`
4. Backend updates the device record and stores metric snapshots
5. Backend creates alerts if thresholds are crossed
6. Socket.IO broadcasts device/alert changes to the Host UI
7. Host dashboard refreshes fleet and alert state

If the agent stops sending data, the device becomes stale and then offline.

## 9. How to simulate alerts

To test alert creation in a realistic way:
- raise CPU or RAM values in the agent payload
- or temporarily stop the agent and wait for the stale/offline threshold

Current alert cases supported:
- `HIGH_CPU`
- `HIGH_RAM`
- `LOW_DISK`
- `OFFLINE`

## 10. CI/CD pipeline

Two GitHub Actions workflows are included:

### CI
File:
- `.github/workflows/ci.yml`

Runs on push and pull request:
- `npm ci`
- `npm run setup:env`
- `npm run lint`
- `npm run build`

### CD
File:
- `.github/workflows/cd.yml`

Runs on push to `main`:
- builds Docker images for `server` and `client`
- pushes images to GHCR

Published image names:
- `ghcr.io/<your-github-username>/labpulse-server`
- `ghcr.io/<your-github-username>/labpulse-client`

## 11. Practical limitations right now

Current implementation is enough for functional testing, but not yet a hardened production rollout.

Current gaps:
- no secure per-device enrollment handshake beyond shared secret
- no persistent agent installer/package yet
- no OS service registration for the agent yet
- no automatic threshold recovery resolution logic yet
- no production-grade secret management yet

## 12. Recommended next step

If you want real deployment behavior, the next engineering step should be:

1. package the agent as a proper background service
2. add per-device enrollment tokens
3. add production environment files and secret handling
4. add automatic alert recovery rules

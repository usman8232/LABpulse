# LABPulse

LABPulse is a monitoring-first laboratory management platform built as a single MERN web app with Host and Client access. It focuses on device registration, fleet monitoring, alerting, reports, and a lightweight device helper for live metrics.

## Workspace Layout

- `client/` React + Vite frontend
- `server/` Express + Socket.IO backend
- `agent/` local device helper written in Node.js

## Architecture

- **Client/Server model** with a central web application
- **N-tier + MVC** separation in the backend
- **Realtime sync** through Socket.IO
- **RBAC** with Host and Client roles

## Core Features

- Host and Client authentication
- Device registration and Host approval
- Live device heartbeats and health metrics
- Alert lifecycle tracking
- Monitoring dashboard with charts
- Print-friendly reports and trend views

## Recommended Setup

1. Install workspace dependencies: `npm install`
2. Copy `server/.env.example` to `server/.env`
3. Copy `agent/.env.example` to `agent/.env`
4. Optionally copy `client/.env.example` to `client/.env`
5. Start MongoDB locally
6. Run the backend: `npm run dev:server`
7. Run the frontend: `npm run dev:client`
8. Run the local helper on monitored machines: `npm run dev:agent`

## Notes

- The repository is scaffolded to support the four planned iterations.
- The helper is intentionally isolated so it can be replaced later without changing the web app contract.

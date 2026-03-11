# Event Sourcing Workshop

## Overview

This is a workshop on Event Sourcing. We will be using KurrentDB as the event store.

## Prerequisites

- [Node.js](https://nodejs.org/) v24 (LTS)
  - We recommend installing with [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm)
- [Docker](https://www.docker.com/products/docker-desktop/)

## Setup

### Install VS Code extensions

If using VS Code / Cursor, we recommend installing the extensions listed in [.vscode/extensions.json](.vscode/extensions.json). It should be a popup when opening the project in VS Code / Cursor.

### Create a .env file

(there should already be one in the root of the project, but if not, create one with the following content)

```bash
BACKEND_PORT=3002
API_URL=http://localhost:$BACKEND_PORT
CE_USE_BIG_INT=true
EVENT_STORE_CONNECTION_STRING=kurrentdb://localhost:2113?tls=false
MONGO_DB_CONNECTION_STRING=mongodb://localhost:27017

```

### Eventstore DB / external services

```bash
docker compose up -d
```

### Starting backend

```bash
cd backend
npm install
npm run dev
```

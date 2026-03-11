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

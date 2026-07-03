# Invoice Observability Lab

A lightweight fullstack Turborepo designed to demonstrate structured server-side logging and external log aggregation. The project consists of a Vite-powered frontend client that triggers paginated request cycles against an Express-based backend server.

## Overview

The primary goal of this application is to showcase production-ready observability principles by decoupling application logic from log visualization.

* **Client:** A minimal frontend interface for triggering simulated business operations (fetching invoices).
* **Server:** A TypeScript/Express API utilizing `pino` and `pino-http` to output high-performance, structured JSON telemetry.
* **Observability Layer:** The server skips terminal text dumping and streams telemetry directly to an external log-aggregation instance.

## Prerequisites

Before setting up the local workspace, ensure you have the following installed:

* **Node.js** (v18+ recommended)
* **Docker Engine / WSL 2** (Required to run the external logging container)

### Observability Dependency: Seq

This application requires an active **Seq** container running locally to accept, index, and visualize the structured JSON logs streamed from the backend API. The backend expects this service to be reachable at `http://127.0.0.1:5341`.

## Setup & Running

1. **Install Dependencies:**
From the root directory, install all workspace packages:
```bash
npm install

```


2. **Start the Logging Infrastructure:**
Ensure your local Docker daemon is running and start the `datalust/seq` container ensuring that:
* Port `5341` is exposed.
* The EULA is accepted.
* Authentication is configured/bypassed for local sandbox development.


3. **Launch the Development Environment:**
Run the Turborepo development script from the project root:
```bash
npm run dev

```


This concurrently spins up the Vite frontend (`http://localhost:5173`) and the Express backend (`http://localhost:3000`).

## Viewing Telemetry

Once both the monorepo and your Docker container are active, navigate to the local Seq dashboard in your browser. Interacting with the invoice management client will generate immediate, searchable, and structured HTTP and application logs within the dashboard interface.

import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const serverDir = resolve(rootDir, "server");
const clientDir = resolve(rootDir, "client");
const apiHealthUrl = "http://127.0.0.1:5000/api/health";
const children = new Set();
let stopping = false;

function startNode(args, cwd, name) {
  const child = spawn(process.execPath, args, { cwd, stdio: "inherit" });
  child.name = name;
  children.add(child);
  child.once("exit", (code, signal) => {
    children.delete(child);
    if (!stopping) {
      console.error(`${name} exited ${signal ? `after ${signal}` : `with code ${code}`}.`);
      stopChildren(code || 1);
    }
  });
  child.once("error", (error) => {
    console.error(`Could not start ${name}: ${error.message}`);
    stopChildren(1);
  });
  return child;
}

function stopChildren(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  process.exitCode = exitCode;
}

process.once("SIGINT", () => stopChildren(0));
process.once("SIGTERM", () => stopChildren(0));

async function waitForApi(server) {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null || server.signalCode !== null) {
      throw new Error(
        "The API stopped during startup. Check server/.env for JWT_SECRET and COOKIE_SECRET (each must be at least 32 characters)."
      );
    }

    if (await isApiHealthy()) return;

    await delay(500);
  }

  throw new Error(
    "The API did not become healthy within 60 seconds. Check the server output, MongoDB connection, and server/.env."
  );
}

async function isApiHealthy() {
  try {
    const response = await fetch(apiHealthUrl, { signal: AbortSignal.timeout(1000) });
    if (!response.ok) return false;
    const health = await response.json();
    return health.service === "himalayan-adventure-api";
  } catch {
    return false;
  }
}

try {
  if (await isApiHealthy()) {
    console.log("The Himalayan Adventure API is already healthy.");
  } else {
    console.log("Starting the Himalayan Adventure API...");
    const server = startNode(["--watch", "src/server.js"], serverDir, "API server");
    await waitForApi(server);
  }

  console.log("API is healthy. Starting the Vite client...");
  startNode([resolve(clientDir, "node_modules/vite/bin/vite.js")], clientDir, "Vite client");
} catch (error) {
  console.error(error.message);
  stopChildren(1);
}

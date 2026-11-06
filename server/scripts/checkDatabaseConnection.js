import dotenv from "dotenv";
import dns from "node:dns/promises";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(scriptDir, "../.env") });

const uri = process.env.MONGODB_URI?.trim();
if (!uri) {
  console.error("MONGODB_URI is missing from server/.env.");
  process.exit(1);
}

const scheme = uri.split(":")[0];
const host = uri.match(/^mongodb(?:\+srv)?:\/\/(?:[^@/]+@)?([^/?]+)/)?.[1];
console.log(`Configured URI scheme: ${scheme}; host present: ${Boolean(host)}.`);

function checkTcp(hostname, port, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: hostname, port });
    const finish = (result) => {
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish("reachable"));
    socket.once("timeout", () => finish("timeout"));
    socket.once("error", (error) => finish(error.code || "connection error"));
  });
}

let dnsPassed = scheme !== "mongodb+srv";
if (scheme === "mongodb+srv" && host) {
  try {
    const records = await dns.resolveSrv(`_mongodb._tcp.${host}`);
    dnsPassed = records.length > 0;
    console.log(`Atlas SRV DNS: ${records.length} host record(s) found.`);
    const probes = await Promise.all(records.map((record) => checkTcp(record.name, record.port)));
    const reachable = probes.filter((result) => result === "reachable").length;
    console.log(`MongoDB TCP 27017: ${reachable}/${records.length} Atlas host(s) reachable.`);
  } catch (error) {
    console.error(`Atlas SRV DNS lookup failed (${error.code || error.name}).`);
  }
}

try {
  const connection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 12000,
    connectTimeoutMS: 8000,
  });
  console.log(`MongoDB authentication and connection succeeded (${connection.connection.name}).`);
  await mongoose.disconnect();
} catch (error) {
  console.error(`MongoDB connection check failed (${error.name || "unknown error"}).`);
  const serverErrors = [...(error.reason?.servers?.values?.() || [])]
    .map((server) => server.error)
    .filter(Boolean);
  const errorCodes = [...new Set(serverErrors.map((item) => item.codeName || item.code || item.name).filter(Boolean))];
  if (errorCodes.length) console.error(`Atlas response code(s): ${errorCodes.join(", ")}.`);
  const details = [...new Set(serverErrors.map((item) => item.message).filter(Boolean))];
  for (const detail of details.slice(0, 3)) console.error(`Atlas connection detail: ${detail.slice(0, 240)}`);

  const messages = [error, ...serverErrors].map((item) => item.message || "").join(" ");
  if (error.code === 18 || /authentication failed|bad auth/i.test(messages)) {
    console.error("Atlas rejected the database credentials or authSource.");
  } else if (scheme === "mongodb+srv" && !dnsPassed) {
    console.error("Check DNS filtering or the Atlas cluster hostname in MONGODB_URI.");
  } else {
    console.error("Check the cluster status, Atlas Network Access IP list, and outbound TCP 27017 firewall rules.");
  }
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}

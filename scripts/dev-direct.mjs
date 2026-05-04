import { startServer } from "next/dist/server/lib/start-server.js";

// Local Windows sandbox workaround. Prefer `npm run dev` outside this environment.
const portArgIndex = process.argv.indexOf("--port");
const port =
  portArgIndex >= 0 && process.argv[portArgIndex + 1]
    ? Number(process.argv[portArgIndex + 1])
    : 3000;

process.env.NODE_ENV = "development";
process.env.__NEXT_DEV_SERVER = "1";
process.env.NEXT_PRIVATE_START_TIME = String(Date.now());
process.env.NEXT_PRIVATE_DEV_DIR = process.cwd();

await startServer({
  dir: process.cwd(),
  port,
  allowRetry: false,
  isDev: true,
  hostname: "localhost",
  serverFastRefresh: true,
});

setInterval(() => {}, 60 * 60 * 1000);

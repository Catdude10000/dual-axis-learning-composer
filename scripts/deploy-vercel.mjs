import fs from "node:fs";
import path from "node:path";

const token = process.env.VERCEL_TOKEN;
const root = process.cwd();
const distDir = path.join(root, "dist");

if (!token) {
  throw new Error("Missing VERCEL_TOKEN environment variable.");
}

if (!fs.existsSync(distDir)) {
  throw new Error("Missing dist folder. Run the Vite build before deploying.");
}

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walkFiles(fullPath) : [fullPath];
  });
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

const files = walkFiles(distDir).map((fullPath) => {
  const relativePath = toPosix(path.relative(distDir, fullPath));
  const bytes = fs.readFileSync(fullPath);
  const extension = path.extname(fullPath).toLowerCase();
  const textExtensions = new Set([".html", ".css", ".js", ".json", ".svg", ".txt", ".map"]);

  if (textExtensions.has(extension)) {
    return {
      file: relativePath,
      data: bytes.toString("utf8"),
      encoding: "utf-8"
    };
  }

  return {
    file: relativePath,
    data: bytes.toString("base64"),
    encoding: "base64"
  };
});

const payload = {
  name: "dual-axis-learning-composer",
  project: "dual-axis-learning-composer",
  target: "production",
  files,
  routes: [
    { handle: "filesystem" },
    { src: "/.*", dest: "/index.html" }
  ],
  projectSettings: {
    framework: null,
    buildCommand: null,
    devCommand: null,
    installCommand: null,
    outputDirectory: null
  }
};

const deploymentResponse = await fetch("https://api.vercel.com/v13/deployments", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
});

const deploymentText = await deploymentResponse.text();
let deployment;
try {
  deployment = JSON.parse(deploymentText);
} catch {
  deployment = { raw: deploymentText };
}

if (!deploymentResponse.ok) {
  console.error(JSON.stringify(deployment, null, 2));
  process.exit(1);
}

const deploymentId = deployment.id;
let ready = deployment.readyState === "READY" || deployment.status === "READY";
let lastState = deployment.readyState ?? deployment.status ?? "UNKNOWN";

for (let attempt = 0; !ready && attempt < 40; attempt += 1) {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  const statusResponse = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const status = await statusResponse.json();
  lastState = status.readyState ?? status.status ?? lastState;

  if (lastState === "READY") {
    deployment = status;
    ready = true;
    break;
  }

  if (lastState === "ERROR" || lastState === "CANCELED") {
    console.error(JSON.stringify(status, null, 2));
    process.exit(1);
  }
}

if (!ready) {
  console.error(`Deployment did not become ready. Last state: ${lastState}`);
  process.exit(1);
}

const url = deployment.url.startsWith("http") ? deployment.url : `https://${deployment.url}`;
console.log(JSON.stringify({ id: deploymentId, state: lastState, url }, null, 2));

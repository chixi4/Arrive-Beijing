#!/usr/bin/env node
import fs from "node:fs";
import { spawnSync } from "node:child_process";

function usage() {
  console.log(`Usage:
  node screenshot_mobile.mjs --url http://127.0.0.1:4173/#/page --out /tmp/page.png [--width 430] [--height 860] [--wait 1200]

Captures a fixed-size mobile screenshot using a locally installed Chrome/Chromium.`);
}

function parseArgs(argv) {
  const args = { width: 430, height: 860, wait: 1200 };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--url") args.url = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--width") args.width = Number(argv[++i]);
    else if (a === "--height") args.height = Number(argv[++i]);
    else if (a === "--wait") args.wait = Number(argv[++i]);
    else if (a === "--chrome") args.chrome = argv[++i];
    else throw new Error(`Unknown argument: ${a}`);
  }
  return args;
}

function chromeCandidates() {
  return [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "google-chrome",
    "chromium",
    "chromium-browser",
    "microsoft-edge",
  ];
}

function findChrome(explicit) {
  if (explicit) return explicit;
  for (const c of chromeCandidates()) {
    if (c.startsWith("/") && fs.existsSync(c)) return c;
    if (!c.startsWith("/")) {
      const r = spawnSync("sh", ["-lc", `command -v ${c}`], { encoding: "utf8" });
      if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
    }
  }
  throw new Error("Chrome/Chromium executable not found. Pass --chrome /path/to/chrome.");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return usage();
  if (!args.url || !args.out) throw new Error("--url and --out are required");
  const chrome = findChrome(args.chrome);
  const result = spawnSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--window-size=${args.width},${args.height}`,
    `--virtual-time-budget=${args.wait}`,
    `--screenshot=${args.out}`,
    args.url,
  ], { encoding: "utf8" });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || "Chrome screenshot failed\n");
    process.exit(result.status || 1);
  }
  console.log(JSON.stringify({ out: args.out, width: args.width, height: args.height, chrome }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  usage();
  process.exitCode = 2;
}


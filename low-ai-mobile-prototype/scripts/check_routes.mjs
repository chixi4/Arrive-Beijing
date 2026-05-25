#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function usage() {
  console.log(`Usage:
  node check_routes.mjs --root . --files app.js,index.html [--routes "#/a,#/b"]
  node check_routes.mjs --root . --files app.js --routes-file routes.json

Compares clickable hash targets with declared routes.
Declared routes are read from --routes, --routes-file, or inferred from object keys/case labels.
Targets are inferred from href/data-to/navigate-style strings.`);
}

function parseArgs(argv) {
  const args = { root: ".", files: [], routes: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--root") args.root = argv[++i];
    else if (a === "--files") args.files = argv[++i].split(",").filter(Boolean);
    else if (a === "--routes") args.routes = argv[++i].split(",").filter(Boolean);
    else if (a === "--routes-file") args.routesFile = argv[++i];
    else throw new Error(`Unknown argument: ${a}`);
  }
  return args;
}

const HASH = String.raw`#[/][A-Za-z0-9._~!$&'()*+,;=:@/%-]+`;

function readRoutesFile(root, file) {
  const p = path.resolve(root, file);
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.routes)) return data.routes;
  throw new Error("--routes-file must be a JSON array or an object with routes[]");
}

function inferDeclared(text) {
  const routes = new Set();
  const patterns = [
    new RegExp(`case\\s+["'](${HASH})["']`, "g"),
    new RegExp(`["'](${HASH})["']\\s*:`, "g"),
    new RegExp(`path\\s*:\\s*["'](${HASH})["']`, "g"),
    new RegExp(`route\\s*:\\s*["'](${HASH})["']`, "g"),
    new RegExp(`\\b(?:if|else\\s+if)\\s*\\([^)]*\\b(?:current|route|hash|path)\\s*={2,3}\\s*["'](${HASH})["']`, "g"),
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(text))) routes.add(m[1]);
  }
  return routes;
}

function inferTargets(text) {
  const targets = new Set();
  const patterns = [
    new RegExp(`\\b(?:href|data-to|data-route)\\s*=\\s*["'](${HASH})["']`, "g"),
    new RegExp(`\\b(?:navigate|go|push|setRoute)\\s*\\(\\s*["'](${HASH})["']`, "g"),
    new RegExp(`to\\s*:\\s*["'](${HASH})["']`, "g"),
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(text))) targets.add(m[1]);
  }
  return targets;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return usage();
  if (!args.files.length) throw new Error("--files is required");
  const root = path.resolve(args.root);

  const declared = new Set(args.routes);
  if (args.routesFile) for (const r of readRoutesFile(root, args.routesFile)) declared.add(r);
  const targets = new Set();

  for (const rel of args.files) {
    const file = path.resolve(root, rel);
    const text = fs.readFileSync(file, "utf8");
    for (const r of inferDeclared(text)) declared.add(r);
    for (const t of inferTargets(text)) targets.add(t);
  }

  if (!declared.size) {
    console.warn("No declared routes inferred. Pass --routes or --routes-file for strict checking.");
  }

  const missing = [...targets].filter((t) => declared.size && !declared.has(t)).sort();
  const result = {
    declaredCount: declared.size,
    targetCount: targets.size,
    missingCount: missing.length,
    missing,
    declared: [...declared].sort(),
    targets: [...targets].sort(),
  };
  console.log(JSON.stringify(result, null, 2));
  if (missing.length) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error.message);
  usage();
  process.exitCode = 2;
}

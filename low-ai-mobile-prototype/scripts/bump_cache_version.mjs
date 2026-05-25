#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function usage() {
  console.log(`Usage:
  node bump_cache_version.mjs --files index.html[,other.html] --version 20260525-1

Updates local .css and .js href/src query strings to ?v=<version>.
Only modifies quoted href/src attributes in the given HTML files.`);
}

function parseArgs(argv) {
  const args = { files: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--files") args.files = argv[++i].split(",").filter(Boolean);
    else if (a === "--version") args.version = argv[++i];
    else throw new Error(`Unknown argument: ${a}`);
  }
  return args;
}

function updateHtml(text, version) {
  return text.replace(/\b(src|href)=["']([^"']+\.(?:css|js))(?:\?[^"']*)?(#[^"']*)?["']/gi, (_m, attr, url, hash = "") => {
    if (/^(https?:|data:|blob:)/i.test(url)) return _m;
    return `${attr}="${url}?v=${version}${hash}"`;
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return usage();
  if (!args.files.length || !args.version) throw new Error("--files and --version are required");
  const changed = [];
  for (const file of args.files) {
    const p = path.resolve(file);
    const before = fs.readFileSync(p, "utf8");
    const after = updateHtml(before, args.version);
    if (after !== before) {
      fs.writeFileSync(p, after);
      changed.push(file);
    }
  }
  console.log(JSON.stringify({ version: args.version, changed }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  usage();
  process.exitCode = 2;
}


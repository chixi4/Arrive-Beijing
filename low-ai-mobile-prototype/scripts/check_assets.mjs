#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function usage() {
  console.log(`Usage:
  node check_assets.mjs --root . --html index.html[,other.html] [--include-css]

Checks local asset references in HTML and, optionally, linked CSS files.
Skips http(s), data:, mailto:, javascript:, hashes, and empty URLs.
Exits 1 when missing local files are found.`);
}

function parseArgs(argv) {
  const args = { root: ".", html: [], includeCss: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--root") args.root = argv[++i];
    else if (a === "--html") args.html = argv[++i].split(",").filter(Boolean);
    else if (a === "--include-css") args.includeCss = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  return args;
}

function stripUrl(raw) {
  if (!raw) return null;
  let value = raw.trim().replace(/^['"]|['"]$/g, "");
  if (!value || value.startsWith("#")) return null;
  if (/^(https?:|data:|mailto:|tel:|javascript:|blob:)/i.test(value)) return null;
  value = value.split("#")[0].split("?")[0];
  if (!value || value === "/") return null;
  return decodeURI(value);
}

function extractHtmlRefs(text) {
  const refs = [];
  const attrRe = /\b(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = attrRe.exec(text))) refs.push(m[1]);
  const srcsetRe = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
  while ((m = srcsetRe.exec(text))) {
    for (const part of m[1].split(",")) refs.push(part.trim().split(/\s+/)[0]);
  }
  return refs;
}

function extractCssRefs(text) {
  const refs = [];
  const urlRe = /url\(\s*([^)]+?)\s*\)/gi;
  let m;
  while ((m = urlRe.exec(text))) refs.push(m[1]);
  return refs;
}

function resolveRef(root, fromFile, ref) {
  const cleaned = stripUrl(ref);
  if (!cleaned) return null;
  if (cleaned.startsWith("/")) return path.join(root, cleaned.replace(/^\/+/, ""));
  return path.resolve(path.dirname(fromFile), cleaned);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return usage();
  if (!args.html.length) throw new Error("--html is required");

  const root = path.resolve(args.root);
  const missing = [];
  const checked = new Set();
  const cssFiles = new Set();

  for (const htmlRel of args.html) {
    const htmlPath = path.resolve(root, htmlRel);
    const html = fs.readFileSync(htmlPath, "utf8");
    for (const ref of extractHtmlRefs(html)) {
      const abs = resolveRef(root, htmlPath, ref);
      if (!abs) continue;
      checked.add(abs);
      if (!fs.existsSync(abs)) missing.push({ from: htmlPath, ref, resolved: abs });
      if (args.includeCss && /\.css$/i.test(abs)) cssFiles.add(abs);
    }
  }

  if (args.includeCss) {
    for (const cssPath of cssFiles) {
      if (!fs.existsSync(cssPath)) continue;
      const css = fs.readFileSync(cssPath, "utf8");
      for (const ref of extractCssRefs(css)) {
        const abs = resolveRef(root, cssPath, ref);
        if (!abs) continue;
        checked.add(abs);
        if (!fs.existsSync(abs)) missing.push({ from: cssPath, ref, resolved: abs });
      }
    }
  }

  const result = { checked: checked.size, missingCount: missing.length, missing };
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


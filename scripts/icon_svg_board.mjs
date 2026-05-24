#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function readArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) continue;
    args[key.slice(2)] = argv[index + 1];
    index += 1;
  }
  return args;
}

function extractIconLibrary(source) {
  const start = source.indexOf("const ICON_LIBRARY = {");
  if (start < 0) throw new Error("ICON_LIBRARY not found");
  const end = source.indexOf("\n};", start);
  if (end < 0) throw new Error("ICON_LIBRARY end not found");
  const body = source.slice(start, end);
  const icons = new Map();
  const pattern = /\n\s+([a-zA-Z0-9_]+):\s+`([\s\S]*?)`,/g;
  let match;
  while ((match = pattern.exec(body))) {
    icons.set(match[1], match[2]);
  }
  return icons;
}

function iconSvg(name, body, index, cellSize, iconSize, strokeWidth) {
  const col = index % 3;
  const row = Math.floor(index / 3);
  const x = col * cellSize + (cellSize - iconSize) / 2;
  const y = row * cellSize + (cellSize - iconSize) / 2;
  return [
    `<svg x="${x}" y="${y}" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24">`,
    `<g fill="none" stroke="#000" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">`,
    body,
    `</g>`,
    `</svg>`,
  ].join("");
}

function main() {
  const args = readArgs(process.argv);
  const names = (args.names || "").split(",").map((name) => name.trim()).filter(Boolean);
  if (names.length !== 9) throw new Error("--names must contain exactly 9 comma-separated names");
  if (!args.out) throw new Error("--out is required");

  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
  const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const icons = extractIconLibrary(appSource);
  const missing = names.filter((name) => !icons.has(name));
  if (missing.length) throw new Error(`Missing icon definitions: ${missing.join(", ")}`);

  const size = Number(args.size || 1254);
  const cellSize = size / 3;
  const iconSize = Number(args.iconSize || 246);
  const strokeWidth = Number(args.strokeWidth || 1.9);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `<rect width="${size}" height="${size}" fill="#fff"/>`,
    ...names.map((name, index) => iconSvg(name, icons.get(name), index, cellSize, iconSize, strokeWidth)),
    `</svg>`,
    "",
  ].join("\n");

  const outPath = path.resolve(root, args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, svg, "utf8");
  console.log(path.relative(root, outPath));
}

main();

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const APP = path.join(ROOT, "app.js");
const OUT = path.join(ROOT, "docs", "ui", "icon-inventory.json");

const source = fs.readFileSync(APP, "utf8");
const lines = source.split("\n");

function lineOf(index) {
  return source.slice(0, index).split("\n").length;
}

function extractObjectBody(name) {
  const start = source.indexOf(`const ${name} = {`);
  if (start < 0) return "";
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  return "";
}

const libraryBody = extractObjectBody("ICON_LIBRARY");
const aliasBody = extractObjectBody("ICON_ALIASES");
const library = [...libraryBody.matchAll(/^\s{2}([a-zA-Z0-9_-]+):\s*`/gm)].map((m) => m[1]).sort();
const aliases = Object.fromEntries([...aliasBody.matchAll(/^\s{2}([a-zA-Z0-9_-]+):\s*"([a-zA-Z0-9_-]+)"/gm)].map((m) => [m[1], m[2]]));

const usage = new Map();

function addUse(rawName, type, index) {
  const semantic = aliases[rawName] || rawName;
  const line = lineOf(index);
  const text = lines[line - 1].trim();
  const item = usage.get(rawName) || {
    semantic_name: rawName,
    resolved_icon: semantic,
    usage_count: 0,
    current_source: "inline-svg",
    component_contexts: new Set(),
    current_usage_files: ["app.js"],
    usage_locations: [],
    recommended_library_icon: "custom_svg_currentColor",
    size_token: "mixed",
    color_token: "currentColor",
    replacement_priority: "medium",
  };
  item.usage_count += 1;
  item.usage_locations.push({ file: "app.js", line, type, text });
  if (text.includes("ab-bottom-nav") || text.includes("bottomNav")) item.component_contexts.add("bottom-nav");
  else if (text.includes("ab-action") || text.includes("ActionGrid")) item.component_contexts.add("action-grid");
  else if (text.includes("ab-info") || text.includes("InfoRows")) item.component_contexts.add("cell");
  else if (text.includes("anchor")) item.component_contexts.add("style-anchor");
  else if (text.includes("topbar") || text.includes("icon-btn")) item.component_contexts.add("button");
  else item.component_contexts.add("page");
  usage.set(rawName, item);
}

for (const match of source.matchAll(/\b(iconMarkup|anchorIcon)\(\s*(["'`])([^"'`]+)\2/g)) {
  addUse(match[3], match[1], match.index);
}

for (const match of source.matchAll(/\bicon\s*:\s*(["'`])([^"'`]+)\1/g)) {
  addUse(match[2], "icon-property", match.index);
}

const icons = [...usage.values()]
  .map((item) => {
    const contexts = [...item.component_contexts].sort();
    let size = "icon_md";
    if (contexts.includes("bottom-nav")) size = "icon_lg";
    if (contexts.includes("cell")) size = "icon_sm";
    const missing = !library.includes(item.resolved_icon);
    return {
      ...item,
      component_contexts: contexts,
      size_token: size,
      replacement_priority: missing ? "high" : item.usage_count >= 4 ? "high" : item.usage_count >= 2 ? "medium" : "low",
      status: missing ? "missing_from_library" : "available",
    };
  })
  .sort((a, b) => b.usage_count - a.usage_count || a.semantic_name.localeCompare(b.semantic_name));

const missing = icons.filter((item) => item.status === "missing_from_library").map((item) => item.semantic_name);
const unused = library.filter((name) => !icons.some((item) => item.resolved_icon === name));

const result = {
  generated_at: new Date().toISOString(),
  source_file: "app.js",
  rules: {
    text_extraction: "No OCR or bitmap-to-text extraction is used.",
    final_asset_policy: "Final UI icons are SVG/currentColor. Generated 3x3 boards are calibration references, not page text sources.",
    renderer: "iconMarkup(name) and anchorIcon(name) both resolve through ICON_LIBRARY.",
  },
  summary: {
    library_count: library.length,
    alias_count: Object.keys(aliases).length,
    used_semantic_count: icons.length,
    missing_count: missing.length,
    unused_library_count: unused.length,
  },
  aliases,
  missing,
  unused_library_icons: unused,
  icons,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result.summary, null, 2));
if (missing.length) {
  console.error(`Missing icons: ${missing.join(", ")}`);
  process.exitCode = 1;
}

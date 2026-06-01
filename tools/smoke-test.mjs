import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const expectedOrder = [
  'id="research"',
  'id="clarify"',
  'id="autodev"',
  'id="frontend"',
  "<h3>GStack</h3>",
  "<h3>Superpowers</h3>",
];

let previousIndex = -1;
for (const label of expectedOrder) {
  const index = html.indexOf(label);
  assert(index !== -1, `Missing section label: ${label}`);
  assert(index > previousIndex, `Section is out of order: ${label}`);
  previousIndex = index;
}

const requiredLinks = [
  "https://github.com/wangjialiang678/research-workflow-skill",
  "https://github.com/wangjialiang678/claude-auto-dev",
  "https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design",
  "https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb",
  "https://github.com/garrytan/gstack",
  "https://github.com/obra/superpowers",
];

for (const link of requiredLinks) {
  assert(html.includes(`href="${link}"`), `Missing clickable link: ${link}`);
  assert(html.includes(`data-copy="${link}"`), `Missing copy button for: ${link}`);
}

const requiredCommands = [
  "/plugin marketplace add wangjialiang678/claude-auto-dev",
  "/plugin install claude-auto-dev@claude-auto-dev",
  "/plugin install frontend-design@claude-plugins-official",
  "/plugin install superpowers@claude-plugins-official",
];

for (const command of requiredCommands) {
  assert(html.includes(command), `Missing copyable command: ${command}`);
}

const forbiddenStudentFacingDetails = [
  "/Users/michael",
  ".agent/",
  ".claude/",
  "feishu.cn/docx",
  "OpenClaw 目录",
  "待补充",
  "supermind",
  "super-opc",
];

for (const detail of forbiddenStudentFacingDetails) {
  assert(!html.includes(detail), `Student-facing page leaks internal detail: ${detail}`);
}

assert(html.includes("navigator.clipboard.writeText"), "Copy buttons must use clipboard API");
assert(html.includes('data-testid="learning-path"'), "Missing learning path landmark");
assert(html.includes('data-testid="resource-grid"'), "Missing resource grid landmark");

console.log("Smoke test passed: student-facing training page content is valid.");

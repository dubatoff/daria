import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";

const runtimeRequire = createRequire("C:/Users/dubat/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js");
const { chromium } = runtimeRequire("playwright");

const outputDir = path.resolve("artifacts/cursor-video");
await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: outputDir, size: { width: 1280, height: 720 } } });
const page = await context.newPage();
await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(5200);

await page.mouse.move(980, 170);
await page.waitForTimeout(800);
for (const [x, y] of [[920,190],[850,220],[780,250],[700,280],[620,310],[540,335]]) {
  await page.mouse.move(x, y, { steps: 5 });
  await page.waitForTimeout(90);
}
await page.waitForTimeout(500);

const aboutLink = page.getByRole("link", { name: "Обо мне" });
const box = await aboutLink.boundingBox();
if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 8 });
await page.waitForTimeout(700);

await page.evaluate(() => document.querySelector("#about")?.scrollIntoView({ behavior: "instant", block: "start" }));
await page.waitForTimeout(500);
for (const [x, y] of [[930,180],[850,220],[760,265],[670,305],[590,340]]) {
  await page.mouse.move(x, y, { steps: 5 });
  await page.waitForTimeout(110);
}
await page.waitForTimeout(900);

const video = page.video();
await context.close();
await browser.close();
if (!video) throw new Error("Video recording was not created");
const recordedPath = await video.path();
const finalPath = path.resolve("artifacts/butterfly-cursor-demo-raw.webm");
await fs.copyFile(recordedPath, finalPath);
console.log(finalPath);

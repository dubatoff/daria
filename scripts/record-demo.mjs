import puppeteer from "puppeteer-core";
import ffmpegPath from "ffmpeg-static";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const frames = "recording-frames";
rmSync(frames, { recursive: true, force: true }); mkdirSync(frames);
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
const client = await page.createCDPSession(); let count = 0;
client.on("Page.screencastFrame", async ({ data, sessionId }) => { count += 1; writeFileSync(`${frames}/${String(count).padStart(5, "0")}.jpg`, Buffer.from(data, "base64")); await client.send("Page.screencastFrameAck", { sessionId }); });
await client.send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: 1440, maxHeight: 900, everyNthFrame: 1 });
await page.reload({ waitUntil: "networkidle0" }); await page.mouse.move(1390, 760); await new Promise((resolve) => setTimeout(resolve, 7600));
for (const selector of ['a[href="#top"]', 'a[href="#about"]', 'a[href="#projects"]', 'a[href="#contacts"]']) { const element = await page.$(selector), box = await element?.boundingBox(); if (box) { await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 14 }); await new Promise((resolve) => setTimeout(resolve, 650)); } }
await page.mouse.move(720, 660, { steps: 18 }); await new Promise((resolve) => setTimeout(resolve, 600));
await client.send("Page.stopScreencast"); await browser.close();
spawnSync(ffmpegPath, ["-y", "-framerate", "30", "-i", `${frames}/%05d.jpg`, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "portfolio-o-and-cursor.mp4"], { stdio: "inherit" });
rmSync(frames, { recursive: true, force: true });

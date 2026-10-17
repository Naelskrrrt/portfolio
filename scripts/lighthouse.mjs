import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import { launch } from "chrome-launcher";

const baseURL = new URL(process.argv[2] || "http://localhost:3000");
const outputDir = path.resolve(process.argv[3] || "reports/lighthouse");
const requestedPaths = process.argv.slice(4);
let sitemap = "";
if (!requestedPaths.length) {
  const response = await fetch(new URL("/sitemap.xml", baseURL), { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Sitemap: HTTP ${response.status}`);
  sitemap = await response.text();
}
const paths = requestedPaths.length ? requestedPaths : [...new Set(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname),
)];
if (!paths.length) throw new Error("The sitemap contains no pages");
await mkdir(outputDir, { recursive: true });
const results = [];

// Sequential runs avoid CPU contention skewing performance measurements.
for (const pathname of paths) {
  for (const device of ["mobile", "desktop"]) {
    const chrome = await launch({ chromeFlags: ["--headless"] });
    try {
      const url = new URL(pathname, baseURL).href;
      const result = await lighthouse(url, {
        port: chrome.port,
        logLevel: "error",
        output: ["json", "html"],
      }, device === "desktop" ? desktopConfig : undefined);
      if (!result || result.lhr.runtimeError) {
        throw new Error(result?.lhr.runtimeError?.message || "Missing Lighthouse result");
      }
      if (result.lhr.configSettings.formFactor !== device) {
        throw new Error(`Unexpected Lighthouse device: ${result.lhr.configSettings.formFactor}`);
      }
      const name = `${pathname.replace(/[^a-z0-9-]+/gi, "_") || "home"}-${device}`;
      await writeFile(path.join(outputDir, `${name}.json`), result.report[0]);
      await writeFile(path.join(outputDir, `${name}.html`), result.report[1]);
      const scores = Object.fromEntries(Object.entries(result.lhr.categories)
        .map(([id, category]) => [id, Math.round(category.score * 100)]));
      const passed = Object.values(result.lhr.categories).every((category) => category.score === 1);
      const entry = { pathname, device, scores, passed, report: `${name}.html` };
      results.push(entry);
      console.log(JSON.stringify(entry));
    } catch (error) {
      results.push({ pathname, device, passed: false, error: String(error) });
      console.error(`${pathname} (${device}): ${error}`);
    } finally {
      await chrome.kill();
    }
    await writeFile(path.join(outputDir, "summary.json"), JSON.stringify({
      baseURL: baseURL.href, measuredAt: new Date().toISOString(), results,
    }, null, 2));
  }
}
if (results.some((result) => !result.passed)) process.exitCode = 1;

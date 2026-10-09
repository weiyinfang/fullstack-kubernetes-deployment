// Screenshots of the running app for the README.
// Usage: node screenshots.mjs <url> <output dir>
import { chromium } from 'playwright';

const [url, outDir] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: `${outDir}/home.png` });

// Pages are tabs in React state, not routes, so click the nav buttons.
for (const tab of ['Courses', 'Students']) {
  await page.locator('nav').getByRole('button', { name: tab, exact: true }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/${tab.toLowerCase()}.png` });
}

await browser.close();

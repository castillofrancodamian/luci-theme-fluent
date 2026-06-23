import fs from "fs";
import path from "path";
import { chromium } from "playwright";
import sharp from "sharp";

const screenshotsOutput = path.resolve(process.cwd(), "screenshots");
const screenshotsDir = path.resolve(screenshotsOutput, ".cache");

async function generateShowcaseBanner() {
  console.log("Generating showcase banner using Playwright...");

  // Verify that required screenshot files exist
  const requiredFiles = ["overview.png", "tablet_overview.png", "mobile_overview.png"];
  for (const file of requiredFiles) {
    const filePath = path.join(screenshotsDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: Required screenshot ${file} not found at ${filePath}. Showcase banner might have broken image links.`);
    }
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set 1080P viewport size
  await page.setViewportSize({ width: 1920, height: 1080 });

  const htmlPath = path.resolve(process.cwd(), "src/script/screenshot/showcase.html");
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`HTML template file not found at ${htmlPath}`);
  }

  console.log(`Loading HTML template: file://${htmlPath}`);
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });

  // Wait a bit to ensure image rendering and layout settles
  await page.waitForTimeout(1500);

  const outputPath = path.join(screenshotsOutput, "showcase_banner.png");
  await page.screenshot({ path: outputPath, type: "png" });
  console.log(`✓ Showcase banner generated successfully at: ${outputPath}`);

  await browser.close();
}

/**
 * Generic helper to generate a split-screen (slider) comparison image from Light and Dark mode screenshots.
 */
async function createSplitComparison(lightName: string, darkName: string, outputName: string, label: string) {
  console.log(`Generating 45-degree split comparison for ${label}...`);

  const lightPath = path.join(screenshotsDir, lightName);
  const darkPath = path.join(screenshotsDir, darkName);
  const outPath = path.join(screenshotsOutput, outputName);

  if (!fs.existsSync(lightPath) || !fs.existsSync(darkPath)) {
    console.warn(`Warning: Missing ${lightName} or ${darkName}. Skipping split comparison for ${label}.`);
    return;
  }

  try {
    const lightMeta = await sharp(lightPath).metadata();
    const width = lightMeta.width || 1280;
    const height = lightMeta.height || 720;

    // Calculate a true 45-degree line passing through the center of the image.
    // At 45 degrees, dx = dy.
    // To rotate 90 degrees, we slope from top-right (centerX + centerY) to bottom-left (centerX - centerY).
    const centerX = width / 2;
    const centerY = height / 2;
    const topX = Math.round(centerX + centerY);
    const bottomX = Math.round(centerX - centerY);

    // 1. Create a 45-degree angle mask (left half) for the Light mode image
    const maskSvg = `<svg width="${width}" height="${height}">
      <polygon points="0,0 ${topX},0 ${bottomX},${height} 0,${height}" fill="white" />
    </svg>`;

    const maskedLight = await sharp(lightPath)
      .ensureAlpha()
      .composite([{ input: Buffer.from(maskSvg), blend: "dest-in" }])
      .png()
      .toBuffer();

    // 2. Create modern premium labels overlay SVG (no dividing line)
    // Structured to match Microsoft Fluent 2 Design UI cards (rx=8, Fluent color tokens & Segoe UI typography)
    const overlaySvg = `<svg width="${width}" height="${height}">
      <defs>
        <filter id="fluent-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.18" />
        </filter>
      </defs>

      <!-- Light Mode Badge (Top-Left) -->
      <g transform="translate(80, 80)" filter="url(#fluent-shadow)">
        <!-- Card Container -->
        <rect width="176" height="56" rx="9" fill="#ffffff" stroke="#e6e6e6" stroke-width="1" />
        <!-- Label Text -->
        <text x="88" y="28" dy="0.32em" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17px" font-weight="650" fill="#242424" text-anchor="middle">Light Mode</text>
      </g>

      <!-- Dark Mode Badge (Bottom-Right) -->
      <g transform="translate(${width - 250}, ${height - 134})" filter="url(#fluent-shadow)">
        <!-- Card Container -->
        <rect width="176" height="56" rx="9" fill="#292929" stroke="#404040" stroke-width="1" />
        <!-- Label Text -->
        <text x="88" y="28" dy="0.32em" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17px" font-weight="650" fill="#ffffff" text-anchor="middle">Dark Mode</text>
      </g>
    </svg>`;

    // 3. Composite Dark Mode as background and the masked Light Mode + labels on top
    await sharp(darkPath)
      .composite([
        { input: maskedLight, left: 0, top: 0 },
        { input: Buffer.from(overlaySvg), left: 0, top: 0 },
      ])
      .png()
      .toFile(outPath);

    console.log(`✓ Split comparison image saved: ${outputName}`);
  } catch (err) {
    console.error(`Error generating split comparison for ${label}:`, err);
  }
}

async function createMultiDiagonalComparison(lightName: string, darkName: string, outputName: string, label: string) {
  console.log(`Generating multi-diagonal comparison for ${label}...`);

  const lightPath = path.join(screenshotsDir, lightName);
  const darkPath = path.join(screenshotsDir, darkName);
  const outPath = path.join(screenshotsOutput, outputName);

  if (!fs.existsSync(lightPath) || !fs.existsSync(darkPath)) {
    console.warn(`Warning: Missing ${lightName} or ${darkName}. Skipping multi-diagonal comparison for ${label}.`);
    return;
  }

  try {
    const lightMeta = await sharp(lightPath).metadata();
    const width = lightMeta.width || 1280;
    const height = lightMeta.height || 720;
    const diagonalSpan = width + height;

    const buildBandPolygon = (start: number, end: number) => {
      const points: Array<{ x: number; y: number }> = [];
      const addPoint = (x: number, y: number) => {
        if (x < 0 || x > width || y < 0 || y > height) {
          return;
        }

        const exists = points.some((point) => Math.abs(point.x - x) < 0.5 && Math.abs(point.y - y) < 0.5);
        if (!exists) {
          points.push({ x, y });
        }
      };

      const corners = [
        { x: 0, y: 0 },
        { x: width, y: 0 },
        { x: width, y: height },
        { x: 0, y: height },
      ];

      for (const corner of corners) {
        const sum = corner.x + corner.y;
        if (sum >= start && sum <= end) {
          addPoint(corner.x, corner.y);
        }
      }

      for (const boundary of [start, end]) {
        addPoint(boundary, 0);
        addPoint(0, boundary);
        addPoint(boundary - height, height);
        addPoint(width, boundary - width);
      }

      const center = points.reduce(
        (acc, point) => ({ x: acc.x + point.x / points.length, y: acc.y + point.y / points.length }),
        { x: 0, y: 0 },
      );

      if (points.length < 3) {
        return "0,0 0,0 0,0";
      }

      const sorted = points.sort(
        (a, b) => Math.atan2(a.y - center.y, a.x - center.x) - Math.atan2(b.y - center.y, b.x - center.x),
      );

      return sorted.map((point) => `${Math.round(point.x)},${Math.round(point.y)}`).join(" ");
    };

    const bandRatios = [0, 0.2, 0.42, 0.68, 1];
    const bandRanges = bandRatios.slice(0, -1).map((ratio, index) => ({
      start: diagonalSpan * ratio,
      end: diagonalSpan * bandRatios[index + 1],
    }));

    const buildMaskSvg = (indices: number[]) => {
      const polygons = indices
        .map((index) => `<polygon points="${buildBandPolygon(bandRanges[index].start, bandRanges[index].end)}" fill="white" />`)
        .join("");

      return `<svg width="${width}" height="${height}">${polygons}</svg>`;
    };

    const lightMaskSvg = buildMaskSvg([0, 2]);
    const darkMaskSvg = buildMaskSvg([1, 3]);

    const labelsSvg = `<svg width="${width}" height="${height}">
      <defs>
        <filter id="fluent-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.18" />
        </filter>
      </defs>

      <g transform="translate(56, 72)" filter="url(#fluent-shadow)">
        <rect width="176" height="56" rx="9" fill="#ffffff" stroke="#e6e6e6" stroke-width="1" />
        <text x="88" y="28" dy="0.32em" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17px" font-weight="650" fill="#242424" text-anchor="middle">Light Mode</text>
      </g>

      <g transform="translate(${width - 228}, ${height - 126})" filter="url(#fluent-shadow)">
        <rect width="176" height="56" rx="9" fill="#292929" stroke="#404040" stroke-width="1" />
        <text x="88" y="28" dy="0.32em" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17px" font-weight="650" fill="#ffffff" text-anchor="middle">Dark Mode</text>
      </g>
    </svg>`;

    const maskedLight = await sharp(lightPath)
      .ensureAlpha()
      .composite([{ input: Buffer.from(lightMaskSvg), blend: "dest-in" }])
      .png()
      .toBuffer();

    const maskedDark = await sharp(darkPath)
      .ensureAlpha()
      .composite([{ input: Buffer.from(darkMaskSvg), blend: "dest-in" }])
      .png()
      .toBuffer();

    await sharp(darkPath)
      .composite([
        { input: maskedLight, left: 0, top: 0 },
        { input: maskedDark, left: 0, top: 0 },
        { input: Buffer.from(labelsSvg), left: 0, top: 0 },
      ])
      .png()
      .toFile(outPath);

    console.log(`✓ Multi-diagonal comparison image saved: ${outputName}`);
  } catch (err) {
    console.error(`Error generating multi-diagonal comparison for ${label}:`, err);
  }
}

async function main() {
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  try {
    // 1. Generate showcase banner with Playwright
    await generateShowcaseBanner();

    // 2. Generate theme comparison for Login page (Scheme B)
    await createSplitComparison("login_password.png", "dark_login_password.png", "login_theme_comparison.png", "Login Page");

    await createMultiDiagonalComparison("overview.png", "dark_overview.png", "overview_theme_comparison.png", "Overview Dashboard");

    console.log("\n★ Processing and compilation of promotional images completed!");
  } catch (error) {
    console.error("Error processing screenshots:", error);
    process.exit(1);
  }
}

main();

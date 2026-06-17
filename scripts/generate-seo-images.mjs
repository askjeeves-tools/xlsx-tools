import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const iconsSourceDir = join(root, "assets", "icons", "source");
const vendorFavicon = join(
	root,
	"vendor",
	"@askjeeves",
	"ui",
	"assets",
	"favicon-32x32.png",
);

mkdirSync(publicDir, { recursive: true });

const brand = "#8c5cf5";
const brandDark = "#6b3fd4";

function buildSvg(width, height, titleSize, subtitleSize) {
	return Buffer.from(`
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${brand}" />
      <stop offset="100%" stop-color="${brandDark}" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <text x="50%" y="42%" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="${titleSize}" font-weight="700">Free Secure Excel Converter</text>
  <text x="50%" y="58%" text-anchor="middle" fill="#f3ecff" font-family="Segoe UI, Arial, sans-serif" font-size="${subtitleSize}" font-weight="500">Free · Secure · In-browser</text>
  <text x="50%" y="78%" text-anchor="middle" fill="#e8dcff" font-family="Segoe UI, Arial, sans-serif" font-size="${Math.round(subtitleSize * 0.85)}" font-weight="500">Ask Jeeves</text>
</svg>`);
}

await sharp(buildSvg(1200, 630, 72, 34))
	.png()
	.toFile(join(publicDir, "og.png"));

const faviconSource = join(iconsSourceDir, "favicon.png");
const appleSource = join(iconsSourceDir, "apple-touch-icon.png");
const favicon16Source = join(iconsSourceDir, "favicon-16x16.png");

if (existsSync(faviconSource)) {
	mkdirSync(dirname(vendorFavicon), { recursive: true });
	await sharp(faviconSource)
		.png({ compressionLevel: 9 })
		.toFile(join(publicDir, "favicon.ico"));
	await sharp(faviconSource)
		.png({ compressionLevel: 9 })
		.toFile(vendorFavicon);
} else {
	await sharp(buildSvg(32, 32, 8, 4))
		.png()
		.toFile(join(publicDir, "favicon.ico"));
}

if (existsSync(appleSource)) {
	await sharp(appleSource)
		.png({ compressionLevel: 9 })
		.toFile(join(publicDir, "apple-touch-icon.png"));
} else {
	await sharp(buildSvg(180, 180, 22, 12))
		.png()
		.toFile(join(publicDir, "apple-touch-icon.png"));
}

if (existsSync(favicon16Source)) {
	await sharp(favicon16Source)
		.png({ compressionLevel: 9 })
		.toFile(join(publicDir, "favicon-16x16.png"));
}

console.log("Generated public/og.png, apple-touch-icon.png, and favicon.ico");

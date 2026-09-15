// Favicon + app icons from the Higgsfield icon source (mark on black) -> 16/32/180/512 via sharp.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
mkdirSync("public/icons", { recursive: true });
const src = "design/raw/icon-source.png";
const sizes = [[16, "favicon-16.png"], [32, "favicon-32.png"], [180, "apple-touch-icon.png"], [192, "icon-192.png"], [512, "icon-512.png"]];
for (const [s, name] of sizes) {
  await sharp(src).resize(s, s, { fit: "cover", kernel: "lanczos3" }).png({ compressionLevel: 9 }).toFile(`public/icons/${name}`);
}
// maskable: extra black padding so the mark survives the safe zone
await sharp(src).resize(400, 400).extend({ top: 56, bottom: 56, left: 56, right: 56, background: "#000" }).png().toFile("public/icons/icon-512-maskable.png");
console.log("icons ok");

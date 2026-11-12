import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const publicDir = path.resolve('public');
const svgPath = path.join(publicDir, 'icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// iOS apple-touch-icon および PWA maskable 用に、背景の rect の rx を 0（フルフィル）にしたバリエーション
const fullBleedSvg = svgContent
  .replace(/<rect width="512" height="512" rx="112"/g, '<rect width="512" height="512"')
  .replace(/<rect x="14" y="14" width="484" height="484" rx="98"/g, '<rect x="14" y="14" width="484" height="484" rx="32"')
  .replace(/<rect x="19" y="19" width="474" height="474" rx="93"/g, '<rect x="19" y="19" width="474" height="474" rx="28"');

const targets = [
  { file: 'favicon-48x48.png', size: 48, svg: svgContent },
  { file: 'apple-touch-icon.png', size: 180, svg: fullBleedSvg },
  { file: 'pwa-192x192.png', size: 192, svg: fullBleedSvg },
  { file: 'pwa-512x512.png', size: 512, svg: fullBleedSvg },
];

for (const target of targets) {
  const resvg = new Resvg(target.svg, {
    fitTo: {
      mode: 'width',
      value: target.size,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  const outPath = path.join(publicDir, target.file);
  fs.writeFileSync(outPath, pngBuffer);
  console.log(`✓ Generated ${target.file} (${target.size}x${target.size}) [${pngBuffer.length} bytes]`);
}

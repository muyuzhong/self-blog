/* 生成 og.png(1200×630):低温笔记的社交分享图。运行:node scripts/generate-og.mjs */
import sharp from 'sharp';

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0b0d12"/>
  <!-- 冷轨 -->
  <line x1="72" y1="0" x2="72" y2="630" stroke="#232833" stroke-width="1"/>
  <text x="52" y="600" fill="#555c6b" font-family="Consolas, monospace" font-size="16"
        letter-spacing="4" transform="rotate(-90 52 600)" text-anchor="start">LOWTEMP NOTES</text>

  <!-- LT 羽标 -->
  <g transform="translate(160, 150) scale(4)" fill="none" stroke="#d8dce6" stroke-width="1.5" stroke-linecap="square">
    <path d="M9 5 V26 H21"/>
    <line x1="11" y1="9" x2="21" y2="4"/>
    <line x1="11" y1="13" x2="19" y2="8.5"/>
    <line x1="11" y1="17" x2="17" y2="13"/>
    <line x1="11" y1="21" x2="15" y2="17.5" stroke="#8b82d9"/>
  </g>

  <text x="340" y="218" fill="#d8dce6" font-family="'Noto Serif SC', 'Source Han Serif SC', SimSun, serif"
        font-size="88" font-weight="600">低温笔记</text>
  <text x="340" y="290" fill="#858b99" font-family="'Microsoft YaHei', 'PingFang SC', sans-serif"
        font-size="30">在噪声退去之后,记录仍然成立的东西。</text>

  <text x="160" y="470" fill="#555c6b" font-family="Consolas, monospace" font-size="20"
        letter-spacing="3">AGENT ENGINEERING · CODING AGENT · RAG · SYSTEMS</text>

  <line x1="160" y1="520" x2="1040" y2="520" stroke="#232833" stroke-width="1"/>
  <circle cx="172" cy="556" r="4" fill="#70aaa6"/>
  <text x="190" y="563" fill="#555c6b" font-family="Consolas, monospace" font-size="18"
        letter-spacing="2">LOWTEMP SYSTEM · QUIET · OPERATIONAL</text>
  <text x="1040" y="563" fill="#8b82d9" font-family="Consolas, monospace" font-size="18"
        letter-spacing="2" text-anchor="end">12.7°C</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('og.png generated');

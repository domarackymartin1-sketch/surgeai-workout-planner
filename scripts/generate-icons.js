const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(size) {
  const width = size;
  const height = size;
  const raw = Buffer.alloc((width * height + height) * 4 + height);

  let offset = 0;
  for (let y = 0; y < height; y++) {
    raw[offset++] = 0;
    for (let x = 0; x < width; x++) {
      const cx = x - width / 2;
      const cy = y - height / 2;
      const dist = Math.sqrt(cx * cx + cy * cy);
      const inCircle = dist < width * 0.35;
      const inText = x > width * 0.3 && x < width * 0.7 && y > height * 0.25 && y < height * 0.75;

      if (inText || inCircle) {
        raw[offset++] = 0;
        raw[offset++] = 255;
        raw[offset++] = 102;
        raw[offset++] = 255;
      } else {
        raw[offset++] = 0;
        raw[offset++] = 0;
        raw[offset++] = 0;
        raw[offset++] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(raw);

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0);
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr[16] = 8;
  ihdr[17] = 6;
  ihdr[18] = 0;
  ihdr[19] = 0;
  ihdr[20] = 0;
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdr.slice(8, 21)]));
  ihdr.writeUInt32BE(ihdrCrc, 21);

  const idatLen = Buffer.alloc(4);
  idatLen.writeUInt32BE(compressed.length, 0);
  const idatType = Buffer.from('IDAT');
  const idatCrc = crc32(Buffer.concat([idatType, compressed]));
  const idatCrcBuf = Buffer.alloc(4);
  idatCrcBuf.writeUInt32BE(idatCrc, 0);

  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

  return Buffer.concat([signature, ihdr, idatLen, idatType, compressed, idatCrcBuf, iend]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const publicDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createPNG(192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createPNG(512));
console.log('Icons generated');

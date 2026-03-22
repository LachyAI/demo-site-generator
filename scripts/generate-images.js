const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = '4ba796cd-7cce-4793-bd24-1ff254e5c9f6';
const BASE_URL = 'cloud.leonardo.ai';
const MODEL_ID = 'de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3'; // Phoenix 1.0
const OUTPUT_DIR = path.join(__dirname, '..', 'generated-images');

const IMAGES = [
  {
    filename: 'fence-deck-1.jpg',
    prompt: 'Freshly repaired timber paling fence in an Australian backyard, new timber blending with existing, sunny day, green lawn visible, professional photography, natural lighting, no text no watermarks no logos'
  },
  {
    filename: 'fence-deck-2.jpg',
    prompt: 'Restored hardwood timber deck with fresh oil finish, outdoor furniture visible, suburban home, professional photography, warm afternoon light, no text no watermarks no logos'
  },
  {
    filename: 'gyprock-1.jpg',
    prompt: 'Seamless plaster wall repair on interior white wall, smooth finish ready for paint, close-up showing professional quality, soft natural window light, no text no watermarks no logos'
  },
  {
    filename: 'gyprock-2.jpg',
    prompt: 'Handyman applying plaster to repair hole in drywall, work in progress, drop sheets on floor, neat professional workspace, no text no watermarks no logos'
  },
  {
    filename: 'door-lock-1.jpg',
    prompt: 'New brushed nickel door handle installed on white interior door, close-up detail shot, modern home, clean and bright, no text no watermarks no logos'
  },
  {
    filename: 'door-lock-2.jpg',
    prompt: 'Handyman adjusting wooden front door with tools, residential entrance, suburban home exterior, professional workwear, no text no watermarks no logos'
  },
  {
    filename: 'flatpack-1.jpg',
    prompt: 'Assembled white bookshelf in a modern living room, books neatly arranged, clean bright interior, professional photography, no text no watermarks no logos'
  },
  {
    filename: 'flatpack-2.jpg',
    prompt: 'Assembled wooden desk and office chair in home office, cable management visible, clean organized, natural light from window, no text no watermarks no logos'
  },
  {
    filename: 'painting-1.jpg',
    prompt: 'Freshly painted white interior wall with crisp edges at ceiling line, roller and tray visible, drop sheets, professional finish, no text no watermarks no logos'
  },
  {
    filename: 'painting-2.jpg',
    prompt: 'Interior room with one wall freshly painted warm gray, painters tape being removed, clean lines, bright natural light, no text no watermarks no logos'
  },
  {
    filename: 'silicone-1.jpg',
    prompt: 'Fresh white silicone sealant applied around modern bathroom shower screen, clean grout lines, tiled wall, professional finish, no text no watermarks no logos'
  },
  {
    filename: 'silicone-2.jpg',
    prompt: 'Kitchen sink with fresh silicone seal around edges, stainless steel tap, stone benchtop, clean and bright, no text no watermarks no logos'
  },
  {
    filename: 'pressure-clean-1.jpg',
    prompt: 'Half-cleaned concrete driveway showing dramatic before and after, pressure washer visible, suburban home, no text no watermarks no logos'
  },
  {
    filename: 'pressure-clean-2.jpg',
    prompt: 'Clean brick pathway after pressure washing, suburban garden visible, bright sunny day, wet gleaming surface, no text no watermarks no logos'
  },
  {
    filename: 'hanging-1.jpg',
    prompt: 'Gallery wall of framed pictures hung in grid pattern on white wall, modern living room, clean level arrangement, no text no watermarks no logos'
  },
  {
    filename: 'hanging-2.jpg',
    prompt: 'Wall-mounted flat screen TV with hidden cables, floating shelf below, modern living room, clean installation, no text no watermarks no logos'
  },
  {
    filename: 'cabinet-1.jpg',
    prompt: 'Open kitchen cabinet with new soft-close hinges, white shaker-style doors, organized interior, modern kitchen, no text no watermarks no logos'
  },
  {
    filename: 'cabinet-2.jpg',
    prompt: 'Handyman adjusting kitchen cabinet door alignment, screwdriver in hand, white modern kitchen, professional and neat, no text no watermarks no logos'
  },
  {
    filename: 'maintenance-1.jpg',
    prompt: 'Modern pendant light fixture installed above kitchen island, warm LED glow, contemporary home interior, no text no watermarks no logos'
  },
  {
    filename: 'maintenance-2.jpg',
    prompt: 'Handyman replacing tap washer on bathroom faucet, tools neatly laid out, clean workspace, close-up professional shot, no text no watermarks no logos'
  },
  {
    filename: 'tiling-1.jpg',
    prompt: 'Repaired bathroom floor tile seamlessly matching existing pattern, grout lines clean, overhead shot, no text no watermarks no logos'
  },
  {
    filename: 'tiling-2.jpg',
    prompt: 'Fresh white subway tile splashback in kitchen, neat grout lines, stainless steel fixtures, bright modern kitchen, no text no watermarks no logos'
  },
  {
    filename: 'outdoor-1.jpg',
    prompt: 'New letterbox installed at front of suburban home, neat garden bed, concrete path, sunny day, no text no watermarks no logos'
  },
  {
    filename: 'outdoor-2.jpg',
    prompt: 'Repaired side gate with new latch hardware, timber fence, suburban backyard, professional finish, no text no watermarks no logos'
  }
];

function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET'
    };
    const req = https.request(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, filepath).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    });
    req.on('error', reject);
    req.end();
  });
}

async function generateImage(prompt) {
  const body = JSON.stringify({
    prompt,
    modelId: MODEL_ID,
    width: 800,
    height: 800,
    num_images: 1
  });

  const options = {
    hostname: BASE_URL,
    path: '/api/rest/v1/generations',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const res = await httpsRequest(options, body);
  if (res.status !== 200) {
    throw new Error(`Generation API error ${res.status}: ${JSON.stringify(res.body)}`);
  }
  return res.body.sdGenerationJob.generationId;
}

async function pollGeneration(generationId, maxWait = 120000) {
  const start = Date.now();
  const interval = 5000;

  while (Date.now() - start < maxWait) {
    await sleep(interval);

    const options = {
      hostname: BASE_URL,
      path: `/api/rest/v1/generations/${generationId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    };

    const res = await httpsRequest(options, null);
    if (res.status !== 200) {
      throw new Error(`Poll API error ${res.status}: ${JSON.stringify(res.body)}`);
    }

    const gen = res.body.generations_by_pk;
    if (gen.status === 'COMPLETE') {
      const imgs = gen.generated_images;
      if (imgs && imgs.length > 0) return imgs[0].url;
      throw new Error('Generation complete but no images found');
    }
    if (gen.status === 'FAILED') {
      throw new Error('Generation failed');
    }

    console.log(`  Polling ${generationId}... status: ${gen.status}`);
  }

  throw new Error(`Timed out waiting for generation ${generationId}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processImage(item, index, total) {
  const filepath = path.join(OUTPUT_DIR, item.filename);

  // Skip if already downloaded
  if (fs.existsSync(filepath)) {
    console.log(`[${index + 1}/${total}] Skipping ${item.filename} (already exists)`);
    return;
  }

  console.log(`[${index + 1}/${total}] Generating: ${item.filename}`);
  console.log(`  Prompt: ${item.prompt.substring(0, 80)}...`);

  let generationId;
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      generationId = await generateImage(item.prompt);
      console.log(`  Generation ID: ${generationId}`);
      break;
    } catch (err) {
      attempts++;
      if (attempts >= maxAttempts) throw err;
      console.log(`  Error generating (attempt ${attempts}): ${err.message}, retrying in 30s...`);
      await sleep(30000);
    }
  }

  const imageUrl = await pollGeneration(generationId);
  console.log(`  Downloading: ${imageUrl.substring(0, 80)}...`);
  await downloadFile(imageUrl, filepath);
  console.log(`  Saved: ${item.filename}`);
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Starting generation of ${IMAGES.length} images`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  const startImage = parseInt(process.argv[2] || '0');

  for (let i = startImage; i < IMAGES.length; i++) {
    try {
      await processImage(IMAGES[i], i, IMAGES.length);
    } catch (err) {
      console.error(`  FAILED ${IMAGES[i].filename}: ${err.message}`);
    }

    // Brief pause between requests to respect rate limits
    if (i < IMAGES.length - 1) {
      await sleep(3000);
    }
  }

  console.log('\nDone.');
  const files = fs.readdirSync(OUTPUT_DIR);
  console.log(`Files in output directory: ${files.length}`);
  files.forEach(f => console.log(`  ${f}`));
}

main().catch(console.error);

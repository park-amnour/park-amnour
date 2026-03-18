import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env manually since we're running outside vite
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '../.env');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const [key, ...valueParts] = line.trim().split('=');
  if (key && !key.startsWith('#')) {
    process.env[key] = valueParts.join('=');
  }
}

const insforgeUrl = process.env.VITE_INSFORGE_URL;
const insforgeApiKey = process.env.VITE_INSFORGE_API_KEY;
const insforgeAnonKey = process.env.VITE_INSFORGE_ANON_KEY;

console.log('Insforge URL:', insforgeUrl);
console.log('API Key set:', !!insforgeApiKey);

// Helper to make database queries via the REST API
async function query(sql) {
  const response = await fetch(`${insforgeUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': insforgeApiKey,
      'Authorization': `Bearer ${insforgeAnonKey}`,
    },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`SQL error (${response.status}): ${text}`);
  }
  return response.json();
}

// Helper to insert data via REST
async function insert(table, data) {
  const url = `${insforgeUrl}/rest/v1/${table}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': insforgeApiKey,
      'Authorization': `Bearer ${insforgeAnonKey}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(Array.isArray(data) ? data : [data]),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Insert error (${response.status}): ${text}`);
  }
  return true;
}

async function upsert(table, data, conflictColumn) {
  const url = `${insforgeUrl}/rest/v1/${table}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': insforgeApiKey,
      'Authorization': `Bearer ${insforgeAnonKey}`,
      'Prefer': `return=minimal,resolution=merge-duplicates`,
    },
    body: JSON.stringify(Array.isArray(data) ? data : [data]),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upsert error (${response.status}): ${text}`);
  }
  return true;
}

const defaultSettings = [
  { key: 'hero', data: {
    titleEn: 'Amnour Park (Amrit Sarovar)',
    titleHi: 'अमनौर पार्क (अमृत सरोवर)',
    descEn: "Experience the serene beauty of Saran's premier destination for family, fun, and nature.",
    descHi: 'परिवार, मनोरंजन और प्रकृति के लिए सारण के प्रमुख गंतव्य की शांत सुंदरता का अनुभव करें।',
    videoUrl: '/hero-video-v2.mp4'
  }},
  { key: 'pricing', data: { dayEntry: 10, eveningEntry: 25, boating: 100, parkingBike: 10, parkingCycle: 5 }},
  { key: 'footer', data: {
    address: 'Amnour Harnarayan, Saran, Bihar 841401',
    phone: '+91 91223 34455',
    email: 'info@amnourpark.com',
    fb: 'https://facebook.com/amnourpark',
    ig: 'https://instagram.com/amnourpark',
    yt: 'https://youtube.com/@amnourpark'
  }},
  { key: 'seo', data: {
    siteTitle: 'Amnour Park | Amrit Sarovar, Saran, Bihar',
    metaDesc: "Experience Nature, Peace & Adventure at Saran's Beloved Park.",
    keywords: 'Amnour Park, Amrit Sarovar, Saran Tourism, Bihar Picnic Spot, Boating in Bihar',
    ogImage: 'https://amnourpark.com/og-image.jpg'
  }},
  { key: 'reach', data: {
    timingsEn: '7:00 AM – 9:00 PM, Daily',
    timingsHi: '7:00 AM – 9:00 PM, प्रतिदिन',
    locationEn: 'Amnour, Saran, Bihar',
    locationHi: 'अमनौर, सारण, बिहार',
    distChhapraEn: '~31 km (45 mins via Amnour Road)',
    distChhapraHi: '~31 किमी (अमनौर रोड के माध्यम से 45 मिनट)',
    distPatnaEn: '~52 km (1.5 hrs via NH-19/31)',
    distPatnaHi: '~52 किमी (1.5 घंटे NH-19/31 के माध्यम से)',
    mapUrl: 'https://maps.google.com/?q=Amnour+Park+Amrit+Sarovar'
  }},
];

const defaultAttractions = [
  { nameEn: 'Amnour Pokhra', nameHi: 'अमनौर पोखरा', descEn: 'A beautiful lake surrounded by lush greenery.', descHi: 'चारों ओर हरियाली से घिरी एक सुंदर झील।', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200', order_index: 1 },
  { nameEn: 'Pokhra Temple', nameHi: 'अमनौर पोखरा मंदिर', descEn: 'A spiritually significant temple near the water.', descHi: 'पोखरा के पास स्थित एक आध्यात्मिक मंदिर।', image: 'https://images.unsplash.com/photo-1620353163140-5a7a7d4a6ba7?w=1200', order_index: 2 },
  { nameEn: 'The Waterfall', nameHi: 'झरना', descEn: 'A beautiful waterfall and prime photography spot.', descHi: 'एक झरना और फोटो पॉइंट।', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200', order_index: 3 },
];

const defaultGallery = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', categoryEn: 'Nature', categoryHi: 'प्रकृति' },
  { url: 'https://images.unsplash.com/photo-1544085701-4d72b563b2c1?w=800', categoryEn: 'Temple', categoryHi: 'मंदिर' },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', categoryEn: 'Waterfall', categoryHi: 'झरना' },
  { url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800', categoryEn: 'Boating', categoryHi: 'नौका विहार' },
];

async function seed() {
  console.log('Seeding Insforge Database via REST API...\n');

  // Seed site settings
  console.log('Seeding site settings...');
  for (const s of defaultSettings) {
    try {
      await upsert('site_settings', s, 'key');
      console.log(`  ✓ ${s.key}`);
    } catch (e) {
      console.error(`  ✗ ${s.key}: ${e.message}`);
    }
  }

  // Seed attractions
  console.log('\nSeeding attractions...');
  try {
    await insert('attractions', defaultAttractions);
    console.log('  ✓ attractions inserted');
  } catch (e) {
    console.error('  ✗ attractions:', e.message);
  }

  // Seed gallery
  console.log('\nSeeding gallery...');
  try {
    await insert('gallery', defaultGallery);
    console.log('  ✓ gallery inserted');
  } catch (e) {
    console.error('  ✗ gallery:', e.message);
  }

  console.log('\nSeeding Complete!');
}

seed().catch(console.error);

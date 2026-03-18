import { createClient } from '@insforge/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load .env manually
const envPath = join(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length) env[key.trim()] = value.join('=').trim();
});

const insforge = createClient({
  baseUrl: env.VITE_INSFORGE_URL,
  anonKey: env.VITE_INSFORGE_ANON_KEY
});

const settings = [
  { key: 'hero', data: {
    titleEn: 'Amnour Park (Amrit Sarovar)',
    titleHi: 'अमनौर पार्क (अमृत सरोवर)',
    descEn: 'Experience the serene beauty of Saran\'s premier destination for family, fun, and nature.',
    descHi: 'परिवार, मनोरंजन और प्रकृति के लिए सारण के प्रमुख गंतव्य की शांत सुंदरता का अनुभव करें।',
    videoUrl: '/hero-video-v2.mp4'
  }},
  { key: 'pricing', data: {
    dayEntry: 10,
    eveningEntry: 25,
    boating: 100,
    parkingBike: 10,
    parkingCycle: 5
  }},
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
    metaDesc: 'Experience Nature, Peace & Adventure at Saran\'s Beloved Park. Developed under the Mission Amrit Sarovar scheme.',
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
  }}
];

async function seed() {
  console.log('Seeding site_settings...');
  for (const s of settings) {
    const { error } = await insforge.database.from('site_settings').upsert(s);
    if (error) console.error(`Error seeding ${s.key}:`, error);
    else console.log(`Seeded ${s.key}`);
  }
}

seed();

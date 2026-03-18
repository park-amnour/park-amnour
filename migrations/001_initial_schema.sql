-- Create site_settings table for key/value website configurations
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create attractions table
CREATE TABLE IF NOT EXISTS attractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nameEn" TEXT NOT NULL,
  "nameHi" TEXT NOT NULL,
  "descEn" TEXT NOT NULL,
  "descHi" TEXT NOT NULL,
  image TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  "categoryEn" TEXT NOT NULL DEFAULT 'General',
  "categoryHi" TEXT NOT NULL DEFAULT 'सामान्य',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial site_settings data
INSERT INTO site_settings (key, data) VALUES
  ('hero', '{"titleEn": "Amnour Park (Amrit Sarovar)", "titleHi": "अमनौर पार्क (अमृत सरोवर)", "descEn": "Experience the serene beauty of Saran''s premier destination for family, fun, and nature.", "descHi": "परिवार, मनोरंजन और प्रकृति के लिए सारण के प्रमुख गंतव्य की शांत सुंदरता का अनुभव करें।", "videoUrl": "/hero-video-v2.mp4"}'),
  ('pricing', '{"dayEntry": 10, "eveningEntry": 25, "boating": 100, "parkingBike": 10, "parkingCycle": 5}'),
  ('footer', '{"address": "Amnour Harnarayan, Saran, Bihar 841401", "phone": "+91 91223 34455", "email": "info@amnourpark.com", "fb": "https://facebook.com/amnourpark", "ig": "https://instagram.com/amnourpark", "yt": "https://youtube.com/@amnourpark"}'),
  ('seo', '{"siteTitle": "Amnour Park | Amrit Sarovar, Saran, Bihar", "metaDesc": "Experience Nature, Peace & Adventure at Saran''s Beloved Park.", "keywords": "Amnour Park, Amrit Sarovar, Saran Tourism, Bihar Picnic Spot, Boating in Bihar", "ogImage": "https://amnourpark.com/og-image.jpg"}'),
  ('reach', '{"timingsEn": "7:00 AM – 9:00 PM, Daily", "timingsHi": "7:00 AM – 9:00 PM, प्रतिदिन", "locationEn": "Amnour, Saran, Bihar", "locationHi": "अमनौर, सारण, बिहार", "distChhapraEn": "~31 km (45 mins via Amnour Road)", "distChhapraHi": "~31 किमी (अमनौर रोड के माध्यम से 45 मिनट)", "distPatnaEn": "~52 km (1.5 hrs via NH-19/31)", "distPatnaHi": "~52 किमी (1.5 घंटे NH-19/31 के माध्यम से)", "mapUrl": "https://maps.google.com/?q=Amnour+Park+Amrit+Sarovar"}')
ON CONFLICT (key) DO NOTHING;

-- Seed initial attractions
INSERT INTO attractions ("nameEn", "nameHi", "descEn", "descHi", image, order_index) VALUES
  ('Amnour Pokhra', 'अमनौर पोखरा', 'A beautiful lake surrounded by lush greenery, perfect for a peaceful evening walk or boating.', 'चारों ओर हरियाली से घिरी एक सुंदर झील, शाम की शांत सैर या नौका विहार के लिए उपयुक्त।', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200', 1),
  ('Pokhra Temple', 'अमनौर पोखरा मंदिर', 'A spiritually significant temple located near the water, offering a peaceful environment for devotion.', 'पोखरा के पास स्थित मंदिर। स्थानीय भक्तों और आगंतुकों दोनों के लिए एक आध्यात्मिक महत्व का स्थान।', 'https://images.unsplash.com/photo-1620353163140-5a7a7d4a6ba7?w=1200', 2),
  ('The Waterfall', 'झरना', 'A beautiful water feature that creates a refreshing ambiance and serves as a prime photography spot.', 'पार्क में एक झरना है जो आगंतुकों के लिए एक फोटो पॉइंट और ठंडक देने वाली जगह है।', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200', 3);

-- Seed initial gallery images
INSERT INTO gallery (url, "categoryEn", "categoryHi") VALUES
  ('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'Nature', 'प्रकृति'),
  ('https://images.unsplash.com/photo-1544085701-4d72b563b2c1?w=800', 'Temple', 'मंदिर'),
  ('https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', 'Waterfall', 'झरना'),
  ('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800', 'Boating', 'नौका विहार');

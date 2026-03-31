import { createContext, useContext, useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [stats, setStats] = useState({ totalViews: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const connectRealtime = async (retryCount = 0) => {
      try {
        if (insforge.realtime.isConnected) return;

        await insforge.realtime.connect();
        await insforge.realtime.subscribe('site_stats');
        await insforge.realtime.subscribe('site_content');
      } catch (err) {
        console.warn('Realtime connection failed:', err);
        if (retryCount < 5) {
          const delay = Math.pow(2, retryCount) * 1000;
          setTimeout(() => connectRealtime(retryCount + 1), delay);
        }
      }
    };

    const initSite = async () => {
      try {
        // 1. Fetch initial stats
        const { data: statsRes } = await insforge.database
          .from('site_settings')
          .select('data')
          .eq('key', 'stats')
          .single();
        
        if (statsRes?.data) {
          setStats(statsRes.data);
        }

        // 2. Setup Real-time (Non-blocking so Splash Screen goes away faster)
        connectRealtime().catch(() => {});
        
        insforge.realtime.on('view_increment', (payload) => {
          if (payload.totalViews) {
            setStats(prev => ({ ...prev, totalViews: payload.totalViews }));
          }
        });

        insforge.realtime.on('content_updated', (payload) => {
          window.dispatchEvent(new CustomEvent('insforge:content_updated', { detail: payload }));
        });

        insforge.realtime.on('connect', () => {
        });

        insforge.realtime.on('disconnect', (reason) => {
          console.warn('Realtime disconnected:', reason);
          if (reason !== 'manual') {
            connectRealtime();
          }
        });

        insforge.realtime.on('connect_error', (err) => {
          console.warn('Realtime connection error:', err);
        });

        // 3. One-Time Database Scrub for Legacy 404 Links
        // This is commented out to prevent accidental deletion of valid Unsplash images.
        // If needed, this should be moved to a manual action in the Admin Panel.
        /*
        const scrubDatabase = async () => {
          try {
            await Promise.all([
              insforge.database.from('gallery').delete().like('url', '%unsplash.com%'),
              insforge.database.from('attractions').delete().like('image', '%unsplash.com%')
            ]);
          } catch(e) { }
        };
        scrubDatabase();
        */

        // 4. Aggressive Background Preloading Engine
        const preloadAssets = async () => {
          try {
            // Fetch ALL media URLs from database in parallel
            const [galRes, attrRes, settingsRes] = await Promise.all([
              insforge.database.from('gallery').select('url'),
              insforge.database.from('attractions').select('image'),
              insforge.database.from('site_settings').select('data').in('key', ['hero', 'seo'])
            ]);

            const urls = [
              ... (galRes.data || []).map(i => i.url),
              ... (attrRes.data || []).map(i => i.image),
              ... (settingsRes.data || []).map(s => s.data?.videoUrl || s.data?.siteImage || s.data?.ogImage)
            ].filter(url => url && !url.includes('unsplash.com') && !url.includes('amnourpark.com/og-image'));

            // Trigger parallel preloading and buffering
            urls.forEach(url => {
              if (url.match(/\.(mp4|webm|ogg)$/i)) {
                // Background fetch for video to trigger Service Worker caching and browser buffering
                fetch(url, { priority: 'low' }).catch(() => {});
              } else {
                // Background load for images
                const img = new Image();
                img.src = url;
              }
            });
          } catch (err) {
            console.warn('Background preloading failed:', err);
          }
        };

        // Delay preloading to prioritize main thread for initial render
        setTimeout(preloadAssets, 3000);

      } catch (err) {
        console.warn('Error initializing site context:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initSite();

    return () => {
      insforge.realtime.unsubscribe('site_stats');
      insforge.realtime.unsubscribe('site_content');
    };
  }, []);

  return (
    <SiteContext.Provider value={{ stats, setStats, isLoading }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);

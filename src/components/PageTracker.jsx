import { useEffect } from 'react';
import { insforge } from '../lib/insforge';

const PageTracker = () => {
  useEffect(() => {
    const trackView = async () => {
      // Use sessionStorage to prevent double counting in same session
      if (sessionStorage.getItem('park_visited')) return;

      try {
        // 1. Fetch current stats
        const { data: statsRes } = await insforge.database
          .from('site_settings')
          .select('data')
          .eq('key', 'stats')
          .single();
        
        let currentViews = statsRes?.data?.totalViews || 0;
        const newViews = currentViews + 1;

        // 2. Update stats
        await insforge.database
          .from('site_settings')
          .upsert({ 
            key: 'stats', 
            data: { ...statsRes?.data, totalViews: newViews } 
          });

        // 3. Broadcast real-time update if possible (channel: site_stats)
        await insforge.realtime.connect();
        await insforge.realtime.publish('site_stats', 'view_increment', { totalViews: newViews });

        sessionStorage.setItem('park_visited', 'true');
      } catch (err) {
        console.error('Error tracking page view:', err);
      }
    };

    trackView();
  }, []);

  return null;
};

export default PageTracker;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Ticket, MapPin, Ship } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { insforge } from '../lib/insforge';

const InfoStrip = () => {
  const { lang } = useLanguage();
  const [data, setData] = useState({
    timingsEn: '7:00 AM – 9:00 PM, Daily',
    timingsHi: '7:00 AM – 9:00 PM, प्रतिदिन',
    dayEntry: 10,
    eveningEntry: 25,
    locationEn: 'Amnour, Saran, Bihar',
    locationHi: 'अमनौर, सारण, बिहार',
    boating: 100
  });

  useEffect(() => {
    const fetchInfoData = async () => {
      try {
        const [
          { data: pricingRes },
          { data: reachRes }
        ] = await Promise.all([
          insforge.database.from('site_settings').select('data').eq('key', 'pricing').single(),
          insforge.database.from('site_settings').select('data').eq('key', 'reach').single()
        ]);

        let newData = { ...data };
        if (pricingRes) {
          const p = pricingRes.data;
          newData.dayEntry = p.dayEntry;
          newData.eveningEntry = p.eveningEntry;
          newData.boating = p.boating;
        }
        if (reachRes) {
          const r = reachRes.data;
          newData.timingsEn = r.timingsEn;
          newData.timingsHi = r.timingsHi;
          newData.locationEn = r.locationEn;
          newData.locationHi = r.locationHi;
        }
        setData(newData);
      } catch (err) {
        console.error('Error fetching info strip data:', err);
      }
    };

    const handleUpdate = (e) => {
      const { type } = e.detail;
      if (['pricing', 'reach'].includes(type)) {
        fetchInfoData();
      }
    };

    fetchInfoData();
    window.addEventListener('insforge:content_updated', handleUpdate);
    return () => window.removeEventListener('insforge:content_updated', handleUpdate);
  }, []);

  const infoItems = [
    { 
      icon: Clock, 
      title: lang === 'EN' ? 'Timings' : 'समय', 
      desc: lang === 'EN' ? data.timingsEn : data.timingsHi 
    },
    { 
      icon: Ticket, 
      title: lang === 'EN' ? 'Entry Fee' : 'प्रवेश शुल्क', 
      desc: lang === 'EN' 
        ? `₹${data.dayEntry} (Day) | ₹${data.eveningEntry} (Evening)` 
        : `₹${data.dayEntry} (दिन) | ₹${data.eveningEntry} (शाम)` 
    },
    { 
      icon: MapPin, 
      title: lang === 'EN' ? 'Location' : 'स्थान', 
      desc: lang === 'EN' ? data.locationEn : data.locationHi 
    },
    { 
      icon: Ship, 
      title: lang === 'EN' ? 'Boating' : 'नौका विहार', 
      desc: lang === 'EN' ? `₹${data.boating} / 4 Persons` : `₹${data.boating} / 4 व्यक्ति` 
    },
  ];

  return (
    <div className="w-full bg-cream py-6 pb-12 -mt-4 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal scroll container for mobile */}
        <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-4 md:space-x-0 md:gap-6">
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={item.title} 
                className="flex-shrink-0 w-[240px] md:w-auto bg-white rounded-2xl p-5 shadow-sm border border-light-green/20 snap-center hover:shadow-md hover:border-light-green/40 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-light-green/10 p-3 rounded-full text-primary-green group-hover:bg-primary-green group-hover:text-white transition-colors">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-dark font-title uppercase tracking-wide opacity-70 mb-1">{item.title}</h3>
                    <p className="text-base font-medium text-text-dark/90 font-body leading-tight">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InfoStrip;

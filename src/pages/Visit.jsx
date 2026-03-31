import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Ticket, MapPin, AlertCircle, Info, Navigation, Bike, Car, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { insforge } from '../lib/insforge';

const Visit = () => {
  const { lang } = useLanguage();
  const [pricing, setPricing] = useState({
    dayEntry: 10,
    eveningEntry: 25,
    boating2p: 50,
    boating4p: 100,
    parkingBike: 10,
    parkingCycle: 0,
    entryFree: false,
    boatingFree: false,
    parkingFree: false,
    festivalName: '',
    festivalUntil: ''
  });
  const [reach, setReach] = useState({
    timingsEn: '7:00 AM – 9:00 PM, Daily',
    timingsHi: '7:00 AM – 9:00 PM, प्रतिदिन',
    locationEn: 'Amnour, Saran, Bihar',
    locationHi: 'अमनौर, सारण, बिहार',
    distChhapraEn: '~31 km (45 mins via Amnour Road)',
    distChhapraHi: '~31 किमी (अमनौर रोड के माध्यम से 45 मिनट)',
    distPatnaEn: '~52 km (1.5 hrs via NH-19/31)',
    distPatnaHi: '~52 किमी (1.5 घंटे NH-19/31 के माध्यम से)',
    mapUrl: 'https://maps.google.com/?q=Amnour+Park+Amrit+Sarovar'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisitData = async () => {
      try {
        const [
          { data: pricingRes },
          { data: reachRes }
        ] = await Promise.all([
          insforge.database.from('site_settings').select('data').eq('key', 'pricing').single(),
          insforge.database.from('site_settings').select('data').eq('key', 'reach').single()
        ]);

        if (pricingRes) setPricing(pricingRes.data);
        if (reachRes) setReach(reachRes.data);
      } catch (err) {
        console.error('Error fetching visit page data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    const handleUpdate = (e) => {
      const { type } = e.detail;
      if (['pricing', 'reach'].includes(type)) {
        fetchVisitData();
      }
    };

    fetchVisitData();
    window.addEventListener('insforge:content_updated', handleUpdate);
    return () => window.removeEventListener('insforge:content_updated', handleUpdate);
  }, []);

  const timings = [
    { 
      session: lang === 'EN' ? 'Morning / Day Session' : 'सुबह / दिन का सत्र', 
      time: reach.timingsEn.split(',')[0], 
      fee: pricing.entryFree 
        ? <span className="text-emerald-500 font-bold">FREE</span> 
        : (lang === 'EN' ? `₹${pricing.dayEntry} per person` : `₹${pricing.dayEntry} प्रति व्यक्ति`)
    },
    { 
      session: lang === 'EN' ? 'Evening Session' : 'शाम का सत्र', 
      time: 'After 5:00 PM', 
      fee: pricing.entryFree 
        ? <span className="text-emerald-500 font-bold">FREE</span> 
        : (lang === 'EN' ? `₹${pricing.eveningEntry} per person` : `₹${pricing.eveningEntry} प्रति व्यक्ति`), 
      note: lang === 'EN' ? 'Special lighting & decor' : 'विशेष लाइटिंग और सजावट' 
    },
  ];

  const boatingDetails = [
    { field: lang === 'EN' ? 'Boating Available' : 'नौका विहार उपलब्ध है', value: lang === 'EN' ? 'Yes' : 'हाँ' },
    { field: lang === 'EN' ? 'Boat Type' : 'नाव का प्रकार', value: lang === 'EN' ? 'Paddle Boat' : 'पडल बोट' },
    { field: lang === 'EN' ? 'Price (2 Persons)' : 'कीमत (2 व्यक्ति)', value: pricing.boatingFree ? <span className="text-emerald-500 font-bold">FREE</span> : `₹${pricing.boating2p}` },
    { field: lang === 'EN' ? 'Price (4 Persons)' : 'कीमत (4 व्यक्ति)', value: pricing.boatingFree ? <span className="text-emerald-500 font-bold">FREE</span> : `₹${pricing.boating4p}` },
    { field: lang === 'EN' ? 'Duration' : 'अवधि', value: `${pricing.boatingDuration || 20} Mins` },
  ];

  const parkingFees = [
    { type: lang === 'EN' ? 'Bicycle (Cycle)' : 'साइकिल', fee: <span className="text-emerald-500 font-bold">{lang === 'EN' ? 'FREE' : 'मुफ़्त'}</span> },
    { type: lang === 'EN' ? 'Bike / Motorcycle' : 'मोटर साइकिल', fee: pricing.parkingFree ? <span className="text-emerald-500 font-bold">FREE</span> : `₹${pricing.parkingBike}` },
    { type: lang === 'EN' ? 'Car / Auto' : 'कार / ऑटो', fee: lang === 'EN' ? 'Available' : 'उपलब्ध' },
  ];

  const rules = lang === 'EN' ? [
    'Taking photos or videos of couples is strictly prohibited. Violators will face a ₹500 fine and legal action.',
    'Couple privacy and safety is our absolute priority.',
    'Plucking flowers or damaging plants is forbidden (Fine: ₹500).',
    'Bathing in the Amrit Sarovar is strictly prohibited (Fine: ₹500).',
    'Smoking, alcohol, and intoxicants are strictly prohibited.',
    'The entire park is under 24/7 CCTV surveillance.',
    'Adult supervision for children is mandatory.',
    'Do not throw plastic waste in the park. Keep it clean.'
  ] : [
    'कपल्स की बिना अनुमति फोटो या वीडियो खींचना सख्त मना है। पकड़े जाने पर डिवाइस जब्त कर ₹500 जुर्माना और सख्त कानूनी कार्रवाई की जाएगी।',
    'कपल्स की प्राइवेसी और सुरक्षा हमारी पहली प्राथमिकता है।',
    'किसी भी प्रकार का फूल तोड़ना या पौधों को नुकसान पहुँचाना मना है (जुर्माना: ₹500)।',
    'पोखरा (अमृत सरोवर) में नहाना सख्त मना है (जुर्माना: ₹500)।',
    'धूम्रपान और नशीले पदार्थों का सेवन पूरी तरह से मना है।',
    'पूरा पार्क 24/7 CCTV कैमरों की कड़ी निगरानी में है।',
    'बच्चों के साथ बड़ों का होना अनिवार्य है।',
    'पार्क में प्लास्टिक कचरा न फेंकें। स्वच्छता बनाए रखें।'
  ];

  return (
    <div className="w-full bg-cream min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-primary-green text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-bold mb-4"
          >
            {lang === 'EN' ? 'Plan Your Visit' : 'अपनी यात्रा की योजना बनाएं'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/80 font-body"
          >
            {lang === 'EN' ? 'Everything you need to know before you visit Amnour Park' : 'अमनौर पार्क जाने से पहले आपको जो कुछ भी जानना चाहिए'}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Timings and Pricing */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Timings & Entry Section */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-light-green/10">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="text-primary-green" size={28} />
              <h2 className="text-2xl font-heading font-bold text-text-dark">
                {lang === 'EN' ? 'Park Timings & Entry Fee' : 'पार्क का समय और प्रवेश शुल्क'}
              </h2>
            </div>
            
            <div className="overflow-hidden rounded-2xl border border-black/5">
              <table className="w-full text-left font-body">
                <thead className="bg-primary-green/5 text-primary-green font-semibold">
                  <tr>
                    <th className="px-6 py-4">{lang === 'EN' ? 'Session' : 'सत्र'}</th>
                    <th className="px-6 py-4">{lang === 'EN' ? 'Time' : 'समय'}</th>
                    <th className="px-6 py-4">{lang === 'EN' ? 'Entry Fee' : 'प्रवेश शुल्क'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {timings.map((row, idx) => (
                    <tr key={idx} className="hover:bg-black/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium">
                        {row.session}
                        {row.note && <span className="block text-xs text-primary-green/60 font-normal italic">{row.note}</span>}
                      </td>
                      <td className="px-6 py-4 text-text-dark/80">{row.time}</td>
                      <td className="px-6 py-4 text-primary-green font-bold">{row.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-text-dark/60 flex items-center space-x-2">
              <Info size={14} />
              <span>{lang === 'EN' ? reach.timingsEn : reach.timingsHi}</span>
            </p>
          </section>

          {/* Activity Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Boating Info */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-water-blue/10">
              <div className="flex items-center space-x-3 mb-6">
                <Navigation className="text-water-blue rotate-45" size={28} />
                <h2 className="text-2xl font-heading font-bold text-text-dark">
                  {lang === 'EN' ? 'Boating Details' : 'नौका विहार विवरण'}
                </h2>
              </div>
              <ul className="space-y-4 font-body">
                {boatingDetails.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center border-b border-black/5 pb-2 last:border-0">
                    <span className="text-text-dark/60 text-sm">{item.field}</span>
                    <span className="font-semibold text-text-dark">{item.value}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Parking Info */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-earth-brown/10">
              <div className="flex items-center space-x-3 mb-6">
                <Car className="text-earth-brown" size={28} />
                <h2 className="text-2xl font-heading font-bold text-text-dark">
                  {lang === 'EN' ? 'Parking Fee' : 'पार्किंग शुल्क'}
                </h2>
              </div>
              <ul className="space-y-4 font-body">
                {parkingFees.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center border-b border-black/5 pb-2 last:border-0 text-lg">
                    <span className="text-text-dark/70">{item.type}</span>
                    <span className="font-bold text-earth-brown">{item.fee}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Directions Section */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-accent-gold/20">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="text-accent-gold" size={28} />
              <h2 className="text-2xl font-heading font-bold text-text-dark">
                {lang === 'EN' ? 'How to Reach' : 'कैसे पहुँचें'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="p-4 bg-cream rounded-2xl border border-black/5 hover:border-accent-gold/30 transition-all group">
                  <h4 className="font-title font-bold text-primary-green flex items-center space-x-2">
                    <Navigation size={16} />
                    <span>{lang === 'EN' ? 'From Chhapra' : 'छपरा से'}</span>
                  </h4>
                  <p className="text-sm text-text-dark/70 mt-1">{lang === 'EN' ? reach.distChhapraEn : reach.distChhapraHi}</p>
                </div>
                <div className="p-4 bg-cream rounded-2xl border border-black/5 hover:border-accent-gold/30 transition-all group">
                  <h4 className="font-title font-bold text-primary-green flex items-center space-x-2">
                    <Navigation size={16} />
                    <span>{lang === 'EN' ? 'From Patna' : 'पटना से'}</span>
                  </h4>
                  <p className="text-sm text-text-dark/70 mt-1">{lang === 'EN' ? reach.distPatnaEn : reach.distPatnaHi}</p>
                </div>
              </div>
              
              <div className="flex flex-col justify-center text-sm font-body text-text-dark/70 bg-primary-green/5 p-6 rounded-3xl border border-primary-green/10">
                <p className="font-bold text-primary-green mb-2 uppercase tracking-wider text-xs">{lang === 'EN' ? 'Official Address' : 'आधिकारिक पता'}</p>
                <p className="text-base text-text-dark mb-4">{reach.locationEn}</p>
                <a 
                  href={reach.mapUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-accent-gold hover:bg-accent-gold/90 text-text-dark text-center py-3 rounded-xl font-semibold transition-all shadow-md block"
                >
                  {lang === 'EN' ? 'Open in Google Maps' : 'गूगल मैप्स में खोलें'}
                </a>
              </div>
            </div>

            {/* Map Embed */}
            <div className="w-full h-80 rounded-2xl overflow-hidden border border-black/5 shadow-inner">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14349.115802142274!2d84.9248744!3d25.9745579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed9f55e0000001%3A0x7d6c6e75924d5ae2!2sAmnour%20Park%20(Amrit%20Sarovar)!5e0!3m2!1sen!2sin!4v1710680000000!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </section>
        </div>

        {/* Right Column: Rules and Guidelines Sticky */}
        <div className="space-y-8 lg:sticky lg:top-24 h-fit">
          <section className="bg-primary-green text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <AlertCircle size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <AlertCircle className="text-accent-gold" size={28} />
                <h2 className="text-2xl font-heading font-bold">{lang === 'EN' ? 'Park Rules' : 'पार्क के नियम'}</h2>
              </div>
              <ul className="space-y-6 font-body">
                {rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm">
                    <div className="w-1.5 h-1.5 bg-accent-gold rounded-full mt-1.5 shrink-0" />
                    <span className="opacity-90 leading-relaxed font-medium">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Visit;

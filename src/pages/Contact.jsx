import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Navigation, Train, Plane, Bus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { insforge } from '../lib/insforge';

const Contact = () => {
  const { lang } = useLanguage();
  const [footerData, setFooterData] = useState({
    address: 'Amnour Harnarayan, Saran, Bihar 841401',
    phone: '+91 91223 34455',
    email: 'info@amnourpark.com'
  });
  const [reachData, setReachData] = useState({
    timingsEn: '7:00 AM – 9:00 PM, Daily',
    timingsHi: '7:00 AM – 9:00 PM, प्रतिदिन',
    locationEn: 'Amnour, Saran, Bihar',
    locationHi: 'अमनौर, सारण, बिहार',
    mapUrl: 'https://maps.google.com/?q=Amnour+Park+Amrit+Sarovar'
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const [
          { data: footerRes },
          { data: reachRes }
        ] = await Promise.all([
          insforge.database.from('site_settings').select('data').eq('key', 'footer').single(),
          insforge.database.from('site_settings').select('data').eq('key', 'reach').single()
        ]);

        if (footerRes) setFooterData(footerRes.data);
        if (reachRes) setReachData(reachRes.data);
      } catch (err) {
        console.error('Error fetching contact page data:', err);
      } finally {
        // isLoading not defined in Contact.jsx, but let's keep it simple
      }
    };
    fetchContactData();
  }, []);

  const landmarks = [
    { 
      icon: Train, 
      title: lang === 'EN' ? 'Nearest Railway Station' : 'निकटतम रेलवे स्टेशन', 
      desc: lang === 'EN' ? 'Marhaura Railway Station (~8.6 km)' : 'मड़हौरा रेलवे स्टेशन (~8.6 किमी)' 
    },
    { 
      icon: Plane, 
      title: lang === 'EN' ? 'Nearest Airport' : 'निकटतम हवाई अड्डा', 
      desc: lang === 'EN' ? 'Patna Airport (~46-52 km)' : 'पटना हवाई अड्डा (~46-52 किमी)' 
    },
    { 
      icon: Bus, 
      title: lang === 'EN' ? 'Nearest Bus Stand' : 'निकटतम बस स्टैंड', 
      desc: lang === 'EN' ? 'Chhapra Bus Stand (Sandha Dhala)' : 'छपरा बस स्टैंड (सैंडा ढाला)' 
    },
  ];

  const contactInfo = [
    { 
      icon: MapPin, 
      title: lang === 'EN' ? 'Address' : 'पता', 
      detail: lang === 'EN' ? footerData.address : reachData.locationHi 
    },
    { 
      icon: Clock, 
      title: lang === 'EN' ? 'Open Daily' : 'प्रतिदिन खुला', 
      detail: lang === 'EN' ? reachData.timingsEn : reachData.timingsHi 
    },
    { 
      icon: Mail, 
      title: lang === 'EN' ? 'Email Info' : 'ईमेल जानकारी', 
      detail: footerData.email 
    },
  ];

  return (
    <div className="w-full bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-primary-green text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20"
          >
            <MapPin size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            {lang === 'EN' ? 'Location & Contact' : 'स्थान और संपर्क'}
          </h1>
          <p className="text-xl text-white/80 font-body max-w-2xl mx-auto text-balance">
            {lang === 'EN' 
              ? "Find your way to the heart of Saran's natural beauty. We are looking forward to your visit."
              : "सारण की प्राकृतिक सुंदरता के केंद्र में अपना रास्ता खोजें। हम आपकी यात्रा की प्रतीक्षा कर रहे हैं।"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Contact Info & Landmarks */}
          <div className="space-y-12">
            {/* Contact Details Cards */}
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold text-primary-green border-l-4 border-accent-gold pl-4">
                {lang === 'EN' ? 'Reaching Us' : 'हम तक पहुँचना'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {contactInfo.map((info, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-sm border border-light-green/10"
                  >
                    <div className="bg-light-green/10 p-3 rounded-full text-primary-green shrink-0">
                      <info.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-title font-bold text-text-dark text-lg">{info.title}</h3>
                      <p className="text-text-dark/70 font-body leading-relaxed">{info.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Landmarks */}
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold text-primary-green border-l-4 border-accent-gold pl-4">
                {lang === 'EN' ? 'Nearest Transport' : 'निकटतम परिवहन'}
              </h2>
              <div className="space-y-4">
                {landmarks.map((mark, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="flex items-center space-x-4 p-4 rounded-2xl bg-primary-green/5 border border-primary-green/5"
                  >
                    <div className="bg-white p-2 rounded-lg text-primary-green shadow-sm shrink-0">
                      <mark.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-title font-bold text-text-dark text-sm">{mark.title}</h4>
                      <p className="text-sm text-text-dark/60 font-body">{mark.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary-green rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                 <Navigation size={120} />
               </div>
               <div className="relative z-10">
                 <h3 className="text-2xl font-heading font-bold mb-4">
                    {lang === 'EN' ? 'Start Your Journey Today' : 'आज ही अपनी यात्रा शुरू करें'}
                 </h3>
                 <p className="text-white/80 font-body mb-8 text-balance">
                    {lang === 'EN' 
                      ? "The serene waters of Amnour Pokhra are waiting for you. Get realtime navigation on your phone."
                      : "अमनौर पोखरा का शांत पानी आपका इंतजार कर रहा है। अपने फोन पर रीयल-टाइम नेविगेशन प्राप्त करें।"}
                 </p>
                 <a 
                   href={reachData.mapUrl} 
                   target="_blank" 
                   rel="noreferrer"
                   className="inline-flex items-center space-x-2 bg-accent-gold text-text-dark px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-2xl hover:-translate-y-1"
                 >
                   <span>{lang === 'EN' ? 'Open Google Maps' : 'गूगल मैप्स खोलें'}</span>
                   <Navigation size={18} />
                 </a>
               </div>
            </div>
          </div>

          {/* Right: Map Embed */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-[2.5rem] p-4 shadow-xl border border-black/5 overflow-hidden">
              <div className="w-full h-[600px] rounded-[2rem] overflow-hidden relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14349.115802142274!2d84.9248744!3d25.9745579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed9f55e0000001%3A0x7d6c6e75924d5ae2!2sAmnour%20Park%20(Amrit%20Sarovar)!5e0!3m2!1sen!2sin!4v1710680000000!5m2!1sen!2sin"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
                {/* Overlay card on map */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-black/5 flex items-center justify-between">
                   <div>
                     <p className="text-xs font-bold text-accent-gold uppercase tracking-[0.2em] mb-1">
                        {lang === 'EN' ? 'Official Location' : 'आधिकारिक स्थान'}
                     </p>
                     <h3 className="font-heading font-bold text-lg text-text-dark">{lang === 'EN' ? 'Amnour Park' : 'अमनौर पार्क'}</h3>
                   </div>
                   <div className="h-10 w-10 bg-primary-green rounded-full flex items-center justify-center text-white shadow-lg">
                      <MapPin size={20} />
                   </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;

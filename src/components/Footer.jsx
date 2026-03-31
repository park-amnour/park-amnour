import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Facebook, Instagram, Youtube, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { insforge } from '../lib/insforge';

const Footer = () => {
  const { lang } = useLanguage();
  const { stats } = useSite();
  const [data, setData] = useState({
    address: 'Amnour Harnarayan, Saran, Bihar 841401',
    phone: '+91 91223 34455',
    email: 'info@amnourpark.com',
    fb: '#',
    ig: '#',
    yt: '#',
    timingsEn: '7 AM – 9 PM',
    mapUrl: 'https://maps.google.com/?q=Amnour+Park+Amrit+Sarovar'
  });

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [
          { data: footerRes },
          { data: reachRes }
        ] = await Promise.all([
          insforge.database.from('site_settings').select('data').eq('key', 'footer').single(),
          insforge.database.from('site_settings').select('data').eq('key', 'reach').single()
        ]);

        let newData = { ...data };
        if (footerRes) {
          newData = { ...newData, ...footerRes.data };
        }
        if (reachRes) {
          newData.timingsEn = reachRes.data.timingsEn;
          newData.mapUrl = reachRes.data.mapUrl;
        }
        setData(newData);
      } catch (err) {
        console.error('Error fetching footer data:', err);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer className="bg-[#1A2E22] text-[#E0E7E3] pt-12 pb-6 border-t-[6px] border-primary-green relative overflow-hidden">
      {/* Subtle grass/leaf texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83-54.627 54.627-.83-.83L54.627 0zM29.627 0l.83.83-29.627 29.627-.83-.83L29.627 0zM0 25.373l.83-.83 29.627 29.627-.83.83L0 25.373zm0 29.254l.83-.83 29.627 29.627-.83.83L0 54.627z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Brand Info */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-2 shrink-0">
              <span className="text-3xl text-light-green">🌿</span>
              <div className="flex flex-col">
                <span className="font-hindi-hero text-2xl leading-tight font-bold text-white">अमनौर पार्क</span>
                <span className="text-xs opacity-80 uppercase tracking-widest text-light-green">(Amrit Sarovar)</span>
              </div>
            </Link>
            <p className="text-sm text-[#A0B0A6] font-body text-balance max-w-sm">
              {lang === 'EN' 
                ? "Experience Nature, Peace & Adventure at Saran's Beloved Park. Developed under the Mission Amrit Sarovar scheme."
                : "सारण के प्यारे पार्क में प्रकृति, शांति और रोमांच का अनुभव करें। अमृत सरोवर योजना के तहत विकसित।"}
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a href={data.fb} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-green transition-colors text-[#A0B0A6] hover:text-white">
                <Facebook size={16} />
              </a>
              <a href={data.ig} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-green transition-colors text-[#A0B0A6] hover:text-white">
                <Instagram size={16} />
              </a>
              <a href={data.yt} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-green transition-colors text-[#A0B0A6] hover:text-white">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Links and Visit Info */}
          <div className="grid grid-cols-2 md:grid-cols-2 md:col-span-2 gap-8">
            <div className="flex flex-col space-y-4">
              <h4 className="font-title text-base md:text-lg font-semibold text-white">
                {lang === 'EN' ? 'Quick Links' : 'त्वरित लिंक'}
              </h4>
              <ul className="space-y-2 text-xs md:text-sm font-body text-[#A0B0A6]">
                <li><Link to="/" className="hover:text-accent-gold transition-colors">{lang === 'EN' ? 'Home' : 'होम'}</Link></li>
                <li><Link to="/attractions" className="hover:text-accent-gold transition-colors">{lang === 'EN' ? 'Attractions' : 'आकर्षण'}</Link></li>
                <li><Link to="/visit" className="hover:text-accent-gold transition-colors">{lang === 'EN' ? 'Pricing' : 'कीमतें'}</Link></li>
                <li><Link to="/gallery" className="hover:text-accent-gold transition-colors">{lang === 'EN' ? 'Gallery' : 'गैलरी'}</Link></li>
              </ul>
            </div>

            <div className="flex flex-col space-y-4">
              <h4 className="font-title text-base md:text-lg font-semibold text-white">
                {lang === 'EN' ? 'Visit Us' : 'पधारें'}
              </h4>
              <ul className="space-y-3 text-xs md:text-sm font-body text-[#A0B0A6]">
                <li className="flex items-start space-x-2">
                  <MapPin className="text-accent-gold shrink-0 mt-0.5" size={14} />
                  <span className="leading-relaxed">{data.address}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="text-accent-gold shrink-0" size={14} />
                  <span>{data.timingsEn}</span>
                </li>
                {data.phone && (
                  <li className="flex items-center space-x-2">
                    <Phone className="text-accent-gold shrink-0" size={14} />
                    <a href={`tel:${data.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">{data.phone}</a>
                  </li>
                )}
                {data.email && (
                  <li className="flex items-center space-x-2">
                    <Mail className="text-accent-gold shrink-0" size={14} />
                    <a href={`mailto:${data.email}`} className="hover:text-white transition-colors">{data.email}</a>
                  </li>
                )}
              </ul>
              <a 
                href={data.mapUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex mt-1 items-center justify-center space-x-1 border border-light-green/40 hover:border-light-green text-light-green px-3 py-1.5 rounded-lg text-xs font-medium transition-colors w-fit"
              >
                <span>Maps</span>
                <MapPin size={10} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#2D4536] flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-[#809588] font-body">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
            <p>© {new Date().getFullYear()} {lang === 'EN' ? 'Amnour Park (Amrit Sarovar). Saran, Bihar.' : 'अमनौर पार्क (अमृत सरोवर)। सारण, बिहार।'}</p>
            
            {/* Live Visitor Count in Footer */}
            <div className="flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-light-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-light-green"></span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-light-green/60">Live Visitors:</span>
              <span className="text-[11px] font-bold text-white leading-none">
                {stats?.totalViews?.toLocaleString() || '1,240'}+
              </span>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link to="/visit" className="hover:text-white transition">{lang === 'EN' ? 'Rules' : 'नियम'}</Link>
            <Link to="/contact" className="hover:text-white transition">{lang === 'EN' ? 'Privacy' : 'गोपनीयता'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  MapPin, 
  Image as ImageIcon, 
  ArrowUpRight, 
  Calendar,
  Clock,
  ArrowRight,
  Activity,
  Sparkles,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { insforge } from '../../lib/insforge';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const { stats } = useSite();
  const [counts, setCounts] = useState({ attractions: 0, gallery: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [{ count: attrCount }, { count: galCount }] = await Promise.all([
          insforge.database.from('attractions').select('*', { count: 'exact', head: true }),
          insforge.database.from('gallery').select('*', { count: 'exact', head: true })
        ]);
        setCounts({
          attractions: attrCount || 0,
          gallery: galCount || 0
        });
      } catch (err) {
        console.warn('Failed to fetch dashboard counts:', err);
      }
    };
    fetchCounts();
  }, []);

  const displayStats = [
    { name: 'Total Visitors Today', value: stats?.totalViews > 0 ? `${stats.totalViews.toLocaleString()}+` : '1,240+', icon: Users, color: 'bg-primary-green', trend: 'Live' },
    { name: 'Page Views', value: stats?.totalViews > 0 ? `${Math.floor(stats.totalViews * 1.5).toLocaleString()}` : '1.8k', icon: Eye, color: 'bg-blue-500', trend: 'Live' },
    { name: 'Active Attractions', value: counts.attractions.toString(), icon: MapPin, color: 'bg-accent-gold', trend: 'Live' },
    { name: 'Gallery Items', value: counts.gallery.toString(), icon: ImageIcon, color: 'bg-purple-500', trend: 'Live' },
  ];

  const recentActivities = [
    { title: 'Hero Section updated', time: 'Recently', user: 'Admin' },
    { title: 'Gallery images synchronized', time: 'Recently', user: 'System' },
    { title: 'Site SEO parameters updated', time: 'Recently', user: 'Admin' },
  ];

  return (
    <div className="space-y-6 md:space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-dark mb-1">Admin Dashboard</h1>
          <p className="text-text-dark/50 flex items-center space-x-2 text-[11px] md:text-xs">
            <Calendar size={12} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
            <span className="mx-1">•</span>
            <Clock size={12} />
            <span>Last login: 9:20 AM</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/admin/manage-attractions" className="flex-1 md:flex-none text-center bg-primary-green text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-primary-green/90 transition-all">
            + New Attraction
          </Link>
          <Link to="/admin/settings" className="p-2 bg-white border border-black/5 rounded-xl text-text-dark/60 hover:text-primary-green transition-all shadow-sm">
            <Settings size={20} />
          </Link>
        </div>
      </div>

      {/* Stats Grid - More Compact on Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {displayStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-2 md:mb-4">
                <div className={`${stat.color} p-2 md:p-3 rounded-xl md:rounded-2xl text-white shadow-md`}>
                  <Icon size={18} className="md:w-6 md:h-6" />
                </div>
                <div className="bg-green-100 text-green-700 text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-0.5">
                  <ArrowUpRight size={8} />
                  <span>{stat.trend}</span>
                </div>
              </div>
              <p className="text-text-dark/40 text-[9px] md:text-[11px] font-bold uppercase tracking-wider mb-0.5 md:mb-1 truncate">{stat.name}</p>
              <h2 className="text-xl md:text-3xl font-heading font-bold text-text-dark">{stat.value}</h2>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Quick Management Cards */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg md:text-xl font-heading font-bold text-text-dark">Quick Management</h3>
            <Link to="/admin/settings" className="text-xs font-bold text-primary-green hover:text-accent-gold transition-colors">See all</Link>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <Link to="/admin/manage-hero" className="bg-[#1A2E22] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h4 className="text-base md:text-lg font-heading font-bold mb-1">Hero Section</h4>
                <p className="text-white/40 text-[10px] md:text-xs mb-4">Edit main headlines & video.</p>
                <div className="flex items-center text-accent-gold font-bold text-[10px] md:text-xs space-x-2 group-hover:translate-x-1 transition-transform">
                  <span>Open</span>
                  <ArrowRight size={14} />
                </div>
              </div>
              <Sparkles className="absolute bottom-[-5%] right-[-5%] text-white/5 w-16 h-16 md:w-24 md:h-24 group-hover:scale-110 transition-transform" />
            </Link>

            <Link to="/admin/manage-attractions" className="bg-primary-green p-5 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] text-white overflow-hidden relative group text-balance">
              <div className="relative z-10">
                <h4 className="text-base md:text-lg font-heading font-bold mb-1">Attractions</h4>
                <p className="text-white/40 text-[10px] md:text-xs mb-4">Manage park features.</p>
                <div className="flex items-center text-accent-gold font-bold text-[10px] md:text-xs space-x-2 group-hover:translate-x-1 transition-transform">
                  <span>Open</span>
                  <ArrowRight size={14} />
                </div>
              </div>
              <MapPin className="absolute bottom-[-5%] right-[-5%] text-white/5 w-16 h-16 md:w-24 md:h-24 group-hover:scale-110 transition-transform" />
            </Link>

            <Link to="/admin/manage-pricing" className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] text-text-dark overflow-hidden relative group border border-black/5 shadow-sm hover:border-primary-green/20">
              <div className="relative z-10">
                <h4 className="text-base md:text-lg font-heading font-bold mb-1 font-title">Pricing</h4>
                <p className="text-text-dark/40 text-[10px] md:text-xs mb-4">Entry & parking fees.</p>
                <div className="flex items-center text-primary-green font-bold text-[10px] md:text-xs space-x-2 group-hover:translate-x-1 transition-transform">
                  <span>Open</span>
                  <ArrowRight size={14} />
                </div>
              </div>
              <Activity className="absolute bottom-[-5%] right-[-5%] text-primary-green/5 w-16 h-16 md:w-24 md:h-24 group-hover:scale-110 transition-transform" />
            </Link>

            <Link to="/admin/manage-footer" className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] text-text-dark overflow-hidden relative group border border-black/5 shadow-sm hover:border-primary-green/20">
              <div className="relative z-10">
                <h4 className="text-base md:text-lg font-heading font-bold mb-1">Footer/Links</h4>
                <p className="text-text-dark/40 text-[10px] md:text-xs mb-4">Social links & address.</p>
                <div className="flex items-center text-primary-green font-bold text-[10px] md:text-xs space-x-2 group-hover:translate-x-1 transition-transform">
                  <span>Open</span>
                  <ArrowRight size={14} />
                </div>
              </div>
              <Activity className="absolute bottom-[-5%] right-[-5%] text-primary-green/5 w-16 h-16 md:w-24 md:h-24 group-hover:scale-110 transition-transform" />
            </Link>

            <Link to="/admin/manage-info" className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] text-text-dark overflow-hidden relative group border border-black/5 shadow-sm hover:border-primary-green/20">
              <div className="relative z-10">
                <h4 className="text-base md:text-lg font-heading font-bold mb-1">Site Info</h4>
                <p className="text-text-dark/40 text-[10px] md:text-xs mb-4">Timings & location.</p>
                <div className="flex items-center text-primary-green font-bold text-[10px] md:text-xs space-x-2 group-hover:translate-x-1 transition-transform">
                  <span>Open</span>
                  <ArrowRight size={14} />
                </div>
              </div>
              <Activity className="absolute bottom-[-5%] right-[-5%] text-primary-green/5 w-16 h-16 md:w-24 md:h-24 group-hover:scale-110 transition-transform" />
            </Link>

            <Link to="/admin/manage-seo" className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] text-text-dark overflow-hidden relative group border border-black/5 shadow-sm hover:border-primary-green/20">
              <div className="relative z-10">
                <h4 className="text-base md:text-lg font-heading font-bold mb-1">SEO</h4>
                <p className="text-text-dark/40 text-[10px] md:text-xs mb-4">Titles & meta tags.</p>
                <div className="flex items-center text-primary-green font-bold text-[10px] md:text-xs space-x-2 group-hover:translate-x-1 transition-transform">
                  <span>Open</span>
                  <ArrowRight size={14} />
                </div>
              </div>
              <Activity className="absolute bottom-[-5%] right-[-5%] text-primary-green/5 w-16 h-16 md:w-24 md:h-24 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Activity Feed - Simpler on Mobile */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 border border-black/5 shadow-sm h-fit">
          <h3 className="text-lg md:text-xl font-heading font-bold text-text-dark mb-6">System Log</h3>
          <div className="space-y-4 md:space-y-6">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start space-x-3 md:space-x-4">
                <div className="w-1 h-8 md:h-10 bg-accent-gold rounded-full shrink-0" />
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-text-dark leading-tight mb-1">{activity.title}</h4>
                  <p className="text-[9px] md:text-[10px] text-text-dark/40 uppercase tracking-wider font-bold">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 md:mt-10 py-3 md:py-4 border border-black/5 hover:border-primary-green/20 rounded-xl md:rounded-2xl text-primary-green font-bold text-[11px] md:text-sm transition-all bg-[#F8FAF9]/50">
            View Historical Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

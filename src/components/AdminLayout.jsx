import { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Image, 
  MapPin, 
  Search,
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  IndianRupee,
  LayoutGrid,
  Info,
  Phone,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Hero Section', path: '/admin/manage-hero', icon: Sparkles },
    { name: 'Attractions', path: '/admin/manage-attractions', icon: MapPin },
    { name: 'Gallery', path: '/admin/manage-gallery', icon: Image },
    { name: 'Pricing', path: '/admin/manage-pricing', icon: IndianRupee },
    { name: 'Footer & Links', path: '/admin/manage-footer', icon: Phone },
    { name: 'Site Info', path: '/admin/manage-info', icon: Info },
    { name: 'SEO Settings', path: '/admin/manage-seo', icon: Search },
    { name: 'User Feedback', path: '/admin/manage-feedback', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex font-body">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#1A2E22] text-white p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <span className="text-3xl">🌿</span>
          <div className="flex flex-col">
            <h1 className="font-heading font-bold text-xl leading-tight">Admin</h1>
            <span className="text-[10px] text-accent-gold uppercase tracking-widest font-bold">Amnour Park</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-accent-gold text-[#1A2E22] shadow-lg shadow-accent-gold/10' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} className={isActive ? 'text-[#1A2E22]' : 'text-accent-gold/60 group-hover:text-accent-gold transition-colors'} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="activeDot" className="w-1.5 h-1.5 bg-[#1A2E22] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
          <div className="flex items-center space-x-3 px-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center text-accent-gold font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.email}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-tighter">System Administrator</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Simpler & Responsive */}
        <header className="bg-white border-b border-black/5 px-4 lg:px-8 h-16 flex items-center justify-between shadow-sm z-20">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-text-dark/60 hover:text-primary-green transition-colors bg-black/5 rounded-xl"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="hidden sm:flex items-center space-x-2 text-primary-green font-bold text-xs bg-primary-green/5 px-3 py-1.5 rounded-full hover:bg-primary-green/10 transition-all border border-primary-green/10">
              <TrendingUp size={14} />
              <span>View Main Website</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">System Live</span>
            </div>
            
            <div className="flex items-center space-x-3 border-l border-black/5 pl-4">
              <div className="text-right hidden xs:block">
                <p className="text-[11px] font-bold text-text-dark leading-tight">{user?.email?.split('@')[0]}</p>
                <p className="text-[9px] text-text-dark/40 font-medium">Administrator</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-green text-white flex items-center justify-center text-xs font-bold shadow-md">
                {user?.email?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content View - Adaptive Padding */}
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-10 md:py-12 bg-[#F8FAF9]">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Navbar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[#1A2E22] z-[110] p-6 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌿</span>
                  <h1 className="font-heading font-bold text-lg text-white">Admin Portal</h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/60">
                  <X size={24} />
                </button>
              </div>
              
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all ${
                        isActive 
                          ? 'bg-accent-gold text-[#1A2E22]' 
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-bold">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <button 
                onClick={handleLogout}
                className="mt-auto w-full flex items-center justify-center space-x-3 py-4 rounded-2xl bg-red-500/10 text-red-400 font-bold"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;

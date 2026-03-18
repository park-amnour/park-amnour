import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, RefreshCw, LogOut, Shield, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const clearCache = () => {
    if (window.confirm('This will reset all your customizations (Hero, Attractions, Gallery) to default. Are you sure?')) {
      localStorage.removeItem('site_hero_data');
      localStorage.removeItem('site_attractions_data');
      localStorage.removeItem('site_gallery_data');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div>
        <h2 className="text-2xl font-heading font-bold text-text-dark">Admin Settings</h2>
        <p className="text-text-dark/50 text-sm">System configuration and account management</p>
      </div>

      {showSuccess && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-100 text-green-700 p-4 rounded-2xl font-bold flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>System settings updated!</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Info */}
        <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-primary-green mb-2">
            <div className="bg-primary-green/10 p-2 rounded-lg">
              <Shield size={18} />
            </div>
            <h3 className="font-bold text-lg">Account Security</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-text-dark/40 uppercase tracking-widest">Login Email</label>
              <p className="text-text-dark font-medium p-3 bg-cream/30 rounded-xl mt-1">admin@amnourpark.com</p>
            </div>
            <div>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-500 p-4 rounded-xl font-bold hover:bg-red-100 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout Admin Session</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-primary-green mb-2">
            <div className="bg-primary-green/10 p-2 rounded-lg">
              <Database size={18} />
            </div>
            <h3 className="font-bold text-lg">Data Management</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-text-dark/60 leading-relaxed">
              Managing the local data storage used for website content. You can reset all changes to factory defaults here.
            </p>
            <button 
              onClick={clearCache}
              className="w-full flex items-center justify-center space-x-2 bg-cream text-text-dark p-4 rounded-xl font-bold hover:bg-black/5 transition-colors border border-black/5"
            >
              <RefreshCw size={20} />
              <span>Reset Site Content</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-black/5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-primary-green">
            <div className="bg-primary-green/10 p-2 rounded-lg shrink-0">
              <SettingsIcon size={18} />
            </div>
            <h3 className="font-bold text-base md:text-lg">System Performance</h3>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full md:w-auto flex items-center justify-center space-x-2 bg-primary-green text-white px-6 py-3 md:py-2 rounded-xl font-bold hover:bg-primary-green/90 transition-all disabled:opacity-50 text-sm shadow-md"
          >
            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

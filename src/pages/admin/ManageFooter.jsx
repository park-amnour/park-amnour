import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Link as LinkIcon } from 'lucide-react';
import { insforge } from '../../lib/insforge';

const ManageFooter = () => {
  const [footer, setFooter] = useState({
    address: 'Amnour Harnarayan, Saran, Bihar 841401',
    phone: '+91 91223 34455',
    email: 'info@amnourpark.com',
    fb: 'https://facebook.com/amnourpark',
    ig: 'https://instagram.com/amnourpark',
    yt: 'https://youtube.com/@amnourpark'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const { data, error } = await insforge.database
          .from('site_settings')
          .select('data')
          .eq('key', 'footer')
          .single();
        
        if (data) {
          setFooter(data.data);
        }
      } catch (err) {
        console.error('Error fetching footer:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFooter();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await insforge.database
        .from('site_settings')
        .upsert({ key: 'footer', data: footer });
      
      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving footer:', err);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (key, value) => {
    setFooter(prev => ({ ...prev, [key]: value }));
  };

  const InputField = ({ icon: Icon, label, value, onChange, placeholder }) => (
    <div className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-black/5 shadow-sm space-y-2">
      <label className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest flex items-center space-x-2 px-1 mb-1">
        <Icon size={12} className="text-primary-green/60" />
        <span>{label}</span>
      </label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl py-2.5 md:py-3 px-4 text-sm text-text-dark font-medium focus:border-primary-green/50 outline-none transition-all shadow-sm"
      />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6 md:space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[1.5rem] md:rounded-[2rem] border border-black/5 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-text-dark">Footer & Links</h2>
          <p className="text-text-dark/50 text-xs mt-1">Social links & contact info</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-primary-green text-white px-8 py-3 rounded-xl md:rounded-2xl font-bold hover:bg-primary-green/90 transition-all shadow-lg shadow-primary-green/20 disabled:opacity-70 text-sm"
        >
          {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{isSaving ? 'Saving...' : 'Save Footer'}</span>
        </button>
      </div>

      {showSuccess && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-600 text-white p-4 rounded-xl font-bold flex items-center space-x-3 shadow-md">
          <Save size={18} />
          <span className="text-sm">Footer updated successfully!</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div className="sm:col-span-2">
          <InputField 
            icon={MapPin} 
            label="Street Address" 
            value={footer.address} 
            onChange={(v) => updateField('address', v)}
            placeholder="Full Address"
          />
        </div>
        <InputField 
          icon={Phone} 
          label="Phone Number" 
          value={footer.phone} 
          onChange={(v) => updateField('phone', v)}
          placeholder="+91 00000 00000"
        />
        <InputField 
          icon={Mail} 
          label="Email Address" 
          value={footer.email} 
          onChange={(v) => updateField('email', v)}
          placeholder="info@amnourpark.com"
        />
        <InputField 
          icon={Facebook} 
          label="Facebook Link" 
          value={footer.fb} 
          onChange={(v) => updateField('fb', v)}
          placeholder="https://facebook.com/..."
        />
        <InputField 
          icon={Instagram} 
          label="Instagram Link" 
          value={footer.ig} 
          onChange={(v) => updateField('ig', v)}
          placeholder="https://instagram.com/..."
        />
        <div className="sm:col-span-2">
          <InputField 
            icon={Youtube} 
            label="Youtube Channel Link" 
            value={footer.yt} 
            onChange={(v) => updateField('yt', v)}
            placeholder="https://youtube.com/..."
          />
        </div>
      </div>
    </div>
  );
};

export default ManageFooter;

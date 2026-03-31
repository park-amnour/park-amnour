import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Save, RefreshCw, Sun, Moon, Anchor, Bike } from 'lucide-react';
import { insforge } from '../../lib/insforge';

const PriceCard = ({ icon: Icon, title, value, onChange, color }) => (
  <div className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-black/5 shadow-sm space-y-3">
    <div className="flex items-center space-x-3">
      <div className={`${color} p-2 rounded-lg text-white shadow-sm`}>
        <Icon size={16} />
      </div>
      <h3 className="font-bold text-sm text-text-dark">{title}</h3>
    </div>
    <div className="relative">
      <IndianRupee size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/40" />
      <input 
        type="number" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl py-3 pl-10 pr-4 text-text-dark font-bold focus:border-primary-green/50 outline-none transition-all text-sm"
      />
    </div>
  </div>
);

const ManagePricing = () => {
  const [pricing, setPricing] = useState({
    dayEntry: 10,
    eveningEntry: 25,
    boating: 100,
    parkingBike: 10,
    parkingCycle: 5
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const { data, error } = await insforge.database
          .from('site_settings')
          .select('data')
          .eq('key', 'pricing')
          .single();
        
        if (data) {
          setPricing(data.data);
        }
      } catch (err) {
        console.error('Error fetching pricing:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await insforge.database
        .from('site_settings')
        .upsert({ key: 'pricing', data: pricing });
      
      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving pricing:', err);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePrice = (key, value) => {
    setPricing(prev => ({ ...prev, [key]: parseInt(value) || 0 }));
  };

  return (
    <div className="max-w-4xl space-y-6 md:space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[1.5rem] md:rounded-[2rem] border border-black/5 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-text-dark">Manage Pricing</h2>
          <p className="text-text-dark/50 text-xs mt-1">Update fees & service charges</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-primary-green text-white px-8 py-3 rounded-xl md:rounded-2xl font-bold hover:bg-primary-green/90 transition-all shadow-lg shadow-primary-green/20 disabled:opacity-70 text-sm"
        >
          {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{isSaving ? 'Saving...' : 'Save Pricing'}</span>
        </button>
      </div>

      {showSuccess && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-600 text-white p-4 rounded-xl font-bold flex items-center space-x-3 shadow-md">
          <Save size={18} />
          <span className="text-sm">Pricing updated successfully!</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <PriceCard 
          icon={Sun} 
          title="Day Entry Fee" 
          value={pricing.dayEntry} 
          onChange={(v) => updatePrice('dayEntry', v)}
          color="bg-orange-400"
        />
        <PriceCard 
          icon={Moon} 
          title="Evening Entry Fee" 
          value={pricing.eveningEntry} 
          onChange={(v) => updatePrice('eveningEntry', v)}
          color="bg-primary-green"
        />
        <PriceCard 
          icon={Anchor} 
          title="Boating Charge" 
          value={pricing.boating} 
          onChange={(v) => updatePrice('boating', v)}
          color="bg-blue-500"
        />
        <PriceCard 
          icon={Bike} 
          title="Bike Parking" 
          value={pricing.parkingBike} 
          onChange={(v) => updatePrice('parkingBike', v)}
          color="bg-purple-500"
        />
        <PriceCard 
          icon={Bike} 
          title="Bicycle Parking" 
          value={pricing.parkingCycle} 
          onChange={(v) => updatePrice('parkingCycle', v)}
          color="bg-slate-400"
        />
      </div>

      <div className="bg-accent-gold/5 p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-accent-gold/20 flex items-start space-x-4">
        <div className="bg-accent-gold/20 p-2 rounded-lg text-accent-gold mt-1 shrink-0">
          <IndianRupee size={16} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-text-dark mb-1 underline decoration-accent-gold/30 underline-offset-4">Pricing Note</h4>
          <p className="text-[11px] md:text-xs text-text-dark/60 leading-relaxed max-w-2xl">
            Updating these values will automatically refresh the "Entry Fee" section on the home page and the pricing cards. All prices are in Indian Rupees (₹).
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagePricing;

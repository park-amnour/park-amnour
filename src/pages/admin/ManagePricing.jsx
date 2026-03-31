import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Save, RefreshCw, Sun, Moon, Anchor, Bike, PartyPopper, Calendar } from 'lucide-react';
import { insforge } from '../../lib/insforge';

const PriceCard = ({ icon: Icon, title, value, onChange, color, isFree, onToggleFree }) => (
  <div className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-black/5 shadow-sm space-y-3 relative overflow-hidden">
    {isFree && (
      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-4 py-1 -mr-4 mt-2 rotate-45 shadow-sm">
        FREE
      </div>
    )}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`${color} p-2 rounded-lg text-white shadow-sm`}>
          <Icon size={16} />
        </div>
        <h3 className="font-bold text-sm text-text-dark">{title}</h3>
      </div>
      <button 
        onClick={() => onToggleFree(!isFree)}
        className={`text-[10px] px-2 py-1 rounded-md font-bold transition-all ${isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}
      >
        {isFree ? 'MARKED FREE' : 'SET FREE'}
      </button>
    </div>
    <div className={`relative transition-opacity ${isFree ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
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
          // Merge with defaults to handle new keys safely
          setPricing(prev => ({ ...prev, ...data.data }));
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
      
      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('insforge:content_updated', { 
        detail: { type: 'pricing' } 
      }));

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
    const isToggle = typeof value === 'boolean' || key === 'festivalName' || key === 'festivalUntil';
    setPricing(prev => ({ ...prev, [key]: isToggle ? value : (parseInt(value) || 0) }));
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

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <PriceCard 
          icon={Sun} 
          title="Entry Fees (Day/Evening)" 
          value={pricing.dayEntry} 
          onChange={(v) => updatePrice('dayEntry', v)}
          isFree={pricing.entryFree}
          onToggleFree={(v) => updatePrice('entryFree', v)}
          color="bg-orange-400"
        />
        <PriceCard 
          icon={Anchor} 
          title="Boating Fees (2P/4P)" 
          value={pricing.boating2p} 
          onChange={(v) => updatePrice('boating2p', v)}
          isFree={pricing.boatingFree}
          onToggleFree={(v) => updatePrice('boatingFree', v)}
          color="bg-blue-500"
        />
        <PriceCard 
          icon={Bike} 
          title="Parking Fees" 
          value={pricing.parkingBike} 
          onChange={(v) => updatePrice('parkingBike', v)}
          isFree={pricing.parkingFree}
          onToggleFree={(v) => updatePrice('parkingFree', v)}
          color="bg-purple-500"
        />
      </div>

      {/* Festival Details */}
      <section className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm border border-black/5 space-y-6">
        <div className="flex items-center space-x-3 text-red-500">
          <PartyPopper size={24} />
          <h3 className="font-bold text-lg text-text-dark">Festival Offer Details (Teohar Offer)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest px-1">Festival Name / Reason</label>
            <div className="relative">
              <PartyPopper size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/40" />
              <input 
                type="text" 
                value={pricing.festivalName}
                onChange={(e) => updatePrice('festivalName', e.target.value)}
                placeholder="e.g., Holi Dhamaka, New Year Offer"
                className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl py-3 pl-10 pr-4 text-sm text-text-dark font-medium focus:border-primary-green/50 outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest px-1">Active Until (Date/Duration)</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/40" />
              <input 
                type="text" 
                value={pricing.festivalUntil}
                onChange={(e) => updatePrice('festivalUntil', e.target.value)}
                placeholder="e.g., 25th March, Weekend Only"
                className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl py-3 pl-10 pr-4 text-sm text-text-dark font-medium focus:border-primary-green/50 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
            <strong>Note:</strong> When you mark a category as "FREE", it will override the price and show a "FREE" badge on the website. The Festival Name and Duration will appear at the top of the pricing section.
          </p>
        </div>
      </section>

      <div className="bg-accent-gold/5 p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-accent-gold/20 flex items-start space-x-4">
        <div className="bg-accent-gold/20 p-2 rounded-lg text-accent-gold mt-1 shrink-0">
          <IndianRupee size={16} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-text-dark mb-1 underline decoration-accent-gold/30 underline-offset-4">Pricing Note</h4>
          <p className="text-[11px] md:text-xs text-text-dark/60 leading-relaxed max-w-2xl">
            Updating these values will automatically refresh the pricing tables across the site. Ensure "Free" status is toggled OFF once a festival ends.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagePricing;

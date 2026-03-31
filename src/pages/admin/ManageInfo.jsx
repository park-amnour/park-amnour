import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Clock, MapPin, Compass, Navigation } from 'lucide-react';
import { insforge } from '../../lib/insforge';
import { HindiInput } from '../../components/HindiInput';

const InputSection = ({ icon: Icon, label, valueEn, valueHi, onChangeEn, onChangeHi }) => (
  <div className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-black/5 shadow-sm space-y-4 md:space-y-6">
    <div className="flex items-center space-x-3 text-primary-green">
      <div className="bg-primary-green/10 p-2 rounded-lg">
        <Icon size={18} />
      </div>
      <h3 className="font-bold text-base md:text-lg">{label}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest px-1">English</label>
        <input 
          type="text" 
          value={valueEn}
          onChange={(e) => onChangeEn(e.target.value)}
          className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl py-2.5 md:py-3 px-4 text-sm text-text-dark font-medium focus:border-primary-green/50 outline-none transition-all"
        />
      </div>
      <HindiInput 
        label="Hindi" 
        value={valueHi} 
        syncValue={valueEn}
        onChange={onChangeHi} 
        className="sm:text-right"
        placeholder="हिंदी में..."
      />
    </div>
  </div>
);

const ManageInfo = () => {
  const [reachData, setReachData] = useState({
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
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReach = async () => {
      try {
        const { data, error } = await insforge.database
          .from('site_settings')
          .select('data')
          .eq('key', 'reach')
          .single();
        
        if (data) {
          setReachData(data.data);
        }
      } catch (err) {
        console.error('Error fetching reach data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReach();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await insforge.database
        .from('site_settings')
        .upsert({ key: 'reach', data: reachData });
      
      if (error) throw error;
      
      window.dispatchEvent(new CustomEvent('insforge:content_updated', { 
        detail: { type: 'reach' } 
      }));

      // Broadcast real-time update
      try {
        await insforge.realtime.connect();
        await insforge.realtime.publish('site_content', 'content_updated', { type: 'reach' });
      } catch (e) {
        console.warn('Real-time broadcast failed:', e);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving reach data:', err);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (key, value) => {
    setReachData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl space-y-6 md:space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[1.5rem] md:rounded-[2rem] border border-black/5 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-text-dark">Information & Reach</h2>
          <p className="text-text-dark/50 text-xs mt-1">Timings, location & map details</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-primary-green text-white px-8 py-3 rounded-xl md:rounded-2xl font-bold hover:bg-primary-green/90 transition-all shadow-lg shadow-primary-green/20 disabled:opacity-70 text-sm"
        >
          {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{isSaving ? 'Saving...' : 'Save Info'}</span>
        </button>
      </div>

      {/* Travel Tip */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start space-x-3">
        <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600 shrink-0">
          <Navigation size={14} />
        </div>
        <p className="text-[11px] text-amber-800/70 leading-relaxed font-medium">
          <strong>Pro Tip:</strong> Ensure map coordinates are accurate. 80% of visitors use the "Get Directions" button from their mobile devices.
        </p>
      </div>

      {showSuccess && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-600 text-white p-4 rounded-xl font-bold flex items-center space-x-3 shadow-md">
          <Save size={18} />
          <span className="text-sm">Site information refreshed!</span>
        </motion.div>
      )}

      <div className="space-y-4 md:space-y-6">
        <InputSection 
          icon={Clock} 
          label="Park Timings" 
          valueEn={reachData.timingsEn} 
          valueHi={reachData.timingsHi} 
          onChangeEn={(v) => updateField('timingsEn', v)}
          onChangeHi={(v) => updateField('timingsHi', v)}
        />
        <InputSection 
          icon={MapPin} 
          label="Location Summary" 
          valueEn={reachData.locationEn} 
          valueHi={reachData.locationHi} 
          onChangeEn={(v) => updateField('locationEn', v)}
          onChangeHi={(v) => updateField('locationHi', v)}
        />
        <InputSection 
          icon={Navigation} 
          label="Distance from Chhapra" 
          valueEn={reachData.distChhapraEn} 
          valueHi={reachData.distChhapraHi} 
          onChangeEn={(v) => updateField('distChhapraEn', v)}
          onChangeHi={(v) => updateField('distChhapraHi', v)}
        />
        <InputSection 
          icon={Compass} 
          label="Distance from Patna" 
          valueEn={reachData.distPatnaEn} 
          valueHi={reachData.distPatnaHi} 
          onChangeEn={(v) => updateField('distPatnaEn', v)}
          onChangeHi={(v) => updateField('distPatnaHi', v)}
        />

        <div className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-black/5 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-primary-green">
            <div className="bg-primary-green/10 p-2 rounded-lg">
              <MapPin size={18} />
            </div>
            <h3 className="font-bold text-base md:text-lg">Google Maps URL</h3>
          </div>
          <input 
            type="text" 
            value={reachData.mapUrl}
            onChange={(e) => updateField('mapUrl', e.target.value)}
            placeholder="Paste Google Maps share link..."
            className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl py-3 px-4 md:px-6 text-sm text-text-dark font-medium focus:border-primary-green/50 outline-none transition-all shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ManageInfo;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Search, Type, MessageSquare, CheckCircle2, RefreshCw, Upload } from 'lucide-react';
import { insforge } from '../../lib/insforge';

const ManageSEO = () => {
  const [seo, setSeo] = useState({
    siteTitle: 'Amnour Park | Amrit Sarovar, Saran, Bihar',
    metaDesc: 'Experience Nature, Peace & Adventure at Saran\'s Beloved Park. Developed under the Mission Amrit Sarovar scheme.',
    keywords: 'amnour park, park amnour, pokhra amnour, amnour pokhra, best place amnour, best couple place, Amrit Sarovar, Saran Tourism, Bihar Picnic Spot, Boating in Bihar',
    ogImage: 'https://amnourpark.com/og-image.jpg'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const { data, error } = await insforge.database
          .from('site_settings')
          .select('data')
          .eq('key', 'seo')
          .single();
        
        if (data) {
          setSeo(data.data);
        }
      } catch (err) {
        console.error('Error fetching SEO data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSEO();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileName = `seo/og_${Date.now()}_${file.name}`;
      const { data, error } = await insforge.storage
        .from('media')
        .upload(fileName, file);
      
      if (error) throw error;

      const publicUrl = insforge.storage.from('media').getPublicUrl(fileName);
      const newSeo = { ...seo, ogImage: publicUrl };
      setSeo(newSeo);
      
      // Auto-save to database
      await insforge.database
        .from('site_settings')
        .upsert({ key: 'seo', data: newSeo });
        
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error uploading SEO image:', err);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await insforge.database
        .from('site_settings')
        .upsert({ key: 'seo', data: seo });
      
      if (error) throw error;
      
      document.title = seo.siteTitle;
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving SEO data:', err);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 md:space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[1.5rem] md:rounded-[2rem] border border-black/5 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-text-dark">SEO & Metadata</h2>
          <p className="text-text-dark/50 text-xs mt-1">Manage search engine appearance</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-primary-green text-white px-8 py-3 rounded-xl md:rounded-2xl font-bold hover:bg-primary-green/90 transition-all shadow-lg shadow-primary-green/20 disabled:opacity-70 text-sm"
        >
          {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{isSaving ? 'Updating...' : 'Save All'}</span>
        </button>
      </div>

      {showSuccess && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-600 text-white p-4 rounded-xl font-bold flex items-center space-x-3 shadow-md">
          <CheckCircle2 size={18} />
          <span className="text-sm">Metadata updated successfully!</span>
        </motion.div>
      )}

      <div className="space-y-5">
        {/* Site Title */}
        <section className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm border border-black/5">
          <div className="flex items-center space-x-3 mb-5 md:mb-6">
            <div className="p-2 bg-primary-green/5 rounded-lg text-primary-green">
              <Type size={18} />
            </div>
            <h2 className="font-bold text-text-dark">Browser Title</h2>
          </div>
          <div className="space-y-4">
            <input 
              type="text"
              value={seo.siteTitle}
              onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
              className="w-full bg-[#f8faf9] border border-black/5 rounded-xl px-4 py-3 text-sm text-text-dark font-medium focus:border-primary-green/50 outline-none transition-all shadow-sm"
              placeholder="e.g. Amnour Park | Best Place to Visit"
            />
            <p className="text-[10px] text-text-dark/40 italic">Appears in Google search and browser tabs. Keep it under 60 chars.</p>
          </div>
        </section>

        {/* Global Meta Description */}
        <section className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm border border-black/5">
          <div className="flex items-center space-x-3 mb-5 md:mb-6">
            <div className="p-2 bg-primary-green/5 rounded-lg text-primary-green">
              <MessageSquare size={18} />
            </div>
            <h2 className="font-bold text-text-dark">Meta Summary</h2>
          </div>
          <div className="space-y-4">
            <textarea 
              rows="3"
              value={seo.metaDesc}
              onChange={(e) => setSeo({ ...seo, metaDesc: e.target.value })}
              className="w-full bg-[#f8faf9] border border-black/5 rounded-xl px-4 py-3 text-sm text-text-dark font-medium focus:border-primary-green/50 outline-none transition-all shadow-sm resize-none"
              placeholder="Brief summary of the park..."
            />
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-text-dark/40 italic">Ideally 150-160 characters.</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${seo.metaDesc.length > 160 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                {seo.metaDesc.length} Chars
              </span>
            </div>
          </div>
        </section>

        {/* Key Information */}
        <section className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm border border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-text-dark/40 mb-1">
              <Globe size={14} />
              <label className="text-[10px] font-bold uppercase tracking-wider">Search Keywords</label>
            </div>
            <input 
              type="text"
              value={seo.keywords}
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
              className="w-full bg-[#f8faf9] border border-black/5 rounded-xl px-4 py-3 text-sm text-text-dark font-medium focus:border-primary-green/50 outline-none transition-all shadow-sm"
              placeholder="park, saran, bihar..."
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-text-dark/40 mb-1">
              <CheckCircle2 size={14} />
              <label className="text-[10px] font-bold uppercase tracking-wider">Social Share Image</label>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-4">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden" 
                  id="seo-og-upload"
                />
                <label 
                  htmlFor="seo-og-upload"
                  className="flex-1 flex items-center justify-center space-x-2 bg-cream hover:bg-black/5 text-primary-green px-4 py-2.5 rounded-xl border-2 border-dashed border-primary-green/20 hover:border-primary-green/40 transition-all cursor-pointer text-xs font-bold"
                >
                  {isUploading ? <RefreshCw className="animate-spin" size={16} /> : <Upload size={16} />}
                  <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                </label>
                <div className="w-12 h-12 rounded-lg bg-[#f8faf9] border border-black/5 overflow-hidden shrink-0 flex items-center justify-center">
                  {seo.ogImage && !seo.ogImage.includes('amnourpark.com') ? (
                    <img src={seo.ogImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-primary-green/40 uppercase">OG</span>
                  )}
                </div>
              </div>
              {seo.ogImage && !seo.ogImage.includes('amnourpark.com') && (
                <p className="text-[10px] text-text-dark/30 truncate">{seo.ogImage}</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Preview Section */}
      <div className="pt-4">
        <h3 className="text-xs font-bold text-text-dark/30 uppercase tracking-[0.2em] mb-4 flex items-center space-x-2">
          <Search size={14} />
          <span>Real-time Search Preview</span>
        </h3>
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-black/5 shadow-xl max-w-2xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
          <div className="font-sans">
            <p className="text-[#1a0dab] text-lg md:text-xl font-medium hover:underline cursor-pointer mb-1 truncate">{seo.siteTitle}</p>
            <p className="text-[#006621] text-xs md:text-sm mb-1">https://amnourpark.com › ...</p>
            <p className="text-[#4d5156] text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3">{seo.metaDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSEO;

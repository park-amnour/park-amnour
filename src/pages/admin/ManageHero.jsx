import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Play, Type, AlignLeft } from 'lucide-react';
import { insforge } from '../../lib/insforge';

const ManageHero = () => {
  const [heroData, setHeroData] = useState({
    titleEn: 'Amnour Park (Amrit Sarovar)',
    titleHi: 'अमनौर पार्क (अमृत सरोवर)',
    descEn: 'Experience the serene beauty of Saran\'s premier destination for family, fun, and nature.',
    descHi: 'परिवार, मनोरंजन और प्रकृति के लिए सारण के प्रमुख गंतव्य की शांत सुंदरता का अनुभव करें।',
    videoUrl: '/hero-video-v2.mp4'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const { data, error } = await insforge.database
          .from('site_settings')
          .select('data')
          .eq('key', 'hero')
          .single();
        
        if (data) {
          setHeroData(data.data);
        }
      } catch (err) {
        console.error('Error fetching hero data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const isVideo = file.type.startsWith('video/');
      const folder = isVideo ? 'hero/videos' : 'hero/images';
      const fileName = `${folder}/media_${Date.now()}_${file.name}`;
      
      const { data, error } = await insforge.storage
        .from('media')
        .upload(fileName, file);
      
      if (error) throw error;

      const publicUrl = insforge.storage.from('media').getPublicUrl(fileName);
      const newData = { ...heroData, videoUrl: publicUrl };
      setHeroData(newData);
      
      // Auto-save to database
      await persistHero(newData);
    } catch (err) {
      console.error('Error uploading media:', err);
      alert('Failed to upload media');
    } finally {
      setIsUploading(false);
    }
  };

  const persistHero = async (dataToSave) => {
    setIsSaving(true);
    try {
      const { error } = await insforge.database
        .from('site_settings')
        .upsert({ key: 'hero', data: dataToSave });
      
      if (error) throw error;
      
      // Broadcast real-time update
      try {
        await insforge.realtime.connect();
        await insforge.realtime.publish('site_content', 'content_updated', { type: 'hero' });
      } catch (e) {
        console.warn('Real-time broadcast failed:', e);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving hero data:', err);
      alert('Failed to save changes to database');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => persistHero(heroData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-primary-green" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 md:space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[1.5rem] md:rounded-[2rem] border border-black/5 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-text-dark">Hero Section</h2>
          <p className="text-text-dark/50 text-xs mt-1">Update main headlines & video</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => window.history.back()}
            className="p-3 bg-cream text-text-dark/60 rounded-xl hover:bg-black/5 transition-all"
          >
            <RefreshCw size={20} className="rotate-45" />
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-primary-green text-white px-6 md:px-8 py-3 rounded-xl md:rounded-2xl font-bold hover:bg-primary-green/90 transition-all shadow-lg shadow-primary-green/20 disabled:opacity-70 text-sm"
          >
            {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
            <span>{isSaving ? 'Saving...' : 'Save All'}</span>
          </button>
        </div>
      </div>

      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 border border-green-200 text-green-700 px-6 py-4 rounded-2xl font-bold flex items-center space-x-3"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Hero section updated successfully!</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-primary-green mb-2">
            <div className="bg-primary-green/10 p-2 rounded-lg">
              <Type size={18} />
            </div>
            <h3 className="font-bold text-lg">Hero Headlines</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-dark/40 uppercase tracking-widest ml-1">Title (English)</label>
              <input 
                type="text" 
                value={heroData.titleEn}
                onChange={(e) => setHeroData({...heroData, titleEn: e.target.value})}
                className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl p-4 text-text-dark focus:border-primary-green/50 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-dark/40 uppercase tracking-widest ml-1">Title (Hindi)</label>
              <input 
                type="text" 
                value={heroData.titleHi}
                onChange={(e) => setHeroData({...heroData, titleHi: e.target.value})}
                className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl p-4 text-text-dark font-body focus:border-primary-green/50 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-primary-green mb-2">
            <div className="bg-primary-green/10 p-2 rounded-lg">
              <AlignLeft size={18} />
            </div>
            <h3 className="font-bold text-lg">Description Text</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-dark/40 uppercase tracking-widest ml-1">English Description</label>
              <textarea 
                rows={4}
                value={heroData.descEn}
                onChange={(e) => setHeroData({...heroData, descEn: e.target.value})}
                className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl p-4 text-text-dark focus:border-primary-green/50 outline-none transition-all resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-dark/40 uppercase tracking-widest ml-1">Hindi Description</label>
              <textarea 
                rows={4}
                value={heroData.descHi}
                onChange={(e) => setHeroData({...heroData, descHi: e.target.value})}
                className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl p-4 text-text-dark font-body focus:border-primary-green/50 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-primary-green mb-2">
            <div className="bg-primary-green/10 p-2 rounded-lg">
              <Play size={18} />
            </div>
            <h3 className="font-bold text-lg">Background Video</h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 h-40 bg-[#F8FAF9] border border-black/5 rounded-2xl overflow-hidden relative group">
                {heroData.videoUrl ? (
                  heroData.videoUrl.match(/\.(mp4|webm|ogg)$/i) || heroData.videoUrl.includes('hero/videos') ? (
                    <video key={heroData.videoUrl} autoPlay loop muted className="w-full h-full object-cover">
                      <source src={heroData.videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={heroData.videoUrl} alt="Hero Media" className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-text-dark/20">
                    <Play size={40} />
                    <span className="text-[10px] mt-2 font-bold uppercase tracking-widest">No Media</span>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                    <RefreshCw className="animate-spin mb-2" size={24} />
                    <span className="text-[10px] font-bold uppercase">Uploading...</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4 flex flex-col justify-center">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-dark/40 uppercase tracking-widest ml-1">Upload New Media</label>
                  <div className="relative group/input">
                    <input 
                      type="file" 
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      disabled={isUploading}
                      className="hidden" 
                      id="hero-media-upload"
                    />
                    <label 
                      htmlFor="hero-media-upload"
                      className="flex items-center justify-center space-x-3 bg-cream hover:bg-black/5 text-primary-green px-6 py-4 rounded-xl border-2 border-dashed border-primary-green/20 hover:border-primary-green/40 transition-all cursor-pointer group-hover/input:shadow-md"
                    >
                      <Play size={20} className="text-primary-green" />
                      <span className="font-bold text-sm">Select Media File</span>
                    </label>
                  </div>
                </div>
                <p className="text-[10px] text-text-dark/40 italic">
                  * Supported: MP4, GIF, PNG, JPG. Recommended under 10MB.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHero;

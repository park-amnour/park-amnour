import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RefreshCw, Plus, Trash2, Image as ImageIcon, LayoutGrid, X, Upload } from 'lucide-react';
import { insforge } from '../../lib/insforge';

const ManageGallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await insforge.database
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data) {
          setGalleryImages(data);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileName = `gallery/img_${Date.now()}_${file.name}`;
      const { data, error } = await insforge.storage
        .from('media')
        .upload(fileName, file);
      
      if (error) throw error;

      const publicUrl = insforge.storage.from('media').getPublicUrl(fileName);
      
      // Auto-add to the gallery list
      const newImg = {
        id: crypto.randomUUID(),
        url: publicUrl,
        categoryen: 'General',
        categoryhi: 'सामान्य'
      };
      const newImages = [newImg, ...galleryImages];
      setGalleryImages(newImages);
      // alert('Image uploaded and added to gallery!');
      
      // Auto-save to database
      await persistGallery(newImages);
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const persistGallery = async (imagesToSave) => {
    setIsSaving(true);
    try {
      // Ensure all images have valid IDs and strictly sanitize the payload
      const toUpsert = imagesToSave.map(img => {
        // Explicitly extract ONLY the fields we want to persist
        // We strip created_at and other metadata to let the DB handle them
        const { id, url, categoryen, categoryhi } = img;
        return {
          id: (typeof id === 'string' && id.startsWith('new_')) ? crypto.randomUUID() : id,
          url,
          categoryen: categoryen || 'General',
          categoryhi: categoryhi || 'सामान्य'
        };
      });

      const { error } = await insforge.database
        .from('gallery')
        .upsert(toUpsert);
      
      if (error) {
        console.error('Upsert error details:', error);
        throw error;
      }
      window.dispatchEvent(new CustomEvent('insforge:content_updated', { detail: { type: 'gallery' } }));

      // Broadcast real-time update
      try {
        await insforge.realtime.connect();
        await insforge.realtime.publish('site_content', 'content_updated', { type: 'gallery' });
      } catch (e) {
        console.warn('Real-time broadcast failed:', e);
      }

      const { data } = await insforge.database
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setGalleryImages(data);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving gallery:', err);
      alert('Failed to save changes to database');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => persistGallery(galleryImages);

  const deleteImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      if (typeof id === 'string' && id.includes('-')) {
        try {
          const { error } = await insforge.database
            .from('gallery')
            .delete()
            .eq('id', id);
          if (error) throw error;
        } catch (err) {
          console.error('Error deleting image:', err);
          alert('Failed to delete from database');
          return;
        }
      }
      setGalleryImages(galleryImages.filter(img => img.id !== id));
    }
  };

  const updateCategory = (id, lang, value) => {
    setGalleryImages(galleryImages.map(img => 
      img.id === id ? { ...img, [lang === 'EN' ? 'categoryen' : 'categoryhi']: value } : img
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-primary-green" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6 md:space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[1.5rem] md:rounded-[2rem] border border-black/5 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-text-dark">Photo Gallery</h2>
          <p className="text-text-dark/50 text-xs mt-1">Showcase the beauty of the park</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || isUploading}
          className="flex items-center justify-center space-x-2 bg-primary-green text-white px-8 py-3 rounded-xl md:rounded-2xl font-bold hover:bg-primary-green/90 transition-all shadow-lg shadow-primary-green/20 disabled:opacity-70 text-sm"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{isSaving ? 'Saving...' : 'Save Gallery'}</span>
        </button>
      </div>

      {showSuccess && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-blue-600 text-white p-4 rounded-xl flex items-center space-x-3 font-bold shadow-lg">
          <Save size={18} />
          <span className="text-sm">Gallery database updated successfully!</span>
        </motion.div>
      )}

      {/* Add New Image - Direct Upload */}
      <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-black/5 shadow-sm">
        <h3 className="font-bold text-base md:text-lg mb-4 flex items-center space-x-2 text-primary-green">
          <Plus size={20} />
          <span>Add to Gallery</span>
        </h3>
        <div className="relative">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden" 
            id="gallery-photo-upload"
          />
          <label 
            htmlFor="gallery-photo-upload"
            className={`flex flex-col items-center justify-center space-y-3 bg-cream hover:bg-black/5 text-primary-green px-6 py-10 rounded-2xl border-2 border-dashed border-primary-green/20 hover:border-primary-green/40 transition-all cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="bg-white p-4 rounded-full shadow-sm text-primary-green">
              {isUploading ? <RefreshCw size={32} className="animate-spin" /> : <Upload size={32} />}
            </div>
            <div className="text-center">
              <span className="font-bold text-sm block">{isUploading ? 'Uploading Your Photo...' : 'Click to Upload Photo'}</span>
              <span className="text-[10px] text-text-dark/40 font-medium">Recommended: Under 2MB, Square or Landscape</span>
            </div>
          </label>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        <AnimatePresence mode="popLayout">
          {galleryImages.map((img) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={img.id}
              className="group bg-white rounded-[2rem] border border-black/5 p-4 shadow-sm relative transition-all hover:shadow-md"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-cream">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button 
                  onClick={() => deleteImage(img.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3 px-1">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[8px] font-bold text-text-dark/20 uppercase">EN</span>
                    <input 
                      type="text" 
                      value={img.categoryen}
                      onChange={(e) => updateCategory(img.id, 'EN', e.target.value)}
                      placeholder="Category (EN)"
                      className="w-full text-xs font-bold border-b border-black/0 hover:border-black/5 focus:border-primary-green outline-none py-1 transition-colors"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[8px] font-bold text-text-dark/20 uppercase">HI</span>
                    <input 
                      type="text" 
                      value={img.categoryhi}
                      onChange={(e) => updateCategory(img.id, 'HI', e.target.value)}
                      placeholder="श्रेणी (HI)"
                      className="w-full text-xs font-bold border-b border-black/0 hover:border-black/5 focus:border-primary-green outline-none py-1 transition-colors font-body"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {galleryImages.length === 0 && (
        <div className="text-center py-20 bg-white/50 rounded-[3rem] border border-dashed border-black/10">
          <LayoutGrid className="mx-auto text-black/10 mb-4" size={60} />
          <p className="text-text-dark/40 font-bold">Your gallery is empty</p>
        </div>
      )}
    </div>
  );
};

export default ManageGallery;

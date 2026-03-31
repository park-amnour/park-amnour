import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  RefreshCw, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Image as ImageIcon,
  Type,
  FileText,
  Upload
} from 'lucide-react';
import { insforge } from '../../lib/insforge';
import { HindiInput, HindiTextarea } from '../../components/HindiInput';

const ManageAttractions = () => {
  const [attractions, setAttractions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const { data, error } = await insforge.database
          .from('attractions')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (data) {
          setAttractions(data);
          if (data.length > 0) setExpandedId(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching attractions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttractions();
  }, []);

  const handleImageUpload = async (id, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingId(id);
    try {
      const fileName = `attractions/attr_${Date.now()}_${file.name}`;
      const { data, error } = await insforge.storage
        .from('media')
        .upload(fileName, file);
      
      if (error) throw error;

      const publicUrl = insforge.storage.from('media').getPublicUrl(fileName);
      const newAttractions = attractions.map(attr => 
        attr.id === id ? { ...attr, image: publicUrl } : attr
      );
      setAttractions(newAttractions);
      
      // Auto-save to database
      await persistAttractions(newAttractions);
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image');
    } finally {
      setUploadingId(null);
    }
  };

  const persistAttractions = async (itemsToSave) => {
    setIsSaving(true);
    try {
      // Ensure all items have valid IDs and strictly sanitize the payload
      const toUpsert = itemsToSave.map((attr, index) => {
        // Explicitly extract ONLY the fields we want to persist
        // We strip created_at and other metadata to let the DB handle them
        const { id, nameen, namehi, image, descen, deschi } = attr;
        return {
          id: (typeof id === 'string' && id.startsWith('new_')) ? crypto.randomUUID() : id,
          nameen: nameen || '',
          namehi: namehi || '',
          image: image || '',
          descen: descen || '',
          deschi: deschi || '',
          order_index: index
        };
      });

      const { error } = await insforge.database
        .from('attractions')
        .upsert(toUpsert);
      
      if (error) {
        console.error('Upsert error details:', error);
        throw error;
      }
      
      // Broadcast real-time update
      try {
        await insforge.realtime.connect();
        await insforge.realtime.publish('site_content', 'content_updated', { type: 'attractions' });
      } catch (e) {
        console.warn('Real-time broadcast failed:', e);
      }

      const { data } = await insforge.database
        .from('attractions')
        .select('*')
        .order('order_index', { ascending: true });
      if (data) setAttractions(data);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving attractions:', err);
      alert('Failed to save changes to database');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => persistAttractions(attractions);

  const updateAttraction = (id, field, value) => {
    setAttractions(attractions.map(attr => 
      attr.id === id ? { ...attr, [field]: value } : attr
    ));
  };

  const deleteAttraction = async (id) => {
    if (window.confirm('Are you sure you want to delete this attraction?')) {
      if (!id.startsWith('new_')) {
        try {
          const { error } = await insforge.database
            .from('attractions')
            .delete()
            .eq('id', id);
          if (error) throw error;
        } catch (err) {
          console.error('Error deleting attraction:', err);
          alert('Failed to delete from database');
          return;
        }
      }
      setAttractions(attractions.filter(attr => attr.id !== id));
    }
  };

  const addAttraction = () => {
    const newId = crypto.randomUUID();
    const newAttr = {
      id: newId,
      nameen: "New Attraction",
      namehi: "नया आकर्षण",
      descen: "Description in English",
      deschi: "हिंदी में विवरण",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200",
    };
    setAttractions([...attractions, newAttr]);
    setExpandedId(newId);
  };

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
          <h2 className="text-xl md:text-2xl font-heading font-bold text-text-dark">Park Attractions</h2>
          <p className="text-text-dark/50 text-xs mt-1">Manage what visitors see first</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button 
            onClick={addAttraction}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white text-primary-green border-2 border-primary-green px-4 md:px-6 py-2.5 rounded-xl md:rounded-2xl font-bold hover:bg-primary-green/5 transition-all text-sm"
          >
            <Plus size={18} />
            <span>Add New</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving || uploadingId}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-primary-green text-white px-6 md:px-8 py-2.5 rounded-xl md:rounded-2xl font-bold hover:bg-primary-green/90 transition-all shadow-lg shadow-primary-green/20 disabled:opacity-70 text-sm"
          >
            {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
            <span>{isSaving ? 'Saving...' : 'Save All'}</span>
          </button>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
            <ImageIcon size={16} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Content Status</p>
            <p className="text-xs text-emerald-700/70">{attractions.length} Attractions currently live</p>
          </div>
        </div>
      </div>

      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center space-x-3"
        >
          <Save size={18} />
          <span className="text-sm">Changes saved to site database!</span>
        </motion.div>
      )}

      <div className="space-y-4">
        {attractions.map((attr) => (
          <div 
            key={attr.id} 
            className={`bg-white rounded-[1.5rem] md:rounded-[2rem] border transition-all overflow-hidden ${
              expandedId === attr.id ? 'border-primary-green shadow-md ring-1 ring-primary-green/10' : 'border-black/5 shadow-sm'
            }`}
          >
            <div 
              className="px-5 py-4 md:px-8 md:py-6 flex items-center justify-between cursor-pointer hover:bg-primary-green/5 transition-colors"
              onClick={() => setExpandedId(expandedId === attr.id ? null : attr.id)}
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl border border-black/5 overflow-hidden shrink-0 shadow-sm relative">
                  <img src={attr.image} alt="" className="w-full h-full object-cover" />
                  {uploadingId === attr.id && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                      <RefreshCw size={14} className="animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-lg text-text-dark leading-tight">{attr.nameen || 'Untitled'}</h3>
                  <p className="text-[9px] md:text-xs text-text-dark/40 font-bold uppercase tracking-widest">{attr.namehi || 'हिंदी शीर्षक'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 md:space-x-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteAttraction(attr.id); }}
                  className="p-2 text-red-400 hover:bg-red-50 transition-colors rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
                <div className="text-primary-green/40 group-hover:text-primary-green transition-colors">
                  {expandedId === attr.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === attr.id && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-t border-black/5"
                >
                  <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest flex items-center space-x-2">
                          <Type size={12} />
                          <span>Attraction Name (English)</span>
                        </label>
                        <input 
                          type="text" 
                          value={attr.nameen}
                          onChange={(e) => updateAttraction(attr.id, 'nameen', e.target.value)}
                          className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl p-4 text-text-dark focus:border-primary-green/50 outline-none transition-all"
                        />
                      </div>
                      <HindiInput 
                        label="आकर्षण का नाम (हिंदी)" 
                        value={attr.namehi} 
                        syncValue={attr.nameen}
                        onChange={(v) => updateAttraction(attr.id, 'namehi', v)}
                        placeholder="नाम हिंदी में..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest flex items-center space-x-2">
                          <FileText size={12} />
                          <span>Description (English)</span>
                        </label>
                        <textarea 
                          rows={3}
                          value={attr.descen}
                          onChange={(e) => updateAttraction(attr.id, 'descen', e.target.value)}
                          className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl p-4 text-text-dark focus:border-primary-green/50 outline-none transition-all resize-none"
                        />
                      </div>
                      <HindiTextarea 
                        label="विवरण (हिंदी)" 
                        value={attr.deschi} 
                        syncValue={attr.descen}
                        onChange={(v) => updateAttraction(attr.id, 'deschi', v)}
                        rows={3}
                        placeholder="विवरण हिंदी में..."
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest flex items-center space-x-2">
                        <ImageIcon size={12} />
                        <span>Attraction Image</span>
                      </label>
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-full md:w-64 h-40 rounded-2xl overflow-hidden border border-black/5 shadow-sm bg-cream relative">
                          <img src={attr.image} alt="" className="w-full h-full object-cover" />
                          {uploadingId === attr.id && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                              <RefreshCw size={24} className="animate-spin mb-2" />
                              <span className="text-[10px] font-bold">Uploading...</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="relative">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(attr.id, e)}
                              disabled={uploadingId === attr.id}
                              className="hidden" 
                              id={`attr-img-${attr.id}`}
                            />
                            <label 
                              htmlFor={`attr-img-${attr.id}`}
                              className="flex items-center justify-center space-x-3 bg-white hover:bg-primary-green/5 text-primary-green px-6 py-4 rounded-xl border-2 border-dashed border-primary-green/20 hover:border-primary-green/40 transition-all cursor-pointer"
                            >
                              <Upload size={20} />
                              <span className="font-bold text-sm">Upload New Photo</span>
                            </label>
                          </div>
                          <p className="text-[10px] text-text-dark/40 italic">
                            * Recommended: Landscape aspect ratio, under 2MB.
                          </p>
                          {attr.image && (
                            <p className="text-[9px] text-text-dark/30 break-all">{attr.image}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {attractions.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-black/10">
            <p className="text-text-dark/40">No attractions yet. Click 'Add New' to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAttractions;

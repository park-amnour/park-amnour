import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, X, Send, CheckCircle2 } from 'lucide-react';
import { insforge } from '../lib/insforge';
import { useLanguage } from '../context/LanguageContext';

const FeedbackComponent = () => {
  const { lang } = useLanguage();
  const [feedbacks, setFeedbacks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  
  // Form State
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  
  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorDesc, setErrorDesc] = useState('');

  const fetchApprovedFeedbacks = async () => {
    try {
      const { data, error } = await insforge.database
        .from('feedback')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      if (data) setFeedbacks(data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    }
  };

  useEffect(() => {
    fetchApprovedFeedbacks();
    
    // Listen for admin changes to refresh public list
    const handleUpdate = (e) => {
      if (e.detail?.type === 'feedback') {
        fetchApprovedFeedbacks();
      }
    };
    window.addEventListener('insforge:content_updated', handleUpdate);
    return () => window.removeEventListener('insforge:content_updated', handleUpdate);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorDesc(lang === 'EN' ? 'Please enter your name.' : 'कृपया अपना नाम दर्ज करें।');
      return;
    }
    
    setIsSubmitting(true);
    setErrorDesc('');
    
    try {
      const { error } = await insforge.database
        .from('feedback')
        .insert([{
          name: name.trim(),
          rating: rating,
          comment: comment.trim(),
          is_approved: false // defaults to false in DB, but being explicit
        }]);
        
      if (error) throw error;
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        // Reset form
        setName('');
        setRating(5);
        setComment('');
        setIsSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Submit error:', err);
      setErrorDesc(lang === 'EN' ? 'Failed to submit feedback. Try again.' : 'फीडबैक सबमिट करने में विफल। पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-green mb-3">
            {lang === 'EN' ? 'Visitor Experiences' : 'दर्शकों के अनुभव'}
          </h2>
          <p className="text-text-dark/60 font-body max-w-xl">
            {lang === 'EN' 
              ? 'See what others are saying about the peace and beauty of Amnour Park.' 
              : 'देखें लोग अमनौर पार्क की शांति और सुंदरता के बारे में क्या कह रहे हैं।'}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-accent-gold hover:bg-accent-gold/90 text-text-dark px-6 py-3 rounded-full font-bold flex items-center justify-center space-x-2 transition-all shadow-md shrink-0 w-full md:w-auto"
        >
          <MessageSquare size={18} />
          <span>{lang === 'EN' ? 'Share Your Experience' : 'अपना अनुभव साझा करें'}</span>
        </button>
      </div>

      {feedbacks.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.slice(0, visibleCount).map((fb) => (
              <motion.div 
              key={fb.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-black/5 flex flex-col justify-between h-full group hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      size={16} 
                      className={s <= fb.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-100"} 
                    />
                  ))}
                </div>
                <p className="text-text-dark/80 font-body text-sm md:text-base leading-relaxed italic mb-6">
                  "{fb.comment || (lang === 'EN' ? 'Loved the visit!' : 'बहुत बढ़िया अनुभव रहा!')}"
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-black/5">
                <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green font-bold shrink-0">
                  {fb.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-text-dark text-sm">{fb.name}</h4>
                  <p className="text-[10px] text-text-dark/40 uppercase tracking-widest font-bold">
                    {lang === 'EN' ? 'Verified Visitor' : 'सत्यापित दर्शक'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {feedbacks.length > visibleCount && (
              <button 
                onClick={() => setVisibleCount(prev => prev + 3)}
                className="bg-white border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white px-8 py-3 rounded-full font-bold transition-all shadow-sm"
              >
                {lang === 'EN' ? 'Load More Reviews' : 'और समीक्षाएं दिखाएं'}
              </button>
            )}

            {visibleCount > 3 && (
              <button 
                onClick={() => {
                  setVisibleCount(3);
                  document.getElementById('feedback-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-transparent border-2 border-black/10 text-text-dark/70 hover:bg-black/5 hover:text-text-dark px-8 py-3 rounded-full font-bold transition-all"
              >
                {lang === 'EN' ? 'Show Less' : 'कम दिखाएं'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white/50 rounded-[2rem] border border-black/5">
          <Star size={48} className="mx-auto text-accent-gold/30 mb-4" />
          <p className="text-text-dark/50 font-medium">
            {lang === 'EN' ? 'Be the first to share your experience!' : 'अपना अनुभव साझा करने वाले पहले व्यक्ति बनें!'}
          </p>
        </div>
      )}

      {/* Feedback Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl pointer-events-auto max-h-[90vh] md:max-h-[85vh] overflow-y-auto custom-scrollbar"
              >
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="absolute top-6 right-6 text-text-dark/40 hover:text-text-dark bg-black/5 rounded-full p-2 transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>

              {isSuccess ? (
                <div className="py-10 text-center flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-6"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-text-dark mb-2">
                    {lang === 'EN' ? 'Thank You!' : 'धन्यवाद!'}
                  </h3>
                  <p className="text-text-dark/60 font-body text-sm">
                    {lang === 'EN' 
                      ? 'Your feedback has been submitted and is pending review by the admin.'
                      : 'आपका फीडबैक सबमिट हो गया है और एडमिन द्वारा समीक्षा के बाद लाइव होगा।'}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-heading font-bold text-text-dark mb-2 pr-8">
                    {lang === 'EN' ? 'Share Feedback' : 'प्रतिक्रिया दें'}
                  </h3>
                  <p className="text-text-dark/50 text-xs mb-8">
                    {lang === 'EN' ? 'Your review helps us improve.' : 'तैयार फीडबैक हमें बेहतर बनाने में मदद करता है।'}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {errorDesc && (
                      <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold font-body">
                        {errorDesc}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest pl-1">
                        {lang === 'EN' ? 'Your Name' : 'आपका नाम'} *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl py-3 px-4 text-sm text-text-dark font-medium focus:border-primary-green/50 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest pl-1">
                        {lang === 'EN' ? 'Rating' : 'रेटिंग'}
                      </label>
                      <div className="flex space-x-2 bg-[#F8FAF9] border border-black/5 p-3 rounded-xl w-fit">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            type="button"
                            key={s}
                            onMouseEnter={() => setHoverRating(s)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(s)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                          >
                            <Star 
                              size={24} 
                              className={`transition-colors ${(hoverRating || rating) >= s ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest pl-1">
                        {lang === 'EN' ? 'Message (Optional)' : 'संदेश (वैकल्पिक)'}
                      </label>
                      <textarea 
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={lang === 'EN' ? 'Tell us what you loved...' : 'हमें बताएं कि आपको क्या पसंद आया...'}
                        className="w-full bg-[#F8FAF9] border border-black/5 rounded-xl py-3 px-4 text-sm text-text-dark font-medium focus:border-primary-green/50 outline-none transition-all resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-green text-white py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-primary-green/20 hover:bg-primary-green/90 transition-all disabled:opacity-70 mt-4"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{lang === 'EN' ? 'Submitting...' : 'सबमिट हो रहा है...'}</span>
                        </span>
                      ) : (
                        <>
                          <span>{lang === 'EN' ? 'Submit Review' : 'रिव्यु भेजें'}</span>
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeedbackComponent;

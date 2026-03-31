import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, RefreshCw, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { insforge } from '../../lib/insforge';

const ManageFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await insforge.database
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setFeedbacks(data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleApproval = async (id, currentStatus) => {
    setIsProcessing(id);
    try {
      const { error } = await insforge.database
        .from('feedback')
        .update({ is_approved: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      setFeedbacks(feedbacks.map(fb => 
        fb.id === id ? { ...fb, is_approved: !currentStatus } : fb
      ));
      
      // Tell public website to refresh the feedback list
      window.dispatchEvent(new CustomEvent('insforge:content_updated', { detail: { type: 'feedback' } }));
      
      try {
        await insforge.realtime.connect();
        await insforge.realtime.publish('site_content', 'content_updated', { type: 'feedback' });
      } catch (e) {
        console.warn('Real-time broadcast failed:', e);
      }
    } catch (err) {
      console.error('Error updating feedback:', err);
      alert('Failed to update approval status.');
    } finally {
      setIsProcessing(null);
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this feedback?')) return;
    
    setIsProcessing(id);
    try {
      const { error } = await insforge.database
        .from('feedback')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setFeedbacks(feedbacks.filter(fb => fb.id !== id));
      window.dispatchEvent(new CustomEvent('insforge:content_updated', { detail: { type: 'feedback' } }));
      
      try {
        await insforge.realtime.connect();
        await insforge.realtime.publish('site_content', 'content_updated', { type: 'feedback' });
      } catch (e) {
        console.warn('Real-time broadcast failed:', e);
      }
    } catch (err) {
      console.error('Error deleting feedback:', err);
      alert('Failed to delete feedback.');
    } finally {
      setIsProcessing(null);
    }
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
          <h2 className="text-xl md:text-2xl font-heading font-bold text-text-dark flex items-center gap-3">
            <MessageSquare className="text-primary-green" />
            Manage User Feedback
          </h2>
          <p className="text-text-dark/50 text-xs mt-1">Review, approve, and delete visitor ratings</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button 
            onClick={fetchFeedbacks}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white text-primary-green border-2 border-primary-green px-4 md:px-6 py-2.5 rounded-xl md:rounded-2xl font-bold hover:bg-primary-green/5 transition-all text-sm"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-black/10">
            <MessageSquare size={48} className="mx-auto text-primary-green/20 mb-4" />
            <p className="text-text-dark/40 font-bold">No feedback received yet.</p>
          </div>
        ) : (
          <AnimatePresence>
            {feedbacks.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className={`bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm border ${item.is_approved ? 'border-primary-green/30 ring-1 ring-primary-green/10 bg-emerald-50/10' : 'border-black/5'} transition-all`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-bold text-lg text-text-dark">{item.name}</h3>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            className={star <= item.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-text-dark/40 font-medium">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {item.comment && (
                      <p className="text-sm text-text-dark/70 font-body leading-relaxed bg-cream/50 p-4 rounded-xl border border-black/5 italic">
                        "{item.comment}"
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center md:flex-col justify-end gap-3 md:min-w-[120px]">
                    <button
                      onClick={() => toggleApproval(item.id, item.is_approved)}
                      disabled={isProcessing === item.id}
                      className={`flex-1 md:w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        item.is_approved 
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {item.is_approved ? (
                        <><CheckCircle size={16} /><span>Approved</span></>
                      ) : (
                        <><XCircle size={16} /><span>Pending</span></>
                      )}
                    </button>
                    <button
                      onClick={() => deleteFeedback(item.id)}
                      disabled={isProcessing === item.id}
                      className="flex items-center justify-center p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                      title="Delete permanently"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ManageFeedback;

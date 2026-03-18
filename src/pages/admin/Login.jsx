import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Invalid email or password');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1A2E22] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-green/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-gold/10 rounded-full blur-[150px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-accent-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-accent-gold/20"
          >
            <Lock className="text-[#1A2E22]" size={32} />
          </motion.div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2 tracking-tight">Admin Portal</h1>
          <p className="text-white/60 font-body">Manage Amnour Park (Amrit Sarovar)</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent-gold transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@amnourpark.com"
                  autoComplete="email"
                  className="w-full bg-white/5 border border-white/10 focus:border-accent-gold/50 outline-none rounded-2xl py-4 pl-12 pr-4 text-white transition-all placeholder:text-white/20" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent-gold transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 focus:border-accent-gold/50 outline-none rounded-2xl py-4 pl-12 pr-4 text-white transition-all placeholder:text-white/20" 
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl flex items-center space-x-2 text-sm"
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full bg-accent-gold hover:bg-accent-gold/90 text-[#1A2E22] font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-accent-gold/10 flex items-center justify-center space-x-2 group ${isSubmitting ? 'opacity-70 cursor-not-wait' : ''}`}
            >
              <span>{isSubmitting ? 'Logging in...' : 'Sign In'}</span>
              {!isSubmitting && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} Amnour Park. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

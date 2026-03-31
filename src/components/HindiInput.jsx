import { useState, useEffect, useRef } from 'react';
import { transliterateToHindi } from '../utils/transliterate';
import { Type } from 'lucide-react';

export const HindiInput = ({ value, onChange, placeholder, className, label, icon: Icon, syncValue }) => {
  const [autoHindi, setAutoHindi] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef(null);
  const lastSyncValue = useRef(syncValue);

  // Magic Sync Logic: If English counterpart (syncValue) changes, auto-transliterate
  useEffect(() => {
    if (autoHindi && syncValue && syncValue !== lastSyncValue.current && !value) {
      lastSyncValue.current = syncValue;
      const triggerSync = async () => {
        setIsProcessing(true);
        const transliterated = await transliterateToHindi(syncValue);
        if (transliterated) onChange(transliterated);
        setIsProcessing(false);
      };
      triggerSync();
    }
  }, [syncValue, autoHindi, onChange, value]);

  const handleKeyUp = async (e) => {
    if (!autoHindi) return;
    
    if (e.key === ' ') {
      const currentPos = inputRef.current?.selectionStart;
      setIsProcessing(true);
      const transliterated = await transliterateToHindi(value);
      if (transliterated !== value) {
        onChange(transliterated);
        // Attempt to restore focus/cursor after state update
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            if (currentPos) inputRef.current.setSelectionRange(currentPos, currentPos);
          }
        }, 10);
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest flex items-center space-x-2">
          {Icon && <Icon size={12} className="text-primary-green/60" />}
          <span>{label}</span>
        </label>
        <button 
          type="button"
          onClick={() => setAutoHindi(!autoHindi)}
          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all flex items-center space-x-1 ${
            autoHindi 
            ? 'bg-primary-green/10 border-primary-green/20 text-primary-green' 
            : 'bg-black/5 border-black/10 text-text-dark/40 shadow-inner'
          }`}
        >
          <span className={autoHindi ? 'opacity-100' : 'opacity-40'}>A/अ</span>
          <span>{autoHindi ? 'ON' : 'OFF'}</span>
        </button>
      </div>
      <div className="relative group">
        <input 
          ref={inputRef}
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyUp={handleKeyUp}
          placeholder={placeholder || (autoHindi ? "Type in English to get Hindi..." : "Type here...")}
          className={`w-full bg-[#F8FAF9] border border-black/5 rounded-xl py-2.5 md:py-3 px-4 text-sm text-text-dark font-medium focus:border-primary-green/50 outline-none transition-all shadow-sm ${className}`}
        />
        {isProcessing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <span className="text-[9px] text-primary-green/60 font-bold">मैजिक...</span>
            <div className="w-1.5 h-1.5 bg-primary-green rounded-full animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
};

export const HindiTextarea = ({ value, onChange, placeholder, className, label, icon: Icon, rows = 3, syncValue }) => {
  const [autoHindi, setAutoHindi] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const textareaRef = useRef(null);
  const lastSyncValue = useRef(syncValue);

  // Magic Sync for long text
  useEffect(() => {
    if (autoHindi && syncValue && syncValue !== lastSyncValue.current && !value) {
      lastSyncValue.current = syncValue;
      const triggerSync = async () => {
        setIsProcessing(true);
        const transliterated = await transliterateToHindi(syncValue);
        if (transliterated) onChange(transliterated);
        setIsProcessing(false);
      };
      triggerSync();
    }
  }, [syncValue, autoHindi, onChange, value]);

  const handleKeyUp = async (e) => {
    if (!autoHindi) return;
    if (e.key === ' ') {
      const currentPos = textareaRef.current?.selectionStart;
      setIsProcessing(true);
      const transliterated = await transliterateToHindi(value);
      if (transliterated !== value) {
        onChange(transliterated);
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            if (currentPos) textareaRef.current.setSelectionRange(currentPos, currentPos);
          }
        }, 10);
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest flex items-center space-x-2">
          {Icon && <Icon size={12} className="text-primary-green/60" />}
          <span>{label}</span>
        </label>
        <button 
          type="button"
          onClick={() => setAutoHindi(!autoHindi)}
          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all flex items-center space-x-1 ${
            autoHindi 
            ? 'bg-primary-green/10 border-primary-green/20 text-primary-green' 
            : 'bg-black/5 border-black/10 text-text-dark/40 shadow-inner'
          }`}
        >
          <span className={autoHindi ? 'opacity-100' : 'opacity-40'}>A/अ</span>
          <span>{autoHindi ? 'ON' : 'OFF'}</span>
        </button>
      </div>
      <div className="relative">
        <textarea 
          ref={textareaRef}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyUp={handleKeyUp}
          placeholder={placeholder || (autoHindi ? "Hindi typing (Romanized) enabled..." : "Type here...")}
          className={`w-full bg-[#F8FAF9] border border-black/5 rounded-xl py-2.5 md:py-3 px-4 text-sm text-text-dark font-medium focus:border-primary-green/50 outline-none transition-all shadow-sm resize-none ${className}`}
        />
        {isProcessing && (
          <div className="absolute right-3 bottom-3 flex items-center space-x-1">
            <span className="text-[9px] text-primary-green/60 font-bold">मैजिक...</span>
            <div className="w-1.5 h-1.5 bg-primary-green rounded-full animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
};

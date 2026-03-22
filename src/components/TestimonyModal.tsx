import React, { useState } from 'react';
import { X, Star, Check, Loader2, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { testimonyApi } from '../api/testimonyApi';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'form' | 'success';

const TestimonyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();

  const [step, setStep]           = useState<Step>('form');
  const [content, setContent]     = useState('');
  const [name, setName]           = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep('form');
    setContent('');
    setName('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 10) {
      toast.error('Please share your testimony (at least 10 characters)');
      return;
    }

    setIsLoading(true);
    try {
      const dto: { content: string; fullName?: string } = {
        content: content.trim(),
        ...(!isAuthenticated && {
          fullName: name.trim() || undefined,
        }),
      };
      const res = await testimonyApi.create(dto);
      if (res.data.isSuccess) {
        setStep('success');
      } else {
        toast.error(res.data.message || 'Failed to submit. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100 transition-all scale-100">
        
        {/* Top Accent Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" />

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center shadow-sm shadow-amber-200/50">
              <Star className="w-6 h-6 text-amber-500" fill="currentColor" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg tracking-tight">Share Your Testimony</h2>
              <p className="text-sm text-slate-500 font-medium">Inspire others with your story</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── FORM STEP ─────────────────────────────────────────────────── */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-7">

            {/* Identity Section */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-amber-500/30">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 leading-none">{user.fullName}</p>
                  <p className="text-xs text-slate-500 mt-1.5">{user.email}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Verified
                </span>
              </div>
            ) : (
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. John D. or leave blank to stay anonymous"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-5 py-3.5 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                />
              </div>
            )}

            {/* Testimony Section */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Your Testimony <span className="text-amber-500">*</span>
                </label>
                <span className={`text-[10px] font-medium ${content.length > 1900 ? 'text-red-500' : 'text-slate-400'}`}>
                  {content.length}/2000
                </span>
              </div>
              <textarea
                rows={5}
                placeholder="What has God done for you? Share the miracle someone else needs to hear..."
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-[15px] focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all resize-none placeholder:text-slate-300 leading-relaxed shadow-sm"
              />
            </div>

            {/* Trust/Policy Box */}
            <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
              <ClipboardList className="w-5 h-5 text-amber-600 mt-0.5" />
              <p className="text-[13px] text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-700">Review Policy:</span> To maintain our community's integrity, testimonies are typically approved within 24–48 hours.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-amber-600 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Star className="w-4 h-4" fill="currentColor" />
                  Share My Testimony
                </>
              )}
            </button>
          </form>
        )}

        {/* ── SUCCESS STEP ─────────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="px-8 py-14 text-center">
            <div className="relative mx-auto mb-8">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto relative z-10">
                <Check className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-emerald-200 blur-2xl opacity-30 mx-auto" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
              Testimony Received! 🙌
            </h3>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-10 max-w-sm mx-auto font-medium">
              Thank you for sharing your story. Once approved, it will be published to encourage our community.
            </p>

            <button
              onClick={handleClose}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-slate-800 transition-all shadow-xl"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonyModal;
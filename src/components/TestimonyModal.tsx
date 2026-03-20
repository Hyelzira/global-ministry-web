import React, { useState } from 'react';
import { X, Star, Check, Loader2 } from 'lucide-react';
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
        // Only pass name if anonymous — backend pulls from JWT if logged in
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Share Your Testimony</h2>
              <p className="text-xs text-slate-500">Inspire others with what God has done</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── FORM ─────────────────────────────────────────────────────── */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">

            {/* Logged in badge or anonymous name field */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{user.fullName}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                  Logged in
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Your name (optional)
                </p>
                <input
                  type="text"
                  placeholder="e.g. John D. or leave blank to share anonymously"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-amber-400 outline-none transition-all placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-400">
                  You can share anonymously — your name is never required.
                </p>
              </div>
            )}

            {/* Testimony content */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Your testimony <span className="text-red-400">*</span>
              </p>
              <textarea
                rows={6}
                placeholder="What has God done for you? Share your story — it could be the miracle someone else needs to hear..."
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-amber-400 outline-none transition-all resize-none placeholder:text-slate-400 leading-relaxed"
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-slate-400">Minimum 10 characters</p>
                <p className={`text-xs ${content.length > 1900 ? 'text-red-400' : 'text-slate-400'}`}>
                  {content.length}/2000
                </p>
              </div>
            </div>

            {/* Note about review */}
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-base mt-0.5">📋</span>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your testimony will be reviewed by our team before being published.
                We typically review within 24–48 hours.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Star className="w-4 h-4" />
                  Share My Testimony
                </>
              )}
            </button>
          </form>
        )}

        {/* ── SUCCESS ───────────────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="px-8 py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-5">
              <Check className="w-8 h-8 text-emerald-500" />
            </div>

            <h3 className="text-2xl font-serif font-medium text-slate-900 mb-2">
              Thank you for sharing! 🙌
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              Your testimony has been received and is currently under review.
              Once approved it will be published to encourage others in the community.
            </p>

            <button
              onClick={handleClose}
              className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-amber-500 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonyModal;
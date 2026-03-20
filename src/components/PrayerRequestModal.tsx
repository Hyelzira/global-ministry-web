import React, { useState } from 'react';
import { X, HandHeart, Check, Copy, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { prayerApi } from '../api/prayerApi';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'form' | 'success';

const PrayerRequestModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();

  const [step, setStep]         = useState<Step>('form');
  const [content, setContent]   = useState('');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken]       = useState('');
  const [copied, setCopied]     = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    // Reset state on close
    setStep('form');
    setContent('');
    setName('');
    setEmail('');
    setToken('');
    setCopied(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || content.trim().length < 5) {
      toast.error('Please share your prayer request (at least 5 characters)');
      return;
    }

    setIsLoading(true);
    try {
      const dto = {
        content: content.trim(),
        // Only send name/email if anonymous — backend pulls from JWT if logged in
        ...(!isAuthenticated && {
          name:  name.trim() || undefined,
          email: email.trim() || undefined,
        }),
      };

      const res = await prayerApi.create(dto);

      if (res.data.isSuccess && res.data.data) {
        setToken(res.data.data.anonymousToken);
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

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast.success('Tracking ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 to-purple-600" />

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-fuchsia-50 flex items-center justify-center">
              <HandHeart className="w-5 h-5 text-fuchsia-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Prayer Request</h2>
              <p className="text-xs text-slate-500">We pray for every request personally</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── FORM STEP ──────────────────────────────────────────────────── */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">

            {/* If logged in — show who is submitting */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 p-3 bg-fuchsia-50 rounded-xl border border-fuchsia-100">
                <div className="w-8 h-8 rounded-full bg-fuchsia-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{user.fullName}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-100 px-2 py-1 rounded-full">
                  Logged in
                </span>
              </div>
            ) : (
              // Anonymous — optional name and email
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Your details (optional)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-fuchsia-400 outline-none transition-all placeholder:text-slate-400"
                  />
                  <input
                    type="email"
                    placeholder="Email (for updates)"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-fuchsia-400 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  You can submit anonymously — your details are never required.
                </p>
              </div>
            )}

            {/* Prayer content */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Your prayer request <span className="text-red-400">*</span>
              </p>
              <textarea
                rows={5}
                placeholder="Share what's on your heart. Our team will pray for you personally..."
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-fuchsia-400 outline-none transition-all resize-none placeholder:text-slate-400 leading-relaxed"
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-slate-400">Minimum 5 characters</p>
                <p className={`text-xs ${content.length > 1900 ? 'text-red-400' : 'text-slate-400'}`}>
                  {content.length}/2000
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-fuchsia-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-fuchsia-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <HandHeart className="w-4 h-4" />
                  Send Prayer Request
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400 pb-2">
              🔒 Your request is confidential and seen only by our prayer team.
            </p>
          </form>
        )}

        {/* ── SUCCESS STEP ───────────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="px-8 py-10 text-center">

            {/* Success icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-5">
              <Check className="w-8 h-8 text-emerald-500" />
            </div>

            <h3 className="text-2xl font-serif font-medium text-slate-900 mb-2">
              We've received your request 🙏
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              Our prayer team will be interceding for you. You can track the status
              of your prayer request using the ID below.
            </p>

            {/* Token card */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5 mb-6 text-left">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Your Prayer Request ID
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-xs text-slate-700 font-mono bg-white border border-slate-200 px-3 py-2 rounded-lg truncate">
                  {token}
                </code>
                <button
                  onClick={copyToken}
                  className={`p-2.5 rounded-lg border-2 transition-all flex-shrink-0 ${
                    copied
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-600'
                      : 'border-slate-200 hover:border-slate-400 text-slate-500'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Save this ID to check back on your request status.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-fuchsia-600 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerRequestModal;
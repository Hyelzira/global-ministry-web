import React, { useState } from 'react';
import { X, Check, Copy, Loader2 } from 'lucide-react';
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

  const [step, setStep] = useState<Step>('form');
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
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
      toast.error('Please enter a valid prayer request.');
      return;
    }

    setIsLoading(true);

    try {
      const dto = {
        content: content.trim(),
        ...(!isAuthenticated && {
          name: name.trim() || undefined,
          email: email.trim() || undefined,
        }),
      };

      const res = await prayerApi.create(dto);

      if (res.data.isSuccess && res.data.data) {
        setToken(res.data.data.anonymousToken);
        setStep('success');
      } else {
        toast.error(res.data.message || 'Unable to submit request.');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast.success('ID copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Prayer Request
            </h2>
            <p className="text-sm text-gray-500">
              All submissions are handled with care and confidentiality.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* FORM */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">

            {/* User Info */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-medium">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Your details (optional)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <input
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  You may submit your request anonymously.
                </p>
              </div>
            )}

            {/* Prayer Content */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Prayer request
              </label>

              <textarea
                rows={5}
                maxLength={2000}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your request here..."
                className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />

              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Minimum 5 characters</span>
                <span>{content.length}/2000</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-black transition flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Submit request'
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Your request will only be visible to the prayer team.
            </p>
          </form>
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <div className="px-6 py-10 text-center">

            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Request submitted
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              Your prayer request has been received. You may use the ID below for reference.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left mb-6">
              <p className="text-xs text-gray-500 mb-1">
                Reference ID
              </p>

              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs font-mono bg-white border border-gray-200 px-3 py-2 rounded-md truncate">
                  {token}
                </code>

                <button
                  onClick={copyToken}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-black"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerRequestModal;
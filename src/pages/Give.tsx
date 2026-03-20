import { useState } from 'react';
import {
  ArrowRight, ArrowLeft, Check, ShieldCheck,
  ChevronRight, CreditCard, Building2, Smartphone, Globe, Hash
} from 'lucide-react';
import toast from 'react-hot-toast';
import { donationApi } from '../api/donationApi';

// ── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Tithe',              emoji: '', desc: 'Your tenth returned to God' },
  { label: 'Offering',           emoji: '🕊️', desc: 'A freewill gift of worship' },
  { label: 'Building Projects',  emoji: '🏛️', desc: "Expanding God's house" },
  { label: 'Global Outreach',    emoji: '🌍', desc: 'Taking the gospel worldwide' },
  { label: 'Youth Ministry',     emoji: '⚡', desc: 'Raising the next generation' },
  { label: 'Children Ministry',  emoji: '🌱', desc: 'Planting seeds in young hearts' },
  { label: 'Community Outreach', emoji: '❤️', desc: 'Serving our neighbours' },
];

const FREQUENCIES = ['One-time', 'Monthly', 'Yearly'];

const REGIONS = [
  { name: 'Nigeria',        code: 'NGN', symbol: '₦',   flag: '🇳🇬' },
  { name: 'United States',  code: 'USD', symbol: '$',   flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GBP', symbol: '£',   flag: '🇬🇧' },
  { name: 'Kenya',          code: 'KES', symbol: 'KSh', flag: '🇰🇪' },
  { name: 'Ghana',          code: 'GHS', symbol: 'GH₵', flag: '🇬🇭' },
  { name: 'Canada',         code: 'CAD', symbol: 'CA$', flag: '🇨🇦' },
  { name: 'South Africa',   code: 'ZAR', symbol: 'R',   flag: '🇿🇦' },
  { name: 'UAE',            code: 'AED', symbol: 'د.إ', flag: '🇦🇪' },
  { name: 'Australia',      code: 'AUD', symbol: 'A$',  flag: '🇦🇺' },
  { name: 'Europe',         code: 'EUR', symbol: '€',   flag: '🇪🇺' },
  { name: 'India',          code: 'INR', symbol: '₹',   flag: '🇮🇳' },
  { name: 'Rwanda',         code: 'RWF', symbol: 'FRw', flag: '🇷🇼' },
  { name: 'Uganda',         code: 'UGX', symbol: 'USh', flag: '🇺🇬' },
  { name: 'Tanzania',       code: 'TZS', symbol: 'TSh', flag: '🇹🇿' },
  { name: 'Switzerland',    code: 'CHF', symbol: 'CHF', flag: '🇨🇭' },
  { name: 'Japan',          code: 'JPY', symbol: '¥',   flag: '🇯🇵' },
];

const PRESET_AMOUNTS: Record<string, number[]> = {
  NGN: [1000, 2500, 5000, 10000, 25000, 50000],
  USD: [5, 10, 25, 50, 100, 250],
  GBP: [5, 10, 25, 50, 100, 250],
  EUR: [5, 10, 25, 50, 100, 250],
  KES: [500, 1000, 2500, 5000, 10000, 25000],
  default: [10, 25, 50, 100, 250, 500],
};

interface PaymentMethod {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  tags: string[];
  gateway: 'paystack' | 'flutterwave';
  currencies: string[];
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card', label: 'Debit / Credit Card', desc: 'Visa, Mastercard, Verve',
    icon: <CreditCard size={20} className="text-slate-700" />,
    tags: ['Visa', 'Mastercard', 'Verve'],
    gateway: 'paystack',
    currencies: ['NGN', 'GHS', 'KES', 'ZAR', 'UGX', 'TZS', 'RWF'],
  },
  {
    id: 'bank_transfer', label: 'Bank Transfer', desc: 'Pay directly from your banking app',
    icon: <Building2 size={20} className="text-slate-700" />,
    tags: ['Instant', 'Zero fees'],
    gateway: 'paystack',
    currencies: ['NGN'],
  },
  {
    id: 'ussd', label: 'USSD', desc: 'No internet needed — *737# or *901#',
    icon: <Hash size={20} className="text-slate-700" />,
    tags: ['Offline', 'All networks'],
    gateway: 'paystack',
    currencies: ['NGN'],
  },
  {
    id: 'mobile_money', label: 'Mobile Money', desc: 'M-Pesa, MTN MoMo, Airtel Money',
    icon: <Smartphone size={20} className="text-slate-700" />,
    tags: ['M-Pesa', 'MTN MoMo', 'Airtel'],
    gateway: 'flutterwave',
    currencies: ['KES', 'GHS', 'UGX', 'TZS', 'RWF', 'ZAR'],
  },
  {
    id: 'international_card', label: 'International Card', desc: 'USD, GBP, EUR and other currencies',
    icon: <Globe size={20} className="text-slate-700" />,
    tags: ['USD', 'GBP', 'EUR', 'CAD'],
    gateway: 'flutterwave',
    currencies: ['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'AED', 'INR', 'CHF', 'JPY'],
  },
];

// ── Step Layout ───────────────────────────────────────────────────────────────

const StepLayout = ({
  step, label, title, subtitle, children, onBack, rightPanel,
}: {
  step: number;
  label: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  rightPanel?: React.ReactNode;
}) => (
  <div className="min-h-screen bg-white flex flex-col">

    {/* Top bar */}
    <div className="border-b border-slate-100 px-6 py-4 shrink-0">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-black transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>
        ) : <div />}

        {/* Step dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              className={`rounded-full transition-all duration-300 ${
                n === step
                  ? 'w-6 h-2 bg-black'
                  : n < step
                  ? 'w-2 h-2 bg-emerald-500'
                  : 'w-2 h-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-slate-400">
          {step} / 4
        </span>
      </div>
    </div>

    {/* Two-column body */}
    <div className="flex-1 overflow-hidden">
      <div className={`max-w-6xl mx-auto h-full ${
        rightPanel
          ? 'grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100'
          : 'flex'
      }`}>

        {/* Left */}
        <div className="overflow-y-auto p-6 lg:p-10">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-fuchsia-600 mb-2">
              {label}
            </p>
            <h1 className="text-2xl font-serif font-medium leading-snug mb-1">
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-500 text-sm leading-relaxed">{subtitle}</p>
            )}
          </div>
          {children}
        </div>

        {/* Right */}
        {rightPanel && (
          <div className="overflow-y-auto p-6 lg:p-10 bg-slate-50/50">
            {rightPanel}
          </div>
        )}
      </div>
    </div>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────

const GivePage = () => {
  const [step, setStep]                 = useState<1 | 2 | 3 | 4>(1);
  const [category, setCategory]         = useState('');
  const [frequency, setFrequency]       = useState('One-time');
  const [region, setRegion]             = useState(REGIONS[0]);
  const [amount, setAmount]             = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName]       = useState('');
  const [donorEmail, setDonorEmail]     = useState('');
  const [isLoading, setIsLoading]       = useState(false);

  const presets = PRESET_AMOUNTS[region.code] ?? PRESET_AMOUNTS.default;
  const availableMethods = PAYMENT_METHODS.filter(m =>
    m.currencies.includes(region.code)
  );

  const next = (validate: () => boolean) => {
    if (!validate()) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => (s + 1) as 1 | 2 | 3 | 4);
  };

  const back = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => (s - 1) as 1 | 2 | 3 | 4);
  };

  const handleSelectMethod = async (method: PaymentMethod) => {
    if (!amount) return;
    setIsLoading(true);
    try {
      const payload = {
        donorName:     donorName.trim(),
        donorEmail:    donorEmail.trim(),
        amount,
        currency:      region.code,
        paymentMethod: method.gateway === 'paystack' ? 'Paystack' : 'Flutterwave',
        donationType:  category,
      };

      const response = method.gateway === 'paystack'
        ? await donationApi.initiatePaystack(payload)
        : await donationApi.initiateFlutterwave(payload);

      if (response.data.isSuccess && response.data.data?.paymentUrl) {
        window.location.href = response.data.data.paymentUrl;
      } else {
        toast.error('Failed to initialize payment. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── STEP 1 — Category + Frequency ─────────────────────────────────────────
  if (step === 1) return (
    <StepLayout
      step={1}
      label="Online Giving · Step 1"
      title="What are you giving towards?"
      subtitle="Choose a category for your gift."
      rightPanel={
        <div className="flex flex-col h-full gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
              How often?
            </p>
            <div className="flex flex-col gap-3">
              {FREQUENCIES.map(f => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`w-full py-4 rounded-xl border-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                    frequency === f
                      ? 'border-black bg-black text-white'
                      : 'border-slate-200 text-slate-500 hover:border-slate-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Selected summary */}
          {category && (
            <div className="p-4 rounded-xl bg-white border-2 border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
                Selected
              </p>
              <p className="font-bold text-sm">{category}</p>
              <p className="text-xs text-slate-500 mt-1">{frequency}</p>
            </div>
          )}

          <button
            onClick={() => next(() => {
              if (!category) {
                toast.error('Please select a giving category');
                return false;
              }
              return true;
            })}
            className="mt-auto w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-fuchsia-600 transition-colors duration-300"
          >
            Continue <ArrowRight size={16} />
          </button>
        </div>
      }
    >
      {/* Categories — left column */}
      <div className="space-y-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.label}
            onClick={() => setCategory(cat.label)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
              category === cat.label
                ? 'border-black bg-slate-50'
                : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <span className="text-2xl">{cat.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{cat.label}</p>
              <p className="text-xs text-slate-500">{cat.desc}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
              category === cat.label ? 'border-black bg-black' : 'border-slate-300'
            }`}>
              {category === cat.label && <Check size={11} className="text-white" />}
            </div>
          </button>
        ))}
      </div>
    </StepLayout>
  );

  // ── STEP 2 — Country + Amount ──────────────────────────────────────────────
  if (step === 2) return (
    <StepLayout
      step={2}
      label="Online Giving · Step 2"
      title="How much would you like to give?"
      subtitle={`Giving ${frequency.toLowerCase()} towards ${category}.`}
      onBack={back}
      rightPanel={
        <div className="flex flex-col h-full gap-4">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            Select amount
            <span className="ml-2 normal-case font-medium">
              ({region.flag} {region.code})
            </span>
          </p>

          {/* Presets */}
          <div className="grid grid-cols-2 gap-3">
            {presets.map(val => (
              <button
                key={val}
                onClick={() => { setAmount(val); setCustomAmount(''); }}
                className={`py-5 rounded-xl border-2 font-bold transition-all duration-200 text-sm ${
                  amount === val
                    ? 'border-black bg-black text-white'
                    : 'border-slate-200 hover:border-black hover:bg-slate-50'
                }`}
              >
                {region.symbol}{val.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg pointer-events-none">
              {region.symbol}
            </span>
            <input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={e => {
                setCustomAmount(e.target.value);
                setAmount(Number(e.target.value) || null);
              }}
              className="w-full pl-10 pr-4 py-4 border-2 border-slate-200 rounded-xl text-lg font-bold focus:border-black outline-none transition-all placeholder:text-slate-300 placeholder:font-normal placeholder:text-base"
            />
          </div>

          {/* Amount pill */}
          {amount && (
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
              <span className="text-sm text-slate-500">You are giving</span>
              <span className="text-xl font-black">
                {region.symbol}{amount.toLocaleString()} {region.code}
              </span>
            </div>
          )}

          <button
            onClick={() => next(() => {
              if (!amount || amount < 1) {
                toast.error('Please select or enter an amount');
                return false;
              }
              return true;
            })}
            className="mt-auto w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-fuchsia-600 transition-colors duration-300"
          >
            Continue <ArrowRight size={16} />
          </button>
        </div>
      }
    >
      {/* Countries — left column */}
      <div className="space-y-2">
        {REGIONS.map(r => (
          <button
            key={r.code}
            onClick={() => {
              setRegion(r);
              setAmount(null);
              setCustomAmount('');
            }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
              region.code === r.code
                ? 'border-black bg-slate-50'
                : 'border-slate-100 hover:border-slate-300'
            }`}
          >
            <span className="text-xl">{r.flag}</span>
            <div className="flex-1">
              <p className="text-sm font-bold">{r.name}</p>
              <p className="text-xs text-slate-400">{r.code} · {r.symbol}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
              region.code === r.code ? 'border-black bg-black' : 'border-slate-300'
            }`}>
              {region.code === r.code && <Check size={11} className="text-white" />}
            </div>
          </button>
        ))}
      </div>
    </StepLayout>
  );

  // ── STEP 3 — Donor Details ─────────────────────────────────────────────────
  if (step === 3) return (
    <StepLayout
      step={3}
      label="Online Giving · Step 3"
      title="Who is this gift from?"
      subtitle="We'll send your receipt to the email address below."
      onBack={back}
    >
      {/* Summary recap */}
      <div className="mb-6 rounded-2xl border-2 border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-5 py-3 flex items-center justify-between border-b border-slate-100">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            Your Gift
          </p>
          <button
            onClick={back}
            className="text-xs text-fuchsia-600 font-bold hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {[
            { label: 'Category',  value: category },
            { label: 'Frequency', value: frequency },
            { label: 'Country',   value: `${region.flag} ${region.name}` },
          ].map(item => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-slate-500">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-black">
              {region.symbol}{amount?.toLocaleString()}
              <span className="text-sm font-bold text-slate-400 ml-1">{region.code}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Donor inputs */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Full Name"
          value={donorName}
          onChange={e => setDonorName(e.target.value)}
          className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-black outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={donorEmail}
          onChange={e => setDonorEmail(e.target.value)}
          className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-black outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
        />
      </div>

      <button
        onClick={() => next(() => {
          if (!donorName.trim()) {
            toast.error('Please enter your name');
            return false;
          }
          if (!donorEmail.trim() || !donorEmail.includes('@')) {
            toast.error('Please enter a valid email');
            return false;
          }
          return true;
        })}
        className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-fuchsia-600 transition-colors duration-300"
      >
        Review & Pay <ArrowRight size={16} />
      </button>
    </StepLayout>
  );

  // ── STEP 4 — Payment Methods ───────────────────────────────────────────────
  return (
    <StepLayout
      step={4}
      label="Online Giving · Step 4"
      title="Choose how to pay."
      subtitle="Select your preferred payment method to complete your gift."
      onBack={back}
    >
      {/* Order summary */}
      <div className="mb-6 rounded-2xl border-2 border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-100">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            Order Summary
          </p>
        </div>
        <div className="px-5 py-4 space-y-3">
          {[
            { label: 'Name',      value: donorName },
            { label: 'Email',     value: donorEmail },
            { label: 'Category',  value: category },
            { label: 'Frequency', value: frequency },
            { label: 'Country',   value: `${region.flag} ${region.name}` },
          ].map(item => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-slate-500">{item.label}</span>
              <span className="font-medium truncate ml-4 text-right">{item.value}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-black">
              {region.symbol}{amount?.toLocaleString()}
              <span className="text-sm font-bold text-slate-400 ml-1">{region.code}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      {availableMethods.length === 0 ? (
        <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 text-center mb-6">
          <p className="text-sm text-slate-400">
            No payment methods available for {region.name} yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {availableMethods.map(method => (
            <button
              key={method.id}
              onClick={() => handleSelectMethod(method)}
              disabled={isLoading}
              className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 border-slate-200 hover:border-black hover:bg-slate-50 active:scale-[0.99] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-white flex items-center justify-center flex-shrink-0 border border-slate-200 transition-colors">
                  {method.icon}
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">{method.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{method.desc}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {method.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-slate-300 group-hover:text-black group-hover:translate-x-0.5 transition-all flex-shrink-0"
              />
            </button>
          ))}
        </div>
      )}

      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-4">
        <ShieldCheck size={13} />
        256-bit SSL · PCI-DSS Compliant · Secured
      </div>

      {/* Accepted methods */}
      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest mb-3">
          We accept
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {['Visa', 'Mastercard', 'Verve', 'USSD', 'M-Pesa', 'MTN MoMo', 'Bank Transfer'].map(p => (
            <span
              key={p}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-5">
          <div className="w-14 h-14 rounded-full border-4 border-black border-t-transparent animate-spin" />
          <div className="text-center">
            <p className="font-black text-sm uppercase tracking-widest">
              Redirecting to payment...
            </p>
            <p className="text-slate-400 text-xs mt-1">Please do not close this tab</p>
          </div>
        </div>
      )}
    </StepLayout>
  );
};

export default GivePage;
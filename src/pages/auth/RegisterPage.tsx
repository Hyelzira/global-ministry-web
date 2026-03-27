import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { authApi } from '../../api/authApi';
import logo from '../../assets/flames.jpg';

/* ================= VALIDATION ================= */

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  userName: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  module: z.enum(['Ministry', 'Youth']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  /* ===== PREFILL FROM HERO FORM ===== */
  const [searchParams] = useSearchParams();
  const prefillFirstName = searchParams.get('firstName') ?? '';
  const prefillLastName = searchParams.get('lastName') ?? '';
  const prefillEmail = searchParams.get('email') ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: prefillFirstName,
      lastName: prefillLastName,
      email: prefillEmail,
      module: 'Ministry',
    },
  });

  /* ================= SUBMIT ================= */

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const response = await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        email: data.email,
        password: data.password,
        module: data.module,
      });

      if (response.data.isSuccess) {
        toast.success(
          'Registration successful! Please check your email to confirm your account.'
        );
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; errors?: string } };
      };

      const message =
        err.response?.data?.errors ||
        err.response?.data?.message ||
        'Registration failed. Please try again.';

      toast.error(String(message));
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-fuchsia-50 flex items-center justify-center px-4 py-14">

      <div className="w-full max-w-xl">

        {/* CARD */}
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-fuchsia-600 to-purple-700 flex items-center justify-center shadow-lg mb-4">
              <img
                src={logo}
                alt="Global Flame Ministries"
                className="w-14 h-14 rounded-full object-cover"
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Join Our Community
            </h1>

            <p className="text-gray-500 text-sm mt-2 text-center">
              Create your account to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* FIRST + LAST */}
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" icon={<FiUser />} register={register('firstName')} error={errors.firstName?.message} placeholder="John" />
              <Input label="Last Name" icon={<FiUser />} register={register('lastName')} error={errors.lastName?.message} placeholder="Doe" />
            </div>

            <Input label="Username" icon={<FiUser />} register={register('userName')} error={errors.userName?.message} placeholder="johndoe" />

            <Input label="Email Address" icon={<FiMail />} register={register('email')} error={errors.email?.message} placeholder="you@example.com" />

            {/* MODULE SELECTOR */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                I want to join
              </label>

              <div className="grid grid-cols-2 gap-4 mt-3">

                {[
                  { value: 'Ministry', title: 'Global Flame Ministry', sub: 'Main congregation', icon: '🔥' },
                  { value: 'Youth', title: 'House of Opra', sub: 'Youth community', icon: '⚡' },
                ].map((m) => (
                  <label key={m.value} className="cursor-pointer">
                    <input {...register('module')} type="radio" value={m.value} className="peer hidden" />

                    <div className="rounded-xl border-2 border-gray-200 p-5 text-center transition-all duration-300
                     peer-checked:border-fuchsia-600
                     peer-checked:bg-gradient-to-br
                     peer-checked:from-fuchsia-50
                     peer-checked:to-purple-50
                     hover:border-fuchsia-300">

                      <div className="text-3xl mb-2">{m.icon}</div>

                      <p className="font-semibold text-sm text-gray-800">
                        {m.title}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {m.sub}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <PasswordInput
              label="Password"
              register={register('password')}
              error={errors.password?.message}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />

            <PasswordInput
              label="Confirm Password"
              register={register('confirmPassword')}
              error={errors.confirmPassword?.message}
              show={showConfirm}
              toggle={() => setShowConfirm(!showConfirm)}
            />

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z" opacity="0.75"/>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* LOGIN */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-fuchsia-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* BACK HOME */}
        <p className="text-center mt-6 text-sm text-gray-400">
          <Link to="/" className="hover:text-fuchsia-600 transition">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

/* ================= REUSABLE INPUT ================= */

const Input = ({ label, icon, register, error, placeholder }: any) => (
  <div>
    <label className="text-sm font-semibold text-gray-700">{label}</label>

    <div className="relative mt-1">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>

      <input
        {...register}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      />
    </div>

    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

/* ================= PASSWORD INPUT ================= */

const PasswordInput = ({ label, register, error, show, toggle }: any) => (
  <div>
    <label className="text-sm font-semibold text-gray-700">{label}</label>

    <div className="relative mt-1">
      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        {...register}
        type={show ? 'text' : 'password'}
        placeholder="Minimum 8 characters"
        className={`w-full pl-10 pr-10 py-3 rounded-xl border focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      />

      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>

    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);
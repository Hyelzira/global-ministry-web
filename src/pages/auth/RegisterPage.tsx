import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { authApi } from '../../api/authApi';
import logo from '../../assets/flames.jpg';

const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50),
  userName: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
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

  // ✅ Read pre-filled data from URL params (from Hero signup form)
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
        toast.success('Registration successful! Please check your email to confirm your account.');
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; errors?: string } }
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">

          {/* Logo + Title */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={logo}
              alt="Global Flame Ministries"
              className="h-16 w-16 rounded-full object-cover mb-3 ring-4 ring-fuchsia-100"
            />
            <h1 className="text-2xl font-bold text-gray-900">Join Our Community</h1>
            <p className="text-gray-500 text-sm mt-1">
              Create your account to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    {...register('firstName')}
                    type="text"
                    placeholder="John"
                    className={`w-full pl-9 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all bg-white placeholder-gray-400 text-sm ${
                      errors.firstName ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    {...register('lastName')}
                    type="text"
                    placeholder="Doe"
                    className={`w-full pl-9 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all bg-white placeholder-gray-400 text-sm ${
                      errors.lastName ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  {...register('userName')}
                  type="text"
                  placeholder="johndoe"
                  className={`w-full pl-9 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all bg-white placeholder-gray-400 text-sm ${
                    errors.userName ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.userName && (
                <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-9 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all bg-white placeholder-gray-400 text-sm ${
                    errors.email ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Module Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                I want to join
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative cursor-pointer">
                  <input
                    {...register('module')}
                    type="radio"
                    value="Ministry"
                    className="peer sr-only"
                  />
                  <div className="border-2 border-gray-200 peer-checked:border-fuchsia-600 peer-checked:bg-fuchsia-50 rounded-lg p-3 text-center transition-all">
                    <div className="text-2xl mb-1">🔥</div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Global Flame Ministry
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Main congregation</p>
                  </div>
                </label>

                <label className="relative cursor-pointer">
                  <input
                    {...register('module')}
                    type="radio"
                    value="Youth"
                    className="peer sr-only"
                  />
                  <div className="border-2 border-gray-200 peer-checked:border-fuchsia-600 peer-checked:bg-fuchsia-50 rounded-lg p-3 text-center transition-all">
                    <div className="text-2xl mb-1">⚡</div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      House of Opra
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Youth community</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  className={`w-full pl-9 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all bg-white placeholder-gray-400 text-sm ${
                    errors.password ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  className={`w-full pl-9 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all bg-white placeholder-gray-400 text-sm ${
                    errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-fuchsia-700 hover:bg-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-fuchsia-600 hover:text-fuchsia-800 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to home */}
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
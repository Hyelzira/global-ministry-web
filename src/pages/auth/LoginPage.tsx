import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/flames.jpg';
import sideImage from '../../assets/dadandmum.jpg'; 

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const from = (location.state as { from?: string })?.from ?? '/';

  useEffect(() => {
    if (searchParams.get('confirmed') === 'true') {
      toast.success('Email confirmed successfully. You can now sign in.');
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);

      if (response.data.isSuccess && response.data.data) {
        login(response.data.data);
        toast.success(`Welcome back, ${response.data.data.firstName}`);

        if (response.data.data.roles.includes('Admin')) {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        'Invalid email or password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* LEFT SIDE (FORM) */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          
          {/* Logo */}
          <div className="mb-8">
            <img src={logo} alt="Logo" className="h-12 w-12 rounded-full mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
            <p className="text-sm text-gray-500 mt-1">
              Access your account securely
            </p>
          </div>

          {/* Redirect Notice */}
          {from && from !== '/' && (
            <div className="mb-6 p-3 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600">
              Please sign in to continue.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                    errors.email ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between text-sm">
                <label className="font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-gray-600 hover:underline">
                  Forgot?
                </Link>
              </div>

              <div className="relative mt-1">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                    errors.password ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-black transition flex justify-center items-center"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Don’t have an account?{' '}
            <Link to="/register" className="text-gray-900 font-medium hover:underline">
              Create one
            </Link>
          </p>

          <p className="text-sm text-gray-400 text-center mt-4">
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (IMAGE PANEL) */}
      <div className="hidden lg:block flex-1 relative">
        <img
          src={sideImage}
          alt="Visual"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text Content */}
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <h2 className="text-2xl font-semibold mb-2">
            Empowering the Next Generation
          </h2>
          <p className="text-sm text-gray-200">
            Connect, grow, and be part of a thriving community making impact.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
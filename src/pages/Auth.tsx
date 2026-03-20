import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // 2. State for error messages
  const navigate = useNavigate(); // 3. Initialize navigate

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error

    // 4. Basic Validation Logic
    const { email, password, fullName } = formData;
    
    if (!email || !password || (!isLogin && !fullName)) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    // Simulate API Call
    setTimeout(() => {
      console.log(isLogin ? 'Logging in...' : 'Signing up...', formData);
      setLoading(false);
      
      // 5. Route to Home on success
      navigate('/'); 
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="text-center">
          <div className="mx-auto h-10 w-10 bg-fuchsia-600 rounded-xl flex items-center justify-center mb-2">
            <Lock className="text-white h-4 w-4" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isLogin ? 'Sign in to your account' : 'Join our community'}
          </h2>
        </div>

        {/* 6. Error Alert Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 flex items-center animate-pulse">
            <AlertCircle className="text-red-500 h-5 w-5 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all"
                    placeholder="John Doe"
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all"
                  placeholder="email@example.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all"
                  placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </button>
        </form>

        {/* Rest of your UI (Google/Github buttons) remains the same */}
        <p className="mt-8 text-center text-sm text-gray-600">
          {isLogin ? "New to our community?" : "Already have an account?"}{' '}
          <button 
            onClick={() => {
                setIsLogin(!isLogin);
                setError('');
            }}
            className="font-bold text-fuchsia-600 hover:text-fuchsia-500 underline underline-offset-4"
          >
            {isLogin ? 'Sign up now' : 'Log in here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
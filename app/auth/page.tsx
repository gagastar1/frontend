'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Signup validation
        if (formData.password.length < 8) {
          setError('Password must be over 8 characters');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (!formData.agreeToTerms) {
          setError('Please agree to terms & conditions');
          setLoading(false);
          return;
        }
      }

      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignUp 
        ? { 
            username: formData.username, 
            email: formData.email, 
            password: formData.password,
            role: 'ADMIN'
          }
        : { username: formData.username, password: formData.password };

      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection error. Please make sure the backend is running on port 8080.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-100 via-cyan-50 to-blue-100 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-teal-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-md">
          {/* Forest Illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center">
                <span className="text-7xl">🌲</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-teal-400 rounded-full opacity-60"></div>
              <div className="absolute -top-2 -left-2 w-12 h-12 bg-blue-400 rounded-full opacity-40"></div>
            </div>
          </div>

          {/* Branding Text */}
          <h1 className="text-5xl font-light tracking-widest text-gray-700 mb-4">
            FOREST SYSTEM
          </h1>
          <p className="text-gray-600 text-lg font-light tracking-wide">
            Inspiration for Wildlife Conservation
          </p>

          {/* Learn More Button */}
          <button className="mt-12 px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-full font-medium hover:bg-white hover:shadow-lg transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-right mb-8">
            <p className="text-sm text-gray-500 italic mb-2">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-semibold text-gray-800 hover:text-teal-600 transition-colors underline"
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'SIGN UP NOW' : 'LOG IN'}
            </h2>
            <p className="text-gray-400 text-sm italic">
              {isSignUp ? 'to explore the world of forest management' : 'to access your dashboard'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="relative">
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Username"
                className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:border-teal-500 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent text-lg transition-colors"
                required
              />
              {formData.username && (
                <span className="absolute right-0 top-3 text-teal-500 text-xl">✓</span>
              )}
            </div>

            {/* Email - Only for Sign Up */}
            {isSignUp && (
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:border-teal-500 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent text-lg transition-colors"
                  required
                />
                {formData.email && formData.email.includes('@') && (
                  <span className="absolute right-0 top-3 text-teal-500 text-xl">✓</span>
                )}
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={isSignUp ? "CHOOSE A PASSWORD" : "Password"}
                className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:border-teal-500 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent text-lg transition-colors"
                required
              />
              {isSignUp && (
                <p className="text-xs text-gray-400 mt-1 italic">must be over 8 characters</p>
              )}
            </div>

            {/* Confirm Password - Only for Sign Up */}
            {isSignUp && (
              <div className="relative">
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm Password"
                  className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:border-teal-500 focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent text-lg transition-colors"
                  required
                />
              </div>
            )}

            {/* Terms & Conditions - Only for Sign Up */}
            {isSignUp && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I have read and agree to{' '}
                  <span className="text-teal-500 hover:underline cursor-pointer">
                    terms & conditions
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white border-2 border-gray-300 text-gray-800 rounded-full font-semibold text-lg hover:bg-gray-50 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          {/* Mobile Logo */}
          <div className="lg:hidden mt-12 text-center">
            <span className="text-4xl">🌲</span>
            <p className="text-gray-500 text-sm mt-2">Forest Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
}

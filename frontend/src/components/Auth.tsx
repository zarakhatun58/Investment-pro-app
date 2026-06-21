import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import {
  Mail,
  Lock,
  User,
  Phone,
  Gift,
  TrendingUp,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface AuthProps {
  onSuccess: () => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const {
  login,
  register,
  loading,
  error,
  clearError
} = useAuthStore();

const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  clearError();

  try {
    if (isLogin) {
      await login(
        email,
        password
      );
    } else {
      await register({
        fullName,
        email,
        mobile: mobileNumber,
        password,
        referralCode,
      });
    }

    onSuccess();
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">InvestPro</h1>
          </div>
          <p className="text-slate-500">Invest smart, earn daily ROI</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => {
                setIsLogin(true);
                clearError();
              }}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                isLogin
                  ? 'text-emerald-600 bg-emerald-50 border-b-2 border-emerald-500'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                clearError();
              }}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                !isLogin
                  ? 'text-emerald-600 bg-emerald-50 border-b-2 border-emerald-500'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required={!isLogin}
                      placeholder="Enter your mobile number"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Referral Code <span className="text-slate-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      placeholder="Enter referral code"
                      maxLength={8}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent uppercase"
                    />
                  </div>
                  {referralCode && (
                    <p className="mt-1 text-xs text-emerald-600">You'll be placed in the referral network</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              {!isLogin && (
                <p className="mt-1 text-xs text-slate-500">Must be at least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Features */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs text-slate-600">Daily ROI</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <Gift className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-xs text-slate-600">Level Income</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <User className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-slate-600">Referral Tree</p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-slate-500 text-sm mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-emerald-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-emerald-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

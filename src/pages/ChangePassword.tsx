import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Phone,
  Shield,
  Key,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

type Step = 'phone' | 'otp' | 'password';

export const ChangePassword = () => {
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.recoverPasswordBySms(phoneNumber.trim());
      if (response.code === 1) {
        setStep('otp');
      } else {
        setError(response.message || 'Không thể gửi mã OTP');
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim() || otp.length < 6) {
      setError('Vui lòng nhập mã OTP 6 số');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.activateOtp(phoneNumber, otp.trim());
      if (response.code === 1) {
        setStep('password');
      } else {
        setError(response.message || 'Mã OTP không đúng');
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim() || password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.changePasswordByToken(phoneNumber, password);
      if (response.code === 1) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Không thể đổi mật khẩu');
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const getStepNumber = () => {
    if (step === 'phone') return 1;
    if (step === 'otp') return 2;
    return 3;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        {!success && (
          <button
            onClick={() => step === 'phone' ? navigate('/login') : setStep(step === 'otp' ? 'phone' : 'otp')}
            className="mb-4 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 'phone' ? 'Quay lại đăng nhập' : 'Quay lại'}</span>
          </button>
        )}

        {/* Main Card */}
        <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20 overflow-hidden">
          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-200">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(getStepNumber() / 3) * 100}%` }}
            ></div>
          </div>

          <CardContent className="p-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm transition-all ${
                      getStepNumber() === num
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg scale-110'
                        : getStepNumber() > num
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {getStepNumber() > num ? <Check className="w-5 h-5" /> : num}
                  </div>
                  {num < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${getStepNumber() > num ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Success State */}
            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
                  <Check className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Đổi mật khẩu thành công!</h2>
                <p className="text-gray-600">Đang chuyển về trang đăng nhập...</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                    {step === 'phone' && <Phone className="w-8 h-8 text-white" />}
                    {step === 'otp' && <Shield className="w-8 h-8 text-white" />}
                    {step === 'password' && <Key className="w-8 h-8 text-white" />}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {step === 'phone' && 'Đổi mật khẩu'}
                    {step === 'otp' && 'Xác thực OTP'}
                    {step === 'password' && 'Mật khẩu mới'}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {step === 'phone' && 'Nhập số điện thoại để nhận mã OTP'}
                    {step === 'otp' && 'Nhập mã OTP đã gửi về số điện thoại của bạn'}
                    {step === 'password' && 'Nhập mật khẩu mới cho tài khoản'}
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 mb-6 animate-shake">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Step 1: Phone Number */}
                {step === 'phone' && (
                  <form onSubmit={handleRequestOtp} className="space-y-5">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <div className="p-1.5 rounded-lg bg-blue-50 group-focus-within:bg-blue-100 transition-colors">
                            <Phone className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-14 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white font-medium hover:border-gray-300"
                          placeholder="0912345678"
                          disabled={loading}
                          autoComplete="tel"
                          inputMode="numeric"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4"
                    >
                      {loading ? 'Đang gửi...' : (
                        <>
                          <span>Gửi mã OTP</span>
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* Step 2: OTP */}
                {step === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div>
                      <label htmlFor="otp" className="block text-sm font-bold text-gray-700 mb-2">
                        Mã OTP
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <div className="p-1.5 rounded-lg bg-indigo-50 group-focus-within:bg-indigo-100 transition-colors">
                            <Shield className="h-4 w-4 text-indigo-600" />
                          </div>
                        </div>
                        <input
                          id="otp"
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="w-full pl-14 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 bg-white font-medium hover:border-gray-300 text-center text-2xl tracking-widest"
                          placeholder="000000"
                          disabled={loading}
                          maxLength={6}
                          inputMode="numeric"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Mã OTP đã được gửi đến số <span className="font-semibold">{phoneNumber}</span>
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4"
                    >
                      {loading ? 'Đang xác thực...' : (
                        <>
                          <span>Xác thực OTP</span>
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* Step 3: New Password */}
                {step === 'password' && (
                  <form onSubmit={handleChangePassword} className="space-y-5">
                    <div>
                      <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                        Mật khẩu mới
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <div className="p-1.5 rounded-lg bg-purple-50 group-focus-within:bg-purple-100 transition-colors">
                            <Key className="h-4 w-4 text-purple-600" />
                          </div>
                        </div>
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-14 pr-14 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 bg-white font-medium hover:border-gray-300"
                          placeholder="••••••••"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-600 transition-all"
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                        Xác nhận mật khẩu
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <div className="p-1.5 rounded-lg bg-purple-50 group-focus-within:bg-purple-100 transition-colors">
                            <Key className="h-4 w-4 text-purple-600" />
                          </div>
                        </div>
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-14 pr-14 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 bg-white font-medium hover:border-gray-300"
                          placeholder="••••••••"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-600 transition-all"
                          disabled={loading}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4"
                    >
                      {loading ? 'Đang đổi mật khẩu...' : (
                        <>
                          <span>Đổi mật khẩu</span>
                          <Check className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.5s; }
      `}</style>
    </div>
  );
};


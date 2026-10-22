"use client";
import React, { useState } from 'react';
import { X, LogIn, Mail, Lock, Eye, EyeOff, Phone, ShieldCheck, CheckCircle, Sparkles, ArrowRight, GraduationCap, KeyRound, UserCheck } from 'lucide-react';
export const LoginModal = ({ isOpen, onClose, onLoginSuccess, }) => {
    const [activeTab, setActiveTab] = useState('login');
    const [loginMethod, setLoginMethod] = useState('password');
    // Login fields
    const [emailOrPhone, setEmailOrPhone] = useState('aditya.shah@degreefyd.com');
    const [password, setPassword] = useState('••••••••');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    // OTP flow state
    const [otpSent, setOtpSent] = useState(false);
    const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
    const [otpCountdown, setOtpCountdown] = useState(30);
    // Registration fields
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regCourse, setRegCourse] = useState('Online MBA');
    // Status & feedback
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);
    if (!isOpen)
        return null;
    const handleSendOtp = (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!emailOrPhone.trim()) {
            setErrorMsg('Please enter your registered mobile number or email.');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setOtpSent(true);
            setOtpCountdown(30);
        }, 600);
    };
    const handleOtpChange = (index, val) => {
        if (val.length > 1)
            val = val.slice(-1);
        const newOtp = [...otpDigits];
        newOtp[index] = val;
        setOtpDigits(newOtp);
        // Auto advance focus
        if (val && index < 3) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            nextInput?.focus();
        }
    };
    const handlePasswordLogin = (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!emailOrPhone.trim()) {
            setErrorMsg('Please enter your email or mobile number.');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const user = {
                name: 'Aditya Shah',
                email: emailOrPhone.includes('@') ? emailOrPhone : 'aditya.shah@degreefyd.com',
                phone: !emailOrPhone.includes('@') ? emailOrPhone : '+91 98765 43210',
                enrolledCourse: 'Online MBA - Lovely Professional University',
                applicationId: 'DEG-2026-89421',
            };
            setLoggedInUser(user);
            setSuccessMsg(`Welcome back, ${user.name}!`);
            if (onLoginSuccess) {
                onLoginSuccess(user);
            }
        }, 800);
    };
    const handleOtpVerify = (e) => {
        e.preventDefault();
        const enteredOtp = otpDigits.join('');
        if (enteredOtp.length < 4) {
            setErrorMsg('Please enter the complete 4-digit OTP sent to your phone.');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const user = {
                name: 'Aditya Shah',
                email: 'aditya.shah@degreefyd.com',
                phone: emailOrPhone,
                enrolledCourse: 'Online MBA - Lovely Professional University',
                applicationId: 'DEG-2026-89421',
            };
            setLoggedInUser(user);
            setSuccessMsg(`Verified! Welcome back, ${user.name}!`);
            if (onLoginSuccess) {
                onLoginSuccess(user);
            }
        }, 700);
    };
    const handleRegister = (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
            setErrorMsg('Please fill in your name, email, and mobile number.');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            const user = {
                name: regName,
                email: regEmail,
                phone: regPhone,
                enrolledCourse: regCourse,
                applicationId: `DEG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            };
            setLoggedInUser(user);
            setSuccessMsg(`Account created successfully! Welcome, ${user.name}!`);
            if (onLoginSuccess) {
                onLoginSuccess(user);
            }
        }, 800);
    };
    const handleGoogleLogin = () => {
        setIsLoading(true);
        setErrorMsg('');
        setTimeout(() => {
            setIsLoading(false);
            const user = {
                name: 'Aditya Shah',
                email: 'aditya.shah@degreefyd.com',
                phone: '+91 98765 43210',
                enrolledCourse: 'Online MBA - Lovely Professional University',
                applicationId: 'DEG-2026-89421',
            };
            setLoggedInUser(user);
            setSuccessMsg('Authenticated via Google. Welcome!');
            if (onLoginSuccess) {
                onLoginSuccess(user);
            }
        }, 700);
    };
    const handleModalClose = () => {
        setErrorMsg('');
        setSuccessMsg('');
        setOtpSent(false);
        onClose();
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200" onClick={handleModalClose}>
      <div className="relative w-full max-w-[395px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Top Header Background Banner */}
        <div className="bg-gradient-to-r from-[#000f22] via-[#00224d] to-[#115eaf] px-5 pt-5 pb-4 text-white relative shrink-0">
          <button type="button" onClick={handleModalClose} className="absolute top-3.5 right-3.5 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center -m-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" aria-label="Close login dialog">
            <X className="w-4 h-4"/>
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <LogIn className="w-3.5 h-3.5"/>
            </div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-200">
              Student & Applicant Portal
            </span>
          </div>

          <h3 className="text-lg font-bold tracking-tight text-white">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Student Account'}
          </h3>
          <p className="text-xs text-slate-200 mt-0.5">
            Get to know your online career in 30 seconds
          </p>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1 shrink-0">
          <button type="button" onClick={() => {
            setActiveTab('login');
            setErrorMsg('');
        }} className={`flex-1 py-2 min-h-[44px] text-xs font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'login'
            ? 'bg-white text-[#115eaf] shadow-xs'
            : 'text-slate-600 hover:text-slate-900'}`}>
            Student Login
          </button>
          <button type="button" onClick={() => {
            setActiveTab('register');
            setErrorMsg('');
        }} className={`flex-1 py-2 min-h-[44px] text-xs font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'register'
            ? 'bg-white text-[#115eaf] shadow-xs'
            : 'text-slate-600 hover:text-slate-900'}`}>
            New Registration
          </button>
        </div>

        {/* Body Container */}
        <div className="p-4 sm:p-5 overflow-y-auto min-h-0">
          {/* Success Banner if Logged In */}
          {loggedInUser ? (<div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
                <UserCheck className="w-8 h-8"/>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {successMsg || 'Login Successful!'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Active session for <strong className="text-slate-800">{loggedInUser.email}</strong>
                </p>
                {loggedInUser.applicationId && (<div className="mt-3 inline-block bg-blue-50 border border-blue-200 text-[#115eaf] px-3 py-1 rounded-full text-xs font-medium">
                    Application ID: {loggedInUser.applicationId}
                  </div>)}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button type="button" onClick={handleModalClose} className="w-full py-3 min-h-[44px] rounded-xl bg-[#115eaf] hover:bg-[#084a8c] text-white text-xs font-semibold shadow-xs cursor-pointer transition-all">
                  Continue to Portal
                </button>
                <button type="button" onClick={() => {
                setLoggedInUser(null);
                setSuccessMsg('');
            }} className="text-xs text-slate-500 hover:text-rose-600 font-medium py-2 min-h-[44px] cursor-pointer transition-colors">
                  Sign Out
                </button>
              </div>
            </div>) : (<>
              {/* Error Notification */}
              {errorMsg && (<div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <span className="text-rose-500">⚠</span>
                  <span>{errorMsg}</span>
                </div>)}

              {/* LOGIN TAB */}
              {activeTab === 'login' && (<div>
                  {/* Login Method Toggle: Password vs OTP */}
                  <div className="flex items-center justify-center gap-4 mb-4 text-xs font-medium border-b border-slate-100 pb-2">
                    <button type="button" onClick={() => {
                    setLoginMethod('password');
                    setOtpSent(false);
                    setErrorMsg('');
                }} className={`pb-2 min-h-[44px] px-1 cursor-pointer transition-colors ${loginMethod === 'password'
                    ? 'text-[#115eaf] font-bold border-b-2 border-[#115eaf]'
                    : 'text-slate-500 hover:text-slate-800'}`}>
                      Email / Password
                    </button>
                    <span className="text-slate-300">|</span>
                    <button type="button" onClick={() => {
                    setLoginMethod('otp');
                    setErrorMsg('');
                }} className={`pb-2 min-h-[44px] px-1 cursor-pointer transition-colors ${loginMethod === 'otp'
                    ? 'text-[#115eaf] font-bold border-b-2 border-[#115eaf]'
                    : 'text-slate-500 hover:text-slate-800'}`}>
                      Instant Mobile OTP
                    </button>
                  </div>

                  {loginMethod === 'password' ? (
                /* Email & Password Form */
                <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Email Address or Mobile Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4"/>
                          </div>
                          <input type="text" required value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} placeholder="aditya.shah@degreefyd.com" className="w-full pl-9 pr-3 py-2 text-base sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/15 transition-all text-slate-900"/>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium text-slate-700">
                            Password
                          </label>
                          <a href="#forgot" onClick={(e) => {
                        e.preventDefault();
                        setErrorMsg('A reset link has been dispatched to your email.');
                    }} className="text-[11px] text-[#115eaf] hover:underline font-medium">
                            Forgot Password?
                          </a>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4"/>
                          </div>
                          <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your account password" className="w-full pl-9 pr-10 py-2 text-base sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/15 transition-all text-slate-900"/>
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
                            {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-[#115eaf] rounded border-slate-300 focus:ring-[#115eaf] cursor-pointer"/>
                          <span className="text-xs text-slate-600 font-normal">Remember this device</span>
                        </label>
                      </div>

                      <button type="submit" disabled={isLoading} className="w-full py-3 min-h-[44px] rounded-xl bg-[#115eaf] hover:bg-[#084a8c] text-white text-base sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-xs cursor-pointer disabled:opacity-60">
                        {isLoading ? (<span>Verifying Credentials...</span>) : (<>
                            <span>Login to Account</span>
                            <ArrowRight className="w-4 h-4"/>
                          </>)}
                      </button>
                    </form>) : (
                /* OTP Login Form */
                <form onSubmit={otpSent ? handleOtpVerify : handleSendOtp} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Registered Mobile Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Phone className="w-4 h-4"/>
                          </div>
                          <span className="absolute inset-y-0 left-9 flex items-center text-xs text-slate-500 font-medium">
                            +91
                          </span>
                          <input type="tel" maxLength={10} required value={emailOrPhone.replace(/^\+91\s?/, '')} onChange={(e) => setEmailOrPhone(e.target.value)} placeholder="98765 43210" className="w-full pl-16 pr-3 py-2 text-base sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/15 transition-all text-slate-900"/>
                        </div>
                      </div>

                      {otpSent && (<div className="space-y-2 pt-1 animate-fadeIn">
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-xs font-medium text-slate-700 shrink-0">
                              Enter 4-Digit OTP Code
                            </label>
                            <span className="text-[11px] text-emerald-600 font-medium min-w-0 truncate">
                              Sent to {emailOrPhone}
                            </span>
                          </div>

                          <div className="flex justify-center gap-3">
                            {[0, 1, 2, 3].map((idx) => (<input key={idx} id={`otp-input-${idx}`} type="text" maxLength={1} inputMode="numeric" value={otpDigits[idx]} onChange={(e) => handleOtpChange(idx, e.target.value)} className="w-12 h-12 text-center text-lg font-bold bg-slate-50 border border-slate-300 focus:border-[#115eaf] focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#115eaf]/20 transition-all text-slate-900"/>))}
                          </div>

                          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                            <span>Didn’t receive code?</span>
                            <button type="button" onClick={() => {
                            setOtpCountdown(30);
                            setErrorMsg('');
                        }} className="text-[#115eaf] hover:underline font-semibold cursor-pointer py-2 min-h-[44px] px-1">
                              Resend OTP
                            </button>
                          </div>
                        </div>)}

                      <button type="submit" disabled={isLoading} className="w-full py-3 min-h-[44px] rounded-xl bg-[#115eaf] hover:bg-[#084a8c] text-white text-base sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-xs cursor-pointer disabled:opacity-60">
                        {isLoading ? (<span>Processing...</span>) : otpSent ? (<>
                            <span>Verify & Sign In</span>
                            <CheckCircle className="w-4 h-4"/>
                          </>) : (<>
                            <span>Get OTP Verification Code</span>
                            <KeyRound className="w-4 h-4"/>
                          </>)}
                      </button>
                    </form>)}

                  {/* Or Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"/>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-slate-400 font-medium text-[11px]">
                        Or quick continue
                      </span>
                    </div>
                  </div>

                  {/* Google Sign In Button */}
                  <button type="button" onClick={handleGoogleLogin} disabled={isLoading} className="w-full py-3 min-h-[44px] px-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-base sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer active:scale-[0.99]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>)}

              {/* REGISTER TAB */}
              {activeTab === 'register' && (<form onSubmit={handleRegister} className="space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Legal Name
                    </label>
                    <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="e.g. Aditya Sharma" className="w-full px-3 py-2 text-base sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/15 transition-all text-slate-900"/>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="name@email.com" className="w-full px-3 py-2 text-base sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/15 transition-all text-slate-900"/>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Mobile Number
                      </label>
                      <input type="tel" maxLength={10} required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="10-digit number" className="w-full px-3 py-2 text-base sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/15 transition-all text-slate-900"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Intended Degree Program
                    </label>
                    <div className="relative">
                      <select value={regCourse} onChange={(e) => setRegCourse(e.target.value)} className="w-full px-3 py-2 text-base sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/15 transition-all text-slate-900 cursor-pointer appearance-none">
                        <option value="Online MBA">Online MBA (Master of Business Admin)</option>
                        <option value="Online MCA">Online MCA (Master of Computer Apps)</option>
                        <option value="Online BCA">Online BCA (Bachelor of Computer Apps)</option>
                        <option value="Online BBA">Online BBA (Bachelor of Business Admin)</option>
                        <option value="Online M.Com">Online M.Com (Commerce & Finance)</option>
                        <option value="Online M.A.">Online M.A. (English / Psychology)</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                    By registering, you agree to receive SMS / WhatsApp admission alerts regarding syllabus updates, cutoffs, and counseling deadlines.
                  </p>

                  <button type="submit" disabled={isLoading} className="w-full py-3 min-h-[44px] rounded-xl bg-[#115eaf] hover:bg-[#084a8c] text-white text-base sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-xs cursor-pointer disabled:opacity-60">
                    {isLoading ? (<span>Creating Registration...</span>) : (<>
                        <span>Register & Generate Student ID</span>
                        <GraduationCap className="w-4 h-4"/>
                      </>)}
                  </button>
                </form>)}
            </>)}

          {/* Security & Verification Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600"/>
              256-Bit SSL Encrypted
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#115eaf]"/>
              Degreefyd Verified
            </span>
          </div>
        </div>
      </div>
    </div>);
};

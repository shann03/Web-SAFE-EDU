
import React, { useState } from 'react';
import { PREDEFINED_ACCOUNTS } from '../constants';
import { User } from '../types';
import { Mail, Lock, ShieldCheck, AlertCircle, Shield, User as UserIcon, Briefcase } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'Teacher' | 'Counselor'>('Teacher');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (isLoginMode) {
        const account = PREDEFINED_ACCOUNTS.find(
          (acc) => acc.email === email && acc.password === password
        );

        if (account) {
          onLogin(account.user);
        } else {
          setError('The email or password you entered is incorrect. Please try again.');
        }
      } else {
        // Simulate successful registration
        const newUser: User = {
          id: `u${Date.now()}`,
          username: email.split('@')[0],
          email: email,
          full_name: fullName,
          is_active: true,
          role: role,
        };
        onLogin(newUser);
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Subtle school-pattern background effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="grid grid-cols-6 gap-20 p-20 transform -rotate-12">
          {Array.from({ length: 24 }).map((_, i) => (
            <Shield key={i} size={80} />
          ))}
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 px-6">
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300">
          <div className="p-8 pb-4 text-center">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SAFE-EDU</h1>
            <p className="text-slate-500 mt-1 text-xs font-medium uppercase tracking-wider">
              {isLoginMode ? 'Officer Authentication' : 'Registry Enrollment'}
            </p>
          </div>

          <div className="px-8 flex border-b border-slate-100">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                isLoginMode ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                !isLoginMode ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4">
            {error && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[10px] animate-in fade-in duration-300">
                <AlertCircle size={16} className="shrink-0 text-amber-600" />
                <p className="font-bold uppercase tracking-tight">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              {!isLoginMode && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Official Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium"
                        placeholder="Juan Dela Cruz"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Designated Role</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all appearance-none font-medium"
                      >
                        <option value="Teacher">Teacher (Academic Staff)</option>
                        <option value="Counselor">Guidance Counselor</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Official Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium"
                    placeholder="official.email@school.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Access Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-slate-900 text-white rounded-lg font-black text-xs uppercase tracking-widest hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </span>
              ) : isLoginMode ? 'Sign In to Portal' : 'Register New Account'}
            </button>
          </form>

          {isLoginMode && (
            <div className="px-8 pb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-white px-3 text-slate-400">Quick Access for Demo</span></div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 text-center">
                <div className="flex justify-center gap-4">
                  <button onClick={() => {setEmail('teacher@gmail.com'); setPassword('12345678'); setIsLoginMode(true);}} className="text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors underline decoration-slate-200 hover:decoration-slate-900">Teacher</button>
                  <button onClick={() => {setEmail('counselor@gmail.com'); setPassword('12345678'); setIsLoginMode(true);}} className="text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors underline decoration-slate-200 hover:decoration-slate-900">Counselor</button>
                  <button onClick={() => {setEmail('admin@gmail.com'); setPassword('12345678'); setIsLoginMode(true);}} className="text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors underline decoration-slate-200 hover:decoration-slate-900">Admin</button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center space-y-3">
          <p className="text-slate-400 text-[9px] flex items-center justify-center gap-2 uppercase tracking-widest font-black">
            <Shield size={12} className="text-teal-600" />
            Compliant with RA 10173 - Data Privacy Act of 2012
          </p>
          <p className="text-slate-300 text-[8px] font-medium max-w-xs mx-auto">
            Authorized personnel only. All access attempts and activity are recorded for auditing purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

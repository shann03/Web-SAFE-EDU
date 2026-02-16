
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '../types';
import { 
  Mail, Lock, ShieldCheck, User as UserIcon, 
  Briefcase, Loader2, Terminal, AlertTriangle, 
  ChevronDown, Eye, EyeOff, Search
} from 'lucide-react';
import { PREDEFINED_ACCOUNTS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
  onLocalBypass: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentLrn, setStudentLrn] = useState('');
  const [role, setRole] = useState<'Teacher' | 'Counselor' | 'Parent' | 'Administrator'>('Teacher');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        const predefined = PREDEFINED_ACCOUNTS.find(a => a.email === email && a.password === password);
        if (predefined) {
          onLogin(predefined.user as User);
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;

        if (authData.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
          if (profile) {
            onLogin(profile as User);
          } else {
            onLogin({ 
              id: authData.user.id, 
              full_name: authData.user.user_metadata.full_name || 'Registry User', 
              role: authData.user.user_metadata.role || 'Teacher', 
              email: authData.user.email!, 
              username: authData.user.email!.split('@')[0], 
              is_active: true,
              linked_lrn: authData.user.user_metadata.linked_lrn
            } as User);
          }
        }
      } else {
        if (role === 'Parent' && studentLrn.length < 5) {
          throw new Error("A valid Student LRN is required for Parent registration.");
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            data: { 
              full_name: fullName, 
              role: role,
              linked_lrn: role === 'Parent' ? studentLrn : null
            }
          }
        });

        if (signUpError) throw signUpError;
        
        if (signUpData.user) {
          await supabase.from('profiles').insert([{
            id: signUpData.user.id,
            full_name: fullName,
            role: role,
            email: email,
            username: email.split('@')[0],
            is_active: true,
            linked_lrn: role === 'Parent' ? studentLrn : null
          }]);

          alert("Verification email sent! Please confirm your email to activate your registry access.");
          setIsLoginMode(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Verification system failure.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-slate-900 to-teal-500"></div>
      
      <div className="w-full max-w-md relative z-10 space-y-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-2.5 bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_currentColor]"></div>
              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Registry Secure</span>
            </div>
            <Terminal size={12} className="text-white/40" />
          </div>

          <div className="p-10 pb-6 text-center">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl ring-4 ring-slate-50">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SAFE-EDU</h1>
            <div className="mt-2 space-y-1">
              <p className="text-teal-600 text-[9px] font-black uppercase tracking-widest">Student Assistance & Fostering Excellence in EDUcation</p>
              <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.2em] opacity-80">Authority & Scholar Registry</p>
            </div>
          </div>

          <div className="px-10 flex border-b border-slate-100">
            <button onClick={() => setIsLoginMode(true)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${isLoginMode ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Sign In</button>
            <button onClick={() => setIsLoginMode(false)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${!isLoginMode ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Register</button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 pt-8 pb-12 space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-lg border border-red-100 flex items-center gap-2 animate-pulse"><AlertTriangle size={14}/> {error}</div>}
            
            <div className="space-y-4">
              {!isLoginMode && (
                <>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-slate-900 font-medium" placeholder="Full Name" />
                  </div>
                  <div className="relative group">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    <select 
                      value={role} 
                      onChange={(e) => setRole(e.target.value as any)} 
                      className="w-full pl-10 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-slate-900 appearance-none font-bold uppercase tracking-widest cursor-pointer"
                    >
                      <option value="Teacher">Teacher</option>
                      <option value="Counselor">Counselor</option>
                      <option value="Parent">Parent / Guardian</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                  {role === 'Parent' && (
                    <div className="relative animate-in slide-in-from-top-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" size={16} />
                      <input required type="text" value={studentLrn} onChange={(e) => setStudentLrn(e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-teal-50 border border-teal-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-teal-600 font-bold placeholder:text-teal-300" placeholder="Student LRN (Child's ID)" />
                    </div>
                  )}
                </>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-slate-900 font-medium" placeholder="Email Address" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-slate-900 font-medium" placeholder="Password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase shadow-2xl active:scale-95 disabled:opacity-70 transition-all hover:bg-slate-800 tracking-[0.2em]">
              {isLoading ? <Loader2 size={18} className="animate-spin mx-auto" /> : isLoginMode ? 'Authorize Session' : 'Create Authority Profile'}
            </button>
            {isLoginMode && (
              <button type="button" className="w-full text-[9px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 transition-colors">Emergency Credential Recovery</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

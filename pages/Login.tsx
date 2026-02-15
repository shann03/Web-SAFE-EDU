
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { User } from '../types';
import { 
  Mail, Lock, ShieldCheck, AlertCircle, Shield, User as UserIcon, 
  Briefcase, Database, CheckCircle2, Loader2, Info, Terminal, 
  DatabaseZap, Copy, Code, X, Zap, AlertTriangle,
  ServerCrash, ChevronDown, MonitorPlay, Key, Eye, EyeOff
} from 'lucide-react';
import { PREDEFINED_ACCOUNTS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
  onLocalBypass: (user: User) => void;
}

interface SeedStatus {
  email: string;
  role: string;
  status: 'pending' | 'loading' | 'success' | 'healed' | 'error';
  message?: string;
}

const REQUIRED_TABLES = [
  'profiles', 'students', 'incidents', 'incident_types', 
  'interventions', 'device_logs', 'parents', 
  'generated_reports', 'system_audit_logs', 'notifications'
];

const Login: React.FC<LoginProps> = ({ onLogin, onLocalBypass }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'Teacher' | 'Counselor' | 'Administrator'>('Teacher');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'missing_tables' | 'rls_blocked' | 'offline'>('checking');

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    setDbStatus('checking');
    const missing: string[] = [];
    let rlsIssue = false;
    
    try {
      const { error: profError } = await supabase.from('profiles').select('id').limit(1);
      if (profError) {
        if (profError.message.toLowerCase().includes('row-level security') || profError.code === '42501') {
          rlsIssue = true;
        } else if (profError.code === '42P01') {
          missing.push('profiles');
        }
      }

      for (const table of REQUIRED_TABLES) {
        if (table === 'profiles') continue;
        const { error } = await supabase.from(table).select('id').limit(1);
        if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
          missing.push(table);
        }
      }

      if (rlsIssue) setDbStatus('rls_blocked');
      else if (missing.length > 0) setDbStatus('missing_tables');
      else setDbStatus('online');
    } catch (e) {
      setDbStatus('offline');
    }
  };

  const generateSql = () => {
    return `
-- ======================================================
-- SAFE-EDU SUPABASE "NUCLEAR" REPAIR SCRIPT
-- ======================================================

-- 1. DROP EXISTING POLICIES TO CLEAR PERMISSION CACHE
DROP POLICY IF EXISTS "Public Full Access" ON public.profiles;
DROP POLICY IF EXISTS "Public All" ON public.profiles;

-- 2. ENSURE PROFILES TABLE IS CONFIGURED CORRECTLY
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    role TEXT CHECK (role IN ('Teacher', 'Counselor', 'Administrator')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DISABLE RLS FOR RAPID SYNC (SOLVES 'row-level security' VIOLATIONS)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 4. INITIALIZE ALL CORE REGISTRY TABLES
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lrn TEXT UNIQUE NOT NULL,
    first_name TEXT, last_name TEXT, date_of_birth DATE,
    gender TEXT, grade_level TEXT, section TEXT, address TEXT, contact_number TEXT
);
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.incident_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL, description TEXT
);
ALTER TABLE public.incident_types DISABLE ROW LEVEL SECURITY;

-- SEED PRIMARY CATEGORIES
INSERT INTO public.incident_types (name, description) VALUES
('Bullying', 'Repeated harmful behavior towards a peer.'),
('Academic Dishonesty', 'Cheating or plagiarism.'),
('Property Damage', 'Vandalism to school property.'),
('Digital Misuse', 'Unauthorized access on school devices.'),
('Verbal Altercation', 'Heated argument involving inappropriate language.')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.incidents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    reported_by_user_id UUID REFERENCES auth.users(id),
    incident_type_id UUID REFERENCES incident_types(id),
    date_reported TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_occurred TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location TEXT, description TEXT, immediate_action TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Investigating', 'Resolved', 'Closed'))
);
ALTER TABLE public.incidents DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.interventions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    assigned_by_user_id UUID REFERENCES auth.users(id),
    intervention_type TEXT, description TEXT, status TEXT DEFAULT 'Active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(), end_date TIMESTAMP WITH TIME ZONE
);
ALTER TABLE public.interventions DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.device_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    activity_description TEXT, flagged BOOLEAN DEFAULT FALSE,
    usage_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(), usage_end TIMESTAMP WITH TIME ZONE
);
ALTER TABLE public.device_logs DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.parents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    first_name TEXT, last_name TEXT, relationship_to_student TEXT,
    contact_number TEXT, email TEXT, address TEXT
);
ALTER TABLE public.parents DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.generated_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT, type TEXT, generated_by_user_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'Ready', file_size TEXT, date_generated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.generated_reports DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.system_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    user_name TEXT, action TEXT, category TEXT, ip_address TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.system_audit_logs DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    title TEXT, message TEXT, type TEXT, is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- 5. RE-GRANT FULL PERMISSIONS TO ALL SCHEMA ROLES
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
    `.trim();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateSql());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleBypassToMock = () => {
    // Force set the admin role for the bypass
    const adminUser = { ...PREDEFINED_ACCOUNTS[2].user } as User;
    onLocalBypass(adminUser);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;

        if (authData.user) {
          // Attempt to get profile
          const { data: profile, error: profError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profError || !profile) {
            // Healer logic: Detect role from metadata or email
            const emailLower = email.toLowerCase();
            const guessedRole = emailLower.startsWith('admin') ? 'Administrator' : 
                               emailLower.startsWith('counselor') ? 'Counselor' : 
                               authData.user.user_metadata?.role || 'Teacher';

            const { data: healedProfile, error: healError } = await supabase.from('profiles').upsert([{
              id: authData.user.id,
              username: email.split('@')[0],
              full_name: authData.user.user_metadata?.full_name || 'Restored Official',
              role: guessedRole,
              is_active: true
            }]).select().single();

            if (healError) {
              if (healError.message.toLowerCase().includes('security') || healError.message.toLowerCase().includes('rls')) {
                throw new Error("ACCESS DENIED: Database policy (RLS) blocked your profile synchronization. Please apply the SQL Repair Kit.");
              }
              throw healError;
            }
            onLogin(healedProfile as User);
          } else {
            onLogin(profile as User);
          }
        }
      } else {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            data: { 
              full_name: fullName, 
              role: role 
            } 
          }
        });

        if (signUpError) throw signUpError;
        
        if (signUpData.user) {
          const { data: profile, error: profError } = await supabase.from('profiles').insert([{
            id: signUpData.user.id,
            username: email.split('@')[0],
            full_name: fullName,
            role: role,
            is_active: true
          }]).select().single();

          if (profError) {
             if (profError.message.toLowerCase().includes('security') || profError.message.toLowerCase().includes('rls')) {
                throw new Error("SECURITY BLOCK: Registry policy prevented profile creation. Click 'Fix with SQL' below.");
              }
            throw profError;
          }
          onLogin(profile as User);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Verification system failure.');
      if (err.message.toLowerCase().includes('security') || err.message.toLowerCase().includes('rls')) {
        setShowSql(true);
        setDbStatus('rls_blocked');
      }
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
              <div className={`w-2 h-2 rounded-full ${
                dbStatus === 'online' ? 'bg-teal-400' : 
                dbStatus === 'rls_blocked' ? 'bg-amber-500' : 'bg-red-500'
              } shadow-[0_0_8px_currentColor] ${dbStatus !== 'online' ? 'animate-pulse' : ''}`}></div>
              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">
                {dbStatus === 'online' ? 'Registry Synced' : 
                 dbStatus === 'rls_blocked' ? 'Admin Access Restricted (RLS)' : 
                 dbStatus === 'missing_tables' ? 'Tables Missing' : 'Checking Infrastructure'}
              </span>
            </div>
            <button onClick={checkDatabase} className="text-white/40 hover:text-white transition-colors" title="Reload Database Status">
              <Terminal size={12} />
            </button>
          </div>

          {showSql ? (
            <div className="p-8 bg-slate-900 text-teal-400 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-white/70">
                  <ServerCrash size={16} className="text-red-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Administrator Repair Kit</h3>
                </div>
                <button onClick={() => setShowSql(false)} className="text-white/40 hover:text-white"><X size={16} /></button>
              </div>
              
              <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-[10px] text-teal-100/70 font-bold uppercase mb-2 flex items-center gap-2">
                  <Info size={12} /> Instructions
                </p>
                <ol className="text-[10px] text-teal-100/50 space-y-1 ml-4 list-decimal">
                  <li>Copy the script below.</li>
                  <li>Go to your <strong>Supabase Dashboard</strong>.</li>
                  <li>Open the <strong>SQL Editor</strong> tab.</li>
                  <li>Paste the script and click <strong>Run</strong>.</li>
                </ol>
              </div>

              <div className="bg-black/60 p-5 rounded-xl border border-white/5 font-mono text-[9px] overflow-x-auto max-h-48 whitespace-pre text-teal-300 custom-scrollbar shadow-inner">
                {generateSql()}
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="w-full py-4 bg-teal-500 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-400 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  <Copy size={14} /> {copySuccess ? 'Script Copied' : 'Copy Repair Script'}
                </button>
                <button onClick={handleBypassToMock} className="w-full py-4 bg-slate-800 text-teal-100/50 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-slate-700 transition-all">
                  <MonitorPlay size={14} /> Emergency Admin Access
                </button>
              </div>
            </div>
          ) : (
            <>
              {(error || dbStatus === 'rls_blocked' || dbStatus === 'missing_tables') && (
                <div className="px-6 pt-6 animate-in slide-in-from-top-2">
                  <div className={`p-4 rounded-xl flex gap-3 border ${
                    dbStatus === 'rls_blocked' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <AlertTriangle className={dbStatus === 'rls_blocked' ? 'text-amber-600' : 'text-red-600'} size={18} />
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${
                        dbStatus === 'rls_blocked' ? 'text-amber-800' : 'text-red-800'
                      }`}>Registry Configuration Error</p>
                      <p className="text-[10px] text-slate-600 mt-1 font-medium leading-relaxed">
                        {dbStatus === 'rls_blocked' 
                          ? "Administrator permissions are currently blocked by Row-Level Security (RLS)." 
                          : "The required registry tables are missing from the Supabase project."}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <button 
                          onClick={() => setShowSql(true)}
                          className={`text-[9px] font-black uppercase text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                            dbStatus === 'rls_blocked' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          <DatabaseZap size={12} /> Fix with SQL Kit
                        </button>
                        <button onClick={handleBypassToMock} className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-900 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 border border-slate-200">
                          <Key size={12} /> Emergency Bypass
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-10 pb-6 text-center">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl ring-4 ring-slate-50">
                  <ShieldCheck size={32} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SAFE-EDU</h1>
                <p className="text-slate-500 mt-2 text-[10px] font-black uppercase tracking-widest">Student Assistance Registry</p>
              </div>

              <div className="px-10 flex border-b border-slate-100">
                <button onClick={() => setIsLoginMode(true)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${isLoginMode ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Sign In</button>
                <button onClick={() => setIsLoginMode(false)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${!isLoginMode ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Sign Up</button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 pt-8 space-y-4">
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
                          <option value="Administrator">Administrator</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-slate-900 font-medium" placeholder="Official Email" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full pl-10 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-slate-900 font-medium" 
                      placeholder="Password" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase shadow-2xl active:scale-95 disabled:opacity-70 transition-all hover:bg-slate-800 tracking-[0.2em]">
                  {isLoading ? <Loader2 size={18} className="animate-spin mx-auto" /> : isLoginMode ? 'Enter Portal' : 'Register Official Account'}
                </button>
              </form>
              
              <div className="px-10 pb-8 space-y-4">
                 <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.2em]"><span className="bg-white px-2 text-slate-400">Predefined Access</span></div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => { setEmail('teacher@gmail.com'); setPassword('12345678'); setIsLoginMode(true); }} className="py-2 border border-slate-200 rounded-lg text-[9px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all">Teacher</button>
                  <button onClick={() => { setEmail('counselor@gmail.com'); setPassword('12345678'); setIsLoginMode(true); }} className="py-2 border border-slate-200 rounded-lg text-[9px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all">Counselor</button>
                  <button onClick={() => { setEmail('admin@gmail.com'); setPassword('12345678'); setIsLoginMode(true); }} className="py-2 border border-slate-200 rounded-lg text-[9px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all">Admin</button>
                </div>
              </div>
            </>
          )}
        </div>
        <p className="text-slate-400 text-[9px] text-center uppercase tracking-[0.3em] font-black flex items-center justify-center gap-2">
          <Shield size={10} className="text-teal-600" /> Secure Protocol • v2.7-PATCH
        </p>
      </div>
    </div>
  );
};

export default Login;

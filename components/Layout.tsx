
import React, { useState, useRef, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { User, Notification, DeviceUsageRecord } from '../types';
import { 
  LogOut, Bell, Search, ShieldCheck, AlertCircle, 
  FileText, Settings, Clock, CheckCircle, Tablet,
  ShieldAlert, Zap, X, ChevronRight, AlertTriangle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: Notification[];
  onMarkRead: () => void;
  deviceLogs?: DeviceUsageRecord[];
  onDismissLog?: (id: string) => void;
  onEscalateLog?: (log: DeviceUsageRecord) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  searchQuery, 
  setSearchQuery,
  notifications,
  onMarkRead,
  deviceLogs = [],
  onDismissLog,
  onEscalateLog
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const safetyRef = useRef<HTMLDivElement>(null);
  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const flaggedLogs = deviceLogs.filter(l => l.flagged);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (safetyRef.current && !safetyRef.current.contains(event.target as Node)) {
        setIsSafetyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type: Notification['type']) => {
    switch (type) {
      case 'incident': return <AlertCircle size={14} className="text-amber-500" />;
      case 'report': return <FileText size={14} className="text-teal-500" />;
      case 'system': return <Settings size={14} className="text-slate-500" />;
      default: return <Bell size={14} className="text-slate-500" />;
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center text-white">
              <ShieldCheck size={18} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wider">SAFE-EDU</h1>
          </div>
          <p className="text-[8px] font-black text-teal-500/60 uppercase tracking-[0.2em] mb-10 leading-relaxed px-1">
            Student Assistance & Fostering Excellence in EDUcation
          </p>
          
          <nav className="space-y-1">
            {filteredNavItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === item.name 
                    ? 'bg-teal-700 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-bold text-teal-500 border border-slate-700">
              {user.full_name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate uppercase tracking-tighter">{user.full_name}</p>
              <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs text-white bg-slate-800 border border-slate-700 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50 rounded-lg font-bold uppercase tracking-widest transition-all"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm relative z-30">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Student ID, Name or Incident..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-teal-500 transition-all outline-none placeholder:text-slate-400 font-medium"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-full border border-teal-100">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Protocol Active</span>
            </div>
            
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-2 rounded-full transition-all relative ${isNotifOpen ? 'bg-slate-100 text-teal-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={onMarkRead}
                        className="text-[9px] font-black uppercase tracking-widest text-teal-600 hover:text-teal-800 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle size={10} /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id} className={`p-4 hover:bg-slate-50 transition-colors flex gap-3 ${!n.isRead ? 'bg-teal-50/20' : ''}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-white shadow-sm' : 'bg-slate-100 opacity-60'}`}>
                            {getNotifIcon(n.type)}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-start gap-2">
                              <p className={`text-xs font-bold truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-500'}`}>{n.title}</p>
                              <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap"><Clock size={8} className="inline mr-1" />{formatTime(n.timestamp)}</span>
                            </div>
                            <p className={`text-[10px] leading-relaxed mt-0.5 ${!n.isRead ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>{n.message}</p>
                          </div>
                          {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5"></div>}
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell size={24} className="mx-auto text-slate-200 mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registry is clear</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 bg-slate-50/50 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>

      {/* Global Safety Monitor Hub (Available on all pages) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={safetyRef}>
        {isSafetyOpen && (
          <div className="mb-4 w-96 bg-slate-900 text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-amber-400" size={16} />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Global Safety Monitor</h4>
              </div>
              <button onClick={() => setIsSafetyOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {flaggedLogs.length > 0 ? flaggedLogs.map(log => (
                <div key={log.id} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group">
                   <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] font-black text-amber-500 uppercase flex items-center gap-1">
                        <Zap size={10} fill="currentColor" /> Policy Alert
                      </span>
                      <span className="text-[9px] font-bold text-slate-500">{new Date(log.usage_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   </div>
                   <p className="text-xs font-bold text-white mb-2 italic line-clamp-2">"{log.activity_description}"</p>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => onEscalateLog?.(log)}
                        className="flex-1 py-1.5 bg-red-600 text-white rounded text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
                      >
                        Escalate
                      </button>
                      <button 
                        onClick={() => onDismissLog?.(log.id)}
                        className="flex-1 py-1.5 bg-white/10 text-white rounded text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors"
                      >
                        Dismiss
                      </button>
                   </div>
                </div>
              )) : (
                <div className="p-10 text-center text-slate-500">
                   <ShieldCheck size={32} className="mx-auto text-teal-500 opacity-20 mb-2" />
                   <p className="text-[10px] font-black uppercase tracking-widest">All subjects compliant</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-white/5 border-t border-white/5">
               <button 
                onClick={() => { setActiveTab('Digital Safety'); setIsSafetyOpen(false); }}
                className="w-full py-2 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-teal-400 hover:text-teal-300 transition-colors"
               >
                 Open Safety Console <ChevronRight size={10} />
               </button>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setIsSafetyOpen(!isSafetyOpen)}
          className={`group flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border-2 transition-all active:scale-95 ${
            flaggedLogs.length > 0 
              ? 'bg-red-600 border-red-500 text-white animate-pulse' 
              : 'bg-slate-900 border-slate-800 text-white'
          }`}
        >
          {flaggedLogs.length > 0 ? (
            <AlertTriangle size={20} className="text-amber-300" />
          ) : (
            <ShieldCheck size={20} className="text-teal-400" />
          )}
          <div className="text-left hidden group-hover:block animate-in fade-in slide-in-from-right-2">
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">Safety Monitor</p>
            <p className="text-[8px] font-bold opacity-60 uppercase tracking-tighter mt-1">
              {flaggedLogs.length} Alerts Active
            </p>
          </div>
          {flaggedLogs.length > 0 && (
            <span className="w-5 h-5 bg-white text-red-600 rounded-full flex items-center justify-center text-[10px] font-black">
              {flaggedLogs.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Layout;

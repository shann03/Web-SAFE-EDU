
import React, { useState, useMemo, useEffect } from 'react';
import { Monitor, Search, Shield, Filter, Clock, Activity, HardDrive, Globe, RefreshCcw, Database, CheckCircle2, AlertTriangle, Terminal } from 'lucide-react';
import { SystemLog } from '../types';
import { supabase } from '../services/supabaseClient';

interface SystemLogsProps {
  logs: SystemLog[];
}

const REQUIRED_TABLES = [
  'profiles', 'students', 'incidents', 'incident_types', 
  'interventions', 'device_logs', 'parents', 
  'generated_reports', 'system_audit_logs', 'notifications'
];

const SystemLogs: React.FC<SystemLogsProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tableStatus, setTableStatus] = useState<Record<string, 'online' | 'error'>>({});
  const [isChecking, setIsChecking] = useState(false);
  
  const filteredLogs = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return logs.filter(l => 
      l.user_name?.toLowerCase().includes(q) || 
      l.action?.toLowerCase().includes(q) ||
      l.category?.toLowerCase().includes(q)
    );
  }, [logs, searchTerm]);

  const checkHealth = async () => {
    setIsChecking(true);
    const results: Record<string, 'online' | 'error'> = {};
    for (const table of REQUIRED_TABLES) {
      const { error } = await supabase.from(table).select('id').limit(1);
      results[table] = error ? 'error' : 'online';
    }
    setTableStatus(results);
    setIsChecking(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getCategoryColor = (category: SystemLog['category']) => {
    switch (category) {
      case 'Security': return 'text-red-600 bg-red-50 border-red-100';
      case 'Access': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Registry': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Audit': return 'text-teal-600 bg-teal-50 border-teal-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Audit Log</h2>
          <p className="text-slate-500 font-medium">Real-time oversight of all official registry interactions and security events.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={checkHealth} className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
            <RefreshCcw size={14} className={isChecking ? 'animate-spin' : ''} /> Refresh Infrastructure
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Diagnostic Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Database size={64} />
            </div>
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-6 flex items-center gap-2">
                <Terminal size={12} /> Registry Table Health
              </h4>
              <div className="space-y-3">
                {REQUIRED_TABLES.map(table => (
                  <div key={table} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter">
                    <span className="text-slate-400">{table}</span>
                    {tableStatus[table] === 'online' ? (
                      <span className="text-teal-400 flex items-center gap-1"><CheckCircle2 size={10} /> Online</span>
                    ) : tableStatus[table] === 'error' ? (
                      <span className="text-red-400 flex items-center gap-1"><AlertTriangle size={10} /> Sync Error</span>
                    ) : (
                      <span className="text-slate-600 animate-pulse">Syncing...</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Network Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-600">Latency</span>
                <span className="text-lg font-black text-slate-900">24ms</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full w-[85%]"></div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-600">Uptime</span>
                <span className="text-lg font-black text-slate-900">99.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Log Stream */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="text-slate-900" size={18} />
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Event Stream</h4>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter audit entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin User</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action Details</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Identifier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-all font-medium">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock size={12} />
                          <span className="text-xs">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">{new Date(log.timestamp).toLocaleDateString()}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-900">{log.user_name || 'System'}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{log.ip_address}</p>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-700">{log.action}</td>
                      <td className="px-8 py-5">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getCategoryColor(log.category)}`}>
                          {log.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-mono text-[10px] text-slate-300">
                        {log.id.substring(0, 8)}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No audit logs matched search criteria.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;

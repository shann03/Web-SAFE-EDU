
import React, { useState, useMemo } from 'react';
import { Monitor, Search, Shield, Filter, Clock, Activity, HardDrive, Globe, RefreshCcw } from 'lucide-react';
import { SystemLog } from '../types';

interface SystemLogsProps {
  logs: SystemLog[];
}

const SystemLogs: React.FC<SystemLogsProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredLogs = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return logs.filter(l => 
      l.user_name.toLowerCase().includes(q) || 
      l.action.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q)
    );
  }, [logs, searchTerm]);

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
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
            <RefreshCcw size={14} /> Refresh Feed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Activity size={18} /></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Status</p>
          </div>
          <h4 className="text-xl font-bold text-slate-900">Operational</h4>
          <p className="text-[9px] font-black text-teal-600 uppercase tracking-tighter mt-1">Uptime: 99.98%</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Globe size={18} /></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway</p>
          </div>
          <h4 className="text-xl font-bold text-slate-900">Active</h4>
          <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter mt-1">Latency: 24ms</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-50 text-slate-600 rounded-lg"><HardDrive size={18} /></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Storage</p>
          </div>
          <h4 className="text-xl font-bold text-slate-900">12.4 GB</h4>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">Scale: 15% Utilization</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Shield size={18} /></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth Policy</p>
          </div>
          <h4 className="text-xl font-bold text-slate-900">Enforced</h4>
          <p className="text-[9px] font-black text-amber-600 uppercase tracking-tighter mt-1">MFA Compliance: High</p>
        </div>
      </div>

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
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-all font-medium">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={12} />
                      <span className="text-xs">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 mt-0.5">{new Date(log.timestamp).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-900">{log.user_name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{log.ip_address}</p>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-700">{log.action}</td>
                  <td className="px-8 py-5">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getCategoryColor(log.category)}`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-mono text-[10px] text-slate-300">
                    {log.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;

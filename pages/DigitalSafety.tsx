
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, ShieldAlert, Search, Filter, 
  ArrowRight, Tablet, Calendar, Clock, 
  AlertCircle, CheckCircle, CheckCircle2,
  Trash2, ExternalLink
} from 'lucide-react';
import { DeviceUsageRecord, Student } from '../types';

interface DigitalSafetyProps {
  students: Student[];
  deviceLogs: DeviceUsageRecord[];
  onDismissLog: (id: string) => void;
  onEscalateLog: (log: DeviceUsageRecord) => void;
}

const DigitalSafety: React.FC<DigitalSafetyProps> = ({ students, deviceLogs, onDismissLog, onEscalateLog }) => {
  const [filter, setFilter] = useState<'all' | 'flagged'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = useMemo(() => {
    let result = [...deviceLogs];
    if (filter === 'flagged') result = result.filter(l => l.flagged);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(l => {
        const student = students.find(s => s.id === l.student_id);
        return (
          student?.first_name.toLowerCase().includes(q) ||
          student?.last_name.toLowerCase().includes(q) ||
          l.activity_description.toLowerCase().includes(q) ||
          l.device_id.toLowerCase().includes(q)
        );
      });
    }
    return result.sort((a, b) => new Date(b.usage_start).getTime() - new Date(a.usage_start).getTime());
  }, [deviceLogs, filter, searchTerm, students]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Digital Safety Console</h2>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-100">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Surveillance Active</span>
            </div>
          </div>
          <p className="text-slate-500 font-medium">Real-time monitoring of school-issued device interactions and policy compliance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Filter size={12} className="text-teal-600" /> Control Filters
            </h4>
            <div className="space-y-3">
              <button 
                onClick={() => setFilter('all')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <span>Full Record Feed</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${filter === 'all' ? 'bg-white/20' : 'bg-slate-100'}`}>{deviceLogs.length}</span>
              </button>
              <button 
                onClick={() => setFilter('flagged')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === 'flagged' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-red-50 hover:text-red-600'}`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert size={14} />
                  <span>Flagged Alerts</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${filter === 'flagged' ? 'bg-white/20' : 'bg-red-100 text-red-700'}`}>{deviceLogs.filter(l => l.flagged).length}</span>
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Global Audit Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <Tablet size={64} />
             </div>
             <h4 className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-6">Protocol Status</h4>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest">Network Firewall Level: HIGH</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest">Keyword Filters: ACTIVE (9432)</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest">Curfew Enforcement: STANDBY</span>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identifier & Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity Audit</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.length > 0 ? filteredLogs.map((log) => {
                    const student = students.find(s => s.id === log.student_id);
                    return (
                      <tr key={log.id} className={`hover:bg-slate-50 transition-all group ${log.flagged ? 'bg-red-50/30' : ''}`}>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${log.flagged ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                              <Tablet size={16} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{log.device_id}</p>
                               {log.flagged ? (
                                 <span className="text-[8px] font-black text-red-600 uppercase flex items-center gap-1"><AlertCircle size={8} /> Policy Breach</span>
                               ) : (
                                 <span className="text-[8px] font-black text-teal-600 uppercase flex items-center gap-1"><CheckCircle2 size={8} /> Compliant</span>
                               )}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-sm font-bold text-slate-900 tracking-tight">{student?.first_name} {student?.last_name}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LRN: {student?.lrn}</p>
                        </td>
                        <td className="px-8 py-6 max-w-xs">
                           <p className={`text-xs font-medium leading-relaxed ${log.flagged ? 'text-red-900' : 'text-slate-600'}`}>
                             {log.activity_description}
                           </p>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col gap-0.5">
                             <span className="text-xs font-bold text-slate-800 flex items-center gap-1"><Clock size={10} className="text-teal-600" /> {new Date(log.usage_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1"><Calendar size={10} /> {new Date(log.usage_start).toLocaleDateString()}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {log.flagged ? (
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => onEscalateLog(log)}
                                className="px-3 py-1.5 bg-red-600 text-white rounded text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-sm flex items-center gap-1"
                              >
                                Escalate
                              </button>
                              <button 
                                onClick={() => onDismissLog(log.id)}
                                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded transition-all"
                                title="Dismiss Alert"
                              >
                                <CheckCircle size={16} />
                              </button>
                            </div>
                          ) : (
                            <button className="text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-1 ml-auto">
                              Details <ExternalLink size={10} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-slate-400">
                        <Tablet size={32} className="mx-auto opacity-10 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No surveillance matches found</p>
                      </td>
                    </tr>
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

export default DigitalSafety;

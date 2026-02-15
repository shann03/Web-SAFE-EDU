
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { AlertTriangle, UserCheck, TrendingUp, ShieldAlert, CheckCircle2, Tablet, Activity, Zap } from 'lucide-react';
import { Incident, Student, DeviceUsageRecord } from '../types';

interface DashboardProps {
  incidents: Incident[];
  students: Student[];
  deviceLogs: DeviceUsageRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ incidents, students, deviceLogs }) => {
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
  const resolutionRate = Math.round((incidents.filter(i => i.status === 'Resolved').length / (incidents.length || 1)) * 100);
  const flaggedLogs = deviceLogs.filter(l => l.flagged);

  const stats = [
    { label: 'Active Incidents', value: activeIncidents.toString(), icon: <AlertTriangle className="text-amber-600" />, trend: 'Pending Review', color: 'bg-amber-50 border-amber-200' },
    { label: 'Verified Subjects', value: students.length.toString(), icon: <UserCheck className="text-slate-600" />, trend: 'Validated Records', color: 'bg-slate-50 border-slate-200' },
    { label: 'Safety Index', value: `${100 - (flaggedLogs.length * 2)}%`, icon: <CheckCircle2 className="text-teal-600" />, trend: 'Registry Compliance', color: 'bg-teal-50 border-teal-200' },
    { label: 'Digital Policy', value: flaggedLogs.length.toString(), icon: <Tablet className="text-blue-600" />, trend: 'Flagged Activity', color: 'bg-blue-50 border-blue-200' },
  ];

  const chartData = [
    { name: 'Aug', incidents: 4 },
    { name: 'Sep', incidents: 15 },
    { name: 'Oct', incidents: 22 },
    { name: 'Nov', incidents: incidents.length || 12 },
    { name: 'Dec', incidents: 8 },
  ];

  const typeData = [
    { name: 'Bullying', value: incidents.filter(i => i.incident_type_id === 'it1').length || 1 },
    { name: 'Dishonesty', value: incidents.filter(i => i.incident_type_id === 'it2').length || 1 },
    { name: 'Property', value: 15 },
    { name: 'Digital', value: flaggedLogs.length || 5 },
  ];

  const COLORS = ['#0f172a', '#0d9488', '#d97706', '#475569'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Assistance Dashboard</h2>
        <p className="text-slate-500 font-medium">Official status overview for Student Assistance and Digital Safety enforcement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-xl border ${stat.color} shadow-sm flex items-start justify-between bg-white cursor-pointer hover:shadow-md transition-all active:scale-[0.98]`}>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase">{stat.trend}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-inherit shadow-inner">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <Activity size={12} className="text-teal-600 animate-pulse" />
          </div>
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Monthly Assistance Trend</h4>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="incidents" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-10">Registry Distribution</h4>
          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">{incidents.length + flaggedLogs.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reports</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-10">
            {typeData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden text-white border border-slate-800">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-400" size={16} />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Digital Safety Monitor</h4>
            </div>
            <span className="text-[9px] font-black bg-amber-500 text-slate-900 px-2 py-0.5 rounded">High Priority</span>
          </div>
          <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {flaggedLogs.length > 0 ? flaggedLogs.map(log => (
              <div key={log.id} className="p-4 bg-white/5 rounded-lg border border-white/10 flex gap-4 hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
                  <Tablet size={18} />
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-white tracking-tight">Student ID: {log.student_id}</p>
                    <span className="text-[9px] font-bold text-slate-400">{new Date(log.usage_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 italic">"{log.activity_description}"</p>
                  <div className="mt-3 flex gap-2">
                    <button className="text-[9px] font-black uppercase px-2 py-1 bg-red-600 rounded">Escalate</button>
                    <button className="text-[9px] font-black uppercase px-2 py-1 bg-white/10 rounded">Dismiss</button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center">
                <ShieldAlert size={32} className="mx-auto text-teal-500/20 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No active policy violations</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Official Record Feed</h4>
            <button className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:text-teal-800 transition-colors">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Date</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incidents.slice(0, 5).map((inc) => {
                  const student = students.find(s => s.id === inc.student_id);
                  return (
                    <tr key={inc.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-black text-[10px]">
                            {student?.first_name[0]}{student?.last_name[0]}
                          </div>
                          <span className="text-xs font-bold text-slate-900 tracking-tight">{student?.first_name} {student?.last_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[11px] font-bold text-slate-400">{new Date(inc.date_reported).toLocaleDateString('en-PH')}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                          inc.status === 'Resolved' ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {inc.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

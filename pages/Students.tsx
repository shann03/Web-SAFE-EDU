
import React, { useState, useMemo } from 'react';
import { Search, Plus, MapPin, BrainCircuit, Users, ShieldAlert, Lock, X, Phone, Mail, Tablet } from 'lucide-react';
import { getBehavioralInsight } from '../services/geminiService';
import { User, Student, Incident, ParentGuardian, DeviceUsageRecord } from '../types';

interface StudentsProps {
  currentUser: User;
  students: Student[];
  incidents: Incident[];
  parents: ParentGuardian[];
  deviceLogs: DeviceUsageRecord[];
  searchQuery: string;
}

const Students: React.FC<StudentsProps> = ({ currentUser, students, incidents, parents, deviceLogs, searchQuery }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return students.filter(s => 
      s.first_name.toLowerCase().includes(q) || 
      s.last_name.toLowerCase().includes(q) || 
      s.lrn.includes(q)
    );
  }, [students, searchQuery]);

  const selectedStudent = useMemo(() => 
    students.find(s => s.id === selectedStudentId), 
    [students, selectedStudentId]
  );

  const studentParent = useMemo(() => 
    parents.find(p => p.id === `p${selectedStudentId}`),
    [parents, selectedStudentId]
  );

  const studentLogs = useMemo(() => 
    deviceLogs.filter(l => l.student_id === selectedStudentId),
    [deviceLogs, selectedStudentId]
  );

  const isTeacher = currentUser.role === 'Teacher';
  const canAccessSensitiveData = currentUser.role !== 'Teacher';

  const handleAnalyze = async (studentId: string) => {
    setIsAnalyzing(true);
    const history = incidents.filter(inc => inc.student_id === studentId);
    const result = await getBehavioralInsight(history);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Student List */}
      <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl flex flex-col h-[calc(100vh-10rem)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 space-y-4 bg-slate-50/50">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Official Registry</h3>
            {!isTeacher && (
              <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                <Plus size={14} />
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Filter Subject Registry..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-teal-500 outline-none"
              onChange={(e) => {}} // Search handled by Layout -> App state
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredStudents.map(student => (
            <button
              key={student.id}
              onClick={() => {
                setSelectedStudentId(student.id);
                setAiAnalysis(null);
              }}
              className={`w-full p-5 flex items-center gap-4 hover:bg-slate-50 transition-all text-left group ${
                selectedStudentId === student.id ? 'bg-teal-50/50 border-l-4 border-teal-600' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-sm group-hover:scale-110 transition-transform">
                {student.first_name[0]}{student.last_name[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-900 tracking-tight">{student.first_name} {student.last_name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LRN: {student.lrn}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Detail */}
      <div className="lg:col-span-2 space-y-6">
        {selectedStudent ? (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white">
                    {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Grade {selectedStudent.grade_level} • Section {selectedStudent.section}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-teal-600" /> {selectedStudent.address}</span>
                    </div>
                  </div>
                </div>
                {!isTeacher && (
                  <button 
                    onClick={() => handleAnalyze(selectedStudent.id)}
                    disabled={isAnalyzing}
                    className="px-4 py-2 bg-teal-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-teal-800 flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-teal-100 transition-all active:scale-95"
                  >
                    <BrainCircuit size={16} />
                    {isAnalyzing ? 'Processing...' : 'Welfare AI'}
                  </button>
                )}
              </div>

              {aiAnalysis && (
                <div className="mb-8 p-6 bg-teal-900 text-white rounded-xl shadow-xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><BrainCircuit size={80} /></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="text-teal-400" size={18} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Confidential Welfare Insight</h4>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/10 ${aiAnalysis.riskLevel === 'High' ? 'text-red-300' : 'text-teal-300'}`}>
                        Risk: {aiAnalysis.riskLevel}
                      </span>
                    </div>
                    <p className="text-sm text-teal-50 leading-relaxed font-medium mb-4">{aiAnalysis.analysis}</p>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Recommended Procedures:</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {aiAnalysis.suggestedInterventions.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-xs font-bold text-teal-100 bg-white/5 p-2 rounded border border-white/5">
                            <div className="w-1 h-1 rounded-full bg-teal-400"></div>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button onClick={() => setAiAnalysis(null)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"><X size={16} /></button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Parent/Guardian Info</h4>
                  {studentParent ? (
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm font-bold text-slate-800">{studentParent.first_name} {studentParent.last_name}</p>
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-500 font-bold flex items-center gap-2 uppercase tracking-tighter"><Phone size={12} className="text-teal-600" /> {studentParent.contact_number}</p>
                        <p className="text-[10px] text-slate-500 font-bold flex items-center gap-2 uppercase tracking-tighter"><Mail size={12} className="text-teal-600" /> {studentParent.email}</p>
                      </div>
                    </div>
                  ) : <p className="text-xs italic text-slate-400">No guardian record linked.</p>}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Digital Safety Monitoring</h4>
                  <div className="space-y-2">
                    {studentLogs.length > 0 ? studentLogs.slice(0, 3).map(log => (
                      <div key={log.id} className={`p-3 rounded-lg border flex items-center gap-3 ${log.flagged ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                        <Tablet size={14} className={log.flagged ? 'text-red-500' : 'text-slate-400'} />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[10px] font-bold text-slate-800 truncate">{log.activity_description}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-black">{new Date(log.usage_start).toLocaleDateString()}</p>
                        </div>
                        {log.flagged && <ShieldAlert size={14} className="text-red-500 animate-pulse" />}
                      </div>
                    )) : <p className="text-xs italic text-slate-400">No recent device activity.</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-6">
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2 text-slate-800">
                  <ShieldAlert size={18} className="text-teal-600" />
                  <h4 className="text-xs font-black uppercase tracking-widest">Disciplinary Registry</h4>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Type</th>
                      <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Date</th>
                      <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {incidents.filter(i => i.student_id === selectedStudentId).map(inc => (
                      <tr key={inc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-700 tracking-tight">Record Ref: {inc.id}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[200px]">{inc.description}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-500">{new Date(inc.date_reported).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-widest border ${inc.status === 'Resolved' ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                            {inc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-white/50">
            <Users size={64} className="mb-4 opacity-5" />
            <p className="text-[10px] font-black uppercase tracking-widest">Select Subject for Verification</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;

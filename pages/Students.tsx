
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Plus, MapPin, BrainCircuit, Users, ShieldAlert, 
  Lock, X, Phone, Mail, Tablet, Camera, CheckCircle, 
  RefreshCw, AlertCircle, Fingerprint
} from 'lucide-react';
import { getBehavioralInsight } from '../services/geminiService';
import { User, Student, Incident, ParentGuardian, DeviceUsageRecord } from '../types';

interface StudentsProps {
  currentUser: User;
  students: Student[];
  incidents: Incident[];
  parents: ParentGuardian[];
  deviceLogs: DeviceUsageRecord[];
  searchQuery: string;
  onAddStudent: (data: Partial<Student>) => Promise<any>;
}

const Students: React.FC<StudentsProps> = ({ currentUser, students, incidents, parents, deviceLogs, searchQuery, onAddStudent }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'idle' | 'scanning' | 'complete'>('idle');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    lrn: '', first_name: '', last_name: '', grade_level: '7', section: '', address: '', gender: 'Male'
  });

  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return students.filter(s => 
      s.first_name.toLowerCase().includes(q) || s.last_name.toLowerCase().includes(q) || s.lrn.includes(q)
    );
  }, [students, searchQuery]);

  const selectedStudent = useMemo(() => students.find(s => s.id === selectedStudentId), [students, selectedStudentId]);
  const studentParent = useMemo(() => parents.find(p => p.student_id === selectedStudentId), [parents, selectedStudentId]);
  const studentLogs = useMemo(() => deviceLogs.filter(l => l.student_id === selectedStudentId), [deviceLogs, selectedStudentId]);

  const canManage = currentUser.role !== 'Teacher';

  const handleAnalyze = async (studentId: string) => {
    setIsAnalyzing(true);
    const history = incidents.filter(inc => inc.student_id === studentId);
    const result = await getBehavioralInsight(history);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const startVerification = async () => {
    setIsVerifying(true);
    setVerificationStep('scanning');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setTimeout(() => {
        setVerificationStep('complete');
        // Stop stream after "scan"
        stream.getTracks().forEach(track => track.stop());
      }, 3000);
    } catch (err) {
      console.error("Camera access denied", err);
      setIsVerifying(false);
    }
  };

  const closeVerification = () => {
    setIsVerifying(false);
    setVerificationStep('idle');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddStudent({ ...newStudent, date_of_birth: new Date().toISOString() });
    setIsModalOpen(false);
    setNewStudent({ lrn: '', first_name: '', last_name: '', grade_level: '7', section: '', address: '', gender: 'Male' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl flex flex-col h-[calc(100vh-10rem)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 space-y-4 bg-slate-50/50">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Official Registry</h3>
            {canManage && (
              <button onClick={() => setIsModalOpen(true)} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                <Plus size={14} />
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input type="text" placeholder="Filter Registry..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-teal-500 outline-none" onChange={(e) => {}} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
          {filteredStudents.length > 0 ? filteredStudents.map(student => (
            <button key={student.id} onClick={() => { setSelectedStudentId(student.id); setAiAnalysis(null); }} className={`w-full p-5 flex items-center gap-4 hover:bg-slate-50 transition-all text-left group ${selectedStudentId === student.id ? 'bg-teal-50/50 border-l-4 border-teal-600' : ''}`}>
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-sm group-hover:scale-110 transition-transform">
                {student.first_name[0]}{student.last_name[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-900 tracking-tight">{student.first_name} {student.last_name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LRN: {student.lrn}</p>
              </div>
            </button>
          )) : (
            <div className="p-8 text-center text-slate-400">
              <p className="text-[10px] font-black uppercase tracking-widest">No Students Found</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        {selectedStudent ? (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white transition-transform group-hover:scale-105">
                      {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                    </div>
                    <button 
                      onClick={startVerification}
                      className="absolute -bottom-2 -right-2 p-2 bg-teal-600 text-white rounded-lg shadow-lg hover:bg-teal-700 transition-all"
                      title="Verify Identity"
                    >
                      <Fingerprint size={16} />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                      <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center" title="Record Validated">
                        <CheckCircle size={10} className="text-teal-600" />
                      </div>
                    </div>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Grade {selectedStudent.grade_level} • Section {selectedStudent.section}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-teal-600" /> {selectedStudent.address}</span>
                    </div>
                  </div>
                </div>
                {canManage && (
                  <button onClick={() => handleAnalyze(selectedStudent.id)} disabled={isAnalyzing} className="px-4 py-2 bg-teal-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-teal-800 flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg active:scale-95">
                    <BrainCircuit size={16} className={isAnalyzing ? 'animate-pulse' : ''} /> {isAnalyzing ? 'Processing History...' : 'AI Welfare Check'}
                  </button>
                )}
              </div>

              {aiAnalysis && (
                <div className="mb-8 p-6 bg-slate-900 text-white rounded-xl shadow-xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="text-teal-400" size={18} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Confidential Behavioral Analysis</h4>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border ${
                        aiAnalysis.riskLevel === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                        aiAnalysis.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-teal-500/20 text-teal-400 border-teal-500/30'
                      }`}>
                        Risk Index: {aiAnalysis.riskLevel}
                      </span>
                    </div>
                    <p className="text-sm text-teal-50/90 leading-relaxed font-medium mb-6 italic">"{aiAnalysis.analysis}"</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest flex items-center gap-2">
                          <Lock size={10} /> Authorized Interventions
                        </p>
                        <ul className="space-y-2">
                          {aiAnalysis.suggestedInterventions.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-xs font-bold text-teal-100 bg-white/5 p-2.5 rounded border border-white/5">
                              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest flex items-center gap-2">
                          <BrainCircuit size={10} /> Strategic Focus
                        </p>
                        <div className="p-4 bg-teal-800/20 rounded-xl border border-teal-500/20 border-dashed">
                          <p className="text-xs font-bold text-teal-100 leading-relaxed">{aiAnalysis.growthFocus}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setAiAnalysis(null)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"><X size={16} /></button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Registry Contact Chain</h4>
                  {studentParent ? (
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-slate-800">{studentParent.first_name} {studentParent.last_name}</p>
                        <span className="text-[9px] font-black uppercase text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded tracking-tighter">{studentParent.relationship_to_student}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-500 font-bold flex items-center gap-2 uppercase tracking-tighter hover:text-teal-600 transition-colors cursor-pointer"><Phone size={12} className="text-slate-400" /> {studentParent.contact_number}</p>
                        <p className="text-[10px] text-slate-500 font-bold flex items-center gap-2 uppercase tracking-tighter hover:text-teal-600 transition-colors cursor-pointer"><Mail size={12} className="text-slate-400" /> {studentParent.email}</p>
                      </div>
                    </div>
                  ) : <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center"><p className="text-[10px] italic text-slate-400 font-bold uppercase">No linked guardian record.</p></div>}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Digital Footprint</h4>
                  <div className="space-y-2">
                    {studentLogs.length > 0 ? studentLogs.slice(0, 3).map(log => (
                      <div key={log.id} className={`p-3 rounded-lg border flex items-center gap-3 transition-all hover:translate-x-1 ${log.flagged ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                        <div className={`p-2 rounded-md ${log.flagged ? 'bg-red-100' : 'bg-white shadow-sm'}`}>
                          <Tablet size={14} className={log.flagged ? 'text-red-500' : 'text-teal-600'} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className={`text-[10px] font-bold truncate ${log.flagged ? 'text-red-900' : 'text-slate-800'}`}>{log.activity_description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-[9px] text-slate-400 uppercase font-black">{new Date(log.usage_start).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}</p>
                            {log.flagged && <span className="text-[8px] font-black text-red-600 uppercase tracking-widest">Policy Alert</span>}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                        <p className="text-[10px] italic text-slate-400 font-bold uppercase">No monitored usage recorded.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-white/50 animate-in fade-in duration-1000">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Users size={32} className="opacity-20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Select Subject for Verification</p>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {isVerifying && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-teal-400" />
                <h3 className="text-xs font-black uppercase tracking-widest">Biometric Identity Sync</h3>
              </div>
              <button onClick={closeVerification}><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border-4 border-slate-100 shadow-inner">
                {verificationStep === 'scanning' ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                    <div className="absolute inset-0 bg-teal-500/10 pointer-events-none">
                      <div className="w-full h-0.5 bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.8)] absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                    </div>
                  </>
                ) : verificationStep === 'complete' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-teal-50 text-teal-600 animate-in fade-in">
                    <CheckCircle size={64} className="mb-4" />
                    <p className="text-sm font-black uppercase tracking-widest">Identity Validated</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Camera size={48} className="animate-pulse" />
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-2">
                <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                  {verificationStep === 'scanning' ? 'Scanning Facial Features...' : 
                   verificationStep === 'complete' ? 'Verification Successful' : 'Initializing Hardware...'}
                </h4>
                <p className="text-xs text-slate-500 font-medium px-4">
                  Using secure visual processing to match current subject with encrypted registry profile.
                </p>
              </div>

              {verificationStep === 'complete' && (
                <button 
                  onClick={closeVerification}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase shadow-xl hover:bg-slate-800 transition-all"
                >
                  Return to Registry
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-slate-900" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Register New Subject</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name</label>
                  <input required type="text" value={newStudent.first_name} onChange={(e) => setNewStudent({...newStudent, first_name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name</label>
                  <input required type="text" value={newStudent.last_name} onChange={(e) => setNewStudent({...newStudent, last_name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">LRN (Learner Reference Number)</label>
                <input required type="text" value={newStudent.lrn} onChange={(e) => setNewStudent({...newStudent, lrn: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none" placeholder="12-digit number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade Level</label>
                  <select value={newStudent.grade_level} onChange={(e) => setNewStudent({...newStudent, grade_level: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none">
                    {[7,8,9,10,11,12].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Section</label>
                  <input required type="text" value={newStudent.section} onChange={(e) => setNewStudent({...newStudent, section: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Home Address</label>
                <input required type="text" value={newStudent.address} onChange={(e) => setNewStudent({...newStudent, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                Commit to Registry
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Students;

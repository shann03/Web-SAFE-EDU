
import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, Clock, BrainCircuit, Plus, X, 
  MessageSquare, History, CheckCircle2, AlertCircle, 
  FileText, TrendingUp, Download, Link, Paperclip,
  Activity, ArrowRight, UserCheck
} from 'lucide-react';
import { User as UserType, Student, BehavioralIntervention, InterventionMilestone, Incident } from '../types';
import { MOCK_INCIDENTS } from '../constants';

interface InterventionsProps {
  currentUser: UserType;
  students: Student[];
  interventions: BehavioralIntervention[];
  onAddIntervention: (data: Partial<BehavioralIntervention>) => void;
}

const Interventions: React.FC<InterventionsProps> = ({ currentUser, students, interventions, onAddIntervention }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<BehavioralIntervention | null>(null);
  const [formData, setFormData] = useState({ student_id: '', intervention_type: 'Counseling Session', description: '' });

  const isCounselor = currentUser.role === 'Counselor';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddIntervention({ ...formData });
    setIsModalOpen(false);
    setFormData({ student_id: '', intervention_type: 'Counseling Session', description: '' });
  };

  const handleOpenHistory = (int: BehavioralIntervention) => {
    setSelectedIntervention(int);
    setIsHistoryOpen(true);
  };

  const selectedStudent = useMemo(() => 
    students.find(s => s.id === selectedIntervention?.student_id)
  , [students, selectedIntervention]);

  const relatedIncidents = useMemo(() => {
    if (!selectedIntervention?.related_incident_ids) return [];
    return MOCK_INCIDENTS.filter(inc => selectedIntervention.related_incident_ids?.includes(inc.id));
  }, [selectedIntervention]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welfare Interventions</h2>
          <p className="text-slate-500 font-medium">Coordinate behavioral growth plans and confidential records.</p>
        </div>
        {isCounselor && (
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-teal-700 text-white px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-teal-800 transition-all shadow-lg active:scale-95">
            <Plus size={16} /> Initialize Intervention
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="relative border-l-2 border-slate-200 ml-4 pl-10 space-y-8">
            {interventions.length > 0 ? interventions.map((prog) => {
              const student = students.find(s => s.id === prog.student_id);
              const isCompleted = prog.status === 'Completed';
              return (
                <div key={prog.id} className="relative group">
                  <div className={`absolute -left-[51px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-md transition-all group-hover:scale-125 ${isCompleted ? 'bg-teal-600' : 'bg-amber-500'}`}></div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                          isCompleted ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {prog.intervention_type}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock size={10} /> Started {new Date(prog.start_date).toLocaleDateString()}
                        </span>
                      </div>
                      <h5 className="text-lg font-bold text-slate-900 tracking-tight">{prog.description}</h5>
                      <p className="text-sm font-medium text-slate-500 mt-1">Subject: <span className="text-slate-900 font-bold">{student?.first_name} {student?.last_name}</span></p>
                    </div>
                    <button 
                      onClick={() => handleOpenHistory(prog)}
                      className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-sm hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                      <History size={14} /> View Case History
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div className="p-12 text-center text-slate-400">
                <p className="text-[10px] font-black uppercase tracking-widest">No active interventions on record.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-inner">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={12} className="text-teal-600" /> Registry Pulse
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">Active Dossiers</span>
                <span className="text-lg font-black text-slate-900">{interventions.filter(i => i.status === 'Active').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">Compliance Rate</span>
                <span className="text-lg font-black text-teal-600">92.4%</span>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.15em] leading-relaxed">
                  Historical trails are locked 7 days post-entry for audit integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case History Dossier Modal */}
      {isHistoryOpen && selectedIntervention && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 h-[85vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-teal-400" />
                <h3 className="text-xs font-black uppercase tracking-widest tracking-[0.2em]">Intervention Dossier: #{selectedIntervention.id.toString().substring(0, 8).toUpperCase()}</h3>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="hover:text-teal-400 transition-colors p-1"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <div className="flex flex-col md:flex-row items-start justify-between gap-6 border-b border-slate-100 pb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{selectedStudent?.first_name} {selectedStudent?.last_name}</h2>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 px-2 py-0.5 rounded">LRN: {selectedStudent?.lrn}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-100">{selectedIntervention.intervention_type}</span>
                  </div>
                </div>
                <div className="md:text-right space-y-2">
                  <div className="flex items-center gap-2 justify-end">
                    <TrendingUp size={18} className="text-teal-600" />
                    <span className="text-sm font-black uppercase text-teal-600">Trajectory: Improving</span>
                  </div>
                  <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden ml-auto">
                    <div className="bg-teal-500 h-full w-[75%]"></div>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Assistance Confidence: High (AI Audited)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} className="text-teal-600" /> Official Execution Trail
                    </h4>
                    
                    <div className="relative border-l-2 border-slate-100 ml-2 space-y-8 pl-8 pb-4">
                      {selectedIntervention.history?.map((milestone) => (
                        <div key={milestone.id} className="relative group">
                          <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-300 group-hover:border-teal-500 transition-colors"></div>
                          <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-xl hover:bg-white hover:border-teal-200 hover:shadow-sm transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-800">{milestone.title}</h5>
                              <span className="text-[9px] font-bold text-slate-400">{new Date(milestone.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4 italic">"{milestone.notes}"</p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                              <div className="flex items-center gap-1.5 text-[9px] font-black text-teal-600 uppercase tracking-tight">
                                <CheckCircle2 size={10} /> Outcome: {milestone.outcome}
                              </div>
                              <span className="text-[8px] font-black text-slate-400 uppercase">OFFICER: {milestone.recorded_by}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="relative">
                        <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-white"></div>
                        <div className="p-5 bg-slate-900 text-white rounded-xl shadow-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-teal-400 flex items-center gap-1">
                              <UserCheck size={10} /> Case Protocol Initialized
                            </span>
                            <span className="text-[9px] font-bold opacity-40">{new Date(selectedIntervention.start_date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[11px] font-medium leading-relaxed opacity-80">Initial dossier creation for {selectedStudent?.first_name} following assistance triggers.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5">
                      <BrainCircuit size={48} />
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Core Strategy</h4>
                    <p className="text-sm font-bold text-slate-800 leading-relaxed italic">"{selectedIntervention.description}"</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Link size={12} className="text-amber-500" /> Triggering Incidents
                    </h4>
                    <div className="space-y-2">
                      {relatedIncidents.length > 0 ? relatedIncidents.map(inc => (
                        <div key={inc.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-3 group hover:border-amber-200 transition-all cursor-pointer">
                          <div className="w-8 h-8 rounded bg-amber-50 flex items-center justify-center text-amber-600">
                            <AlertCircle size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-slate-900 uppercase truncate">#{inc.id.toString().substring(0, 8).toUpperCase()}</p>
                            <p className="text-[9px] text-slate-500 font-bold">{new Date(inc.date_occurred).toLocaleDateString()}</p>
                          </div>
                          <ArrowRight size={12} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                        </div>
                      )) : (
                        <p className="text-[10px] text-slate-400 italic font-medium">No direct incident linkage available.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Paperclip size={12} className="text-teal-600" /> Official Attachments
                    </h4>
                    <div className="space-y-2">
                      {selectedIntervention.attachments?.map(att => (
                        <div key={att.id} className="p-3 bg-teal-50/30 border border-teal-100 rounded-lg flex items-center gap-3 hover:bg-teal-50 transition-all cursor-pointer group">
                          <div className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center text-teal-600 border border-teal-50">
                            <FileText size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-slate-800 truncate uppercase tracking-tighter">{att.name}</p>
                            <p className="text-[9px] text-teal-600/60 font-black">{att.size} • {att.type}</p>
                          </div>
                          <Download size={14} className="text-slate-300 group-hover:text-teal-600 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4 shrink-0">
              <button className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
                <FileText size={16} /> Generate Welfare Summary
              </button>
              {isCounselor && (
                <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <MessageSquare size={16} /> Initiate Parent Sync
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-teal-600" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Registry Case Initiation</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Student</label>
                <select required value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none font-bold uppercase tracking-tighter">
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.last_name}, {s.first_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Intervention Type</label>
                <select value={formData.intervention_type} onChange={(e) => setFormData({...formData, intervention_type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-widest">
                  <option value="Counseling Session">Counseling Session</option>
                  <option value="Behavioral Protocol">Behavioral Protocol</option>
                  <option value="Guardian Engagement">Guardian Engagement</option>
                  <option value="Digital Safety Audit">Digital Safety Audit</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Case Strategy Overview</label>
                <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm min-h-[100px] outline-none font-medium" placeholder="Describe the professional strategy and target outcomes..." />
              </div>
              <button type="submit" className="w-full bg-teal-700 text-white py-4 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-teal-800 transition-all shadow-xl active:scale-95">
                Commit Strategy to Registry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interventions;

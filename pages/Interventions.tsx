
import React, { useState } from 'react';
import { ShieldAlert, Clock, BrainCircuit, Plus, X, MessageSquare, History, User } from 'lucide-react';
import { User as UserType, Student, BehavioralIntervention } from '../types';

interface InterventionsProps {
  currentUser: UserType;
  students: Student[];
  interventions: BehavioralIntervention[];
  onAddIntervention: (data: Partial<BehavioralIntervention>) => void;
}

const Interventions: React.FC<InterventionsProps> = ({ currentUser, students, interventions, onAddIntervention }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ student_id: '', intervention_type: 'Counseling Session', description: '' });

  const isCounselor = currentUser.role === 'Counselor';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddIntervention({ ...formData, start_date: new Date().toISOString(), status: 'Active' });
    setIsModalOpen(false);
    setFormData({ student_id: '', intervention_type: 'Counseling Session', description: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welfare Interventions</h2>
          <p className="text-slate-500 font-medium">Coordinate behavioral growth plans and confidential records.</p>
        </div>
        {isCounselor && (
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-teal-700 text-white px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-teal-800 transition-all shadow-lg">
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
                <div key={prog.id} className="relative">
                  <div className={`absolute -left-[51px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-md ${isCompleted ? 'bg-teal-600' : 'bg-amber-500'}`}></div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${isCompleted ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>
                            {prog.intervention_type}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">{new Date(prog.start_date).toLocaleDateString()}</span>
                        </div>
                        <h5 className="text-lg font-bold text-slate-900 tracking-tight">{prog.description}</h5>
                        <p className="text-sm font-medium text-slate-500 mt-1">Subject: <span className="text-slate-900 font-bold">{student?.first_name} {student?.last_name}</span></p>
                      </div>
                      <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-sm hover:bg-slate-800 transition-all">Full History</button>
                    </div>
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">New Intervention Record</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student</label>
                <select required value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none">
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.last_name}, {s.first_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</label>
                <select value={formData.intervention_type} onChange={(e) => setFormData({...formData, intervention_type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm">
                  <option value="Counseling Session">Counseling Session</option>
                  <option value="Growth Plan">Growth Plan</option>
                  <option value="Parent Meeting">Parent Meeting</option>
                  <option value="Digital Safety Seminar">Digital Safety Seminar</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</label>
                <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm min-h-[100px]" placeholder="Brief strategy overview..." />
              </div>
              <button type="submit" className="w-full bg-teal-700 text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-teal-800 transition-all">Launch Intervention</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interventions;

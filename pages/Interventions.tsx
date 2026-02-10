
import React from 'react';
import { ShieldAlert, Clock, BrainCircuit, UserCheck, Plus, Lock, MessageSquare, ShieldCheck, History } from 'lucide-react';
import { User, Incident, Student, BehavioralIntervention } from '../types';

interface InterventionsProps {
  currentUser: User;
  incidents: Incident[];
  students: Student[];
  interventions: BehavioralIntervention[];
}

const Interventions: React.FC<InterventionsProps> = ({ currentUser, incidents, students, interventions }) => {
  const isCounselor = currentUser.role === 'Counselor';
  const isAdmin = currentUser.role === 'Administrator';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welfare Interventions</h2>
          <p className="text-slate-500 font-medium">Coordinate behavioral growth plans and strictly confidential counseling records.</p>
        </div>
        {isCounselor && (
          <button className="flex items-center gap-2 bg-teal-700 text-white px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-teal-800 transition-all shadow-lg shadow-teal-100">
            <Plus size={16} />
            Initialize Intervention
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center gap-2 text-slate-800 mb-2">
            <History size={18} className="text-teal-600" />
            <h4 className="text-sm font-black uppercase tracking-widest">Active Welfare Roadmap</h4>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 pl-10 space-y-8">
            {interventions.slice(0, 5).map((prog, i) => {
              const student = students.find(s => s.id === prog.student_id);
              const isCompleted = prog.status === 'Completed';
              return (
                <div key={prog.id} className="relative">
                  <div className={`absolute -left-[51px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-md ${isCompleted ? 'bg-teal-600' : 'bg-amber-500'}`}></div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
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
                      <div className="flex items-center gap-3">
                        {isCounselor && <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-teal-600 transition-colors"><MessageSquare size={14} /> Note</button>}
                        <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-sm hover:bg-slate-800 transition-all">Records</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-teal-900 text-white p-8 rounded-xl shadow-xl flex items-center justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4"><BrainCircuit size={120} /></div>
            <div className="relative z-10 max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <BrainCircuit className="text-teal-400" size={24} />
                <h4 className="text-xl font-bold">Welfare Analysis Assistant</h4>
              </div>
              <p className="text-teal-100 text-sm leading-relaxed font-medium mb-6">Use AI-driven insights to analyze behavioral trends across incident histories. Ensure data protection standards are maintained before launching.</p>
              {isCounselor ? (
                <button className="bg-white text-teal-900 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-teal-50 transition-all">Generate Assistance Roadmap</button>
              ) : (
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-400 px-3 py-1.5 bg-teal-950/50 rounded-lg border border-teal-800"><Lock size={12} /> Counselor Authorization Required</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-t-4 border-teal-600">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="text-teal-600" size={18} />
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Confidential Agenda</h4>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-teal-200 transition-all cursor-pointer">
                <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Today, 14:00</p>
                <p className="text-sm font-bold text-slate-800 mt-1">Review: {students[0].first_name} {students[0].last_name}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">Case Reference: B-2023-01</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-teal-200 transition-all cursor-pointer">
                <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Tomorrow, 09:30</p>
                <p className="text-sm font-bold text-slate-800 mt-1">Parent Conf: {students[1].first_name} {students[1].last_name}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">Legal Oversight Req.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interventions;

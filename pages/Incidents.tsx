
import React, { useMemo, useState, useRef } from 'react';
import { AlertTriangle, Plus, Eye, X, ShieldCheck, Mic, MicOff, Loader2, BrainCircuit, Shield } from 'lucide-react';
import { User, Incident, Student, IncidentType } from '../types';
import { GoogleGenAI } from "@google/genai";

interface IncidentsProps {
  currentUser: User;
  incidents: Incident[];
  students: Student[];
  incidentTypes: IncidentType[];
  onAddIncident: (inc: Partial<Incident>) => void;
  onUpdateStatus: (id: string, status: Incident['status']) => void;
  searchQuery: string;
}

const Incidents: React.FC<IncidentsProps> = ({ currentUser, incidents, students, incidentTypes, onAddIncident, onUpdateStatus, searchQuery }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [newIncident, setNewIncident] = useState({ 
    student_id: currentUser.role === 'Parent' ? students[0]?.id : '', 
    incident_type_id: '', 
    location: '', 
    description: '', 
    immediate_action: '',
    date_occurred: new Date().toISOString().split('T')[0],
    is_anonymous: false
  });
  
  const recognitionRef = useRef<any>(null);

  const visibleIncidents = useMemo(() => {
    let filtered = [...incidents];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(inc => {
        const s = students.find(st => st.id === inc.student_id);
        return (
          s?.first_name.toLowerCase().includes(q) || 
          inc.description.toLowerCase().includes(q)
        );
      });
    }
    return filtered;
  }, [incidents, searchQuery, students]);

  const toggleDictation = () => {
    if (isDictating) {
      recognitionRef.current?.stop();
      setIsDictating(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setNewIncident(prev => ({ ...prev, description: prev.description + transcript }));
      };
      recognitionRef.current.start();
      setIsDictating(true);
    }
  };

  const handleAiRefinement = async () => {
    if (!newIncident.description) return;
    setIsProcessingAI(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Rewrite this behavioral observation into a professional, objective incident report: "${newIncident.description}"`
      });
      if (response.text) setNewIncident(prev => ({ ...prev, description: response.text }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddIncident(newIncident);
    setIsModalOpen(false);
    setNewIncident({ 
      student_id: currentUser.role === 'Parent' ? students[0]?.id : '', 
      incident_type_id: '', 
      location: '', 
      description: '', 
      immediate_action: '',
      date_occurred: new Date().toISOString().split('T')[0],
      is_anonymous: false
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {currentUser.role === 'Parent' ? 'Welfare History' : 'Assistance Records'}
          </h2>
          <p className="text-slate-500 font-medium">
            {currentUser.role === 'Parent' ? 'Tracking events and safety updates for your child.' : 'Official registry for behavioral monitoring.'}
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
          <Plus size={16} /> {currentUser.role === 'Parent' ? 'Report a Concern' : 'Report New Event'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Nature</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Occurrence Date</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleIncidents.map((inc) => {
                const student = students.find(s => s.id === inc.student_id);
                const type = incidentTypes.find(t => t.id === inc.incident_type_id);
                return (
                  <tr key={inc.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">{type?.name || 'Behavioral Report'}</p>
                        {inc.is_parent_reported && <span className="text-[8px] px-1.5 py-0.5 bg-blue-50 text-blue-600 font-black uppercase rounded border border-blue-100">Parent Report</span>}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-xs">{inc.description}</p>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-800">{student ? `${student.first_name} ${student.last_name}` : 'N/A'}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500">{new Date(inc.date_occurred).toLocaleDateString()}</td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                        inc.status === 'Resolved' ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {inc.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right"><Eye size={16} className="ml-auto text-slate-300 hover:text-slate-900 cursor-pointer" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-teal-600" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                  {currentUser.role === 'Parent' ? 'Submit Welfare Concern' : 'Official Event Entry'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Subject</label>
                  <select disabled={currentUser.role === 'Parent'} required value={newIncident.student_id} onChange={(e) => setNewIncident({...newIncident, student_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">
                    {currentUser.role === 'Parent' ? (
                      <option value={students[0]?.id}>{students[0]?.first_name} {students[0]?.last_name}</option>
                    ) : (
                      <>
                        <option value="">Select Student</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.last_name}, {s.first_name}</option>)}
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nature</label>
                  <select required value={newIncident.incident_type_id} onChange={(e) => setNewIncident({...newIncident, incident_type_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">
                    <option value="">Select Category</option>
                    {incidentTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Occurrence Date</label>
                  <input required type="date" value={newIncident.date_occurred} onChange={(e) => setNewIncident({...newIncident, date_occurred: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</label>
                  <input required type="text" value={newIncident.location} onChange={(e) => setNewIncident({...newIncident, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="e.g. Science Lab" />
                </div>
              </div>
              
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleAiRefinement} className="text-[9px] font-black uppercase text-teal-600 flex items-center gap-1">
                      {isProcessingAI ? <Loader2 size={10} className="animate-spin" /> : <BrainCircuit size={10} />} AI Clear
                    </button>
                    <button type="button" onClick={toggleDictation} className={`p-1.5 rounded-full ${isDictating ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                      {isDictating ? <MicOff size={12} /> : <Mic size={12} />}
                    </button>
                  </div>
                </div>
                <textarea required value={newIncident.description} onChange={(e) => setNewIncident({...newIncident, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm min-h-[100px] outline-none" placeholder="Provide clear event details..." />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" checked={newIncident.is_anonymous} onChange={(e) => setNewIncident({...newIncident, is_anonymous: e.target.checked})} className="w-4 h-4 text-teal-600 bg-slate-100 border-slate-300 rounded focus:ring-teal-500" />
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1">
                  <Shield size={10} /> Submit Anonymously
                </label>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-lg text-xs font-black uppercase tracking-widest shadow-xl active:scale-95">
                {currentUser.role === 'Parent' ? 'Confirm Report Submission' : 'Commit Entry to Registry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;


import React, { useMemo, useState, useRef } from 'react';
import { AlertTriangle, Plus, Search, Eye, Download, X, MoreVertical, ShieldCheck, Mic, MicOff, Loader2, BrainCircuit } from 'lucide-react';
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
  const [newIncident, setNewIncident] = useState({ student_id: '', incident_type_id: '', location: '', description: '', immediate_action: '' });
  
  const recognitionRef = useRef<any>(null);

  const visibleIncidents = useMemo(() => {
    let filtered = [...incidents];
    if (currentUser.role === 'Teacher') {
      filtered = filtered.filter(inc => inc.reported_by_user_id === currentUser.id);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(inc => {
        const s = students.find(st => st.id === inc.student_id);
        return (
          s?.first_name.toLowerCase().includes(q) || 
          s?.last_name.toLowerCase().includes(q) || 
          inc.description.toLowerCase().includes(q)
        );
      });
    }
    return filtered;
  }, [currentUser, incidents, searchQuery, students]);

  const toggleDictation = () => {
    if (isDictating) {
      recognitionRef.current?.stop();
      setIsDictating(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Voice registry is not supported in this browser.");
        return;
      }
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
        contents: `Rewrite this behavioral observation into a professional, objective, and clear incident report: "${newIncident.description}"`
      });
      if (response.text) {
        setNewIncident(prev => ({ ...prev, description: response.text }));
      }
    } catch (e) {
      console.error("AI refinement failed:", e);
      alert("AI Service currently unavailable. Manual editing required.");
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddIncident(newIncident);
    setIsModalOpen(false);
    setNewIncident({ student_id: '', incident_type_id: '', location: '', description: '', immediate_action: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Assistance Records</h2>
          <p className="text-slate-500 font-medium">Official registry for behavioral monitoring and event tracking.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
          <Plus size={16} /> Report New Event
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nature of Event</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleIncidents.map((inc) => {
                const student = students.find(s => s.id === inc.student_id);
                const type = incidentTypes.find(t => t.id === inc.incident_type_id);
                return (
                  <tr key={inc.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-900">{type?.name || 'Behavioral Report'}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[200px] md:max-w-xs">{inc.description}</p>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-800 whitespace-nowrap">{student ? `${student.first_name} ${student.last_name}` : 'N/A'}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500 whitespace-nowrap">{new Date(inc.date_reported).toLocaleDateString()}</td>
                    <td className="px-8 py-5">
                      <select 
                        disabled={currentUser.role === 'Teacher'} 
                        value={inc.status} 
                        onChange={(e) => onUpdateStatus(inc.id, e.target.value as any)} 
                        className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border transition-colors outline-none cursor-pointer ${
                          inc.status === 'Resolved' ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Investigating">Investigating</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-8 py-5 text-right"><Eye size={16} className="ml-auto text-slate-300 hover:text-slate-900 cursor-pointer" /></td>
                  </tr>
                );
              })}
              {visibleIncidents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">No registry records found.</td>
                </tr>
              )}
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
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Official Event Registry</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subject</label>
                  <select required value={newIncident.student_id} onChange={(e) => setNewIncident({...newIncident, student_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-teal-500">
                    <option value="">Select Student</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.last_name}, {s.first_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nature</label>
                  <select required value={newIncident.incident_type_id} onChange={(e) => setNewIncident({...newIncident, incident_type_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-teal-500">
                    <option value="">Select Type</option>
                    {incidentTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</label>
                <input required type="text" value={newIncident.location} onChange={(e) => setNewIncident({...newIncident, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-teal-500" placeholder="e.g. Science Lab, Corridor" />
              </div>
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Narrative</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleAiRefinement} disabled={isProcessingAI || !newIncident.description} className="text-[9px] font-black uppercase text-teal-600 hover:text-teal-800 disabled:opacity-50 flex items-center gap-1 transition-colors">
                      {isProcessingAI ? <Loader2 size={10} className="animate-spin" /> : <BrainCircuit size={10} />}
                      AI Refine
                    </button>
                    <button type="button" onClick={toggleDictation} className={`p-1.5 rounded-full transition-all ${isDictating ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      {isDictating ? <MicOff size={14} /> : <Mic size={14} />}
                    </button>
                  </div>
                </div>
                <textarea required value={newIncident.description} onChange={(e) => setNewIncident({...newIncident, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm min-h-[120px] outline-none focus:ring-1 focus:ring-teal-500" placeholder="Detailed objective observation..." />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">Submit Official Report</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;

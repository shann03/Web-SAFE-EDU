
import React, { useMemo, useState } from 'react';
import { MOCK_INCIDENT_TYPES } from '../constants';
import { AlertTriangle, Plus, Search, Filter, MoreVertical, ShieldCheck, Eye, Download, X } from 'lucide-react';
import { User, Incident, Student } from '../types';

interface IncidentsProps {
  currentUser: User;
  incidents: Incident[];
  students: Student[];
  onAddIncident: (inc: Incident) => void;
  onUpdateStatus: (id: string, status: Incident['status']) => void;
  searchQuery: string;
}

const Incidents: React.FC<IncidentsProps> = ({ currentUser, incidents, students, onAddIncident, onUpdateStatus, searchQuery }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({
    student_id: '',
    incident_type_id: '',
    location: '',
    description: '',
    immediate_action: ''
  });

  const visibleIncidents = useMemo(() => {
    let filtered = incidents;
    if (currentUser.role === 'Teacher') {
      filtered = filtered.filter(inc => inc.reported_by_user_id === currentUser.id);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(inc => {
        const s = students.find(st => st.id === inc.student_id);
        return s?.first_name.toLowerCase().includes(q) || s?.last_name.toLowerCase().includes(q) || inc.description.toLowerCase().includes(q);
      });
    }
    return filtered;
  }, [currentUser, incidents, searchQuery, students]);

  const isTeacher = currentUser.role === 'Teacher';
  const isCounselor = currentUser.role === 'Counselor';
  const isAdmin = currentUser.role === 'Administrator';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incident: Incident = {
      id: `i${Date.now()}`,
      ...newIncident,
      reported_by_user_id: currentUser.id,
      date_reported: new Date().toISOString(),
      date_occurred: new Date().toISOString(),
      status: 'Pending'
    };
    onAddIncident(incident);
    setIsModalOpen(false);
    setNewIncident({ student_id: '', incident_type_id: '', location: '', description: '', immediate_action: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Assistance Records</h2>
          <p className="text-slate-500 font-medium">
            {isTeacher 
              ? 'Official registry of behavioral reports submitted for academic review.' 
              : 'Central management portal for all reported student safety events.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(isAdmin || isCounselor) && (
            <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
              <Download size={14} /> Export Report
            </button>
          )}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Plus size={16} />
            Report New Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 border border-amber-100">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Review</p>
            <h3 className="text-2xl font-bold text-slate-900">
              {visibleIncidents.filter(i => i.status === 'Pending').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
            <Eye size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Investigation</p>
            <h3 className="text-2xl font-bold text-slate-900">
              {visibleIncidents.filter(i => i.status === 'Investigating').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 border border-teal-100">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved Cases</p>
            <h3 className="text-2xl font-bold text-slate-900">
              {visibleIncidents.filter(i => i.status === 'Resolved').length}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nature of Event</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Date</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleIncidents.map((inc) => {
                const student = students.find(s => s.id === inc.student_id);
                const type = MOCK_INCIDENT_TYPES.find(t => t.id === inc.incident_type_id);
                return (
                  <tr key={inc.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-900 tracking-tight">{type?.name || 'Assistance Request'}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Campus: {inc.location}</p>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-800">{student?.first_name} {student?.last_name}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500">{new Date(inc.date_reported).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-8 py-5">
                      <select 
                        disabled={isTeacher}
                        value={inc.status}
                        onChange={(e) => onUpdateStatus(inc.id, e.target.value as Incident['status'])}
                        className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border transition-colors cursor-pointer appearance-none ${
                          inc.status === 'Resolved' ? 'bg-teal-50 text-teal-700 border-teal-100' : 
                          inc.status === 'Investigating' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Investigating">Investigating</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 transition-colors" title="View Records">
                          <Eye size={16} />
                        </button>
                        {(isCounselor || isAdmin) && (
                          <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 transition-colors" title="Administrative Options">
                            <MoreVertical size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Official Incident Registry</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Subject</label>
                  <select 
                    required
                    value={newIncident.student_id}
                    onChange={(e) => setNewIncident({ ...newIncident, student_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                  >
                    <option value="">Select Student</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nature of Event</label>
                  <select 
                    required
                    value={newIncident.incident_type_id}
                    onChange={(e) => setNewIncident({ ...newIncident, incident_type_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                  >
                    <option value="">Select Nature</option>
                    {MOCK_INCIDENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Official Location</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g., Grade 10 Hallway, Canteen"
                  value={newIncident.location}
                  onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Event Narrative</label>
                <textarea 
                  required
                  placeholder="Describe the incident details objectively..."
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none min-h-[100px]"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                Submit Formal Report
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 p-5 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800">
        <ShieldCheck size={18} className="text-teal-400" />
        <span className="text-[10px] font-black uppercase tracking-widest">Authorized Internal Access Registry — Confidential Data Protection Active</span>
      </div>
    </div>
  );
};

export default Incidents;


import React, { useState } from 'react';
import { ClipboardList, FileText, Download, Plus, Search, Calendar, ShieldCheck, Clock, FileCheck } from 'lucide-react';
import { User, GeneratedReport } from '../types';

interface ReportsProps {
  currentUser: User;
  reports: GeneratedReport[];
  onGenerateReport: (report: GeneratedReport) => void;
}

const Reports: React.FC<ReportsProps> = ({ currentUser, reports, onGenerateReport }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const isAdmin = currentUser.role === 'Administrator' || currentUser.role === 'Counselor';

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newReport: GeneratedReport = {
        id: `rep${Date.now()}`,
        title: `Manual Audit Report - ${new Date().toLocaleDateString()}`,
        type: 'Digital Safety Audit',
        generated_by: currentUser.full_name,
        date_generated: new Date().toISOString(),
        status: 'Ready',
        file_size: '1.5 MB'
      };
      onGenerateReport(newReport);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Reports</h2>
          <p className="text-slate-500 font-medium">Archive of official registry audits and welfare summaries.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-teal-700 text-white px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-teal-800 transition-all shadow-xl disabled:opacity-50"
          >
            {isGenerating ? <Clock size={16} className="animate-spin" /> : <Plus size={16} />}
            {isGenerating ? 'Compiling Registry...' : 'Generate New Audit'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-teal-600" size={18} />
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Available Documents</h4>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Generated On</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-900">{report.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black uppercase px-2 py-1 bg-slate-100 text-slate-600 rounded">{report.type}</span>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-500">{new Date(report.date_generated).toLocaleDateString()}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-[10px] font-black text-teal-700 uppercase tracking-widest flex items-center gap-1 ml-auto"><Download size={14} /> PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;

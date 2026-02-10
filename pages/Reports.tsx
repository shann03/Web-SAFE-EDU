
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
  const isAdmin = currentUser.role === 'Administrator';

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      const newReport: GeneratedReport = {
        id: `rep${Date.now()}`,
        title: `Automatic Assistance Registry Audit - ${new Date().toLocaleDateString('en-PH')}`,
        type: 'Annual Review',
        generated_by: currentUser.full_name,
        date_generated: new Date().toISOString(),
        status: 'Ready',
        file_size: '0.8 MB'
      };
      onGenerateReport(newReport);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Reports</h2>
          <p className="text-slate-500 font-medium">Export and audit formal documents derived from school registry data.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-teal-700 text-white px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-teal-800 transition-all shadow-xl shadow-teal-100 disabled:opacity-50"
          >
            {isGenerating ? <Clock size={16} className="animate-spin" /> : <Plus size={16} />}
            {isGenerating ? 'Compiling Registry...' : 'Generate Compliance Report'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Files</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{reports.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Generated</p>
          <h3 className="text-sm font-bold text-slate-900 mt-2">
            {reports.length > 0 ? new Date(reports[0].date_generated).toLocaleDateString('en-PH') : 'No records'}
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-teal-600" size={18} />
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Generated Registry Exports</h4>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Filter archives..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Title</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Generated On</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Size</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 text-teal-400 rounded">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-900 tracking-tight">{report.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 text-slate-600 rounded">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-600">{new Date(report.date_generated).toLocaleDateString()}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">By {report.generated_by}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-400">{report.file_size}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="inline-flex items-center gap-2 text-[10px] font-black text-teal-700 hover:text-teal-900 uppercase tracking-widest transition-colors">
                      <Download size={14} /> Download PDF
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <FileCheck size={48} className="opacity-10 mb-2" />
                      <p className="text-xs font-black uppercase tracking-widest">No formal reports in registry</p>
                      <p className="text-[10px] font-medium">Generate a new report to see documents here.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Calendar size={120} />
          </div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Scheduled Audits</h4>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Quarterly Welfare Review</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Next: Dec 15, 2023</p>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-teal-50 text-teal-700 rounded border border-teal-100">Automated</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Digital Footprint Census</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Next: Nov 30, 2023</p>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 text-slate-500 rounded border border-slate-200">Manual</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-xl shadow-xl flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-teal-400" size={24} />
            <h4 className="text-xl font-bold">Registry Data Integrity</h4>
          </div>
          <p className="text-teal-100 text-sm leading-relaxed font-medium mb-6">
            All generated reports are timestamped and cryptographically signed. Access to archived records is restricted to authenticated Administrators and Counselors in accordance with school data retention policies.
          </p>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-teal-400">RA 10173</p>
              <p className="text-[10px] font-bold">Compliant</p>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-teal-400">DEPED 40s</p>
              <p className="text-[10px] font-bold">Aligned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

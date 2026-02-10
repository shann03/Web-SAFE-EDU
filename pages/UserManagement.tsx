
import React, { useState } from 'react';
import { UserPlus, Search, Shield, Trash2, Mail, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { PREDEFINED_ACCOUNTS } from '../constants';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(PREDEFINED_ACCOUNTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Teacher');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      email: inviteEmail,
      password: 'temporary-password',
      user: {
        id: `u${Date.now()}`,
        username: inviteEmail.split('@')[0],
        email: inviteEmail,
        full_name: 'Invited Staff',
        is_active: true,
        role: inviteRole as any
      }
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    setInviteEmail('');
    alert(`Invitation successfully sent to ${inviteEmail} as ${inviteRole}`);
  };

  const handleDeactivate = (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this access credential? This will be recorded in the audit log.')) {
      setUsers(prev => prev.filter(u => u.user.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Custodian Access Registry</h2>
          <p className="text-slate-500 font-medium">Manage authorized system access for official school personnel.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
        >
          <UserPlus size={18} />
          Provision Access
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm border-l-4 border-slate-900">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-900">
              <Shield size={20} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Access Tokens</p>
          <h4 className="text-3xl font-black text-slate-900 mt-1">{users.length}</h4>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm border-l-4 border-teal-600">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Integrity</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Compliance</p>
          <h4 className="text-3xl font-black text-slate-900 mt-1">100%</h4>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm border-l-4 border-amber-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <AlertCircle size={20} />
            </div>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Protocol</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Items</p>
          <h4 className="text-3xl font-black text-slate-900 mt-1">04</h4>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Filter Official Registry..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/30">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Officer Identity</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Designation</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((acc, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-sm">
                        {acc.user.full_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 tracking-tight">{acc.user.full_name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1 tracking-tighter"><Mail size={10} className="text-teal-600" /> {acc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                      acc.user.role === 'Administrator' ? 'bg-slate-900 text-white border-slate-800' : 
                      acc.user.role === 'Counselor' ? 'bg-teal-50 border-teal-100 text-teal-700' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      {acc.user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Authority</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 transition-colors" title="Credential Audit">
                        <Shield size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeactivate(acc.user.id)}
                        className="p-2 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors" 
                        title="Revoke Official Access"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Provision New Authority</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleInvite} className="p-6 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Official DepEd Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    required
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="official.email@deped.gov.ph"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-1 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Access Designation</label>
                <select 
                  required
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-widest focus:ring-1 focus:ring-teal-500 outline-none"
                >
                  <option value="Teacher">Teacher (Reporter)</option>
                  <option value="Counselor">Counselor (Interventionist)</option>
                  <option value="Administrator">Administrator (Custodian)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-100">
                Generate Official Invitation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

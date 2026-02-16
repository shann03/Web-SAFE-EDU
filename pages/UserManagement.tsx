
import React, { useState } from 'react';
import { UserPlus, Search, Shield, Trash2, Mail, CheckCircle2, AlertCircle, X, Loader2, UserCog, ShieldAlert, ShieldCheck, RefreshCw, Star } from 'lucide-react';
import { User, UserRole } from '../types';

interface UserManagementProps {
  localUsers: User[];
  currentUser: User;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onSync: () => Promise<void>;
}

const UserManagement: React.FC<UserManagementProps> = ({ localUsers, currentUser, onUpdateUser, onSync }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSync = async () => {
    setIsSyncing(true);
    await onSync();
    setTimeout(() => setIsSyncing(false), 1500);
  };

  const filteredUsers = localUsers.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Authority Registry</h2>
            <div className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-black uppercase rounded border border-amber-200 flex items-center gap-1">
              <Star size={8} fill="currentColor" /> System Master
            </div>
          </div>
          <p className="text-slate-500 font-medium">Manage official access credentials and security clearances.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Synchronizing...' : 'Force Sync Profiles'}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
          >
            <UserPlus size={16} /> Provision Access
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search Officials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/30">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Officer</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clearance</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`hover:bg-slate-50/50 transition-all group ${!user.is_active ? 'opacity-50 grayscale' : ''}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-sm ${
                        user.role === 'Administrator' ? 'bg-amber-600' : user.role === 'Parent' ? 'bg-slate-900' : 'bg-teal-700'
                      }`}>
                        {user.full_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 tracking-tight">{user.full_name} {user.id === currentUser.id && '(You)'}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <select 
                      disabled={user.id === currentUser.id && user.role === 'Administrator'}
                      value={user.role} 
                      onChange={(e) => onUpdateUser(user.id, { role: e.target.value as UserRole })}
                      className="px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border bg-slate-50 border-slate-200 text-slate-700 outline-none cursor-pointer"
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Counselor">Counselor</option>
                      <option value="Parent">Parent</option>
                    </select>
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      disabled={user.id === currentUser.id}
                      onClick={() => onUpdateUser(user.id, { is_active: !user.is_active })}
                      className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                        user.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                      }`}
                    >
                      {user.is_active ? 'Authorized' : 'Restricted'}
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button disabled={user.id === currentUser.id} className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-20"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Provision New Authority</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-[10px] font-medium leading-relaxed">
                As an Administrator, you are granting high-level registry access. Ensure the recipient email is a verified official account.
              </div>
              <input type="email" placeholder="Official Email Address" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none font-medium" />
              <button onClick={() => setIsModalOpen(false)} className="w-full bg-slate-900 text-white py-4 rounded-lg text-xs font-black uppercase tracking-widest shadow-xl active:scale-95">Grant Access Permission</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

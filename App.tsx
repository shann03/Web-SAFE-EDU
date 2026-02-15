
import React, { useState, useEffect, useCallback } from 'react';
import { Database, ShieldCheck, Loader2, AlertCircle, CloudCheck } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Incidents from './pages/Incidents';
import Interventions from './pages/Interventions';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import SystemLogs from './pages/SystemLogs';
import Login from './pages/Login';
import { User, Incident, Student, BehavioralIntervention, DeviceUsageRecord, ParentGuardian, GeneratedReport, Notification, SystemLog, IncidentType } from './types';
import { supabase } from './services/supabaseClient';
import { 
  MOCK_STUDENTS, MOCK_INCIDENTS, MOCK_INCIDENT_TYPES, 
  MOCK_INTERVENTIONS, MOCK_DEVICE_LOGS, MOCK_PARENTS, 
  MOCK_REPORTS, MOCK_SYSTEM_LOGS, MOCK_NOTIFICATIONS,
  PREDEFINED_ACCOUNTS
} from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [localMode, setLocalMode] = useState(false);
  
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [interventions, setInterventions] = useState<BehavioralIntervention[]>([]);
  const [deviceLogs, setDeviceLogs] = useState<DeviceUsageRecord[]>([]);
  const [parents, setParents] = useState<ParentGuardian[]>([]);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [registryUsers, setRegistryUsers] = useState<User[]>([]);

  const addSystemLog = useCallback(async (action: string, category: SystemLog['category']) => {
    if (!currentUser) return;
    const newLog: SystemLog = {
      id: `sl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      action,
      category,
      ip_address: localMode ? 'Local-Session' : 'Registry-Sync'
    };
    
    setSystemLogs(prev => [newLog, ...prev]);

    if (!localMode) {
      try {
        await supabase.from('system_audit_logs').insert([{
          user_id: currentUser.id,
          user_name: currentUser.full_name,
          action,
          category,
          ip_address: 'Registry-Sync'
        }]);
      } catch (e) {
        console.warn("Audit Log Sync Failed:", e);
      }
    }
  }, [currentUser, localMode]);

  const fetchRegistryData = useCallback(async () => {
    if (localMode) {
      setStudents(MOCK_STUDENTS);
      setIncidents(MOCK_INCIDENTS);
      setIncidentTypes(MOCK_INCIDENT_TYPES);
      setInterventions(MOCK_INTERVENTIONS);
      setDeviceLogs(MOCK_DEVICE_LOGS);
      setParents(MOCK_PARENTS);
      setReports(MOCK_REPORTS);
      setSystemLogs(MOCK_SYSTEM_LOGS);
      setNotifications(MOCK_NOTIFICATIONS);
      setRegistryUsers(PREDEFINED_ACCOUNTS.map(a => a.user as User));
      setIsInitializing(false);
      return;
    }

    setIsSyncing(true);
    try {
      const [st, inc, it, intr, dev, par, rep, logs, prof] = await Promise.all([
        supabase.from('students').select('*'),
        supabase.from('incidents').select('*').order('date_reported', { ascending: false }),
        supabase.from('incident_types').select('*'),
        supabase.from('interventions').select('*'),
        supabase.from('device_logs').select('*'),
        supabase.from('parents').select('*'),
        supabase.from('generated_reports').select('*'),
        supabase.from('system_audit_logs').select('*').order('timestamp', { ascending: false }).limit(100),
        supabase.from('profiles').select('*')
      ]);

      setStudents(st.data && st.data.length > 0 ? st.data : MOCK_STUDENTS);
      setIncidents(inc.data && inc.data.length > 0 ? inc.data : MOCK_INCIDENTS);
      setIncidentTypes(it.data && it.data.length > 0 ? it.data : MOCK_INCIDENT_TYPES);
      setInterventions(intr.data && intr.data.length > 0 ? intr.data : MOCK_INTERVENTIONS);
      setDeviceLogs(dev.data && dev.data.length > 0 ? dev.data : MOCK_DEVICE_LOGS);
      setParents(par.data && par.data.length > 0 ? par.data : MOCK_PARENTS);
      setReports(rep.data && rep.data.length > 0 ? rep.data : MOCK_REPORTS);
      setSystemLogs(logs.data && logs.data.length > 0 ? logs.data : MOCK_SYSTEM_LOGS);
      setRegistryUsers(prof.data && prof.data.length > 0 ? prof.data : PREDEFINED_ACCOUNTS.map(a => a.user as User));
      setNotifications(MOCK_NOTIFICATIONS);
    } catch (error) {
      console.error("Supabase Registry Fetch Failed. Entering Resilience Mode.", error);
      setLocalMode(true);
    } finally {
      setIsSyncing(false);
      setIsInitializing(false);
    }
  }, [localMode]);

  useEffect(() => {
    if (currentUser) {
      fetchRegistryData();
    } else {
      setIsInitializing(false);
    }
  }, [currentUser, fetchRegistryData]);

  const handleLogout = () => {
    addSystemLog('Session Terminated', 'Access');
    setCurrentUser(null);
    setActiveTab('Dashboard');
  };

  const handleAddIncident = useCallback(async (newInc: Partial<Incident>) => {
    const incData = {
      student_id: newInc.student_id!,
      reported_by_user_id: currentUser!.id,
      incident_type_id: newInc.incident_type_id!,
      date_reported: new Date().toISOString(),
      date_occurred: new Date().toISOString(),
      location: newInc.location!,
      description: newInc.description!,
      immediate_action: newInc.immediate_action!,
      status: 'Pending' as const
    };

    const tempId = `temp-${Date.now()}`;
    setIncidents(prev => [{ id: tempId, ...incData } as Incident, ...prev]);

    if (!localMode) {
      try {
        const { data, error } = await supabase.from('incidents').insert([incData]).select().single();
        if (error) throw error;
        setIncidents(prev => prev.map(i => i.id === tempId ? data : i));
        addSystemLog(`Committed Incident to Registry`, 'Registry');
      } catch (err) {
        console.error("Sync Error:", err);
        alert("Persistence failure. Record saved to local session only.");
      }
    }
  }, [currentUser, localMode, addSystemLog]);

  const handleUpdateStatus = useCallback(async (id: string, status: Incident['status']) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
    if (!localMode && !id.startsWith('temp-')) {
      try {
        const { error } = await supabase.from('incidents').update({ status }).eq('id', id);
        if (error) throw error;
        addSystemLog(`Status Update Confirmed: #${id}`, 'Audit');
      } catch (err) {
        console.error("Update Sync Error:", err);
      }
    }
  }, [localMode, addSystemLog]);

  const handleAddStudent = useCallback(async (data: Partial<Student>) => {
    const studentData = {
      lrn: data.lrn || '000000000000',
      first_name: data.first_name!,
      last_name: data.last_name!,
      date_of_birth: data.date_of_birth || new Date().toISOString(),
      gender: data.gender || 'Male',
      grade_level: data.grade_level || '7',
      section: data.section || 'N/A',
      address: data.address || 'N/A',
      contact_number: data.contact_number || 'N/A'
    };

    if (!localMode) {
      try {
        const { data: remoteStudent, error } = await supabase.from('students').insert([studentData]).select().single();
        if (error) throw error;
        setStudents(prev => [remoteStudent, ...prev]);
        addSystemLog(`Added Learner: ${studentData.last_name}`, 'Registry');
        return { data: remoteStudent, error: null };
      } catch (err) {
        console.error("Persistence Error:", err);
        const local = { id: `local-${Date.now()}`, ...studentData } as Student;
        setStudents(prev => [local, ...prev]);
        return { data: local, error: null };
      }
    } else {
      const s = { id: `s-${Date.now()}`, ...studentData } as Student;
      setStudents(prev => [s, ...prev]);
      addSystemLog(`Added Local Subject: ${s.last_name}`, 'Registry');
      return { data: s, error: null };
    }
  }, [localMode, addSystemLog]);

  const handleAddIntervention = useCallback(async (data: Partial<BehavioralIntervention>) => {
    const intrData = {
      student_id: data.student_id!,
      assigned_by_user_id: currentUser!.id,
      intervention_type: data.intervention_type!,
      description: data.description!,
      start_date: new Date().toISOString(),
      status: 'Active'
    };

    const tempId = `temp-${Date.now()}`;
    setInterventions(prev => [{ id: tempId, ...intrData } as BehavioralIntervention, ...prev]);

    if (!localMode) {
      try {
        const { data: remote, error } = await supabase.from('interventions').insert([intrData]).select().single();
        if (error) throw error;
        setInterventions(prev => prev.map(i => i.id === tempId ? remote : i));
        addSystemLog(`Committed Intervention for ID: ${intrData.student_id}`, 'Registry');
      } catch (err) {
        console.error("Intervention Sync Error:", err);
      }
    }
  }, [currentUser, localMode, addSystemLog]);

  const handleUpdateUser = useCallback(async (id: string, updates: Partial<User>) => {
    setRegistryUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (!localMode) {
      try {
        const { error } = await supabase.from('profiles').update(updates).eq('id', id);
        if (error) throw error;
        addSystemLog(`Security Clearance Modified for: ${id}`, 'Security');
      } catch (e) {
        console.error("Profile sync failed:", e);
      }
    }
  }, [localMode, addSystemLog]);

  const renderContent = () => {
    if (!currentUser) return null;
    switch (activeTab) {
      case 'Dashboard': return <Dashboard incidents={incidents} students={students} deviceLogs={deviceLogs} />;
      case 'Students': return <Students currentUser={currentUser} incidents={incidents} students={students} searchQuery={searchQuery} parents={parents} deviceLogs={deviceLogs} onAddStudent={handleAddStudent} />;
      case 'Incidents': return <Incidents currentUser={currentUser} incidents={incidents} students={students} incidentTypes={incidentTypes} onAddIncident={handleAddIncident} onUpdateStatus={handleUpdateStatus} searchQuery={searchQuery} />;
      case 'Interventions': return <Interventions currentUser={currentUser} students={students} interventions={interventions} onAddIntervention={handleAddIntervention} />;
      case 'Reports': return <Reports currentUser={currentUser} reports={reports} onGenerateReport={(r) => setReports(prev => [r, ...prev])} />;
      case 'System Logs': return <SystemLogs logs={systemLogs} />;
      case 'User Management': return <UserManagement localUsers={registryUsers} onUpdateUser={handleUpdateUser} onSync={fetchRegistryData} />;
      default: return <Dashboard incidents={incidents} students={students} deviceLogs={deviceLogs} />;
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black animate-bounce shadow-2xl">S</div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verifying System Integrity...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return <Login onLogin={setCurrentUser} onLocalBypass={(u) => { setLocalMode(true); setCurrentUser(u); }} />;

  return (
    <Layout user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} searchQuery={searchQuery} setSearchQuery={setSearchQuery} notifications={notifications} onMarkRead={() => setNotifications(prev => prev.map(n => ({...n, isRead: true})))}>
      {isSyncing && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl z-50 border border-slate-700 animate-in slide-in-from-bottom-8">
          <Loader2 size={16} className="animate-spin text-teal-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-teal-50">Registry Syncing...</span>
        </div>
      )}
      {localMode && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-amber-700" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-900">Offline Resilience Active</p>
              <p className="text-[10px] text-amber-700 font-medium">Remote Registry Unavailable. Saving to Local Cache.</p>
            </div>
          </div>
          <button onClick={() => { setLocalMode(false); fetchRegistryData(); }} className="px-3 py-1.5 bg-amber-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors hover:bg-amber-800">Reconnect</button>
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;

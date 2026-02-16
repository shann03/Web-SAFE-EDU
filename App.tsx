
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Incidents from './pages/Incidents';
import Interventions from './pages/Interventions';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import SystemLogs from './pages/SystemLogs';
import DigitalSafety from './pages/DigitalSafety';
import Login from './pages/Login';
import { User, Incident, Student, BehavioralIntervention, DeviceUsageRecord, ParentGuardian, GeneratedReport, Notification, SystemLog, IncidentType } from './types';
import { supabase } from './services/supabaseClient';
import { 
  MOCK_STUDENTS, MOCK_INCIDENTS, MOCK_INCIDENT_TYPES, 
  MOCK_INTERVENTIONS, MOCK_DEVICE_LOGS, MOCK_PARENTS, 
  MOCK_REPORTS, MOCK_SYSTEM_LOGS, MOCK_NOTIFICATIONS,
  MOCK_USERS
} from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [interventions, setInterventions] = useState<BehavioralIntervention[]>([]);
  const [deviceLogs, setDeviceLogs] = useState<DeviceUsageRecord[]>([]);
  const [parents, setParents] = useState<ParentGuardian[]>([]);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const isParent = currentUser?.role === 'Parent';

  // HELPER: Merge and de-duplicate records favoring Supabase data
  const mergeRecords = <T extends { id: string }>(mock: T[], live: T[]): T[] => {
    const map = new Map();
    mock.forEach(item => map.set(item.id, item));
    live.forEach(item => map.set(item.id, item));
    return Array.from(map.values());
  };

  const filteredStudents = useMemo(() => {
    const base = mergeRecords(MOCK_STUDENTS, allStudents);
    if (isParent && currentUser?.linked_lrn) {
      return base.filter(s => s.lrn === currentUser.linked_lrn || s.id.startsWith('mock-'));
    }
    return base;
  }, [currentUser, allStudents, isParent]);

  const filteredIncidents = useMemo(() => {
    const base = mergeRecords(MOCK_INCIDENTS, allIncidents);
    if (isParent && currentUser?.linked_lrn) {
      const student = filteredStudents.find(s => s.lrn === currentUser.linked_lrn);
      return base.filter(inc => inc.student_id === student?.id);
    }
    return base;
  }, [currentUser, allIncidents, filteredStudents, isParent]);

  const filteredInterventions = useMemo(() => {
    const base = mergeRecords(MOCK_INTERVENTIONS, interventions);
    if (isParent && currentUser?.linked_lrn) {
      const student = filteredStudents.find(s => s.lrn === currentUser.linked_lrn);
      return base.filter(int => int.student_id === student?.id);
    }
    return base;
  }, [currentUser, interventions, filteredStudents, isParent]);

  const addSystemLog = useCallback(async (action: string, category: SystemLog['category']) => {
    if (!currentUser) return;
    const newLog = {
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      action,
      category,
      ip_address: 'System-Client',
      timestamp: new Date().toISOString()
    };
    
    try {
      await supabase.from('system_audit_logs').insert([newLog]);
    } catch (e) {}
    
    setSystemLogs(prev => [{ ...newLog, id: `sl-${Date.now()}` } as SystemLog, ...prev]);
  }, [currentUser]);

  const fetchRegistryData = useCallback(async () => {
    try {
      const [
        { data: studentsData },
        { data: incidentsData },
        { data: typesData },
        { data: interventionsData },
        { data: logsData },
        { data: parentsData },
        { data: reportsData },
        { data: sysLogsData },
        { data: notifsData },
        { data: profilesData }
      ] = await Promise.all([
        supabase.from('students').select('*'),
        supabase.from('incidents').select('*').order('date_reported', { ascending: false }),
        supabase.from('incident_types').select('*'),
        supabase.from('interventions').select('*').order('start_date', { ascending: false }),
        supabase.from('device_logs').select('*'),
        supabase.from('parents').select('*'),
        supabase.from('generated_reports').select('*'),
        supabase.from('system_audit_logs').select('*').order('timestamp', { ascending: false }),
        supabase.from('notifications').select('*').order('timestamp', { ascending: false }),
        supabase.from('profiles').select('*')
      ]);

      if (studentsData) setAllStudents(studentsData);
      if (incidentsData) setAllIncidents(incidentsData);
      setIncidentTypes(typesData || MOCK_INCIDENT_TYPES);
      if (interventionsData) setInterventions(interventionsData);
      setDeviceLogs(mergeRecords(MOCK_DEVICE_LOGS, logsData || []));
      setParents(parentsData || MOCK_PARENTS);
      setReports(reportsData?.length ? reportsData : MOCK_REPORTS);
      setSystemLogs(sysLogsData?.length ? sysLogsData : MOCK_SYSTEM_LOGS);
      setNotifications(notifsData || MOCK_NOTIFICATIONS);
      setAllUsers(profilesData?.length ? profilesData : MOCK_USERS);
    } catch (err) {
      console.error("Critical: Registry synchronization failed.", err);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) setCurrentUser(profile as User);
        else {
          setCurrentUser({
            id: session.user.id,
            full_name: session.user.user_metadata.full_name || 'Registry User',
            role: session.user.user_metadata.role || 'Teacher',
            email: session.user.email!,
            username: session.user.email!.split('@')[0],
            is_active: true,
            linked_lrn: session.user.user_metadata.linked_lrn
          });
        }
      }
      setIsInitializing(false);
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchRegistryData();
    }
  }, [currentUser, fetchRegistryData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setActiveTab('Dashboard');
  };

  const handleLrnSearch = (lrn: string) => {
    setSearchQuery(lrn);
    setActiveTab('Students');
  };

  const handleAddIncident = useCallback(async (newInc: Partial<Incident>) => {
    if (!currentUser) return;
    const incData = {
      student_id: newInc.student_id,
      reported_by_user_id: currentUser.id,
      incident_type_id: newInc.incident_type_id || 'it5',
      date_reported: new Date().toISOString(),
      date_occurred: newInc.date_occurred || new Date().toISOString(),
      location: newInc.location || 'Digital Environment',
      description: newInc.description,
      immediate_action: newInc.immediate_action || 'Registry Entry',
      status: 'Pending',
      is_parent_reported: isParent,
      is_anonymous: newInc.is_anonymous || false
    };

    const { data, error } = await supabase.from('incidents').insert([incData]).select();
    
    if (!error && data) {
      setAllIncidents(prev => [data[0] as Incident, ...prev]);
      addSystemLog(`Incident Registered: ${data[0].id}`, 'Registry');
    } else {
      setAllIncidents(prev => [{ ...incData, id: `temp-inc-${Date.now()}` } as Incident, ...prev]);
    }
  }, [currentUser, addSystemLog, isParent]);

  const handleDismissLog = useCallback(async (id: string) => {
    setDeviceLogs(prev => prev.map(log => log.id === id ? { ...log, flagged: false } : log));
    await supabase.from('device_logs').update({ flagged: false }).eq('id', id);
    addSystemLog(`Digital Safety Alert ${id} dismissed.`, 'Security');
  }, [addSystemLog]);

  const handleEscalateLog = useCallback(async (log: DeviceUsageRecord) => {
    await handleAddIncident({
      student_id: log.student_id,
      description: `Automated escalation from Digital Safety Monitor: ${log.activity_description}`,
      incident_type_id: 'it5', // Digital Misuse
      location: 'School Network'
    });
    handleDismissLog(log.id);
  }, [handleAddIncident, handleDismissLog]);

  const handleAddStudent = useCallback(async (studentData: Partial<Student>) => {
    const { data, error } = await supabase.from('students').insert([studentData]).select();
    if (!error && data) {
      setAllStudents(prev => [data[0] as Student, ...prev]);
      addSystemLog(`New Subject Registered: ${data[0].lrn}`, 'Registry');
      return data[0];
    } else {
      const temp = { ...studentData, id: `temp-s-${Date.now()}` } as Student;
      setAllStudents(prev => [temp, ...prev]);
      return temp;
    }
  }, [addSystemLog]);

  const handleAddIntervention = useCallback(async (intData: Partial<BehavioralIntervention>) => {
    if (!currentUser) return;
    const payload = {
      ...intData,
      assigned_by_user_id: currentUser.id,
      start_date: new Date().toISOString(),
      status: 'Active',
      history: [{ id: `m-init-${Date.now()}`, date: new Date().toISOString(), title: 'Case Initialized', notes: 'Dossier opened in the Registry.', outcome: 'Plan active', recorded_by: currentUser.full_name }]
    };
    const { data, error } = await supabase.from('interventions').insert([payload]).select();
    if (!error && data) {
      setInterventions(prev => [data[0] as BehavioralIntervention, ...prev]);
      addSystemLog(`Intervention Launched: ${data[0].id}`, 'Registry');
    } else {
      setInterventions(prev => [{ ...payload, id: `temp-int-${Date.now()}` } as BehavioralIntervention, ...prev]);
    }
  }, [currentUser, addSystemLog]);

  const handleUpdateStatus = useCallback(async (id: string, status: Incident['status']) => {
    const { error } = await supabase.from('incidents').update({ status }).eq('id', id);
    if (!error) {
      setAllIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
      addSystemLog(`Incident ${id} updated to ${status}`, 'Audit');
    }
  }, [addSystemLog]);

  const renderContent = () => {
    if (!currentUser) return null;
    switch (activeTab) {
      case 'Dashboard': 
        return <Dashboard 
          currentUser={currentUser} incidents={filteredIncidents} students={filteredStudents} deviceLogs={deviceLogs} onSearchLRN={handleLrnSearch}
          onDismissLog={handleDismissLog} onEscalateLog={handleEscalateLog}
        />;
      case 'Students': 
        return <Students currentUser={currentUser} incidents={filteredIncidents} students={filteredStudents} searchQuery={searchQuery} parents={parents} deviceLogs={deviceLogs} onAddStudent={handleAddStudent} />;
      case 'Incidents': 
        return <Incidents currentUser={currentUser} incidents={filteredIncidents} students={filteredStudents} incidentTypes={incidentTypes} onAddIncident={handleAddIncident} onUpdateStatus={handleUpdateStatus} searchQuery={searchQuery} />;
      case 'Interventions': 
        return <Interventions currentUser={currentUser} students={filteredStudents} interventions={filteredInterventions} onAddIntervention={handleAddIntervention} />;
      case 'Digital Safety':
        return <DigitalSafety students={filteredStudents} deviceLogs={deviceLogs} onDismissLog={handleDismissLog} onEscalateLog={handleEscalateLog} />;
      case 'Reports': 
        return <Reports currentUser={currentUser} reports={reports} onGenerateReport={(data) => setReports(prev => [data, ...prev])} />;
      case 'System Logs': 
        return <SystemLogs logs={systemLogs} />;
      case 'User Management': 
        return <UserManagement localUsers={allUsers} currentUser={currentUser} onUpdateUser={(id, updates) => setAllUsers(prev => prev.map(u => u.id === id ? {...u, ...updates} : u))} onSync={fetchRegistryData} />;
      default: 
        return <Dashboard currentUser={currentUser} incidents={filteredIncidents} students={filteredStudents} deviceLogs={deviceLogs} onSearchLRN={handleLrnSearch} />;
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-slate-900 mx-auto" size={32} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Bootstrapping Demo Registry...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return <Login onLogin={setCurrentUser} />;

  return (
    <Layout user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} searchQuery={searchQuery} setSearchQuery={setSearchQuery} notifications={notifications} onMarkRead={() => {}}>
      {renderContent()}
    </Layout>
  );
};

export default App;

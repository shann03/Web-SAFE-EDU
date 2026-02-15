
import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck } from 'lucide-react';
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

  const addSystemLog = async (action: string, category: SystemLog['category']) => {
    if (!currentUser) return;
    const newLog: SystemLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      action,
      category,
      ip_address: localMode ? 'Local-Bypass' : 'Registry-Sync'
    };
    setSystemLogs(prev => [newLog, ...prev]);
    
    if (!localMode) {
      try {
        await supabase.from('system_audit_logs').insert([{
          user_id: currentUser.id, user_name: currentUser.full_name, action, category, ip_address: 'Registry-Sync'
        }]);
      } catch (e) {
        console.error("Failed to log audit event:", e);
      }
    }
  };

  useEffect(() => {
    // Initial data load
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
  }, []);

  const handleLogout = async () => {
    await addSystemLog('User Initiated Logout', 'Access');
    setCurrentUser(null);
    setLocalMode(false);
    setActiveTab('Dashboard');
  };

  const handleLocalBypass = (user: User) => {
    setLocalMode(true);
    setCurrentUser(user);
    setActiveTab('Dashboard');
    addSystemLog('Emergency Admin Bypass Activated', 'Security');
  };

  const addIncident = (inc: Partial<Incident>) => {
    const newInc: Incident = {
      id: `i-${Date.now()}`,
      student_id: inc.student_id!,
      reported_by_user_id: currentUser!.id,
      incident_type_id: inc.incident_type_id!,
      date_reported: new Date().toISOString(),
      date_occurred: inc.date_occurred || new Date().toISOString(),
      location: inc.location!,
      description: inc.description!,
      immediate_action: inc.immediate_action!,
      status: 'Pending'
    };
    setIncidents(prev => [newInc, ...prev]);
    addSystemLog(`Reported new incident for Student ID: ${newInc.student_id}`, 'Registry');
  };

  const updateIncidentStatus = (id: string, status: Incident['status']) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    addSystemLog(`Updated Incident #${id} to ${status}`, 'Audit');
  };

  const addStudent = async (data: Partial<Student>) => {
    const s: Student = {
      id: `s-${Date.now()}`,
      lrn: data.lrn!,
      first_name: data.first_name!,
      last_name: data.last_name!,
      date_of_birth: data.date_of_birth!,
      gender: data.gender || 'Male',
      grade_level: data.grade_level!,
      section: data.section!,
      address: data.address!,
      contact_number: data.contact_number || 'N/A'
    };
    setStudents(prev => [s, ...prev]);
    addSystemLog(`Registered new student: ${s.first_name} ${s.last_name}`, 'Registry');
    return { data: s, error: null };
  };

  const addIntervention = (data: Partial<BehavioralIntervention>) => {
    const int: BehavioralIntervention = {
      id: `int-${Date.now()}`,
      student_id: data.student_id!,
      assigned_by_user_id: currentUser!.id,
      intervention_type: data.intervention_type!,
      description: data.description!,
      start_date: data.start_date!,
      status: 'Active'
    };
    setInterventions(prev => [int, ...prev]);
    addSystemLog(`Assigned ${int.intervention_type} to Student ID: ${int.student_id}`, 'Registry');
  };

  const generateReport = (report: GeneratedReport) => {
    setReports(prev => [report, ...prev]);
    addSystemLog(`Generated formal report: ${report.title}`, 'Audit');
  };

  const updateRegistryUser = (userId: string, updates: Partial<User>) => {
    setRegistryUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    addSystemLog(`Updated registry permissions for User ID: ${userId}`, 'Security');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <Dashboard incidents={incidents} students={students} deviceLogs={deviceLogs} />;
      case 'Students': return <Students currentUser={currentUser!} incidents={incidents} students={students} searchQuery={searchQuery} parents={parents} deviceLogs={deviceLogs} onAddStudent={addStudent} />;
      case 'Incidents': return <Incidents currentUser={currentUser!} incidents={incidents} students={students} incidentTypes={incidentTypes} onAddIncident={addIncident} onUpdateStatus={updateIncidentStatus} searchQuery={searchQuery} />;
      case 'Interventions': return <Interventions currentUser={currentUser!} students={students} interventions={interventions} onAddIntervention={addIntervention} />;
      case 'Reports': return <Reports currentUser={currentUser!} reports={reports} onGenerateReport={generateReport} />;
      case 'System Logs': return <SystemLogs logs={systemLogs} />;
      case 'User Management': return <UserManagement localUsers={registryUsers} onUpdateUser={updateRegistryUser} onSync={async () => { await addSystemLog('Manual Registry Synchronization', 'Audit'); }} />;
      default: return <Dashboard incidents={incidents} students={students} deviceLogs={deviceLogs} />;
    }
  };

  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-teal-500" /></div>;
  }

  if (!currentUser) return <Login onLogin={setCurrentUser} onLocalBypass={handleLocalBypass} />;

  return (
    <Layout user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} searchQuery={searchQuery} setSearchQuery={setSearchQuery} notifications={notifications} onMarkRead={() => setNotifications(prev => prev.map(n => ({...n, isRead: true})))}>
      {localMode && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Database size={18} className="text-amber-700" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-900">Local Resilience Mode Active</p>
              <p className="text-[10px] text-amber-700 font-medium">Bypassing Supabase Registry. All actions are simulated.</p>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="px-3 py-1.5 bg-amber-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Reconnect Sync</button>
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

const Loader2 = ({ className }: { className?: string }) => <div className={`w-8 h-8 border-4 border-slate-700 border-t-teal-500 rounded-full animate-spin ${className}`}></div>;

export default App;


import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, Loader2 } from 'lucide-react';
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
  const [localMode, setLocalMode] = useState(true); // Default to local mode for full functionality in demo
  
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>(MOCK_INCIDENT_TYPES);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [interventions, setInterventions] = useState<BehavioralIntervention[]>(MOCK_INTERVENTIONS);
  const [deviceLogs, setDeviceLogs] = useState<DeviceUsageRecord[]>(MOCK_DEVICE_LOGS);
  const [parents, setParents] = useState<ParentGuardian[]>(MOCK_PARENTS);
  const [reports, setReports] = useState<GeneratedReport[]>(MOCK_REPORTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(MOCK_SYSTEM_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [registryUsers, setRegistryUsers] = useState<User[]>(PREDEFINED_ACCOUNTS.map(a => a.user as User));

  useEffect(() => {
    // Initial load check
    setTimeout(() => setIsInitializing(false), 1000);
  }, []);

  const addSystemLog = (action: string, category: SystemLog['category']) => {
    if (!currentUser) return;
    const newLog: SystemLog = {
      id: `sl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      action,
      category,
      ip_address: 'Local-Session'
    };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  const handleLogout = () => {
    addSystemLog('User Initiated Logout', 'Access');
    setCurrentUser(null);
    setActiveTab('Dashboard');
  };

  const handleLocalBypass = (user: User) => {
    setCurrentUser(user);
    setActiveTab('Dashboard');
    addSystemLog('System Access Granted (Bypass)', 'Access');
  };

  // --- Functional Handlers ---

  const handleAddIncident = (newInc: Partial<Incident>) => {
    const inc: Incident = {
      id: `i-${Date.now()}`,
      student_id: newInc.student_id!,
      reported_by_user_id: currentUser!.id,
      incident_type_id: newInc.incident_type_id!,
      date_reported: new Date().toISOString(),
      date_occurred: new Date().toISOString(),
      location: newInc.location!,
      description: newInc.description!,
      immediate_action: newInc.immediate_action!,
      status: 'Pending'
    };
    setIncidents(prev => [inc, ...prev]);
    addSystemLog(`Registered behavioral incident for Student: ${inc.student_id}`, 'Registry');
    
    // Auto-notification
    const student = students.find(s => s.id === inc.student_id);
    setNotifications(prev => [{
      id: `n-${Date.now()}`,
      title: 'New Incident Reported',
      message: `${student?.last_name} report added to the registry for review.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'incident'
    }, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: Incident['status']) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
    addSystemLog(`Updated Incident #${id} status to ${status}`, 'Audit');
  };

  const handleAddStudent = async (data: Partial<Student>) => {
    const s: Student = {
      id: `s-${Date.now()}`,
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
    setStudents(prev => [s, ...prev]);
    addSystemLog(`Added new subject to Registry: ${s.first_name} ${s.last_name}`, 'Registry');
    return { data: s, error: null };
  };

  const handleAddIntervention = (data: Partial<BehavioralIntervention>) => {
    const int: BehavioralIntervention = {
      id: `int-${Date.now()}`,
      student_id: data.student_id!,
      assigned_by_user_id: currentUser!.id,
      intervention_type: data.intervention_type!,
      description: data.description!,
      start_date: new Date().toISOString(),
      status: 'Active'
    };
    setInterventions(prev => [int, ...prev]);
    addSystemLog(`Initialized intervention plan for Student: ${int.student_id}`, 'Registry');
  };

  const handleGenerateReport = (report: GeneratedReport) => {
    setReports(prev => [report, ...prev]);
    addSystemLog(`Generated system report: ${report.title}`, 'Audit');
  };

  const handleUpdateUser = (id: string, updates: Partial<User>) => {
    setRegistryUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    addSystemLog(`Modified Authority clearance for User ID: ${id}`, 'Security');
  };

  const renderContent = () => {
    if (!currentUser) return null;
    switch (activeTab) {
      case 'Dashboard': return <Dashboard incidents={incidents} students={students} deviceLogs={deviceLogs} />;
      case 'Students': return <Students currentUser={currentUser} incidents={incidents} students={students} searchQuery={searchQuery} parents={parents} deviceLogs={deviceLogs} onAddStudent={handleAddStudent} />;
      case 'Incidents': return <Incidents currentUser={currentUser} incidents={incidents} students={students} incidentTypes={incidentTypes} onAddIncident={handleAddIncident} onUpdateStatus={handleUpdateStatus} searchQuery={searchQuery} />;
      case 'Interventions': return <Interventions currentUser={currentUser} students={students} interventions={interventions} onAddIntervention={handleAddIntervention} />;
      case 'Reports': return <Reports currentUser={currentUser} reports={reports} onGenerateReport={handleGenerateReport} />;
      case 'System Logs': return <SystemLogs logs={systemLogs} />;
      case 'User Management': return <UserManagement localUsers={registryUsers} onUpdateUser={handleUpdateUser} onSync={async () => { addSystemLog('Registry Synchronization Initiated', 'Audit'); }} />;
      default: return <Dashboard incidents={incidents} students={students} deviceLogs={deviceLogs} />;
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black animate-bounce shadow-2xl">S</div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initializing Registry Protocol...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return <Login onLogin={(u) => { setCurrentUser(u); addSystemLog('Authorized Session Initialized', 'Access'); }} onLocalBypass={handleLocalBypass} />;

  return (
    <Layout user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} searchQuery={searchQuery} setSearchQuery={setSearchQuery} notifications={notifications} onMarkRead={() => setNotifications(prev => prev.map(n => ({...n, isRead: true})))}>
      {renderContent()}
    </Layout>
  );
};

export default App;

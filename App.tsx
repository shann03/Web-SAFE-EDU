
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
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
  
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [interventions, setInterventions] = useState<BehavioralIntervention[]>([]);
  const [deviceLogs, setDeviceLogs] = useState<DeviceUsageRecord[]>([]);
  const [parents, setParents] = useState<ParentGuardian[]>([]);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // PRIVACY LAYER: Filter data for parents
  const parentRecord = useMemo(() => {
    if (currentUser?.role !== 'Parent') return null;
    return parents.find(p => p.user_id === currentUser.id) || MOCK_PARENTS[0];
  }, [currentUser, parents]);

  const filteredStudents = useMemo(() => {
    if (currentUser?.role === 'Parent' && parentRecord) {
      return allStudents.filter(s => s.id === parentRecord.student_id);
    }
    return allStudents;
  }, [currentUser, allStudents, parentRecord]);

  const filteredIncidents = useMemo(() => {
    if (currentUser?.role === 'Parent' && parentRecord) {
      return allIncidents.filter(inc => inc.student_id === parentRecord.student_id);
    }
    return allIncidents;
  }, [currentUser, allIncidents, parentRecord]);

  const addSystemLog = useCallback(async (action: string, category: SystemLog['category']) => {
    if (!currentUser) return;
    const newLog: SystemLog = {
      id: `sl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      action,
      category,
      ip_address: 'Registry-Access'
    };
    setSystemLogs(prev => [newLog, ...prev]);
  }, [currentUser]);

  const fetchRegistryData = useCallback(async () => {
    setAllStudents(MOCK_STUDENTS);
    setAllIncidents(MOCK_INCIDENTS);
    setIncidentTypes(MOCK_INCIDENT_TYPES);
    setInterventions(MOCK_INTERVENTIONS);
    setDeviceLogs(MOCK_DEVICE_LOGS);
    setParents(MOCK_PARENTS);
    setReports(MOCK_REPORTS);
    setSystemLogs(MOCK_SYSTEM_LOGS);
    setNotifications(MOCK_NOTIFICATIONS);
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchRegistryData();
    } else {
      setIsInitializing(false);
    }
  }, [currentUser, fetchRegistryData]);

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('Dashboard');
  };

  const handleAddIncident = useCallback(async (newInc: Partial<Incident>) => {
    const incData: Incident = {
      id: `i-${Date.now()}`,
      student_id: newInc.student_id!,
      reported_by_user_id: currentUser!.id,
      incident_type_id: newInc.incident_type_id!,
      date_reported: new Date().toISOString(),
      date_occurred: newInc.date_occurred || new Date().toISOString(),
      location: newInc.location!,
      description: newInc.description!,
      immediate_action: newInc.immediate_action || 'Registry Entry',
      status: 'Pending',
      is_parent_reported: currentUser?.role === 'Parent',
      is_anonymous: newInc.is_anonymous || false
    };

    setAllIncidents(prev => [incData, ...prev]);
    addSystemLog(`Incident Recorded by ${currentUser?.role}`, 'Registry');
    
    if (currentUser?.role === 'Parent') {
      alert("Thank you. Your report has been submitted and will be reviewed.");
    }
  }, [currentUser, addSystemLog]);

  const handleUpdateStatus = useCallback(async (id: string, status: Incident['status']) => {
    setAllIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
  }, []);

  const renderContent = () => {
    if (!currentUser) return null;
    switch (activeTab) {
      case 'Dashboard': return <Dashboard incidents={filteredIncidents} students={filteredStudents} deviceLogs={deviceLogs} />;
      case 'Students': return <Students currentUser={currentUser} incidents={filteredIncidents} students={filteredStudents} searchQuery={searchQuery} parents={parents} deviceLogs={deviceLogs} onAddStudent={async() => {}} />;
      case 'Incidents': return <Incidents currentUser={currentUser} incidents={filteredIncidents} students={filteredStudents} incidentTypes={incidentTypes} onAddIncident={handleAddIncident} onUpdateStatus={handleUpdateStatus} searchQuery={searchQuery} />;
      case 'Interventions': return <Interventions currentUser={currentUser} students={filteredStudents} interventions={interventions} onAddIntervention={() => {}} />;
      case 'Reports': return <Reports currentUser={currentUser} reports={reports} onGenerateReport={() => {}} />;
      case 'System Logs': return <SystemLogs logs={systemLogs} />;
      case 'User Management': return <UserManagement localUsers={[]} onUpdateUser={() => {}} onSync={async() => {}} />;
      default: return <Dashboard incidents={filteredIncidents} students={filteredStudents} deviceLogs={deviceLogs} />;
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-900" />
      </div>
    );
  }

  if (!currentUser) return <Login onLogin={setCurrentUser} onLocalBypass={() => {}} />;

  return (
    <Layout user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} searchQuery={searchQuery} setSearchQuery={setSearchQuery} notifications={notifications} onMarkRead={() => {}}>
      {renderContent()}
    </Layout>
  );
};

export default App;

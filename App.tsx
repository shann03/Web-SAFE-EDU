
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Incidents from './pages/Incidents';
import Interventions from './pages/Interventions';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import SystemLogs from './pages/SystemLogs';
import Login from './pages/Login';
import { User, Incident, Student, BehavioralIntervention, DeviceUsageRecord, ParentGuardian, GeneratedReport, Notification, SystemLog } from './types';
import { MOCK_INCIDENTS, MOCK_STUDENTS, MOCK_INTERVENTIONS, MOCK_DEVICE_LOGS, MOCK_PARENTS, MOCK_REPORTS, MOCK_NOTIFICATIONS, MOCK_SYSTEM_LOGS } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Fully hydrated state
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [students] = useState<Student[]>(MOCK_STUDENTS);
  const [interventions, setInterventions] = useState<BehavioralIntervention[]>(MOCK_INTERVENTIONS);
  const [deviceLogs] = useState<DeviceUsageRecord[]>(MOCK_DEVICE_LOGS);
  const [parents] = useState<ParentGuardian[]>(MOCK_PARENTS);
  const [reports, setReports] = useState<GeneratedReport[]>(MOCK_REPORTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(MOCK_SYSTEM_LOGS);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('edutrack_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('edutrack_user');
      }
    }
    setIsInitializing(false);
  }, []);

  const addSystemLog = (action: string, category: SystemLog['category'], user?: User) => {
    const logUser = user || currentUser;
    if (!logUser) return;
    
    const newLog: SystemLog = {
      id: `l${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      user_id: logUser.id,
      user_name: logUser.full_name,
      action,
      category,
      ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`
    };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('edutrack_user', JSON.stringify(user));
    addSystemLog('System Authentication Successful', 'Access', user);
  };

  const handleLogout = () => {
    addSystemLog('User Initiated Logout', 'Access');
    setCurrentUser(null);
    localStorage.removeItem('edutrack_user');
    setActiveTab('Dashboard');
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `n${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addIncident = (newIncident: Incident) => {
    setIncidents(prev => [newIncident, ...prev]);
    const student = students.find(s => s.id === newIncident.student_id);
    const message = `${student?.first_name} ${student?.last_name} was reported for an event at ${newIncident.location}.`;
    
    addNotification({
      title: 'New Incident Reported',
      message,
      type: 'incident'
    });
    
    addSystemLog(`Created Incident Record for ${student?.last_name}`, 'Registry');
  };

  const updateIncidentStatus = (id: string, status: Incident['status']) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
    
    addNotification({
      title: 'Incident Status Updated',
      message: `Incident #${id} is now ${status}.`,
      type: 'system'
    });

    addSystemLog(`Modified Incident #${id} Status to ${status}`, 'Audit');
  };

  const addGeneratedReport = (report: GeneratedReport) => {
    setReports(prev => [report, ...prev]);
    
    addNotification({
      title: 'Report Generated',
      message: `The report "${report.title}" is now ready for review.`,
      type: 'report'
    });

    addSystemLog(`Generated System Report: ${report.type}`, 'Audit');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-slate-900 rounded-xl mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard incidents={incidents} students={students} />;
      case 'Students':
        return (
          <Students 
            currentUser={currentUser} 
            incidents={incidents} 
            students={students} 
            searchQuery={searchQuery}
            parents={parents}
            deviceLogs={deviceLogs}
          />
        );
      case 'Incidents':
        return (
          <Incidents 
            currentUser={currentUser} 
            incidents={incidents} 
            students={students} 
            onAddIncident={addIncident} 
            onUpdateStatus={updateIncidentStatus} 
            searchQuery={searchQuery} 
          />
        );
      case 'Interventions':
        return <Interventions currentUser={currentUser} incidents={incidents} students={students} interventions={interventions} />;
      case 'Reports':
        return <Reports currentUser={currentUser} reports={reports} onGenerateReport={addGeneratedReport} />;
      case 'System Logs':
        return <SystemLogs logs={systemLogs} />;
      case 'User Management':
        return <UserManagement />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h2 className="text-xl font-bold mb-2">{activeTab} Section</h2>
            <p className="max-w-md">The {activeTab} module is restricted or currently being optimized for your role as a {currentUser.role}.</p>
          </div>
        );
    }
  };

  return (
    <Layout 
      user={currentUser} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      notifications={notifications}
      onMarkRead={markAllNotificationsRead}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;

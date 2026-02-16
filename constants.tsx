
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  ShieldAlert, 
  ClipboardList, 
  Monitor, 
  Settings,
  Tablet
} from 'lucide-react';
import { Student, Incident, IncidentType, User, UserRole, ParentGuardian, BehavioralIntervention, DeviceUsageRecord, GeneratedReport, Notification, SystemLog } from './types';

export interface NavItem {
  name: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['Teacher', 'Counselor', 'Parent', 'Administrator'] },
  { name: 'Incidents', icon: <AlertTriangle size={20} />, roles: ['Teacher', 'Counselor', 'Parent', 'Administrator'] },
  { name: 'Students', icon: <Users size={20} />, roles: ['Teacher', 'Counselor', 'Administrator'] },
  { name: 'Interventions', icon: <ShieldAlert size={20} />, roles: ['Teacher', 'Counselor', 'Parent', 'Administrator'] },
  { name: 'Digital Safety', icon: <Tablet size={20} />, roles: ['Teacher', 'Counselor', 'Administrator'] },
  { name: 'Reports', icon: <ClipboardList size={20} />, roles: ['Counselor', 'Parent', 'Administrator'] },
  { name: 'System Logs', icon: <Monitor size={20} />, roles: ['Administrator'] },
  { name: 'User Management', icon: <Settings size={20} />, roles: ['Administrator'] },
];

export const MOCK_STUDENTS: Student[] = [
  { 
    id: 's1', 
    lrn: '101234567890', 
    first_name: 'Rafael', 
    last_name: 'Santos', 
    date_of_birth: '2008-05-15', 
    gender: 'Male', 
    grade_level: '10', 
    section: 'Mabini', 
    address: 'Bgy 1, Quezon City', 
    contact_number: '0917-123-4567',
    background: 'Rafael is a highly creative student with a passion for digital arts. He often struggles with time management during high-pressure exam periods.'
  },
  { 
    id: 's2', 
    lrn: '101234567891', 
    first_name: 'Maria Clara', 
    last_name: 'Dela Cruz', 
    date_of_birth: '2009-11-20', 
    gender: 'Female', 
    grade_level: '9', 
    section: 'Rizal', 
    address: 'Bgy 5, Manila', 
    contact_number: '0918-234-5678',
    background: 'Maria Clara is an academic achiever but has recently shown signs of social anxiety.'
  },
  { 
    id: 's3', 
    lrn: '101234567892', 
    first_name: 'Ethan James', 
    last_name: 'Miller', 
    date_of_birth: '2007-02-10', 
    gender: 'Male', 
    grade_level: '11', 
    section: 'Bonifacio', 
    address: 'Bgy 12, Makati', 
    contact_number: '0919-345-6789',
    background: 'Ethan is an athletic student who excels in team sports. He occasionally faces challenges with verbal altercations.'
  },
];

export const MOCK_INCIDENT_TYPES: IncidentType[] = [
  { id: 'it1', name: 'Bullying', description: 'Repeated harmful behavior towards a peer.' },
  { id: 'it2', name: 'Academic Dishonesty', description: 'Cheating, plagiarism, or unauthorized collaboration.' },
  { id: 'it3', name: 'Property Damage', description: 'Vandalism or accidental damage to school property.' },
  { id: 'it4', name: 'Verbal Altercation', description: 'Heated argument involving inappropriate language.' },
  { id: 'it5', name: 'Digital Misuse', description: 'Unauthorized access or inappropriate content consumption on school devices.' },
  { id: 'it6', name: 'Tardiness', description: 'Repeated failure to arrive on time.' },
  { id: 'it7', name: 'Disrespectful Language', description: 'Inappropriate language directed at staff or peers.' }
];

export const MOCK_INCIDENTS: Incident[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `mock-inc-${i + 1}`,
  student_id: `s${(i % 3) + 1}`,
  reported_by_user_id: 'u_teacher',
  incident_type_id: `it${(i % 7) + 1}`,
  date_reported: new Date(Date.now() - i * 86400000).toISOString(),
  date_occurred: new Date(Date.now() - i * 86400000).toISOString(),
  location: 'Main Hallway',
  description: 'Example incident log for behavioral tracking and resolution demonstration.',
  immediate_action: 'Counselor referral initiated.',
  status: i % 2 === 0 ? 'Resolved' : 'Pending',
  follow_up_notes: i % 2 === 0 ? 'Resolved via peer-to-peer mediation session.' : ''
}));

export const MOCK_USERS: User[] = [
  { id: 'u_admin', username: 'admin', email: 'admin@gmail.com', full_name: 'System Administrator', is_active: true, role: 'Administrator' },
  { id: 'u_teacher', username: 'teacher', email: 'teacher@gmail.com', full_name: 'Ms. Sarah Teacher', is_active: true, role: 'Teacher' },
  { id: 'u_counselor', username: 'counselor', email: 'counselor@gmail.com', full_name: 'Dr. John Counselor', is_active: true, role: 'Counselor' },
  { id: 'u_parent_demo', username: 'parent', email: 'parent@gmail.com', full_name: 'Elena Santos', is_active: true, role: 'Parent', linked_lrn: '101234567890' },
];

export const MOCK_SYSTEM_LOGS: SystemLog[] = [
  { id: 'log-1', timestamp: new Date().toISOString(), user_id: 'u_admin', user_name: 'System Admin', action: 'Registry database synchronized', category: 'Registry', ip_address: '127.0.0.1' },
];

export const MOCK_INTERVENTIONS: BehavioralIntervention[] = [
  { 
    id: 'int-1', 
    student_id: 's1', 
    assigned_by_user_id: 'u_counselor', 
    intervention_type: 'Counseling Session', 
    description: 'Weekly anger management and social skills training.', 
    start_date: new Date(Date.now() - 1209600000).toISOString(), 
    status: 'Active',
    history: [
      { id: 'm1', date: new Date(Date.now() - 1123200000).toISOString(), title: 'Initial Assessment', notes: 'Rafael was hesitant but acknowledged the impact of his stress on others.', outcome: 'Proceed with weekly sessions', recorded_by: 'Dr. John Counselor' }
    ]
  },
];

export const MOCK_REPORTS: GeneratedReport[] = [
  { id: 'rep-1', title: 'Q3 Behavioral Summary', type: 'Incident Summary', generated_by: 'Dr. John Counselor', date_generated: new Date().toISOString(), status: 'Ready', file_size: '2.4 MB' },
];

export const MOCK_PARENTS: ParentGuardian[] = MOCK_STUDENTS.map(s => ({
  id: `p${s.id}`,
  user_id: `u_parent_${s.id}`,
  student_id: s.id,
  first_name: s.gender === 'Male' ? 'Antonio' : 'Elena',
  last_name: s.last_name,
  relationship_to_student: s.gender === 'Male' ? 'Father' : 'Mother',
  contact_number: '0917-000-0000',
  email: `${s.last_name.toLowerCase()}@example.com`,
  address: s.address
}));

export const MOCK_DEVICE_LOGS: DeviceUsageRecord[] = [
  { id: 'dl-1', student_id: 's1', device_id: 'tab-01', usage_start: new Date(Date.now() - 1800000).toISOString(), usage_end: new Date().toISOString(), activity_description: 'Accessing restricted social media domain during instruction.', flagged: true },
  { id: 'dl-2', student_id: 's3', device_id: 'tab-05', usage_start: new Date(Date.now() - 3600000).toISOString(), usage_end: new Date().toISOString(), activity_description: 'Academic research on National Geographic.', flagged: false },
  { id: 'dl-3', student_id: 's2', device_id: 'tab-02', usage_start: new Date(Date.now() - 4500000).toISOString(), usage_end: new Date().toISOString(), activity_description: 'Attempted to bypass network firewall via proxy.', flagged: true },
  { id: 'dl-4', student_id: 's1', device_id: 'tab-01', usage_start: new Date(Date.now() - 9000000).toISOString(), usage_end: new Date().toISOString(), activity_description: 'Late-night device usage detected after 10 PM curfew.', flagged: true },
  { id: 'dl-5', student_id: 's2', device_id: 'tab-02', usage_start: new Date(Date.now() - 10000000).toISOString(), usage_end: new Date().toISOString(), activity_description: 'Collaborative project work on Google Docs.', flagged: false },
  { id: 'dl-6', student_id: 's3', device_id: 'tab-05', usage_start: new Date(Date.now() - 15000000).toISOString(), usage_end: new Date().toISOString(), activity_description: 'Accessing unauthorized gaming portal (Poki).', flagged: true },
  { id: 'dl-7', student_id: 's1', device_id: 'tab-01', usage_start: new Date(Date.now() - 20000000).toISOString(), usage_end: new Date().toISOString(), activity_description: 'Khan Academy mathematics module completed.', flagged: false },
  { id: 'dl-8', student_id: 's2', device_id: 'tab-02', usage_start: new Date(Date.now() - 25000000).toISOString(), usage_end: new Date().toISOString(), activity_description: 'Search history indicates interest in "how to hide browser history".', flagged: true },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New Incident Report', message: 'A new bullying report has been filed for Grade 10.', timestamp: new Date().toISOString(), isRead: false, type: 'incident' },
];

export const PREDEFINED_ACCOUNTS = [
  { email: 'admin@gmail.com', password: '12345678', user: MOCK_USERS[0] },
  { email: 'teacher@gmail.com', password: '12345678', user: MOCK_USERS[1] },
  { email: 'counselor@gmail.com', password: '12345678', user: MOCK_USERS[2] },
  { email: 'parent@gmail.com', password: '12345678', user: MOCK_USERS[3] }
];

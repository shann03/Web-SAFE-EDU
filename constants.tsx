
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  ShieldAlert, 
  ClipboardList, 
  Monitor, 
  Settings,
} from 'lucide-react';
import { Student, Incident, IncidentType, User, UserRole, ParentGuardian, BehavioralIntervention, DeviceUsageRecord, GeneratedReport, Notification, SystemLog } from './types';

export interface NavItem {
  name: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['Teacher', 'Counselor', 'Administrator'] },
  { name: 'Incidents', icon: <AlertTriangle size={20} />, roles: ['Teacher', 'Counselor', 'Administrator'] },
  { name: 'Students', icon: <Users size={20} />, roles: ['Teacher', 'Counselor', 'Administrator'] },
  { name: 'Interventions', icon: <ShieldAlert size={20} />, roles: ['Counselor', 'Administrator'] },
  { name: 'Reports', icon: <ClipboardList size={20} />, roles: ['Counselor', 'Administrator'] },
  { name: 'System Logs', icon: <Monitor size={20} />, roles: ['Administrator'] },
  { name: 'User Management', icon: <Settings size={20} />, roles: ['Administrator'] },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 's1', lrn: '101234567890', first_name: 'Rafael', last_name: 'Santos', date_of_birth: '2008-05-15', gender: 'Male', grade_level: '10', section: 'Mabini', address: 'Bgy 1, Quezon City', contact_number: '0917-123-4567' },
  { id: 's2', lrn: '101234567891', first_name: 'Maria Clara', last_name: 'Dela Cruz', date_of_birth: '2009-11-20', gender: 'Female', grade_level: '9', section: 'Rizal', address: 'Bgy 5, Manila', contact_number: '0918-234-5678' },
  { id: 's3', lrn: '101234567892', first_name: 'Ethan James', last_name: 'Miller', date_of_birth: '2007-02-10', gender: 'Male', grade_level: '11', section: 'Bonifacio', address: 'Bgy 12, Makati', contact_number: '0919-345-6789' },
  { id: 's4', lrn: '101234567893', first_name: 'Sofia', last_name: 'Ramos', date_of_birth: '2010-08-05', gender: 'Female', grade_level: '8', section: 'Luna', address: 'Bgy 3, Pasig', contact_number: '0920-456-7890' },
  { id: 's5', lrn: '101234567894', first_name: 'Juan Miguel', last_name: 'Luna', date_of_birth: '2011-03-25', gender: 'Male', grade_level: '7', section: 'Del Pilar', address: 'Bgy 8, Taguig', contact_number: '0921-567-8901' },
  { id: 's6', lrn: '101234567895', first_name: 'Chloe', last_name: 'Park', date_of_birth: '2008-12-12', gender: 'Female', grade_level: '10', section: 'Mabini', address: 'Bgy 2, Quezon City', contact_number: '0922-678-9012' },
  { id: 's7', lrn: '101234567896', first_name: 'Mohammad', last_name: 'Ali', date_of_birth: '2009-04-30', gender: 'Male', grade_level: '9', section: 'Rizal', address: 'Bgy 15, Manila', contact_number: '0923-789-0123' },
  { id: 's8', lrn: '101234567897', first_name: 'Isabella', last_name: 'Gomez', date_of_birth: '2007-06-18', gender: 'Female', grade_level: '11', section: 'Bonifacio', address: 'Bgy 22, Makati', contact_number: '0924-890-1234' },
  { id: 's9', lrn: '101234567898', first_name: 'Gabriel', last_name: 'Reyes', date_of_birth: '2010-01-01', gender: 'Male', grade_level: '8', section: 'Luna', address: 'Bgy 4, Pasig', contact_number: '0925-901-2345' },
  { id: 's10', lrn: '101234567899', first_name: 'Patricia', last_name: 'Lim', date_of_birth: '2011-09-09', gender: 'Female', grade_level: '7', section: 'Del Pilar', address: 'Bgy 9, Taguig', contact_number: '0926-012-3456' },
];

export const MOCK_PARENTS: ParentGuardian[] = MOCK_STUDENTS.map(s => ({
  id: `p${s.id}`,
  student_id: s.id,
  first_name: `${s.gender === 'Male' ? 'Antonio' : 'Elena'}`,
  last_name: s.last_name,
  relationship_to_student: s.gender === 'Male' ? 'Father' : 'Mother',
  contact_number: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
  email: `${s.last_name.toLowerCase()}.${s.first_name.toLowerCase()}@guardian.ph`,
  address: s.address
}));

export const MOCK_INCIDENT_TYPES: IncidentType[] = [
  { id: 'it1', name: 'Bullying', description: 'Repeated harmful behavior towards a peer.' },
  { id: 'it2', name: 'Academic Dishonesty', description: 'Cheating, plagiarism, or unauthorized collaboration.' },
  { id: 'it3', name: 'Property Damage', description: 'Vandalism or accidental damage to school property.' },
  { id: 'it4', name: 'Verbal Altercation', description: 'Heated argument involving inappropriate language.' },
  { id: 'it5', name: 'Digital Misuse', description: 'Unauthorized access or inappropriate content consumption on school devices.' },
  { id: 'it6', name: 'Tardiness', description: 'Repeated failure to arrive on time.' },
  { id: 'it7', name: 'Disrespectful Language', description: 'Inappropriate language directed at staff or peers.' }
];

export const MOCK_INCIDENTS: Incident[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `i${i+1}`,
  student_id: `s${(i % 10) + 1}`,
  reported_by_user_id: i % 3 === 0 ? 'u_teacher' : 'u_counselor',
  incident_type_id: `it${(i % 7) + 1}`,
  date_reported: new Date(2024, 2, 1 + (i % 28)).toISOString(),
  date_occurred: new Date(2024, 2, 1 + (i % 28), 10, 15).toISOString(),
  location: i % 4 === 0 ? 'Science Laboratory' : i % 4 === 1 ? 'Library' : i % 4 === 2 ? 'Playground' : 'Corridor',
  description: [
    'Found using a smartphone to look up answers during a summative test.',
    'Repeatedly interrupting class discussion with disrespectful remarks.',
    'Accidentally broke a microscope during group activity.',
    'Aggressive verbal exchange with a peer over a group project disagreement.',
    'Accessing age-inappropriate websites during a free computer period.',
    'Persistent bullying of younger students during dismissal.'
  ][i % 6],
  immediate_action: 'Verbal warning issued; formal referral to the Guidance Office submitted.',
  status: i % 4 === 0 ? 'Resolved' : i % 4 === 1 ? 'Investigating' : i % 4 === 2 ? 'Pending' : 'Closed'
}));

export const MOCK_INTERVENTIONS: BehavioralIntervention[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `int${i+1}`,
  student_id: `s${(i % 10) + 1}`,
  assigned_by_user_id: 'u_counselor',
  intervention_type: i % 4 === 0 ? 'One-on-One Counseling' : i % 4 === 1 ? 'Behavioral Contract' : i % 4 === 2 ? 'Social Skills Workshop' : 'Parent Liaison Conference',
  description: 'Developing self-regulation strategies and conflict resolution skills.',
  start_date: new Date(2024, 1, 15 + i).toISOString(),
  status: i % 5 === 0 ? 'Completed' : 'Active'
}));

export const MOCK_DEVICE_LOGS: DeviceUsageRecord[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `log${i+1}`,
  student_id: `s${(i % 10) + 1}`,
  device_id: `DEPED-TAB-${100 + i}`,
  usage_start: new Date(2024, 2, 10, 8, 30).toISOString(),
  usage_end: new Date(2024, 2, 10, 10, 0).toISOString(),
  activity_description: i % 5 === 0 ? 'Flagged: Accessing restricted gaming URL.' : 'Accessing LRMDS portal for science modules.',
  flagged: i % 5 === 0
}));

export const MOCK_REPORTS: GeneratedReport[] = [
  { id: 'rep1', title: 'Monthly Safety Audit - March 2024', type: 'Digital Safety Audit', generated_by: 'Sarah Admin', date_generated: '2024-03-01T08:00:00Z', status: 'Ready', file_size: '3.1 MB' },
  { id: 'rep2', title: 'Q1 Behavioral Pattern Analysis', type: 'Welfare Progress', generated_by: 'Mark Counselor', date_generated: '2024-03-05T14:20:00Z', status: 'Ready', file_size: '1.8 MB' },
  { id: 'rep3', title: 'Incident Prevalence Report', type: 'Incident Summary', generated_by: 'Sarah Admin', date_generated: '2024-03-10T10:00:00Z', status: 'Ready', file_size: '4.5 MB' },
  { id: 'rep4', title: 'System Access & Security Audit', type: 'Annual Review', generated_by: 'Sarah Admin', date_generated: '2024-03-12T09:15:00Z', status: 'Ready', file_size: '2.2 MB' },
];

export const MOCK_SYSTEM_LOGS: SystemLog[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `sl${i+1}`,
  timestamp: new Date(Date.now() - (i * 1000 * 60 * 45)).toISOString(),
  user_id: i % 3 === 0 ? 'u_admin' : i % 3 === 1 ? 'u_teacher' : 'u_counselor',
  user_name: i % 3 === 0 ? 'Sarah Admin' : i % 3 === 1 ? 'Jane Teacher' : 'Mark Counselor',
  action: [
    'Modified Authority Access Clearance',
    'Reported New Behavioral Incident',
    'Updated Student PII Data',
    'Generated Annual Compliance Audit',
    'Verified Biometric Identity',
    'Initialized Crisis Intervention Plan'
  ][i % 6],
  category: i % 4 === 0 ? 'Security' : i % 4 === 1 ? 'Registry' : i % 4 === 2 ? 'Audit' : 'Access',
  ip_address: `192.168.10.${100 + i}`
}));

// Added missing MOCK_NOTIFICATIONS to fix the error in App.tsx
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'New Incident Reported',
    message: 'Bullying report for Rafael Santos is awaiting review.',
    timestamp: new Date().toISOString(),
    isRead: false,
    type: 'incident'
  },
  {
    id: 'n2',
    title: 'System Audit Ready',
    message: 'The Q1 Safety Audit has been generated successfully.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: true,
    type: 'report'
  },
  {
    id: 'n3',
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected from unauthorized IP.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isRead: false,
    type: 'system'
  }
];

export const PREDEFINED_ACCOUNTS = [
  {
    email: 'teacher@gmail.com',
    password: '12345678',
    user: { id: 'u_teacher', username: 'teacher_jane', email: 'teacher@gmail.com', full_name: 'Jane Teacher', is_active: true, role: 'Teacher' as const }
  },
  {
    email: 'counselor@gmail.com',
    password: '12345678',
    user: { id: 'u_counselor', username: 'counselor_mark', email: 'counselor@gmail.com', full_name: 'Mark Counselor', is_active: true, role: 'Counselor' as const }
  },
  {
    email: 'admin@gmail.com',
    password: '12345678',
    user: { id: 'u_admin', username: 'admin_sarah', email: 'admin@gmail.com', full_name: 'Sarah Admin', is_active: true, role: 'Administrator' as const }
  }
];

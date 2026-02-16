
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
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['Teacher', 'Counselor', 'Parent'] },
  { name: 'Incidents', icon: <AlertTriangle size={20} />, roles: ['Teacher', 'Counselor', 'Parent'] },
  { name: 'Students', icon: <Users size={20} />, roles: ['Teacher', 'Counselor'] },
  { name: 'Interventions', icon: <ShieldAlert size={20} />, roles: ['Counselor', 'Parent'] },
  { name: 'Reports', icon: <ClipboardList size={20} />, roles: ['Counselor'] },
  { name: 'System Logs', icon: <Monitor size={20} />, roles: ['Teacher', 'Counselor'] },
  { name: 'User Management', icon: <Settings size={20} />, roles: ['Counselor'] },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 's1', lrn: '101234567890', first_name: 'Rafael', last_name: 'Santos', date_of_birth: '2008-05-15', gender: 'Male', grade_level: '10', section: 'Mabini', address: 'Bgy 1, Quezon City', contact_number: '0917-123-4567' },
  { id: 's2', lrn: '101234567891', first_name: 'Maria Clara', last_name: 'Dela Cruz', date_of_birth: '2009-11-20', gender: 'Female', grade_level: '9', section: 'Rizal', address: 'Bgy 5, Manila', contact_number: '0918-234-5678' },
  { id: 's3', lrn: '101234567892', first_name: 'Ethan James', last_name: 'Miller', date_of_birth: '2007-02-10', gender: 'Male', grade_level: '11', section: 'Bonifacio', address: 'Bgy 12, Makati', contact_number: '0919-345-6789' },
  { id: 's4', lrn: '101234567893', first_name: 'Sofia', last_name: 'Ramos', date_of_birth: '2010-08-05', gender: 'Female', grade_level: '8', section: 'Luna', address: 'Bgy 3, Pasig', contact_number: '0920-456-7890' },
  { id: 's5', lrn: '101234567894', first_name: 'Juan Miguel', last_name: 'Luna', date_of_birth: '2011-03-25', gender: 'Male', grade_level: '7', section: 'Del Pilar', address: 'Bgy 8, Taguig', contact_number: '0921-567-8901' },
];

export const MOCK_PARENTS: ParentGuardian[] = MOCK_STUDENTS.map(s => ({
  id: `p${s.id}`,
  user_id: `u_parent_${s.id}`,
  student_id: s.id,
  first_name: `${s.gender === 'Male' ? 'Antonio' : 'Elena'}`,
  last_name: s.last_name,
  relationship_to_student: s.gender === 'Male' ? 'Father' : 'Mother',
  contact_number: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
  email: `${s.last_name.toLowerCase()}@guardian.ph`,
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

export const MOCK_INCIDENTS: Incident[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `i${i+1}`,
  student_id: `s${(i % 5) + 1}`,
  reported_by_user_id: 'u_teacher',
  incident_type_id: `it${(i % 7) + 1}`,
  date_reported: new Date().toISOString(),
  date_occurred: new Date().toISOString(),
  location: 'Classroom',
  description: 'Regular behavioral log entry.',
  immediate_action: 'Verbal warning.',
  status: 'Pending'
}));

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
    email: 'parent@gmail.com',
    password: '12345678',
    user: { id: 'u_parent_s1', username: 'parent_antonio', email: 'parent@gmail.com', full_name: 'Antonio Santos', is_active: true, role: 'Parent' as const }
  }
];

export const MOCK_INTERVENTIONS: BehavioralIntervention[] = [];
export const MOCK_DEVICE_LOGS: DeviceUsageRecord[] = [];
export const MOCK_REPORTS: GeneratedReport[] = [];
export const MOCK_SYSTEM_LOGS: SystemLog[] = [];
export const MOCK_NOTIFICATIONS: Notification[] = [];

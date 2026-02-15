
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
  { id: 's11', lrn: '101234567900', first_name: 'David', last_name: 'Tan', date_of_birth: '2008-07-20', gender: 'Male', grade_level: '10', section: 'Jacinto', address: 'Bgy 10, Quezon City', contact_number: '0927-123-4567' },
  { id: 's12', lrn: '101234567901', first_name: 'Angela', last_name: 'Garcia', date_of_birth: '2009-02-14', gender: 'Female', grade_level: '9', section: 'Aguinaldo', address: 'Bgy 6, Manila', contact_number: '0928-234-5678' },
  { id: 's13', lrn: '101234567902', first_name: 'Jerome', last_name: 'Pineda', date_of_birth: '2007-11-30', gender: 'Male', grade_level: '11', section: 'Silang', address: 'Bgy 14, Makati', contact_number: '0929-345-6789' },
  { id: 's14', lrn: '101234567903', first_name: 'Samantha', last_name: 'Wright', date_of_birth: '2010-05-05', gender: 'Female', grade_level: '8', section: 'Lopez Jaena', address: 'Bgy 5, Pasig', contact_number: '0930-456-7890' },
  { id: 's15', lrn: '101234567904', first_name: 'Kevin', last_name: 'Chen', date_of_birth: '2011-12-25', gender: 'Male', grade_level: '7', section: 'Dagohoy', address: 'Bgy 11, Taguig', contact_number: '0931-567-8901' },
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

export const MOCK_INCIDENTS: Incident[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `i${i+1}`,
  student_id: `s${(i % 15) + 1}`,
  reported_by_user_id: i % 3 === 0 ? 'u_teacher' : 'u_counselor',
  incident_type_id: `it${(i % 7) + 1}`,
  date_reported: new Date(2023, 10, 1 + (i % 28)).toISOString(),
  date_occurred: new Date(2023, 10, 1 + (i % 28), 9, 30).toISOString(),
  location: i % 3 === 0 ? 'Computer Lab' : i % 3 === 1 ? 'Cafeteria' : 'Main Gate',
  description: [
    'Flagged for accessing unauthorized gaming sites during research hours.',
    'Observed mocking a classmate regarding academic performance.',
    'Accidentally shattered a window during a rough-housing incident.',
    'Used inappropriate gestures during the flag ceremony.',
    'Late for 3 consecutive days without a valid excuse.'
  ][i % 5],
  immediate_action: 'Counseling referral initiated and parent notified via SMS.',
  status: i % 5 === 0 ? 'Resolved' : i % 5 === 1 ? 'Investigating' : 'Pending'
}));

export const MOCK_INTERVENTIONS: BehavioralIntervention[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `int${i+1}`,
  student_id: `s${(i % 15) + 1}`,
  assigned_by_user_id: 'u_counselor',
  intervention_type: i % 3 === 0 ? 'Counseling Session' : i % 3 === 1 ? 'Digital Wellness Plan' : 'Parent-Teacher Conference',
  description: 'Bi-weekly monitoring of behavior and peer interactions.',
  start_date: new Date(2023, 11, 1 + i).toISOString(),
  status: i % 4 === 0 ? 'Completed' : 'Active'
}));

export const MOCK_DEVICE_LOGS: DeviceUsageRecord[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `log${i+1}`,
  student_id: `s${(i % 15) + 1}`,
  device_id: `Tab-${100 + i}`,
  usage_start: new Date(2023, 11, 15, 10, 0).toISOString(),
  usage_end: new Date(2023, 11, 15, 11, 0).toISOString(),
  activity_description: i % 6 === 0 ? 'Browsing non-educational social media.' : 'Accessing DepEd Commons modules.',
  flagged: i % 6 === 0
}));

export const MOCK_REPORTS: GeneratedReport[] = [
  { id: 'rep1', title: 'Q3 Behavioral Compliance Audit', type: 'Digital Safety Audit', generated_by: 'Sarah Admin', date_generated: '2023-11-20T10:00:00Z', status: 'Ready', file_size: '2.4 MB' },
  { id: 'rep2', title: 'Monthly Incident Summary - Nov 2023', type: 'Incident Summary', generated_by: 'Sarah Admin', date_generated: '2023-11-30T16:00:00Z', status: 'Ready', file_size: '1.1 MB' },
  { id: 'rep3', title: 'Student Welfare Progress Report', type: 'Welfare Progress', generated_by: 'Mark Counselor', date_generated: '2023-12-01T09:00:00Z', status: 'Ready', file_size: '0.8 MB' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Security Alert', message: 'Unauthorized device access attempt flagged in Computer Lab 2.', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), isRead: false, type: 'system' },
  { id: 'n2', title: 'New Intervention Assigned', message: 'You have been assigned to Maria Clara Dela Cruz for a Growth Plan.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), isRead: false, type: 'incident' },
];

export const MOCK_SYSTEM_LOGS: SystemLog[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `l${i+1}`,
  timestamp: new Date(Date.now() - (i * 1000 * 60 * 30)).toISOString(),
  user_id: i % 2 === 0 ? 'u_admin' : 'u_teacher',
  user_name: i % 2 === 0 ? 'Sarah Admin' : 'Jane Teacher',
  action: [
    'Updated Authority Registry Credentials',
    'Reported Behavioral Incident',
    'Accessed Student PII Records',
    'Generated Compliance Audit',
    'Flagged Device Policy Violation'
  ][i % 5],
  category: i % 5 === 0 ? 'Security' : i % 5 === 1 ? 'Registry' : 'Audit',
  ip_address: `192.168.1.${100 + i}`
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
    email: 'admin@gmail.com',
    password: '12345678',
    user: { id: 'u_admin', username: 'admin_sarah', email: 'admin@gmail.com', full_name: 'Sarah Admin', is_active: true, role: 'Administrator' as const }
  }
];

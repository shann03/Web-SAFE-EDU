
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
  { id: 's1', lrn: '101234567890', first_name: 'Rafael', last_name: 'Santos', date_of_birth: '2008-05-15', gender: 'Male', grade_level: 'Grade 10', section: 'Mabini', address: 'Bgy 1, Quezon City', contact_number: '0917-123-4567' },
  { id: 's2', lrn: '101234567891', first_name: 'Maria Clara', last_name: 'Dela Cruz', date_of_birth: '2009-11-20', gender: 'Female', grade_level: 'Grade 9', section: 'Rizal', address: 'Bgy 5, Manila', contact_number: '0918-234-5678' },
  { id: 's3', lrn: '101234567892', first_name: 'Ethan James', last_name: 'Miller', date_of_birth: '2007-02-10', gender: 'Male', grade_level: 'Grade 11', section: 'Bonifacio', address: 'Bgy 12, Makati', contact_number: '0919-345-6789' },
  { id: 's4', lrn: '101234567893', first_name: 'Sofia', last_name: 'Ramos', date_of_birth: '2010-08-05', gender: 'Female', grade_level: 'Grade 8', section: 'Luna', address: 'Bgy 3, Pasig', contact_number: '0920-456-7890' },
  { id: 's5', lrn: '101234567894', first_name: 'Juan Miguel', last_name: 'Luna', date_of_birth: '2011-03-25', gender: 'Male', grade_level: 'Grade 7', section: 'Del Pilar', address: 'Bgy 8, Taguig', contact_number: '0921-567-8901' },
  { id: 's6', lrn: '101234567895', first_name: 'Chloe', last_name: 'Park', date_of_birth: '2008-12-12', gender: 'Female', grade_level: 'Grade 10', section: 'Mabini', address: 'Bgy 2, Quezon City', contact_number: '0922-678-9012' },
  { id: 's7', lrn: '101234567896', first_name: 'Mohammad', last_name: 'Ali', date_of_birth: '2009-04-30', gender: 'Male', grade_level: 'Grade 9', section: 'Rizal', address: 'Bgy 15, Manila', contact_number: '0923-789-0123' },
  { id: 's8', lrn: '101234567897', first_name: 'Isabella', last_name: 'Gomez', date_of_birth: '2007-06-18', gender: 'Female', grade_level: 'Grade 11', section: 'Bonifacio', address: 'Bgy 22, Makati', contact_number: '0924-890-1234' },
  { id: 's9', lrn: '101234567898', first_name: 'Gabriel', last_name: 'Reyes', date_of_birth: '2010-01-01', gender: 'Male', grade_level: 'Grade 8', section: 'Luna', address: 'Bgy 4, Pasig', contact_number: '0925-901-2345' },
  { id: 's10', lrn: '101234567899', first_name: 'Patricia', last_name: 'Lim', date_of_birth: '2011-09-09', gender: 'Female', grade_level: 'Grade 7', section: 'Del Pilar', address: 'Bgy 9, Taguig', contact_number: '0926-012-3456' },
  { id: 's11', lrn: '101234567900', first_name: 'David', last_name: 'Tan', date_of_birth: '2008-07-20', gender: 'Male', grade_level: 'Grade 10', section: 'Jacinto', address: 'Bgy 10, Quezon City', contact_number: '0927-123-4567' },
  { id: 's12', lrn: '101234567901', first_name: 'Angela', last_name: 'Garcia', date_of_birth: '2009-02-14', gender: 'Female', grade_level: 'Grade 9', section: 'Aguinaldo', address: 'Bgy 6, Manila', contact_number: '0928-234-5678' },
  { id: 's13', lrn: '101234567902', first_name: 'Jerome', last_name: 'Pineda', date_of_birth: '2007-11-30', gender: 'Male', grade_level: 'Grade 11', section: 'Silang', address: 'Bgy 14, Makati', contact_number: '0929-345-6789' },
  { id: 's14', lrn: '101234567903', first_name: 'Samantha', last_name: 'Wright', date_of_birth: '2010-05-05', gender: 'Female', grade_level: 'Grade 8', section: 'Lopez Jaena', address: 'Bgy 5, Pasig', contact_number: '0930-456-7890' },
  { id: 's15', lrn: '101234567904', first_name: 'Kevin', last_name: 'Chen', date_of_birth: '2011-12-25', gender: 'Male', grade_level: 'Grade 7', section: 'Dagohoy', address: 'Bgy 11, Taguig', contact_number: '0931-567-8901' },
  { id: 's16', lrn: '101234567905', first_name: 'Lianne', last_name: 'Sy', date_of_birth: '2008-03-03', gender: 'Female', grade_level: 'Grade 10', section: 'Jacinto', address: 'Bgy 11, Quezon City', contact_number: '0932-678-9012' },
  { id: 's17', lrn: '101234567906', first_name: 'Brandon', last_name: 'Lee', date_of_birth: '2009-10-10', gender: 'Male', grade_level: 'Grade 9', section: 'Aguinaldo', address: 'Bgy 7, Manila', contact_number: '0933-789-0123' },
  { id: 's18', lrn: '101234567907', first_name: 'Fatima', last_name: 'Mendoza', date_of_birth: '2007-01-01', gender: 'Female', grade_level: 'Grade 11', section: 'Silang', address: 'Bgy 15, Makati', contact_number: '0934-890-1234' },
  { id: 's19', lrn: '101234567908', first_name: 'Carlos', last_name: 'Villa', date_of_birth: '2010-06-06', gender: 'Male', grade_level: 'Grade 8', section: 'Lopez Jaena', address: 'Bgy 6, Pasig', contact_number: '0935-901-2345' },
  { id: 's20', lrn: '101234567909', first_name: 'Jasmine', last_name: 'Flores', date_of_birth: '2012-01-20', gender: 'Female', grade_level: 'Grade 7', section: 'Dagohoy', address: 'Bgy 12, Taguig', contact_number: '0936-012-3456' },
];

export const MOCK_PARENTS: ParentGuardian[] = MOCK_STUDENTS.map(s => ({
  id: `p${s.id}`,
  first_name: `Parent of ${s.first_name}`,
  last_name: s.last_name,
  relationship_to_student: 'Mother',
  contact_number: '0999-000-0000',
  email: `parent.${s.last_name.toLowerCase()}@email.com`,
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

export const MOCK_INCIDENTS: Incident[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `i${i+1}`,
  student_id: `s${(i % 20) + 1}`,
  reported_by_user_id: i % 3 === 0 ? 'u_teacher' : 'u_counselor',
  incident_type_id: `it${(i % 7) + 1}`,
  date_reported: new Date(2023, 9, 1 + i).toISOString(),
  date_occurred: new Date(2023, 9, 1 + i, 9, 0).toISOString(),
  location: i % 2 === 0 ? 'Classroom' : 'Cafeteria',
  description: i % 5 === 0 ? 'Observed using phone for non-academic tasks.' : 'Engaged in a loud verbal dispute during transition period.',
  immediate_action: 'Verbal warning and referral to guidance.',
  status: i % 4 === 0 ? 'Resolved' : i % 4 === 1 ? 'Investigating' : 'Pending'
}));

export const MOCK_INTERVENTIONS: BehavioralIntervention[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `int${i+1}`,
  student_id: `s${(i % 20) + 1}`,
  assigned_by_user_id: 'u_counselor',
  intervention_type: i % 2 === 0 ? 'Counseling Session' : 'Growth Plan',
  description: 'Ongoing support for behavioral improvement.',
  start_date: new Date(2023, 10, 1 + i).toISOString(),
  end_date: i % 3 === 0 ? new Date(2023, 11, 1 + i).toISOString() : undefined,
  status: i % 3 === 0 ? 'Completed' : 'Active'
}));

export const MOCK_DEVICE_LOGS: DeviceUsageRecord[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `log${i+1}`,
  student_id: `s${(i % 20) + 1}`,
  device_id: 'Tablet-402',
  usage_start: new Date(2023, 10, 15, 10, 0).toISOString(),
  usage_end: new Date(2023, 10, 15, 11, 0).toISOString(),
  activity_description: i % 4 === 0 ? 'Browsing unapproved social media.' : 'Accessed educational modules.',
  flagged: i % 4 === 0
}));

export const MOCK_REPORTS: GeneratedReport[] = [
  { id: 'rep1', title: 'Monthly Behavioral Summary - Oct 2023', type: 'Incident Summary', generated_by: 'Sarah Admin', date_generated: '2023-10-31T16:00:00Z', status: 'Ready', file_size: '1.2 MB' },
  { id: 'rep2', title: 'Digital Safety Compliance Audit Q3', type: 'Digital Safety Audit', generated_by: 'Sarah Admin', date_generated: '2023-10-15T10:30:00Z', status: 'Ready', file_size: '2.5 MB' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New Incident Reported', message: 'Rafael Santos has been reported for Digital Misuse in the Canteen.', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), isRead: false, type: 'incident' },
  { id: 'n2', title: 'Report Ready', message: 'Monthly Behavioral Summary - Oct 2023 is now available for download.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), isRead: false, type: 'report' },
  { id: 'n3', title: 'System Maintenance', message: 'SAFE-EDU will undergo scheduled maintenance on Sunday at 2 AM.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), isRead: true, type: 'system' },
];

export const MOCK_SYSTEM_LOGS: SystemLog[] = [
  { id: 'l1', timestamp: new Date().toISOString(), user_id: 'u_admin', user_name: 'Sarah Admin', action: 'Authorized System Login', category: 'Access', ip_address: '192.168.1.102' },
  { id: 'l2', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), user_id: 'u_teacher', user_name: 'Jane Teacher', action: 'Reported Behavioral Incident #i102', category: 'Registry', ip_address: '192.168.1.144' },
  { id: 'l3', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), user_id: 'u_admin', user_name: 'Sarah Admin', action: 'Exported Compliance Report Q3', category: 'Audit', ip_address: '192.168.1.102' },
  { id: 'l4', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), user_id: 'u_counselor', user_name: 'Mark Counselor', action: 'Initialized Welfare Roadmap for s1', category: 'Registry', ip_address: '192.168.1.201' },
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

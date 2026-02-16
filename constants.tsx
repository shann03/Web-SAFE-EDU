
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
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['Teacher', 'Counselor', 'Parent', 'Administrator'] },
  { name: 'Incidents', icon: <AlertTriangle size={20} />, roles: ['Teacher', 'Counselor', 'Parent', 'Administrator'] },
  { name: 'Students', icon: <Users size={20} />, roles: ['Teacher', 'Counselor', 'Administrator'] },
  { name: 'Interventions', icon: <ShieldAlert size={20} />, roles: ['Teacher', 'Counselor', 'Parent', 'Administrator'] },
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
    background: 'Rafael is a highly creative student with a passion for digital arts. He often struggles with time management during high-pressure exam periods, which sometimes leads to minor behavioral outbursts. He has a strong support system at home and responds well to positive reinforcement from mentors.'
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
    background: 'Maria Clara is an academic achiever but has recently shown signs of social anxiety. She is quiet in class and tends to isolate herself during breaks. Her background indicates a history of moving between schools frequently, making it difficult for her to form long-term peer connections.'
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
    background: 'Ethan is an athletic student who excels in team sports. He occasionally faces challenges with verbal altercations when he feels a sense of injustice. He is currently under a "Strategic Focus" intervention to improve his conflict resolution skills through peer-mediation training.'
  },
  { 
    id: 's4', 
    lrn: '101234567893', 
    first_name: 'Sofia', 
    last_name: 'Ramos', 
    date_of_birth: '2010-08-05', 
    gender: 'Female', 
    grade_level: '8', 
    section: 'Luna', 
    address: 'Bgy 3, Pasig', 
    contact_number: '0920-456-7890',
    background: 'Sofia is very technically savvy but was previously flagged for "Digital Misuse" (accessing non-educational sites). She is now a student ambassador for the school\'s Cyber-Safety program, helping peers understand the importance of maintaining a clean digital footprint.'
  },
  { 
    id: 's5', 
    lrn: '101234567894', 
    first_name: 'Juan Miguel', 
    last_name: 'Luna', 
    date_of_birth: '2011-03-25', 
    gender: 'Male', 
    grade_level: '7', 
    section: 'Del Pilar', 
    address: 'Bgy 8, Taguig', 
    contact_number: '0921-567-8901',
    background: 'Juan is a transition-year student who is still adjusting to the workload of secondary education. He is friendly and helpful but has a history of tardiness. Educators are focused on building his organizational habits and morning routines.'
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
  student_id: `s${(i % 5) + 1}`,
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
  { id: 'log-2', timestamp: new Date(Date.now() - 3600000).toISOString(), user_id: 'u_admin', user_name: 'System Admin', action: 'User "parent@gmail.com" authorized', category: 'Security', ip_address: '127.0.0.1' },
  { id: 'log-3', timestamp: new Date(Date.now() - 7200000).toISOString(), user_id: 'u_teacher', user_name: 'Ms. Sarah Teacher', action: 'Incident report I-9042 submitted', category: 'Registry', ip_address: '192.168.1.45' },
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
    related_incident_ids: ['mock-inc-1', 'mock-inc-6'],
    attachments: [
      { id: 'att-1', name: 'Intake_Assessment_Form.pdf', type: 'PDF', size: '450 KB', date_attached: new Date(Date.now() - 1209600000).toISOString() },
      { id: 'att-2', name: 'Parental_Consent_Release.pdf', type: 'PDF', size: '210 KB', date_attached: new Date(Date.now() - 1123200000).toISOString() }
    ],
    history: [
      { id: 'm1', date: new Date(Date.now() - 1123200000).toISOString(), title: 'Initial Assessment', notes: 'Rafael was hesitant but acknowledged the impact of his stress on others.', outcome: 'Proceed with weekly sessions', recorded_by: 'Dr. John Counselor' },
      { id: 'm2', date: new Date(Date.now() - 604800000).toISOString(), title: 'Session 1: Stress Triggers', notes: 'Identified that math exams are a major trigger. Developed breathing exercises.', outcome: 'Positive engagement', recorded_by: 'Dr. John Counselor' },
      { id: 'm3', date: new Date(Date.now() - 86400000).toISOString(), title: 'Parent Check-in', notes: 'Mother reports Rafael is using exercises at home.', outcome: 'Visible progress in self-regulation', recorded_by: 'Dr. John Counselor' }
    ]
  },
  { 
    id: 'int-2', 
    student_id: 's2', 
    assigned_by_user_id: 'u_counselor', 
    intervention_type: 'Parent Meeting', 
    description: 'Discussion on digital habits and academic focus.', 
    start_date: new Date(Date.now() - 172800000).toISOString(), 
    status: 'Completed',
    related_incident_ids: ['mock-inc-2'],
    attachments: [
      { id: 'att-3', name: 'Digital_Usage_Contract.pdf', type: 'PDF', size: '1.2 MB', date_attached: new Date(Date.now() - 172800000).toISOString() }
    ],
    history: [
      { id: 'm4', date: new Date(Date.now() - 172800000).toISOString(), title: 'Tripartite Meeting', notes: 'Discussed balancing social media use with study hours.', outcome: 'Signed digital usage contract', recorded_by: 'Dr. John Counselor' },
      { id: 'm5', date: new Date().toISOString(), title: 'Final Review', notes: 'Student has shown consistent attendance and improved grades.', outcome: 'Case closed - monitoring status', recorded_by: 'Dr. John Counselor' }
    ]
  },
];

export const MOCK_REPORTS: GeneratedReport[] = [
  { id: 'rep-1', title: 'Q3 Behavioral Summary', type: 'Incident Summary', generated_by: 'Dr. John Counselor', date_generated: new Date().toISOString(), status: 'Ready', file_size: '2.4 MB' },
  { id: 'rep-2', title: 'Digital Safety Audit - Nov', type: 'Digital Safety Audit', generated_by: 'System Admin', date_generated: new Date(Date.now() - 86400000).toISOString(), status: 'Ready', file_size: '1.8 MB' },
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
  { id: 'dl-1', student_id: 's1', device_id: 'tab-01', usage_start: new Date().toISOString(), usage_end: new Date().toISOString(), activity_description: 'Accessing unauthorized gaming site during class.', flagged: true },
  { id: 'dl-2', student_id: 's3', device_id: 'tab-05', usage_start: new Date().toISOString(), usage_end: new Date().toISOString(), activity_description: 'Educational research on Wikipedia.', flagged: false },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New Incident Report', message: 'A new bullying report has been filed for Grade 10.', timestamp: new Date().toISOString(), isRead: false, type: 'incident' },
  { id: 'n2', title: 'Report Ready', message: 'The Monthly Welfare Summary is ready for download.', timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: true, type: 'report' },
];

export const PREDEFINED_ACCOUNTS = [
  {
    email: 'admin@gmail.com',
    password: '12345678',
    user: MOCK_USERS[0]
  },
  {
    email: 'teacher@gmail.com',
    password: '12345678',
    user: MOCK_USERS[1]
  },
  {
    email: 'counselor@gmail.com',
    password: '12345678',
    user: MOCK_USERS[2]
  },
  {
    email: 'parent@gmail.com',
    password: '12345678',
    user: MOCK_USERS[3]
  }
];

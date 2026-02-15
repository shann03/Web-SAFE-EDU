
export type UserRole = 'Teacher' | 'Counselor' | 'Administrator';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  role: UserRole;
  last_login?: string;
}

export interface Student {
  id: string;
  lrn: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: string;
  gender: string;
  grade_level: string;
  section: string;
  address: string;
  contact_number: string;
}

export interface IncidentType {
  id: string;
  name: string;
  description: string;
}

export interface Incident {
  id: string;
  student_id: string;
  reported_by_user_id: string;
  incident_type_id: string;
  date_reported: string;
  date_occurred: string;
  location: string;
  description: string;
  immediate_action: string;
  status: 'Pending' | 'Investigating' | 'Resolved' | 'Closed';
}

export interface BehavioralIntervention {
  id: string;
  student_id: string;
  assigned_by_user_id: string;
  intervention_type: string;
  description: string;
  start_date: string;
  end_date?: string;
  status: string;
}

export interface DeviceUsageRecord {
  id: string;
  student_id: string;
  device_id: string;
  usage_start: string;
  usage_end: string;
  activity_description: string;
  flagged: boolean;
}

export interface ParentGuardian {
  id: string;
  // Fix: Added student_id to allow linking parents to students in the application logic
  student_id: string;
  first_name: string;
  last_name: string;
  relationship_to_student: string;
  contact_number: string;
  email: string;
  address: string;
}

export interface GeneratedReport {
  id: string;
  title: string;
  type: 'Incident Summary' | 'Digital Safety Audit' | 'Welfare Progress' | 'Annual Review';
  generated_by: string;
  date_generated: string;
  status: 'Ready' | 'Processing';
  file_size: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'incident' | 'report' | 'system';
}

export interface SystemLog {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  action: string;
  category: 'Security' | 'Access' | 'Registry' | 'Audit';
  ip_address: string;
}
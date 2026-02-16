
export type UserRole = 'Teacher' | 'Counselor' | 'Parent' | 'Administrator';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  role: UserRole;
  linked_lrn?: string; // Used by parents to link to a student
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
  background?: string; // Narrative context for behavioral assistance
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
  is_parent_reported?: boolean;
  is_anonymous?: boolean;
  follow_up_notes?: string;
}

export interface InterventionMilestone {
  id: string;
  date: string;
  title: string;
  notes: string;
  outcome?: string;
  recorded_by: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  date_attached: string;
  size: string;
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
  history?: InterventionMilestone[];
  related_incident_ids?: string[];
  attachments?: Attachment[];
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
  user_id: string;
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

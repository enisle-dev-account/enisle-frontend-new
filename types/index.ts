export interface DepartmentData {
  id: string
  employee_id: number
  first_name: string
  last_name: string
  email: string
  position: string
  user_type: string
  profile_picture: string
  profile_picture_link: string
  department: string
  speciality: string
  address: string
  gender: string
  country_code: string
  mobile: string
  emergency_contact_country_code: string
  emergency_contact: string
  about: string
  date_joined: string
  supervisor: string
  shift_schedule: string
  license_number: string
  is_on_leave: boolean
}

export interface DepartmentEmployeeResponseData {
  count: number
  next: null | number
  previous: null | number
  results: DepartmentData[]
}

export interface PaginatedResponse<T> {
  count: number
  next: null | string
  previous: null | string
  results: T[]
}

export interface InvitationData {
  id: string
  email: string
  role: string
  position: string
  speciality: string
  status: "pending" | "accepted" | "expired"
  created_at: string
  expires_at: string
  hospital_name: string
}

export interface InvitationResponseData {
  count: number
  next: null | number
  previous: null | number
  results: InvitationData[]
}

export interface InviteStaffPayload {
  email: string
  role: string
  position?: string
  speciality?: string
}

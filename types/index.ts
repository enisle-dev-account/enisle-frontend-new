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

export interface UsersListResponseItem {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture: string;
    user_type: string;
    country: string;
    speciality: string;
    hospital: {
        name: string;
        id: string;
        country: string;
        city: string;
    };
}


export interface PatientData {
  is_active: boolean
  title: string
  gender: string
  first_name: string
  middle_name: string
  surname: string
  dob: string
  marital_status: string
  occupation: string
  religion: string
  phone: string
  country_code: string
  email: string
  address: string
  date_joined: string
  next_of_kin_first_name: string
  next_of_kin_surname: string
  next_of_kin_relationship: string
  next_of_kin_country_code: string
  next_of_kin_phone: string
  next_of_kin_address: string
  insurance_hmo: string
  policy_holder: string
  is_admitted: boolean
  is_vip: boolean
  created_by: string
}

export interface ConsultationData {
  is_active: boolean
  consultation_date_time: string
  billing_status: string
  status: string
  admission_date: string
  is_admitted: boolean
  priority: string
  is_payable: boolean
  status_history: Record<string, unknown>
  doctor: string
  nurse: string
  parent_consultation: string
  created_by: string
}

export interface RegisterPatientPayload {
  patient: Partial<PatientData>
  consultation: Partial<ConsultationData>
}

export interface ReceptionConsultationData {
  id: string
  first_name: string
  middle_name?: string
  surname: string
  gender: string
  age: number
  phone: string
  email: string
  billing_status: string | null
  status: string | null
  vital_taken: boolean
  queue_number: number | null
  consultation_id: string
}

export interface ReceptionConsultationResponse {
  count: number
  results: {
    patients: ReceptionConsultationData[]
    total_patients: number
    total_in_queue_patients: number
    total_finished_patients: number
    total_canceled_patients: number
  }
}

//Store
export interface ProductImage {
  id: number| string
  file: string
  file_type: "cover_image" | "product_image"
  file_url?: string
  is_active: boolean
  product?: string
}



// Product Information Item Type (for repeater field)
export interface ProductInformationItem {
  key: string
  value: string
}

// Product Types - Backend matching
export interface Product {
  id: string
  title: string
  description: string
  price: number
  availability: string
  type: string
  vendor: string
  stock: number;
  currency: string
  cover_image: ProductImage
  product_images: ProductImage[]
  information: Record<string, string>
  is_active: boolean
  hospital: string
  created_by: string
  categories?: string
  sku?: string
  created_at?: string
  updated_at?: string
}

export interface ProductsResponse {
  count: number
  next?: string
  previous?: string
  results: Product[]
}

// Form Types - for React Hook Form
export interface CreateProductFormData {
  title: string
  description: string
  price: number | string
  quantity: number | string
  availability: string
  type: string
  vendor: string
  currency?: string
  categories?: string
  sku?: string
  cover_image?: File | null
  product_images?: File[]
  information?: ProductInformationItem[]
}

export interface CreateProductPayload {
  title: string
  description: string
  price: number
  quantity: number
  availability: string
  type: string
  vendor: string
  currency?: string
  categories?: string
  sku?: string
}


export type ImportProductTypes = "medicine" | "product" | "staff";

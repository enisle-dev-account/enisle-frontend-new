export type UserRole =
  | "doctor"
  | "nurse"
  | "cashier"
  | "admin"
  | "pharmacy"
  | "reception"
  | "surgery"
  | "reception"
  | "store"
  | "laboratory"
  | "radiology";

export interface User {
  role: UserRole;
  hospitalId?: string;
  hospitalName?: string;
  hospitalType?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  email?: string;
  mobile?: string;
  countryCode?: string;
  address?: string;
  speciality?: string;
  pk: string;
}

export interface DepartmentData {
  id: string;
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  user_type: string;
  profile_picture: string;
  profile_picture_link: string;
  department: string;
  speciality: string;
  address: string;
  gender: string;
  country_code: string;
  mobile: string;
  emergency_contact_country_code: string;
  emergency_contact: string;
  about: string;
  date_joined: string;
  supervisor: string;
  shift_schedule: string;
  license_number: string;
  is_on_leave: boolean;
}

export interface DepartmentEmployeeResponseData {
  count: number;
  next: null | number;
  previous: null | number;
  results: DepartmentData[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: null | string;
  previous: null | string;
  results: T[];
}

export interface InvitationData {
  id: string;
  email: string;
  role: string;
  position: string;
  speciality: string;
  status: "pending" | "accepted" | "expired";
  created_at: string;
  expires_at: string;
  hospital_name: string;
}

export interface InvitationResponseData {
  count: number;
  next: null | number;
  previous: null | number;
  results: InvitationData[];
}

export interface InviteStaffPayload {
  email: string;
  role: string;
  position?: string;
  speciality?: string;
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
  is_active: boolean;
  title: string;
  gender: string;
  first_name: string;
  middle_name: string;
  surname: string;
  dob: string;
  marital_status: string;
  occupation: string;
  religion: string;
  phone: string;
  country_code: string;
  email: string;
  address: string;
  date_joined: string;
  next_of_kin_first_name: string;
  next_of_kin_surname: string;
  next_of_kin_relationship: string;
  next_of_kin_country_code: string;
  next_of_kin_phone: string;
  next_of_kin_address: string;
  insurance_hmo: string;
  policy_holder: string;
  is_admitted: boolean;
  is_vip: boolean;
  created_by: string;
}

export interface ConsultationData {
  is_active: boolean;
  consultation_date_time: string;
  billing_status: string;
  status: string;
  admission_date: string;
  is_admitted: boolean;
  priority: string;
  is_payable: boolean;
  status_history: Record<string, unknown>;
  doctor: string;
  nurse: string;
  parent_consultation: string;
  created_by: string;
}

export interface RegisterPatientPayload {
  patient: Partial<PatientData>;
  consultation: Partial<ConsultationData>;
}

export interface ReceptionConsultationData {
  id: string; // Patient ID
  mrn: string; // Medical Record Number
  first_name: string;
  middle_name?: string;
  surname: string;
  gender: string;
  age: number;
  phone?: string; // May be optional in consultation view
  email?: string;
  billing_status: string | null;
  status: string | null;
  vital_taken: boolean;
  queue_number: number | null;
  consultation_id: string; // The specific visit ID
}

export interface ReceptionConsultationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  // Note: The paginator usually puts the custom data inside 'results'
  results: {
    results: ReceptionConsultationData[]; // The list of rows
    total_patients: number;
    total_in_queue: number;
    total_finished: number;
    total_canceled: number;
  };
}

export interface CheckInExistingPatientPayload {
  patient: string; // Patient ID
  doctor?: string; // UUID, optional
  nurse?: string; // UUID, optional
  priority: string;
  consultation_date_time: string;
}

export interface NurseConsultationPatientData {
  id: number;
  first_name: string;
  surname: string;
  middle_name: string;
  gender: string;
  is_vip: boolean;
  mrn: string;
}

export interface NurseConsultationDoctorData {
  first_name: string;
  last_name: string;
}

export interface NurseConsultationData {
  id: string;
  status: string;
  patient: NurseConsultationPatientData;
  billing_status: string;
  doctor: NurseConsultationDoctorData;
  has_vital: boolean;
  vital_id: string;
  consultation_date_time: string;
}

export interface ConsultationVitalsDataResponse {
  count: number;
  next: null | string;
  previous: null | string;
  results: NurseConsultationData[];
}


export interface DetailedConsultationResponsePatientVital {
  id: string;
  vital_info: Record<string, any>;
  other_notes: string;
  created_at: string;
  updated_at: string;
  status: string;
  taken_by: CreatorInfo;
  is_admitted: boolean;
  billing_status: string;
}

export interface DetailedConsultationResponsePatient {
  id: string;
  first_name: string;
  middle_name: string;
  surname: string;
  gender: string;
  age: number;
  address: string;
  phone: string;
  country_code: string;
  email: string;
  profile_picture_location: string;
  created_at: string;
  mrn: string;
  billing_status: string;
  vital: DetailedConsultationResponsePatientVital;
}

//Store
export interface ProductImage {
  id: number | string;
  file: string;
  file_type: "cover_image" | "product_image";
  file_url?: string;
  is_active: boolean;
  product?: string;
}

// Product Information Item Type (for repeater field)
export interface ProductInformationItem {
  key: string;
  value: string;
}

// Product Types - Backend matching
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  availability: string;
  type: string;
  vendor: string;
  stock: number;
  currency: string;
  cover_image: ProductImage;
  product_images: ProductImage[];
  information: Record<string, string>;
  is_active: boolean;
  hospital: string;
  created_by: string;
  categories?: string;
  sku?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductsResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Product[];
}

// Form Types - for React Hook Form
export interface CreateProductFormData {
  title: string;
  description: string;
  price: number | string;
  quantity: number | string;
  availability: string;
  type: string;
  vendor: string;
  currency?: string;
  categories?: string;
  sku?: string;
  cover_image?: File | null;
  product_images?: File[];
  information?: ProductInformationItem[];
}

export interface CreateProductPayload {
  title: string;
  description: string;
  price: number;
  quantity: number;
  availability: string;
  type: string;
  vendor: string;
  currency?: string;
  categories?: string;
  sku?: string;
}

export type ImportProductTypes = "medicine" | "product" | "staff";

export interface Patient {
    mrn: string;
  id: string;
  title?: 'mr' | 'mrs' | 'miss' | 'dr' | 'prof' | null;
  gender: string;
  first_name: string;
  middle_name?: string | null;
  surname: string;
  dob: string;
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | null;
  occupation?: string | null;
  religion?: string | null;
  phone?: string | null;
  country_code?: string | null;
  email?: string | null;
  address?: string | null;
  date_joined?: string | null;
  next_of_kin_first_name?: string | null;
  next_of_kin_surname?: string | null;
  next_of_kin_relationship?: string | null;
  next_of_kin_country_code?: string | null;
  next_of_kin_phone?: string | null;
  next_of_kin_address?: string | null;
  insurance_hmo?: string | null;
  policy_holder?: string | null;
  is_admitted: boolean;
  admission_date: string | null;
  profile_picture_location?: string | null;
  created_by?: string | null;
  created_at: string;
  is_vip: boolean;
}

export interface FeesListItem {
  name: string;
  billing_status: string;
}

export interface PatientsListEncounter {
  id: string;
  main_complaints: string;
  previous_operations: string;
  present_illness_history: string;
  past_medical_history: string;
  impressions: string;
  recommendation: string;
  additional_notes: Record<string, any>;
  received_medication: string;
  created_at: string;
  updated_at: string;
  status: string;
  doctor: CreatorInfo;
}

export interface DoctorPatientsData extends Patient {
  age: number;
  billing_status: string;
  status: string;
  priority: "high" | "low" | "medium"
  ward_name: string;
  room_name: string;
  consultation_id: string | null;
  vital_taken: boolean;
  encounter: PatientsListEncounter | null;
  fees: FeesListItem[];
  doctor: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
  };
  nurse: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
  };
}

export interface PatientsResultData {
  data: DoctorPatientsData[];
  in_patient: number;
  out_patient: number;
  all_patient: number;
}

export interface PatientsDataResponse {
  count: number;
  next: null | number;
  previous: null | number;
  results: PatientsResultData;
}


export interface MeetingRoomInfo {
  id: string;
  is_active: boolean;
  name: string;
  description: string;
  room_type: string;
}

export interface WardsInfo {
  name: string;
  description: string;
  rooms: number;
}

export interface CreateWardResponse {
  rooms: {
    id: number;
    name: string;
  }[];
}

export interface CreateWardBedsRequestData {
  beds: number;
  room: number;
}

export enum ConsultationStatusEnum {
  IN_QUEUE = 'in_queue',
  CHECKED_IN = 'checked_in',
  ADMITTED = 'admitted',
  CHECKOUT = 'checkout',
  FINISHED = 'finished',
  CANCELED = 'canceled',
  REFERRED = 'referred',
}

export interface UserSummary {
  id: string; // UUID string
  first_name: string;
  last_name: string;
}

export interface PatientSummary {
  id: number;
  first_name: string;
  middle_name: string;
  surname: string;
  gender: string;
  age: number;
}

export interface PatientConsultation {
  doctor: UserSummary | null;
  nurse: UserSummary | null;
  patient: PatientSummary;
  status: ConsultationStatusEnum;
  admission_date: string | null; // ISO Date string
}

export interface WardBedData {
  billing_status: string;
  description: string;
  id: number;
  is_active: boolean;
  name: string;
  patient_consultation?: PatientConsultation;
  state: string;
}

export interface WardRoomData {
  beds: WardBedData[];
  description: string;
  id: string;
  is_active: boolean;
  name: string;
  state: string;
}

export interface WardBedOccupancyData {
  description: string;
  id: string;
  is_active: boolean;
  name: string;
  rooms: WardRoomData[];
}

export interface Room {
  id: number;
  name: string;
}

export interface WardResponse {
  id: string; // UUID
  is_active: boolean;
  name: string;
  description: string;
  rooms: Room[];
  status: string;
}
export interface MedicinesData {
  id: string;
  is_active: boolean;
  title: string;
  generic_name: string;
  weight: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  availability: string;
  type: string;
  vendor: string;
  vendor_price: number;
  information: Record<string, any>;
  expiry_date: string;
  popularity_rating: number;
  starting_stock: string;
  current_stock: string;
  created_by: string;
  hospital: string;
  cover_image: ProductImage;
  product_images: ProductImage[];
}

export interface MedicineResponseData {
  count: number;
  next: null | number;
  previous: null | number;
  results: MedicinesData[];
}

export interface EncounterConsultationDoctor {
  id: string;
  doctor: CreatorInfo;
}

export interface Encounter {
  id: string;
  main_complaints: string;
  previous_operations: string;
  present_illness_history: string;
  past_medical_history: string;
  impressions: string;
  recommendation: string;
  additional_notes: Record<string, any>;
  received_medication: string;
  consultation: EncounterConsultationDoctor;
  created_at: string;
  updated_at: string;
  status: string;
  created_by: CreatorInfo;
}

export interface EncountersListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Encounter[];
}

export interface PrescribedMedicine {
  id: number;
  medicine: {
    id: string;
    title: string;
    generic_name: string;
  };
  dosage: string;
  medicine_type: string;
  start_date: string;
  end_date: string;
  frequency: string;
  quantity: string;
  notes: string;
  pharmacist_notes: string;
  status: string;
  status_history: any[];
}

export interface MedicationPrescription {
  id: number;
  created_at: string;
  updated_at: string;
  consultation: string;
  billing_status: string;
  status: string;
  prescribed_medicines: PrescribedMedicine[];
  doctor: CreatorInfo;
}

export interface LabTest {
  id: string;
  test: string;
  status: string;
  result: Record<string, string>[];
  billing_status: string;
  created_at: string;
  updated_at: string;
  is_admitted: boolean;
  doctor: CreatorInfo;
  investigation_request: {
    request_type: string;
    notes: string;
  };
}




export interface Surgery{
    id: string;
    consultation: string;
    doctor: string | CreatorInfo;
    procedure: string;
    selected_procedure_pricing:number;
    reason: string;
    notes: string;
    description: string;
    concentration: string;
    route: string;
    site: string;
    quantity: string;
    recovery_notes: string;
    operative_site: string;
    anesthesia_type: string;
    cpt_code: string;
    additional_fields: Record<string, string>;
    status: string;
    surgery_date: string;
    created_at: string;
    updated_at: string;
    billing_status: string;
}



export interface DoctorPatientData {
  id: number;
  first_name: string;
  middle_name?: string;
  surname: string;
  gender: string;
  address?: string;
  phone?: string;
  country_code?: string;
  email?: string;
  profile_picture_location?: string | null;
  created_at: string;
  billing_status: "pending" | "completed" | string;
  status: "admitted" | "in_queue" | "out_patient" | "discharged" | string;
  admission_date: string | null;
  mrn?: string;
  age?: number;
}

export interface DoctorPatientsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DoctorPatientsResults;
}

export interface DoctorPatientsResults {
  data: DoctorPatientData[];
  in_patient: number;
  out_patient: number;
  all_patient: number;
}

export type PatientAdmissionStatus = "admitted" | "out_patient" | null;

export interface DoctorConsultationPatientData {
  id: number;
  first_name: string;
  middle_name?: string;
  surname: string;
  gender: string;
  is_vip: boolean;
  mrn?: string;
}

export interface DoctorConsultationData {
  id: string;
  patient: DoctorConsultationPatientData;
  billing_status: string | null;
  status: string;
  is_vitals_taken: boolean;
  vital_id: string | null;
  queue_number: number | null;
  consultation_date_time?: string;
}

export interface DoctorConsultationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    consultations: DoctorConsultationData[];
    in_queue: number;
    checkout: number;
    finished: number;
    canceled: number;
  };
}

export type ConsultationStatus =
  | "in_queue"
  | "checkout"
  | "finished"
  | "canceled"
  | null;

export interface PharmacyPatient {
  id: string;
  queue_number: number;
  consultation: {
    id: string;
    status: string;
    patient: {
      id: string;
      first_name: string;
      middle_name?: string;
      surname: string;
      gender: string;
      profile_picture_location?: string;
    };
    doctor: {
      first_name: string;
      last_name: string;
    };
  };
  prescribed_medicines: Array<{
    id: number;
    medicine: {
      id: string;
      title: string;
      generic_name: string;
      price: number;
    };
    quantity: string;
    dosage: string;
    medicine_type: string;
    start_date: string;
    end_date: string;
    frequency: string;
    notes: string;
    pharmacist_notes: string;
    status: string;
  }>;
  billing_status: string;
  is_vitals_taken: boolean;
  vital_id: string | null;
}

export interface PatientsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PharmacyPatient[];
}




export interface SurgeryPatientsListData {
    id: number;
    patient: {
        id: number;
        first_name: string;
        middle_name: string;
        surname: string;
        gender: string;
        doctor: {
            first_name: string;
            last_name: string;
        };
        is_admitted: boolean;
        admission_date: string | null;
    }
    billing_status: string;
    procedure: string;
    consultation: string;
}


export interface PatientsResultData {
    patients: SurgeryPatientsListData[];
    in_patient: number;
    out_patient: number;
}


export interface SurgeryPatientsDataResponse {
    count: number
    next: null | number
    previous: null | number
    results: PatientsResultData
}




// Updated types for patient consultation data

export interface CreatorInfo {
  id: string;
  first_name: string;
  last_name: string;
  is_on_duty?: boolean;
  is_on_leave?: boolean;
  profile_picture: string | null;
}

export interface DetailedConsultationResponsePatientVital {
  id: string;
  vital_info: Record<string, any>;
  other_notes: string;
  created_at: string;
  updated_at: string;
  status: string;
  billing_status: string;
  is_admitted: boolean;
  taken_by: CreatorInfo;
}



export interface InvestigationRequest {
  request_type: string;
  notes: string;
}

export interface LabTest {
  id: string;
  test: string;
  status: string;
  result: Record<string, string>[];
  billing_status: string;
  created_at: string;
  updated_at: string;
  is_admitted: boolean;
  doctor: CreatorInfo;
  investigation_request: InvestigationRequest;
}



export interface MedicationPrescription {
  id: number;
  created_at: string;
  updated_at: string;
  consultation: string;
  billing_status: string;
  status: string;
  prescribed_medicines: PrescribedMedicine[];
  is_admitted: boolean;
  doctor: CreatorInfo;
}


export interface RadiologyResult {
  [key: string]: any;
}

export interface RadiologyStudy {
  id: string;
  study_type: string;
  request_type: string;
  notes?: string;
  status: string;
  billing_status: string;
  created_at: string;
  updated_at: string;
  imaged_on?: string;
  doctor: CreatorInfo;
  results: RadiologyResult[];
}

export interface PatientBasicInfo {
  id: string;
  first_name: string;
  middle_name: string;
  surname: string;
  gender: string;
  age: number;
  address: string;
  phone: string;
  country_code: string;
  email: string;
  profile_picture_location: string | null;
  created_at: string;
  billing_status: string;
  mrn: string;
  status: string;
  admission_date?: string;
}

export interface DetailedPatientConsultationInfoResponse {
  patient: PatientBasicInfo;
  vitals: DetailedConsultationResponsePatientVital[];
  encounters: Encounter[];
  labs: LabTest[];
  scans: RadiologyStudy[];
  surgeries: Surgery[];
  medications: MedicationPrescription[];
}

export interface DetailedConsultationResponse {
  patient: PatientBasicInfo;
  vital?: DetailedConsultationResponsePatientVital;
  encounter?: Encounter;
  labs: LabTest[];
  scans: RadiologyStudy[];
  surgeries: Surgery[];
  medications: MedicationPrescription[];
}

export interface DetailedConsultationResponsePatient {
    id: string;
    first_name: string;
    middle_name: string;
    surname: string;
    gender: string;
    age: number;
    address: string;
    phone: string;
    country_code: string;
    email: string;
    profile_picture_location: string;
    created_at: string;
    billing_status: string;
    vital: DetailedConsultationResponsePatientVital
}



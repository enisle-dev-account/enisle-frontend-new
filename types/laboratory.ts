import {
  ConsultationData,
  CreatorInfo,
  DetailedConsultationResponsePatient,
} from ".";

export interface PatientsData {
  id: number | string;
  first_name: string;
  middle_name: string;
  surname: string;
  gender: string;
  address: string;
  phone: string;
  country_code: string;
  profile_picture_location: string;
  email: string;
  age: number;
  created_at: string;
}

export interface PatientsDataResponse {
  count: number;
  next: null | number;
  previous: null | number;
  results: PatientsData[];
}

export interface LaboratoryRequestPatient {
  id: number;
  first_name: string;
  middle_name: string;
  surname: string;
  gender: string;
  age: number;
  profile_picture_location: string;
}

export interface LaboratoryRequestDoctor {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

export interface LaboratoryRequestHospital {
  name: string;
  state: string;
  city: string;
}

// NEW: Grouping metadata interface
export interface GroupingMetadata {
  consultation_id: string;
  total_tests: number;
  test_names: string[];
  all_billing_status: string; // "paid", "pending", "mixed"
  first_queue_number: number;
  test_ids: number[];
}

export interface LaboratoryRequestData {
  id: number;
  queue_number: number;
  patient: LaboratoryRequestPatient;
  doctor: LaboratoryRequestDoctor;
  billing_status: string;
  consultation?: ConsultationData
  investigation_request?: {
    request_type: string;
    request_id: number;
  };
  grouping_metadata?: GroupingMetadata;
}

export interface SingleLaboratoryRequestData {
  id: number;
  patient: LaboratoryRequestPatient;
  doctor: LaboratoryRequestDoctor;
  hospital: LaboratoryRequestHospital;
  result: Record<string, any>[];

  investigation_request: {
    request_type: string;
    request_id: number;
    created_at: string;
  };
  billing_status: string;
}

// NEW: Interface for consultation with multiple tests
export interface ConsultationLabTests {
  consultation_id: string;
  patient: LaboratoryRequestPatient;
  doctor: LaboratoryRequestDoctor;
  hospital: LaboratoryRequestHospital;
  tests: SingleLaboratoryRequestData[];
}

export interface LaboratoryRequestDataResponse {
  count: number;
  next: null | number;
  previous: null | number;
  results: LaboratoryRequestData[];
}

export interface AddTestRequest {
  test: number;
  test_date: string;
  result: Record<string, string>[];
}

export type BillingStatus = "Paid" | "Pending" | "Unpaid";

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  mobile: string;
  profile_picture?: string;
  date_of_birth?: string;
  gender: "Male" | "Female";
  hospital_id: number;
  hospital_name: string;
  patient_id: string;
}

export interface TestParameter {
  name: string;
  value?: string;
  reference_range?: string;
}

export interface TestResult {
  id: number;
  test_id: number;
  test_name: string;
  test_date: string;
  parameters: TestParameter[];
  created_at?: string;
  updated_at?: string;
}

export interface LabTestRequest {
  id: number;
  patient_id: number;
  patient: Patient;
  test_id: number;
  test_name: string;
  request_date: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  billing_status: BillingStatus;
  doctor: CreatorInfo;
  lab_scientist: string;
  hospital: string;
  queue_number: string;
  results?: TestResult[];
  notes?: string;
}

export interface TestType {
  id: number;
  name: string;
  parameters: {
    name: string;
    reference_range?: string;
  }[];
}

export interface CreateTestResultPayload {
  test: number;
  test_date: string;
  result: {
    parameter_name: string;
    value: string;
  }[];
}

export interface Note {
  id: number;
  content: string;
  created_at: string;
  created_by: string;
}

export interface Machine {
  id: number;
  name: string;
  status: "connected" | "disconnected";
  hospital_id: number;
}

export interface DetailedConsultationResponsePatientEncounterLabs {
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

export interface PatientLaboratoryInfoResponse {
  patient: DetailedConsultationResponsePatient;
  labs: DetailedConsultationResponsePatientEncounterLabs[];
}
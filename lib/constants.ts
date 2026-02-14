export const POSITIONS = [
  { value: "chief_administrator", label: "Chief Administrator" },
  { value: "senior_nurse", label: "Senior Nurse" },
  { value: "physician", label: "Physician" },
  { value: "pharmacist", label: "Pharmacist" },
  { value: "surgeon", label: "Surgeon" },
  { value: "lead", label: "Lead" },
]

export const SPECIALTIES = [
  { value: "cardiologist", label: "Cardiologist" },
  { value: "neurologist", label: "Neurologist" },
  { value: "pediatrician", label: "Pediatrician" },
  { value: "orthopedic", label: "Orthopedic" },
  { value: "surgeon", label: "Surgeon" },
  { value: "anesthesiologist", label: "Anesthesiologist" },
  { value: "dermatologist", label: "Dermatologist" },
  { value: "psychiatrist", label: "Psychiatrist" },
]

export const PATIENT_CONSULTATION_PRIORITY_CHOICES = [
    { value: "high", label: "High" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
]

export const PAYMENT_METHODS = [
  { label: "Cash", value: "cash" },
  { label: "Card", value: "card" },
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "Mobile Money", value: "mobile_money" },
  { label: "Insurance", value: "insurance" },
  { label: "Other", value: "other" },
];

export const PAYMENT_STATUSES = [
  { label: "Initiated", value: "initiated" },
  { label: "Pending Confirmation", value: "pending_confirmation" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Declined", value: "declined" },
];

export const PAYING_FOR_OPTIONS = [
  "consultation",
  "medicine",
  "lab",
  "scan",
  "vital",
  "surgery",
  "procedure",
  "other",
];
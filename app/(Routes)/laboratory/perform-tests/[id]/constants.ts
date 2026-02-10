export const TEST_TYPES = [
  {
    id: 1,
    name: 'Complete Blood Count (CBC)',
    parameters: [
      { name: 'White Blood Cells', reference_range: '4.5-11.0' },
      { name: 'Red Blood Cells', reference_range: '4.5-5.5' },
      { name: 'Hemoglobin', reference_range: '13.5-17.5' },
      { name: 'Hematocrit', reference_range: '41-53' },
      { name: 'Platelets', reference_range: '150-400' },
      { name: 'MCV', reference_range: '80-100' },
      { name: 'MCH', reference_range: '27-33' },
      { name: 'MCHC', reference_range: '32-36' },
    ],
  },
  {
    id: 2,
    name: 'Basic Metabolic Panel (BMP)',
    parameters: [
      { name: 'Sodium (Na+)', reference_range: '136-145' },
      { name: 'Potassium (K+)', reference_range: '3.5-5.0' },
      { name: 'Chloride (Cl-)', reference_range: '98-107' },
      { name: 'Bicarbonate (HCO3-)', reference_range: '23-29' },
      { name: 'Glucose', reference_range: '70-100' },
      { name: 'Calcium (Ca++)', reference_range: '8.5-10.5' },
    ],
  },
  {
    id: 3,
    name: 'Lipid Panel',
    parameters: [
      { name: 'Total Cholesterol', reference_range: '<200' },
      { name: 'LDL Cholesterol', reference_range: '<100' },
      { name: 'HDL Cholesterol', reference_range: '>40' },
      { name: 'Triglycerides', reference_range: '<150' },
    ],
  },
  {
    id: 4,
    name: 'Liver Function Tests (LFT)',
    parameters: [
      { name: 'ALT', reference_range: '7-56' },
      { name: 'AST', reference_range: '10-40' },
      { name: 'Bilirubin', reference_range: '0.1-1.2' },
      { name: 'Albumin', reference_range: '3.5-5.5' },
    ],
  },
  {
    id: 5,
    name: 'Thyroid Function Tests',
    parameters: [
      { name: 'TSH', reference_range: '0.4-4.0' },
      { name: 'T3', reference_range: '80-200' },
      { name: 'T4', reference_range: '4.5-12' },
    ],
  },
  {
    id: 6,
    name: 'Hemoglobin A1C',
    parameters: [
      { name: 'HbA1c', reference_range: '<5.7' },
    ],
  },
  {
    id: 7,
    name: 'Hematology',
    parameters: [
      { name: 'Packed Cell Volume', reference_range: '36-48' },
      { name: 'White Blood Cells', reference_range: '4000-15000' },
      { name: 'Lymphocytes', reference_range: '20-40' },
      { name: 'Monocytes', reference_range: '1-15' },
      { name: 'Granulocytes', reference_range: '50-70' },
      { name: 'Haemoglobin', reference_range: '11-16' },
      { name: 'MCV', reference_range: '80-90' },
      { name: 'MCH', reference_range: '26-32' },
      { name: 'MCHC', reference_range: '32-36' },
    ],
  },
  {
    id: 8,
    name: 'Malaria',
    parameters: [
      { name: 'Plasmodium Species', reference_range: 'Negative' },
    ],
  },
  {
    id: 9,
    name: 'Typhoid',
    parameters: [
      { name: 'Widal Test - O', reference_range: '<1:80' },
      { name: 'Widal Test - H', reference_range: '<1:80' },
    ],
  },
  {
    id: 10,
    name: 'HIV/AIDS Test',
    parameters: [
      { name: 'HIV Antibody', reference_range: 'Negative' },
      { name: 'CD4 Count', reference_range: '>500' },
    ],
  },
]

export const BILLING_STATUS_COLORS = {
  Paid: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Unpaid: 'bg-red-50 text-red-700',
}

export const QUEUE_STATUS_COLORS = {
  in_queue: 'bg-blue-50 text-blue-700',
  admitted: 'bg-emerald-50 text-emerald-700',
  discharged: 'bg-slate-50 text-slate-700',
}


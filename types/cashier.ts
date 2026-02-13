// Cashier Transaction Types
export type TransactionDataItem = string
  | { doctor__first_name: string; doctor__last_name: string }
  | { created_at: string }
  | { scan_request__request_type: string }
  | { consultation__doctor__first_name: string; consultation__doctor__last_name: string }
  | { investigation_request__request_type__test_name: string }
  | { patient_bed__name: string }

export interface TransactionDataTransaction {
  id: string
  paying_for: string
  item_id: string
  item: TransactionDataItem
  pricing: { price: number }
}

export interface TransactionData {
  id: number
  created_at: string
  transaction_datetime: string | null
  type: string
  status: string
  amount: number
  currency: string
  transaction: TransactionDataTransaction
  consultation: string
}

export interface TransactionConsultationPatientData {
  id: number
  first_name: string
  middle_name: string
  surname: string
  gender: string
  phone: string
  address: string
  email: string
  country_code: string
  profile_picture_location: string
  age: number
  created_at: string
}

export interface TransactionInvoiceData {
  invoice_id: string
  issued_on: string
  due_on: string
  total_amount: number
  paid_total_amount: number
  transaction_list: TransactionItem[]
  recipient_email: string
  external_transaction_id: string
  description: string
  recurring_monthly: boolean
  additional_notes: string
  payment_method: string
  payment_provider: string
  status: string
  payment_datetime: string | null
  is_active: boolean
  is_draft: boolean
  updated_at: string
  created_at: string
  transactions: string[]
}

export interface TransactionConsultationData {
  patient: TransactionConsultationPatientData
  pharmacy_product: null
  paying_for: string
  queue_number: number
  status: string
  id: string
  billing_status: string
  invoice: TransactionInvoiceData
  draft_invoices: TransactionInvoiceData[]
  transactions: TransactionData[]
}

export interface TransactionsDataResponse {
  count: number
  next: null | number
  previous: null | number
  results: {
    consultations: TransactionConsultationData[]
    in_queue_transactions: number
    history_transactions: number
    generated_invoice_id: string
    payment_token: string
  }
}

export interface TransactionItem {
  itemType: string
  itemId?: string | null
  quantity: number
  price: number
}

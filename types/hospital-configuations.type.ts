export interface HospitalLabTest {
  id: number;
  test_name: string;
  parameters: { name: string; range: string }[];
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}

export interface HospitalPricing {
  id: number;
  item: string;
  category: string;
  price: number;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}


export interface EditingTest {
  id: number | null;
  test_name: string;
  parameters: Array<{ name: string; range: string }>;
}
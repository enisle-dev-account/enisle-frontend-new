export interface HospitalLabTest {
  id: number;
  test_name: string;
  test_category?:string
  color_theme?:string
  icon?:string
  parameters: Parameter[];
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

export type ParameterType = "numeric" | "categorical" | "text" | "ratio";

export interface Parameter {
  name: string;
  type: ParameterType;
  unit?: string;
  min?: number;
  max?: number;
  options?: string[];
  normal_values?: string[];
  display_decimals?: number;
  // Legacy support
  range?: string;
}



export interface EditingTest {
  id: number | null;
  test_name: string;
  test_category?: string;
  color_theme?: string;
  icon?: string;
  parameters: Parameter[];
}

export interface ProjectDetails {
  system_name: string;
  area_m2: number;
  substrate: string;
  environment: string;
  traffic_type: string;
  performance_requirements: string[];
  constraints: {
    budget_per_m2?: number;
    max_voc_g_per_L?: number;
    temp_range_C: [number, number];
    cure_time_hours_max?: number;
  };
}

export type LayerType = string;

export interface CandidateProduct {
  id: string; // For React key
  manufacturer: string;
  product_name: string;
  product_code?: string;
  layer_type: LayerType[];
  description?: string;
  tds_url?: string;
  sds_url?: string;
  specs: {
    voc_g_per_L?: number;
    coverage_m2_per_L?: number;
    cure_time_hours_at_23C?: number;
    temperature_range_C?: [number, number];
  };
  price_per_unit?: number;
  packaging_size_L_or_kg?: number;
}

export interface RecommendedProduct {
  manufacturer: string;
  product_name: string;
  product_code?: string;
  specs: any;
  price_per_unit: number;
  packaging_size: number;
  tds_url?: string;
  sds_url?: string;
  stock_availability: string;
}

export interface SystemLayer {
  role: LayerType;
  recommended_product: RecommendedProduct;
  reason_for_selection: string;
  alternatives: RecommendedProduct[];
  compatibility_notes: string;
  application_recommendation: {
    mixing_instructions: string;
    recommended_number_of_coats: number;
    recommended_film_thickness_micron: number;
    drying_time_between_coats_hours: number;
    equipment: string;
  };
}

export interface SystemRecommendation {
  system_id: string;
  system_name: string;
  summary: string;
  project: ProjectDetails;
  layers: SystemLayer[];
  compatibility_matrix: { layer_a: string; layer_b: string; compatible: boolean; notes: string }[];
  estimated_consumption: {
    per_product: { product_name: string; units_needed: number; total_qty: string }[];
    total_material_cost: number;
    currency: string;
  };
  performance_scores: {
    durability: number;
    cost_efficiency: number;
    ease_of_application: number;
    environmental: number;
  };
  confidence_score: number;
  references: string[];
}

export interface AppState {
    projectDetails: ProjectDetails;
    candidateProducts: CandidateProduct[];
    recommendation: SystemRecommendation | null;
    isLoading: boolean;
    error: string | null;
}

import { ProjectDetails, CandidateProduct } from './types';

export const SYSTEM_PROMPT = `
SYSTEM ROLE:
You are an experienced materials engineer and product selection assistant for flooring, waterproofing and thermal-insulation systems. Use construction best practice, product compatibility, and practical application constraints.

USER INSTRUCTION:
Input will be provided with fields describing the project and a catalogue of candidate products. Produce a single JSON object exactly matching the schema below. Do NOT include any extra commentary, code fences, or explanation — output pure JSON only.

OUTPUT JSON SCHEMA (required):
{
  "system_id": "string",
  "system_name": "string",
  "summary": "string",
  "project": { "system_name": "string", "area_m2": "number", "substrate": "string", "environment": "string", "traffic_type": "string", "performance_requirements": ["string"], "constraints": {} },
  "layers": [
    {
      "role": "string",
      "recommended_product": { "manufacturer": "string", "product_name": "string", "product_code": "string", "specs": {}, "price_per_unit": "number", "packaging_size": "number", "tds_url": "string", "sds_url": "string", "stock_availability": "string" },
      "reason_for_selection": "string",
      "alternatives": [ {} ],
      "compatibility_notes": "string",
      "application_recommendation": { "mixing_instructions": "string", "recommended_number_of_coats": "number", "recommended_film_thickness_micron": "number", "drying_time_between_coats_hours": "number", "equipment": "string" }
    }
  ],
  "compatibility_matrix": [ {"layer_a":"role", "layer_b":"role", "compatible":true|false, "notes":"string"} ],
  "estimated_consumption": { "per_product": [ {"product_name":"string", "units_needed":"number", "total_qty":"string"}, ... ], "total_material_cost": "number", "currency": "string" },
  "performance_scores": { "durability": "0-100", "cost_efficiency": "0-100", "ease_of_application": "0-100", "environmental": "0-100" },
  "confidence_score": "0-100",
  "references": [ "list of used product names or TDS links" ],
  "export_formats_available": ["json","csv","pdf"]
}

ADDITIONAL RULES:
- Score products against the project's constraints (budget, VOC, temp_range).
- If no candidate product meets a hard constraint (e.g., max_voc), set "confidence_score" lower and explain which constraint fails inside "summary".
- Keep numbers consistent (units: m2, L, kg, micron, °C, g/L, hours).
- When calculating consumption, round to 2 decimal places.
- When product data is missing for an important spec, mark fields as null and reduce confidence_score accordingly.
`;

export const INITIAL_PROJECT_DETAILS: ProjectDetails = {
  system_name: "Waterproof Balcony Flooring",
  area_m2: 50,
  substrate: "Concrete",
  environment: "Outdoor, UV-exposed, Pedestrian Traffic",
  traffic_type: "Pedestrian",
  performance_requirements: ["Waterproof", "Flexible", "UV Stable", "Crack-bridging"],
  constraints: {
    budget_per_m2: 80,
    max_voc_g_per_L: 100,
    temp_range_C: [-10, 40],
    cure_time_hours_max: 48,
  },
};

export const INITIAL_CANDIDATE_PRODUCTS: CandidateProduct[] = [
  {
    id: 'prod1',
    manufacturer: "AquaProof Inc.",
    product_name: "AquaPrime 100",
    product_code: "AP-100",
    layer_type: ["primer"],
    description: "A two-component, solvent-free epoxy primer for concrete substrates.",
    tds_url: "",
    sds_url: "",
    specs: {
      voc_g_per_L: 50,
      coverage_m2_per_L: 8,
      cure_time_hours_at_23C: 4,
      temperature_range_C: [-20, 80],
    },
    price_per_unit: 120,
    packaging_size_L_or_kg: 5,
  },
  {
    id: 'prod2',
    manufacturer: "FlexiCoat Systems",
    product_name: "FlexiSeal PU",
    product_code: "FC-PU25",
    layer_type: ["membrane", "base"],
    description: "A liquid-applied, polyurethane-based waterproofing membrane with excellent crack-bridging capabilities.",
    tds_url: "",
    sds_url: "",
    specs: {
      voc_g_per_L: 80,
      coverage_m2_per_L: 1,
      cure_time_hours_at_23C: 24,
      temperature_range_C: [-30, 90],
    },
    price_per_unit: 350,
    packaging_size_L_or_kg: 25,
  },
  {
    id: 'prod3',
    manufacturer: "FlexiCoat Systems",
    product_name: "TopGuard UV+",
    product_code: "FC-TG-UV",
    layer_type: ["top"],
    description: "A UV-stable, aliphatic polyurethane top coat for protecting waterproofing membranes.",
    tds_url: "",
    sds_url: "",
    specs: {
      voc_g_per_L: 95,
      coverage_m2_per_L: 6,
      cure_time_hours_at_23C: 12,
      temperature_range_C: [-30, 90],
    },
    price_per_unit: 250,
    packaging_size_L_or_kg: 10,
  },
   {
    id: 'prod4',
    manufacturer: "StoneHard Co.",
    product_name: "EpoxyShield 5000",
    product_code: "SH-5000",
    layer_type: ["base", "top"],
    description: "A high-build, solvented epoxy coating for heavy-duty industrial floors. High VOC.",
    tds_url: "",
    sds_url: "",
    specs: {
      voc_g_per_L: 250,
      coverage_m2_per_L: 4,
      cure_time_hours_at_23C: 72,
      temperature_range_C: [5, 50],
    },
    price_per_unit: 400,
    packaging_size_L_or_kg: 20,
  },
];

export const DEFAULT_LAYER_TYPES: string[] = [
  "primer",
  "base",
  "top",
  "membrane",
  "adhesive",
  "insulation",
  "optional",
];

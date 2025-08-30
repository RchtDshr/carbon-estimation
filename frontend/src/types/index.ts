export interface CarbonFootprintResult {
  dish: string;
  estimated_carbon_kg: number;
  ingredients: Array<{
    name: string;
    carbon_kg: number;
  }>;
}

export interface EstimationState {
  result: CarbonFootprintResult | null;
  error: string | null;
  isLoading: boolean;
  hasStartedEstimation: boolean;
}

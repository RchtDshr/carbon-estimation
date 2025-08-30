import { useState } from 'react';
import { estimateCarbonFootprint } from '../api/api';
import type { CarbonFootprintResult } from '../types';

export type { CarbonFootprintResult } from '../types';

export const useDishEstimation = () => {
  const [result, setResult] = useState<CarbonFootprintResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedEstimation, setHasStartedEstimation] = useState(false);

  const handleEstimate = async (dishName: string) => {
    setHasStartedEstimation(true);
    setIsLoading(true);
    setError(null);
    setResult(null); // Clear previous result
    
    try {
      const response = await estimateCarbonFootprint(dishName);
      setResult(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to estimate carbon footprint';
      setError(errorMessage);
      console.error('Estimation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setHasStartedEstimation(false);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    result,
    error,
    isLoading,
    hasStartedEstimation,
    handleEstimate,
    handleReset
  };
};

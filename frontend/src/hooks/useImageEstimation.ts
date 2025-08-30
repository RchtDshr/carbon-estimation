import { useState } from 'react';
import { estimateCarbonFootprintFromImage } from '../api/api';
import type { CarbonFootprintResult } from '../types';

export const useImageEstimation = () => {
  const [result, setResult] = useState<CarbonFootprintResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedEstimation, setHasStartedEstimation] = useState(false);

  const handleImageEstimate = async (file: File) => {
    setHasStartedEstimation(true);
    setIsLoading(true);
    setError(null);
    setResult(null); // Clear previous result
    
    try {
      const response = await estimateCarbonFootprintFromImage(file);
      setResult(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to estimate carbon footprint from image';
      setError(errorMessage);
      console.error('Image estimation error:', err);
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
    handleImageEstimate,
    handleReset
  };
};

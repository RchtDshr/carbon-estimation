import DishInput from '../DishInput';
import ResultDisplay from '../ResultDisplay';
import type { CarbonFootprintResult } from '../../types';

interface MainContentProps {
  onEstimate: (dishName: string) => Promise<void>;
  result: CarbonFootprintResult | null;
  error: string | null;
  isLoading: boolean;
  hasStartedEstimation: boolean;
  onReset: () => void;
}

export default function MainContent({
  onEstimate,
  result,
  error,
  isLoading,
  hasStartedEstimation,
  onReset
}: MainContentProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 gap-8 items-start">
        {/* Input Component */}
        <div className="space-y-4">
          <DishInput onEstimate={onEstimate} isLoading={isLoading} />
        </div>

        {/* Result Component - Only show after user has started an estimation */}
        {hasStartedEstimation && (
          <div className="space-y-4">
            <ResultDisplay 
              result={result} 
              error={error} 
              isLoading={isLoading} 
              onReset={onReset}
            />
          </div>
        )}
      </div>
    </div>
  );
}

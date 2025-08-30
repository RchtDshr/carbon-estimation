import { useState } from 'react';
import { Button } from '../ui/button';
import DishInput from '../DishInput';
import ImageInput from '../ImageInput';
import ResultDisplay from '../ResultDisplay';
import { Type, Camera } from 'lucide-react';
import type { CarbonFootprintResult } from '../../types';

interface EstimationSectionProps {
  // Text estimation props
  textResult: CarbonFootprintResult | null;
  textError: string | null;
  textIsLoading: boolean;
  textHasStarted: boolean;
  onTextEstimate: (dishName: string) => Promise<void>;
  onTextReset: () => void;
  
  // Image estimation props
  imageResult: CarbonFootprintResult | null;
  imageError: string | null;
  imageIsLoading: boolean;
  imageHasStarted: boolean;
  onImageEstimate: (file: File) => Promise<void>;
  onImageReset: () => void;
}

type EstimationMode = 'text' | 'image';

export default function EstimationSection({
  textResult,
  textError,
  textIsLoading,
  textHasStarted,
  onTextEstimate,
  onTextReset,
  imageResult,
  imageError,
  imageIsLoading,
  imageHasStarted,
  onImageEstimate,
  onImageReset
}: EstimationSectionProps) {
  const [mode, setMode] = useState<EstimationMode>('text');

  const currentResult = mode === 'text' ? textResult : imageResult;
  const currentError = mode === 'text' ? textError : imageError;
  const currentIsLoading = mode === 'text' ? textIsLoading : imageIsLoading;
  const currentHasStarted = mode === 'text' ? textHasStarted : imageHasStarted;
  const currentReset = mode === 'text' ? onTextReset : onImageReset;

  const handleModeChange = (newMode: EstimationMode) => {
    setMode(newMode);
    // Reset both modes when switching
    onTextReset();
    onImageReset();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mode Selection Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-1 border border-green-200">
          <Button
            variant={mode === 'text' ? 'default' : 'ghost'}
            onClick={() => handleModeChange('text')}
            className={`flex items-center gap-2 ${
              mode === 'text' 
                ? 'bg-green-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            disabled={textIsLoading || imageIsLoading}
          >
            <Type className="h-4 w-4" />
            Text Input
          </Button>
          <Button
            variant={mode === 'image' ? 'default' : 'ghost'}
            onClick={() => handleModeChange('image')}
            className={`flex items-center gap-2 ${
              mode === 'image' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            disabled={textIsLoading || imageIsLoading}
          >
            <Camera className="h-4 w-4" />
            Image Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 items-start">
        {/* Input Section */}
        <div className="space-y-4">
          {mode === 'text' ? (
            <DishInput onEstimate={onTextEstimate} isLoading={textIsLoading} />
          ) : (
            <ImageInput onImageEstimate={onImageEstimate} isLoading={imageIsLoading} />
          )}
        </div>

        {/* Result Section - Only show after user has started an estimation */}
        {currentHasStarted && (
          <div className="space-y-4">
            <ResultDisplay 
              result={currentResult} 
              error={currentError} 
              isLoading={currentIsLoading} 
              onReset={currentReset}
            />
          </div>
        )}
      </div>
    </div>
  );
}

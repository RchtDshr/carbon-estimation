import DishInput from '../DishInput';
import ImageInput from '../ImageInput';
import ResultDisplay from '../ResultDisplay';
import type { CarbonFootprintResult } from '../../types';

interface EstimationSectionProps {
  // Text estimation props
  textResult: CarbonFootprintResult | null;
  textError: string | null;
  textIsLoading: boolean;
  onTextEstimate: (dishName: string) => Promise<void>;
  onTextReset: () => void;
  
  // Image estimation props
  imageResult: CarbonFootprintResult | null;
  imageError: string | null;
  imageIsLoading: boolean;
  onImageEstimate: (file: File) => Promise<void>;
  onImageReset: () => void;
}

export default function EstimationSection({
  textResult,
  textError,
  textIsLoading,
  onTextEstimate,
  onTextReset,
  imageResult,
  imageError,
  imageIsLoading,
  onImageEstimate,
  onImageReset
}: EstimationSectionProps) {
  // Determine which result to show based on loading states and results
  // Show image result if image is loading or has result/error
  // Show text result if text is loading or has result/error and image is not active
  const imageActive = imageIsLoading || imageResult || imageError;
  const textActive = textIsLoading || textResult || textError;
  
  // Prioritize whichever is currently loading, then most recent result
  let currentResult: CarbonFootprintResult | null = null;
  let currentError: string | null = null;
  let currentIsLoading: boolean = false;
  let currentReset: () => void = onTextReset;
  let resultSource: 'text' | 'image' = 'text';

  if (imageIsLoading) {
    // Image is currently loading - show image state
    currentResult = imageResult;
    currentError = imageError;
    currentIsLoading = imageIsLoading;
    currentReset = onImageReset;
    resultSource = 'image';
  } else if (textIsLoading) {
    // Text is currently loading - show text state
    currentResult = textResult;
    currentError = textError;
    currentIsLoading = textIsLoading;
    currentReset = onTextReset;
    resultSource = 'text';
  } else if (imageActive) {
    // Image has result/error and is not loading - show image
    currentResult = imageResult;
    currentError = imageError;
    currentIsLoading = imageIsLoading;
    currentReset = onImageReset;
    resultSource = 'image';
  } else if (textActive) {
    // Text has result/error and is not loading - show text
    currentResult = textResult;
    currentError = textError;
    currentIsLoading = textIsLoading;
    currentReset = onTextReset;
    resultSource = 'text';
  }

  const showResult = imageActive || textActive;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Choose Your Analysis Method</h2>
        <p className="text-gray-600">Use either method independently or try both to compare results!</p>
      </div>

      {/* Input Components Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 relative">
        {/* Text Input */}
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 Text Input Method</h3>
            <p className="text-sm text-gray-600">Type the name of any dish</p>
          </div>
          <DishInput onEstimate={onTextEstimate} isLoading={textIsLoading} />
        </div>

        {/* Vertical Separator for large screens */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent transform -translate-x-1/2"></div>
        
        {/* OR text for mobile */}
        <div className="lg:hidden flex items-center justify-center py-4">
          <div className="bg-white px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-500 font-medium">
            OR
          </div>
        </div>

        {/* Image Input */}
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📸 Image Upload Method</h3>
            <p className="text-sm text-gray-600">Upload a photo of your dish</p>
          </div>
          <ImageInput onImageEstimate={onImageEstimate} isLoading={imageIsLoading} />
        </div>
      </div>

      {/* Single Unified Result Section */}
      {showResult && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {resultSource === 'text' ? '📝 Text Analysis Result' : '📸 Image Analysis Result'}
            </h3>
            <p className="text-sm text-gray-600">
              {resultSource === 'text' 
                ? 'Result from text input analysis' 
                : 'Result from image upload analysis'
              }
            </p>
          </div>
          <ResultDisplay 
            result={currentResult} 
            error={currentError} 
            isLoading={currentIsLoading} 
            onReset={currentReset}
          />
        </div>
      )}
    </div>
  );
}

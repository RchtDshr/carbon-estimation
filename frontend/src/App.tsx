import './App.css';
import { useDishEstimation } from './hooks/useDishEstimation';
import { useImageEstimation } from './hooks/useImageEstimation';
import {
  Header,
  HeroSection,
  InfoSection,
  SampleDishes
} from './components';
import EstimationSection from './components/sections/EstimationSection';
import ResultDisplay from './components/ResultDisplay';
import type { CarbonFootprintResult } from './types';

function App() {
  // Text estimation hook
  const {
    result: textResult,
    error: textError,
    isLoading: textIsLoading,
    handleEstimate: handleTextEstimate,
    handleReset: handleTextReset
  } = useDishEstimation();

  // Image estimation hook
  const {
    result: imageResult,
    error: imageError,
    isLoading: imageIsLoading,
    handleImageEstimate,
    handleReset: handleImageReset
  } = useImageEstimation();

  // Show sample dishes only if no results are present
  const showSampleDishes = !textResult && !imageResult && !textError && !imageError;

  // Result coordination logic - determine which result to show
  const imageActive = imageIsLoading || imageResult || imageError;
  const textActive = textIsLoading || textResult || textError;
  
  // Prioritize whichever is currently loading, then most recent result
  let currentResult: CarbonFootprintResult | null = null;
  let currentError: string | null = null;
  let currentIsLoading: boolean = false;
  let currentReset: () => void = handleTextReset;
  let resultSource: 'text' | 'image' = 'text';

  if (imageIsLoading) {
    // Image is currently loading - show image state
    currentResult = imageResult;
    currentError = imageError;
    currentIsLoading = imageIsLoading;
    currentReset = handleImageReset;
    resultSource = 'image';
  } else if (textIsLoading) {
    // Text is currently loading - show text state
    currentResult = textResult;
    currentError = textError;
    currentIsLoading = textIsLoading;
    currentReset = handleTextReset;
    resultSource = 'text';
  } else if (imageActive) {
    // Image has result/error and is not loading - show image
    currentResult = imageResult;
    currentError = imageError;
    currentIsLoading = imageIsLoading;
    currentReset = handleImageReset;
    resultSource = 'image';
  } else if (textActive) {
    // Text has result/error and is not loading - show text
    currentResult = textResult;
    currentError = textError;
    currentIsLoading = textIsLoading;
    currentReset = handleTextReset;
    resultSource = 'text';
  }

  const showResult = imageActive || textActive;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />
        
        <EstimationSection
          textIsLoading={textIsLoading}
          onTextEstimate={handleTextEstimate}
          imageIsLoading={imageIsLoading}
          onImageEstimate={handleImageEstimate}
        />

        {/* Single Unified Result Section */}
        {showResult && (
          <div className="max-w-2xl mx-auto mt-8">
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

        <InfoSection />

        <SampleDishes
          onDishSelect={handleTextEstimate}
          isLoading={textIsLoading || imageIsLoading}
          show={showSampleDishes}
        />
      </main>
    </div>
  );
}

export default App;

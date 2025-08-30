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

function App() {
  // Text estimation hook
  const {
    result: textResult,
    error: textError,
    isLoading: textIsLoading,
    hasStartedEstimation: textHasStarted,
    handleEstimate: handleTextEstimate,
    handleReset: handleTextReset
  } = useDishEstimation();

  // Image estimation hook
  const {
    result: imageResult,
    error: imageError,
    isLoading: imageIsLoading,
    hasStartedEstimation: imageHasStarted,
    handleImageEstimate,
    handleReset: handleImageReset
  } = useImageEstimation();

  // Show sample dishes only if neither estimation has started
  const showSampleDishes = !textHasStarted && !imageHasStarted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />
        
        <EstimationSection
          textResult={textResult}
          textError={textError}
          textIsLoading={textIsLoading}
          textHasStarted={textHasStarted}
          onTextEstimate={handleTextEstimate}
          onTextReset={handleTextReset}
          imageResult={imageResult}
          imageError={imageError}
          imageIsLoading={imageIsLoading}
          imageHasStarted={imageHasStarted}
          onImageEstimate={handleImageEstimate}
          onImageReset={handleImageReset}
        />

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

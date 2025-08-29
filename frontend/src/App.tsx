import { useState } from 'react';
import { Leaf } from 'lucide-react';
import './App.css';
import { estimateCarbonFootprint } from './api/api';
import DishInput from './components/DishInput';
import ResultDisplay from './components/ResultDisplay';

interface CarbonFootprintResult {
  dish: string;
  estimated_carbon_kg: number;
  ingredients: Array<{
    name: string;
    carbon_kg: number;
  }>;
}

function App() {
  const [result, setResult] = useState<CarbonFootprintResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEstimate = async (dishName: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Carbon Footprint Estimator</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Estimate Your Dish's Environmental Impact
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant carbon footprint estimates for your favorite dishes and make more sustainable food choices.
          </p>
        </div>

        {/* Main Components Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
          {/* Input Component */}
          <div className="space-y-4">
            <DishInput onEstimate={handleEstimate} isLoading={isLoading} />
          </div>

          {/* Result Component */}
          <div className="space-y-4">
            <ResultDisplay result={result} error={error} isLoading={isLoading} />
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-green-200 p-8 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-6 text-center text-xl">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-green-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Enter Dish Name</h4>
                <p>Type in the name of any dish you want to analyze</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">AI Analysis</h4>
                <p>Our AI analyzes ingredients and cooking methods</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-purple-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Get Results</h4>
                <p>Receive detailed carbon footprint estimate and explanation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Dishes Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Try These Popular Dishes</h3>
            <p className="text-gray-600">Click on any dish to see its carbon footprint</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Chicken Biryani',
              'Margherita Pizza',
              'Beef Burger',
              'Vegetable Curry',
              'Spaghetti Carbonara',
              'Sushi Roll',
              'Caesar Salad',
              'Chocolate Cake'
            ].map((dish) => (
              <button
                key={dish}
                onClick={() => handleEstimate(dish)}
                disabled={isLoading}
                className="px-4 py-2 bg-white border border-green-200 rounded-full text-sm text-gray-700 hover:bg-green-50 hover:border-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {dish}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

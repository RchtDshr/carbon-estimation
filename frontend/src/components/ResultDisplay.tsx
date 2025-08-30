import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { AlertCircle, Leaf, TrendingUp, Loader2, RotateCcw } from 'lucide-react';
import type { CarbonFootprintResult } from '../types';

interface ResultDisplayProps {
  result: CarbonFootprintResult | null;
  error: string | null;
  isLoading?: boolean;
  onReset?: () => void;
}

export default function ResultDisplay({ result, error, isLoading = false, onReset }: ResultDisplayProps) {
  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing Dish...
          </CardTitle>
          <CardDescription>
            Our AI is calculating the carbon footprint
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="pt-4 border-t border-blue-200">
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // If no result and not loading, don't render anything (handled by parent)
  if (!result) {
    return null;
  }

  const getCarbonFootprintLevel = (carbonKg: number) => {
    if (carbonKg < 1) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (carbonKg < 3) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const { level, color, bgColor, borderColor } = getCarbonFootprintLevel(result.estimated_carbon_kg);

  return (
    <Card className={`w-full max-w-md mx-auto ${borderColor} ${bgColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          Carbon Footprint Result
        </CardTitle>
        <CardDescription>
          Estimated impact for: <span className="font-medium">{result.dish}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className={`h-6 w-6 ${color}`} />
            <span className={`text-3xl font-bold ${color}`}>
              {result.estimated_carbon_kg.toFixed(2)}
            </span>
            <span className="text-lg text-gray-600">kg CO₂</span>
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${color} ${bgColor} border ${borderColor}`}>
            {level} Impact
          </div>
        </div>
        
        {result.ingredients && result.ingredients.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Ingredient Breakdown:</h4>
            <div className="space-y-2">
              {result.ingredients.map((ingredient, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">{ingredient.name}</span>
                  <span className="font-medium text-gray-900">
                    {ingredient.carbon_kg.toFixed(2)} kg CO₂
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {onReset && (
          <div className="pt-4 border-t border-gray-200">
            <Button 
              onClick={onReset}
              variant="outline" 
              size="sm"
              className="w-full text-gray-600 hover:text-gray-800"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Another Dish
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

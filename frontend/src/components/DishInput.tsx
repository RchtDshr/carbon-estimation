import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Utensils, Loader2 } from 'lucide-react';

interface DishInputProps {
  onEstimate: (dishName: string) => Promise<void>;
  isLoading: boolean;
}

export default function DishInput({ onEstimate, isLoading }: DishInputProps) {
  const [dishName, setDishName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dishName.trim()) {
      await onEstimate(dishName.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-green-600" />
          Dish Carbon Footprint Estimator
        </CardTitle>
        <CardDescription>
          Enter a dish name to estimate its carbon footprint
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dish-name">Dish Name</Label>
            <Input
              id="dish-name"
              type="text"
              placeholder="e.g., Chicken Biryani, Pasta, Pizza..."
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading || !dishName.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Estimating...
              </>
            ) : (
              'Estimate Carbon Footprint'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

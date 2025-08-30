import { SAMPLE_DISHES } from '../../constants/app';

interface SampleDishesProps {
  onDishSelect: (dish: string) => void;
  isLoading: boolean;
  show: boolean;
}

export default function SampleDishes({ onDishSelect, isLoading, show }: SampleDishesProps) {
  if (!show) return null;

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Try These Popular Dishes</h3>
        <p className="text-gray-600">Click on any dish to see its carbon footprint</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {SAMPLE_DISHES.map((dish) => (
          <button
            key={dish}
            onClick={() => onDishSelect(dish)}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-green-200 rounded-full text-sm text-gray-700 hover:bg-green-50 hover:border-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {dish}
          </button>
        ))}
      </div>
    </div>
  );
}

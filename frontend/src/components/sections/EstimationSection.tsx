import DishInput from '../DishInput';
import ImageInput from '../ImageInput';

interface EstimationSectionProps {
  // Text estimation props
  textIsLoading: boolean;
  onTextEstimate: (dishName: string) => Promise<void>;
  
  // Image estimation props
  imageIsLoading: boolean;
  onImageEstimate: (file: File) => Promise<void>;
}

export default function EstimationSection({
  textIsLoading,
  onTextEstimate,
  imageIsLoading,
  onImageEstimate,
}: EstimationSectionProps) {

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
    </div>
  );
}

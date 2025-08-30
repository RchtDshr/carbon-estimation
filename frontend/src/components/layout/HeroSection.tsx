import { APP_CONFIG } from '../../constants/app';

export default function HeroSection() {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        {APP_CONFIG.subtitle}
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {APP_CONFIG.description}
      </p>
    </div>
  );
}

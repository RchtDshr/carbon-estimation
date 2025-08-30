import { Leaf } from 'lucide-react';
import { APP_CONFIG } from '../../constants/app';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">{APP_CONFIG.title}</h1>
          </div>
        </div>
      </div>
    </header>
  );
}

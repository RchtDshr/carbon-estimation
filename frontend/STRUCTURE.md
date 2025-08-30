# Frontend Structure

This frontend is now modularized for better maintainability and clarity.

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/           # Layout components
│   │   ├── Header.tsx    # App header with title
│   │   ├── HeroSection.tsx # Hero section with title and description
│   │   └── InfoSection.tsx # "How it works" information section
│   │
│   ├── sections/         # Page sections
│   │   ├── MainContent.tsx # Main input and result area
│   │   └── SampleDishes.tsx # Sample dishes buttons
│   │
│   ├── ui/              # Reusable UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── skeleton.tsx
│   │
│   ├── DishInput.tsx    # Dish input form component
│   ├── ResultDisplay.tsx # Result display component
│   └── index.ts         # Component exports
│
├── hooks/
│   └── useDishEstimation.ts # Custom hook for dish estimation logic
│
├── types/
│   └── index.ts         # TypeScript type definitions
│
├── constants/
│   └── app.ts           # App constants and configuration
│
├── api/
│   └── api.ts           # API client and endpoints
│
└── App.tsx              # Main app component (now clean and modular)
```

## 🎯 Key Benefits

### 1. **Separation of Concerns**
- **App.tsx**: Only handles component composition and routing
- **useDishEstimation**: Contains all estimation logic and state management
- **Components**: Each has a single responsibility

### 2. **Reusability**
- Components are modular and can be easily reused
- Custom hook can be used in other components
- Types are centralized and shared

### 3. **Maintainability**
- Easy to find and modify specific functionality
- Clear file naming and organization
- Centralized constants and types

### 4. **Testability**
- Each module can be tested independently
- Logic is separated from UI components
- Easy to mock dependencies

## 🔧 How to Use

### Adding New Features
1. **New API endpoints**: Add to `api/api.ts`
2. **New types**: Add to `types/index.ts`
3. **New components**: Create in appropriate `components/` subdirectory
4. **New business logic**: Create custom hooks in `hooks/`
5. **New constants**: Add to `constants/app.ts`

### Component Usage
```tsx
// Import from the main components index
import { Header, MainContent } from './components';

// Or import specific components
import Header from './components/layout/Header';
```

### Custom Hook Usage
```tsx
import { useDishEstimation } from './hooks/useDishEstimation';

function MyComponent() {
  const { result, handleEstimate, isLoading } = useDishEstimation();
  // ... component logic
}
```

## 📋 Component Responsibilities

- **Header**: App branding and navigation
- **HeroSection**: Page title and description
- **MainContent**: Input form and result display coordination
- **DishInput**: Form for dish name input
- **ResultDisplay**: Shows estimation results with loading states
- **SampleDishes**: Quick selection buttons for popular dishes
- **InfoSection**: Educational content about how the app works

## 🎨 Styling
- Uses Tailwind CSS for styling
- shadcn/ui components for consistent design
- Responsive design with mobile-first approach

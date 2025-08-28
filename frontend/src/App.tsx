import { useState, useEffect } from 'react'
import { Leaf, Activity, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'
import './App.css'
import { healthCheck, testBackend } from './api/api'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)
  const [backendStatus, setBackendStatus] = useState<string>('Checking...')
  const [testData, setTestData] = useState<string>('')
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null)

  useEffect(() => {
    // Test backend connection on component mount
    const checkBackend = async () => {
      try {
        const health = await healthCheck()
        setBackendStatus(`Backend is healthy: ${health.status}`)
        setIsBackendHealthy(true)
        
        const test = await testBackend()
        setTestData(test.message)
      } catch (error) {
        setBackendStatus('Backend connection failed')
        setIsBackendHealthy(false)
        console.error('Backend check failed:', error)
      }
    }

    checkBackend()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Carbon Footprint Tracker</h1>
            </div>
            <div className="flex items-center space-x-2">
              {isBackendHealthy === true && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {isBackendHealthy === false && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm text-gray-600">{backendStatus}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Environmental Impact
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Monitor, analyze, and reduce your carbon footprint with our comprehensive tracking platform.
            Make informed decisions for a sustainable future.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Carbon Footprint Card */}
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Your Carbon Footprint</h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">2.4 tons</div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-green-600">-12% from last month</span>
            </div>
          </div>

          {/* Backend Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">System Status</h3>
              {isBackendHealthy === true && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {isBackendHealthy === false && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{backendStatus}</p>
            {testData && (
              <p className="text-xs text-gray-500">{testData}</p>
            )}
          </div>

          {/* Action Counter Card */}
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Eco Actions</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">{count}</div>
            <Button 
              onClick={() => setCount((count) => count + 1)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Add Eco Action
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track Emissions</h3>
            <p className="text-gray-600 text-sm">
              Monitor your daily activities and their environmental impact in real-time.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">
              Get detailed insights and trends about your carbon footprint over time.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingDown className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Reduce Impact</h3>
            <p className="text-gray-600 text-sm">
              Receive personalized recommendations to reduce your environmental impact.
            </p>
          </div>
        </div>

        {/* Development Info */}
        <div className="mt-12 bg-white/50 backdrop-blur-sm rounded-xl border border-green-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Development Status</h3>
          <p className="text-sm text-gray-600 mb-2">
            Edit <code className="bg-gray-100 px-2 py-1 rounded text-xs">src/App.tsx</code> and save to test Hot Module Reload
          </p>
          <p className="text-xs text-gray-500">
            Both frontend and backend containers are running with hot reload enabled.
          </p>
        </div>
      </main>
    </div>
  )
}

export default App

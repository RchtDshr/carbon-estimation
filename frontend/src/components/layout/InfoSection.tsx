export default function InfoSection() {
  const steps = [
    {
      number: 1,
      title: 'Choose Your Method',
      description: 'Type dish names on the left or upload images on the right - use both simultaneously!',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      number: 2,
      title: 'AI Analysis',
      description: 'Our AI analyzes text descriptions and visual ingredients independently',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      number: 3,
      title: 'Compare Results',
      description: 'Get detailed carbon footprint estimates and compare accuracy between methods',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-green-200 p-8 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-6 text-center text-xl">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className={`h-12 w-12 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                <span className={`${step.textColor} font-bold text-lg`}>{step.number}</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

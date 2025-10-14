export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Pulse Analytics
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Deep Analytics & Intelligence Dashboard
        </p>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            ✅ Setup Complete!
          </h2>
          <div className="space-y-2 text-left">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Node.js v22.20.0</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>pnpm package manager</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Next.js 15.3.2</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>React 19.0.0</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Analytics components</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Environment variables</span>
            </div>
          </div>
          <div className="mt-6">
            <a 
              href="/discover" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              View Pulse Analytics
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

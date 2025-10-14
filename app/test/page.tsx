export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Page</h1>
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Basic Test
          </h2>
          <p className="text-gray-300 mb-4">
            This is a basic test page to verify the application is working.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-orange-400 mb-2">Test 1</h3>
              <p className="text-2xl font-bold">Success</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-orange-400 mb-2">Test 2</h3>
              <p className="text-2xl font-bold">Working</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
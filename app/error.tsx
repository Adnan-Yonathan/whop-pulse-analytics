'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-red-400">Application Error</h1>
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Something went wrong!
          </h2>
          <p className="text-gray-300 mb-4">
            An error occurred while loading the application.
          </p>
          
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-orange-400 mb-2">Error Details</h3>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Message:</strong> {error.message}
            </p>
            {error.digest && (
              <p className="text-sm text-gray-300 mb-2">
                <strong>Digest:</strong> {error.digest}
              </p>
            )}
            <p className="text-sm text-gray-300">
              <strong>Stack:</strong>
            </p>
            <pre className="text-xs text-gray-400 mt-2 overflow-auto">
              {error.stack}
            </pre>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={reset}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/test'}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Go to Test Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

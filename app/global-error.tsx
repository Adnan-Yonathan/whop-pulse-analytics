'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#ef4444' }}>
              Global Application Error
            </h1>
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '0.5rem',
              padding: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                Something went wrong!
              </h2>
              <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
                A critical error occurred in the application.
              </p>
              
              <div style={{
                backgroundColor: '#374151',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#f97316' }}>
                  Error Details
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '0.5rem' }}>
                  <strong>Message:</strong> {error.message}
                </p>
                {error.digest && (
                  <p style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '0.5rem' }}>
                    <strong>Digest:</strong> {error.digest}
                  </p>
                )}
              </div>
              
              <button
                onClick={reset}
                style={{
                  backgroundColor: '#f97316',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  marginRight: '1rem'
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

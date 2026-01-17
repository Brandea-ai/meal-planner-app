'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="de">
      <body style={{
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f7',
        fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '320px',
          padding: '24px',
          backgroundColor: 'white',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto',
            backgroundColor: 'rgba(255, 59, 48, 0.15)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="M12 17h.01"/>
            </svg>
          </div>

          <h2 style={{
            marginTop: '16px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#000'
          }}>
            Ein Fehler ist aufgetreten
          </h2>

          <p style={{
            marginTop: '8px',
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.5'
          }}>
            Die App konnte nicht geladen werden. Bitte versuche es erneut.
          </p>

          {error.message && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'rgba(120, 120, 128, 0.12)',
              borderRadius: '10px',
              textAlign: 'left'
            }}>
              <p style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#8e8e93',
                margin: 0,
                wordBreak: 'break-all'
              }}>
                {error.message}
              </p>
            </div>
          )}

          <button
            onClick={reset}
            style={{
              marginTop: '24px',
              width: '100%',
              padding: '14px',
              backgroundColor: '#007aff',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Erneut versuchen
          </button>

          <button
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '12px',
              backgroundColor: 'rgba(120, 120, 128, 0.12)',
              color: '#000',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Zur Startseite
          </button>
        </div>
      </body>
    </html>
  );
}

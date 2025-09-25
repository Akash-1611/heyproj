import { useEffect, useState } from 'react';
import AnnouncementForm from './AnnouncementForm';
import AnnouncementList from './AnnouncementList';
import type { Announcement } from './types';

const API = 'https://heyproj.onrender.com/announcements';

export default function App() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Failed to load announcements');
      const data: Announcement[] = await res.json();
      setAnnouncements(data);
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleCreate = async (payload: { title: string; description?: string }) => {
    setError(null);
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Create failed');
      await fetchList();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const handleUpdateStatus = async (id: string, status: 'active' | 'closed') => {
    setError(null);
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');
      await fetchList();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const activeCount = announcements.filter(a => a.status === 'active').length;
  const totalCount = announcements.length;

  const theme = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    textSecondary: darkMode ? '#94a3b8' : '#64748b',
    border: darkMode ? '#334155' : '#e2e8f0',
    accent: '#6366f1'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, sans-serif',
      transition: 'all 0.3s ease'
    }}>
      {/* Floating particles background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
      }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: `rgba(255, 255, 255, ${darkMode ? 0.03 : 0.1})`,
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          background: darkMode 
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '20px',
          padding: '40px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '24px',
          boxShadow: darkMode 
            ? '0 25px 50px rgba(0,0,0,0.3)'
            : '0 25px 50px rgba(79, 70, 229, 0.2)',
          backdropFilter: 'blur(10px)',
          border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div />
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowStats(!showStats)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
              >
                📊 Stats
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
          
          <h1 style={{
            margin: 0,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            letterSpacing: '-0.025em',
            background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>🏢 GoBasera</h1>
          <p style={{
            margin: '12px 0 0 0',
            fontSize: '1.25rem',
            opacity: 0.95,
            fontWeight: '500'
          }}>Smart Residents Noticeboard</p>
          
          {showStats && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              marginTop: '24px',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>{activeCount}</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Active</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>{totalCount}</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Total</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                  {totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0}%
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Active Rate</div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '24px'
        }}>
          <AnnouncementForm onCreate={handleCreate} theme={theme} />

          {loading ? (
            <div style={{
              background: theme.cardBg,
              borderRadius: '16px',
              padding: '60px',
              textAlign: 'center',
              boxShadow: darkMode 
                ? '0 10px 25px rgba(0,0,0,0.3)'
                : '0 10px 25px rgba(0,0,0,0.08)',
              border: `1px solid ${theme.border}`
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: `4px solid ${theme.border}`,
                borderTop: `4px solid ${theme.accent}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }} />
              <p style={{ color: theme.textSecondary, fontSize: '1.1rem' }}>Loading announcements…</p>
            </div>
          ) : error ? (
            <div style={{
              background: darkMode ? '#7f1d1d' : '#fef2f2',
              border: `2px solid ${darkMode ? '#dc2626' : '#fecaca'}`,
              borderRadius: '12px',
              padding: '20px',
              color: darkMode ? '#fca5a5' : '#dc2626',
              textAlign: 'center',
              fontSize: '1.1rem'
            }}>
              ⚠️ {error}
            </div>
          ) : (
            <AnnouncementList 
              items={announcements} 
              onClose={(id) => handleUpdateStatus(id, 'closed')} 
              theme={theme}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

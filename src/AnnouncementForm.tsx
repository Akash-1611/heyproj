import { useState } from 'react';

interface Props {
  onCreate: (payload: { title: string; description?: string }) => Promise<boolean>;
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
  };
}

export default function AnnouncementForm({ onCreate, theme }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!title.trim()) {
      setLocalError('Title is required');
      return;
    }
    setSubmitting(true);
    const ok = await onCreate({ title: title.trim(), description: description.trim() || undefined });
    setSubmitting(false);
    if (!ok) {
      setLocalError('Failed to create announcement');
    } else {
      setTitle('');
      setDescription('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const titleLength = title.length;
  const descLength = description.length;

  return (
    <div style={{
      background: theme.cardBg,
      borderRadius: '20px',
      padding: '32px',
      border: `1px solid ${theme.border}`,
      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4, #10b981)',
        backgroundSize: '300% 100%',
        animation: 'gradient 3s ease infinite'
      }} />
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.75rem',
          fontWeight: '700',
          color: theme.text,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          ✨ Create Announcement
        </h2>
        
        {success && (
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '500',
            animation: 'slideIn 0.3s ease'
          }}>
            ✓ Posted!
          </div>
        )}
      </div>
      
      <form onSubmit={submit}>
        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <label style={{
            display: 'flex',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '8px',
         
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Title <span style={{ color: '#ef4444' }}>*</span></span>
            <span style={{
              fontSize: '0.75rem',
              color: theme.textSecondary,
              fontWeight: '400'
            }}>
              {titleLength}/100
            </span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              disabled={submitting}
              placeholder="e.g., Water tank cleaning scheduled for tomorrow"
              onFocus={() => setFocusedField('title')}
              onBlur={() => setFocusedField(null)}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: `2px solid ${focusedField === 'title' ? theme.accent : theme.border}`,
                borderRadius: '12px',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box',
                background: theme.cardBg,
                color: theme.text,
                boxShadow: focusedField === 'title' 
                  ? `0 0 0 3px ${theme.accent}20` 
                  : 'none'
              }}
            />
            {title && (
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#10b981',
                fontSize: '1.2rem'
              }}>
                ✓
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <label style={{
  display: 'flex',
  fontSize: '0.95rem',
  fontWeight: '600',
  color: theme.text,
  marginBottom: '8px',
  alignItems: 'center',
  justifyContent: 'space-between'
}}>

            <span>Description</span>
            <span style={{
              fontSize: '0.75rem',
              color: theme.textSecondary,
              fontWeight: '400'
            }}>
              {descLength}/500
            </span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            disabled={submitting}
            placeholder="Add more details, timing, or instructions..."
            rows={4}
            onFocus={() => setFocusedField('description')}
            onBlur={() => setFocusedField(null)}
            style={{
              width: '100%',
              padding: '16px 20px',
              border: `2px solid ${focusedField === 'description' ? theme.accent : theme.border}`,
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              background: theme.cardBg,
              color: theme.text,
              lineHeight: '1.5',
              boxShadow: focusedField === 'description' 
                ? `0 0 0 3px ${theme.accent}20` 
                : 'none'
            }}
          />
        </div>

        {localError && (
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            border: '2px solid #fecaca',
            borderRadius: '12px',
            padding: '16px',
            color: '#dc2626',
            fontSize: '0.95rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideIn 0.3s ease'
          }}>
            ⚠️ {localError}
          </div>
        )}

        <button 
          type="submit" 
          disabled={!title.trim() || submitting}
          style={{
            width: '100%',
            background: !title.trim() || submitting 
              ? theme.textSecondary
              : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: !title.trim() || submitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            if (!submitting && title.trim()) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {submitting ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Publishing...
            </>
          ) : (
            <>
              🚀 Publish Announcement
            </>
          )}
        </button>
      </form>
      
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

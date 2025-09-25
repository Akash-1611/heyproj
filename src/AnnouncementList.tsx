import { useState } from 'react';
import type { Announcement } from './types';

interface Props {
  items: Announcement[];
  onClose: (id: string) => void;
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
  };
}

export default function AnnouncementList({ items, onClose, theme }: Props) {
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  if (!items.length) {
    return (
      <div style={{
        background: theme.cardBg,
        borderRadius: '20px',
        padding: '80px 40px',
        textAlign: 'center',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
      }}>
        <div style={{ 
          fontSize: '5rem', 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>📢</div>
        <h3 style={{ 
          margin: '0 0 12px 0', 
          color: theme.text,
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>No announcements yet</h3>
        <p style={{ 
          margin: 0, 
          color: theme.textSecondary,
          fontSize: '1.1rem'
        }}>Create your first announcement to get started!</p>
      </div>
    );
  }

  const activeItems = items.filter(item => item.status === 'active');
  const closedItems = items.filter(item => item.status === 'closed');
  
  const filteredItems = filter === 'all' ? items : 
                       filter === 'active' ? activeItems : closedItems;
  
  const sortedItems = [...filteredItems].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div>
      {/* Filter and Sort Controls */}
      <div style={{
        background: theme.cardBg,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              color: theme.text,
              fontWeight: '600',
              fontSize: '1rem'
            }}>Filter:</span>
            {(['all', 'active', 'closed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f 
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : 'transparent',
                  color: filter === f ? 'white' : theme.textSecondary,
                  border: filter === f ? 'none' : `1px solid ${theme.border}`,
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize'
                }}
              >
                {f} {f === 'all' ? `(${items.length})` : 
                     f === 'active' ? `(${activeItems.length})` : 
                     `(${closedItems.length})`}
              </button>
            ))}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              color: theme.text,
              fontWeight: '600',
              fontSize: '1rem'
            }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              style={{
                background: theme.cardBg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.875rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements Grid */}
      {sortedItems.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {sortedItems.map((item, index) => (
            <AnnouncementCard 
              key={item.id} 
              item={item} 
              onClose={onClose} 
              theme={theme}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div style={{
          background: theme.cardBg,
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          border: `1px solid ${theme.border}`,
          color: theme.textSecondary
        }}>
          No {filter} announcements found.
        </div>
      )}
    </div>
  );
}

function AnnouncementCard({ 
  item, 
  onClose, 
  theme, 
  index 
}: { 
  item: Announcement; 
  onClose: (id: string) => void; 
  theme: any;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = item.status === 'active';
  
  const timeAgo = (date: string) => {
    const now = new Date().getTime();
    const created = new Date(date).getTime();
    const diff = now - created;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };
  
  return (
    <div 
      style={{
        background: theme.cardBg,
        border: `2px solid ${isActive ? '#6366f1' : theme.border}`,
        borderRadius: '20px',
        padding: '24px',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0,0,0,0.15)'
          : '0 8px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        animation: `slideIn 0.5s ease ${index * 0.1}s both`,
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status indicator */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: isActive 
          ? 'linear-gradient(90deg, #10b981, #059669)'
          : 'linear-gradient(90deg, #6b7280, #4b5563)'
      }} />
      
      {/* Priority badge for active items */}
      {isActive && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          🔥 Live
        </div>
      )}
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
        paddingRight: isActive ? '60px' : '0'
      }}>
        <h4 style={{
          margin: 0,
          fontSize: '1.25rem',
          fontWeight: '700',
          color: theme.text,
          lineHeight: '1.4',
          flex: 1
        }}>
          {item.title}
        </h4>
      </div>
      
      {item.description && (
        <p style={{
          margin: '0 0 20px 0',
          color: theme.textSecondary,
          lineHeight: '1.6',
          fontSize: '1rem'
        }}>
          {item.description}
        </p>
      )}
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: `1px solid ${theme.border}`
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: theme.textSecondary,
            fontSize: '0.875rem'
          }}>
            📅 {new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <div style={{
            color: theme.accent,
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            {timeAgo(item.createdAt)}
          </div>
        </div>
        
        {isActive ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(item.id);
            }}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 16px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }}
          >
            ✕ Close
          </button>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            ✓ Closed
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Home, Loader2 } from 'lucide-react';
import ProfileTab from './components/ProfileTab';
import ApartmentsTab from './components/ApartmentsTab';

const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'apartments'>('apartments');

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '0.5rem',
  };

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: 'var(--radius)',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? 'var(--accent-bg)' : 'transparent',
    color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
    border: 'none',
    outline: 'none',
  });

  return (
    <div className="animate-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--foreground)' }}>Settings</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Manage your account settings, apartments, and profile.</p>
      </header>

      <div style={tabContainerStyle}>
        <button 
          style={tabButtonStyle(activeTab === 'apartments')} 
          onClick={() => setActiveTab('apartments')}
        >
          <Home size={18} />
          Apartments
        </button>
        <button 
          style={tabButtonStyle(activeTab === 'profile')} 
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} />
          Profile
        </button>
      </div>

      <div className="tab-content transition-all duration-300">
        {activeTab === 'apartments' ? <ApartmentsTab /> : <ProfileTab />}
      </div>
    </div>
  );
};

export default SettingsPage;

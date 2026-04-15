import React from 'react';

const DashboardPage: React.FC = () => {

  return (
    <div className="animate-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--foreground)' }}>Dashboard</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Welcome back! Here's what's happening today.</p>
      </header>

    </div>
  );
};

export default DashboardPage;

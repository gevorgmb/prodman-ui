import React from 'react';
import { useApartments } from '../../context/ApartmentContext';

const DashboardPage: React.FC = () => {
  const { selectedApartment } = useApartments();

  return (
    <div className="animate-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--foreground)' }}>Dashboard</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>
          Welcome back! Currently managing: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{selectedApartment?.name}</span>
        </p>
      </header>
    </div>
  );
};

export default DashboardPage;

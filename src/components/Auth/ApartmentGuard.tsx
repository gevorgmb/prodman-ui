import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useApartments } from '../../context/ApartmentContext';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface ApartmentGuardProps {
  children?: React.ReactNode;
}

const ApartmentGuard: React.FC<ApartmentGuardProps> = ({ children }) => {
  const { selectedApartment, isLoading, apartments } = useApartments();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--primary)', borderRightColor: 'transparent', borderLeftColor: 'transparent', borderBottomColor: 'transparent', borderRadius: '50%', borderStyle: 'solid', borderWidth: '3px', animation: 'spin 1s linear infinite' }}></div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!selectedApartment) {
    const hasApartments = apartments.length > 0;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '2rem'
      }}>
        <Card style={{ maxWidth: '500px', textAlign: 'center', padding: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            color: '#f59e0b',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <AlertTriangle size={32} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            {hasApartments ? 'Select an Apartment' : 'Add your first Apartment'}
          </h2>

          <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', lineHeight: 1.6 }}>
            {hasApartments
              ? 'You have apartments listed, but none are currently selected. Please select an active apartment to access the dashboard and manage your products.'
              : 'You haven\'t added any apartments yet. You need at least one apartment to start managing products and viewing your dashboard.'}
          </p>

          {!hasApartments && (
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--primary)',
              backgroundColor: 'rgba(79, 70, 229, 0.05)',
              padding: '0.75rem',
              borderRadius: 'var(--radius)',
              marginBottom: '2rem',
              fontWeight: 500
            }}>
              Tip: You can set an apartment as "Default" to have it automatically selected every time you log in.
            </p>
          )}

          <Button
            onClick={() => navigate('/settings')}
            style={{ width: '100%', gap: '0.75rem' }}
          >
            Go to Apartments Settings <ArrowRight size={18} />
          </Button>
        </Card>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ApartmentGuard;

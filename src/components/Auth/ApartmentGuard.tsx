import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useApartments } from '../../context/ApartmentContext';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { Home } from 'lucide-react';

interface ApartmentGuardProps {
  children?: React.ReactNode;
}

const ApartmentGuard: React.FC<ApartmentGuardProps> = ({ children }) => {
  const { selectedApartment, isLoading, apartments, selectApartment } = useApartments();
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

          {hasApartments ? (
            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Available Apartments
              </p>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {apartments.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => selectApartment(apt)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '0.5rem',
                      backgroundColor: 'rgba(79, 70, 229, 0.1)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Home size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600 }}>{apt.name}</h4>
                        <span style={{
                          padding: '0.125rem 0.375rem',
                          backgroundColor: apt.isOwner ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          color: apt.isOwner ? '#10b981' : '#3b82f6',
                          borderRadius: '4px',
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {apt.isOwner ? 'Owner' : apt.role}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--muted-foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
                        {apt.description || 'No description'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectApartment(apt);
                      }}
                      style={{ fontSize: '0.75rem', height: '28px' }}
                    >
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
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
            variant={hasApartments ? "ghost" : "primary"}
          >
            {hasApartments ? 'Manage Apartments' : 'Go to Apartments Settings'} <ArrowRight size={18} />
          </Button>
        </Card>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ApartmentGuard;

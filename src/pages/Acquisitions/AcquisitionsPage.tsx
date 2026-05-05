import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { acquisitionApi, type Acquisition } from '../../api/services/acquisition.api';
import Button from '../../components/UI/Button';
import { Plus, Pencil, Trash2, ShoppingCart, Clock, CheckCircle2, XCircle } from 'lucide-react';

const AcquisitionsPage: React.FC = () => {
  const [acquisitions, setAcquisitions] = useState<Acquisition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await acquisitionApi.getAcquisitions();
      setAcquisitions(data.acquisitions);
    } catch (error) {
      console.error('Failed to fetch acquisitions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this acquisition?')) {
      try {
        await acquisitionApi.deleteAcquisition(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete acquisition:', error);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock size={16} />;
      case 'complete': return <CheckCircle2 size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'var(--muted-foreground)';
      case 'complete': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return 'inherit';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--foreground)' }}>Acquisitions</h1>
          <p style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>Manage your purchases and stock acquisitions.</p>
        </div>
        <Button onClick={() => navigate('/acquisitions/new')} style={{ gap: '0.5rem' }}>
          <Plus size={20} />
          Add Acquisition
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
      ) : (
        <div style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--muted)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Store Name</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Description</th>
                <th style={{ textAlign: 'right', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {acquisitions.map((acquisition) => (
                <tr key={acquisition.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '0.5rem',
                        backgroundColor: 'var(--accent-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)'
                      }}>
                        <ShoppingCart size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{acquisition.storeName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>ID: #{acquisition.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: `${getStatusColor(acquisition.status)}15`,
                      color: getStatusColor(acquisition.status),
                      textTransform: 'capitalize'
                    }}>
                      {getStatusIcon(acquisition.status)}
                      {acquisition.status}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {acquisition.description || 'No description'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/acquisitions/${acquisition.id}`)}>
                        <Pencil size={18} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(acquisition.id)} style={{ color: '#ef4444' }}>
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {acquisitions.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                    No acquisitions found. Start by adding one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AcquisitionsPage;

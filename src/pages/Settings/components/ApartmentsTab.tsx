import React, { useState } from 'react';
import { apartmentApi } from '../../../api/services/apartment.api';
import Card from '../../../components/UI/Card';
import Button from '../../../components/UI/Button';
import Input from '../../../components/UI/Input';
import { Plus, Edit2, Trash2, Home, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useApartments, type Apartment } from '../../../context/ApartmentContext';

const ApartmentsTab: React.FC = () => {
  const { apartments, selectedApartment, selectApartment, refreshApartments, isLoading: isFetching } = useApartments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const fetchApartments = async () => {
    try {
      await refreshApartments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch apartments.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingApartment) {
        await apartmentApi.updateApartment(editingApartment.id, { name, description, is_default: isDefault });
      } else {
        await apartmentApi.createApartment({ name, description, is_default: isDefault });
      }
      await fetchApartments();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save apartment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (apt: Apartment) => {
    if (apt.isDefault) return;
    setIsSubmitting(true);
    try {
      await apartmentApi.updateApartment(apt.id, {
        name: apt.name,
        description: apt.description,
        is_default: true
      });
      await refreshApartments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set default apartment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingApartment(null);
    setName('');
    setDescription('');
    setIsDefault(false);
  };

  const handleEdit = (apt: Apartment) => {
    setEditingApartment(apt);
    setName(apt.name);
    setDescription(apt.description);
    setIsDefault(apt.isDefault);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this apartment?')) return;
    try {
      await apartmentApi.deleteApartment(id);
      await fetchApartments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete apartment.');
    }
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {error && (
        <div style={{
          padding: '1rem',
          borderRadius: 'var(--radius)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {showForm ? (
        <Card
          title={editingApartment ? 'Edit Apartment' : 'Add New Apartment'}
          description="Enter the details for the apartment."
        >
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <Input
              label="Apartment Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: 'var(--muted-foreground)' }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Brief description of the apartment..."
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--input)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '1rem',
                  minHeight: '100px',
                  outline: 'none focus:ring-2 focus:ring-primary'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                id="isDefault"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  accentColor: 'var(--primary)',
                  cursor: 'pointer'
                }}
              />
              <label htmlFor="isDefault" style={{ fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
                Set as default apartment
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting}>
                {editingApartment ? 'Update Apartment' : 'Create Apartment'}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)' }}>Your Apartments </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Manage and view all your listed apartments.</p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              size="sm"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--card)',
                boxShadow: 'var(--shadow)',
                fontWeight: 600,
              }}
            >
              <Plus size={18} color="var(--primary)" />
              Add Apartment
            </Button>
          </div>

          {isFetching ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 className="animate-spin" size={32} color="var(--primary)" />
            </div>
          ) : apartments.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--muted-foreground)',
              backgroundColor: 'var(--muted)',
              borderRadius: 'var(--radius)',
              border: '2px dashed var(--border)'
            }}>
              <Home size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>No apartments found. Add your first one to get started!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem', width: '50px' }}></th>
                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Name</th>
                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Is Default</th>
                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Description</th>
                    <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Created At</th>
                    <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right', color: 'var(--muted-foreground)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apartments.map((apt) => (
                    <tr 
                      key={apt.id} 
                      style={{ 
                        borderBottom: '1px solid var(--border)', 
                        transition: 'all 0.2s',
                        backgroundColor: selectedApartment?.id === apt.id ? 'rgba(79, 70, 229, 0.03)' : 'transparent',
                        cursor: 'pointer'
                      }}
                      onClick={() => selectApartment(apt)}
                    >
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <input
                          type="radio"
                          name="selected-apartment"
                          checked={selectedApartment?.id === apt.id}
                          onChange={() => selectApartment(apt)}
                          style={{ cursor: 'pointer', accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                        />
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{apt.name}</td>
                      <td style={{ padding: '1rem' }}>
                        {apt.isDefault && (
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: 'rgba(79, 70, 229, 0.1)',
                            color: 'var(--primary)',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            Yes
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {apt.description}
                      </td>
                      <td style={{ padding: '1rem' }}>{new Date(apt.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                          {!apt.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleSetDefault(apt); }} 
                              title="Set as Default"
                              style={{ color: 'var(--primary)', padding: '0.25rem' }}
                            >
                              <CheckCircle size={16} />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(apt); }} title="Edit">
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleDelete(apt.id); }}
                            title="Delete"
                            style={{ color: '#ef4444' }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ApartmentsTab;

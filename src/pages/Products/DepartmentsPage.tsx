import React, { useEffect, useState } from 'react';
import { departmentApi, type Department } from '../../api/services/department.api';
import Button from '../../components/UI/Button';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';

const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState<Department | null>(null);
  const [name, setName] = useState('');

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await departmentApi.getDepartments();
      setDepartments(data.departments);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentDept) {
        await departmentApi.updateDepartment(currentDept.id, { name });
      } else {
        await departmentApi.createDepartment({ name });
      }
      setIsModalOpen(false);
      setName('');
      setCurrentDept(null);
      fetchDepartments();
    } catch (error) {
      console.error('Failed to save department:', error);
    }
  };

  const handleEdit = (dept: Department) => {
    setCurrentDept(dept);
    setName(dept.name);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentApi.deleteDepartment(id);
        fetchDepartments();
      } catch (error) {
        console.error('Failed to delete department:', error);
      }
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--foreground)' }}>Departments</h1>
          <p style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>Manage product departments for your apartment.</p>
        </div>
        <Button onClick={() => { setCurrentDept(null); setName(''); setIsModalOpen(true); }} style={{ gap: '0.5rem' }}>
          <Plus size={20} />
          Add Department
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
      ) : (
        <div style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--muted)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Name</th>
                <th style={{ textAlign: 'right', padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ color: 'var(--primary)' }}><Building2 size={18} /></div>
                      <span style={{ fontWeight: 500 }}>{dept.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(dept)} style={{ padding: '0.5rem' }}>
                        <Pencil size={18} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(dept.id)} style={{ padding: '0.5rem', color: '#ef4444' }}>
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {departments.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                    No departments found. Create your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            backgroundColor: 'var(--card)',
            padding: '2rem',
            borderRadius: 'var(--radius)',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{currentDept ? 'Edit Department' : 'Add Department'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Department Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Electronics"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;

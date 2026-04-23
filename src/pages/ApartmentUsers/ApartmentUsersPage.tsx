import React, { useState, useEffect, useCallback } from 'react';
import { useApartments } from '../../context/ApartmentContext';
import { apartmentUserApi } from '../../api/services/apartmentUser.api';
import type { ApartmentUser, ApartmentUserLookupResponse } from '../../api/services/apartmentUser.api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { 
  Users, 
  Search, 
  UserPlus, 
  Trash2, 
  Mail, 
  Phone, 
  Shield, 
  User as UserIcon,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';

const ApartmentUsersPage: React.FC = () => {
  const { selectedApartment } = useApartments();
  const [users, setUsers] = useState<ApartmentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'email' | 'phone'>('email');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<ApartmentUserLookupResponse | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Add User State
  const [selectedRole, setSelectedRole] = useState('member');
  const [isAdding, setIsAdding] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!selectedApartment) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await apartmentUserApi.getUsers(selectedApartment.id);
      setUsers(data.users);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch apartment users.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedApartment]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApartment || !searchQuery) return;
    
    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);
    
    try {
      let result;
      if (searchType === 'email') {
        result = await apartmentUserApi.findByEmail(selectedApartment.id, searchQuery);
      } else {
        result = await apartmentUserApi.findByPhone(selectedApartment.id, searchQuery);
      }
      setSearchResult(result);
    } catch (err: any) {
      setSearchError(err.response?.data?.message || 'User not found.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddUser = async () => {
    if (!selectedApartment || !searchResult) return;
    
    setIsAdding(true);
    try {
      await apartmentUserApi.addUser(selectedApartment.id, searchResult.user.id, selectedRole);
      setSearchResult(null);
      setSearchQuery('');
      await fetchUsers();
    } catch (err: any) {
      setSearchError(err.response?.data?.message || 'Failed to add user.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveUser = async (userId: number) => {
    if (!selectedApartment || !window.confirm('Are you sure you want to remove this user from the apartment?')) return;
    
    try {
      await apartmentUserApi.removeUser(selectedApartment.id, userId);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove user.');
    }
  };

  if (!selectedApartment) return null;

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Apartment Users</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Manage members and their roles for {selectedApartment.name}.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        {/* Users List */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Users size={24} color="var(--primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Current Members</h2>
              <span style={{ 
                marginLeft: 'auto',
                backgroundColor: 'var(--accent-bg)',
                color: 'var(--primary)',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                {users.length} Users
              </span>
            </div>

            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <Loader2 className="animate-spin" size={32} color="var(--primary)" />
              </div>
            ) : error ? (
              <div style={{
                padding: '1.5rem',
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
            ) : users.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--muted-foreground)',
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius)',
                border: '2px dashed var(--border)'
              }}>
                <UserIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No other users in this apartment yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {users.map((item) => (
                  <div 
                    key={item.membershipId}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'var(--card)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--accent-bg)', 
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                      }}>
                        {item.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h4 style={{ margin: 0, fontWeight: 600 }}>{item.user.name}</h4>
                          <span style={{
                            padding: '0.125rem 0.5rem',
                            backgroundColor: item.role === 'admin' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                            color: item.role === 'admin' ? '#f59e0b' : 'var(--primary)',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            {item.role === 'admin' ? <Shield size={12} /> : null}
                            {item.role}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Mail size={12} /> {item.user.email}
                          </span>
                          {item.user.phone && (
                            <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Phone size={12} /> {item.user.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Don't allow removing yourself if you're the owner? 
                        The API handles permissions, but UI-wise we could hide it.
                        For now, let's show it but the user might get a 403.
                    */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveUser(item.user.id)}
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Add User Sidebar */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <Card title="Add New User" description="Search for a user by email or phone to add them to this apartment.">
            <form onSubmit={handleSearch} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <button 
                  type="button"
                  onClick={() => setSearchType('email')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: searchType === 'email' ? 'var(--accent-bg)' : 'transparent',
                    color: searchType === 'email' ? 'var(--primary)' : 'var(--muted-foreground)',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Email
                </button>
                <button 
                  type="button"
                  onClick={() => setSearchType('phone')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: searchType === 'phone' ? 'var(--accent-bg)' : 'transparent',
                    color: searchType === 'phone' ? 'var(--primary)' : 'var(--muted-foreground)',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Phone
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <Input
                  placeholder={searchType === 'email' ? "user@example.com" : "+123456789"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <div style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}>
                  {searchType === 'email' ? <Mail size={18} /> : <Phone size={18} />}
                </div>
              </div>

              <Button type="submit" isLoading={isSearching} style={{ width: '100%', gap: '0.5rem' }}>
                <Search size={18} /> Search User
              </Button>
            </form>

            {searchError && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                {searchError}
              </div>
            )}

            {searchResult && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--primary)',
                backgroundColor: 'rgba(79, 70, 229, 0.02)',
                position: 'relative'
              }}>
                <button 
                  onClick={() => setSearchResult(null)}
                  style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary)', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.875rem'
                  }}>
                    {searchResult.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>{searchResult.user.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{searchResult.user.email}</p>
                  </div>
                </div>

                {searchResult.alreadyInApartment ? (
                  <div style={{ fontSize: '0.875rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                    <Shield size={16} /> Already a member
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                        Assign Role
                      </label>
                      <select 
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius)',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--card)',
                          color: 'var(--foreground)',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <Button onClick={handleAddUser} isLoading={isAdding} style={{ width: '100%', gap: '0.5rem' }}>
                      <UserPlus size={18} /> Add to Apartment
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApartmentUsersPage;

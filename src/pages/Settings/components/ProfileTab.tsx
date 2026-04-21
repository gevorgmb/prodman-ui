import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { userApi } from '../../../api/services/user.api';
import Card from '../../../components/UI/Card';
import Button from '../../../components/UI/Button';
import Input from '../../../components/UI/Input';
import { CheckCircle, AlertCircle, Mail, Phone } from 'lucide-react';

const ProfileTab: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSendVerification = async (type: 'email' | 'phone') => {
    setIsLoading(true);
    setMessage(null);
    try {
      await userApi.sendVerification(type);
      setMessage({ type: 'success', text: `Verification ${type} sent successfully.` });
      await refreshUser();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || `Failed to send ${type} verification.` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);
    try {
      await userApi.updateProfile({ name, phone });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      await refreshUser();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerifyCode = async (type: 'email' | 'phone') => {
    setIsLoading(true);
    setMessage(null);
    const code = type === 'email' ? emailCode : phoneCode;
    try {
      await userApi.verifyCode(type, code);
      setMessage({ type: 'success', text: `${type.charAt(0).toUpperCase() + type.slice(1)} verified successfully!` });
      if (type === 'email') setEmailCode('');
      else setPhoneCode('');
      await refreshUser();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || `Failed to verify ${type}.` });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {message && (
        <div style={{
          padding: '1rem',
          borderRadius: 'var(--radius)',
          backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          color: message.type === 'success' ? '#22c55e' : '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <Card title="Profile Information" description="General details about your account.">
        <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '1rem' }}>
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />

          {/* Email Section */}
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} color="var(--muted-foreground)" />
                <span style={{ fontWeight: 500 }}>Email Address</span>
              </div>
              {user.emailVerifiedAt ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#22c55e', fontSize: '0.875rem', fontWeight: 600 }}>
                  <CheckCircle size={16} /> Verified
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.875rem', fontWeight: 600 }}>
                  <AlertCircle size={16} /> Unverified
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Input
                  value={user.email}
                  readOnly
                  style={{
                    backgroundColor: 'var(--muted)',
                    cursor: 'not-allowed',
                    paddingRight: '2.5rem',
                    color: 'var(--muted-foreground)',
                    borderStyle: 'dashed'
                  }}
                />
              </div>
              {!user.emailVerifiedAt && !user.emailVerification && (
                <Button
                  variant="outline"
                  onClick={() => handleSendVerification('email')}
                  isLoading={isLoading}
                  disabled={user.emailVerificationLocked}
                >
                  Send Verification
                </Button>
              )}
            </div>

            {!user.emailVerifiedAt && user.emailVerification && (
              <div style={{
                marginTop: '0.5rem',
                padding: '1rem',
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-end'
              }}>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Enter verification code"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    label="Verification Code"
                  />
                </div>
                <Button onClick={() => handleVerifyCode('email')} isLoading={isLoading}>
                  Verify
                </Button>
              </div>
            )}
          </div>

          {/* Phone Section */}
          <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={18} color="var(--muted-foreground)" />
                <span style={{ fontWeight: 500 }}>Phone Number</span>
              </div>
              {user.phone ? (
                user.phoneVerifiedAt ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#22c55e', fontSize: '0.875rem', fontWeight: 600 }}>
                    <CheckCircle size={16} /> Verified
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.875rem', fontWeight: 600 }}>
                    <AlertCircle size={16} /> Unverified
                  </div>
                )
              ) : (
                <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Not provided</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="No phone number linked"
                />
              </div>
              {user.phone && !user.phoneVerifiedAt && !user.phoneVerification && (
                <Button
                  variant="outline"
                  onClick={() => handleSendVerification('phone')}
                  isLoading={isLoading}
                  disabled={user.phoneVerificationLocked}
                >
                  Send Verification
                </Button>
              )}
            </div>

            {user.phone && !user.phoneVerifiedAt && user.phoneVerification && (
              <div style={{
                marginTop: '0.5rem',
                padding: '1rem',
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-end'
              }}>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Enter SMS code"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    label="SMS Code"
                  />
                </div>
                <Button onClick={() => handleVerifyCode('phone')} isLoading={isLoading}>
                  Verify
                </Button>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" isLoading={isUpdating}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfileTab;

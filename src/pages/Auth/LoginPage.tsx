import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/services/auth.api';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const { token, user } = await authApi.login(data);
      login(token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '1rem',
    }}>
      <Card
        title="Welcome Back"
        description="Sign in to your account to continue"
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius)',
              color: '#ef4444',
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            style={{ width: '100%', marginTop: '0.5rem', gap: '1rem' }}
            isLoading={isLoading}
          >
            <LogIn size={20} strokeWidth={2.5} />
            <span style={{ fontSize: '1.5rem' }}>   Sign In</span>
          </Button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--muted-foreground)',
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;

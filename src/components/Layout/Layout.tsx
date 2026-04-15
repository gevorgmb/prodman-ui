import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Package, Settings, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../UI/Button';

const Layout: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/products', icon: <Package size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const sidebarStyle: React.CSSProperties = {
    width: '260px',
    height: '100vh',
    borderRight: '1px solid var(--border)',
    backgroundColor: 'var(--card)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
  };

  const mainStyle: React.CSSProperties = {
    marginLeft: '260px',
    flex: 1,
    padding: '2rem',
    minHeight: '100vh',
    backgroundColor: 'var(--background)',
  };

  const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius)',
    color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
    backgroundColor: isActive ? 'var(--accent-bg)' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 500,
    transition: 'all 0.2s ease',
    marginBottom: '0.5rem',
  });

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '0.5rem',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}>
            P
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Product Manager</h2>
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={navLinkStyle(location.pathname === item.path)}
              className="nav-link"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div style={{
          marginTop: 'auto',
          padding: '1rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted-foreground)',
            }}>
              <User size={20} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: 0 }}>
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            style={{ justifyContent: 'flex-start', padding: '0.5rem 0.75rem', color: '#ef4444', gap: '1rem' }}
            onClick={logout}
          >
            <LogOut size={20} strokeWidth={2.5} />
            <span style={{ fontSize: '1.5rem' }}>   Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

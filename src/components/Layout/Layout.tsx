import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Package, Settings, User, Home, Users, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApartments } from '../../context/ApartmentContext';
import Button from '../UI/Button';

const Layout: React.FC = () => {
  const { logout, user } = useAuth();
  const { selectedApartment } = useApartments();
  const location = useLocation();

  const isOwnerOrAdmin = selectedApartment && (selectedApartment.isOwner || selectedApartment.role === 'admin');

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    ...(selectedApartment && isOwnerOrAdmin ? [
      {
        name: 'Products',
        path: '/products',
        icon: <Package size={20} />,
        children: [
          { name: 'All Products', path: '/products' },
          { name: 'Departments', path: '/products/departments' },
          { name: 'Categories', path: '/products/categories' },
        ]
      },
          { name: 'Apartment Users', path: '/apartment-users', icon: <Users size={20} /> },
          { name: 'Acquisitions', path: '/acquisitions', icon: <ShoppingCart size={20} /> }
        ] : []),
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
        <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
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

          {selectedApartment && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              backgroundColor: 'rgba(79, 70, 229, 0.05)',
              borderRadius: 'var(--radius)',
              border: '1px solid rgba(79, 70, 229, 0.1)',
            }}>
              <div style={{ color: 'var(--primary)' }}>
                <Home size={18} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.025em' }}>Active Apartment</p>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {selectedApartment.name}
                </h3>
              </div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map((item) => {
            const isParentActive = !!(location.pathname === item.path ||
              (item.children && item.children.some(child => location.pathname === child.path)));

            return (
              <div key={item.path}>
                <Link
                  to={item.path}
                  style={navLinkStyle(isParentActive)}
                  className="nav-link"
                >
                  {item.icon}
                  {item.name}
                </Link>

                {item.children && isParentActive && (
                  <div style={{ paddingLeft: '2.75rem', marginBottom: '0.5rem' }}>
                    {item.children.map(child => (
                      <Link
                        key={child.path}
                        to={child.path}
                        style={{
                          display: 'block',
                          padding: '0.5rem 0',
                          fontSize: '0.875rem',
                          color: location.pathname === child.path ? 'var(--primary)' : 'var(--muted-foreground)',
                          textDecoration: 'none',
                          fontWeight: location.pathname === child.path ? 600 : 500,
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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

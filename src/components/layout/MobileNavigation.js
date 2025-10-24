// src/components/layout/MobileNavigation.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = useSelector(state => state.societyAuth);

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    {
      path: '/resident-dashboard',
      icon: 'bi-house',
      label: 'Home',
      roles: ['resident']
    },
    {
      path: '/admin-dashboard',
      icon: 'bi-speedometer2',
      label: 'Dashboard',
      roles: ['admin']
    },
    {
      path: '/maintenance',
      icon: 'bi-receipt',
      label: 'Maintenance',
      roles: ['resident', 'admin']
    },
    {
      path: '/complaints',
      icon: 'bi-chat-dots',
      label: 'Complaints',
      roles: ['resident', 'admin']
    },
    {
      path: '/notices',
      icon: 'bi-bell',
      label: 'Notices',
      roles: ['resident', 'admin']
    },
    {
      path: '/profile',
      icon: 'bi-person',
      label: 'Profile',
      roles: ['resident', 'admin']
    }
  ];

  // Filter navigation items based on user role
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(role)
  );

  return (
    <Navbar 
      fixed="bottom" 
      className="d-md-none bg-white border-top shadow-sm"
      style={{ 
        height: '60px',
        padding: '0',
        zIndex: 1030
      }}
    >
      <Nav className="w-100 d-flex justify-content-around align-items-center">
        {filteredItems.map((item) => (
          <Nav.Item key={item.path}>
            <Nav.Link
              onClick={() => navigate(item.path)}
              className={`d-flex flex-column align-items-center justify-content-center text-decoration-none ${
                isActive(item.path) ? 'text-primary' : 'text-muted'
              }`}
              style={{
                padding: '8px 12px',
                minWidth: '60px',
                height: '60px',
                border: 'none',
                background: 'transparent'
              }}
            >
              <i 
                className={`${item.icon} fs-5 mb-1`}
                style={{ 
                  fontSize: isActive(item.path) ? '1.2rem' : '1rem',
                  transition: 'font-size 0.2s ease'
                }}
              ></i>
              <span 
                className="small"
                style={{ 
                  fontSize: '0.7rem',
                  fontWeight: isActive(item.path) ? '600' : '400'
                }}
              >
                {item.label}
              </span>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </Navbar>
  );
};

export default MobileNavigation;

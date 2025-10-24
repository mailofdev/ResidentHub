// src/components/layout/SocietyTopbar.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navbar, Nav, Dropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../../features/societyCare/userManagement/LogoutButton';
import ThemeToggle from '../display/ThemeToggle';

const SocietyTopbar = ({
  showSearch = false,
  showNavMenu = true,
  showUserMenu = true,
  showThemeToggle = false,
  showIcons = true,
}) => {
  const { user } = useSelector(state => state.societyAuth);
  const navigate = useNavigate();
  const [navbarOpen, setNavbarOpen] = useState(false);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'danger';
      case 'Resident': return 'primary';
      default: return 'secondary';
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleUserManagementClick = () => {
    navigate('/user-management');
  };

  return (
    <Navbar 
      bg="white" 
      expand="lg" 
      className="shadow-sm border-bottom"
      style={{ minHeight: '60px' }}
    >
      <div className="container-fluid">
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          <i className="bi bi-building me-2"></i>
          SocietyCare
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setNavbarOpen(!navbarOpen)}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {showNavMenu && (
              <>
                <Nav.Link as={Link} to="/resident-dashboard">
                  <i className="bi bi-house-door me-1"></i>
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/payments">
                  <i className="bi bi-credit-card me-1"></i>
                  Payments
                </Nav.Link>
                <Nav.Link as={Link} to="/complaints">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Complaints
                </Nav.Link>
                <Nav.Link as={Link} to="/notices">
                  <i className="bi bi-megaphone me-1"></i>
                  Notices
                </Nav.Link>
                {user?.role === 'Admin' && (
                  <Nav.Link as={Link} to="/admin-dashboard">
                    <i className="bi bi-gear me-1"></i>
                    Admin
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>

          <Nav className="ms-auto">
            {showThemeToggle && (
              <Nav.Item className="d-flex align-items-center me-3">
                <ThemeToggle size="sm" showLabel={false} />
              </Nav.Item>
            )}
            {showUserMenu && user && (
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="outline-primary" 
                  className="d-flex align-items-center"
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                         style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-start">
                      <div className="fw-bold" style={{ fontSize: '14px' }}>
                        {user.name || 'User'}
                      </div>
                      <div className="small text-muted">
                        <Badge bg={getRoleBadgeColor(user.role)} pill style={{ fontSize: '10px' }}>
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow">
                  <Dropdown.Header>
                    <div className="text-center">
                      <div className="fw-bold">{user.name}</div>
                      <small className="text-muted">{user.email}</small>
                    </div>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  
                  <Dropdown.Item onClick={handleProfileClick}>
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </Dropdown.Item>
                  
                  {user.role === 'Admin' && (
                    <Dropdown.Item onClick={handleUserManagementClick}>
                      <i className="bi bi-people me-2"></i>
                      User Management
                    </Dropdown.Item>
                  )}
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item as="div" className="px-3">
                    <LogoutButton 
                      variant="outline-danger" 
                      size="sm" 
                      showText={true}
                    />
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default SocietyTopbar;

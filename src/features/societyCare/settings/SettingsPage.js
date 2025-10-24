// src/features/societyCare/settings/SettingsPage.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Button, Alert, Form, Tab, Tabs, Badge, Modal } from 'react-bootstrap';
import { 
  initializeSettingsThunk,
  updateSocietySettingsThunk,
  updateThemeSettingsThunk,
  updateNotificationSettingsThunk,
  uploadSocietyLogoThunk
} from './settingsThunks';
import { 
  setSocietySettings,
  setThemeSettings,
  setNotificationSettings,
  clearError
} from './settingsSlice';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../contexts/ToastContext';
import { useOffline } from '../../../hooks/useOffline';
import OfflineIndicator from '../../../components/common/OfflineIndicator';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user, role } = useSelector(state => state.societyAuth);
  const { 
    societySettings, 
    themeSettings, 
    notificationSettings, 
    loading, 
    error,
    isInitialized 
  } = useSelector(state => state.settings);
  const { showSuccess, showError } = useToast();
  const isOffline = useOffline();

  const [activeTab, setActiveTab] = useState('society');
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Initialize settings
  useEffect(() => {
    if (!isInitialized && user?.uid) {
      dispatch(initializeSettingsThunk());
    }
  }, [dispatch, user?.uid, isInitialized]);

  const handleSocietySettingsUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const settingsData = Object.fromEntries(formData.entries());
    
    try {
      await dispatch(updateSocietySettingsThunk(settingsData)).unwrap();
      showSuccess('Success', 'Society settings updated successfully');
    } catch (error) {
      showError('Error', 'Failed to update society settings');
    }
  };

  const handleThemeSettingsUpdate = async (themeData) => {
    try {
      await dispatch(updateThemeSettingsThunk(themeData)).unwrap();
      showSuccess('Success', 'Theme settings updated successfully');
    } catch (error) {
      showError('Error', 'Failed to update theme settings');
    }
  };

  const handleNotificationSettingsUpdate = async (notificationData) => {
    try {
      await dispatch(updateNotificationSettingsThunk(notificationData)).unwrap();
      showSuccess('Success', 'Notification settings updated successfully');
    } catch (error) {
      showError('Error', 'Failed to update notification settings');
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    try {
      const logoUrl = await dispatch(uploadSocietyLogoThunk(logoFile)).unwrap();
      await dispatch(updateSocietySettingsThunk({ logo: logoUrl })).unwrap();
      showSuccess('Success', 'Logo uploaded successfully');
      setShowLogoModal(false);
      setLogoFile(null);
      setLogoPreview(null);
    } catch (error) {
      showError('Error', 'Failed to upload logo');
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleToggleDarkMode = () => {
    handleThemeSettingsUpdate({ isDarkMode: !themeSettings.isDarkMode });
  };

  if (loading && !isInitialized) {
    return <LoadingSpinner text="Loading settings..." fullScreen />;
  }

  return (
    <div className="container-fluid py-4">
      <OfflineIndicator />
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-primary">Settings</h2>
          <p className="text-muted">Manage your society settings and preferences</p>
        </div>
        {role === 'admin' && (
          <Badge bg="primary" className="fs-6">
            <i className="bi bi-shield-check me-1"></i>
            Admin Access
          </Badge>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => dispatch(clearError())}>
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="society" title="Society Info">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-building me-2"></i>
                Society Information
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSocietySettingsUpdate}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Society Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        defaultValue={societySettings.name}
                        disabled={isOffline || role !== 'admin'}
                        placeholder="Enter society name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contact Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="contact"
                        defaultValue={societySettings.contact}
                        disabled={isOffline || role !== 'admin'}
                        placeholder="Enter contact number"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        defaultValue={societySettings.email}
                        disabled={isOffline || role !== 'admin'}
                        placeholder="Enter email address"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Established Year</Form.Label>
                      <Form.Control
                        type="number"
                        name="establishedYear"
                        defaultValue={societySettings.establishedYear}
                        disabled={isOffline || role !== 'admin'}
                        placeholder="e.g., 2020"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    defaultValue={societySettings.address}
                    disabled={isOffline || role !== 'admin'}
                    placeholder="Enter complete address"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Total Flats</Form.Label>
                      <Form.Control
                        type="number"
                        name="totalFlats"
                        defaultValue={societySettings.totalFlats}
                        disabled={isOffline || role !== 'admin'}
                        placeholder="Enter total number of flats"
                        min="1"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Society Logo</Form.Label>
                      <div className="d-flex align-items-center">
                        {societySettings.logo && (
                          <img 
                            src={societySettings.logo} 
                            alt="Society Logo" 
                            className="me-3"
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        )}
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setShowLogoModal(true)}
                          disabled={isOffline || role !== 'admin'}
                        >
                          <i className="bi bi-upload me-1"></i>
                          {societySettings.logo ? 'Change Logo' : 'Upload Logo'}
                        </Button>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                {role === 'admin' && (
                  <div className="d-flex justify-content-end">
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={isOffline}
                    >
                      <i className="bi bi-check me-2"></i>
                      Update Society Info
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="theme" title="Theme">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-palette me-2"></i>
                Theme Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dark Mode</Form.Label>
                    <div className="form-check form-switch">
                      <Form.Check.Input
                        type="checkbox"
                        checked={themeSettings.isDarkMode}
                        onChange={handleToggleDarkMode}
                        disabled={isOffline}
                      />
                      <Form.Check.Label>
                        {themeSettings.isDarkMode ? 'Dark Mode Enabled' : 'Light Mode Enabled'}
                      </Form.Check.Label>
                    </div>
                    <Form.Text className="text-muted">
                      Toggle between light and dark themes
                    </Form.Text>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Primary Color</Form.Label>
                    <Form.Control
                      type="color"
                      value={themeSettings.primaryColor}
                      onChange={(e) => handleThemeSettingsUpdate({ primaryColor: e.target.value })}
                      disabled={isOffline}
                    />
                    <Form.Text className="text-muted">
                      Main color used throughout the app
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Alert variant="info">
                <i className="bi bi-info-circle me-2"></i>
                Theme changes are applied immediately and saved automatically.
              </Alert>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="notifications" title="Notifications">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-bell me-2"></i>
                Notification Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Push Notifications</Form.Label>
                      <div className="form-check form-switch">
                        <Form.Check.Input
                          type="checkbox"
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) => handleNotificationSettingsUpdate({ 
                            pushNotifications: e.target.checked 
                          })}
                          disabled={isOffline}
                        />
                        <Form.Check.Label>
                          Enable push notifications
                        </Form.Check.Label>
                      </div>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Notifications</Form.Label>
                      <div className="form-check form-switch">
                        <Form.Check.Input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => handleNotificationSettingsUpdate({ 
                            emailNotifications: e.target.checked 
                          })}
                          disabled={isOffline}
                        />
                        <Form.Check.Label>
                          Enable email notifications
                        </Form.Check.Label>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Maintenance Reminders</Form.Label>
                      <div className="form-check form-switch">
                        <Form.Check.Input
                          type="checkbox"
                          checked={notificationSettings.maintenanceReminders}
                          onChange={(e) => handleNotificationSettingsUpdate({ 
                            maintenanceReminders: e.target.checked 
                          })}
                          disabled={isOffline}
                        />
                        <Form.Check.Label>
                          Get reminders for maintenance dues
                        </Form.Check.Label>
                      </div>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Complaint Updates</Form.Label>
                      <div className="form-check form-switch">
                        <Form.Check.Input
                          type="checkbox"
                          checked={notificationSettings.complaintUpdates}
                          onChange={(e) => handleNotificationSettingsUpdate({ 
                            complaintUpdates: e.target.checked 
                          })}
                          disabled={isOffline}
                        />
                        <Form.Check.Label>
                          Get updates on complaint status
                        </Form.Check.Label>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Notice Alerts</Form.Label>
                      <div className="form-check form-switch">
                        <Form.Check.Input
                          type="checkbox"
                          checked={notificationSettings.noticeAlerts}
                          onChange={(e) => handleNotificationSettingsUpdate({ 
                            noticeAlerts: e.target.checked 
                          })}
                          disabled={isOffline}
                        />
                        <Form.Check.Label>
                          Get alerts for new notices
                        </Form.Check.Label>
                      </div>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>SMS Notifications</Form.Label>
                      <div className="form-check form-switch">
                        <Form.Check.Input
                          type="checkbox"
                          checked={notificationSettings.smsNotifications}
                          onChange={(e) => handleNotificationSettingsUpdate({ 
                            smsNotifications: e.target.checked 
                          })}
                          disabled={isOffline}
                        />
                        <Form.Check.Label>
                          Enable SMS notifications
                        </Form.Check.Label>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Alert variant="info">
                  <i className="bi bi-info-circle me-2"></i>
                  Notification settings are saved automatically when changed.
                </Alert>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Logo Upload Modal */}
      <Modal show={showLogoModal} onHide={() => setShowLogoModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-upload me-2"></i>
            Upload Society Logo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select Logo Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleLogoFileChange}
            />
            <Form.Text className="text-muted">
              Recommended size: 200x200px. Supported formats: JPG, PNG, GIF
            </Form.Text>
          </Form.Group>

          {logoPreview && (
            <div className="text-center mb-3">
              <img 
                src={logoPreview} 
                alt="Logo Preview" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  objectFit: 'contain',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px'
                }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowLogoModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleLogoUpload}
            disabled={!logoFile}
          >
            <i className="bi bi-upload me-2"></i>
            Upload Logo
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SettingsPage;

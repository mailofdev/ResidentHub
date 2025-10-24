// src/features/societyCare/maintenance/MaintenancePage.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Button, Alert, Badge, Table, Form, Modal } from 'react-bootstrap';
import { 
  getAllMaintenanceRecordsThunk,
  getResidentMaintenanceRecordsThunk,
  createMaintenanceRecordThunk,
  updateMaintenanceRecordThunk,
  deleteMaintenanceRecordThunk,
  markPaymentPaidThunk,
  generateMaintenanceReportThunk
} from './maintenanceThunks';
import { 
  setMaintenanceRecords,
  setFilters,
  setPagination,
  clearError
} from './maintenanceSlice';
import { listenToMaintenanceRecords, listenToResidentMaintenanceRecords } from '../../../services/firebase/maintenanceService';
import { formatCurrency, formatDate } from '../../../utils/validation';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useToast } from '../../../contexts/ToastContext';
import { useOffline } from '../../../hooks/useOffline';
import OfflineIndicator from '../../../components/common/OfflineIndicator';
import MaintenanceForm from './MaintenanceForm';
import PaymentModal from './PaymentModal';

const MaintenancePage = () => {
  const dispatch = useDispatch();
  const { user, role } = useSelector(state => state.societyAuth);
  const { 
    maintenanceRecords, 
    loading, 
    error, 
    filters, 
    pagination 
  } = useSelector(state => state.maintenance);
  const { residents } = useSelector(state => state.residents);
  const { showSuccess, showError } = useToast();
  const isOffline = useOffline();

  const [showForm, setShowForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);

  // Load data based on user role
  useEffect(() => {
    const loadData = async () => {
      try {
        if (role === 'admin') {
          await dispatch(getAllMaintenanceRecordsThunk()).unwrap();
        } else {
          await dispatch(getResidentMaintenanceRecordsThunk(user.uid)).unwrap();
        }
      } catch (error) {
        showError('Error', 'Failed to load maintenance records');
      }
    };

    if (user?.uid) {
      loadData();
    }
  }, [dispatch, user?.uid, role, showError]);

  // Set up real-time listeners
  useEffect(() => {
    if (!user?.uid || isOffline) return;

    let unsubscribe;
    if (role === 'admin') {
      unsubscribe = listenToMaintenanceRecords((records) => {
        dispatch(setMaintenanceRecords(records));
      });
    } else {
      unsubscribe = listenToResidentMaintenanceRecords(user.uid, (records) => {
        dispatch(setMaintenanceRecords(records));
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch, user?.uid, role, isOffline]);

  // Filter and paginate records
  const filteredRecords = maintenanceRecords.filter(record => {
    if (filters.status !== 'all' && record.status !== filters.status) return false;
    if (filters.month !== 'all') {
      const recordMonth = new Date(record.createdAt).getMonth() + 1;
      if (recordMonth.toString() !== filters.month) return false;
    }
    if (filters.year && new Date(record.createdAt).getFullYear().toString() !== filters.year) return false;
    return true;
  });

  const paginatedRecords = filteredRecords.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  // Calculate statistics
  const statistics = {
    total: maintenanceRecords.length,
    pending: maintenanceRecords.filter(r => r.status === 'pending').length,
    paid: maintenanceRecords.filter(r => r.status === 'paid').length,
    overdue: maintenanceRecords.filter(r => r.status === 'pending' && new Date(r.dueDate) < new Date()).length,
    totalAmount: maintenanceRecords.reduce((sum, r) => sum + (r.amount || 0), 0),
    pendingAmount: maintenanceRecords.filter(r => r.status === 'pending').reduce((sum, r) => sum + (r.amount || 0), 0),
    paidAmount: maintenanceRecords.filter(r => r.status === 'paid').reduce((sum, r) => sum + (r.amount || 0), 0)
  };

  const handleCreateRecord = async (recordData) => {
    try {
      await dispatch(createMaintenanceRecordThunk(recordData)).unwrap();
      showSuccess('Success', 'Maintenance record created successfully');
      setShowForm(false);
    } catch (error) {
      showError('Error', 'Failed to create maintenance record');
    }
  };

  const handleUpdateRecord = async (recordId, updates) => {
    try {
      await dispatch(updateMaintenanceRecordThunk({ recordId, updates })).unwrap();
      showSuccess('Success', 'Maintenance record updated successfully');
      setEditingRecord(null);
    } catch (error) {
      showError('Error', 'Failed to update maintenance record');
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await dispatch(deleteMaintenanceRecordThunk(recordId)).unwrap();
        showSuccess('Success', 'Maintenance record deleted successfully');
      } catch (error) {
        showError('Error', 'Failed to delete maintenance record');
      }
    }
  };

  const handleMarkPaid = async (paymentData) => {
    try {
      await dispatch(markPaymentPaidThunk({ 
        recordId: selectedRecord.id, 
        paymentData 
      })).unwrap();
      showSuccess('Success', 'Payment marked as paid successfully');
      setShowPaymentModal(false);
      setSelectedRecord(null);
    } catch (error) {
      showError('Error', 'Failed to mark payment as paid');
    }
  };

  const handleExportReport = async () => {
    try {
      const result = await dispatch(generateMaintenanceReportThunk({
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
        endDate: new Date().toISOString(),
        format: 'csv'
      })).unwrap();

      // Download CSV
      const blob = new Blob([result.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `maintenance-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess('Success', 'Report exported successfully');
    } catch (error) {
      showError('Error', 'Failed to export report');
    }
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handlePageChange = (page) => {
    dispatch(setPagination({ currentPage: page }));
  };

  if (loading && maintenanceRecords.length === 0) {
    return <LoadingSpinner text="Loading maintenance records..." fullScreen />;
  }

  return (
    <div className="container-fluid py-4">
      <OfflineIndicator />
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-primary">Maintenance Management</h2>
          <p className="text-muted">Manage maintenance dues and payments</p>
        </div>
        <div>
          {role === 'admin' && (
            <>
              <Button 
                variant="outline-primary" 
                className="me-2"
                onClick={handleExportReport}
                disabled={isOffline}
              >
                <i className="bi bi-download me-2"></i>
                Export Report
              </Button>
              <Button 
                variant="primary"
                onClick={() => setShowForm(true)}
                disabled={isOffline}
              >
                <i className="bi bi-plus me-2"></i>
                Add Record
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => dispatch(clearError())}>
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-primary mb-2">
                <i className="bi bi-receipt fs-1"></i>
              </div>
              <h5 className="fw-bold">{statistics.total}</h5>
              <p className="text-muted mb-0">Total Records</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-warning mb-2">
                <i className="bi bi-clock fs-1"></i>
              </div>
              <h5 className="fw-bold">{statistics.pending}</h5>
              <p className="text-muted mb-0">Pending Payments</p>
              <Badge bg="warning" className="mt-2">
                {formatCurrency(statistics.pendingAmount)}
              </Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-danger mb-2">
                <i className="bi bi-exclamation-triangle fs-1"></i>
              </div>
              <h5 className="fw-bold">{statistics.overdue}</h5>
              <p className="text-muted mb-0">Overdue</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <i className="bi bi-check-circle fs-1"></i>
              </div>
              <h5 className="fw-bold">{statistics.paid}</h5>
              <p className="text-muted mb-0">Paid</p>
              <Badge bg="success" className="mt-2">
                {formatCurrency(statistics.paidAmount)}
              </Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select 
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Month</Form.Label>
                <Form.Select 
                  value={filters.month}
                  onChange={(e) => handleFilterChange('month', e.target.value)}
                >
                  <option value="all">All Months</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Select 
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option value="all">All Years</option>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button 
                variant="outline-secondary"
                onClick={() => dispatch(setFilters({ status: 'all', month: 'all', year: new Date().getFullYear() }))}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Records Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Maintenance Records</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <LoadingSpinner text="Loading records..." />
          ) : paginatedRecords.length === 0 ? (
            <Alert variant="info" className="mb-0">
              <i className="bi bi-info-circle me-2"></i>
              No maintenance records found.
            </Alert>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Flat No.</th>
                      <th>Resident</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.flatNumber}</td>
                        <td>{record.residentName}</td>
                        <td>{record.description}</td>
                        <td>{formatCurrency(record.amount)}</td>
                        <td>{formatDate(record.dueDate)}</td>
                        <td>
                          <Badge 
                            bg={record.status === 'paid' ? 'success' : 
                                record.status === 'pending' ? 'warning' : 'danger'}
                          >
                            {record.status}
                          </Badge>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            {record.status === 'pending' && (
                              <Button 
                                variant="outline-success" 
                                size="sm"
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setShowPaymentModal(true);
                                }}
                                disabled={isOffline}
                              >
                                <i className="bi bi-check"></i>
                              </Button>
                            )}
                            {role === 'admin' && (
                              <>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => setEditingRecord(record)}
                                  disabled={isOffline}
                                >
                                  <i className="bi bi-pencil"></i>
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleDeleteRecord(record.id)}
                                  disabled={isOffline}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredRecords.length > pagination.itemsPerPage && (
                <div className="d-flex justify-content-center mt-3">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: Math.ceil(filteredRecords.length / pagination.itemsPerPage) }, (_, i) => (
                        <li key={i + 1} className={`page-item ${pagination.currentPage === i + 1 ? 'active' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${pagination.currentPage === Math.ceil(filteredRecords.length / pagination.itemsPerPage) ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === Math.ceil(filteredRecords.length / pagination.itemsPerPage)}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Modals */}
      <MaintenanceForm
        show={showForm || !!editingRecord}
        onHide={() => {
          setShowForm(false);
          setEditingRecord(null);
        }}
        onSubmit={editingRecord ? 
          (data) => handleUpdateRecord(editingRecord.id, data) : 
          handleCreateRecord
        }
        initialData={editingRecord}
        residents={residents}
      />

      <PaymentModal
        show={showPaymentModal}
        onHide={() => {
          setShowPaymentModal(false);
          setSelectedRecord(null);
        }}
        onSubmit={handleMarkPaid}
        record={selectedRecord}
      />
    </div>
  );
};

export default MaintenancePage;

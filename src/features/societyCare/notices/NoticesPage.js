// src/features/societyCare/notices/NoticesPage.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Alert, Badge } from 'react-bootstrap';
import { getAllNoticesThunk } from './noticeThunks';
import { setNotices } from './noticeSlice';
import { listenToNotices } from '../../../services/firebase/noticeService';

const NoticesPage = () => {
  const dispatch = useDispatch();
  const { notices, loading } = useSelector(state => state.notices);

  useEffect(() => {
    // Load initial data
    dispatch(getAllNoticesThunk());

    // Set up real-time listener
    const unsubscribe = listenToNotices((noticesData) => {
      dispatch(setNotices(noticesData));
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Society Notices</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Badge bg="primary" pill>{notices.length} Notices</Badge>
        </div>
      </div>

      {notices.length === 0 ? (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          No notices available at the moment. Check back later for updates.
        </Alert>
      ) : (
        <Row>
          {notices.map((notice) => (
            <Col lg={6} xl={4} key={notice.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">{notice.title}</h6>
                    <small>
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </Card.Header>
                <Card.Body>
                  <p className="card-text">{notice.description}</p>
                  {notice.category && (
                    <Badge bg="secondary" className="mb-2">
                      {notice.category}
                    </Badge>
                  )}
                </Card.Body>
                <Card.Footer className="bg-light">
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                    Posted: {new Date(notice.createdAt).toLocaleString()}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default NoticesPage;

// src/components/common/ErrorBoundary.js
import React from 'react';
import { Alert, Button, Card } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <Card className="border-danger">
                <Card.Header className="bg-danger text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Something went wrong
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Alert variant="danger">
                    <h6>An unexpected error occurred</h6>
                    <p className="mb-0">
                      We're sorry, but something went wrong. Please try refreshing the page or contact support if the problem persists.
                    </p>
                  </Alert>
                  
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="mt-3">
                      <summary className="text-muted">Error Details (Development)</summary>
                      <pre className="mt-2 p-3 bg-light border rounded small">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                  
                  <div className="d-flex gap-2 mt-3">
                    <Button variant="primary" onClick={this.handleReload}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Reload Page
                    </Button>
                    <Button variant="outline-secondary" onClick={() => window.history.back()}>
                      <i className="bi bi-arrow-left me-1"></i>
                      Go Back
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

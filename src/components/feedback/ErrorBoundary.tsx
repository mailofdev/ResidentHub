import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorState } from './ErrorState'

interface Props {
  children: ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
  message?: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <ErrorState
            title={this.props.fallbackTitle || 'Application error'}
            description={this.state.message || 'Please refresh the page and try again.'}
            onRetry={() => this.setState({ hasError: false, message: undefined })}
          />
        </div>
      )
    }
    return this.props.children
  }
}

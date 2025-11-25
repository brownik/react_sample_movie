import { Component } from 'react';
import type { ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>⚠️ 오류가 발생했습니다</h2>
            <p>예상치 못한 문제가 발생했습니다. 페이지를 새로고침하거나 다시 시도해주세요.</p>
            {this.state.error && (
              <details className="error-boundary-details">
                <summary>오류 세부 정보</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
            <div className="error-boundary-actions">
              <button onClick={this.handleReset} className="error-boundary-button">
                다시 시도
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="error-boundary-button primary"
              >
                홈으로 가기
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { StartupErrorScreen } from './StartupErrorScreen';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Catches render-time crashes so a single broken component shows a readable
 * screen instead of a blank page. Only the error message is surfaced, never
 * configuration values or user data.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Unexpected error.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error:', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <StartupErrorScreen message={this.state.message} />;
    }
    return this.props.children;
  }
}

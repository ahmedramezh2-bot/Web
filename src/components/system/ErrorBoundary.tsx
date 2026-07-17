'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

import { createLogger } from '@lib/logger';

/**
 * Error Boundaries.
 *
 * The engine's last line of defense against an uncaught render-time
 * exception. Deliberately minimal — no visual design decisions belong
 * here (that is UI Integration Bible territory, out of scope for this
 * milestone); this component's only job is to stop a crash from taking
 * down the entire mounted tree and to log what broke.
 */

const logger = createLogger('ErrorBoundary');

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error('uncaught render error', {
      message: error.message,
      componentStack: info.componentStack ?? '',
    });
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

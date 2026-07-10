/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = "#/";
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100"
          id="error-boundary-fallback"
        >
          <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-500 p-5 rounded-full mb-6">
            <AlertOctagon className="w-14 h-14 animate-bounce" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-2">
            Something went wrong
          </h1>
          <h2 className="text-base font-extrabold text-zinc-700 dark:text-zinc-300 mb-2">
            An unexpected runtime error occurred.
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mb-8 leading-relaxed">
            {this.state.error?.message || "Our engineering team has been notified. Please try reloading or returning home."}
          </p>
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <button
              onClick={this.handleReset}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/10 flex items-center gap-1.5 cursor-pointer transition-all"
              id="error-reload-btn"
            >
              <RotateCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.hash = "#/";
              }}
              className="px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-transparent dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              id="error-home-btn"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

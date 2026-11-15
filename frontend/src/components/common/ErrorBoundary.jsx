import React from 'react';
import { AlertTriangle, RefreshCw, LayoutDashboard, ShieldCheck } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AgriShift Uncaught Error Boundary caught an exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoDashboard = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-agri-cream flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-agri-sand shadow-card p-6 sm:p-8 space-y-6 text-center animate-in fade-in">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <AlertTriangle className="w-7 h-7 text-amber-600" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-mist text-agri-forest text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-agri-leaf" />
                <span>AgriShift Safe Mode</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-agri-forest">
                Dashboard View Interrupted
              </h2>
              <p className="text-xs sm:text-sm text-agri-forest/70 leading-relaxed">
                An unexpected display error occurred while rendering the agricultural intelligence view. Your farmer session and farm data remain secure.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-agri-cream rounded-xl text-left border border-agri-sand overflow-auto max-h-32 text-xs font-mono text-red-800">
                <div className="font-bold mb-1">Diagnostic Detail:</div>
                <div>{this.state.error.message || String(this.state.error)}</div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-agri-forest hover:bg-agri-paddy text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-soft"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleGoDashboard}
                className="flex-1 py-3 px-4 rounded-xl bg-agri-mist hover:bg-agri-sand text-agri-forest text-xs font-bold border border-agri-sand transition-colors flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-agri-paddy" />
                <span>Dashboard Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

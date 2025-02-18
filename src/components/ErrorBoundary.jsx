import { Component } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./ui/Button";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-surface">
          <div className="text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-danger-soft flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-7 h-7 text-danger" />
            </div>
            <h1 className="text-xl font-bold text-text mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-text-muted mb-6 max-w-xs mx-auto">
              An unexpected error occurred. Try refreshing the page.
            </p>
            <Button onClick={() => this.setState({ hasError: false })}>
              Try Again
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

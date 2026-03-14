import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

interface ErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  message?: string;
  title?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ 
  error, 
  resetErrorBoundary, 
  message = "We encountered an unexpected error. Please try again or go back home.", 
  title = "Something went wrong" 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        
        {error && (
          <div className="mb-8 p-3 bg-red-50 rounded-lg text-left overflow-auto max-h-32">
            <code className="text-xs text-red-700 whitespace-pre-wrap">{error.message}</code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {resetErrorBoundary ? (
            <Button 
              variant="primary" 
              onClick={resetErrorBoundary}
              icon={RefreshCcw}
            >
              Try Again
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
              icon={RefreshCcw}
            >
              Reload Page
            </Button>
          )}
          
          <Button 
            variant="secondary" 
            onClick={() => navigate('/')}
            icon={Home}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

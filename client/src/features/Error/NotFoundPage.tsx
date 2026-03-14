import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-8 h-8 text-blue-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="primary" 
            onClick={() => navigate('/')}
            icon={Home}
          >
            Go Home
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)}
            icon={ArrowLeft}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

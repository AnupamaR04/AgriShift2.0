import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-agri-cream flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-agri-forest flex items-center justify-center text-agri-mist mb-6 shadow-soft">
        <Sprout className="w-8 h-8 text-agri-lightleaf" />
      </div>
      
      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-agri-mist text-agri-forest mb-4">
        404 Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-agri-forest">
        Farm Route Not Found
      </h1>

      <p className="mt-3 text-base text-agri-forest/70 max-w-md">
        The agricultural intelligence page you requested does not exist or has been relocated.
      </p>

      <div className="flex items-center gap-3 mt-8">
        <Button variant="secondary" size="md" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Go Back
        </Button>
        <Button variant="primary" size="md" onClick={() => navigate('/')}>
          <Home className="w-4 h-4 mr-1.5" />
          Return Home
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;

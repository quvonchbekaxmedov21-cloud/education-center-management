import { Link } from 'react-router';
import { Home } from 'lucide-react';
import { Button } from './ui/button';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-700 mb-2">Page Not Found</h2>
      <p className="text-slate-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">
          <Home className="size-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}

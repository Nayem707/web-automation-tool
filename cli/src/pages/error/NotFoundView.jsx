import { Link } from 'react-router-dom';

const NotFoundView = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white p-8 text-center">
      <p className="text-sm font-medium text-indigo-600">404</p>
      <h1 className="text-3xl font-bold text-gray-900">Page not found</h1>
      <p className="max-w-md text-sm text-gray-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundView;

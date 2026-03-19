import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

const ScraperError = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  return (
    <Card className="border-red-200 bg-red-50">
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-red-900">Scraping Error</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700">
            Try Again
          </Button>
          <Button onClick={onDismiss} variant="ghost">
            Dismiss
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ScraperError;

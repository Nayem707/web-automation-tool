import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

const DashboardError = ({ message, onRetry }) => {
  return (
    <Card title="Unable to load dashboard" subtitle={message || 'Unexpected error occurred'}>
      <Button onClick={onRetry}>Try Again</Button>
    </Card>
  );
};

export default DashboardError;

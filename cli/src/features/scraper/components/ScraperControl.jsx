import Button from '../../../components/ui/Button';

const ScraperControl = ({ onStart, onStop, onRestart, isLoading, isActive }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {!isActive ? (
        <Button onClick={onStart} disabled={isLoading}>
          Start Scraping
        </Button>
      ) : (
        <>
          <Button onClick={onStop} variant="ghost" disabled={isLoading}>
            Stop
          </Button>
          <Button onClick={onRestart} variant="ghost" disabled={isLoading}>
            Restart
          </Button>
        </>
      )}
    </div>
  );
};

export default ScraperControl;

import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import { usePlayers } from '../../../features/players/hooks/usePlayers';

const UsersView = () => {
  const { players, isLoading, error, dismissError } = usePlayers(true);

  const columns = [
    {
      key: 'image',
      label: 'Photo',
      render: (value) =>
        value ? (
          <img
            src={value}
            alt="Player"
            className="h-12 w-12 rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <span className="text-xs text-gray-500">N/A</span>
          </div>
        ),
    },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'team', label: 'Team' },
    { key: 'era', label: 'Era' },
    { key: 'position', label: 'Position' },
    { key: 'height', label: 'Height' },
    { key: 'weight', label: 'Weight' },
    { key: 'nationality', label: 'Nationality' },
    {
      key: 'championships',
      label: 'CS',
      render: (value) => (
        <span className={`font-semibold ${value > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
          {value || 0}
        </span>
      ),
    },
    {
      key: 'gamesPlayed',
      label: 'GP',
      render: (value) => value ?? 'N/A',
    },
    {
      key: 'avgPoints',
      label: 'PPG',
      render: (value) => (value !== null ? value.toFixed(1) : 'N/A'),
    },
    {
      key: 'avgRebounds',
      label: 'RPG',
      render: (value) => (value !== null ? value.toFixed(1) : 'N/A'),
    },
    {
      key: 'avgAssists',
      label: 'APG',
      render: (value) => (value !== null ? value.toFixed(1) : 'N/A'),
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      render: (value) => (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          {value || 1}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card title="All Players" subtitle="Loading player data...">
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="All Players" subtitle="Error loading players">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={dismissError}
                  className="text-sm font-medium text-red-800 hover:text-red-900"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (players.length === 0) {
    return (
      <Card title="All Players" subtitle="No players found">
        <p className="text-sm text-gray-600">
          No players data available. Try scraping data first from the Scraper page.
        </p>
      </Card>
    );
  }

  return (
    <Card title="All Players" subtitle={`${players.length} player(s) in database`}>
      <Table columns={columns} rows={players} />
    </Card>
  );
};

export default UsersView;

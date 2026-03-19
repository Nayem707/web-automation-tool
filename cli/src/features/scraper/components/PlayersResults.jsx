import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';

const PlayersResults = ({ players, validationResult }) => {
  if (!players || players.length === 0) {
    return (
      <Card title="Results" subtitle="Scraping results will appear here">
        <p className="text-sm text-gray-500">No data scraped yet. Start scraping to see results.</p>
      </Card>
    );
  }

  const columns = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'team', label: 'Team' },
    { key: 'position', label: 'Position' },
  ];

  return (
    <Cards className="space-y-6">
      <Card title="Scraped Players" subtitle={`${players.length} player(s) found`}>
        <Table columns={columns} rows={players} className="h-96 overflow-y-auto" />
      </Card>

      {validationResult && (
        <Card title="Data Validation" subtitle="Integrity check results">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs text-gray-600">Valid Records</p>
                <p className="text-lg font-bold text-emerald-600">
                  {validationResult.validPlayers || 0}
                </p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-xs text-gray-600">Invalid Records</p>
                <p className="text-lg font-bold text-red-600">
                  {validationResult.invalidPlayers || 0}
                </p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs text-gray-600">Duplicates</p>
                <p className="text-lg font-bold text-amber-600">
                  {validationResult.duplicates || 0}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </Cards>
  );
};

const Cards = ({ children, ...props }) => <div {...props}>{children}</div>;

export default PlayersResults;

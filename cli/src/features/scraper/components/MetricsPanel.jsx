import Card from '../../../components/ui/Card';

const MetricsPanel = ({ metrics }) => {
  if (!metrics) return null;

  const data = metrics.data || metrics;

  return (
    <Card title="Live Metrics" subtitle="System and API performance">
      <div className="space-y-6">
        {/* System Metrics */}
        {data.system && (
          <div>
            <h4 className="mb-3 text-xs font-semibold text-gray-500 uppercase">System</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Memory</p>
                <p className="text-sm font-semibold text-gray-900">{data.system.memory || 'N/A'}</p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">CPU</p>
                <p className="text-sm font-semibold text-gray-900">{data.system.cpu || 'N/A'}</p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Disk</p>
                <p className="text-sm font-semibold text-gray-900">{data.system.disk || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* HTTP Metrics */}
        {data.httpStats && (
          <div>
            <h4 className="mb-3 text-xs font-semibold text-gray-500 uppercase">HTTP</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Requests</p>
                <p className="text-sm font-semibold text-gray-900">
                  {data.httpStats.totalRequests || 0}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Success Rate</p>
                <p className="text-sm font-semibold text-emerald-600">
                  {data.httpStats.successRate || '0%'}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Avg Response</p>
                <p className="text-sm font-semibold text-gray-900">
                  {data.httpStats.avgResponseTime || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Stats */}
        {data.errorStats && (
          <div>
            <h4 className="mb-3 text-xs font-semibold text-gray-500 uppercase">Errors</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Total Errors</p>
                <p className="text-sm font-semibold text-red-600">
                  {data.errorStats.totalErrors || 0}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Error Rate</p>
                <p className="text-sm font-semibold text-red-600">
                  {data.errorStats.errorRate || '0%'}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Retries</p>
                <p className="text-sm font-semibold text-amber-600">
                  {data.errorStats.totalRetries || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricsPanel;

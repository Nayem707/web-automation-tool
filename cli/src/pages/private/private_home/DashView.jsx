import ActivityList from '../../../features/dashboard/components/ActivityList';
import DashboardError from '../../../features/dashboard/components/DashboardError';
import DashboardLoading from '../../../features/dashboard/components/DashboardLoading';
import StatsGrid from '../../../features/dashboard/components/StatsGrid';
import UsersTable from '../../../features/dashboard/components/UsersTable';
import { useDashboardData } from '../../../features/dashboard/hooks/useDashboardData';
import Button from '../../../components/ui/Button';

const DashView = () => {
  const { stats, users, activity, status, error, refresh, lastUpdated } = useDashboardData();

  if (status === 'loading' && stats.length === 0) {
    return <DashboardLoading />;
  }

  if (status === 'failed') {
    return <DashboardError message={error} onRetry={refresh} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={refresh}>Refresh Data</Button>
      </div>
      <StatsGrid stats={stats} />

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <UsersTable rows={users} />
        <ActivityList items={activity} />
      </section>

      <p className="text-xs text-gray-500">Last updated: {lastUpdated || 'Not available'}</p>
    </div>
  );
};

export default DashView;

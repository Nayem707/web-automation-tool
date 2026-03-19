import Card from '../../../components/ui/Card';

const StatsGrid = ({ stats }) => {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <Card key={item.id}>
          <p className="text-sm text-gray-500">{item.label}</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            <span className="text-xs font-medium text-emerald-600">{item.trend}</span>
          </div>
        </Card>
      ))}
    </section>
  );
};

export default StatsGrid;

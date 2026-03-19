import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';

const ActivityList = ({ items }) => {
  return (
    <Card title="Recent Activity" subtitle="Latest user interactions">
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-500">Interaction #{item.id}</p>
            </div>
            <Badge label={item.type} tone={item.status} />
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default ActivityList;

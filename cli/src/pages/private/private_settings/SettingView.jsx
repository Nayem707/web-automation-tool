import Card from '../../../components/ui/Card';

const SettingView = () => {
  return (
    <Card title="Settings" subtitle="Application and dashboard preferences">
      <p className="text-sm text-gray-600">
        Configure notifications, profile defaults, and workspace behaviors in this module.
      </p>
    </Card>
  );
};

export default SettingView;

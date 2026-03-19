import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'company', label: 'Company' },
  { key: 'location', label: 'Location' },
];

const UsersTable = ({ rows }) => {
  return (
    <Card title="Users" subtitle="Directory of active users">
      <Table columns={columns} rows={rows} />
    </Card>
  );
};

export default UsersTable;

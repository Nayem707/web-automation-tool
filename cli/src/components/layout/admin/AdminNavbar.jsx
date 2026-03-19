import Button from '../../ui/Button';

const AdminNavbar = () => {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
        <p className="text-sm text-gray-500">Live interaction metrics and user activity</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost">Export</Button>
        <Button variant="ghost">Admin</Button>
      </div>
    </header>
  );
};

export default AdminNavbar;

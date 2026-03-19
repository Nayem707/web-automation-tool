import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Scraper', to: '/scraper' },
  { label: 'Users', to: '/users' },
  { label: 'Settings', to: '/settings' },
];

const AdminSidebar = () => {
  return (
    <aside className="flex min-h-full w-full flex-col border-r border-gray-200 bg-white p-4">
      <div className="mb-6 px-2">
        <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Admin Panel</p>
        <h1 className="mt-1 text-lg font-bold text-gray-900">Dashboard</h1>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;

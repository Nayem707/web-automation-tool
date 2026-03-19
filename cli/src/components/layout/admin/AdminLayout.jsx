import { Outlet } from 'react-router-dom';
import AdminFooter from './AdminFooter';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - fixed width, full height, scrollable if needed */}
        <div className="hidden lg:flex lg:w-64 lg:flex-shrink-0">
          <div className="w-64 overflow-y-auto bg-white shadow-lg">
            <AdminSidebar />
          </div>
        </div>

        {/* Main Content Area - takes remaining width, handles overflow */}
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          {/* Sticky Navbar */}
          <div className="sticky top-0 z-10">
            <AdminNavbar />
          </div>

          {/* Main Content */}
          <main className="flex-1 p-10">
            <Outlet />
          </main>

          {/* Footer */}
          <AdminFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

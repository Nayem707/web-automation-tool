import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import AdminLayout from '../components/layout/admin/AdminLayout';
import NotFoundView from '../pages/error/NotFoundView';
import DashView from '../pages/private/private_home/DashView';
import SettingView from '../pages/private/private_settings/SettingView';
import UsersView from '../pages/private/users/UsersView';
import ScraperView from '../pages/private/scraper/ScraperView';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<DashView />} />
        <Route path="/scraper" element={<ScraperView />} />
        <Route path="/users" element={<UsersView />} />
        <Route path="/settings" element={<SettingView />} />
        <Route path="*" element={<NotFoundView />} />
      </Route>
    </>
  )
);

export default router;

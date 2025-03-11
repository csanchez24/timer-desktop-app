import { CalendarCheck, NotebookPen, NotebookTabs, UserCog } from 'lucide-react';
import { NavLink, Outlet } from 'react-router';

export default function Layout() {
  return (
    <div className="flex h-full">
      <div className="h-full w-16 bg-gray-200">
        <div className="flex h-full flex-col items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              'flex w-full items-center justify-center p-3 ' + (!isActive ? '' : 'text-blue-500')
            }
          >
            <NotebookTabs className="m-0 h-6 w-6 p-0" />
          </NavLink>
          <NavLink
            to="/daily"
            className={({ isActive }) =>
              'flex w-full items-center justify-center p-3 ' + (!isActive ? '' : 'text-blue-500')
            }
          >
            <NotebookPen className="" />
          </NavLink>
          <NavLink
            to="/finish"
            className={({ isActive }) =>
              'flex w-full items-center justify-center p-3 ' + (!isActive ? '' : 'text-blue-500')
            }
          >
            <CalendarCheck className="" />
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              'flex w-full items-center justify-center p-3 ' + (!isActive ? '' : 'text-blue-500')
            }
          >
            <UserCog className="" />
          </NavLink>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

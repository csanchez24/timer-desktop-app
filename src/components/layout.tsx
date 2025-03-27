import { NotebookPen, NotebookTabs, UserCog } from 'lucide-react';
import { NavLink, Outlet } from 'react-router';
import { ModeToggle } from './mode-toggle';
import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useTimer } from './timer-context';

export default function Layout() {
  const { calculateTimer } = useTimer();

  useEffect(() => {
    const unlisten = listen('tauri://focus', async () => {
      await calculateTimer();
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, [calculateTimer]);

  return (
    <div className="flex h-full">
      <div className="bg-primary-foreground h-full w-16">
        <div className="flex h-full flex-col justify-between">
          <div className="h-full">
            <div className="flex h-full flex-col items-center">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  'flex w-full items-center justify-center p-3 ' +
                  (!isActive ? '' : 'text-blue-500')
                }
              >
                <NotebookTabs className="m-0 h-6 w-6 p-0" />
              </NavLink>
              <NavLink
                to="/daily"
                className={({ isActive }) =>
                  'flex w-full items-center justify-center p-3 ' +
                  (!isActive ? '' : 'text-blue-500')
                }
              >
                <NotebookPen className="" />
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  'flex w-full items-center justify-center p-3 ' +
                  (!isActive ? '' : 'text-blue-500')
                }
              >
                <UserCog className="" />
              </NavLink>
            </div>
          </div>
          <div className="mb-5">
            <ModeToggle />
          </div>
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

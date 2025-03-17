import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './style.css';
import { Toaster } from './components/ui/sonner';
import Layout from './layout';
import Tasks from './routers/tasks/tasks';
import Task from './routers/task/task';
import Daily from './routers/daily/daily';
import Finish from './routers/finish/finish';
import Settings from './routers/settings/settings';
import { TimerProvider } from './components/timer-context';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TimerProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" index element={<Tasks />} />
              <Route path="/tasks/:marca/:documento" element={<Task />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/finish" element={<Finish />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </TimerProvider>
    </QueryClientProvider>
    <Toaster />
  </React.StrictMode>
);

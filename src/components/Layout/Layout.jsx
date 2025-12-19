import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>

      <style jsx="true">{`
        .layout {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          margin-left: 280px; /* Width of sidebar */
          flex: 1;
          padding: 30px;
          background: var(--bg-primary);
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
};

export default Layout;

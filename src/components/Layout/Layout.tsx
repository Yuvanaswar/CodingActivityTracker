import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-main">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen relative z-10 w-full lg:w-[calc(100%-16rem)] max-w-full overflow-x-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 p-6 sm:p-8 animate-fade-in w-full overflow-x-hidden">
          {children}
        </main>

        {/* Footer */}
        <footer className="glass-card border-none border-t border-border mt-auto p-4 flex justify-between items-center text-sm text-textMuted">
          <div>Multi-Team Coding Tracker</div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse-slow"></span>
            Live Updates
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
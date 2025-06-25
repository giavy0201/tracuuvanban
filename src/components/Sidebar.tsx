import React from 'react';

type SidebarProps = {
  children: React.ReactNode;
};

const Sidebar = ({ children }: SidebarProps) => (
  <aside className="w-full lg:w-80 space-y-6" data-component-id="sidebar-002">
    {children}
  </aside>
);

export default Sidebar;
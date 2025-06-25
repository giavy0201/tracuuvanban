import React from 'react';

type MainContentProps = {
  children: React.ReactNode;
};

const MainContent = ({ children }: MainContentProps) => (
  <section className="flex-1" data-component-id="main-content-006">
    {children}
  </section>
);

export default MainContent;
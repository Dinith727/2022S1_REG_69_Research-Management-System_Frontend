import React, { ReactElement } from "react";
import Header from "./Header";

interface Props {
  children: ReactElement;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <div className="w-full relative min-h-screen">
        <Header />
        <div className="children">{children}</div>
      </div>
    </div>
  );
};

export default Layout;

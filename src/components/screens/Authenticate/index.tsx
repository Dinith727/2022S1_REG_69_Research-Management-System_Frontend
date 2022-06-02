import React, { useState, useEffect } from "react";

import Layout from "../../templates/layout";
import Login from "./Login";
import Signup from "./Signup";

const Index = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  return (
    // <Layout>
    <div className="w-full h-full flex flex-col justify-center items-center absolute">
      {isLogin ? (
        <Login setIsLogin={setIsLogin} />
      ) : (
        <Signup setIsLogin={setIsLogin} />
      )}
    </div>
    // </Layout>
  );
};

export default Index;

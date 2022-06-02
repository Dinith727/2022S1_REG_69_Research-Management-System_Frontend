import React, { useEffect, useState } from "react";
import useUserData from "../../../services/auth/useUserData";
import Layout from "../../templates/layout";

const Index = () => {
  const { userData } = useUserData();

  return (
    <Layout>
      <div className="w-full">
        {userData && (
          <div className="flex items-center p-60 bg-lime-200 rounded-xl">
            <div>
              <p className="text-4xl font-extrabold">Welcome</p>
              <p className="text-7xl font-extrabold">
                {userData.fname + " " + userData.lname + "!"}
              </p>
            </div>
            <div></div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;

import React, { useEffect } from "react";
import { Button } from "primereact/button";

import { USER_ADMIN, USER_STAFF, USER_STUDENT } from "../../../constants";
import useUserData from "../../../services/auth/useUserData";
import { BASE_URL, sendHttpRequest } from "../../../services/network";

const Header: React.FC = () => {
  const { userData, setUserData } = useUserData();
  const navigate = (path: string) => {
    window.location.pathname = path;
  };
  const signOut = () => {
    localStorage.clear();
    window.location.pathname = "/login";
  };

  useEffect(() => {
    sendHttpRequest(
      "POST",
      BASE_URL + "/login",
      null,
      JSON.stringify({
        email: userData.email,
        password: userData.password,
      })
    ).then((res: any) => {
      setUserData(res.data);
    });
  }, []);

  return (
    <nav className="fixed w-full h-16 px-6 text-white bg-gray-700 border-gray-300 shadow-md flex items-center justify-between z-50">
      <img
        src="/assets/logo.png"
        alt="Logo"
        className="w-12 h-12 object-contain mr-3"
      />
      <div>
        {userData.role === USER_STUDENT && (
          <button
            onClick={() => navigate("/group-registration")}
            className="cursor-pointer mx-3 outline-none"
          >
            Group Registration
          </button>
        )}
        {userData.role === USER_STUDENT && (
          <button
            data-testid={"topic-registration"}
            onClick={() => navigate("/topic-registration")}
            className="cursor-pointer mx-3 outline-none"
            disabled={!userData?.studentGroup?.id}
          >
            Topic Registration
          </button>
        )}
        {userData.role === USER_STUDENT && (
          <button
            onClick={() => navigate("/document-submission")}
            className="cursor-pointer mx-3 outline-none"
            disabled={userData?.studentGroup?.topic?.accepted !== "APPROVED"}
          >
            Document Submission
          </button>
        )}

        {userData.role === USER_STAFF && (
          <button
            onClick={() => navigate("/approveTopics")}
            className="cursor-pointer mx-3 outline-none"
          >
            Topic Approval
          </button>
        )}
        {userData.role === USER_STAFF && (
          <button
            onClick={() => navigate("/downloadDocuments")}
            className="cursor-pointer mx-3 outline-none"
          >
            Documents
          </button>
        )}
        {userData.role === USER_STAFF && (
          <button
            onClick={() => navigate("/discussions")}
            className="cursor-pointer mx-3 outline-none"
          >
            Project Forum
          </button>
        )}
        {userData.role === USER_STUDENT && (
          <button
            onClick={() => navigate("/discussion/new")}
            className="cursor-pointer mx-3 outline-none"
            disabled={userData?.studentGroup?.topic?.accepted !== "APPROVED"}
          >
            Project Forum
          </button>
        )}
        <button
          onClick={() => navigate("/notices")}
          className="cursor-pointer mx-3 outline-none"
        >
          Notices
        </button>
        {userData.role === USER_ADMIN && (
          <button
            onClick={() => navigate("/admin")}
            className="cursor-pointer mx-3 outline-none"
          >
            Manage
          </button>
        )}
        {userData.role === USER_ADMIN && (
          <button
            onClick={() => navigate("/template")}
            className="cursor-pointer mx-3 outline-none"
          >
            Template
          </button>
        )}
      </div>
      {userData && (
        <div className="flex items-center">
          <div className="flex items-end flex-col">
            <b>{userData.role}</b>
            <p>{userData.fname + " " + userData.lname}</p>
          </div>
          <div className=" ml-3 p-3 rounded-2xl">
            <Button
              onClick={signOut}
              icon="pi pi-sign-out"
              className="p-button-rounded"
              aria-label="User"
            ></Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;

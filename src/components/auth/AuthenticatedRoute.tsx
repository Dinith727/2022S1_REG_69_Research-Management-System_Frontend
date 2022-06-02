import React from "react";
import { Redirect, Route } from "react-router-dom";
import useUserData from "../../services/auth/useUserData";

const Index = ({ component: Component, roles, ...otherProps }: any) => {
  const { userData } = useUserData();

  const userRoles = roles ? roles : [];
  const userHasRequiredRole =
    userData && userRoles.includes(userData.role) ? true : false;
  const isAuthenticated = userData !== null ? true : false;
  return (
    <Route
      {...otherProps}
      render={(props) =>
        isAuthenticated ? (
          userHasRequiredRole ? (
            <Component {...props} />
          ) : (
            <Redirect to="/pageNotFound" />
          )
        ) : (
          <Redirect to="/authenticate" />
        )
      }
    />
  );
};

export default Index;

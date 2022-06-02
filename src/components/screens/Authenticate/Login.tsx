import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";

import useUserData from "../../../services/auth/useUserData";
import { BASE_URL, sendHttpRequest } from "../../../services/network";

import TextField from "../../templates/textField";
import Toast, { IToast } from "../../templates/toast/index";
interface Props {
  setIsLogin: (state: boolean) => void;
}

const Login: React.FC<Props> = ({ setIsLogin }) => {
  const toastRef: any = useRef();
  const { setUserData } = useUserData();

  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      showAuthenticationError();
      return;
    }
    setLoading(true);
    sendHttpRequest(
      "POST",
      BASE_URL + "/login",
      null,
      JSON.stringify({
        email,
        password,
      })
    )
      .then((res: any) => {
        setLoading(false);
        if (res.data && res.data["exists"] === false) {
          showAuthenticationError();
          return;
        } else {
          showToast(
            "success",
            "Welcome " + res.data.role,
            "Successful authentication"
          );
          setUserData(res.data);
          window.location.replace("/");
        }
      })
      .catch((err: any) => {
        setLoading(false);
        console.log(err);
      });
  };

  const showAuthenticationError = () => {
    showToast(
      "error",
      "Please enter a valid username and password",
      "Falied to authenticate"
    );
    setEmail("");
    setPassword("");
  };

  const showToast: IToast = (severity, message, title, life) => {
    toastRef.current.showToast({
      severity: severity,
      message: message,
      title: title,
      life: life,
    });
  };

  return (
    <div className="bg-white p-8 rounded-md flex flex-col justify-center items-center">
      <span className="font-bold text-gray-700 text-xl">Login</span>
      <div className="flex flex-col justify-center my-8">
        <TextField
          title="Email"
          type="email"
          value={email}
          containerClassNames="w-96"
          onChangeHandler={(e) => setEmail(e.target.value)}
        />
        <TextField
          title="Password"
          type="password"
          value={password}
          containerClassNames="w-96 mt-5"
          onChangeHandler={(e) => setPassword(e.target.value)}
        />
        <span className="text-sm mt-3">
          Don't have an account?{" "}
          <span
            className="font-medium cursor-pointer text-purple-800"
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </span>
        </span>
      </div>
      <Toast ref={toastRef} />
      <Button label="Login" onClick={() => handleLogin()} loading={loading} />
    </div>
  );
};

export default Login;

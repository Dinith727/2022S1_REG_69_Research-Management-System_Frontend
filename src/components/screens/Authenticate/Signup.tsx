import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";

import useUserData from "../../../services/auth/useUserData";
import { BASE_URL, sendHttpRequest } from "../../../services/network";

import TextField from "../../templates/textField";
import SelectMenu from "../../templates/selectMenu";
import Toast, { IToast } from "../../templates/toast/index";

interface Props {
  setIsLogin: (state: boolean) => void;
}

const Login: React.FC<Props> = ({ setIsLogin }) => {
  const toastRef: any = useRef();
  const { setUserData } = useUserData();

  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [fname, setFName] = useState<string>("");
  const [lname, setLName] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [batch, setBatch] = useState<string>("");
  const [faculty, setFaculty] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const staffTypes = [
    { label: "General Staff", value: "STAFF" },
    { label: "Admin", value: "ADMIN" },
  ];

  const handleSignup = () => {
    if (!fname || !lname || !email || !password || !id) {
      showToast("error", "Registration unsuccessful :(", "Ooops!");
      return;
    }
    setLoading(true);

    const studentParams = {
      fname: fname,
      lname: lname,
      id: id,
      email: email,
      year: year,
      batch: batch,
      faculty: faculty,
      password: password,
      role: "STUDENT",
    };

    const staffParams = {
      fname: fname,
      lname: lname,
      id: id,
      faculty: faculty,
      email: email,
      password: password,
      role: role,
    };

    const params = isStaff ? staffParams : studentParams;

    sendHttpRequest(
      "POST",
      BASE_URL + "/createUser",
      null,
      JSON.stringify(params)
    )
      .then((res: any) => {
        setLoading(false);
        if (typeof res.data === "string" && res.data.includes("Error")) {
          showToast("error", "Registration unsuccessful :(", "Ooops!");
          return;
        } else {
          showToast("success", "Successfully registered", "Hooray!");
          setTimeout(() => {
            setIsLogin(true);
          }, 2000);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        console.log(err);
      });
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
    <div className="p-8 rounded-md flex flex-col justify-center items-center">
      <span className="font-bold text-gray-700 text-xl">Create Account</span>
      <div className="flex justify-between mt-8 mb-5 mr-auto">
        <Button
          label="Student"
          style={{ marginRight: 10 }}
          className={isStaff ? "p-button-secondary" : "p-button-info"}
          onClick={() => setIsStaff(false)}
        />
        <Button
          label="Staff"
          className={isStaff ? "p-button-info" : "p-button-secondary"}
          onClick={() => setIsStaff(true)}
        />
      </div>
      <div className="grid grid-cols-2 gap-y-5 gap-x-10">
        <TextField
          title="First Name"
          type="text"
          value={fname}
          containerClassNames="w-96"
          onChangeHandler={(e) => setFName(e.target.value)}
        />
        <TextField
          title="Last Name"
          type="text"
          value={lname}
          containerClassNames="w-96"
          onChangeHandler={(e) => setLName(e.target.value)}
        />
        <TextField
          title="Id"
          type="text"
          value={id}
          containerClassNames="w-96"
          onChangeHandler={(e) => setId(e.target.value)}
        />
        {!isStaff && (
          <TextField
            title="Year"
            type="text"
            value={year}
            containerClassNames="w-96"
            onChangeHandler={(e) => setYear(e.target.value)}
          />
        )}
        {!isStaff && (
          <TextField
            title="Batch"
            type="text"
            value={batch}
            containerClassNames="w-96"
            onChangeHandler={(e) => setBatch(e.target.value)}
          />
        )}
        <TextField
          title="Faculty"
          type="text"
          value={faculty}
          containerClassNames="w-96"
          onChangeHandler={(e) => setFaculty(e.target.value)}
        />
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
          containerClassNames="w-96"
          onChangeHandler={(e) => setPassword(e.target.value)}
        />
        {isStaff && (
          <SelectMenu
            title="Staff Type"
            value={role}
            containerClassNames="w-96"
            onChangeHandler={(e) => setRole(e.target.value)}
            options={staffTypes}
          />
        )}
      </div>
      <span className="text-sm mt-3 mb-8 mr-auto">
        Have an account already?{" "}
        <span
          className="font-medium cursor-pointer text-purple-800"
          onClick={() => setIsLogin(true)}
        >
          Login
        </span>
      </span>
      <Button
        label="Sign Up"
        onClick={() => handleSignup()}
        loading={loading}
      />
      <Toast ref={toastRef} />
    </div>
  );
};

export default Login;

import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";

import { BASE_URL, sendHttpRequest } from "../../../services/network";

import Layout from "../../templates/layout";
import TextField from "../../templates/textField";
import FileUpload from "../../templates/fileUpload";
import useUserData from "../../../services/auth/useUserData";
import Toast, { IToast } from "../../templates/toast";

const Index: React.FC = () => {
  const history = useHistory();
  const { userData, setUserData } = useUserData();
  const toastRef: any = useRef();

  const [loading, setLoading] = useState<boolean>(false);

  const [leader, setLeader] = useState<string>("");
  const [member2, setMember2] = useState<string>("");
  const [member3, setMember3] = useState<string>("");
  const [member4, setMember4] = useState<string>("");

  useEffect(() => {
    if (userData?.studentGroup) {
      setLeader(userData?.studentGroup?.groupLeader);
      setMember2(userData?.studentGroup?.secondMember);
      setMember3(userData?.studentGroup?.thirdMember);
      setMember4(userData?.studentGroup?.fourthMember);
    } else {
      setLeader(userData?.id);
    }
  }, []);
  const handleSubmit = async () => {
    if (!leader || !member2 || !member3 || !member4) {
      showToast(
        "error",
        "Please all the required details",
        "Falied to register"
      );
      return;
    }
    setLoading(true);
    sendHttpRequest(
      "POST",
      BASE_URL + "/createGroup",
      null,
      JSON.stringify({
        groupLeader: leader,
        secondMember: member2,
        thirdMember: member3,
        fourthMember: member4,
      })
    )
      .then(async (res: any) => {
        setTimeout(async () => {
          const loginRes = await sendHttpRequest(
            "POST",
            BASE_URL + "/login",
            null,
            JSON.stringify({
              email: userData.email,
              password: userData.password,
            })
          );

          setUserData(loginRes.data);
          setLoading(false);
          // window.location.replace("/topic-registration");
        }, 3000);
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
    <Layout>
      <div className="w-full">
        <Toast ref={toastRef} />
        <div className="flex justify-between">
          <div className="text-2xl font-semibold mb-5">
            Student Group Registration
          </div>
          {userData?.studentGroup && (
            <div className="text-lg bg-green-600 rounded text-white p-2 flex items-center gap-4">
              <i className="pi pi-check" style={{ fontSize: "1em" }}></i>
              Successfully registered
            </div>
          )}
        </div>
        <div className="flex flex-col mb-8">
          <TextField
            title="Group Leader ID:"
            type="text"
            value={leader}
            disabled={true}
            onChangeHandler={(e) => setLeader(e.target.value)}
          />
          <TextField
            title="2nd Member ID:"
            type="text"
            disabled={userData?.studentGroup?.secondMember}
            value={member2}
            containerClassNames="mt-5"
            onChangeHandler={(e) => setMember2(e.target.value)}
          />
          <TextField
            title="3rd Member ID:"
            type="text"
            disabled={userData?.studentGroup?.thirdMember}
            value={member3}
            containerClassNames="mt-5"
            onChangeHandler={(e) => setMember3(e.target.value)}
          />
          <TextField
            title="4th Member ID:"
            type="text"
            disabled={userData?.studentGroup?.fourthMember}
            value={member4}
            containerClassNames="mt-5"
            onChangeHandler={(e) => setMember4(e.target.value)}
          />
        </div>

        {!userData?.studentGroup && (
          <div className="flex justify-end">
            <Button
              label="Create"
              onClick={() => handleSubmit()}
              loading={loading}
              className="p-button-info"
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;

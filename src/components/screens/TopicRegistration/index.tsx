import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";

import { BASE_URL, sendHttpRequest } from "../../../services/network";

import Layout from "../../templates/layout";
import TextField from "../../templates/textField";
import SelectMenu from "../../templates/selectMenu";
import FileUpload from "../../templates/fileUpload";
import useUserData from "../../../services/auth/useUserData";
import Toast, { IToast } from "../../templates/toast";
import moment from "moment";

const Index: React.FC = () => {
  const history = useHistory();
  const { userData, setUserData } = useUserData();

  const [loading, setLoading] = useState<boolean>(false);

  const [date, setDate] = useState<Date | Date[] | undefined>(undefined);
  const [title, setTitle] = useState<string>("");
  const [studentGroup, setStudentGroup] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");
  const [staff, setStaff] = useState(null);
  const [supervisor, setSupervisor] = useState(null);
  const [coSupervisor, setCoSupervisor] = useState(null);
  const [supervisorOptions, setSupervisorOptions] = useState([]);
  const [coSupervisorOptions, setCoSupervisorOptions] = useState([]);
  const toastRef: any = useRef();
  const [disableForm, setDisableForm] = useState(false);

  useEffect(() => {
    sendHttpRequest(
      "POST",
      BASE_URL + "/login",
      null,
      JSON.stringify({
        email: userData.email,
        password: userData.password,
      })
    ).then((loginRes: any) => {
      setUserData(loginRes.data);
    });
  }, []);

  useEffect(() => {
    fetchStaff();
    setStudentGroup(userData?.studentGroup?.id);
    if (
      userData?.studentGroup?.topic?.accepted === "APPROVED" ||
      userData?.studentGroup?.topic?.accepted === "PENDING"
    ) {
      setDisableForm(true);
      // setDate(moment(userData?.studentGroup?.topic?.date));
      setTitle(userData?.studentGroup?.topic?.title);
      setIntroduction(userData?.studentGroup?.topic?.intro);
      setSupervisor(userData?.studentGroup?.supervisor);
      setCoSupervisor(userData?.studentGroup?.coSupervisor);
    } else {
      setDisableForm(false);
    }
  }, [userData]);

  useEffect(() => {
    const coSupervisorArr = supervisorOptions?.filter(
      (val: any) => val.value !== supervisor
    );
    setCoSupervisorOptions(coSupervisorArr);
  }, [supervisor]);

  const fetchStaff = () => {
    sendHttpRequest("GET", BASE_URL + "/users").then((res: any) => {
      const staffsArr = res.data.filter((user: any) => user.role === "STAFF");
      setStaff(staffsArr);
      setSupervisorOptions(setOptions(staffsArr));
    });
  };

  const setOptions = (data: any) => {
    const arr: any = [];
    data.forEach((staff: any) => {
      arr.push({ label: staff.fname + " " + staff.lname, value: staff.id });
    });
    return arr;
  };

  const handleSubmit = () => {
    if (!date || !title || !studentGroup || !introduction) {
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
      BASE_URL + "/createTopic",
      null,
      JSON.stringify({
        date: date,
        title: title,
        studentGroupId: studentGroup,
        intro: introduction,
        supervisor: supervisor,
        coSupervisor: coSupervisor,
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
          <div className="text-2xl font-semibold mb-5">Topic Registration</div>
          {userData?.studentGroup?.topic?.accepted === "PENDING" && (
            <div className="text-lg bg-yellow-600 rounded text-white p-2 flex items-center gap-4">
              <i className="pi pi-ellipsis-h" style={{ fontSize: "1em" }}></i>
              Topic approval pending
            </div>
          )}
          {userData?.studentGroup?.topic?.accepted === "APPROVED" && (
            <div className="text-lg bg-green-600 rounded text-white p-2 flex items-center gap-4">
              <i className="pi pi-check" style={{ fontSize: "1em" }}></i>
              Topic approved
            </div>
          )}
          {userData?.studentGroup?.topic?.accepted === "REJECTED" && (
            <div className="text-lg bg-red-600 rounded text-white p-2 flex items-center gap-4">
              <i className="pi pi-times" style={{ fontSize: "1em" }}></i>
              Topic rejected
            </div>
          )}
        </div>
        <TextField
          title="Student Group"
          type="text"
          disabled={true}
          value={studentGroup}
          containerClassNames="mt-5"
          onChangeHandler={(e) => setStudentGroup(e.target.value)}
        />
        <div className="flex gap-8 mb-8">
          <div className="w-full">
            {userData?.studentGroup?.topic?.date && disableForm ? (
              <TextField
                title="Date"
                type="text"
                disabled={true}
                value={moment(userData?.studentGroup?.topic?.date).format(
                  "DD/MM/YYYY"
                )}
                containerClassNames="mt-5"
              />
            ) : (
              <div className="flex flex-col mt-5">
                <b>Date</b>
                <Calendar
                  dateFormat="dd/mm/yy"
                  value={date}
                  onChange={(e) => setDate(e.value)}
                ></Calendar>
              </div>
            )}
            <SelectMenu
              title="Supervisor"
              value={supervisor}
              disabled={disableForm}
              containerClassNames="mt-5"
              onChangeHandler={(e) => setSupervisor(e.target.value)}
              options={supervisorOptions}
            />
          </div>
          <div className="w-full">
            <TextField
              title="Title"
              type="text"
              value={title}
              disabled={disableForm}
              containerClassNames="mt-5"
              onChangeHandler={(e) => setTitle(e.target.value)}
            />

            <SelectMenu
              title="Co-Supervisor"
              value={coSupervisor}
              disabled={disableForm}
              containerClassNames="mt-5"
              onChangeHandler={(e) => setCoSupervisor(e.target.value)}
              options={coSupervisorOptions}
            />
          </div>
        </div>
        <TextField
          title="Brief introduction"
          type="text"
          value={introduction}
          disabled={disableForm}
          textArea={true}
          containerClassNames="mt-5"
          onChangeHandler={(e) => setIntroduction(e.target.value)}
        />

        {!disableForm && (
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

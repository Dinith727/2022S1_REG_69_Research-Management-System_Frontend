import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

import { BASE_URL, sendHttpRequest } from "../../../services/network";
import { USER_STAFF, USER_STUDENT } from "../../../constants";

import Layout from "../../templates/layout";
import Table from "../../templates/table";
import TextField from "../../templates/textField";

const Index = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editRowData, setEditRowData] = useState<any>();
  const [projects, setProjects] = useState<any>();
  const [panels, setPanels] = useState<any>();
  const [panelsOptions, setPanelsOptions] = useState<any>();
  const [users, setUsers] = useState<any>();
  const [userType, setUserType] = useState();
  const [tableData, setTableData] = useState();

  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [fname, setFName] = useState<any>();
  const [lname, setLName] = useState<any>();
  const [year, setYear] = useState<any>();
  const [batch, setBatch] = useState<any>();
  const [faculty, setFaculty] = useState<any>();
  const [password, setPassword] = useState<any>();

  const studentLogColumns = [
    { field: "fName", header: "First Name" },
    { field: "lName", header: "Last Name" },
    { field: "userId", header: "Student ID" },
    { field: "sEmail", header: "Student Email" },
    { field: "year", header: "Year" },
    { field: "batch", header: "Batch" },
    { field: "faculty", header: "Faculty" },
  ];

  const projectLogColumns = [
    { field: "name", header: "Project Name" },
    { field: "id", header: "Project ID" },
    { field: "sGroup", header: "Student Group" },
  ];

  const staffLogColumns = [
    { field: "fName", header: "First Name" },
    { field: "lName", header: "Last Name" },
    { field: "userId", header: "Staff ID" },
    { field: "staffEmail", header: "Staff Email" },
    { field: "faculty", header: "Faculty" },
  ];

  useEffect(() => {
    fetchPanels();
    fetchProjects();
    fetchUsers(USER_STUDENT);
  }, []);

  useEffect(() => {
    if (activeIndex !== 1) {
      const userType: any = activeIndex === 0 ? USER_STUDENT : USER_STAFF;
      fetchUsers(userType);
    } else {
      const temp: any = [];
      projects?.forEach((project: any) => {
        temp.push({
          name: project.title,
          id: project.id,
          sGroup: project.studentGroupId,
        });
      });
      setTableData(temp);
    }
  }, [activeIndex]);

  useEffect(() => {
    setFName(editRowData?.allData.fname);
    setLName(editRowData?.lName);
    setYear(editRowData?.allData.year);
    setBatch(editRowData?.allData.batch);
    setFaculty(editRowData?.allData.faculty);
    setPassword(editRowData?.allData.password);
  }, [showEditModal]);

  useEffect(() => {
    const temp: any = [];
    users?.forEach((user: any) => {
      if (userType === USER_STUDENT) {
        temp.push({
          fName: user.fname,
          lName: user.lname,
          userId: user.id,
          sEmail: user.email,
          year: user.year,
          batch: user.batch,
          faculty: user.faculty,
          allData: user,
        });
      } else {
        temp.push({
          fName: user.fname,
          lName: user.lname,
          userId: user.id,
          staffEmail: user.email,
          faculty: user.faculty,
          allData: user,
        });
      }
    });
    setTableData(temp);
  }, [users, userType]);

  const fetchUsers = (type: any) => {
    sendHttpRequest("GET", BASE_URL + "/users")
      .then((res: any) => {
        const users = res.data.filter(
          (user: any) => user.role === type && user.activated === true
        );
        setUsers(users);
        setUserType(type);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleDeleteUser = (userId: string) => {
    setDeleteLoading(true);
    sendHttpRequest(
      "POST",
      BASE_URL + "/updateUser",
      null,
      JSON.stringify({
        id: userId,
        activated: false,
      })
    )
      .then((res: any) => {
        setTimeout(() => {
          fetchUsers(userType);
          setDeleteLoading(false);
        }, 3000);
      })
      .catch((err: any) => {
        setDeleteLoading(false);
        console.log(err);
      });
  };

  const handleEditUser = (row: any) => {
    setEditRowData(row);
    setIsStaff(row.allData.role === USER_STUDENT ? false : true);
    setShowEditModal(true);
  };

  const handleUpdateUser = () => {
    setUpdateLoading(true);

    const studentParams = {
      id: editRowData?.allData.id,
      fname: fname,
      lname: lname,
      year: year,
      batch: batch,
      faculty: faculty,
      password: password,
    };

    const staffParams = {
      id: editRowData?.allData.id,
      fname: fname,
      lname: lname,
      faculty: faculty,
      password: password,
    };

    const params = isStaff ? staffParams : studentParams;

    sendHttpRequest(
      "POST",
      BASE_URL + "/updateUser",
      null,
      JSON.stringify(params)
    )
      .then((res: any) => {
        setTimeout(() => {
          setUpdateLoading(false);
          setEditRowData(null);
          fetchUsers(userType);
          setShowEditModal(false);
        }, 3000);
      })
      .catch((err: any) => {
        setUpdateLoading(false);
        setShowEditModal(false);
        console.log(err);
      });
  };

  const fetchProjects = () => {
    sendHttpRequest("GET", BASE_URL + "/topics")
      .then((res: any) => {
        const projects = res.data.filter(
          (project: any) => project.accepted === true
        );
        setProjects(projects);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const fetchPanels = () => {
    sendHttpRequest("GET", BASE_URL + "/panels")
      .then((res: any) => {
        const temp: any = [];
        res.data.forEach((item: any) => {
          temp.push({ label: item.name, value: item.id });
        });
        setPanels(res.data);
        setPanelsOptions(temp);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const assignPanel = (panelId: string, staffId: string) => {
    sendHttpRequest(
      "POST",
      BASE_URL + "/updatePanel",
      null,
      JSON.stringify({
        id: panelId,
        staffId: staffId,
      })
    )
      .then((res: any) => {
        setTimeout(() => {
          fetchPanels();
        }, 2000);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const userTableActions = (row: any) => {
    return (
      <div className="flex gap-2">
        {userType === USER_STAFF && (
          <Dropdown
            options={panelsOptions}
            onChange={(e) => {
              assignPanel(e.target.value, row.allData.id);
            }}
            placeholder="Select Panel"
            className="w-full h-full"
          />
        )}
        <Button
          type="button"
          label="Edit"
          className="p-button-warning"
          onClick={() => handleEditUser(row)}
        />
        <Button
          type="button"
          label="Delete"
          className="p-button-danger"
          disabled={deleteLoading}
          loading={deleteLoading}
          onClick={() => handleDeleteUser(row.userId)}
        />
      </div>
    );
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="text-2xl font-semibold mb-5">Admin</div>
        <div className="shadow-md bg-white rounded-lg border">
          <TabView
            className="shadow-md bg-white rounded-lg m-10 border"
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            <TabPanel header="Students">
              <Table
                header="Students"
                columns={studentLogColumns}
                data={tableData}
                actions={userTableActions}
              />
            </TabPanel>
            <TabPanel header="Staff">
              <Table
                header="Staffs"
                columns={staffLogColumns}
                data={tableData}
                actions={userTableActions}
              />
            </TabPanel>
          </TabView>
        </div>
        <Dialog
          header="Edit User"
          visible={showEditModal}
          style={{ width: "65%" }}
          onHide={() => setShowEditModal(false)}
        >
          <div className="p-8 rounded-md flex flex-col justify-center items-center">
            <div className="grid grid-cols-2 gap-y-5 gap-x-10 mb-10">
              <TextField
                title="First Name"
                type="text"
                value={fname}
                containerClassNames="w-72"
                onChangeHandler={(e) => setFName(e.target.value)}
              />
              <TextField
                title="Last Name"
                type="text"
                value={lname}
                containerClassNames="w-72"
                onChangeHandler={(e) => setLName(e.target.value)}
              />
              {!isStaff && (
                <TextField
                  title="Year"
                  type="text"
                  value={year}
                  containerClassNames="w-72"
                  onChangeHandler={(e) => setYear(e.target.value)}
                />
              )}
              {!isStaff && (
                <TextField
                  title="Batch"
                  type="text"
                  value={batch}
                  containerClassNames="w-72"
                  onChangeHandler={(e) => setBatch(e.target.value)}
                />
              )}
              <TextField
                title="Faculty"
                type="text"
                value={faculty}
                containerClassNames="w-72"
                onChangeHandler={(e) => setFaculty(e.target.value)}
              />
              <TextField
                title="Password"
                type="password"
                value={password}
                containerClassNames="w-72"
                onChangeHandler={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              label="Update"
              onClick={() => handleUpdateUser()}
              loading={updateLoading}
            />
          </div>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Index;

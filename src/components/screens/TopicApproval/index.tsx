import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button } from "primereact/button";

import { BASE_URL, sendHttpRequest } from "../../../services/network";
import useUserData from "../../../services/auth/useUserData";

import Layout from "../../templates/layout";
import Table from "../../templates/table";

const columns = [
  { field: "date", header: "Date" },
  { field: "title", header: "Title" },
  { field: "studGroup", header: "Student Group" },
  { field: "status", header: "Status" },
];

const Index: React.FC = () => {
  const { userData, setUserData } = useUserData();

  const [loading, setLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState();

  useEffect(() => {
    const temp: any = [];
    userData?.staffGroups.forEach((group: any) => {
      temp.push({
        topicId: group.topic.id,
        date: moment(group.topic.date).format("MMM DD YYYY"),
        title: group.topic.title,
        studGroup: group.id,
        status:
          group.topic.accepted === "APPROVED"
            ? "APPROVED"
            : group.topic.accepted === "PENDING"
            ? "PENDING"
            : "REJECTED",
      });
    });
    setTableData(temp);
  }, [userData]);

  const refresh = () => {
    setLoading(true);
    sendHttpRequest(
      "POST",
      BASE_URL + "/login",
      null,
      JSON.stringify({
        email: userData.email,
        password: userData.password,
      })
    )
      .then((res: any) => {
        setLoading(false);
        setUserData(res.data);
      })
      .catch((err: any) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleApprove = (topicId: string, status: string) => {
    setApproveLoading(true);
    sendHttpRequest(
      "POST",
      BASE_URL + "/approveTopic",
      null,
      JSON.stringify({
        topicId: topicId,
        accepted: status,
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
          setApproveLoading(false);
        }, 3000);
      })
      .catch((err: any) => {
        setApproveLoading(false);
        console.log(err);
      });
  };

  const tableActions = (row: any) => {
    return (
      <div className="flex gap-2">
        <Button
          type="button"
          label="Approve"
          onClick={() => handleApprove(row.topicId, "APPROVED")}
          loading={approveLoading}
          disabled={approveLoading}
        />
        <Button
          type="button"
          label="Reject"
          className="p-button-danger"
          onClick={() => handleApprove(row.topicId, "REJECTED")}
          loading={approveLoading}
          disabled={approveLoading}
        />
      </div>
    );
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-5">
          <div className="text-2xl font-semibold mb-5">Topics Approval</div>
          <Button
            type="button"
            label="Refresh"
            loading={loading}
            onClick={() => refresh()}
          />
        </div>
        <div className="shadow-md bg-white rounded-lg border">
          <Table
            header=""
            columns={columns}
            data={tableData}
            actions={tableActions}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;

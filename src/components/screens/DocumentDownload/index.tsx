import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button } from "primereact/button";

import {
  BASE_URL,
  PINATA_URL,
  sendHttpRequest,
} from "../../../services/network";
import useUserData from "../../../services/auth/useUserData";

import Layout from "../../templates/layout";
import Table from "../../templates/table";

const columns = [
  { field: "date", header: "Date" },
  { field: "title", header: "Title" },
  { field: "studGroup", header: "Student Group" },
];

const Index: React.FC = () => {
  const { userData, setUserData } = useUserData();

  const [loading, setLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState();

  useEffect(() => {
    const temp: any = [];
    userData?.staffGroups.forEach((group: any) => {
      if (!group?.submission?.fileHash) {
        return;
      }
      temp.push({
        date: moment(group.topic.date).format("MMM DD YYYY"),
        title: group.topic.title,
        studGroup: group.id,
        fileHash: group?.submission?.fileHash,
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

  const tableActions = (row: any) => {
    return (
      <Button
        type="button"
        label="Download"
        onClick={(e) => {
          e.preventDefault();
          window.open(`${PINATA_URL}${row?.fileHash}`);
        }}
      />
    );
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-5">
          <div className="text-2xl font-semibold mb-5">Document Download</div>
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

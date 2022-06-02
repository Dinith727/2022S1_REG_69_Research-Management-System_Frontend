import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import moment from "moment";

import { BASE_URL, sendHttpRequest } from "../../../services/network";
import useUserData from "../../../services/auth/useUserData";

import Layout from "../../templates/layout";
import Table from "../../templates/table";
import { useParams, useHistory } from "react-router-dom";

const columns = [{ field: "groupId", header: "Group Id" }];
const data = [
  {
    groupId: "ABC",
  },
  {
    groupId: "123",
  },
];

const Index: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { userData, setUserData } = useUserData();
  const [groups, setGroups] = useState([]);
  const [tableData, setTableData] = useState();
  const history = useHistory();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const temp: any = [];
    groups.forEach((group: any) => {
      temp.push({
        groupId: group.id,
      });
    });
    setTableData(temp);
  }, [groups]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await sendHttpRequest(
        "POST",
        BASE_URL + "/userById",
        null,
        JSON.stringify({
          id: userData?.id,
        })
      );
      if (res) {
        setGroups(res?.data?.staffGroups);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const tableActions = (row: any) => {
    return (
      <div className="flex gap-2">
        <Button
          type="button"
          label="View"
          onClick={() => history.push("/discussion/" + row.groupId)}
        />
      </div>
    );
  };

  return (
    <Layout>
      <div className="w-full">
        <div className="text-2xl font-semibold mb-5">Project Forum</div>
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

import React from "react";
import { Table, Tag, Space, Button } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => text,
  },
  {
    title: "Organization Unit",
    dataIndex: "address",
    key: "address",
    render: (text) => text,
  },
  {
    title: "Status",
    key: "tag",
    dataIndex: "tag",
    render: (tag) => {
      let color = tag === "Grant" ? "green" : "orange";
      return <Tag color={color}>{tag}</Tag>;
    },
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => <Button color="danger">remove</Button>,
  },
];

const data = [
  {
    key: "1",
    name: "System Administration",
    address: "FVH",
    tag: "Grant",
  },
  {
    key: "2",
    name: "User test",
    address: "FVH",
    tag: "Grant",
  },
];

const GroupTable = () => {
  return <Table columns={columns} dataSource={data} />;
};

export default GroupTable;

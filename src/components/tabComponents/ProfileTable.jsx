import React from "react";
import { Table, Tag } from "antd";

const columns = [
  {
    title: "Profile’s Name",
    dataIndex: "name",
    key: "name",
    render: (text) => text,
  },
  {
    title: "Accessible",
    dataIndex: "accessible",
    key: "accessible",
    render: (accessible) => (
      <Tag color={accessible ? "green" : "orange"}>
        {accessible ? "True" : "False"}
      </Tag>
    ),
  },
];

const data = [
  { key: "1", name: "Human Resources", accessible: true },
  { key: "2", name: "Inventory", accessible: true },
  { key: "3", name: "Laboratory", accessible: true },
  { key: "4", name: "Clinic", accessible: true },
  { key: "5", name: "Pharmacy", accessible: true },
  { key: "6", name: "Training", accessible: false },
  { key: "7", name: "Pharmacy", accessible: true },
  { key: "8", name: "Training", accessible: false },
  { key: "9", name: "Pharmacy", accessible: true },
  { key: "10", name: "Training", accessible: false },
  { key: "11", name: "Pharmacy", accessible: true },
];

const ProfileTable = () => {
  return <Table columns={columns} dataSource={data} />;
};

export default ProfileTable;

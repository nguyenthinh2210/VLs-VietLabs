import React from "react";
import { Table, Input, Space } from "antd";

const { Search } = Input;
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Employee No",
    dataIndex: "employeeNo",
    key: "employeeNo",
  },
  {
    title: "Department Name",
    dataIndex: "departmentName",
    key: "departmentName",
  },
  {
    title: "Job Title",
    dataIndex: "jobTitle",
    key: "jobTitle",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a href="usersandgroups/user/1">Details</a>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    username: "john.brown",
    employeeNo: "E001",
    departmentName: "IT Department",
    jobTitle: "Software Engineer",
    jobType: "Full-time",
  },
  {
    key: "2",
    name: "Jim Green",
    username: "jim.green",
    employeeNo: "E002",
    departmentName: "Finance",
    jobTitle: "Financial Analyst",
    jobType: "Part-time",
  },
  {
    key: "3",
    name: "Joe Black",
    username: "joe.black",
    employeeNo: "E003",
    departmentName: "HR",
    jobTitle: "HR Manager",
    jobType: "Full-time",
  },
  {
    key: "4",
    name: "Alice White",
    username: "alice.white",
    employeeNo: "E004",
    departmentName: "Marketing",
    jobTitle: "Marketing Specialist",
    jobType: "Contract",
  },
  {
    key: "5",
    name: "Bob Martin",
    username: "bob.martin",
    employeeNo: "E005",
    departmentName: "Operations",
    jobTitle: "Operations Manager",
    jobType: "Full-time",
  },
  {
    key: "6",
    name: "Charlie Kim",
    username: "charlie.kim",
    employeeNo: "E006",
    departmentName: "IT Department",
    jobTitle: "System Administrator",
    jobType: "Full-time",
  },
  {
    key: "7",
    name: "David Lee",
    username: "david.lee",
    employeeNo: "E007",
    departmentName: "Sales",
    jobTitle: "Sales Manager",
    jobType: "Part-time",
  },
  {
    key: "8",
    name: "Emily Davis",
    username: "emily.davis",
    employeeNo: "E008",
    departmentName: "Customer Support",
    jobTitle: "Support Specialist",
    jobType: "Contract",
  },
  {
    key: "9",
    name: "Frank Carter",
    username: "frank.carter",
    employeeNo: "E009",
    departmentName: "Legal",
    jobTitle: "Legal Advisor",
    jobType: "Full-time",
  },
  {
    key: "10",
    name: "Grace Kelly",
    username: "grace.kelly",
    employeeNo: "E010",
    departmentName: "Administration",
    jobTitle: "Office Manager",
    jobType: "Full-time",
  },
];
const UsersPermissionDetails = () => {
  return (
    <>
      <Search
        placeholder="Search"
        allowClear
        className="mb-4"
        style={{ width: 300 }}
      />
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default UsersPermissionDetails;

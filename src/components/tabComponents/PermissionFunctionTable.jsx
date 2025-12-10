import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Table, Tag, Space, Modal, Button, Typography } from "antd";
import GroupTable from "./GroupTable";
const { Title } = Typography;
const PermissionFunctionTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Function Name",
      dataIndex: "name",
      key: "name",
      render: (text) => text,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text,
    },
    {
      title: "Visible",
      key: "visible",
      dataIndex: "visible",
      render: (visible) => (
        <Tag color={visible ? "green" : "volcano"}>
          {visible ? "True" : "False"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={showModal}>Users & Groups</a>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      name: "Delete Employee Groups",
      description: "Human Resources.Maintenance.Employee Groups",
      visible: true,
    },
    {
      key: "2",
      name: "Edit Employee Groups",
      description: "Human Resources.Maintenance.Employee Groups",
      visible: false,
    },
    {
      key: "3",
      name: "Delete Employee Groups",
      description: "Human Resources.Maintenance.Employee Groups",
      visible: true,
    },
    {
      key: "4",
      name: "Edit Employee Groups",
      description: "Human Resources.Maintenance.Employee Groups",
      visible: true,
    },
    {
      key: "5",
      name: "Delete Employee Groups",
      description: "Human Resources.Maintenance.Employee Groups",
      visible: false,
    },
  ];
  return (
    <>
      <Modal
        title="Related Users Or Groups"
        width={1200}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, {}) => <></>}
      >
        <Button
          className="mb-4"
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
        >
          Add
        </Button>
        <GroupTable></GroupTable>
      </Modal>

      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default PermissionFunctionTable;

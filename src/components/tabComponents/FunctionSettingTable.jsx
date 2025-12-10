import React, { useState } from "react";
import { Table, Tag, Space, Modal } from "antd";
import PermissionSettingForm from "./PermissionSettingForm";
import PropTypes from "prop-types";

const propTypes = {
  selectedFunctions: PropTypes.array,
  onUpdateFunction: PropTypes.func,
  selectedInfoTree: PropTypes.object,
};

const FunctionPropertiesTable = ({ selectedFunctions, onUpdateFunction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectFunction, setSelectFunction] = useState(null);
  const showModal = (record) => {
    setIsModalOpen(true);
    setSelectFunction(record);
  };

  const columns = [
    {
      title: "Path",
      key: "Path",
      render: (record) => {
        const path = (record.fullPath || "").split("/");
        if (path.length > 1) path.pop();
        return path.join("/") || "N/A";
      },
    },
    {
      title: "Function Name",
      dataIndex: "titleEdit",
      key: "titleEdit",
      render: (text, record) => text || record.title,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text,
    },
    {
      title: "Visible",
      key: "mappingActiveStatus",
      dataIndex: "mappingActiveStatus",
      render: (status) => (
        <Tag color={status ? "green" : "volcano"}>
          {status ? "True" : "False"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModal(record)}>Edit</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        className="custom-modal"
        title="Edit Function"
        open={isModalOpen}
        footer={[]}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <PermissionSettingForm
          selectFunction={selectFunction}
          onSubmit={(updatedData) => {
            onUpdateFunction?.(updatedData);
            setIsModalOpen(false);
          }}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        ></PermissionSettingForm>
      </Modal>
      <Table
        columns={columns}
        dataSource={selectedFunctions}
        onRow={(record) => ({
          onClick: () => showModal(record),
          style: { cursor: "pointer" },
        })}
      />
    </>
  );
};

FunctionPropertiesTable.propTypes = propTypes;
export default FunctionPropertiesTable;

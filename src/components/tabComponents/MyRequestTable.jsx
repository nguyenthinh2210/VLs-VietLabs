import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Input, Modal } from "antd";
import MyRequestDetails from "../tabComponents/MyRequestDetails";
import PropTypes from "prop-types";
import dayjs from "../../common/dayjs";
import nProgress from "nprogress";
import lists from "../../common/lists";
import { getItemsService } from "../../common/services";
import { handleError } from "../../common/helpers";

const propTypes = {
  dataPermissionRequests: PropTypes.array,
  onRefresh: PropTypes.func,
};

const MyRequestTable = ({ dataPermissionRequests, onRefresh }) => {
  const { Search } = Input;
  //State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dataPermissionRequestHistories, setDataPermissionRequestHistories] =
    useState([]);
  const [searchText, setSearchText] = useState("");

  //Function
  const showModal = async (record) => {
    setIsModalOpen(true);
    setSelectedRequest(record);
    //console.log("123", record);
  };

  const columns = [
    // {
    //   title: "permissionRequestId",
    //   dataIndex: "PermissionRequestId",
    //   key: "PermissionRequestId",
    // },
    {
      title: "ID",
      dataIndex: "Id",
      key: "Id",
    },
    {
      title: "Description",
      dataIndex: "PermissionRequestDescription",
      key: "PermissionRequestDescription",
    },
    {
      title: "Created",
      dataIndex: "Created",
      key: "Created",
      render: (value) => dayjs(value).format("YYYY-MM-DD"),
    },
    {
      title: "Status",
      key: "Status",
      render: (_, { Status }) => {
        let color = "gold";

        if (Status === "IT Process") {
          color = "processing";
        } else if (Status === "Done") {
          color = "green";
        } else if (Status === "Rejected") {
          color = "volcano";
        }

        return <Tag color={color}>{Status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModal(record)}>Details</a>
        </Space>
      ),
    },
  ];

  //Get API
  const handleGetPermissionRequests = async () => {
    if (!selectedRequest?.PermissionRequestId) return;
    nProgress.start();
    try {
      const permissionRequestHistories = await getItemsService(
        lists.PermissionRequestHistories,
        {
          filter: `PermissionRequestId eq ${selectedRequest?.PermissionRequestId}`,
          orderBy: "Id desc",
        }
      );

      console.log("first", permissionRequestHistories.value);
      setDataPermissionRequestHistories(permissionRequestHistories.value || []);
    } catch (error) {
      handleError(error);
    } finally {
      nProgress.done();
    }
  };
  //componentDidMount effect
  useEffect(() => {
    handleGetPermissionRequests();
  }, [selectedRequest]);

  return (
    <>
      <Modal
        className="custom-modal"
        title="Permission Request Details"
        width={1200}
        open={isModalOpen}
        footer={[]}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <MyRequestDetails
          selectedRequest={selectedRequest}
          dataPermissionRequestHistories={dataPermissionRequestHistories}
          onSubmit={() => {
            onRefresh();
            setIsModalOpen(false);
          }}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        ></MyRequestDetails>
      </Modal>
      <div className="mb-4 w-96">
        <Search
          placeholder="Search function"
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={dataPermissionRequests}
        rowKey="Id"
        pagination={false}
      />
    </>
  );
};

MyRequestTable.propTypes = propTypes;
export default MyRequestTable;

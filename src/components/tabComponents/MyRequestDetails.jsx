import React, { useEffect, useState } from "react";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  Input,
  Upload,
  Row,
  Tag,
  Divider,
  Button,
  Table,
} from "antd";
import HistoryApproval from "./HistoryApproval";
import PropTypes from "prop-types";
import AsyncButton from "../../common/components/AsyncButton";
import { handleError } from "../../common/helpers";
import lists from "../../common/lists";
import {
  addListItemService,
  getItemsService,
  updateListItemService,
} from "../../common/services";
import { useUI } from "../../common/UIProvider";
import DocumentStore from "../../common/components/DocumentStore/DocumentStore";
import nProgress from "nprogress";
import { useSelector } from "react-redux";
import { MODULE_AUTH } from "../../store/auth";
const { Dragger } = Upload;
const { TextArea } = Input;

const propTypes = {
  selectedRequest: PropTypes.object,
  historiesRecord: PropTypes.array,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  dataPermissionRequestHistories: PropTypes.array,
};

const MyRequestDetails = ({
  selectedRequest,
  onSubmit,
  onCancel,
  dataPermissionRequestHistories,
}) => {
  const [form] = Form.useForm();
  const ui = useUI();
  const { currentUser } = useSelector((state) => state[MODULE_AUTH]);

  useEffect(() => {
    if (selectedRequest) {
      const initialComment =
        selectedRequest?.Status === "Done"
          ? dataPermissionRequestHistories[0]?.Comment || ""
          : "";

      form.setFieldsValue({
        Id: selectedRequest?.Id,
        PermissionRequestId: selectedRequest?.PermissionRequestId,
        Requester: selectedRequest?.Requester || "N/A",
        Description: selectedRequest?.Description || "",
        CommentApproval: initialComment,
      });
    }
  }, [selectedRequest, form, dataPermissionRequestHistories]);

  //State
  const [dataPermissionRequestsDetail, setDataPermissionRequestsDetail] =
    useState([]);

  //Get API
  const handleGetData = async () => {
    nProgress.start();
    try {
      const permissionRequestsDetail = await getItemsService(
        lists.PermissionRequestsDetail,
        {
          filter: `PermissionRequestId eq ${selectedRequest?.PermissionRequestId}`,
        }
      );

      setDataPermissionRequestsDetail(permissionRequestsDetail.value);
    } catch (error) {
      handleError(error);
    } finally {
      nProgress.done();
    }
  };

  useEffect(() => {
    handleGetData();
  }, [selectedRequest]);

  //Function

  const handleUpdate = async () => {
    try {
      await form.validateFields();
    } catch (error) {
      return;
    }

    const values = form.getFieldsValue();
    const comment =
      selectedRequest?.Status === "Done" ? values.CommentApproval : "";

    try {
      await updateListItemService(
        lists.PermissionRequests,
        selectedRequest?.PermissionRequestId,
        {
          Requester: currentUser?.Employee_name,
          RequestFor: Array.isArray(values.RequestFor)
            ? values.RequestFor.join(", ")
            : values.RequestFor || "",
          FunctionRequest: Array.isArray(values.FunctionRequest)
            ? values.FunctionRequest.join(", ")
            : values.FunctionRequest || "",
          Status:
            selectedRequest?.Status === "Rejected"
              ? "IT Process"
              : "Waiting for Manager",
          Approver: "Nguyen Van C",
          Description: values.Description,
        }
      );

      await addListItemService(lists.PermissionRequestHistories, {
        PermissionRequestId: selectedRequest?.PermissionRequestId,
        Created: new Date().toISOString(),
        Modified: new Date().toISOString(),
        UserId: currentUser?.User_id,
        UserDisplayName: currentUser?.Employee_name,
        Comment: comment,
        Status: "Waiting for Manager",
      });

      ui.notiSuccess("Success");
      return onSubmit();
    } catch (error) {
      ui.notiError("Failure");
      handleError(error);
    }
  };

  return (
    <>
      <div className="pt-2">
        <Form form={form} labelCol={{ span: 6 }} layout="horizontal">
          <Row>
            <Col span={12}>
              <Form.Item label="Requester">
                <span>{selectedRequest?.Requester || "N/A"}</span>
              </Form.Item>

              <Form.Item
                label="Description"
                name="Description"
                rules={[
                  {
                    required: true,
                    message: "Please enter description",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  disabled={
                    selectedRequest?.Status === "Done" ||
                    selectedRequest?.Status === "IT Process"
                  }
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Status">
                <Tag
                  color={
                    selectedRequest?.Status === "IT Process"
                      ? "processing"
                      : selectedRequest?.Status === "Done"
                      ? "green"
                      : selectedRequest?.Status === "Rejected"
                      ? "volcano"
                      : "gold"
                  }
                >
                  {selectedRequest?.Status || "Not Status"}
                </Tag>
              </Form.Item>
              <Form.Item label="Attachments">
                <DocumentStore
                  key={selectedRequest?.PermissionRequestId}
                  permissionRequestId={selectedRequest?.PermissionRequestId}
                  mode={
                    ["IT Process", "Done"].includes(selectedRequest?.Status) &&
                    (currentUser?.Role?.includes("Manager") ||
                      currentUser?.Role?.includes("IT Admin"))
                      ? "View"
                      : "Edit"
                  }
                  userId={currentUser?.User_id}
                  userDisplayName={currentUser?.Employee_name}
                />
              </Form.Item>
            </Col>

            {dataPermissionRequestsDetail &&
              dataPermissionRequestsDetail.length > 0 && (
                <Col span={24}>
                  <Table
                    columns={[
                      {
                        title: "Path",
                        dataIndex: "Path",
                        key: "path",
                      },
                      {
                        title: "Function Name",
                        dataIndex: "FunctionRequest",
                        key: "functionRequest",
                      },
                      {
                        title: "Description",
                        dataIndex: "Description",
                        key: "description",
                      },
                      {
                        title: "Request For",
                        dataIndex: "RequestFor",
                        key: "requestFor",
                      },
                      {
                        title: "Current Status",
                        dataIndex: "Status",
                        key: "status",
                        render: (status) => (
                          <Tag color={status === "GRANT" ? "green" : "volcano"}>
                            {status}
                          </Tag>
                        ),
                      },
                      {
                        title: "New Status",
                        dataIndex: "Status",
                        key: "changeStatus",
                        render: (status) => {
                          const reversedStatus =
                            status === "GRANT" ? "NOT GRANT" : "GRANT";
                          return (
                            <Tag
                              color={
                                reversedStatus === "GRANT" ? "green" : "volcano"
                              }
                            >
                              {reversedStatus}
                            </Tag>
                          );
                        },
                      },
                    ]}
                    dataSource={dataPermissionRequestsDetail}
                    rowKey="Id"
                    pagination={false}
                  />
                </Col>
              )}
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={12}>
              <HistoryApproval
                dataPermissionRequestHistories={dataPermissionRequestHistories}
              ></HistoryApproval>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Comment Edited"
                name="CommentApproval"
                rules={[
                  {
                    required: true,
                    message: "Please input your comment",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  disabled={
                    selectedRequest?.Status === "Done" ||
                    selectedRequest?.Status === "IT Process"
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
          <div className="flex justify-end mt-4">
            <Button icon={<CloseOutlined />} onClick={onCancel}>
              Cancel
            </Button>

            {(selectedRequest?.Status === "Waiting for Manager" ||
              selectedRequest?.Status === "Rejected") &&
              (currentUser?.Role?.includes("Manager") ||
                currentUser?.Role?.includes("IT Admin")) && (
                <AsyncButton
                  icon={<SaveOutlined />}
                  className="ms-2"
                  type="primary"
                  onClick={handleUpdate}
                >
                  Save
                </AsyncButton>
              )}
          </div>
        </Form>
      </div>
    </>
  );
};

MyRequestDetails.propTypes = propTypes;
export default MyRequestDetails;

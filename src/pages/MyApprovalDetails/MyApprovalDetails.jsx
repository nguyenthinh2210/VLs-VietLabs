import React, { useEffect, useState } from "react";
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Form, Input, Row, Tag, Divider, Table, Space, Tooltip, Button, Card } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import HistoryApproval from "../../components/tabComponents/HistoryApproval";
import AsyncButton from "../../common/components/AsyncButton";
import {
  addListItemService,
  getItemsService,
  updateListItemService,
} from "../../common/services";
import lists from "../../common/lists";
import { handleError } from "../../common/helpers";
import { useUI } from "../../common/UIProvider";
import DocumentStore from "../../common/components/DocumentStore/DocumentStore";
import nProgress from "nprogress";
import { useSelector } from "react-redux";
import { MODULE_AUTH } from "../../store/auth";
import { STATUS_CONFIRMATION } from "../../common/constant";
const { TextArea } = Input;

const MyApprovalDetails = () => {
  const [form] = Form.useForm();
  const ui = useUI();
  const { currentUser } = useSelector((state) => state[MODULE_AUTH]);
  const { id } = useParams();
  const navigate = useNavigate();

  //State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [commentApproval, setCommentApproval] = useState("");
  const [dataPermissionRequestsDetail, setDataPermissionRequestsDetail] = useState([]);
  const [dataPermissionRequestHistories, setDataPermissionRequestHistories] = useState([]);

  //Get API
  const handleGetRequestData = async () => {
    if (!id) return;

    nProgress.start();
    try {
      const request = await getItemsService(lists.PermissionRequests, {
        filter: `Id eq ${id}`,
      });

      if (request.value && request.value.length > 0) {
        const requestData = request.value[0];
        setSelectedRequest(requestData);

        // Set form values
        form.setFieldsValue({
          Id: requestData?.Id,
          Requester: requestData?.Requester || "N/A",
          PermissionRequestDescription: requestData?.PermissionRequestDescription || "",
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      nProgress.done();
    }
  };

  const handleGetData = async () => {
    if (!selectedRequest?.PermissionRequestId) return;

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

  const handleGetHistories = async () => {
    if (!selectedRequest?.PermissionRequestId) return;

    try {
      const histories = await getItemsService(lists.PermissionRequestHistories, {
        filter: `PermissionRequestId eq ${selectedRequest?.PermissionRequestId}`,
        orderby: "Created desc",
      });

      setDataPermissionRequestHistories(histories.value);

      // Comment sẽ được xử lý trong useEffect riêng
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    handleGetRequestData();
  }, [id]);

  useEffect(() => {
    if (selectedRequest?.PermissionRequestId) {
      handleGetData();
      handleGetHistories();
    }
  }, [selectedRequest?.PermissionRequestId]);
  
  // useEffect riêng để xử lý comment khi histories thay đổi
  useEffect(() => {
    if (dataPermissionRequestHistories && dataPermissionRequestHistories.length > 0) {
      // Tìm comment có giá trị thực sự (không phải null hoặc empty)
      let initialComment = "";
      
      // Tìm comment đầu tiên có giá trị
      for (let i = 0; i < dataPermissionRequestHistories.length; i++) {
        const history = dataPermissionRequestHistories[i];
        if (history?.Comment && history.Comment.trim() !== "") {
          initialComment = history.Comment;
          break;
        }
      }
      setCommentApproval(initialComment);
      
      if (form) {
        form.setFieldsValue({
          CommentApproval: initialComment,
        });
      }
    }
  }, [dataPermissionRequestHistories, form, selectedRequest?.PermissionRequestDescription]);

  //Function
  const handleRejected = async () => {
    try {
      await form.validateFields();
    } catch (error) {
      return;
    }

    const values = form.getFieldsValue();
    const statusCompleteID = STATUS_CONFIRMATION.find(
      (item) => item.display_name === "Complete"
    )?.key;

    try {
      await updateListItemService(
        lists.PermissionRequests,
        selectedRequest?.PermissionRequestId,
        {
          Status: "Rejected",
          Approver: "Nguyen Van C",
          PermissionRequestDescription: values.PermissionRequestDescription,
        }
      );

      // Lấy tất cả confirmations cho PermissionRequestId này
      const allConfirmations = await getItemsService(lists.Confirmations, {
        filter: `PermissionRequestId eq ${selectedRequest?.PermissionRequestId}`,
      });

      // Cập nhật status của tất cả confirmations
      if (allConfirmations?.value && allConfirmations.value.length > 0) {
        const updatePromises = allConfirmations.value.map((confirmation) =>
          updateListItemService(
            lists.Confirmations,
            confirmation.ConfirmationID,
            {
              Status: statusCompleteID,
            }
          )
        );
        await Promise.all(updatePromises);
      }

      await addListItemService(lists.PermissionRequestHistories, {
        PermissionRequestId: selectedRequest?.PermissionRequestId,
        UserId: currentUser?.User_id,
        UserDisplayName: currentUser?.Employee_name,
        Comment: commentApproval,
        Status: "Rejected",
        Created: new Date().toISOString(),
        Modified: new Date().toISOString(),
      });

      ui.notiSuccess("Success");
      navigate("/myrequest-approve");
    } catch (error) {
      ui.notiError("Failure");
      handleError(error);
    }
  };

  const handleApproved = async () => {

    const values = form.getFieldsValue();
    const statusCompleteID = STATUS_CONFIRMATION.find(
      (item) => item.display_name === "Complete"
    )?.key;

    try {
      await updateListItemService(
        lists.PermissionRequests,
        selectedRequest?.PermissionRequestId,
        {
          Status: "Complete",
          Approver: "Nguyen Van C",
          PermissionRequestDescription: values.PermissionRequestDescription,
        }
      );

      // Lấy tất cả confirmations cho PermissionRequestId này
      const allConfirmations = await getItemsService(lists.Confirmations, {
        filter: `PermissionRequestId eq ${selectedRequest?.PermissionRequestId}`,
      });

      // Cập nhật status của tất cả confirmations
      if (allConfirmations?.value && allConfirmations.value.length > 0) {
        const updatePromises = allConfirmations.value.map((confirmation) =>
          updateListItemService(
            lists.Confirmations,
            confirmation.ConfirmationID,
            {
              Status: statusCompleteID,
            }
          )
        );
        await Promise.all(updatePromises);
      }

      await addListItemService(lists.PermissionRequestHistories, {
        PermissionRequestId: selectedRequest?.PermissionRequestId,
        UserId: currentUser?.User_id,
        UserDisplayName: currentUser?.Employee_name,
        Comment: commentApproval,
        Status: "Complete",
        Created: new Date().toISOString(),
        Modified: new Date().toISOString(),
      });

      ui.notiSuccess("Success");
      navigate("/myrequest-approve");
    } catch (error) {
      ui.notiError("Failure");
      handleError(error);
    }
  };

  if (!selectedRequest) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mb-4">
        <Tooltip title="Back to Approval List">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/myrequest-approve")}
            className="mb-2"
            type="text"
            size="large"
          />
        </Tooltip>
        Back to Approval List
      </div>
      <Card>
        <Divider>Requester</Divider>
        <div className="pt-2">

          <Form form={form} labelCol={{ span: 6 }} layout="horizontal">
            <Row>
              <Col span={12}>
                <Form.Item label="Requester">
                  <span>{selectedRequest?.Requester || "N/A"}</span>
                </Form.Item>

                <Form.Item
                  label="Change Detail"
                  name="PermissionRequestDescription"
                >
                  <TextArea rows={5} disabled={true} style={{ resize: "none" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Status">
                  <Tag
                    color={
                      selectedRequest?.Status === "IT Process"
                        ? "processing"
                        : selectedRequest?.Status === "Complete"
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
                      ["Rejected", "Complete"].includes(
                        selectedRequest?.Status
                      ) &&
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
                          key: "requestFor",
                          render: (_, record) => {

                            if (record.RequestFor) {
                              return record.RequestFor;
                            }

                            return "Unknown";
                          },
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
                          title: "Requested Status",
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

                        {
                          title: "Action",
                          key: "action",
                          render: (_, record) => (
                            <Space size="middle">
                              <Button
                                type="link"
                                size="small"
                                style={{ padding: 0, height: 'auto' }}
                              >
                                Access
                              </Button>
                              <Button
                                type="link"
                                size="small"
                                danger
                                style={{ padding: 0, height: 'auto' }}
                              >
                                Reject
                              </Button>
                            </Space>
                          ),
                        },
                        {
                          title: "",
                          key: "history",
                          width: 60,
                          render: (_, record) => (
                            <Tooltip
                              title={
                                <div>
                                  <div><strong>Function:</strong> {record.FunctionRequest}</div>
                                  <div><strong>Path:</strong> {record.Path}</div>
                                  <div><strong>Description:</strong> {record.Description}</div>

                                  <div><strong>Last Modified:</strong> {new Date(record.Modified).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}</div>


                                  <div><strong>Modified By:</strong>{selectedRequest?.Requester || "N/A"}</div>

                                </div>
                              }
                              placement="left"
                            >
                              <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer', fontSize: '16px' }} />
                            </Tooltip>
                          ),
                        },
                      ]}
                      dataSource={dataPermissionRequestsDetail}
                      rowKey="Id"
                      size="middle"
                      pagination={true}
                    />
                  </Col>
                )}
            </Row>
            <Divider>IT Approve</Divider>
            <Row>
              <Col span={12}>
                <HistoryApproval
                  dataPermissionRequestHistories={dataPermissionRequestHistories}
                ></HistoryApproval>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Comment"
                  name="CommentApproval"
                  rules={[
                    {
                      required: true,
                      message: "Please input your comment",
                    },
                  ]}
                >
                  <TextArea
                    rows={5}
                    disabled={
                      selectedRequest?.Status === "Rejected" ||
                      selectedRequest?.Status === "Complete"
                    }
                    style={{ resize: "none" }}
                    value={commentApproval}
                    onChange={(e) => setCommentApproval(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            {["Request To Change", "IT Process"].includes(           //Waiting for Manager
              selectedRequest?.Status
            ) &&
              (currentUser?.Role?.includes("Manager") ||
                currentUser?.Role?.includes("IT Admin")) && (
                <div className="flex justify-end mt-4">
                  <AsyncButton
                    icon={<CloseCircleOutlined />}
                    type="primary"
                    variant="solid"
                    color="danger"
                    className="ms-2"
                    onClick={handleRejected}
                  >
                    Reject
                  </AsyncButton>
                  <AsyncButton
                    icon={<CheckCircleOutlined />}
                    type="primary"
                    variant="solid"
                    className="ms-2"
                    onClick={handleApproved}
                  >
                    Approve
                  </AsyncButton>
                </div>
              )}
          </Form>
        </div>
      </Card>
    </>
  );
};

export default MyApprovalDetails;

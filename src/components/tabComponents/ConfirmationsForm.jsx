import React, { useEffect, useState } from "react";
import { CloseOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
import { Form, Input, Button, Divider, Table, Tag, Tooltip } from "antd";
const { TextArea } = Input;
import AsyncButton from "../../common/components/AsyncButton";
import PropTypes from "prop-types";
import { useForm } from "antd/es/form/Form";
import { buildFullPath, handleError } from "../../common/helpers";
import { addListItemService, getItemsService } from "../../common/services";
import lists from "../../common/lists";
import { useUI } from "../../common/UIProvider";
import nProgress from "nprogress";
import { useSelector } from "react-redux";
import { MODULE_AUTH } from "../../store/auth";
import { useLocation } from "react-router-dom";
import { ACTION_TYPE, STATUS_CONFIRMATION } from "../../common/constant";
import dayjs from "../../common/dayjs";
import HistoryApproval from "./HistoryApproval";

const propTypes = {
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  mode: PropTypes.oneOf(["new", "view"]),
  isShowDataEmployee: PropTypes.object,
  dataSystemObjectCategoryVisible: PropTypes.array,
  dataSystemObjectVisible: PropTypes.array,
  selectedFunctions: PropTypes.array,
  onDeleteFunctionRow: PropTypes.func,
};

const formMode = {
  view: "view",
  new: "new",
};

const ConfirmationsForm = ({
  mode,
  item,
  onSubmit,
  onCancel,
  isShowDataEmployee,
  dataSystemObjectCategoryVisible,
  dataSystemObjectVisible,
  selectedFunctions,
  onDeleteFunctionRow,
}) => {
  const [form] = useForm();
  const ui = useUI();
  const { currentUser } = useSelector((state) => state[MODULE_AUTH]);

  const location = useLocation();
  const passedEmployeeData = location.state?.employeeData;

  //State
  const [functionRequestTree, setFunctionRequestTree] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  //state show data default
  const [dataPermissionRequestTable, setDataPermissionRequestTable] = useState(
    []
  );
  //State show data history
  const [dataPermissionRequestHistories, setDataPermissionRequestHistories] =
    useState([]);

  //Function
  const handleSubmit = async () => {
    try {
      await form.validateFields();
    } catch {
      return;
    }

    const values = form.getFieldsValue();
    const statusCompleteID = STATUS_CONFIRMATION.find(
      (item) => item.display_name === "Complete"
    )?.key;
    const statusPendingID = STATUS_CONFIRMATION.find(
      (item) => item.display_name === "Pending Incomplete Request"
    )?.key;
    const actionChange = ACTION_TYPE.find(
      (item) => item.display_name === "Request To Change"
    )?.key;
    const actionUnChange = ACTION_TYPE.find(
      (item) => item.display_name === "Keep Unchanged"
    )?.key;

    try {
      if (mode === formMode.new) {
        const isChange = values.ActionType === "Keep Unchanged";

        if (!isChange && selectedFunctions.length > 0) {
          await addListItemService(lists.PermissionRequests, {
            Requester: currentUser?.Employee_name,
            Status: "Request To Change",
            Approver: currentUser?.Employee_name,
            PermissionRequestDescription: values.Note || "",
          });
          const latestRequest = await getItemsService(
            lists.PermissionRequests,
            {
              top: 1,
              orderBy: "Id desc",
            }
          ).then((res) => {
            return res.value[0];
          });
          if (latestRequest?.PermissionRequestId) {
            // Tạo confirmation cho user hiện tại
            await addListItemService(lists.Confirmations, {
              UserID: isShowDataEmployee.user_id,
              Note: values.Note || "",
              Status: statusPendingID,
              ActionType: actionChange,
              Time: new Date().toISOString(),
              PermissionRequestId: latestRequest?.PermissionRequestId,
            });

            // Tìm tất cả user_id khác nhau từ selectedFunctions
            const uniqueUserIds = new Set();
            
            // Thêm user_id hiện tại
            if (isShowDataEmployee?.user_id) {
              uniqueUserIds.add(isShowDataEmployee.user_id);
            }
            
            // Thêm user_id từ selectedFunctions nếu có
            selectedFunctions.forEach((func) => {
              if (func?.user_id && func.user_id !== isShowDataEmployee?.user_id) {
                uniqueUserIds.add(func.user_id);
              }
            });

            // Tạo confirmation cho mỗi user_id khác nhau
            const confirmationPromises = Array.from(uniqueUserIds).map(async (userId) => {
              if (userId !== isShowDataEmployee?.user_id) {
                return addListItemService(lists.Confirmations, {
                  UserID: userId,
                  Note: values.Note || "",
                  Status: statusPendingID,
                  ActionType: actionChange,
                  Time: new Date().toISOString(),
                  PermissionRequestId: latestRequest?.PermissionRequestId,
                });
              }
            });

            // Chờ tất cả confirmations được tạo
            await Promise.all(confirmationPromises.filter(Boolean));

            await Promise.all(
              selectedFunctions.map((func) => {
                const path = buildFullPath({
                  record: func,
                  dataSystemObjectVisible,
                  dataSystemObjectCategoryVisible,
                });
                const functionRequest =
                  func?.titleEdit?.trim() ||
                  func?.title?.trim() ||
                  func?.Title?.trim() ||
                  func?.SystemObjectOperationRcd?.trim() ||
                  "";
                const description =
                  func?.description || func?.Description || "";
                const requestFor =
                  func?.employee_number && func?.employee_name
                    ? `${func.employee_number} - ${func.employee_name}`
                    : isShowDataEmployee?.employee_number && isShowDataEmployee?.employee_name
                      ? `${isShowDataEmployee.employee_number} - ${isShowDataEmployee.employee_name}`
                      : "Unknown";
                const status =
                  func?.status ||
                  (func?.GrantRightsFlag === true ? "GRANT" : "NOT GRANT");

                return addListItemService(lists.PermissionRequestsDetail, {
                  PermissionRequestId: latestRequest?.PermissionRequestId,
                  FunctionRequest: functionRequest,
                  Description: description,
                  Path: path,
                  RequestFor: requestFor,
                  Status: status,
                  Comment: "",
                  Result: "",
                });
              })
            );

            await addListItemService(lists.PermissionRequestHistories, {
              PermissionRequestId: latestRequest.PermissionRequestId,
              UserId: currentUser?.User_id,
              UserDisplayName: currentUser?.Employee_name,
              Comment: null,
              Status: "Submitted", //"Submitted" or "Complete"
              Created: new Date().toISOString(),
              Modified: new Date().toISOString(),
            });
          }
        } else {
          await addListItemService(lists.Confirmations, {
            UserID: isShowDataEmployee.user_id,
            Note: values.Note || "",
            Status: statusCompleteID,
            ActionType: actionUnChange,
            Time: new Date().toISOString(),
            PermissionRequestId: "00000000-0000-0000-0000-000000000000",
          });
        }
      }
      ui.notiSuccess("Success");
      return onSubmit();
    } catch (error) {
      ui.notiError("Failure");
      handleError(error);
    }
  };

  const formatEmployeeOptions = (data) => {
    if (!Array.isArray(data)) return [];

    const formatted = data.map((item) => ({
      label: `${item.employee_number} - ${item.employee_name}`,
      value: item.employee_name,
      key: item.user_id,
    }));

    // Loại bỏ phần tử trùng key
    const unique = Array.from(
      new Map(formatted.map((item) => [item.key, item])).values()
    );

    return unique;
  };

  //Get API
  const handleGetData = async () => {
    nProgress.start();
    try {
      const employeeDataWithConfirmationViews = await getItemsService(
        lists.EmployeeDataWithConfirmationViews,
        {
          filter: `user_name eq '${currentUser?.User_name}'`,
        }
      );

      if (employeeDataWithConfirmationViews?.value) {
        const formattedEmployees = formatEmployeeOptions(
          employeeDataWithConfirmationViews.value
        );
        setEmployeeOptions(formattedEmployees);
      }
    } catch (error) {
      handleError(error);
    } finally {
      nProgress.done();
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetDataPermissionRequestDetail = async () => {
    nProgress.start();
    try {
      if (item?.PermissionRequestId) {
        const data = await getItemsService(lists.PermissionRequestsDetail, {
          filter: `PermissionRequestId eq ${item?.PermissionRequestId}`,
        });
        setDataPermissionRequestTable(data.value);
      }
    } catch (error) {
      handleError(error);
    } finally {
      nProgress.done();
    }
  };
  useEffect(() => {
    handleGetDataPermissionRequestDetail();
  }, [item]);

  const handleGetDataPermissionRequestHistories = async () => {
    nProgress.start();
    try {
      if (item?.PermissionRequestId) {
        const data = await getItemsService(lists.PermissionRequestHistories, {
          filter: `PermissionRequestId eq ${item?.PermissionRequestId}`,
        });
        setDataPermissionRequestHistories(data.value);
      }
    } catch (error) {
      handleError(error);
    } finally {
      nProgress.done();
    }
  };
  useEffect(() => {
    handleGetDataPermissionRequestHistories();
  }, [item]);

  useEffect(() => {
    if (mode === "new") {
      form.resetFields();
      form.setFieldsValue({
        UserID: isShowDataEmployee?.user_id,
        ActionType:
          selectedFunctions.length > 0 ? "Request To Change" : "Keep Unchanged",
      });
      if (selectedFunctions.length > 0) {
        const defaultFuncValues = selectedFunctions
          .filter(
            (item) => item.SystemObjectOperationRcd && item.SystemObjectRcd
          )
          .map(
            (item) =>
              `func-${item.SystemObjectOperationRcd}-${item.SystemObjectRcd}`
          );

        //console.log("🧩 defaultFuncValues", defaultFuncValues);
        setFunctionRequestTree(defaultFuncValues);
      }
    } else {
      form.setFieldsValue({
        UserID: item?.UserID,
        Note: item?.Note || "",
        Status: item?.Status,
        ActionType: item?.ActionType,
        Time: item?.Time || "",
        PermissionRequestId: item?.PermissionRequestId || "",
      });
    }
  }, [selectedFunctions, item, form]);

  return (
    <>
      <Form
        layout="horizontal"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item name="UserID" hidden>
          <Input />
        </Form.Item>

        {item?.ActionType === "TYPE_REQUEST_TO_CHANGE" ||
          selectedFunctions.length > 0 ? (
          <>
            {/* ===== TABLE SECTION ===== */}
            <Table
              className="custom-modal"
              size="small"
              bordered
              pagination={true}
              rowKey={(record) =>
                record?.PermissionRequestDetailId || record?.key
              }
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
                        color={reversedStatus === "GRANT" ? "green" : "volcano"}
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
                    <Tooltip title="Remove this function">
                      <Button
                        style={{ marginLeft: 2 }}
                        type="text"
                        size="large"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={mode === "view"}
                        onClick={() => {
                          // Gọi callback để xóa function
                          onDeleteFunctionRow?.(
                            record?.rowKeyUnified || record?.key
                          );
                        }}
                      />
                    </Tooltip>
                  ),
                },
              ]}
              dataSource={
                mode === "view" && dataPermissionRequestTable.length > 0
                  ? dataPermissionRequestTable.map((row) => ({
                    key: row?.PermissionRequestDetailId,
                    Path: row?.Path,
                    FunctionRequest: row?.FunctionRequest,
                    Description: row?.Description,
                    RequestFor: row?.RequestFor,
                    Status: row?.Status,
                  }))
                  : selectedFunctions.map((func, index) => ({
                    rowKeyUnified: func?.rowKeyUnified || func?.key || index,
                    key: func?.key || index,
                    Path: buildFullPath({
                      record: func,
                      dataSystemObjectVisible,
                      dataSystemObjectCategoryVisible,
                    }),
                    FunctionRequest:
                      func?.titleEdit?.trim() ||
                      func?.title?.trim() ||
                      func?.Title?.trim() ||
                      func?.SystemObjectOperationRcd?.trim() ||
                      "Unknown",
                    Description: func?.description || func?.Description || "",
                    RequestFor: (() => {
                      if (func?.employee_number && func?.employee_name) {
                        return `${func.employee_number} - ${func.employee_name}`;
                      } else if (isShowDataEmployee?.employee_number && isShowDataEmployee?.employee_name) {
                        return `${isShowDataEmployee.employee_number} - ${isShowDataEmployee.employee_name}`;
                      } else if (passedEmployeeData?.employee_number && passedEmployeeData?.employee_name) {
                        return `${passedEmployeeData.employee_number} - ${passedEmployeeData.employee_name}`;
                      } else {
                        return "Unknown";
                      }
                    })(),
                    Status:
                      func?.status ||
                      (func?.GrantRightsFlag ? "GRANT" : "NOT GRANT"),
                  }))
              }
            />
            <Form.Item label="Requester" hidden>
              <span>{item?.Requester || currentUser?.Employee_name}</span>
            </Form.Item>
            <Form.Item label="Change Detail" name="Note">
              <TextArea rows={4} allowClear disabled={mode === "view"} />
            </Form.Item>
            <Form.Item label="Status Time" name="Time" hidden>
              <span>
                {item?.Time
                  ? dayjs(item.Time).format("YYYY-MM-DD HH:mm A")
                  : ""}
              </span>
            </Form.Item>
            <Form.Item label="Action Type" name="ActionType">
              <Tag
                color={
                  item?.ActionType === "TYPE_KEEP_UNCHANGED" ? "green" : "gold"
                }
              >
                {ACTION_TYPE.find((i) => i.key === item?.ActionType)
                  ?.display_name || "Request To Change"}
              </Tag>
            </Form.Item>
            <Divider></Divider>
            <HistoryApproval
              dataPermissionRequestHistories={dataPermissionRequestHistories}
            ></HistoryApproval>
          </>
        ) : (
          <>
            {/* ===== DEFAULT NOTE + STATUS ONLY ===== */}
            <Form.Item label="Change Detail" name="Note">
              <TextArea rows={4} allowClear disabled={mode === "view"} />
            </Form.Item>
            <Form.Item label="Action Type" name="ActionType">
              <Tag
                color={
                  item?.ActionType === "TYPE_REQUEST_TO_CHANGE"
                    ? "gold"
                    : "green"
                }
              >
                {ACTION_TYPE.find((i) => i.key === item?.ActionType)
                  ?.display_name || "Keep Unchanged"}
              </Tag>
            </Form.Item>
            <HistoryApproval
              dataPermissionRequestHistories={dataPermissionRequestHistories}
            ></HistoryApproval>
          </>
        )}
      </Form>

      {formMode.view === mode ? (
        ""
      ) : (
        <div className="flex justify-end mt-4">
          <Button icon={<CloseOutlined />} onClick={onCancel}>
            Cancel
          </Button>
          <AsyncButton
            icon={<SendOutlined />}
            className="ms-2"
            type="primary"
            onClick={handleSubmit}
          >
            Submit
          </AsyncButton>
        </div>
      )}
    </>
  );
};

ConfirmationsForm.propTypes = propTypes;
export default ConfirmationsForm;

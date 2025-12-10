import React, { useEffect, useMemo, useState } from "react";
import { CloseOutlined, SendOutlined } from "@ant-design/icons";
import { Form, Input, Select, Button } from "antd";
const { TextArea } = Input;
import AsyncButton from "../../common/components/AsyncButton";
import PropTypes from "prop-types";
import { useForm } from "antd/es/form/Form";
import { handleError } from "../../common/helpers";
import {
  addListItemService,
  getItemsService,
  updateListItemService,
} from "../../common/services";
import lists from "../../common/lists";
import { useUI } from "../../common/UIProvider";
import nProgress from "nprogress";
import { useSelector } from "react-redux";
import { MODULE_AUTH } from "../../store/auth";
import TreeTransferComponent from "./TreeTransferComponent";

const propTypes = {
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  mode: PropTypes.oneOf(["new", "edit"]),
  selectedFunctions: PropTypes.array,
  dataSystemObjectCategoryVisible: PropTypes.array,
  dataSystemObjectVisible: PropTypes.array,
  dataSystemObjectFunctions: PropTypes.array,
  dataSystemObjectCategories: PropTypes.array,
  dataSystemObjects: PropTypes.array,
};

const formMode = {
  edit: "edit",
  new: "new",
};

const PermissionRequestForm = ({
  mode,
  item,
  onSubmit,
  onCancel,
  selectedFunctions,
  dataSystemObjectCategoryVisible,
  dataSystemObjectVisible,
  dataSystemObjectFunctions,
}) => {
  const [form] = useForm();
  const ui = useUI();
  const { currentUser } = useSelector((state) => state[MODULE_AUTH]);

  //State
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [functionRequestSelect, setFunctionRequestSelect] = useState([]);
  const [functionRequestTree, setFunctionRequestTree] = useState([]);

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

  //Function
  const formatEmployeeOptions = (data) => {
    if (!Array.isArray(data)) return [];

    const formatted = data.map((item, index) => ({
      label: `${item.employee_number} - ${item.employee_name}`,
      value: item.employee_name,
      key: index,
    }));

    // Loại bỏ phần tử trùng key
    // const unique = Array.from(
    //   new Map(formatted.map((item) => [item.key, item])).values()
    // );

    return formatted;
  };

  const renderFunctionRequestField = () => {
    if (Array.isArray(selectedFunctions) && selectedFunctions.length > 0) {
      return (
        <Select
          allowClear
          mode="multiple"
          style={{ width: "100%" }}
          options={formattedFunctions}
          placeholder="Please select function"
          value={functionRequestSelect ?? []}
          onChange={(values) => {
            setFunctionRequestSelect(values);
            form.setFieldValue("FunctionRequest", values);
          }}
        />
      );
    }

    return (
      <TreeTransferComponent
        treeData={treeData}
        value={functionRequestTree ?? []}
        onChange={(values) => {
          const val = Array.isArray(values) ? values : [];
          setFunctionRequestTree(val);
          form.setFieldValue("FunctionRequest", val);
        }}
      />
    );
  };

  // Hàm dựng tree chung
  const buildTreeDataGeneric = (categories, objects, functions) => {
    if (
      !Array.isArray(categories) ||
      !Array.isArray(objects) ||
      !Array.isArray(functions)
    )
      return [];

    return categories.map((category) => {
      const categoryKey = category.SystemObjectCategoryRcd;
      const relatedObjects = objects.filter(
        (obj) => obj.SystemObjectCategoryRcd === categoryKey
      );
      const objectNodeMap = {},
        rootObjectNodes = [];

      relatedObjects.forEach((obj) => {
        const funcChildren = functions
          .filter((f) => f.SystemObjectRcd === obj.SystemObjectRcd)
          .map((f) => ({
            label:
              f?.Title || f?.SystemObjectOperationRcd || "Unnamed Function",
            value:
              f?.Title ||
              `func-${f?.SystemObjectOperationRcd}-${obj.SystemObjectRcd}`,
            key:
              f?.Title ||
              `func-${f?.SystemObjectOperationRcd}-${obj.SystemObjectRcd}`,
            isLeaf: true,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        objectNodeMap[obj.SystemObjectRcd] = {
          label:
            obj.SystemObjectNameE || obj.SystemObjectName || "Unnamed Object",
          value: `obj-${obj.SystemObjectRcd}`,
          key: `obj-${obj.SystemObjectRcd}`,
          disabled: true,
          children: funcChildren,
        };
      });

      relatedObjects.forEach((obj) => {
        const node = objectNodeMap[obj.SystemObjectRcd];
        const parent = objectNodeMap[obj.ParentSystemObjectRcd];
        if (parent) {
          parent.children = [...(parent.children || []), node];
        } else {
          rootObjectNodes.push(node);
        }
      });

      const sortNodes = (nodes) => {
        nodes.sort((a, b) => a.label.localeCompare(b.label));
        nodes.forEach((node) => node.children && sortNodes(node.children));
      };
      sortNodes(rootObjectNodes);

      return {
        label: category.NameL || category.NameE || "Unnamed Category",
        value: `cat-${categoryKey}`,
        key: `cat-${categoryKey}`,
        disabled: true,
        children: rootObjectNodes,
      };
    });
  };

  // useMemo gọi chung
  const treeData = useMemo(
    () =>
      buildTreeDataGeneric(
        dataSystemObjectCategoryVisible,
        dataSystemObjectVisible,
        dataSystemObjectFunctions
      ),
    [
      dataSystemObjectCategoryVisible,
      dataSystemObjectVisible,
      dataSystemObjectFunctions,
    ]
  );

  const onSelect = (selectedKeys, info) => {
    //console.log("✅ Selected:", selectedKeys, info);
  };

  const formattedFunctions = selectedFunctions?.length
    ? selectedFunctions.map((item) => ({
        label: item.titleEdit || item.Title, // Hiển thị tên func
        value: item.titleEdit || item.Title, // Giá trị Id
        key: item.key,
      }))
    : [];

  const handleSubmit = async () => {
    try {
      await form.validateFields();
    } catch (error) {
      return;
    }

    const values = form.getFieldsValue();
    const requestData = {
      Requester: currentUser?.Employee_name,
      RequestFor: Array.isArray(values.RequestFor)
        ? values.RequestFor.join(", ")
        : values.RequestFor || "",
      FunctionRequest: Array.isArray(values.FunctionRequest)
        ? values.FunctionRequest.join(", ")
        : values.FunctionRequest || "",
      Status: "Waiting for Manager",
      Created: new Date().toISOString(),
      Modified: new Date().toISOString(),
      Approver: "Nguyen Van C",
      Description: values.Description,
    };

    try {
      await addListItemService(lists.PermissionRequests, requestData);

      const latestRequest = await getItemsService(lists.PermissionRequests, {
        top: 1,
        orderBy: "Id desc",
      }).then((res) => res.value[0]);

      if (latestRequest?.PermissionRequestId) {
        await addListItemService(lists.PermissionRequestHistories, {
          PermissionRequestId: latestRequest.PermissionRequestId,
          UserId: currentUser?.User_id,
          UserDisplayName: currentUser?.Employee_name,
          Comment: null,
          Status: "Submitted",
          Created: new Date().toISOString(),
          Modified: new Date().toISOString(),
        });
      }

      ui.notiSuccess("Success");
      return onSubmit();
    } catch (error) {
      ui.notiError("Failure");
      handleError(error);
    }
  };

  useEffect(() => {
    if (mode === "new") {
      form.resetFields();
      setFunctionRequestTree([]);
      form.setFieldsValue({ FunctionRequest: [] });
    } else {
      const initVal = Array.isArray(item?.FunctionRequest)
        ? item?.FunctionRequest
        : item?.FunctionRequest?.split(",").map((x) => x.trim()) || [];

      setFunctionRequestTree(initVal);
      form.setFieldsValue({
        Requester: item?.Requester,
        RequestFor: item?.RequestFor || [],
        FunctionRequest: initVal,
        Description: item?.Description || "",
      });
    }
  }, [item, form, selectedFunctions, mode]);

  return (
    <>
      <Form
        labelCol={{
          span: 6,
        }}
        layout="horizontal"
        form={form}
      >
        <Form.Item label="Requester">
          <span>{item?.Requester || currentUser?.Employee_name}</span>
        </Form.Item>
        <Form.Item
          label="Request For"
          name="RequestFor"
          rules={[
            {
              required: true,
              message: "Please select at least one user",
            },
          ]}
        >
          <Select
            allowClear
            mode="multiple"
            style={{ width: "100%" }}
            options={employeeOptions}
            //options={users}
            onChange={(value) => {
              form.setFieldValue("RequestFor", value);
            }}
          />
        </Form.Item>
        <Form.Item label="Function Request" name="FunctionRequest">
          {renderFunctionRequestField()}
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
          <TextArea rows={4} allowClear />
        </Form.Item>
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
            Add
          </AsyncButton>
        </div>
      )}
    </>
  );
};

PermissionRequestForm.propTypes = propTypes;
export default PermissionRequestForm;

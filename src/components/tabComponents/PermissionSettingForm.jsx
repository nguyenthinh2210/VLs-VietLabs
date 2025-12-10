import React, { useEffect } from "react";

import { Button, Form, Input, Switch, TreeSelect } from "antd";
import PropTypes from "prop-types";
import AsyncButton from "../../common/components/AsyncButton";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { handleError } from "../../common/helpers";
import { useUI } from "../../common/UIProvider";
import lists from "../../common/lists";
import { addListItemFunction } from "../../common/services";
const { TextArea } = Input;

const propTypes = {
  selectFunction: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

const PermissionSettingForm = ({ selectFunction, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const ui = useUI();

  useEffect(() => {
    if (selectFunction) {
      form.setFieldsValue({
        objectRcd: selectFunction?.objectRcd,
        objectOperationRcd: selectFunction?.nameFunction,
        mappingActiveStatus: selectFunction?.mappingActiveStatus,
        description: selectFunction?.description,
        title:
          selectFunction?.titleEdit === null ||
          selectFunction?.titleEdit === undefined
            ? selectFunction?.title
            : selectFunction?.titleEdit,
      });
    }
  }, [selectFunction, form]);

  //Function
  const handleSave = async () => {
    try {
      await form.validateFields();
    } catch (error) {
      return;
    }
    const values = form.getFieldsValue();
    //console.log("Saved values:", values);
    try {
      await addListItemFunction(lists.SystemObjectFunctionDescription, [
        {
          objectRcd: values.objectRcd,
          objectOperationRcd: values.objectOperationRcd,
          description: values.description,
          activeStatus: values.mappingActiveStatus,
          title: values.title,
        },
      ]);

      ui.notiSuccess("Success");

      const updatedData = {
        key: selectFunction.key,
        objectRcd: values.objectRcd,
        objectOperationRcd: values.objectOperationRcd,
        description: values.description,
        mappingActiveStatus: values.mappingActiveStatus,
        titleEdit: values.title,
      };

      return onSubmit(updatedData);
    } catch (error) {
      ui.notiError("Failure");
      handleError(error);
    }
  };

  return (
    <>
      <Form
        labelCol={{
          span: 6,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}
        form={form}
      >
        {/*hidden fields */}
        <Form.Item name="objectRcd" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="objectOperationRcd" hidden>
          <Input />
        </Form.Item>

        {/*show fields */}
        <Form.Item label="Function Name" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          label="Visible"
          name="mappingActiveStatus"
          valuePropName="checked"
        >
          <Switch checkedChildren="True" unCheckedChildren="False" />
        </Form.Item>
        <div className="flex justify-end mt-4">
          <Button icon={<CloseOutlined />} onClick={onCancel}>
            Cancel
          </Button>

          <AsyncButton
            icon={<SaveOutlined />}
            className="ms-2"
            type="primary"
            onClick={handleSave}
          >
            Save
          </AsyncButton>
        </div>
      </Form>
    </>
  );
};

PermissionSettingForm.propTypes = propTypes;
export default PermissionSettingForm;

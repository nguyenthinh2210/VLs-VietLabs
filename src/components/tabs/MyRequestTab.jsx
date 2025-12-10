import React, { useEffect, useMemo, useState } from "react";
import { Card, Modal, Button, Tag, Typography } from "antd";
import MyRequestTable from "../tabComponents/MyRequestTable";
import { PlusOutlined } from "@ant-design/icons";
import nProgress from "nprogress";
import { handleError } from "../../common/helpers";
import { getItemsService } from "../../common/services";
import lists from "../../common/lists";
import { useUI } from "../../common/UIProvider";
import SPPagination from "../../common/components/SPPagination";
import PermissionRequestForm from "../tabComponents/PermissionRequestForm";
import { useSelector } from "react-redux";
import { MODULE_AUTH } from "../../store/auth";

const MyRequestTab = () => {
  const { Title } = Typography;
  const ui = useUI();
  const { currentUser } = useSelector((state) => state[MODULE_AUTH]);
  //State
  const [selectedData, setSelectedData] = useState({
    item: null,
    mode: "new",
  });
  const [isShowCreateData, setIsShowCreateData] = useState(false);
  const [isShowEditData, setIsShowEditData] = useState(false);
  const [dataPermissionRequests, setDataPermissionRequests] = useState([]);
  const [dataSystemObjectCategoryVisible, setDataSystemObjectCategoryVisible] =
    useState([]);
  const [dataSystemObjectVisible, setDataSystemObjectVisible] = useState([]);
  const [dataSystemObjectFunctions, setDataSystemObjectFunctions] = useState(
    []
  );

  //Function
  const handleClickCreateRequest = () => {
    setSelectedData({
      item: null,
      mode: "new",
    });
    setIsShowCreateData(true);
  };

  //Get API
  const handleGetPermissionRequests = async (skip = "", top = "") => {
    nProgress.start();
    try {
      const permissionRequests = await getItemsService(
        lists.PermissionRequests,
        {
          skip: skip,
          top: top,
          orderBy: "Id desc",
        }
      );
      setDataPermissionRequests(permissionRequests.value);

      return permissionRequests;
    } catch (error) {
      handleError(error);
    } finally {
      nProgress.done();
    }
  };
  //componentDidMount effect
  useEffect(() => {
    handleGetPermissionRequests();
  }, []);
  const handleGetData = async (skip = "", top = "") => {
    nProgress.start();
    try {
      const [
        SystemObjectCategoryVisibles,
        SystemObjectVisibles,
        userSystemObjectFunctions,
      ] = await Promise.all([
        getItemsService(lists.SystemObjectCategoryVisibles, {
          top: top,
          skip: skip,
        }),
        getItemsService(lists.SystemObjectVisibles, { top: top, skip: skip }),
        getItemsService(lists.UserSystemObjectFunctions, {
          filter: `UserId eq ${currentUser?.User_id} and MappingActiveStatus eq true`,
          top: top,
          skip: skip,
        }),
      ]);

      setDataSystemObjectCategoryVisible(SystemObjectCategoryVisibles.value);
      setDataSystemObjectVisible(SystemObjectVisibles.value);
      setDataSystemObjectFunctions(userSystemObjectFunctions.value);
    } catch (error) {
      handleError(error);
    } finally {
      nProgress.done();
      ui.setLoading(false);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <>
      <Modal
        className="custom-modal"
        title={
          selectedData.mode === "edit"
            ? "Edit Permission Request"
            : "Add Permission Request"
        }
        open={isShowCreateData || isShowEditData}
        footer={[]}
        onCancel={() => {
          selectedData.mode === "edit"
            ? setIsShowEditData(false)
            : setIsShowCreateData(false);
        }}
      >
        <PermissionRequestForm
          mode={selectedData.mode}
          item={selectedData.item}
          dataSystemObjectCategoryVisible={dataSystemObjectCategoryVisible}
          dataSystemObjectVisible={dataSystemObjectVisible}
          dataSystemObjectFunctions={dataSystemObjectFunctions}
          onSubmit={() => {
            handleGetPermissionRequests;
            selectedData.mode === "edit"
              ? setIsShowEditData(false)
              : setIsShowCreateData(false);
          }}
          onCancel={() => {
            selectedData.mode === "edit"
              ? setIsShowEditData(false)
              : setIsShowCreateData(false);
          }}
        ></PermissionRequestForm>
      </Modal>
      <Card>
        <Title level={4}>Requests</Title>
        {/* <Button
          className="float-right mb-4"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleClickCreateRequest}
        >
          Request Permision
        </Button> */}
        <MyRequestTable
          dataPermissionRequests={dataPermissionRequests}
          onRefresh={handleGetPermissionRequests}
        ></MyRequestTable>

        <div className="flex justify-end mt-4">
          <SPPagination
            getItems={handleGetPermissionRequests}
            setItems={setDataPermissionRequests}
            items={dataPermissionRequests}
            loading={ui.loading}
            setLoading={ui.setLoading}
          />
        </div>
      </Card>
    </>
  );
};

export default MyRequestTab;

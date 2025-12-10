import React, { useEffect, useState } from "react";
import { Card, Space, Table, Tag, Typography } from "antd";
import MyApprovalTable from "../tabComponents/MyApprovalTable";
import nProgress from "nprogress";
import lists from "../../common/lists";
import { getItemsService } from "../../common/services";
import { handleError } from "../../common/helpers";
import { useUI } from "../../common/UIProvider";
import { useSelector } from "react-redux";
import { MODULE_AUTH } from "../../store/auth";
const { Title } = Typography;

const MyApprovalTab = () => {
  const ui = useUI();
  const { currentUser } = useSelector((state) => state[MODULE_AUTH]);
  //State
  const [dataPermissionRequests, setDataPermissionRequests] = useState([]);
  const [dataSystemObjectCategoryVisible, setDataSystemObjectCategoryVisible] =
    useState([]);
  const [dataSystemObjectVisible, setDataSystemObjectVisible] = useState([]);
  const [dataSystemObjectFunctions, setDataSystemObjectFunctions] = useState(
    []
  );

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
        systemObjectCategoryVisibles,
        systemObjectVisibles,
        userSystemObjectFunctions,
      ] = await Promise.all([
        getItemsService(lists.SystemObjectCategoryVisibles, {
          top: top,
          skip: skip,
        }),
        getItemsService(lists.SystemObjectVisibles, {
          top: top,
          skip: skip,
        }),
        getItemsService(lists.UserSystemObjectFunctions, {
          filter: `UserId eq ${currentUser?.User_id} and MappingActiveStatus eq true`,
          top: top,
          skip: skip,
        }),
      ]);

      setDataSystemObjectCategoryVisible(systemObjectCategoryVisibles.value);
      setDataSystemObjectVisible(systemObjectVisibles.value);
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
      <Card>
        <Title level={4}>Approvals</Title>
        <MyApprovalTable
          dataPermissionRequests={dataPermissionRequests}
          setDataPermissionRequests={setDataPermissionRequests}
          dataSystemObjectCategoryVisible={dataSystemObjectCategoryVisible}
          dataSystemObjectVisible={dataSystemObjectVisible}
          dataSystemObjectFunctions={dataSystemObjectFunctions}
          onRefresh={handleGetPermissionRequests}
        ></MyApprovalTable>


      </Card>
    </>
  );
};

export default MyApprovalTab;

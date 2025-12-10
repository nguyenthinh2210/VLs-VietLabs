import { useEffect, useState } from "react";
import PermissionTree from "../../components/tabComponents/PermissionTree";
import PermissionRequestForm from "../../components/tabComponents/PermissionRequestForm";
import {
  Card,
  Typography,
  Modal,
  Row,
  Col,
  Input,
  Button,
  Table,
  Tag,
  Space,
  Radio,
  Form,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getItemsService } from "../../common/services";
import lists from "../../common/lists";
import { buildFullPath, handleError } from "../../common/helpers";
import nProgress from "nprogress";
import { useUI } from "../../common/UIProvider";
import { useSelector } from "react-redux";
import { MODULE_AUTH } from "../../store/auth";
import { ColumnFilterComponent } from "../../components/tabComponents/ColumnFilterComponent";

const { Title } = Typography;
const { Search } = Input;

export default function MyPermission() {
  const ui = useUI();
  const { currentUser } = useSelector((state) => state[MODULE_AUTH]);

  //State
  const [dataSystemObjectCategoryVisible, setDataSystemObjectCategoryVisible] =
    useState([]);
  const [dataSystemObjectVisible, setDataSystemObjectVisible] = useState([]);
  const [dataSystemObjectFunctions, setDataSystemObjectFunctions] = useState(
    []
  );
  const [selectedInfoTree, setSelectedInfoTree] = useState([]);
  const [selectedFunctions, setSelectedFunctions] = useState([]);
  const [selectedData, setSelectedData] = useState({
    item: null,
    mode: "new",
  });
  const [isShowCreateData, setIsShowCreateData] = useState(false);
  const [isShowEditData, setIsShowEditData] = useState(false);
  const [searchText, setSearchText] = useState("");

  //State for search filter column
  // const [searchTextColumn, setSearchTextColumn] = useState("");
  // const [searchedColumn, setSearchedColumn] = useState("");
  //State filter column
  // const [filterCounts, setFilterCounts] = useState({});
  //State option
  // const [statusOptions, setStatusOptions] = useState([]);
  // const [grantRightsFlagOptions, setGrantRightsFlagOptions] = useState([]);
  //State highlight
  const [selectedTreeKeys, setSelectedTreeKeys] = useState(["cat-All"]);
  const [filterGrantRights, setFilterGrantRights] = useState("all");

  //Get API
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
        getItemsService(lists.SystemObjectVisibles, { top: top, skip: skip }),
        getItemsService(lists.UserSystemObjectFunctions, {
          filter: `UserId eq ${currentUser?.User_id} and MappingActiveStatus eq true`,
          top: top,
          skip: skip,
        }),
      ]);

      // console.log("first", userSystemObjectFunctions.value);
      setDataSystemObjectCategoryVisible(systemObjectCategoryVisibles.value);
      setDataSystemObjectVisible(systemObjectVisibles.value);
      setDataSystemObjectFunctions(userSystemObjectFunctions.value);

      // const dataWithKey = userSystemObjectFunctions.value.map(
      //   (item, index) => ({
      //     ...item,
      //     key: `grantRightsFlagOption-${index}`,
      //   })
      // );
      // setGrantRightsFlagOptions(
      //   getUniqueOptions(dataWithKey, "GrantRightsFlag")
      // );
      return userSystemObjectFunctions.value;
    } catch (error) {
      handleError(error);
      return [];
    } finally {
      nProgress.done();
      ui.setLoading(false);
    }
  };

  useEffect(() => {
    handleGetData().then((userSystemObjectFunctionsValue) => {
      setSelectedFunctions(userSystemObjectFunctionsValue);
    });
  }, []);

  //Function
  // const handleTreeSelect = (selectedKeys, info) => {
  //   //console.log("Selected1:", selectedKeys, info);
  //   setSelectedTreeKeys(selectedKeys);
  //   setSelectedInfoTree(info);

  //   const funcs =
  //     info?.node?.children?.filter((child) =>
  //       child?.key?.startsWith("func-")
  //     ) || [];
  //   setSelectedFunctions(funcs);
  //   //console.log("Selected1:", funcs);
  //   setStatusOptions(getUniqueOptions(funcs, "status"));
  // };
  const handleTreeSelect = (selectedKeys, info) => {
    setSelectedTreeKeys(selectedKeys);
    setSelectedInfoTree(info);

    const collectAllFunctionNodes = (node, path = []) => {
      let funcs = [];
      const newPath = [...path, node.title];

      if (node?.children) {
        node.children.forEach((child) => {
          if (child.key?.startsWith("func-")) {
            funcs.push({
              ...child,
              fullPath: [...newPath, child.title].join("/"),
            });
          } else {
            funcs = funcs.concat(collectAllFunctionNodes(child, newPath));
          }
        });
      }
      return funcs;
    };

    const funcs = collectAllFunctionNodes(info.node);
    setSelectedFunctions(funcs);
  };

  const handleClickCreateRequest = () => {
    setSelectedData({
      item: null,
      mode: "new",
    });
    //console.log("selectedFunctions", selectedFunctions);
    if (selectedFunctions.length < 0) {
      setSelectedFunctions([]);
    }
    setIsShowCreateData(true);
  };

  const getUniqueOptions = (data, field) => {
    const unique = [...new Set(data.map((item) => item[field]))];

    return unique.map((value) => {
      const label = value === true ? "GRANT" : "NOT GRANT";
      return {
        label: label,
        value,
      };
    });
  };

  const getFilteredData = () => {
    const source =
      selectedInfoTree?.node?.key === "cat-All" || !selectedInfoTree?.node
        ? dataSystemObjectFunctions
        : selectedFunctions;

    // ver2
    //if (filterGrantRights === "all") return source;

    //return source.filter((item) => item.GrantRightsFlag === filterGrantRights);

    const filteredSource =
      filterGrantRights === "all"
        ? source
        : source.filter((item) => item.GrantRightsFlag === filterGrantRights);

    const validObjectSet = new Set(
      dataSystemObjectVisible.map((obj) => obj.SystemObjectRcd)
    );

    return filteredSource.filter((item) => {
      const hasValidCategory = validObjectSet.has(item.SystemObjectRcd);
      const object = dataSystemObjectVisible.find(
        (o) => o.SystemObjectRcd === item.SystemObjectRcd
      );
      const hasValidObjectName = !!(
        object &&
        (object.SystemObjectName || object.SystemObjectNameE)
      );
      const hasValidFunction = item.Title || item.SystemObjectOperationRcd;

      return hasValidCategory && hasValidObjectName && hasValidFunction;
    });
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
      dataIndex: "Title",
      key: "Title",
      render: (text, record) => text || record.SystemObjectOperationRcd,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      render: (text) => text,
    },
    {
      title: "Status",
      dataIndex: "GrantRightsFlag",
      key: "GrantRightsFlag",
      render: (GrantRightsFlag) => {
        let color = GrantRightsFlag === true ? "green" : "volcano";
        let nameStatus = GrantRightsFlag === true ? "Grant" : "Not grant";
        return (
          <Tag color={color} key={GrantRightsFlag}>
            {nameStatus.toUpperCase()}
          </Tag>
        );
      },
      // ...ColumnFilterComponent({
      //   dataIndex: "GrantRightsFlag",
      //   placeholder: "Status",
      //   searchTextColumn,
      //   setSearchTextColumn,
      //   searchedColumn,
      //   setSearchedColumn,
      //   options: statusOptions,
      //   filterCounts,
      //   setFilterCounts,
      //   dataSource: selectedFunctions,
      // }),
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, item) =>
    //     item.status === false && (
    //       <Space size="middle" key={item.ID}>
    //         <a
    //           onClick={() => {
    //             console.log("item 1", item);
    //             setSelectedData({
    //               item: item,
    //               mode: "edit",
    //             });
    //             setIsShowEditData(true);
    //           }}
    //         >
    //           Request
    //         </a>
    //       </Space>
    //     ),
    // },
  ];

  const columnsForAllFunctions = [
    {
      title: "Path",
      key: "Path",
      render: (record) => {
        const path = buildFullPath({
          record,
          dataSystemObjectVisible,
          dataSystemObjectCategoryVisible,
        }).split("/");
        if (path.length > 1) path.pop();
        return path.join("/") || "N/A";
      },
    },
    {
      title: "Function Name",
      dataIndex: "Title",
      key: "Title",
      render: (text, record) => text || record?.SystemObjectOperationRcd,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      render: (text) => text,
    },
    {
      title: "Status",
      dataIndex: "GrantRightsFlag",
      key: "GrantRightsFlag",
      render: (GrantRightsFlag) => {
        let color = GrantRightsFlag === true ? "green" : "volcano";
        let nameStatus = GrantRightsFlag === true ? "Grant" : "Not grant";
        return (
          <Tag color={color} key={GrantRightsFlag}>
            {nameStatus.toUpperCase()}
          </Tag>
        );
      },
      // ...ColumnFilterComponent({
      //   dataIndex: "GrantRightsFlag",
      //   placeholder: "Status",
      //   searchTextColumn,
      //   setSearchTextColumn,
      //   searchedColumn,
      //   setSearchedColumn,
      //   options: grantRightsFlagOptions,
      //   filterCounts,
      //   setFilterCounts,
      //   dataSource: dataSystemObjectFunctions,
      // }),
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, item) =>
    //     item.GrantRightsFlag === false && (
    //       <Space size="middle" key={item.ID}>
    //         <a
    //           onClick={() => {
    //             console.log("item 2", item);
    //             setSelectedData({
    //               item: item,
    //               mode: "edit",
    //             });
    //             setIsShowEditData(true);
    //           }}
    //         >
    //           Request
    //         </a>
    //       </Space>
    //     ),
    // },
  ];

  return (
    <>
      <Title level={2}>My Permission</Title>
      <Modal
        className="custom-modal"
        title={"Add Permission Request"}
        open={isShowCreateData || isShowEditData}
        width="40%"
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
          selectedFunctions={selectedFunctions}
          dataSystemObjectCategoryVisible={dataSystemObjectCategoryVisible}
          dataSystemObjectVisible={dataSystemObjectVisible}
          dataSystemObjectFunctions={dataSystemObjectFunctions}
          onSubmit={() => {
            handleGetData();
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

      <Card
        style={{
          width: "100%",
          minHeight: "calc(100vh - 145px)",
        }}
      >
        <Row>
          <Col span={6}>
            <Title level={4}>Permission tree</Title>
            <Search
              className="mb-4"
              placeholder="Search permission"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <PermissionTree
              dataSystemObjectCategoryVisible={dataSystemObjectCategoryVisible}
              dataSystemObjectVisible={dataSystemObjectVisible}
              dataSystemObjectFunctions={dataSystemObjectFunctions}
              onSelectTreeNode={handleTreeSelect}
              searchText={searchText}
              selectedKeys={selectedTreeKeys}
            ></PermissionTree>
          </Col>
          <Col span={2}></Col>
          <Col span={16}>
            <Row justify="space-between" align="middle">
              <Title level={4}>
                {selectedInfoTree?.node?.key?.startsWith("obj-") &&
                selectedInfoTree?.node?.children?.some((child) =>
                  child?.key?.startsWith("func-")
                )
                  ? `${selectedInfoTree.node.title} Function`
                  : "Function"}
              </Title>

              <Row justify="space-between mb-2" align="middle">
                <Form.Item label="Status" style={{ marginBottom: 0 }}>
                  <Radio.Group
                    value={filterGrantRights}
                    onChange={(e) => setFilterGrantRights(e.target.value)}
                  >
                    <Radio value="all">ALL</Radio>
                    <Radio value={true}>GRANT</Radio>
                    <Radio value={false}>NOT GRANT</Radio>
                  </Radio.Group>
                </Form.Item>

                {/* <Button
                  className="float-right"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleClickCreateRequest}
                >
                  Request Permission
                </Button> */}
              </Row>
            </Row>

            <Table
              rowKey={
                selectedInfoTree?.node?.key === "cat-All" ||
                !selectedInfoTree?.node
                  ? "TempGuid"
                  : "key"
              }
              columns={
                selectedInfoTree?.node?.key === "cat-All" ||
                !selectedInfoTree?.node
                  ? columnsForAllFunctions
                  : columns
              }
              dataSource={getFilteredData()}
              pagination={true}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
}

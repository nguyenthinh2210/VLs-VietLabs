import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import PermissionTree from "../../components/tabComponents/PermissionTree";
import { getItemsService } from "../../common/services";
import nProgress from "nprogress";
import lists from "../../common/lists";
import {
  buildFullPath,
  handleError,
  renderNewStatusTag,
} from "../../common/helpers";
import { useUI } from "../../common/UIProvider";
import { useSelector } from "react-redux";
import { MODULE_AUTH } from "../../store/auth";
import { useLocation } from "react-router-dom";
import { HistoryOutlined, PlusOutlined } from "@ant-design/icons";
import AsyncButton from "../../common/components/AsyncButton";
import ConfirmationsForm from "../../components/tabComponents/ConfirmationsForm";
import dayjs from "../../common/dayjs";
import { ACTION_TYPE } from "../../common/constant";

const { Title } = Typography;
const { Search } = Input;

export default function UserPermissionDetails() {
  const ui = useUI();

  const location = useLocation();
  const passedEmployeeData = location.state?.employeeData;

  // useEffect(() => {
  //   console.log("Employee data received:", passedEmployeeData);
  // }, [passedEmployeeData]);
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
  const [searchText, setSearchText] = useState("");
  const [dataConfirmations, setDataConfirmations] = useState([]);
  //State modal
  const [selectedData, setSelectedData] = useState({
    item: null,
    mode: "new",
  });
  const [isShowModalConfirmations, setIsShowModalConfirmations] =
    useState(false);
  const [reviewMode, setReviewMode] = useState(null);
  const [isShowDataEmployee, setIsShowDataEmployee] = useState({});
  //State reset form
  const [formKey, setFormKey] = useState(Date.now());
  //State highlight
  const [selectedTreeKeys, setSelectedTreeKeys] = useState(["cat-All"]);
  //State filter in table
  const [filterGrantRights, setFilterGrantRights] = useState("all");
  const [filterRequestToChange, setFilterRequestToChange] = useState("all");

  const [checkedMap, setCheckedMap] = useState(new Map());
  //state pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  //state history
  const [permissionRequestHistories, setPermissionRequestHistories] = useState(
    []
  );
  const isSelectedFilter = filterRequestToChange === "selected";

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
      title: "Current Status",
      dataIndex: "GrantRightsFlag",
      key: "status",
      render: (GrantRightsFlag) => {
        let color = GrantRightsFlag === true ? "green" : "volcano";
        let nameStatus = GrantRightsFlag === true ? "Grant" : "Not grant";
        return (
          <Tag color={color} key={GrantRightsFlag}>
            {nameStatus.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "New Status",
      dataIndex: "GrantRightsFlag",
      key: "NewStatus",
      render: (GrantRightsFlag, record) =>
        renderNewStatusTag(
          GrantRightsFlag,
          selectedRowKeys?.includes(record.rowKeyUnified)
        ),
    },
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
      title: "Current Status",
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
    },
    {
      title: "New Status",
      dataIndex: "GrantRightsFlag",
      key: "NewStatus",
      render: (GrantRightsFlag, record) =>
        renderNewStatusTag(
          GrantRightsFlag,
          selectedRowKeys?.includes(record.rowKeyUnified)
        ),
    },
  ];

  const columnsConformations = [
    {
      title: "ConfirmationID",
      dataIndex: "ConfirmationID",
      key: "ConfirmationID",
      render: () => null,
      onCell: () => ({ style: { display: "none" } }),
      onHeaderCell: () => ({ style: { display: "none" } }),
    },
    // {
    //   title: "Request ID",
    //   key: "index",
    //   render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    // },
    {
      title: "Request ID",
      dataIndex: "Id",
      key: "Id",
    },
    {
      title: "Change Detail",
      dataIndex: "Note",
      key: "Note",
    },
    {
      title: "Action Type",
      key: "ActionType",
      render: (_, { ActionType }) => {
        let color =
          ActionType === "TYPE_KEEP_UNCHANGED"
            ? "green"
            : ActionType === "TYPE_REQUEST_TO_CHANGE"
              ? "gold"
              : "red";

        return (
          <Tag color={color}>
            {ACTION_TYPE.find((item) => item.key === ActionType)?.display_name}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "PermissionRequestId",
      key: "Status",
      render: (permissionRequestId) => {
        const status = getLatestStatusByRequestId(
          permissionRequestId,
          permissionRequestHistories
        );
        const color =
          status === "Manager approved"
            ? "processing"
            : status === "Complete"
              ? "green"
              : status === "Rejected"
                ? "volcano"
                : status === "Waiting for Manager"
                  ? "gold"
                  : status === "Submitted"
                    ? "silver"
                    : "green";

        return <Tag color={color}>{status || "Complete"}</Tag>;
      },
    },
    {
      title: "Status Time",
      dataIndex: "Time",
      key: "Time",
      render: (text) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm A") : ""),
    },
    {
      title: "",
      key: "action",
      render: (_, item, index) =>
        item.status !== true && (
          <Space key={item.ID}>
            <a
              className="bg-sky-400 bg-opacity-60 text-black m-1"
              onClick={() => {
                const rowIndex = (currentPage - 1) * pageSize + index + 1;
                setSelectedData({
                  item: { ...item, rowIndex: rowIndex },
                  mode: "view",
                });
                setIsShowDataEmployee(passedEmployeeData);
                setReviewMode("view");
              }}
            >
              Details
            </a>
          </Space>
        ),
    },
  ];

  //Functions
  const handleTreeSelect = (selectedKeys, info) => {
    //console.log("Selected1:", selectedKeys, info);
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
    setSelectedFunctions(funcs.map(makeRowKeyUnified));
  };

  const handleClickConfirmations = () => {
    //console.log("✅ Selected rows:", checkedMap);
    setSelectedData({ item: null, mode: "new" });
    setIsShowDataEmployee(passedEmployeeData);
    setReviewMode("new");
    setFormKey(Date.now());
  };

  const currentNodeKey = selectedInfoTree?.node?.key || "cat-All";
  const getFilteredData = () => {
    const validObjectSet = new Set(
      dataSystemObjectVisible.map((obj) => obj.SystemObjectRcd)
    );

    const isValidItem = (item) => {
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
    };

    if (filterRequestToChange === "selected") {
      let allCheckedRows = Array.from(checkedMap.values()).flatMap(
        (entry) => entry.rows
      );

      // Unique theo TempGuid
      const uniqueRows = Array.from(
        new Map(allCheckedRows.map((row) => [row.rowKeyUnified, row])).values()
      );

      let result =
        filterGrantRights === "all"
          ? uniqueRows
          : uniqueRows.filter(
            (item) => item.GrantRightsFlag === filterGrantRights
          );

      // 👉 Lọc dữ liệu không hợp lệ
      return result.filter(isValidItem);
    } else {
      // Filter theo node tree hiện tại
      const source =
        selectedInfoTree?.node?.key === "cat-All" || !selectedInfoTree?.node
          ? dataSystemObjectFunctions
          : selectedFunctions;

      let result = source;

      if (filterGrantRights !== "all") {
        result = result.filter(
          (item) => item.GrantRightsFlag === filterGrantRights
        );
      }

      if (filterRequestToChange === "notSelected") {
        const currentChecked = checkedMap.get(currentNodeKey) || { keys: [] };
        const checkedKeySet = new Set(currentChecked.keys);
        result = result.filter((item) => {
          const key =
            selectedInfoTree?.node?.key === "cat-All" || !selectedInfoTree?.node
              ? item.TempGuid
              : item.key;
          return !checkedKeySet.has(key);
        });
      }

      // 👉 Lọc dữ liệu không hợp lệ
      return result.filter(isValidItem);
    }
  };

  const selectedRowKeys = (() => {
    if (filterRequestToChange === "selected") {
      return Array.from(
        new Set(Array.from(checkedMap.values()).flatMap((entry) => entry.keys))
      );
    }

    return Array.from(
      new Set(Array.from(checkedMap.values()).flatMap((entry) => entry.keys))
    );
  })();

  const makeRowKeyUnified = (item) => ({
    ...item,
    rowKeyUnified: item.TempGuid || item.key, // Ưu tiên TempGuid nếu có, fallback về key
  });
  const currentData = getFilteredData();
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentPageRows = currentData.slice(startIdx, endIdx);
  const currentPageRowKeys = currentPageRows.map((row) => row.rowKeyUnified);

  const getLatestStatusByRequestId = (requestId, historyList) => {
    if (!requestId || !Array.isArray(historyList)) return null;

    const filtered = historyList.filter(
      (item) => item.PermissionRequestId === requestId
    );

    if (filtered.length === 0) return null;

    const latest = filtered.reduce((latestItem, currentItem) => {
      return dayjs(currentItem.Modified).isAfter(latestItem.Modified)
        ? currentItem
        : latestItem;
    });

    return latest?.Status || null;
  };


  const handleConfirmationRowClick = (record) => {
    // Đóng modal lịch sử
    //setIsShowModalConfirmations(false);
    // Thiết lập dữ liệu cho form chi tiết
    setSelectedData({ item: record, mode: "view" });
    setIsShowDataEmployee(passedEmployeeData);
    // Mở modal ConfirmationsForm
    setReviewMode("view");
  };

  //Get API
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
          filter: `UserId eq ${passedEmployeeData?.user_id} and MappingActiveStatus eq true`,
          top: top,
          skip: skip,
        }),
      ]);

      setDataSystemObjectCategoryVisible(SystemObjectCategoryVisibles.value);
      setDataSystemObjectVisible(SystemObjectVisibles.value);
      setDataSystemObjectFunctions(
        userSystemObjectFunctions.value.map(makeRowKeyUnified)
      );
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

  const handleGetDataConfirmations = async (skip = "", top = "") => {
    nProgress.start();
    try {
      if (passedEmployeeData?.user_id) {
        const confirmations = await getItemsService(lists.Confirmations, {
          filter: `UserID eq ${passedEmployeeData.user_id}`,
          top: top,
          skip: skip,
          orderBy: "Time desc",
        });

        if (confirmations?.value?.length > 0) {
          setDataConfirmations(confirmations.value);
        }
      }
    } catch (error) {
      handleError(error);
    } finally {
      nProgress.done();
      ui.setLoading(false);
    }
  };

  useEffect(() => {
    handleGetDataConfirmations();
  }, []);

  useEffect(() => {
    const fetchPermissionRequestHistory = async (skip = "", top = "") => {
      try {
        const res = await getItemsService(lists.PermissionRequestHistories, {
          top: top,
          skip: skip,
          orderBy: "Modified desc",
        });
        setPermissionRequestHistories(res?.value || []);
      } catch (err) {
        handleError(err);
      }
    };

    fetchPermissionRequestHistory();
  }, [dataConfirmations]);

  return (
    <>
      <Row align="middle" justify="space-between" className="pb-2">
        <Col flex="1">
          <div className="profile-container p-2">
            <div
              className="d-flex align-items-center"
              style={{ flexWrap: "nowrap" }}
            >
              <span>
                <b style={{ fontSize: "16px" }}>Employee Name: </b>
                {passedEmployeeData?.employee_name || "User Name"}
              </span>
              <span>
                {" "}
                | <b style={{ fontSize: "16px" }}>Employee Number: </b>
                {passedEmployeeData?.employee_number} |{" "}
              </span>
              <span>
                <b style={{ fontSize: "16px" }}>Department: </b>
                {passedEmployeeData?.department} |{" "}
              </span>
              <span>
                <b style={{ fontSize: "16px" }}>JobTitle: </b>
                {passedEmployeeData?.job_title}
              </span>
            </div>
          </div>
        </Col>

        <Col>
          <Row gutter={8} align="middle" wrap={true}>
            {dataConfirmations[0]?.Time && (
              <Col>
                <b style={{ margin: 0 }}>
                  Last Reviewed:{" "}
                  {dayjs(dataConfirmations[0].Time).format(
                    "YYYY-MM-DD - HH:mm A"
                  )}
                </b>
              </Col>
            )}
            <Col>
              <Button
                type="primary"
                icon={<HistoryOutlined />}
                onClick={() => setIsShowModalConfirmations(true)}
              >
                Request History
              </Button>
            </Col>

            <Col>
              <Badge
                count={
                  Array.from(checkedMap.values()).reduce(
                    (sum, entry) => sum + (entry.keys?.length || 0),
                    0
                  ) || ""
                }
              >
                <AsyncButton
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={handleClickConfirmations}
                >
                  {checkedMap.size === 0 ? "Keep Unchanged" : "Items To Change"}
                </AsyncButton>
              </Badge>
            </Col>
          </Row>
        </Col>
      </Row>

      <Card>
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
            <Title level={4}>
              {selectedInfoTree?.node?.key?.startsWith("obj-") &&
                selectedInfoTree?.node?.children?.some((child) =>
                  child?.key?.startsWith("func-")
                )
                ? `${selectedInfoTree.node.title} Function`
                : "Function"}
            </Title>
            <Row justify="space-between" align="middle">
              <Col span={10}>
                <Form.Item label="Items">
                  <Radio.Group
                    value={filterRequestToChange}
                    onChange={(e) => setFilterRequestToChange(e.target.value)}
                  >
                    <Radio value="all">All</Radio>
                    <Radio value="selected">Selected</Radio>
                    <Radio value="notSelected">Not Selected</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="Current Status">
                  <Radio.Group
                    value={filterGrantRights}
                    onChange={(e) => setFilterGrantRights(e.target.value)}
                  >
                    <Radio value="all">ALL</Radio>
                    <Radio value={true}>GRANT</Radio>
                    <Radio value={false}>NOT GRANT</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Table
              rowKey="rowKeyUnified"
              columns={
                selectedInfoTree?.node?.key === "cat-All" ||
                  !selectedInfoTree?.node ||
                  filterRequestToChange === "selected"
                  ? columnsForAllFunctions
                  : columns
              }
              dataSource={getFilteredData()}
              pagination={true}
              rowSelection={{
                columnTitle: (
                  <Checkbox
                    checked={currentPageRowKeys.every((key) =>
                      selectedRowKeys.includes(key)
                    )}
                    indeterminate={
                      currentPageRowKeys.some((key) =>
                        selectedRowKeys.includes(key)
                      ) &&
                      !currentPageRowKeys.every((key) =>
                        selectedRowKeys.includes(key)
                      )
                    }
                    onChange={(e) => {
                      const currentData = getFilteredData();
                      const startIdx = (currentPage - 1) * pageSize;
                      const endIdx = startIdx + pageSize;
                      const currentPageRows = currentData.slice(
                        startIdx,
                        endIdx
                      );
                      const currentPageKeys = currentPageRows.map(
                        (row) => row.rowKeyUnified
                      );

                      if (isSelectedFilter) {
                        const newCheckedMap = new Map(checkedMap);
                        if (e.target.checked) {
                          currentPageRows.forEach((row) => {
                            newCheckedMap.set(row.rowKeyUnified, {
                              keys: [row.rowKeyUnified],
                              rows: [row],
                            });
                          });
                        } else {
                          currentPageKeys.forEach((key) => {
                            newCheckedMap.delete(key);
                          });
                        }
                        setCheckedMap(newCheckedMap);
                      } else {
                        setCheckedMap((prev) => {
                          const next = new Map(prev);
                          const existingEntry = next.get(currentNodeKey) || {
                            keys: [],
                            rows: [],
                          };

                          const updatedKeys = existingEntry.keys.filter(
                            (key) => !currentPageKeys.includes(key)
                          );
                          const updatedRows = existingEntry.rows.filter(
                            (row) =>
                              !currentPageKeys.includes(row.rowKeyUnified)
                          );

                          if (e.target.checked) {
                            const mergedKeys = [
                              ...updatedKeys,
                              ...currentPageKeys,
                            ];
                            const mergedRows = [
                              ...updatedRows,
                              ...currentPageRows.map((row) => ({
                                ...row,
                                categoryTree:
                                  selectedInfoTree?.node?.titleCate || "",
                                objectTree: selectedInfoTree?.node?.title || "",
                              })),
                            ];
                            next.set(currentNodeKey, {
                              keys: mergedKeys,
                              rows: mergedRows,
                            });
                          } else {
                            if (updatedKeys.length === 0) {
                              next.delete(currentNodeKey);
                            } else {
                              next.set(currentNodeKey, {
                                keys: updatedKeys,
                                rows: updatedRows,
                              });
                            }
                          }

                          return next;
                        });
                      }
                    }}
                  />
                ),

                selectedRowKeys,
                onChange: (newSelectedKeys, newSelectedRows) => {
                  if (isSelectedFilter) {
                    const newCheckedMap = new Map();
                    newSelectedRows.forEach((row) => {
                      newCheckedMap.set(row.rowKeyUnified, {
                        keys: [row.rowKeyUnified],
                        rows: [row],
                      });
                    });
                    setCheckedMap(newCheckedMap);
                  } else {
                    setCheckedMap((prev) => {
                      const next = new Map(prev);
                      const existingEntry = next.get(currentNodeKey) || {
                        keys: [],
                        rows: [],
                      };
                      const visibleRowKeys = getFilteredData().map(
                        (row) => row.rowKeyUnified
                      );
                      const visibleKeySet = new Set(visibleRowKeys);
                      const retainedRows = existingEntry.rows.filter(
                        (row) => !visibleKeySet.has(row.rowKeyUnified)
                      );
                      const finalRows = [
                        ...retainedRows,
                        ...newSelectedRows.map((row) => ({
                          ...row,
                          categoryTree: selectedInfoTree?.node?.titleCate || "",
                          objectTree: selectedInfoTree?.node?.title || "",
                        })),
                      ];
                      const finalKeys = [
                        ...retainedRows.map((row) => row.rowKeyUnified),
                        ...newSelectedKeys,
                      ];

                      if (finalKeys.length === 0) {
                        next.delete(currentNodeKey);
                      } else {
                        next.set(currentNodeKey, {
                          keys: finalKeys,
                          rows: finalRows,
                        });
                      }

                      return next;
                    });
                  }
                },
              }}
              onRow={(record) => ({
                onClick: () => {
                  // Xử lý chọn/uncheck cho row này
                  const key = record.rowKeyUnified;
                  // Nếu đã check thì bỏ check, chưa check thì check
                  let nextKeys;
                  if (selectedRowKeys.includes(key)) {
                    nextKeys = selectedRowKeys.filter((k) => k !== key);
                  } else {
                    nextKeys = [...selectedRowKeys, key];
                  }
                  // Nếu isSelectedFilter: build lại Map cho checkedMap
                  if (isSelectedFilter) {
                    const newCheckedMap = new Map();
                    getFilteredData()
                      .filter((row) => nextKeys.includes(row.rowKeyUnified))
                      .forEach((row) => {
                        newCheckedMap.set(row.rowKeyUnified, {
                          keys: [row.rowKeyUnified],
                          rows: [row],
                        });
                      });
                    setCheckedMap(newCheckedMap);
                  } else {
                    setCheckedMap((prev) => {
                      const next = new Map(prev);
                      const existingEntry = next.get(currentNodeKey) || {
                        keys: [],
                        rows: [],
                      };
                      let newKeys, newRows;
                      if (selectedRowKeys.includes(key)) {
                        // Bỏ chọn
                        newKeys = existingEntry.keys.filter((k) => k !== key);
                        newRows = existingEntry.rows.filter(
                          (row) => row.rowKeyUnified !== key
                        );
                      } else {
                        // Thêm chọn
                        newKeys = [...existingEntry.keys, key];
                        newRows = [
                          ...existingEntry.rows,
                          {
                            ...record,
                            categoryTree:
                              selectedInfoTree?.node?.titleCate || "",
                            objectTree: selectedInfoTree?.node?.title || "",
                          },
                        ];
                      }
                      if (newKeys.length === 0) {
                        next.delete(currentNodeKey);
                      } else {
                        next.set(currentNodeKey, {
                          keys: newKeys,
                          rows: newRows,
                        });
                      }
                      return next;
                    });
                  }
                },
                style: {
                  cursor: "pointer",
                },
              })}
            />
          </Col>
        </Row>
      </Card>

      {/* Modal confirmations table */}
      <Modal
        className="custom-modal modal-full"
        title={`Request History - ${passedEmployeeData?.employee_name} (Emp No: ${passedEmployeeData?.employee_number})`}
        open={isShowModalConfirmations}
        footer={[]}
        onCancel={() => {
          setIsShowModalConfirmations(false);
        }}
      >
        <Table
          rowKey="ConfirmationID"
          className="confirmation-table"
          columns={columnsConformations}
          dataSource={dataConfirmations}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true,
            //showQuickJumper: true,
          }}
          onRow={(record) => ({
            onClick: () => handleConfirmationRowClick(record),
            style: { cursor: "pointer" },
          })}
        ></Table>
      </Modal>

      {/* Modal add confirmations */}
      <Modal
        className="custom-modal"
        title={
          selectedData?.mode === "view"
            ? `Request History Details - ${selectedData?.item?.Id}`
            : checkedMap.size === 0
              ? "New Request"
              : `New Request by ${currentUser?.Employee_name}`
        }
        open={!!reviewMode}
        zIndex={1100}
        width={800}
        footer={[]}
        onCancel={() => setReviewMode(null)}
      >
        <ConfirmationsForm
          key={formKey}
          mode={selectedData.mode}
          item={selectedData.item}
          isShowDataEmployee={passedEmployeeData}
          dataSystemObjectCategoryVisible={dataSystemObjectCategoryVisible}
          dataSystemObjectVisible={dataSystemObjectVisible}
          selectedFunctions={Array.from(checkedMap.entries()).flatMap(
            ([nodeKey, entry]) =>
              entry.rows.map((row) => ({
                ...row,
                keyOrigin: nodeKey,
                status: row.GrantRightsFlag === true ? "GRANT" : "NOT GRANT",
              }))
          )}
          onDeleteFunctionRow={(keyToDelete) => {
            const newCheckedMap = new Map(checkedMap);
            for (const [nodeKey, entry] of newCheckedMap.entries()) {
              const updatedKeys = entry.keys.filter((k) => k !== keyToDelete);
              const updatedRows = entry.rows.filter(
                (row) => row.rowKeyUnified !== keyToDelete
              );
              if (updatedKeys.length > 0) {
                newCheckedMap.set(nodeKey, {
                  keys: updatedKeys,
                  rows: updatedRows,
                });
              } else {
                newCheckedMap.delete(nodeKey);
              }
            }
            setCheckedMap(newCheckedMap);
          }}
          onSubmit={async () => {
            await handleGetDataConfirmations();
            setReviewMode(null);
            setCheckedMap(new Map());
          }}
          onCancel={() => {
            setReviewMode(null);
          }}
        ></ConfirmationsForm>
      </Modal>
    </>
  );
}

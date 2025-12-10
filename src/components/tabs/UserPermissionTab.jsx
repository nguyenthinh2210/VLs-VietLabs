import React, { useEffect, useState } from "react";
import {
  Input,
  Col,
  Button,
  Row,
  Modal,
  Typography,
  Form,
  Radio,
  Select,
  Table,
  Tag,
  Badge,
} from "antd";
import { PlusOutlined, ReloadOutlined, HistoryOutlined } from "@ant-design/icons";
import UsersFunctionTable from "../tabComponents/UsersFunctionTable";
import PermissionRequestForm from "../tabComponents/PermissionRequestForm";
import ConfirmationsForm from "../tabComponents/ConfirmationsForm";
import nProgress from "nprogress";
import lists from "../../common/lists";
import { getItemsService } from "../../common/services";
import { buildFullPath, handleError } from "../../common/helpers";
import { useUI } from "../../common/UIProvider";
import { useSelector } from "react-redux";
import { MODULE_AUTH } from "../../store/auth";
import PermissionTree from "../tabComponents/PermissionTree";
import AsyncButton from "../../common/components/AsyncButton";
const { Search } = Input;
const { Title } = Typography;

const UserPermissionTab = () => {
  const ui = useUI();
  const { currentUser } = useSelector((state) => state[MODULE_AUTH]);

  //State
  const [selectedData, setSelectedData] = useState({
    item: null,
    mode: "new",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedInfoTree, setSelectedInfoTree] = useState([]);
  const [selectedFunctions, setSelectedFunctions] = useState([]);
  const [dataSystemObjectCategoryVisible, setDataSystemObjectCategoryVisible] =
    useState([]);
  const [dataSystemObjectVisible, setDataSystemObjectVisible] = useState([]);
  const [dataSystemObjectFunctions, setDataSystemObjectFunctions] = useState(
    []
  );
  //State used reset
  const [tableKey, setTableKey] = useState(Date.now());
  //State highlight
  const [selectedTreeKeys, setSelectedTreeKeys] = useState(["cat-All"]);
  //State filter in table
  const [filterGrantRights, setFilterGrantRights] = useState(true);
  const [filterEmployeeNumber, setFilterEmployeeNumber] = useState([]);
  const [filterEmployeeName, setFilterEmployeeName] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  //State for selected row from upper table
  const [selectedTableRow, setSelectedTableRow] = useState(null);
  //State for selected rows with checkboxes
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  //State for checkedMap from lower table
  const [checkedMap, setCheckedMap] = useState(new Map());
  //State for selected rows from lower table
  const [selectedRows, setSelectedRows] = useState([]);
  //State for modal confirmations
  const [reviewMode, setReviewMode] = useState(null);
  const [formKey, setFormKey] = useState(Date.now());

  //Get API
  const handleGetData = async (skip = "", top = "") => {
    nProgress.start();
    try {
      const [
        systemObjectCategoryVisibles,
        systemObjectVisibles,
        userFunctions,
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

      setDataSystemObjectCategoryVisible(systemObjectCategoryVisibles.value);
      setDataSystemObjectVisible(systemObjectVisibles.value);
      setDataSystemObjectFunctions(userFunctions.value);
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

  useEffect(() => {
    const fetchEmployees = async (skip = "", top = "") => {
      try {
        const response = await getItemsService(
          lists.EmployeeDataWithConfirmationViews,
          {
            filter: `user_name eq '${currentUser?.User_name}'`,
            top: top,
            skip: skip,
          }
        );

        const raw = response?.value || [];

        const formatted = raw.map((item) => ({
          employee_number: item.employee_number,
          employee_name: item.employee_name,
          user_id: item.UserId || item.user_id,
        }));

        // Lọc trùng theo user_id
        const uniqueMap = new Map();
        formatted.forEach((emp) => {
          uniqueMap.set(emp.user_id, emp);
        });

        const unique = Array.from(uniqueMap.values());

        setEmployeeOptions(unique);
      } catch (error) {
        handleError(error);
      }
    };

    fetchEmployees();
  }, []);

  //Function
  const handleClickCreateRequest = () => {
    setSelectedData({
      item: null,
      mode: "new",
    });
    setIsModalOpen(true);
  };

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
    setSelectedFunctions(funcs);
  };

  const handleReload = async () => {
    setTableKey(Date.now());
    setSelectedRows([]); // Reset selected rows khi reload
    setCheckedMap(new Map()); // Reset checked map khi reload
  };

  // Handle row selection from upper table
  const handleRowClick = (record) => {
    setSelectedTableRow(record);

    // Update the lower table filter based on selected row
    if (record.SystemObjectRcd) {
      // Filter by the selected object - get all functions for this object
      const newSelectedFunctions = dataSystemObjectFunctions.filter(
        (item) => item.SystemObjectRcd === record.SystemObjectRcd
      );
      setSelectedFunctions(newSelectedFunctions);

      // Chỉ cập nhật tree selection để highlight đúng item, không expand
      if (record.SystemObjectRcd) {
        const objectKey = `obj-${record.SystemObjectRcd}`;
        setSelectedTreeKeys([objectKey]); // Chỉ chọn object, không expand
      }
    }

    // Tự động chọn checkbox cho row được click
    const rowKey = selectedInfoTree?.node?.key === "cat-All" || !selectedInfoTree?.node
      ? record.TempGuid
      : record.key;

    if (rowKey) {
      const newSelectedRowKeys = selectedRowKeys.includes(rowKey)
        ? selectedRowKeys.filter(key => key !== rowKey) // Bỏ chọn nếu đã chọn
        : [...selectedRowKeys, rowKey]; // Thêm vào nếu chưa chọn

      setSelectedRowKeys(newSelectedRowKeys);
    }

    setSelectedRows([]);
  };

  // Handle checkbox selection
  const handleRowSelection = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  // Handle checkbox selection from lower table
  const handleSelectedRowsChange = (newCheckedMap, selectedRows) => {
    setCheckedMap(newCheckedMap);
    // selectedRows chứa thông tin employee_name, employee_number từ table
    setSelectedRows(selectedRows || []);
  };

  // Handle click confirmations button
  const handleClickConfirmations = () => {
    setSelectedData({ item: null, mode: "new" });
    setReviewMode("new");
    setFormKey(Date.now());
  };

  // Function to filter data like MyPermission page
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

  // Columns for selected functions (like in MyPermission)
  const columns = [
    {
      title: "Path",
      key: "Path",
      render: (record) => {
        const path = (record.fullPath || "").split("/");
        if (path.length > 1) path.pop();
        return path.join("/") || "N/A";
      },
      ellipsis: true,
      width: 60,
    },
    {
      title: "Function",
      dataIndex: "Title",
      key: "Title",
      render: (text, record) => text || record.SystemObjectOperationRcd,
      ellipsis: true,
      width: 60,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      render: (text) => text,
      ellipsis: true,
      width: 60,
    },
    {
      title: "Status",
      dataIndex: "GrantRightsFlag",
      key: "GrantRightsFlag",
      render: (GrantRightsFlag) => {
        let color = GrantRightsFlag === true ? "green" : "volcano";
        let nameStatus = GrantRightsFlag === true ? "Grant" : "Not grant";
        return (
          <Tag color={color} key={GrantRightsFlag} size="small">
            {nameStatus.toUpperCase()}
          </Tag>
        );
      },
      width: 50,
    },
  ];

  // Columns for all functions (like in MyPermission)
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
      ellipsis: true,
      width: 60,
    },
    {
      title: "Function",
      dataIndex: "Title",
      key: "Title",
      render: (text, record) => text || record.SystemObjectOperationRcd,
      ellipsis: true,
      width: 60,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      render: (text) => text,
      ellipsis: true,
      width: 60,
    },
    {
      title: "Status",
      dataIndex: "GrantRightsFlag",
      key: "GrantRightsFlag",
      render: (GrantRightsFlag) => {
        let color = GrantRightsFlag === true ? "green" : "volcano";
        let nameStatus = GrantRightsFlag === true ? "Grant" : "Not grant";
        return (
          <Tag color={color} key={GrantRightsFlag} size="small">
            {nameStatus.toUpperCase()}
          </Tag>
        );
      },
      width: 50,
    },
  ];

  return (
    <>
      <Modal
        className="custom-modal"
        title={"Add Permission Request"}
        open={isModalOpen}
        width="40%"
        footer={[]}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <PermissionRequestForm
          mode={selectedData.mode}
          item={selectedData.item}
          dataSystemObjectCategoryVisible={dataSystemObjectCategoryVisible}
          dataSystemObjectVisible={dataSystemObjectVisible}
          dataSystemObjectFunctions={dataSystemObjectFunctions}
          onSubmit={() => {
            setIsModalOpen(false);
          }}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        ></PermissionRequestForm>
      </Modal>

      {/* Modal confirmations */}
      <Modal
        className="custom-modal"
        title={
          checkedMap.size === 0
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
          isShowDataEmployee={(() => {
            const employeeData = selectedRows.length > 0 ? {
              employee_number: selectedRows[0].employee_number,
              employee_name: selectedRows[0].employee_name,
              user_id: selectedRows[0].user_id || selectedRows[0].UserId,
              // Thêm các trường khác nếu cần
              ...selectedRows[0]
            } : null;

            return employeeData;
          })()} // Truyền employee data từ selected rows với format đúng
          dataSystemObjectCategoryVisible={dataSystemObjectCategoryVisible}
          dataSystemObjectVisible={dataSystemObjectVisible}
          selectedFunctions={Array.from(checkedMap.entries()).flatMap(
            ([nodeKey, entry]) =>
              entry.rows.map((row) => {
                // Lấy employee data từ selectedRows nếu có
                const selectedEmployee = selectedRows.find(emp =>
                  emp.employee_number === row.employee_number ||
                  emp.user_id === (row.user_id || row.UserId)
                );

                return {
                  ...row,
                  keyOrigin: nodeKey,
                  status: row.GrantRightsFlag === true ? "GRANT" : "NOT GRANT",
                  // Ưu tiên employee data từ selectedRows, nếu không có thì dùng từ row
                  employee_number: selectedEmployee?.employee_number || row.employee_number,
                  employee_name: selectedEmployee?.employee_name || row.employee_name,
                  user_id: selectedEmployee?.user_id || row.user_id || row.UserId,
                  // Thêm các trường cần thiết cho ConfirmationsForm
                  title: row.SystemObjectOperationRcd,
                  Title: row.SystemObjectOperationRcd,
                  SystemObjectOperationRcd: row.SystemObjectOperationRcd,
                  Description: row.Description,
                  GrantRightsFlag: row.GrantRightsFlag,
                };
              })
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
            setReviewMode(null);
            setCheckedMap(new Map());
            setSelectedRows([]); // Reset selected rows
            // Reload table
            setTableKey(Date.now());
          }}
          onCancel={() => {
            setReviewMode(null);
            setSelectedRows([]); // Reset selected rows
          }}
        ></ConfirmationsForm>
      </Modal>


      <>
        <Row>
          <Col span={6}>
            <Title level={4}>Permission tree</Title>
            <Search
              className="mb-4"
              placeholder="Search permission"
              allowClear
              style={{ width: 300 }}
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

          <Col span={1}></Col>
          <Col span={16}>
            <Title level={4}>
              {selectedInfoTree?.node?.key?.startsWith("obj-") &&
                selectedInfoTree?.node?.children?.some((child) =>
                  child?.key?.startsWith("func-")
                )
                ? `${selectedInfoTree.node.title} Function`
                : "Function"}
            </Title>

            {/* Table */}
            <Table
              rowSelection={{
                selectedRowKeys: selectedRowKeys,
                onChange: handleRowSelection,
                preserveSelectedRowKeys: true,
              }}
              columns={
                selectedInfoTree?.node?.key === "cat-All" ||
                  !selectedInfoTree?.node
                  ? columnsForAllFunctions
                  : columns
              }
              dataSource={getFilteredData()}
              rowKey={
                selectedInfoTree?.node?.key === "cat-All" ||
                  !selectedInfoTree?.node
                  ? "TempGuid"
                  : "key"
              }
              pagination={true}
              scroll={{ y: 290 }}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                style: {
                  backgroundColor: selectedTableRow?.TempGuid === record.TempGuid ||
                    selectedTableRow?.key === record.key ? 'white' : 'transparent',
                  cursor: 'pointer'
                }
              })}
            />


            <Col span={24}>
              <Row justify="space-between mb-2" align="middle">
                <Title level={4}>
                  Granting Group
                </Title>

                <Col>
                  <Row gutter={8} align="middle" wrap={true}>
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

                    <Col>
                      <AsyncButton
                        title="Reload Table"
                        icon={<ReloadOutlined />}
                        type="primary"
                        onClick={handleReload}
                      ></AsyncButton>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row justify="space-between mb-2" align="middle">
                <Form.Item label="Employee" style={{ marginBottom: 5 }}>
                  <Select
                    showSearch
                    allowClear
                    mode="multiple"
                    style={{ width: 300 }}
                    placeholder="Search by employee number or name"
                    onChange={(values) => {
                      const selected = employeeOptions.filter((emp) =>
                        values.includes(emp.user_id)
                      );
                      setFilterEmployeeNumber(
                        selected.map((emp) => emp.employee_number)
                      );
                      setFilterEmployeeName(
                        selected.map((emp) => emp.employee_name)
                      );
                    }}
                    optionFilterProp="label"
                    options={employeeOptions.map((emp) => ({
                      label: `${emp.employee_number} - ${emp.employee_name}`,
                      value: emp.user_id,
                    }))}
                  />
                </Form.Item>
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
              </Row>
              <UsersFunctionTable
                tableKey={tableKey}
                selectedFunctions={selectedFunctions}
                dataSystemObjectVisible={dataSystemObjectVisible}
                dataSystemObjectCategoryVisible={dataSystemObjectCategoryVisible}
                filterEmployeeNumber={filterEmployeeNumber}
                filterEmployeeName={filterEmployeeName}
                filterGrantRights={filterGrantRights}
                selectedRowKeys={selectedRowKeys}
                selectedTableData={getFilteredData().filter(item =>
                  selectedRowKeys.includes(selectedInfoTree?.node?.key === "cat-All" || !selectedInfoTree?.node ? item.TempGuid : item.key)
                )}
                onSelectedRowsChange={handleSelectedRowsChange}
              ></UsersFunctionTable>
            </Col>
          </Col>



        </Row>
      </>
    </>
  );
};

export default UserPermissionTab;

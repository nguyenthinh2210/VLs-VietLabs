import React, { useEffect, useMemo, useState } from "react";
import { Table, Modal, Tag, Checkbox } from "antd";
import UsersPermissionDetails from "./UsersPermissionDetails";
import nProgress from "nprogress";
import { getItemsService } from "../../common/services";
import lists from "../../common/lists";
import { buildFullPath, handleError } from "../../common/helpers";
import { useSelector } from "react-redux";
import { MODULE_AUTH } from "../../store/auth";
import PermissionName from "./PermissionName";
import { ColumnFilterComponent } from "./ColumnFilterComponent";
import PropTypes from "prop-types";

const propTypes = {
  tableKey: PropTypes.number,
  selectedFunctions: PropTypes.array,
  dataSystemObjectVisible: PropTypes.array,
  dataSystemObjectCategoryVisible: PropTypes.array,
  filterEmployeeNumber: PropTypes.array,
  filterEmployeeName: PropTypes.array,
  filterGrantRights: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  selectedRowKeys: PropTypes.array,
  selectedTableData: PropTypes.array,
  onSelectedRowsChange: PropTypes.func, // Callback để truyền selected rows và checkedMap lên parent
};

const UsersFunctionTable = ({
  tableKey,
  selectedFunctions,
  dataSystemObjectVisible,
  dataSystemObjectCategoryVisible,
  filterEmployeeNumber = [],
  filterEmployeeName = [],
  filterGrantRights,
  selectedRowKeys = [],
  selectedTableData = [],
  onSelectedRowsChange, // Thêm prop mới để truyền selected rows lên parent
}) => {
  const { currentUser } = useSelector((state) => state[MODULE_AUTH]);

  //State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userSystemObjectFunctions, setUserSystemObjectFunctions] = useState(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  //State for column values
  const [systemObjectOperationRcdOptions, setSystemObjectOperationRcdOptions] =
    useState([]);
  const [descriptionOptions, setDescriptionOptions] = useState([]);
  //State for search filter column
  const [searchTextColumn, setSearchTextColumn] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  //State filter column
  const [filterCounts, setFilterCounts] = useState({});
  //State for loading
  const [loading, setLoading] = useState(false);
  //State to track if we're filtering
  const [isFiltering, setIsFiltering] = useState(false);
  //State for checkbox selection
  const [checkedMap, setCheckedMap] = useState(new Map());
  const [selectedRowKeysTable, setSelectedRowKeysTable] = useState([]);

  //Get API
  const handleGetData = async (skip = "", top = "") => {
    setLoading(true);
    nProgress.start();
    try {
      const filterParts = [`User_name eq '${currentUser?.User_name}'`];

      // lọc Employee Number
      if (
        Array.isArray(filterEmployeeNumber) &&
        filterEmployeeNumber.length > 0
      ) {
        const filter = filterEmployeeNumber
          .map((val) =>
            typeof val === "number" || !isNaN(val)
              ? `employee_number eq ${val}`
              : `employee_number eq '${val}'`
          )
          .join(" or ");
        filterParts.push(`(${filter})`);
      }

      // lọc Employee Name
      if (Array.isArray(filterEmployeeName) && filterEmployeeName.length > 0) {
        const filter = filterEmployeeName
          .map((val) => `employee_name eq '${val}'`)
          .join(" or ");
        filterParts.push(`(${filter})`);
      }

      // lọc GrantRightsFlag
      if (filterGrantRights !== "all") {
        if (filterGrantRights === true || filterGrantRights === false) {
          filterParts.push(`GrantRightsFlag eq ${filterGrantRights}`);
        }
      }

      // lọc theo selectedFunctions
      if (Array.isArray(selectedFunctions) && selectedFunctions.length > 0) {
        const funcFilter = buildSelectedFunctionsFilter(selectedFunctions);
        if (funcFilter) {
          filterParts.push(funcFilter);
        }
      }

      // lọc theo selectedRowKeys từ table trên
      if (Array.isArray(selectedRowKeys) && selectedRowKeys.length > 0) {
        const rowFilter = buildSelectedRowsFilter(selectedRowKeys);
        if (rowFilter) {
          filterParts.push(rowFilter);
        }
      }

      const filter = filterParts.join(" and ");

      const userSystemObjectFunctions = await getItemsService(
        lists.UserFunctions,
        {
          filter,
          top,
          skip,
        }
      );

      const dataWithKey = userSystemObjectFunctions.value.map(
        (item, index) => ({
          ...item,
          key: `user-${index}`,
        })
      );

      //console.log("first", userSystemObjectFunctions.value);
      setUserSystemObjectFunctions(dataWithKey);

      // Chỉ cập nhật options khi không đang filter để giữ nguyên filter state
      if (!isFiltering) {
        setSystemObjectOperationRcdOptions(
          getUniqueOptions(dataWithKey, "SystemObjectOperationRcd")
        );
        setDescriptionOptions(getUniqueOptions(dataWithKey, "Description"));
      }

      return userSystemObjectFunctions;
    } catch (error) {
      handleError(error);
    } finally {
      nProgress.done();
      setLoading(false);
    }
  };

  useEffect(() => {
    // Chỉ reset filter khi tableKey thay đổi (reload table)
    if (tableKey) {
      resetFilters();
      handleGetData();
    }
  }, [tableKey]);

  // useEffect riêng cho việc filter data
  useEffect(() => {
    // Chỉ gọi handleGetData khi có thay đổi filter thực sự và đã có tableKey
    // Không gọi khi selectedRowKeys thay đổi để tránh mất selection
    if (tableKey && (isFiltering || selectedFunctions.length > 0)) {
      setIsFiltering(true);
      handleGetData();
    }
  }, [
    selectedFunctions,
    filterEmployeeNumber,
    filterEmployeeName,
    filterGrantRights,
    // Bỏ selectedRowKeys và selectedTableData ra khỏi dependencies
  ]);

  const columns = [
    {
      title: "Employee Number",
      dataIndex: "employee_number",
      key: "employee_number",
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      key: "employee_name",
    },
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
      dataIndex: "SystemObjectOperationRcd",
      key: "SystemObjectOperationRcd",
      ...ColumnFilterComponent({
        dataIndex: "SystemObjectOperationRcd",
        placeholder: "Function Name",
        searchTextColumn,
        setSearchTextColumn,
        searchedColumn,
        setSearchedColumn,
        options: systemObjectOperationRcdOptions,
        filterCounts,
        setFilterCounts,
        dataSource: userSystemObjectFunctions,
      }),
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      ...ColumnFilterComponent({
        dataIndex: "Description",
        placeholder: "Description",
        searchTextColumn,
        setSearchTextColumn,
        searchedColumn,
        setSearchedColumn,
        options: descriptionOptions,
        filterCounts,
        setFilterCounts,
        dataSource: userSystemObjectFunctions,
      }),
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
    },
  ];

  //Function
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Function to reset filters
  const resetFilters = () => {
    setSearchTextColumn("");
    setSearchedColumn("");
    setFilterCounts({});
    setIsFiltering(false);
  };

  const getUniqueOptions = (data, field) => {
    //Lấy value duy nhất của trường
    const unique = [
      ...new Set(data.map((item) => item[field]).filter(Boolean)),
    ];
    return unique.map((value) => ({
      label: String(value),
      value: value,
    }));
  };

  //function filter table
  const buildSelectedFunctionsFilter = (selectedFunctions) => {
    if (!Array.isArray(selectedFunctions) || selectedFunctions.length === 0) {
      return "";
    }

    const operationSet = new Set();
    const objectSet = new Set();

    selectedFunctions.forEach((func) => {
      const key = func?.key;
      if (key?.startsWith("func-")) {
        const parts = key.split("-");
        if (parts.length >= 3) {
          const operation = parts[1];
          const object = parts.slice(2).join("-");

          if (operation) operationSet.add(operation);
          if (object) objectSet.add(object);
        }
      }
    });

    const operationFilters = Array.from(operationSet).map(
      (op) => `SystemObjectOperationRcd eq '${op}'`
    );
    const objectFilters = Array.from(objectSet).map(
      (obj) => `SystemObjectRcd eq '${obj}'`
    );

    const combinedOperation = operationFilters.length
      ? `(${operationFilters.join(" or ")})`
      : "";
    const combinedObject = objectFilters.length
      ? `(${objectFilters.join(" or ")})`
      : "";

    if (combinedOperation && combinedObject) {
      return `${combinedOperation} and ${combinedObject}`;
    } else {
      return combinedOperation || combinedObject;
    }
  };

  //function filter table theo selectedRowKeys
  const buildSelectedRowsFilter = (selectedRowKeys) => {
    if (!Array.isArray(selectedRowKeys) || selectedRowKeys.length === 0) {
      return "";
    }

    // Sử dụng selectedTableData để tạo filter chính xác
    if (!Array.isArray(selectedTableData) || selectedTableData.length === 0) {
      return "";
    }

    // Tạo filter dựa trên SystemObjectRcd và SystemObjectOperationRcd từ selectedTableData
    const objectFilters = [];
    const operationFilters = [];

    selectedTableData.forEach(item => {
      if (item.SystemObjectRcd) {
        objectFilters.push(`SystemObjectRcd eq '${item.SystemObjectRcd}'`);
      }
      if (item.SystemObjectOperationRcd) {
        operationFilters.push(`SystemObjectOperationRcd eq '${item.SystemObjectOperationRcd}'`);
      }
    });

    const combinedOperation = operationFilters.length
      ? `(${operationFilters.join(" or ")})`
      : "";
    const combinedObject = objectFilters.length
      ? `(${objectFilters.join(" or ")})`
      : "";

    if (combinedOperation && combinedObject) {
      return `${combinedOperation} and ${combinedObject}`;
    } else {
      return combinedOperation || combinedObject;
    }
  };

  // Xử lý filter data mà không cần reload table
  const getFilteredData = () => {
    let filteredData = userSystemObjectFunctions;

    // Filter theo selectedRowKeys nếu có
    if (selectedRowKeys && selectedRowKeys.length > 0 && selectedTableData && selectedTableData.length > 0) {
      // Tạo filter logic để lọc data hiện tại thay vì gọi API
      const objectSet = new Set(selectedTableData.map(item => item.SystemObjectRcd));
      const operationSet = new Set(selectedTableData.map(item => item.SystemObjectOperationRcd));

      filteredData = filteredData.filter(item =>
        objectSet.has(item.SystemObjectRcd) && operationSet.has(item.SystemObjectOperationRcd)
      );
    }

    return filteredData;
  };

  // Handle checkbox selection change
  const handleSelectionChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeysTable(newSelectedRowKeys);

    // Tạo checkedMap tương tự như trong UserPermissionDetails
    const newCheckedMap = new Map();
    newSelectedRows.forEach((row) => {
      newCheckedMap.set(row.key, {
        keys: [row.key],
        rows: [row],
      });
    });
    setCheckedMap(newCheckedMap);

    // Gọi callback để truyền data lên parent
    // Truyền cả checkedMap và selectedRows để parent có thể truy cập employee data
    if (onSelectedRowsChange) {
      onSelectedRowsChange(newCheckedMap, newSelectedRows);
    }
  };

  // Handle row click để chọn checkbox
  const handleRowClick = (record) => {
    const rowKey = record.key;

    if (rowKey) {
      const newSelectedRowKeys = selectedRowKeysTable.includes(rowKey)
        ? selectedRowKeysTable.filter(key => key !== rowKey) // Bỏ chọn nếu đã chọn
        : [...selectedRowKeysTable, rowKey]; // Thêm vào nếu chưa chọn

      // Tìm rows tương ứng với keys được chọn
      const newSelectedRows = getFilteredData().filter(item =>
        newSelectedRowKeys.includes(item.key)
      );

      // Gọi handleSelectionChange để cập nhật state
      handleSelectionChange(newSelectedRowKeys, newSelectedRows);
    }
  };

  // Xử lý selectedRowKeys từ parent mà không làm reload table
  useEffect(() => {
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      // Chỉ cập nhật filter logic mà không gọi API
      // Không cần gọi handleGetData() ở đây
    }
  }, [selectedRowKeys]);

  return (
    <>
      <Modal
        title="Related Users"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        <UsersPermissionDetails></UsersPermissionDetails>
      </Modal>
      <Table
        key={tableKey}
        loading={loading}
        columns={columns}
        dataSource={getFilteredData()}
        rowKey={"key"}
        rowSelection={{
          selectedRowKeys: selectedRowKeysTable,
          onChange: handleSelectionChange,
          preserveSelectedRowKeys: true,
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: {
            cursor: 'pointer'
          }
        })}
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
      />
    </>
  );
};

UsersFunctionTable.propTypes = propTypes;
export default UsersFunctionTable;

import React, { useEffect, useState } from "react";
import { Table, Space, Select, Typography } from "antd";
import nProgress from "nprogress";
import { getItemsService } from "../../common/services";
import lists from "../../common/lists";
import { formatEmployeeNumberManager, handleError } from "../../common/helpers";
import { useSelector } from "react-redux";
import { MODULE_AUTH } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import { ColumnFilterComponent } from "../tabComponents/ColumnFilterComponent";
import dayjs from "../../common/dayjs";
import { ReloadOutlined } from "@ant-design/icons";
import AsyncButton from "../../common/components/AsyncButton";

const { Title } = Typography;

const UsersTab = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state[MODULE_AUTH]);
  //State
  const [employeeOptions, setEmployeeOptions] = useState([]);

  //State for search filter column
  const [searchTextColumn, setSearchTextColumn] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  //State for column values
  const [employeeNumberOptions, setEmployeeNumberOptions] = useState([]);
  const [fullNameEmployeeOptions, setFullNameEmployeeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [jobTitleOptions, setJobTitleOptions] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [employeeNumberManagerOptions, setEmployeeNumberManagerOptions] =
    useState([]);
  const [fullNameManagerOptions, setFullNameManagerOptions] = useState([]);
  const [latestConfirmationOption, setLatestConfirmationOption] = useState([]);
  const [statusOption, setStatusOption] = useState([]);

  //State filter column
  const [filterCounts, setFilterCounts] = useState({});
  //State used reset
  const [tableKey, setTableKey] = useState(Date.now());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

      const dataWithKey = employeeDataWithConfirmationViews.value.map(
        (item, index) => ({
          ...item,
          key: `userOption-${index}`,
        })
      );

      setEmployeeOptions(dataWithKey);
      //console.log("first", dataWithKey);

      setEmployeeNumberOptions(
        getUniqueOptions(dataWithKey, "employee_number")
      );
      setFullNameEmployeeOptions(
        getUniqueOptions(dataWithKey, "employee_name")
      );
      setDepartmentOptions(getUniqueOptions(dataWithKey, "department"));
      setJobTitleOptions(getUniqueOptions(dataWithKey, "job_title"));
      setJobTypeOptions(getUniqueOptions(dataWithKey, "job_type"));
      setEmployeeNumberManagerOptions(
        getUniqueOptions(dataWithKey, "old_employee_id")
      );
      setFullNameManagerOptions(getUniqueOptions(dataWithKey, "manager_name"));
      setLatestConfirmationOption(
        getUniqueOptions(dataWithKey, "latest_confirmation")
      );
      setStatusOption(getUniqueOptions(dataWithKey, "status"));

      return employeeDataWithConfirmationViews;
    } catch (error) {
      handleError(error);
    } finally {
      nProgress.done();
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  const columns = [
    // {
    //   title: "ID User",
    //   dataIndex: "user_id",
    //   key: "user_id",
    //   render: () => null,
    //   onCell: () => ({ style: { display: "none" } }),
    //   onHeaderCell: () => ({ style: { display: "none" } }),
    // },
    {
      title: "ID",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Employee Number",
      dataIndex: "employee_number",
      key: "employee_number",
      ...ColumnFilterComponent({
        dataIndex: "employee_number",
        placeholder: "Employee Number",
        searchTextColumn,
        setSearchTextColumn,
        searchedColumn,
        setSearchedColumn,
        options: employeeNumberOptions,
        filterCounts,
        setFilterCounts,
        dataSource: employeeOptions,
      }),
    },
    {
      title: "Full Name Employee",
      dataIndex: "employee_name",
      key: "employee_name",
      ...ColumnFilterComponent({
        dataIndex: "employee_name",
        placeholder: "Full Name Employee",
        searchTextColumn,
        setSearchTextColumn,
        searchedColumn,
        setSearchedColumn,
        options: fullNameEmployeeOptions,
        filterCounts,
        setFilterCounts,
        dataSource: employeeOptions,
      }),
    },
    {
      title: "Department Name",
      dataIndex: "department",
      key: "department",
      ...ColumnFilterComponent({
        dataIndex: "department",
        placeholder: "Department Name",
        searchTextColumn,
        setSearchTextColumn,
        searchedColumn,
        setSearchedColumn,
        options: departmentOptions,
        filterCounts,
        setFilterCounts,
        dataSource: employeeOptions,
      }),
    },
    {
      title: "Job Title",
      dataIndex: "job_title",
      key: "job_title",
      ...ColumnFilterComponent({
        dataIndex: "job_title",
        placeholder: "Job Title",
        searchTextColumn,
        setSearchTextColumn,
        searchedColumn,
        setSearchedColumn,
        options: jobTitleOptions,
        filterCounts,
        setFilterCounts,
        dataSource: employeeOptions,
      }),
    },
    {
      title: "Job Type",
      dataIndex: "job_type",
      key: "job_type",
      ...ColumnFilterComponent({
        dataIndex: "job_type",
        placeholder: "Job Type",
        searchTextColumn,
        setSearchTextColumn,
        searchedColumn,
        setSearchedColumn,
        options: jobTypeOptions,
        filterCounts,
        setFilterCounts,
        dataSource: employeeOptions,
      }),
    },
    {
      title: "Employee Number Manager",
      dataIndex: "old_employee_id",
      key: "old_employee_id",
      ...ColumnFilterComponent({
        dataIndex: "old_employee_id",
        placeholder: "Employee Number Manager",
        searchTextColumn,
        setSearchTextColumn,
        searchedColumn,
        setSearchedColumn,
        options: employeeNumberManagerOptions.map((item) => ({
          ...item,
          label: formatEmployeeNumberManager(item.label),
        })),
        dataSource: employeeOptions,
      }),
    },
    {
      title: "Full Name Manager",
      dataIndex: "manager_name",
      key: "manager_name",
      ...ColumnFilterComponent({
        dataIndex: "manager_name",
        placeholder: "Full Name Manager",
        searchTextColumn,
        setSearchTextColumn,
        searchedColumn,
        setSearchedColumn,
        options: fullNameManagerOptions,
        filterCounts,
        setFilterCounts,
        dataSource: employeeOptions,
      }),
    },
    {
      title: "Last Status Time",
      dataIndex: "latest_confirmation",
      key: "latest_confirmation",
      ...ColumnFilterComponent({
        dataIndex: "latest_confirmation",
        placeholder: "Latest Confirmation",
        searchTextColumn,
        setSearchTextColumn,
        searchedColumn,
        setSearchedColumn,
        options: latestConfirmationOption.map((item) => ({
          ...item,
          label: dayjs(item.label).format("YYYY-MM-DD HH:mm A"),
        })),
        filterCounts,
        setFilterCounts,
        dataSource: employeeOptions,
      }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...ColumnFilterComponent({
        dataIndex: "status",
        placeholder: "Status",
        searchTextColumn,
        setSearchTextColumn,
        searchedColumn,
        setSearchedColumn,
        options: statusOption,
        filterCounts,
        setFilterCounts,
        dataSource: employeeOptions,
      }),
    },
    // {
    //   title: "Sex",
    //   dataIndex: "sex",
    //   key: "sex",
    //   render: (text) => (
    //     <Tag
    //       color={
    //         text === "Female"
    //           ? "#CE1257"
    //           : text === "Male"
    //           ? "#006EBA"
    //           : "orange"
    //       }
    //     >
    //       {text}
    //     </Tag>
    //   ),
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() =>
              navigate(`/mystaff/detail/${record.user_id}`, {
                state: { employeeData: record },
              })
            }
            style={{ cursor: "pointer", color: "#1677ff" }}
          >
            Details
          </a>
        </Space>
      ),
    },
  ];

  //Function
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

  const handleReload = async () => {
    setSearchTextColumn("");
    setSearchedColumn("");
    setFilterCounts({});

    await handleGetData();
    setTableKey(Date.now());
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={4}>Staff</Title>
        {/* <div className="float-right">
          <span className="pr-2 ">View as Employee:</span>
          <Select
            showSearch
            allowClear
            placeholder="Select an Employee"
            className="w-48"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: "1",
                label: "Jack",
              },
              {
                value: "2",
                label: "Lucy",
              },
              {
                value: "3",
                label: "Tom",
              },
            ]}
          /> */}
        <AsyncButton
          title="Reload Table"
          icon={<ReloadOutlined />}
          className="ms-2"
          type="primary"
          onClick={handleReload}
        ></AsyncButton>
        {/* </div> */}
      </div>

      <Table
        key={tableKey}
        columns={columns}
        dataSource={employeeOptions}
        rowKey="user_id"
        showSorterTooltip={{ target: "sorter-icon" }}
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

export default UsersTab;

import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Input, Select, Row, Col, Button } from "antd";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import dayjs from "../../common/dayjs";
import nProgress from "nprogress";
import { getItemsService } from "../../common/services";
import lists from "../../common/lists";
import { handleError } from "../../common/helpers";
import SPPagination from "../../common/components/SPPagination";
import { useUI } from "../../common/UIProvider";
const { Search } = Input;
const { Option } = Select;

const propTypes = {
  dataPermissionRequests: PropTypes.array,
  onRefresh: PropTypes.func,
  setDataPermissionRequests: PropTypes.func,
};

const MyApprovalTable = ({ dataPermissionRequests, onRefresh, setDataPermissionRequests }) => {
  const navigate = useNavigate();
  const ui = useUI();
  //State
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isInSearchMode, setIsInSearchMode] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);

  //Function
  const showDetails = (record) => {
    navigate(`/myrequest-approve/detail/${record.Id}`);
  };



  //Search API function
  const handleSearchRequester = async (searchValue) => {
    if (!searchValue.trim()) {
      setFilteredData(dataPermissionRequests);
      setSearchText(""); // Reset search text
      setIsInSearchMode(false);
      setCurrentFilter(null);
      return;
    }

    setIsSearching(true);
    setIsInSearchMode(true);
    setCurrentFilter({ type: 'search', value: searchValue });
    nProgress.start();
    try {
      const escapedSearchValue = searchValue.replace(/'/g, "''");
      // Use only startswith and contains - substringof is not supported in OData
      const filterQuery = `startswith(Requester,'${escapedSearchValue}') or contains(Requester,'${escapedSearchValue}')`;
      const searchResults = await getItemsService(lists.PermissionRequests, {
        filter: filterQuery,
        orderBy: "Id desc",
      });

      setFilteredData(searchResults.value || []);
    } catch (error) {
      handleError(error);
      setFilteredData([]);
    } finally {
      setIsSearching(false);
      nProgress.done();
    }
  };

  //Search API function with pagination
  const handleSearchWithPagination = async (skip, top) => {
    if (!currentFilter || currentFilter.type !== 'search') return { value: [] };

    const escapedSearchValue = currentFilter.value.replace(/'/g, "''");
    const filterQuery = `startswith(Requester,'${escapedSearchValue}') or contains(Requester,'${escapedSearchValue}')`;

    return await getItemsService(lists.PermissionRequests, {
      filter: filterQuery,
      orderBy: "Id desc",
      skip: skip,
      top: top,
    });
  };

  //Filter by status function
  const handleStatusFilter = async (value) => {
    setStatusFilter(value);

    if (value === "all") {
      // Reset to default data
      if (isInSearchMode) {
        // If in search mode, keep search results
        return;
      } else {
        setFilteredData(dataPermissionRequests);
        setCurrentFilter(null);
      }
    } else {
      // Apply status filter via API
      setIsSearching(true);
      setCurrentFilter({ type: 'status', value: value });
      nProgress.start();
      try {
        const filterQuery = `Status eq '${value}'`;
        const statusResults = await getItemsService(lists.PermissionRequests, {
          filter: filterQuery,
          orderBy: "Id desc",
        });
        setFilteredData(statusResults.value || []);
      } catch (error) {
        handleError(error);
        setFilteredData([]);
      } finally {
        setIsSearching(false);
        nProgress.done();
      }
    }
  };

  //Status filter API function with pagination
  const handleStatusWithPagination = async (skip, top) => {
    if (!currentFilter || currentFilter.type !== 'status') return { value: [] };

    const filterQuery = `Status eq '${currentFilter.value}'`;

    return await getItemsService(lists.PermissionRequests, {
      filter: filterQuery,
      orderBy: "Id desc",
      skip: skip,
      top: top,
    });
  };





  //Initialize filtered data with original data
  useEffect(() => {
    // Only update filtered data if not in search mode and no current filter
    if (!isInSearchMode && !currentFilter) {
      setFilteredData(dataPermissionRequests);
      // Reset filters when data changes (e.g., after refresh, navigation, pagination)
      if (dataPermissionRequests && dataPermissionRequests.length > 0) {
        setStatusFilter("all");
      }
    }
  }, [dataPermissionRequests, isInSearchMode, currentFilter]);

  const columns = [
    {
      title: "ID",
      dataIndex: "Id",
      key: "Id",
    },
    {
      title: "Requester",
      dataIndex: "Requester",
      key: "Requester",
    },
    {
      title: "Change Detail",
      dataIndex: "PermissionRequestDescription",
      key: "PermissionRequestDescription",
    },
    {
      title: "Created",
      dataIndex: "Created",
      key: "Created",
      render: (value) => dayjs(value).format("YYYY-MM-DD"),
    },
    {
      title: "Status",
      key: "Status",
      render: (_, { Status }) => {
        let color = "gold"; // Default for "Waiting for Approval"

        if (Status === "IT Process") {
          color = "processing";
        } else if (Status === "Complete") {
          color = "green";
        } else if (Status === "Rejected") {
          color = "volcano";
        }

        return <Tag color={color}>{Status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showDetails(record)}>Details</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={16} className="mb-4">
        <Col span={6} className="mr-10">
          <Search
            placeholder="Search Requester"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearchRequester}
            loading={isSearching}
            enterButton
          />
        </Col>

        <Col span={1} className="mt-1">
          <span>Status: </span>
        </Col>
        <Col span={3}>
          <Select
            placeholder="Filter by Status"
            value={statusFilter}
            onChange={handleStatusFilter}
            style={{ width: '100%' }}
            allowClear
          >
            <Option value="all">All Status</Option>
            <Option value="Waiting for Manager">Waiting for Manager</Option>
            <Option value="IT Process">IT Process</Option>
            <Option value="Complete">Complete</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
        </Col>


      </Row>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="Id"
        pagination={false}
      />
      <div className="flex justify-end mt-4">
        <SPPagination
          getItems={currentFilter ?
            (currentFilter.type === 'search' ? handleSearchWithPagination : handleStatusWithPagination) :
            onRefresh
          }
          setItems={currentFilter ? setFilteredData : setDataPermissionRequests}
          items={currentFilter ? filteredData : dataPermissionRequests}
          loading={ui.loading}
          setLoading={ui.setLoading}
        />
      </div>
    </>
  );
};

MyApprovalTable.propTypes = propTypes;
export default MyApprovalTable;

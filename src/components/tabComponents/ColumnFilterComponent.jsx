import { SearchOutlined } from "@ant-design/icons";
import { Button, Space, Select, Badge, Tag } from "antd";
import Highlighter from "react-highlight-words";
import React from "react";
import dayjs from "../../common/dayjs";
import { STATUS_CONFIRMATION } from "../../common/constant";

export const ColumnFilterComponent = ({
  dataIndex,
  placeholder,
  searchTextColumn,
  setSearchTextColumn,
  searchedColumn,
  setSearchedColumn,
  options = [],
  filterCounts,
  setFilterCounts,
  dataSource,
}) => {
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextColumn(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    confirm();
    setSearchTextColumn("");
    setFilterCounts?.((prev) => ({
      ...prev,
      [dataIndex]: {
        selectedValue: "",
      },
    }));
  };

  const formatValueParentheses = (value) => {
    if (typeof value !== "string" && typeof value !== "number") return "";
    const str = String(value);
    return str.includes("(") || str.includes(")")
      ? str.replace(/[()]/g, "")
      : str;
  };

  const renderGrantStatus = (value) => {
    if (typeof value === "boolean") {
      return (
        <Tag color={value ? "green" : "volcano"}>
          {value ? "GRANT" : "NOT GRANT"}
        </Tag>
      );
    }
    return "";
  };

  const renderGrantRightsFlag = (value) => {
    if (typeof value === "boolean") {
      return (
        <Tag color={value ? "green" : "volcano"}>
          {value ? "GRANT" : "NOT GRANT"}
        </Tag>
      );
    }
    return "";
  };

  const statusDisplayMap = Object.fromEntries(
    STATUS_CONFIRMATION.map((item) => [item.key, item.display_name])
  );

  const mappedOptions = options.map((opt) => ({
    ...opt,
    label: statusDisplayMap[opt.value] || opt.label,
  }));

  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: "block" }}
          showSearch
          placeholder={`Select ${placeholder}`}
          allowClear
          value={selectedKeys.length ? selectedKeys[0] : undefined}
          onChange={(value) => {
            const keys = value !== undefined ? [value] : [];
            setSelectedKeys(keys);
            setFilterCounts?.((prev) => ({
              ...prev,
              [dataIndex]: {
                selectedValue: value,
              },
            }));
          }}
          options={mappedOptions}
          filterOption={(input, option) =>
            String(option?.label ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(selectedKeys, confirm, dataIndex);
            }
          }}
        />

        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>

          <Button
            onClick={() => handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => {
      const selectedValue = String(
        filterCounts?.[dataIndex]?.selectedValue ?? ""
      ).toLowerCase();

      const matchCount = dataSource?.filter((item) => {
        const cellValue = String(item?.[dataIndex] ?? "").toLowerCase();
        return cellValue.includes(selectedValue);
      }).length;

      return selectedValue ? (
        <Badge count={matchCount} size="small" color="#D62C3E" offset={[2, -2]}>
          <SearchOutlined
            title={`Search ${placeholder}`}
            style={{ color: filtered ? "#1890ff" : undefined }}
          />
        </Badge>
      ) : (
        <SearchOutlined
          title={`Search ${placeholder}`}
          style={{ color: filtered ? "#1890ff" : undefined }}
        />
      );
    },
    onFilter: (value, record) => record[dataIndex] === value,

    render: (text, record) => {
      const isFunctionNameColumn = dataIndex === "SystemObjectOperationRcd";

      const valueToRender = isFunctionNameColumn
        ? record?.Title || record?.SystemObjectOperationRcd
        : text;

      //👇Dùng renderGrantStatus nếu có boolean
      if (
        valueToRender &&
        typeof valueToRender === "object" &&
        "status" in valueToRender
      ) {
        const grantStatus = renderGrantStatus(valueToRender.status);
        if (grantStatus !== null) return grantStatus;
      }

      const grantStatus = renderGrantRightsFlag(valueToRender);
      if (typeof valueToRender === "boolean") return grantStatus;

      //👇Dùng formatValueParentheses nếu có "(...)"
      const rawValue =
        typeof valueToRender === "string" || typeof valueToRender === "number"
          ? formatValueParentheses(valueToRender)
          : "";

      const isIsoDate =
        typeof rawValue === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(rawValue);

      //👇Dùng formattedDate nếu có time
      const formattedDate =
        isIsoDate && dayjs(rawValue).isValid()
          ? dayjs(rawValue).format("YYYY-MM-DD HH:mm A")
          : String(rawValue);

      const formattedSearch =
        isIsoDate && dayjs(searchTextColumn).isValid()
          ? dayjs(searchTextColumn).format("YYYY-MM-DD HH:mm A")
          : String(searchTextColumn);

      //👇Dùng tagColorMap nếu có 3 status
      const tagColorMap = {
        STATUS_COMPLETE: "green",
        STATUS_PENDING_INCOMPLETE_REQUEST: "gold",
        "Review Needed": "volcano",
      };

      const statusDisplayMap = Object.fromEntries(
        STATUS_CONFIRMATION.map((item) => [item.key, item.display_name])
      );

      const tagColor = tagColorMap[rawValue] || "silver";
      const displayText = statusDisplayMap[rawValue] || rawValue;

      if (Object.prototype.hasOwnProperty.call(tagColorMap, rawValue)) {
        return <Tag color={tagColor}>{displayText}</Tag>;
      }
      // if (rawValue) {
      //   const tagColor = tagColorMap[rawValue] || "silver";
      //   return <Tag color={tagColor}>{rawValue}</Tag>;
      // }

      return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[formattedSearch]}
          autoEscape
          textToHighlight={formattedDate}
        />
      ) : (
        formattedDate
      );
    },
  };
};

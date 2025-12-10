import React, { useMemo, useState } from "react";
import { Input, Transfer, Tree } from "antd";
import PropTypes from "prop-types";

const propTypes = {
  treeData: PropTypes.array,
  value: PropTypes.array,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  dataSystemObjectFunctions: PropTypes.array,
};

const flattenTreeData = (
  treeNodes = [],
  selectedKeys = [],
  dataSource = []
) => {
  const flatList = [];

  const loop = (nodes) => {
    nodes.forEach((node) => {
      if (node.children) {
        loop(node.children);
      } else {
        flatList.push({
          key: node.key,
          title: node.label,
        });
      }
    });
  };

  loop(treeNodes);

  // Thêm key chưa có trong treeData
  selectedKeys.forEach((key) => {
    if (!flatList.some((item) => item.key === key)) {
      // Dò ngược từ dataSystemObjectFunctions
      const match = dataSource.find((f) => {
        const generatedKey = `func-${f.SystemObjectOperationRcd}-${f.SystemObjectRcd}`;
        return generatedKey === key || f.key === key;
      });

      flatList.push({
        key,
        title:
          match?.Title?.trim() ||
          match?.SystemObjectOperationRcd?.trim() ||
          key, // fallback cuối
      });
    }
  });

  return flatList;
};

const TreeTransferComponent = ({
  treeData = [],
  value = [],
  onChange,
  disabled = false,
  dataSystemObjectFunctions = [],
}) => {
  const transferData = useMemo(
    () => flattenTreeData(treeData, value, dataSystemObjectFunctions),
    [treeData, value, dataSystemObjectFunctions]
  );
  const [searchText, setSearchText] = useState("");

  const filteredTreeData = useMemo(() => {
    if (!searchText) return treeData;
    const filter = (nodes) => {
      return nodes
        .map((node) => {
          const match = (node.title || node.label || "")
            .toLowerCase()
            .includes(searchText.toLowerCase());

          if (node.children) {
            const filteredChildren = filter(node.children);
            if (match || filteredChildren.length) {
              return {
                ...node,
                children: filteredChildren,
              };
            }
          } else if (match) {
            return node;
          }

          return null;
        })
        .filter(Boolean);
    };
    return filter(treeData);
  }, [treeData, searchText]);

  return (
    <Transfer
      disabled={disabled}
      dataSource={transferData}
      targetKeys={value}
      onChange={(nextTargetKeys) => {
        onChange(nextTargetKeys);
      }}
      render={(item) => item.title}
      showSelectAll={false}
      titles={["Available", "Selected"]}
      listStyle={{
        height: 340,
        overflow: "auto",
      }}
      filterOption={(inputValue, item) =>
        item.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      }
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === "left") {
          const generateTree = (nodes) =>
            nodes.map((node) => {
              if (node.children) {
                return {
                  title: node.label,
                  key: node.key,
                  children: generateTree(node.children),
                  disabled: node.disabled,
                };
              }
              return {
                title: node.label,
                key: node.key,
                isLeaf: node.isLeaf,
                disabled: value.includes(node.key),
              };
            });

          return (
            <>
              <Input
                disabled={disabled}
                placeholder="Search functions"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 8 }}
              />
              <Tree
                blockNode
                checkable
                selectable={false}
                checkedKeys={selectedKeys}
                treeData={generateTree(filteredTreeData)}
                onCheck={(keys, { checkedNodes }) => {
                  const checkedLeafKeys = checkedNodes
                    .filter((n) => n.isLeaf)
                    .map((n) => n.key);

                  checkedLeafKeys.forEach((key) => {
                    onItemSelect?.(key, true);
                  });
                }}
                style={{ overflowY: "auto", height: "100%" }}
              />
            </>
          );
        }
        return null;
      }}
    </Transfer>
  );
};

TreeTransferComponent.propTypes = propTypes;
export default TreeTransferComponent;

import React, { useMemo } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import PropTypes from "prop-types";

const propTypes = {
  dataSystemObjectCategoryVisible: PropTypes.array,
  dataSystemObjectVisible: PropTypes.array,
  dataSystemObjectFunctions: PropTypes.array,
  onSelectTreeNode: PropTypes.func,
  searchText: PropTypes.string,
  selectedKeys: PropTypes.array,
};

const PermissionTree = ({
  dataSystemObjectCategoryVisible,
  dataSystemObjectVisible,
  dataSystemObjectFunctions,
  onSelectTreeNode,
  searchText,
  selectedKeys,
}) => {
  const buildTreeData = () => {
    if (
      !Array.isArray(dataSystemObjectCategoryVisible) ||
      !Array.isArray(dataSystemObjectVisible) ||
      !Array.isArray(dataSystemObjectFunctions)
    ) {
      return [];
    }

    const allObjectNodes = [];

    const tree = dataSystemObjectCategoryVisible.map((category) => {
      const categoryKey = category.SystemObjectCategoryRcd;
      const categoryTitle =
        category?.NameL || category?.NameE || "Unnamed Category";

      const relatedObjects = dataSystemObjectVisible.filter(
        (obj) => obj.SystemObjectCategoryRcd === categoryKey
      );

      const objectNodeMap = {};
      const rootObjectNodes = [];

      relatedObjects.forEach((obj) => {
        const objectKey = obj.SystemObjectRcd;
        const objectTitle =
          obj.SystemObjectNameE || obj.SystemObjectName || "Unnamed Object";
        const cateTitle = obj.SystemObjectCategoryName;
        const keyStruct = obj.KeyStruct;

        const funcChildren = dataSystemObjectFunctions
          .filter((func) => func.SystemObjectRcd === objectKey)
          .map((func) => ({
            ...func,
            title:
              func.Title || func.SystemObjectOperationRcd || "Unnamed Function",
            key: `func-${func.SystemObjectOperationRcd}-${objectKey}`,
            status: func.GrantRightsFlag,
            isLeaf: true,
            description: func.Description,
            titleEdit: func.Title,
            systemObjectRcd: func.SystemObjectRcd,
            disabled: true,
            selectable: false,
          }))
          .sort((a, b) =>
            (a.title || "").localeCompare(b.title || "", undefined, {
              sensitivity: "base",
            })
          );

        objectNodeMap[objectKey] = {
          title: objectTitle,
          titleCate: cateTitle,
          keyStruct: keyStruct,
          key: `obj-${objectKey}`,
          SystemObjectRcd: objectKey,
          children: funcChildren,
        };
      });

      relatedObjects.forEach((obj) => {
        const objectKey = obj.SystemObjectRcd;
        const parentKey = obj.ParentSystemObjectRcd;

        const isRootObject =
          obj.KeyStruct === null && obj.SystemObjectCategoryRcd === categoryKey;

        if (!isRootObject && parentKey && objectNodeMap[parentKey]) {
          const parentNode = objectNodeMap[parentKey];
          if (!Array.isArray(parentNode.children)) parentNode.children = [];
          parentNode.children.push(objectNodeMap[objectKey]);
        } else if (isRootObject) {
          rootObjectNodes.push(objectNodeMap[objectKey]);
        }
      });

      const sortNodes = (nodes) => {
        nodes.sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );
        nodes.forEach((node) => {
          if (node.children && node.children.length > 0) {
            sortNodes(node.children);
          }
        });
      };

      sortNodes(rootObjectNodes);

      return {
        title: categoryTitle,
        key: `cat-${categoryKey}`,
        children: rootObjectNodes,
      };
    });

    tree.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
    );

    // Thêm node "All Objects" vào đầu tree
    tree.unshift({
      title: "All Objects",
      key: `cat-All`,
      children: allObjectNodes,
    });

    return tree;
  };

  const filterTreeBySearchText = (nodes, search) => {
    if (!search) return nodes;

    const matches = (text) =>
      text?.toLowerCase().includes(search.toLowerCase());

    const filterNodes = (nodeList) => {
      return nodeList
        .map((node) => {
          if (matches(node.title)) return node;

          if (node.children) {
            const filteredChildren = filterNodes(node.children);
            if (filteredChildren.length > 0) {
              return { ...node, children: filteredChildren };
            }
          }

          return null;
        })
        .filter((node) => node !== null);
    };

    return filterNodes(nodes);
  };

  const treeData = useMemo(() => {
    const fullTree = buildTreeData();
    return filterTreeBySearchText(fullTree, searchText);
  }, [
    dataSystemObjectCategoryVisible,
    dataSystemObjectVisible,
    dataSystemObjectFunctions,
    searchText,
  ]);

  const onSelect = (selectedKeys, info) => {
    //console.log("✅ Selected:", info);
    if (onSelectTreeNode) {
      onSelectTreeNode(selectedKeys, info);
    }
  };

  return (
    <Tree
      className="custom-permission-tree"
      showLine
      switcherIcon={<DownOutlined />}
      defaultExpandAll
      onSelect={onSelect}
      treeData={treeData}
      style={{ maxHeight: "700px", overflowY: "auto" }}
      selectedKeys={selectedKeys}
    />
  );
};

PermissionTree.propTypes = propTypes;
export default PermissionTree;

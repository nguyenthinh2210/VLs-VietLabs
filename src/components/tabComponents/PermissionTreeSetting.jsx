import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckOutlined, DownOutlined } from "@ant-design/icons";
import { Descriptions, Tree } from "antd";
import nProgress from "nprogress";
import lists from "../../common/lists";
import { addListItemService, getItemsService } from "../../common/services";
import { handleError } from "../../common/helpers";
import { useUI } from "../../common/UIProvider";
import PropTypes from "prop-types";
import AsyncButton from "../../common/components/AsyncButton";

const propTypes = {
  onSelectTreeNode: PropTypes.func,
  searchText: PropTypes.string,
  selectedKeys: PropTypes.array,
};

const PermissionTreeSetting = ({
  searchText,
  onSelectTreeNode,
  selectedKeys,
}) => {
  const ui = useUI();

  //State
  const [dataSystemObjectCategories, setDataSystemObjectCategories] = useState(
    []
  );
  const [dataSystemObjects, setDataSystemObjects] = useState([]);
  const [dataSystemObjectFunctions, setDataSystemObjectFunctions] = useState(
    []
  );
  const [checkedKeys, setCheckedKeys] = useState([]);
  //State result
  const [checkedResult, setCheckedResult] = useState([]);
  const [uncheckedResult, setUncheckedResult] = useState([]);

  //Get API
  const handleGetData = async (skip = "", top = "") => {
    nProgress.start();
    try {
      const [systemObjectCategories, systemObjects, systemObjectFunctions] =
        await Promise.all([
          getItemsService(lists.SystemObjectCategories, {
            top: top,
            skip: skip,
          }),
          getItemsService(lists.SystemObjects, { top: top, skip: skip }),
          getItemsService(lists.SystemObjectFunctions, {
            top: top,
            skip: skip,
          }),
        ]);

      setDataSystemObjectCategories(systemObjectCategories.value);
      setDataSystemObjects(systemObjects.value);
      setDataSystemObjectFunctions(systemObjectFunctions.value);
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

  // useEffect(() => {
  //   if (dataSystemObjectNCategoryConfig.length > 0) {
  //     console.log(
  //       "🟢 objectRcd: ",
  //       dataSystemObjectNCategoryConfig[0]?.objectRcd
  //     );
  //     console.log(
  //       "🟢 categoryRcd: ",
  //       dataSystemObjectNCategoryConfig[0]?.categoryRcd
  //     );
  //     console.log(
  //       "🟢 dataSystemObjectNCategoryConfig: ",
  //       dataSystemObjectNCategoryConfig
  //     );
  //   }
  // }, [dataSystemObjectNCategoryConfig]);

  //Function
  const buildTreeData = () => {
    if (
      !Array.isArray(dataSystemObjectCategories) ||
      !Array.isArray(dataSystemObjects) ||
      !Array.isArray(dataSystemObjectFunctions)
    ) {
      return [];
    }

    const tree = dataSystemObjectCategories.map((category) => {
      const categoryKey = category.SystemObjectCategoryRcd;
      const categoryTitle =
        category?.NameL || category?.NameE || "Unnamed Category";

      const relatedObjects = dataSystemObjects.filter(
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
            title:
              func?.Title || func?.ObjectOperationRcd || "Unnamed Function",
            key: `func-${func?.ObjectOperationRcd}-${objectKey}`,
            objectRcd: objectKey,
            mappingActiveStatus: func.MappingActiveStatus,
            isLeaf: true,
            description: func.Description,
            disabled: true,
            titleEdit: func?.Title,
            nameFunction: func?.ObjectOperationRcd,
          }))
          .sort((a, b) =>
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
          );

        objectNodeMap[objectKey] = {
          title: objectTitle,
          titleCate: cateTitle,
          keyStruct: keyStruct,
          key: `obj-${objectKey}`,
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
    dataSystemObjectCategories,
    dataSystemObjects,
    dataSystemObjectFunctions,
    searchText,
  ]);

  const isFirstCheck = useRef(true);

  const onCheck = (checkedInfo, info) => {
    const rawChecked = checkedInfo.checked;
    // console.log(
    //   "Bạn vừa",
    //   info.checked ? "CHECK" : "UNCHECK",
    //   "node:",
    //   info.node.key
    // );
    // console.log(" Tất cả checked hiện tại:", rawChecked);
    setCheckedKeys(rawChecked);
    const result = preparePostData([info.node.key], info.checked);

    const mergeWithoutDuplicate = (prev, current) => {
      const map = new Map();
      prev.forEach((item) => {
        const key = item.ObjectRcd || item.CategoryRcd;
        map.set(key, item);
      });
      current.forEach((item) => {
        const key = item.ObjectRcd || item.CategoryRcd;
        map.set(key, item);
      });
      return Array.from(map.values());
    };

    if (info.checked) {
      setCheckedResult((prev) => mergeWithoutDuplicate(prev, result));
    } else {
      setUncheckedResult((prev) => mergeWithoutDuplicate(prev, result));
    }
  };

  const onSelect = (selectedKeys, info) => {
    //console.log("✅ Selected:", selectedKeys, info);
    if (onSelectTreeNode) {
      onSelectTreeNode(selectedKeys, info);
    }
  };

  //Format data onCheck
  const preparePostData = (dataList, checked) => {
    return dataList
      .map((item) => {
        const base = {
          ActiveStatus: checked ? true : false,
          Created: new Date().toISOString(),
          Modified: new Date().toISOString(),
        };

        if (item.startsWith("obj-")) {
          return {
            ...base,
            ObjectRcd: item.replace("obj-", ""),
            CategoryRcd: null,
          };
        }

        if (item.startsWith("cat-")) {
          return {
            ...base,
            CategoryRcd: item.replace("cat-", ""),
            ObjectRcd: null,
          };
        }

        // Bỏ qua nếu không khớp
        return null;
      })
      .filter((item) => item !== null);
  };

  // Hàm cập nhật trạng thái visible dựa trên các node được chọn
  const handleApplyChanges = async () => {
    // console.log("✅ Final rechecked payload:", checkedResult);
    // console.log("❌ Final unchecked payload:", uncheckedResult);
    if (checkedResult.length === 0 && uncheckedResult.length === 0) return;

    try {
      const result = checkedResult.length > 0 ? checkedResult : uncheckedResult;

      //console.log("result", result);

      await addListItemService(lists.SystemObjectNCategoryConfig, result);
      ui.notiSuccess("Visibility Updated Successfully");
    } catch (error) {
      ui.notiError("Failure");
      handleError(error);
    }
  };

  //Check initial checked keys
  const getInitialCheckedKeys = () => {
    const checkedKeys = [];

    dataSystemObjectCategories.forEach((cat) => {
      if (cat.MappingActiveStatus === true) {
        checkedKeys.push(`cat-${cat.SystemObjectCategoryRcd}`);
      }
    });

    dataSystemObjects.forEach((obj) => {
      if (obj.MappingActiveStatus === true) {
        checkedKeys.push(`obj-${obj.SystemObjectRcd}`);
      }
    });

    dataSystemObjectFunctions.forEach((func) => {
      if (func.MappingActiveStatus === true) {
        checkedKeys.push(
          `func-${func.ObjectOperationRcd}-${func.SystemObjectRcd}`
        );
      }
    });

    return checkedKeys;
  };

  // Cập nhật checkedKeys ngay khi treeData thay đổi
  useEffect(() => {
    if (
      dataSystemObjectCategories.length > 0 &&
      dataSystemObjects.length > 0 &&
      isFirstCheck.current
    ) {
      const initialKeys = getInitialCheckedKeys();
      setCheckedKeys(initialKeys);
      isFirstCheck.current = false;
    }
  }, [dataSystemObjectCategories, dataSystemObjects, treeData]);

  return (
    <>
      <AsyncButton
        icon={<CheckOutlined />}
        type="default"
        variant="solid"
        className="mb-2"
        disabled={checkedResult.length === 0 && uncheckedResult.length === 0}
        onClick={handleApplyChanges}
      >
        Apply Changes
      </AsyncButton>

      <Tree
        className="custom-permission-tree"
        checkable
        checkStrictly={true} // Cho phép kiểm soát thủ công node
        style={{ maxHeight: "650px", overflowY: "auto" }}
        treeData={treeData}
        switcherIcon={<DownOutlined />}
        onSelect={onSelect}
        onCheck={onCheck}
        checkedKeys={{ checked: checkedKeys, halfChecked: [] }}
        selectedKeys={selectedKeys}
      />
    </>
  );
};

PermissionTreeSetting.propTypes = propTypes;
export default PermissionTreeSetting;

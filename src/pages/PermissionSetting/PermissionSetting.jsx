import { useState } from "react";
import { Card, Typography, Row, Col, Input } from "antd";
import FunctionPropertiesTable from "../../components/tabComponents/FunctionSettingTable";
import PermissionTreeSetting from "../../components/tabComponents/PermissionTreeSetting";

const { Title } = Typography;
const { Search } = Input;

export default function PermissionSetting() {
  //State
  const [searchText, setSearchText] = useState("");
  const [selectedInfoTree, setSelectedInfoTree] = useState({});
  const [selectedFunctions, setSelectedFunctions] = useState([]);
  //State highlight
  const [selectedTreeKeys, setSelectedTreeKeys] = useState(["cat-All"]);

  //Function
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

  const handleUpdateFunction = (updatedFunc) => {
    setSelectedFunctions((prev) =>
      prev.map((func) =>
        func.key === updatedFunc.key ? { ...func, ...updatedFunc } : func
      )
    );
  };

  return (
    <>
      <Title level={2}>Permission Setting</Title>
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
            <PermissionTreeSetting
              onSelectTreeNode={handleTreeSelect}
              searchText={searchText}
              selectedKeys={selectedTreeKeys}
            ></PermissionTreeSetting>
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
            <FunctionPropertiesTable
              selectedFunctions={selectedFunctions}
              onUpdateFunction={handleUpdateFunction}
            ></FunctionPropertiesTable>
          </Col>
        </Row>
      </Card>
    </>
  );
}

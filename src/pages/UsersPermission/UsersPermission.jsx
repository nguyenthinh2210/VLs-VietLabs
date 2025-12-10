import { useState } from "react";
import {
  AppstoreOutlined,
  AuditOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { Card, Select, Typography, Input, Row, Col, Segmented } from "antd";
import UserPermissionTab from "../../components/tabs/UserPermissionTab";
import UsersTab from "../../components/tabs/UsersTab";

const { Title } = Typography;
const { Search } = Input;

export default function UsersPermission() {
  const [selectedTab, setSelectedTab] = useState("Staff"); // Default to "Users"

  return (
    <>
      <Title level={2}>My Staff</Title>
      <Row align="middle" gutter={16} style={{ marginBottom: 5 }}>
        <Col>
          <Title level={5} style={{ margin: 0 }}>
            View by
          </Title>
        </Col>
        <Col>
          <Segmented
            options={[
              { label: "Staff", value: "Staff", icon: <BarsOutlined /> },
              {
                label: "Permission",
                value: "Permission",
                icon: <AuditOutlined />,
              },
            ]}
            value={selectedTab}
            onChange={setSelectedTab}
          />
        </Col>
      </Row>
      <Card
        style={{
          width: "100%",
          minHeight: "calc(100vh - 180px)",
        }}
      >
        {selectedTab === "Staff" ? (
          <>
            <UsersTab></UsersTab>
          </>
        ) : (
          <>
            <UserPermissionTab />
          </>
        )}
      </Card>
    </>
  );
}

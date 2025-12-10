import React from "react";
import { Card, Col, Row, Typography } from "antd";
import PermissionTree from "../tabComponents/PermissionTree";
import ProfileTable from "../tabComponents/ProfileTable";

const { Title } = Typography;

const ProfileTab = () => {
  return (
    <>
      <Card>
        <Row>
          <Col span={6}>
            <Title level={4}>Permission tree</Title>
            <PermissionTree></PermissionTree>
          </Col>
          <Col span={2}></Col>
          <Col span={16}>
            {/* <Title level={4}>Profile list</Title> */}
            <ProfileTable></ProfileTable>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ProfileTab;

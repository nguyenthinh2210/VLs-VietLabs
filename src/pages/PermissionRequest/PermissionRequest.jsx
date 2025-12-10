import { useState } from "react";
import { FileDoneOutlined, FileUnknownOutlined } from "@ant-design/icons";
import { Card, Tabs, Typography } from "antd";
import MyRequestTab from "../../components/tabs/MyRequestTab";
import MyApprovalTab from "../../components/tabs/MyApprovalTab";

const { Title } = Typography;
const { TabPane } = Tabs;

export default function PermissionRequest() {
  const [selected, setSelected] = useState("Profile");

  const tabItems = [
    // {
    //   key: "Group",
    //   label: (
    //     <span>
    //       <FileUnknownOutlined /> My Request
    //     </span>
    //   ),
    //   children: <MyRequestTab mode="request" />,
    // },
    {
      key: "Profile",
      label: (
        <span>
          <FileDoneOutlined /> My Approval
        </span>
      ),
      children: <MyApprovalTab mode="approval" />,
    },
  ];

  return (
    <>
      <Title level={2}>My Request/Approve</Title>
      <Tabs activeKey={selected} onChange={setSelected} items={tabItems} />
    </>
  );
}

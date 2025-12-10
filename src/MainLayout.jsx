import React, { useState } from "react";
import { Layout, Menu, Button, theme, Image, Tooltip } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  UsergroupDeleteOutlined,
  SettingOutlined,
  LogoutOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { Outlet, Link } from "react-router-dom";
import logoFV from "./assets/FVH-Logo.png";
import avatar from "./assets/avatar.png";
import { useMsal } from "@azure/msal-react";
import { useAuth } from "./common/AuthProvider";
import config from "./common/config";
import { LOGIN_TYPES } from "./common/constant";
import { checkRole } from "./common/helpers";

const { Header, Sider, Content } = Layout;

const siderStyle = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  //scrollbarGutter: "stable",
};

const MainLayout = () => {
  const { instance, accounts } = useMsal();
  const { profile, logout, loginType } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const rawMenuItems = [
    {
      key: "/",
      icon: <UserOutlined />,
      label: <Link to="/mypermission">My Permission</Link>,
    },
    {
      key: "/mystaff",
      icon: <UsergroupDeleteOutlined />,
      label: <Link to="/mystaff">My Staff</Link>,
    },
    {
      key: "/myrequest-approve",
      icon: <FileDoneOutlined />,
      label: <Link to="/myrequest-approve">My Request/Approve</Link>,
      role: ["IT Admin"],
    },
    {
      key: "/permissionsetting",
      icon: <SettingOutlined />,
      label: <Link to="/permissionsetting">Permission Setting</Link>,
      role: ["IT Admin"], //["Manager", "IT Admin"]
    },
  ];

  //Function
  const userRoles = profile?.user?.role?.split(",") || [];

  const menuItems = rawMenuItems.filter(
    (item) => !item.role || checkRole(item.role, userRoles)
  );

  const flattenMenu = (items) => {
    let paths = [];
    items.forEach((item) => {
      paths.push(item.key);
      if (item.children) {
        paths = paths.concat(flattenMenu(item.children));
      }
    });
    return paths;
  };

  const allPaths = flattenMenu(menuItems);
  const findSelectedKey = (paths, pathname) => {
    let selectedKey = "/";
    for (const path of paths) {
      if (pathname.startsWith(path) && path.length > selectedKey.length) {
        selectedKey = path;
      }
    }
    return selectedKey;
  };
  const selectedKey = findSelectedKey(allPaths, location.pathname) || "/";

  const logoutRequest = {
    account: instance.getAccountByHomeId(
      accounts.length > 0 ? accounts[0].homeAccountId : null
    ),
    postLogoutRedirectUri: `${window.location.origin}/login`,
    onRedirectNavigate: () => {
      localStorage.removeItem(config.LOCAL_PROFILE);
      localStorage.removeItem(config.LOCAL_AUTHENTICATED);
      localStorage.removeItem(config.LOCAL_ACCESS_TOKEN);
      localStorage.removeItem(config.LOCAL_REFRESH_TOKEN);
      localStorage.removeItem(config.LOCAL_LOGIN_TYPE);
      return true;
    },
  };

  const handleClickLogout = async () => {
    if (loginType === LOGIN_TYPES.OFFICE365) {
      await instance.logoutRedirect(logoutRequest);
    } else {
      await logout();
    }
  };

  return (
    <Layout>
      <Sider
        width={230}
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          ...siderStyle,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* Logo */}
        <div className="px-6 pt-4 pb-2">
          <Image
            preview={false}
            src={logoFV}
            style={{ cursor: "pointer", maxHeight: 50 }}
          />
        </div>

        {/* Menu */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[selectedKey]}
            items={menuItems}
          />
        </div>

        {/* Sidebar Account */}
        {collapsed ? (
          <>
            <img
              src={avatar}
              style={{
                width: "55%",
                height: "40px",
                position: "absolute",
                bottom: "45px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              alt="Avatar"
              loading="eager"
            />
            <Tooltip title="Logout" placement="right">
              <Button
                icon={<LogoutOutlined />}
                size="small"
                type="primary"
                onClick={handleClickLogout}
                style={{
                  width: "100%",
                  height: "35px",
                  position: "absolute",
                  bottom: "0px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  borderRadius: "10px",
                }}
              />
            </Tooltip>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "#d5f1f7",
              padding: "10px",
              width: "100%",
              position: "absolute",
              bottom: "0px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <img
              src={avatar}
              style={{ width: "60px", height: "60px" }}
              alt="Avatar"
              loading="eager"
            />
            <Link to="/profile">
              <div className="mt-2 fw-bold">
                {profile?.user?.employee_name} -{" "}
                {profile?.user?.employee_number}
              </div>
            </Link>

            <Button
              icon={<LogoutOutlined />}
              type="primary"
              size="small"
              onClick={handleClickLogout}
              style={{ width: "100%", marginTop: "10px" }}
            >
              Logout
            </Button>
            <div
              style={{
                fontSize: "0.7em",
                textAlign: "center",
                marginTop: "5px",
              }}
            >
              Last version:{" "}
              <span className="font-bold"> {config.LAST_VERSION}</span>
            </div>
          </div>
        )}
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}
        >
          <Outlet /> {/* This will display the selected page */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

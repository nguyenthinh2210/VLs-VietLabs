import React, { useState } from "react";
import { Layout, Menu, Button, theme, Image, Tooltip, Popover } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  UsergroupDeleteOutlined,
  SettingOutlined,
  LogoutOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Outlet, Link } from "react-router-dom";
import logoVLs from "./assets/LogoVLs.png";
import avatar from "./assets/avatar.png";
import tabbarLeft from "./assets/TabbarLeft.jpg";
import tabbarRight from "./assets/TabbarRight.jpg";
import documentIcon from "./assets/document.jpg";
import peopleIcon from "./assets/people.jpg";
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
      key: "/quotation-management",
      icon: <FileTextOutlined />,
      label: <Link to="/quotation-management">Quản lý báo giá</Link>,
    },
    {
      key: "/customer-management",
      icon: <UsergroupAddOutlined />,
      label: <Link to="/customer-management">Quản lý khách hàng</Link>,
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
          position: "relative",
        }}
      >
        {/* Background Tabbar Left */}
        <img
          src={tabbarLeft}
          alt="Tabbar Left"
          className="tabbar-left"
        />

        {/* Background Tabbar Right */}
        <img
          src={tabbarRight}
          alt="Tabbar Right"
          className="tabbar-right"
        />

        {/* Logo */}
        <div className="logo-container px-6 pt-4 pb-2">
          <Image
            preview={false}
            src={logoVLs}
            className="logo-image"
          />
        </div>

        {/* Menu */}
        <div className="menu-container">
          {/* Custom Menu Buttons */}
          <Tooltip title={collapsed ? "Quản lý báo giá" : ""} placement="right">
            <Link to="/quotation-management" className="menu-button-link">
              <div className={`menu-button ${collapsed ? "collapsed" : ""}`}>
                <img src={documentIcon} alt="Document" className="menu-button-icon" />
                {!collapsed && (
                  <span className="menu-button-text">Quản lý báo giá</span>
                )}
              </div>
            </Link>
          </Tooltip>

          <Tooltip title={collapsed ? "Quản lý khách hàng" : ""} placement="right">
            <Link to="/customer-management" className="menu-button-link">
              <div className={`menu-button ${collapsed ? "collapsed" : ""}`}>
                <img src={peopleIcon} alt="People" className="menu-button-icon" />
                {!collapsed && (
                  <span className="menu-button-text">Quản lý khách hàng</span>
                )}
              </div>
            </Link>
          </Tooltip>

          {/* Other Menu Items */}
          <div className="other-menu-items">
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={[selectedKey]}
              items={menuItems.filter(item => 
                item.key !== "/quotation-management" && item.key !== "/customer-management"
              )}
            />
          </div>
        </div>

        {/* Sidebar Version */}
        <div className="sidebar-version">
          <span className="sidebar-version-text">
            Last version: <span className="font-bold">{config.LAST_VERSION}</span>
          </span>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
          
          {/* Header Account Section */}
          <div className="header-account">
            <div className="header-account-info">
              <Link to="/quotation-management" style={{ textDecoration: "none" }}>
                <div className="header-account-name">Admin</div>
                <div className="header-account-email">admin@viet-labs.com</div>
              </Link>
            </div>
            <Popover
              content={
                <Button
                  icon={<LogoutOutlined />}
                  type="primary"
                  size="small"
                  onClick={handleClickLogout}
                  className="header-account-button-popover"
                >
                  Đăng xuất
                </Button>
              }
              trigger="click"
              placement="bottomRight"
            >
              <img
                src={avatar}
                className="header-account-avatar"
                alt="Avatar"
                loading="eager"
                style={{ cursor: "pointer" }}
              />
            </Popover>
          </div>
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

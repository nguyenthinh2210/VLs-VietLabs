import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { EventType, PublicClientApplication } from "@azure/msal-browser";

import AuthProvider from "../common/AuthProvider";
import UIProvider from "../common/UIProvider";

import LoginPage from "../components/Auth/LoginPage";
import NoInternetPage from "../components/Auth/NoInternetPage";
import NotFoundPage from "../components/Auth/NotFoundPage";

import MyPermission from "../pages/MyPermission/MyPermission";
import PermissionRequest from "../pages/PermissionRequest/PermissionRequest";
import UsersPermission from "../pages/UsersPermission/UsersPermission";
import UserPermissionDetails from "../pages/UsersPermission/UserPermissionDetails";
import PermissionSetting from "../pages/PermissionSetting/PermissionSetting";
import MyApprovalDetails from "../pages/MyApprovalDetails/MyApprovalDetails";

import { store } from "../store";
import config from "../common/config";
import locale from "antd/locale/en_US";

import { office365MsalConfig } from "../office365AuthConfig";
import MainLayout from "../MainLayout";

export const msalInstance = new PublicClientApplication(office365MsalConfig);

if (
  !msalInstance.getActiveAccount() &&
  msalInstance.getAllAccounts().length > 0
) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});

const Root = () => {
  useEffect(() => {
    // Expose shared libraries globally if needed
    // window.services = services
    // window.helpers = helpers
  }, []);

  return (
    <Provider store={store}>
      {/* <MsalProvider instance={msalInstance}> */}
      <UIProvider>
        <ConfigProvider
          locale={locale}
          theme={{
            token: { colorPrimary: "#5ac2dc" },
            components: {
              Table: {
                cellPaddingBlockSM: 2,
                cellPaddingInlineSM: 5,
              },
            },
          }}
        >
          <BrowserRouter basename={config.HOME_PAGE}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/no-internet" element={<NoInternetPage />} />
              <Route path="/notfound" element={<NotFoundPage />} />

              {/* Protected routes */}
              <Route element={<AuthProvider />}>
                <Route element={<MainLayout />}>
                  <Route index element={<MyPermission />} />
                  <Route path="/mypermission" element={<MyPermission />} />
                  <Route
                    path="/myrequest-approve"
                    element={<PermissionRequest />}
                  />
                  <Route
                    path="/myrequest-approve/detail/:id"
                    element={<MyApprovalDetails />}
                  />
                  <Route path="/mystaff" element={<UsersPermission />} />
                  <Route
                    path="/mystaff/detail/:id"
                    element={<UserPermissionDetails />}
                  />
                  <Route
                    path="/permissionsetting"
                    element={<PermissionSetting />}
                  />
                </Route>
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ConfigProvider>
      </UIProvider>
      {/* </MsalProvider> */}
    </Provider>
  );
};

export default Root;

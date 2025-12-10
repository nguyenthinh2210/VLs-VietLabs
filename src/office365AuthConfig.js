/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
const clienID = "3583b8d8-bf1a-498b-a391-41ef503e0640";
const tenantID = "c717746a-f099-449f-afb1-7545611404b2";
//const clientSecret = "7d32f4a7-6bdd-4639-98cf-030ab1f9cd3f";

export const office365MsalConfig = {
  auth: {
    clientId: clienID, // This is the ONLY mandatory field that you need to supply.
    authority: "https://login.microsoftonline.com/" + tenantID, // Defaults to "https://login.microsoftonline.com/common"
    clientSecret: "7d32f4a7-6bdd-4639-98cf-030ab1f9cd3f"
    //redirectUri: "http://localhost:5173/login",
  },
  cache: {
    cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            // console.error(message);
            return;
          case LogLevel.Info:
            // console.info(message);
            return;
          case LogLevel.Verbose:
            // console.debug(message);
            return;
          case LogLevel.Warning:
            // console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: ["User.Read"],
};
//'Sites.FullControl.All','Sites.ReadWrite.All'

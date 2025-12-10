import { fetchAuth, fetchMetadata } from "./fetch";
import { fetchAxios } from "./fetch";
import endpoints from "./endpoints";
import config from "./config";

// #region auth
export const loginService = async (userName, password) =>
  fetchAxios({
    url: "/api/Auth/login",
    method: "post",
    data: { userName, password },
  });

export const hashPasswordService = async (password) =>
  fetchAuth({
    url: "/api/Auth/hash",
    params: { rawstring: password },
    method: "post",
  });
export const registerServiceForUser = async (userName, password, userId) =>
  fetchAuth({
    url: "/api/Auth/register",
    method: "post",
    data: { userName, password, userId, accountType: "User" },
  });

export const changePasswordService = async (oldPassword, newPassword) =>
  fetchAuth({
    url: "/api/Auth/change-password",
    method: "put",
    data: { oldPassword, newPassword },
  });

export const requestResetPasswordService = async (email) =>
  fetchAxios({
    url: "/users/reset/request",
    method: "post",
    data: { email },
  });

export const verifyResetService = async (email, verifyCode) =>
  fetchAxios({
    url: "/users/reset/verify",
    method: "post",
    data: { email, verifyCode },
  });

export const office365AuthService = async (accessToken) =>
  fetchAxios({
    url: "/auth/authenticate",
    method: "post",
    data: { accessToken },
  });

export const getAuth = async () => {
  const authenticated = JSON.parse(
    localStorage.getItem(config.LOCAL_AUTHENTICATED)
  );

  const getMe = await fetchAuth({
    ignore401: true,
    url: "api/Auth/me",
    method: "post",
    data: {
      accessToken: authenticated.token.accessToken,
      refreshToken: authenticated.token.refreshToken,
    },
  });

  if (getMe?.token) {
    // need to reset token
    localStorage.setItem(config.LOCAL_ACCESS_TOKEN, getMe.token.accessToken);
    localStorage.setItem(config.LOCAL_REFRESH_TOKEN, getMe.token.refreshToken);
    localStorage.setItem(config.LOCAL_AUTHENTICATED, JSON.stringify(getMe));
  }

  const newProfile = {
    authenticated,
    user: getMe?.user,
    account: getMe?.account,
    permission: getMe?.permission,
  };

  return newProfile;
};
// export const getAuthV2 = async () => {
//   const authenticated = JSON.parse(localStorage.getItem(config.LOCAL_AUTHENTICATED))

//   const getMe = await fetchAuth({
//     ignore401: true,
//     url: '/api/Auth/me',
//     method: 'post',
//     data: authenticated?.token
//   })

//   if (getMe?.token) {
//     // need to reset token
//     localStorage.setItem(config.LOCAL_ACCESS_TOKEN, getMe.token.accessToken)
//     localStorage.setItem(config.LOCAL_REFRESH_TOKEN, getMe.token.refreshToken)
//     localStorage.setItem(config.LOCAL_AUTHENTICATED, JSON.stringify(getMe))
//   }
//   const newProfile = {
//     authenticated,
//     user: getMe?.user,
//     account: getMe?.account,
//     permission: getMe?.permission
//   }

//   // get contractor detail

//   // const data = await getItemsService(lists.employee_dataset, {
//   //   filter: `User_name eq '${authenticated.user.userName}'`
//   // })
//   // const user = data.value[0]
//   // localStorage.setItem(config.LOCAL_ACCESS_TOKEN, null)
//   // localStorage.setItem(config.LOCAL_REFRESH_TOKEN, null)
//   // localStorage.setItem(config.LOCAL_AUTHENTICATED, JSON.stringify(authenticated))
//   // const newProfile = {
//   //   authenticated,
//   //   user
//   // }

//   return newProfile
// }

export const refreshTokenService = async (accessToken, refreshToken) =>
  fetchAxios({
    url: "api/Auth/refresh",
    method: "post",
    data: { accessToken, refreshToken },
  });

// #endregion auth

// #region File
export const getAttachmentFileService = async (list, storeID, fileName) =>
  fetchAuth({
    url: "/Sharepoints/",
    params: {
      url: endpoints.getAttachment(list.site, list.listName, storeID, fileName),
    },
    method: "get",
    responseType: "blob",
  });

export const getAttachmentInfoService = async (list, storeID, fileName) =>
  fetchAuth({
    url: "/Sharepoints/",
    params: {
      url: endpoints.getAttachmentInfo(
        list.site,
        list.listName,
        storeID,
        fileName
      ),
    },
    method: "get",
  });

export const getFilesService = async (
  list,
  {
    filter = "",
    orderBy = "",
    select = "",
    expand = "",
    top = config.PAGE_SIZE,
  } = {}
) =>
  fetchAuth({
    url: "/Sharepoints/",
    params: {
      url:
        endpoints.list(list.site, list.listName) +
        `/files?$expand=${expand}&$select=${select}&$filter=${filter}&$orderby=${orderBy}&$top=${top}`,
    },
    method: "get",
    headers: {
      Accept: "application/json;odata=nometadata",
    },
  });

export const getFileService = async (serverRelativeUrl) =>
  fetchAuth({
    url: endpoints.getFile(serverRelativeUrl),

    method: "get",
    responseType: "blob",
  });

export const getFileInfoService = async (site, serverRelativeUrl) =>
  fetchAuth({
    url: "/Sharepoints/",
    params: { url: endpoints.getFileInfo(site, serverRelativeUrl) },
    method: "get",
  });

export const uploadFileService = async (
  list,
  storeID,
  fileName,
  file,
  handlePercent
) => {
  const formData = new FormData();
  formData.append("file", file);

  return fetchAuth({
    url: "/Sharepoints/file",
    params: {
      url: endpoints.addAttachment(list.site, list.listName, storeID, fileName),
    },
    data: formData,
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: handlePercent,
  });
};

export const uploadFileToDocLibService = async (
  serverRelativeUrl,
  fileName,
  refID,
  dataSource,
  file
) => {
  const formData = new FormData();
  formData.append("file", file);

  if (refID === null) refID = "";
  if (dataSource === null) dataSource = "";

  return fetchAuth({
    url: endpoints.addFile(serverRelativeUrl, fileName, refID, dataSource),
    data: formData,
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteFileService = async (serverRelativeUrl) =>
  fetchAuth({
    url: endpoints.deleteFile(serverRelativeUrl),
    method: "delete",
    headers: { "Content-Type": "multipart/form-data" },
  });

// Attachemnt
export const getAttachmentsService = async (list, storeID) =>
  fetchAuth({
    url: "/Sharepoints/",
    params: {
      url: endpoints.getAttachments(list.site, list.listName, storeID),
    },
    method: "get",
  });

export const addFolderService = async (serverRelativeUrl) => {
  return fetchAuth({
    url: endpoints.addFolder(serverRelativeUrl),
    method: "post",
  });
};

export const deleteFolderService = async (serverRelativeUrl) =>
  fetchAuth({
    url: endpoints.deleteFolder(serverRelativeUrl),
    method: "delete",
  });
// #endregion File

// #region ListItem
export const getItemsService = async (
  list,
  {
    filter = "",
    orderBy = "",
    select = "",
    expand = "",
    top = config.PAGE_SIZE,
    skip = 0,
    count = true,
  } = {}
) => {
  let url = "?";

  if (filter) {
    url += "&$filter=" + filter;
  }
  if (orderBy) {
    url += "&$orderby=" + orderBy;
  }
  if (select) {
    url += "&$select=" + select;
  }
  if (expand) {
    url += "&$expand=" + expand;
  }
  if (top) {
    url += "&$top=" + top;
  }
  if (skip) {
    url += "&$skip=" + skip;
  }
  if (count) {
    url += "&$count=true";
  }

  return fetchAuth({
    url: endpoints.getItems(list.listName) + url,
    method: "get",
    headers: {
      Accept: "application/json;odata=nometadata",
    },
  });
};

export const getNextLinkService = async (url) =>
  fetchAuth({
    url: "/Sharepoints/",
    params: { url },
    method: "get",
    headers: {
      Accept: "application/json;odata=nometadata",
    },
  });

export const getItemService = async (list, id) =>
  fetchAuth({
    url: endpoints.getItem(list.listName, id),
    method: "get",
    headers: {
      Accept: "application/json;odata=nometadata",
    },
  });

export const addListItemService = async (list, item) =>
  fetchAuth({
    url: endpoints.addItem(list.listName),
    data: item,
    method: "post",
  });

export const addListItemFunction = async (list, item) =>
  fetchAuth({
    url: endpoints.addItemFunc(list.listName),
    data: item,
    method: "post",
  });

export const deleteListItemService = async (list, id) =>
  fetchAuth({
    url: endpoints.deleteItem(list.listName, id),
    method: "delete",
  });

export const updateListItemService = async (list, id, item) =>
  fetchAuth({
    url: endpoints.updateItem(list.listName, id),
    data: item,
    method: "patch",
  });

// #endregion ListItem
// #region custom api

/*export const getLogbooksService = async (logbookTypeId) =>
  fetchAuth({
    url: endpoints.getLogbooks(logbookTypeId),
    method: 'get',
    headers: {
      Accept: 'application/json'
    }
  })*/
export const getLogbooksService = async (
  logbookTypeId,
  {
    filter = "",
    date = "",
    selfFilter = "" /*, top = config.PAGE_SIZE, skip = 0*/,
  } = {}
) => {
  // Xây dựng URL với các tham số tùy chọn
  let url = endpoints.getLogbooks(logbookTypeId);

  if (filter) {
    url += `&$filter=${filter}`;
  }
  if (date) {
    url += `&$date=${date}`; // Giả sử bạn có một tham số ngày, hãy chắc chắn rằng API hỗ trợ tham số này
  }
  if (selfFilter) {
    url += `&$selfFilter=${selfFilter}`;
  }
  //url += `&$top=${top}&$skip=${skip}` // Chúng ta thêm top, skip và count mặc định

  return fetchAuth({
    url: url + "&$sort=sort(record_code, desc)",
    method: "get",
    headers: {
      Accept: "application/json",
    },
  });
};
export const getAppRecordDetailChangeLogsService = async (
  record_id,
  {
    filter = "",
    orderBy = "",
    select = "",
    expand = "",
    top = config.PAGE_SIZE,
    skip = 0,
    count = true,
  } = {}
) => {
  let url = "";

  if (filter) {
    url += `&$filter=${filter}`;
  }
  if (orderBy) {
    url += "&$orderby=" + orderBy;
  }
  if (select) {
    url += "&$select=" + select;
  }
  if (expand) {
    url += "&$expand=" + expand;
  }
  if (top) {
    url += "&$top=" + top;
  }
  if (skip) {
    url += "&$skip=" + skip;
  }
  if (count) {
    url += "&$count=true";
  }

  return fetchAuth({
    url: endpoints.getAppRecordDetailChangeLogs(record_id) + url,
    method: "get",
    headers: {
      Accept: "application/json;odata=nometadata",
    },
  });
};

export const getAppFieldRoleIndicatorMappingsService = async (
  app_rcd,
  {
    filter = "", //'(role_indicator_rcd%20eq%20%27DOCTOR%27)',
    orderBy = "",
    select = "",
    expand = "",
    top = config.PAGE_SIZE,
    skip = 0,
    count = true,
  } = {}
) => {
  let url = "";
  // '&$filter=contains(role_indicator_rcd,%20%27DOCTOR%27)'

  //

  if (filter) {
    url += "&$filter=" + filter;
  }
  if (orderBy) {
    url += "&$orderby=" + orderBy;
  }
  if (select) {
    url += "&$select=" + select;
  }
  if (expand) {
    url += "&$expand=" + expand;
  }
  if (top) {
    url += "&$top=" + top;
  }
  if (skip) {
    url += "&$skip=" + skip;
  }
  if (count) {
    url += "&$count=true";
  }

  return fetchAuth({
    url: endpoints.getAppFieldRoleIndicatorMappings(app_rcd) + url,
    method: "get",
    headers: {
      Accept: "application/json;odata=nometadata",
    },
  });
};

export const patchMultiRecordDetails = async (list, item) =>
  fetchAuth({
    url: endpoints.patchMultiRecords(list),
    data: item,
    method: "post",
  });

export const transDataViewToTableService = async (list, filterQuery) =>
  fetchAuth({
    url: endpoints.transDataViewToTable(list, filterQuery),
    method: "post",
  });

export const sendToPortalService = async (invoice_no) =>
  fetchAuth({
    url: endpoints.sendToPortal(invoice_no),
    method: "get",
  });

//Lưu ý khi dùng bulkInsert, checkDataIsExsistService và bulkPatch. data trả về có thuộc tính là dạng camelCase.
//Ví dụ UserName -> userName
export const bulkInsertService = async (list, items) =>
  fetchAuth({
    url: endpoints.bulkInsert(list.listName),
    data: items,
    method: "post",
  });

//Lưu ý nếu có update thì phải truyền toàn bộ dữ liệu của item, không thể chỉ truyền những trường cần update.
//Trả về 2 thuộc tính là inserted và updated
export const bulkPatchService = async (list, items) =>
  fetchAuth({
    url: endpoints.bulkPatch(list.listName),
    data: items,
    method: "post",
  });

export const bulkDeleteService = async (list, items) =>
  fetchAuth({
    url: endpoints.bulkDelete(list.listName),
    data: items,
    method: "post",
  });

export const bulkGetServices = async (
  list,
  {
    filter = "",
    orderBy = "",
    select = "",
    expand = "",
    top = null,
    skip = null,
    count = true,
  } = {}
) => {
  let url = "?";

  if (filter) {
    url += "&$filter=" + encodeURIComponent(filter);
  }
  if (orderBy) {
    url += "&$orderby=" + orderBy;
  }
  if (select) {
    url += "&$select=" + select;
  }
  if (expand) {
    url += "&$expand=" + expand;
  }
  if (top) {
    url += "&$top=" + top;
  }
  if (skip) {
    url += "&$skip=" + skip;
  }
  if (count) {
    url += "&$count=true";
  }

  return fetchAuth({
    url: endpoints.bulkGet(list.listName) + url,
    method: "get",
    headers: {
      Accept: "application/json;odata=nometadata",
    },
  });
};

// #region api attachment HIS-Permission
// 📁 Get danh sách file trong folder
export const getFolderInfoService = async (permissionRequestId) =>
  fetchAxios({
    url: endpoints.getStoreFolderInfo(permissionRequestId),
    method: "get",
  });

// 📁 Upload file vào folder
export const uploadToStoreService = async ({
  file,
  permissionRequestId,
  userId,
  userDisplayName,
  attachmentName,
}) => {
  const formData = new FormData();
  formData.append("file", file);

  return fetchAxios({
    url: endpoints.uploadStoreFile({
      permissionRequestId,
      userId,
      userDisplayName,
      attachmentName,
    }),
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 📁 Lấy nội dung file theo storeRecordId downLoad
export const getStoreFileContentService = async (storeRecordId) =>
  fetchAxios({
    url: endpoints.getStoreFileContent(storeRecordId),
    method: "get",
    responseType: "blob",
  });

// 📁 Xoá file theo path
export const deleteStoreFileService = async (attachmentPath) =>
  fetchAxios({
    url: endpoints.deleteStoreFile(attachmentPath),
    method: "delete",
  });

// #endregion ListItem
// #region metadata
export const getMetadataService = async () =>
  fetchMetadata({ url: "/odata/$metadata" });

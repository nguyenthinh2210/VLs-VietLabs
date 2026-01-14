export default {
  getItems: (listName) => `/odata/${listName}/`,
  getItem: (listName, id) => `/odata/${listName}(${id})`,
  addItem: (listName) => `/odata/${listName}`,
  updateItem: (listName, id) => `/odata/${listName}(${id})/`,
  deleteItem: (listName, id) => `/odata/${listName}(${id})`,
  //API Permission
  addItemFunc: (listName) => `/odata/${listName}/add-or-update`,
  // File
  getFile: (serverRelativeUrl) =>
    `api/store/get-file-content?serverRelativeUrl=${serverRelativeUrl}`,
  getFileInfo: (site, serverRelativeUrl) =>
    `${site}/_api/web/GetFileByServerRelativeUrl('${serverRelativeUrl}')`,
  addFile: (serverRelativeUrl, fileName, refID, dataSource) =>
    `/api/Store/create-file?serverRelativeUrl=${serverRelativeUrl}&fileName=${fileName}&refID=${refID}&dataSource=${dataSource}`,
  updateFile: (site, serverRelativeUrl) =>
    `${site}/_api/web/GetFileByServerRelativeUrl('${serverRelativeUrl}')/$value`,
  deleteFile: (serverRelativeUrl) =>
    `api/store/delete-file?serverRelativeUrl=${serverRelativeUrl}`,
  // #region CustomAPI
  getLogbooks: (logbookTypeId) => `/api/apprecords?app_rcd=${logbookTypeId}`,
  patchMultiRecords: (listName) => `/odata/${listName}/multi`,
  addFolder: (serverRelativeUrl) =>
    `api/store/create-folder?serverRelativeUrl=${serverRelativeUrl}`,
  deleteFolder: (serverRelativeUrl) =>
    `api/store/delete-folder?serverRelativeUrl=${serverRelativeUrl}`,
  getAppFieldRoleIndicatorMappings: (app_rcd) =>
    `/api/jointable/app_field_role_indicator_mapping?app_rcd=${app_rcd}`,
  getAppRecordDetailChangeLogs: (record_id) =>
    `/api/jointable/app_record_detail_change_log?record_id=${record_id}`,
  transDataViewToTable: (listname, filterQuery) =>
    `/api/transdata/add/${listname}?${filterQuery}`,
  sendToPortal: (invoice_no) =>
    `/api/parsexml/xml1to7?invoice_no=${invoice_no}`,

  bulkInsert: (listName) => `/api/${listName}/BulkInsert`,
  bulkPatch: (listName) => `/api/${listName}/BulkPatch`,
  bulkDelete: (listName) => `/api/${listName}/BulkDelete`,
  bulkGet: (listName) => `/api/${listName}/BulkGet`,

  //Attachment HIS-Permission
  getStoreFolderInfo: (permissionRequestId) =>
    `/odata/Store/get-folder-info?permissionRequestId=${permissionRequestId}`,
  getStoreFileContent: (storeRecordId) =>
    `/odata/Store/get-file-content?storeRecordId=${storeRecordId}`,
  uploadStoreFile: ({
    permissionRequestId,
    userId,
    userDisplayName,
    attachmentName,
  }) =>
    `/odata/Store/create-file?permissionRequestId=${permissionRequestId}&userId=${userId}&userDisplayName=${userDisplayName}&attachmentName=${encodeURIComponent(
      attachmentName
    )}
`,
  deleteStoreFile: (attachmentPath) =>
    `/odata/Store/delete-file?attachmentPath=${attachmentPath}`,
};

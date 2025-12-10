import React, { useEffect, useState } from "react";
import { Button, Form, Image, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Dragger from "antd/es/upload/Dragger";
import fileDownload from "js-file-download";
import heic2any from "heic2any";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  getFolderInfoService,
  uploadToStoreService,
  getStoreFileContentService,
  deleteStoreFileService,
} from "../../services";

import { handleError } from "../../helpers";
import { useUI } from "../../UIProvider";
import PreviewFile from "../PreviewFile";
import DocumentItem from "./DocumentItem";
import DocumentURl from "./DocumentURl";
import { supportDocumentTypeList } from ".";
import imgSpinner from "../../../assets/spinner_v2.gif";
import PropTypes from "prop-types";

DocumentStore.propTypes = {
  permissionRequestId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userDisplayName: PropTypes.string,
  mode: PropTypes.string,
  setAttachments: PropTypes.func,
  accept: PropTypes.string,
  maxCount: PropTypes.number,
  maxFileSize: PropTypes.shape({
    size: PropTypes.number,
    unit: PropTypes.string,
  }),
};

function DocumentStore({
  permissionRequestId,
  userId,
  userDisplayName,
  mode = "",
  setAttachments,
  accept = "",
  maxCount = Infinity,
  maxFileSize = { size: 25, unit: "MB" },
}) {
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDeleteFile, setSelectedDeleteFile] = useState(null);
  const [isGettingFiles, setIsGettingFiles] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  const ui = useUI();
  const [form] = Form.useForm();

  const beforeUpload = (file) => {
    const acceptedFileTypes = accept
      ? accept.split(",").map((type) => type.trim())
      : null;
    const isAcceptedFileType = acceptedFileTypes
      ? acceptedFileTypes.includes(file.type)
      : true;
    if (!isAcceptedFileType)
      ui.notiError(`You can only upload ${accept} file types!`);

    const maxSizeInBytes =
      maxFileSize.size * (maxFileSize.unit === "MB" ? 1024 * 1024 : 1024);
    const isBelowMaxSize = file.size < maxSizeInBytes;
    if (!isBelowMaxSize)
      ui.notiError(
        `File must be smaller than ${maxFileSize.size}${maxFileSize.unit}!`
      );

    return isAcceptedFileType && isBelowMaxSize;
  };

  const handleGetFiles = async () => {
    setIsGettingFiles(true);
    try {
      const res = await getFolderInfoService(permissionRequestId);
      const mapped = (res?.value || res || []).map((item) => ({
        Name: item.attachmentName,
        ServerRelativeUrl: item.attachmentPath,
        Id: item.storeRecordId,
      }));

      setFileList(mapped);
      if (setAttachments) setAttachments(mapped);
    } catch (error) {
      handleError(error);
    } finally {
      setIsGettingFiles(false);
    }
  };

  const handleUploadFile = async ({ file }) => {
    const existingFile = fileList.find((f) => f.Name === file.name);

    if (existingFile) {
      ui.notiWarning(`File "${file.name}" already exists!`);
      return;
    }

    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop().toLowerCase();
      let rawFile = file;

      if (ext === "heic") {
        rawFile = await heic2any({
          blob: new Blob([rawFile], { type: rawFile.type }),
        });
      }

      const uniqueFileName = rawFile.name;

      await uploadToStoreService({
        file: rawFile,
        permissionRequestId,
        userId,
        userDisplayName,
        attachmentName: uniqueFileName,
      });

      await handleGetFiles();
    } catch (error) {
      handleError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleOnClickFile = async (item) => {
    if (item.IsFolder) return;

    ui.setLoading(true);
    try {
      const res = await getStoreFileContentService(item.Id);
      const fileExtension = item.Name;

      if (supportDocumentTypeList.includes(fileExtension)) {
        const fileContent = await res.arrayBuffer();
        setSelectedFile({
          fileName: item.Name,
          fileContent,
          fileInfo: item,
        });
      } else {
        fileDownload(res, item.Name);
      }
    } catch (error) {
      handleError(error);
    } finally {
      ui.setLoading(false);
    }
  };

  const handleDeleteFile = async () => {
    setIsDeletingItem(true);
    try {
      await deleteStoreFileService(selectedDeleteFile.ServerRelativeUrl);
      const updated = fileList.filter((f) => f.Id !== selectedDeleteFile.Id);
      setFileList(updated);
      if (setAttachments) setAttachments(updated);
      setSelectedDeleteFile(null);
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeletingItem(false);
    }
  };

  useEffect(() => {
    handleGetFiles();
  }, []);

  return (
    <div>
      {selectedFile !== null && (
        <PreviewFile
          file={selectedFile}
          onCancel={() => setSelectedFile(null)}
          site={"PermissionRequests"}
        />
      )}

      <Dragger
        disabled={mode === "View" || fileList.length >= maxCount || isUploading}
        fileList={[]}
        customRequest={handleUploadFile}
        beforeUpload={beforeUpload}
        accept={accept}
      >
        {fileList.length < maxCount ? (
          isUploading ? (
            <Image src={imgSpinner} preview={false} width={70} />
          ) : (
            <>
              <div className="p-1 border border-gray-400 rounded-md">
                <FontAwesomeIcon
                  icon={faUpload}
                  className="text-xl text-[#5ac2dc]"
                />
              </div>
              <p className="mt-2">
                <span className="text-[#5ac2dc]">Click to Upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-400">
                (Max. File size: {maxFileSize.size}
                {maxFileSize.unit}
                {maxCount === Infinity ? "" : ` | Max. File count: ${maxCount}`}
                )
              </p>
            </>
          )
        ) : (
          <p className="text-xs text-red-500">Max file count reached</p>
        )}
      </Dragger>

      <DocumentURl currentURL={[]} />

      <div className="mt-4 max-h-[100px] overflow-y-auto">
        {isGettingFiles || isUploading ? (
          <div className="flex flex-col justify-center items-center">
            <Image width={70} src={imgSpinner} preview={false} />
            <span>Loading data....</span>
          </div>
        ) : (
          fileList.map((item) => (
            <DocumentItem
              mode={mode}
              key={item.Id}
              item={item}
              handleOnClickFile={handleOnClickFile}
              setSelectedDeleteFile={setSelectedDeleteFile}
            />
          ))
        )}
      </div>

      <Modal
        title={<h1>Confirm delete</h1>}
        open={selectedDeleteFile !== null}
        onCancel={() => !isDeletingItem && setSelectedDeleteFile(null)}
        footer={[
          <Button
            key="cancel"
            onClick={() => !isDeletingItem && setSelectedDeleteFile(null)}
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            danger
            loading={isDeletingItem}
            onClick={handleDeleteFile}
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>,
        ]}
        centered
      >
        <p className="py-3">Are you sure want to delete this file?</p>
      </Modal>
    </div>
  );
}

export default DocumentStore;

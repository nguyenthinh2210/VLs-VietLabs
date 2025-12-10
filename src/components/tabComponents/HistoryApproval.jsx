import React from "react";
import { Tag, List } from "antd";
import PropTypes from "prop-types";
import dayjs from "../../common/dayjs";

const propTypes = {
  dataPermissionRequestHistories: PropTypes.array,
};

const HistoryApproval = ({ dataPermissionRequestHistories }) => {
  const sortedData = [...(dataPermissionRequestHistories || [])].sort(
    (a, b) => a.Id - b.Id // đổi thành b.Id - a.Id nếu muốn sắp xếp giảm dần
  );
  return (
    <div>
      {sortedData?.length > 0 && (
        <List
          style={{ maxHeight: 300, overflowY: "auto", paddingRight: "10px" }}
          itemLayout="horizontal"
          dataSource={sortedData}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Tag
                    color={
                      item.Status === "Manager approved"
                        ? "processing"
                        : item.Status === "Complete"
                          ? "green"
                          : item.Status === "Rejected"
                            ? "volcano"
                            : item.Status === "Waiting for Manager"
                              ? "gold"
                              : "silver"
                    }
                  >
                    {item.Status}
                  </Tag>
                }
                title={
                  <>
                    <span className="mr-2">{index + 1}.</span>
                    <a>{item.UserDisplayName}</a>
                    <span className="float-right">
                      {dayjs(item.Created).format("YYYY-MM-DD - HH:mm A")}
                    </span>
                  </>
                }
              description={item.Comment || "No comment"}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

HistoryApproval.propTypes = propTypes;
export default HistoryApproval;

import { Pagination } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { handleError } from "../helpers";
import PropTypes from "../PropTypes";
import _ from "lodash";

const useUpdateEffect = (effect, dependencies) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    return effect();
  }, dependencies);
};

const propTypes = {
  getItems: PropTypes.func.isRequired, // Hàm để lấy dữ liệu từ server
  setItems: PropTypes.func.isRequired, // Hàm để cập nhật items trong component cha
  items: PropTypes.array, // Mảng dữ liệu hiện tại
  loading: PropTypes.bool, // Trạng thái loading
  setLoading: PropTypes.func, // Hàm để cập nhật trạng thái loading
  itemsPerPage: PropTypes.number, // Số lượng items mỗi trang
};

const SPPagination = ({
  getItems = async () => {},
  setItems,
  items = [],
  loading,
  setLoading = () => {},
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [owningItems, setOwningItems] = useState(items);
  const [disabled, setDisabled] = useState(loading);
  const [totalItems, setTotalItems] = useState(0);

  useUpdateEffect(() => {
    if (!_.isEqual(items, owningItems)) {
      setDisabled(true);
      getItemsWithPage({ page: 1, withLoading: false });
    } else {
      setDisabled(false);
    }
  }, [items]);

  useUpdateEffect(() => {
    if (!_.isEqual(items, owningItems)) {
      setDisabled(true);
    }
  }, [items]);

  useEffect(() => {
    getItemsWithPage();
  }, []);

  const getItemsWithPage = async ({ page = 1, withLoading = true } = {}) => {
    if (withLoading) {
      setLoading(true);
    }

    setDisabled(true);

    try {
      const skip = (page - 1) * itemsPerPage; // Tính toán số lượng items cần bỏ qua
      const top = itemsPerPage; // Số lượng items mỗi trang
      const data = await getItems(skip, top, withLoading);

      setItems(data.value); // Cập nhật items vào component cha
      setOwningItems(data.value); // Cập nhật items sở hữu bởi pagination
      setCurrentPage(page); // Cập nhật trang hiện tại
      setTotalItems(data["@odata.count"]); // Cập nhật tổng số items
    } catch (error) {
      handleError(error, "getItemsWithPage");
    }

    setLoading(false);
    setDisabled(false);
  };

  return (
    <div className="d-flex justify-content-end">
      <Pagination
        showSizeChanger={false}
        onChange={(page) => getItemsWithPage({ page })}
        disabled={disabled || loading}
        size="small"
        current={currentPage}
        total={totalItems}
        pageSize={itemsPerPage}
      />
    </div>
  );
};

SPPagination.propTypes = propTypes;

export default SPPagination;

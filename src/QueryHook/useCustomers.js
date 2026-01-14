import { useEffect } from "react";
import { useCustomersRedux } from "../store/customers";
import { useUI } from "../common/UIProvider";

export const useCustomers = () => {
  const ui = useUI();
  const {
    customers,
    loading,
    error,
    fetchCustomers: fetchCustomersRedux,
    getCustomer: getCustomerRedux,
    addCustomer: addCustomerRedux,
    updateCustomer: updateCustomerRedux,
    deleteCustomer: deleteCustomerRedux,
  } = useCustomersRedux();

  // Fetch customers chỉ 1 lần khi mount (nếu chưa có data)
  useEffect(() => {
    if (customers.length === 0 && !loading) {
      fetchCustomersRedux();
    }
  }, []); // Chỉ chạy 1 lần khi mount

  // Wrapper functions với notifications
  const fetchCustomers = async (params = {}) => {
    try {
      const result = await fetchCustomersRedux({ ...params, forceRefresh: params.forceRefresh || false });
      return result.payload || customers;
    } catch (error) {
      ui.notiError("Lỗi khi tải danh sách khách hàng");
      throw error;
    }
  };

  const getCustomer = async (clientId) => {
    try {
      const result = await getCustomerRedux(clientId);
      return result.payload;
    } catch (error) {
      ui.notiError("Lỗi khi tải thông tin khách hàng");
      throw error;
    }
  };

  const addCustomer = async (customerData) => {
    try {
      const result = await addCustomerRedux(customerData);
      ui.notiSuccess("Thêm khách hàng thành công");
      // Refresh list sau khi add
      await fetchCustomersRedux({ forceRefresh: true });
      return result.payload;
    } catch (error) {
      ui.notiError("Lỗi khi thêm khách hàng");
      throw error;
    }
  };

  const updateCustomer = async (clientId, customerData) => {
    try {
      const result = await updateCustomerRedux({ clientId, customerData });
      ui.notiSuccess("Cập nhật khách hàng thành công");
      // Refresh list sau khi update
      await fetchCustomersRedux({ forceRefresh: true });
      return result.payload;
    } catch (error) {
      ui.notiError("Lỗi khi cập nhật khách hàng");
      throw error;
    }
  };

  const deleteCustomer = async (clientId) => {
    try {
      await deleteCustomerRedux(clientId);
      ui.notiSuccess("Xóa khách hàng thành công");
    } catch (error) {
      ui.notiError("Lỗi khi xóa khách hàng");
      throw error;
    }
  };

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    getCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
};

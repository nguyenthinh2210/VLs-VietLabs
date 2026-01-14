import { useEffect } from "react";
import { useContactsRedux } from "../store/contacts";
import { useUI } from "../common/UIProvider";

export const useContacts = (clientId) => {
  const ui = useUI();
  const {
    contacts,
    loading,
    error,
    fetchContacts: fetchContactsRedux,
    getContact: getContactRedux,
    addContact: addContactRedux,
    updateContact: updateContactRedux,
    deleteContact: deleteContactRedux,
    clearContacts,
  } = useContactsRedux();

  // Fetch contacts khi clientId thay đổi
  useEffect(() => {
    if (clientId) {
      fetchContactsRedux(clientId);
    } else {
      clearContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  // Wrapper functions với notifications
  const fetchContacts = async (clientId, params = {}) => {
    try {
      const result = await fetchContactsRedux(clientId, { 
        ...params, 
        forceRefresh: params.forceRefresh || false 
      });
      return result.payload || contacts;
    } catch (error) {
      ui.notiError("Lỗi khi tải danh sách người liên hệ");
      throw error;
    }
  };

  const getContact = async (contactId) => {
    try {
      const result = await getContactRedux(contactId);
      return result.payload;
    } catch (error) {
      ui.notiError("Lỗi khi tải thông tin người liên hệ");
      throw error;
    }
  };

  const addContact = async (contactData) => {
    try {
      const result = await addContactRedux(contactData);
      ui.notiSuccess("Thêm người liên hệ thành công");
      // Refresh list sau khi add
      if (clientId) {
        await fetchContactsRedux(clientId, { forceRefresh: true });
      }
      return result.payload;
    } catch (error) {
      ui.notiError("Lỗi khi thêm người liên hệ");
      throw error;
    }
  };

  const updateContact = async (contactId, contactData) => {
    try {
      const result = await updateContactRedux(contactId, contactData);
      ui.notiSuccess("Cập nhật người liên hệ thành công");
      // Refresh list sau khi update
      if (clientId) {
        await fetchContactsRedux(clientId, { forceRefresh: true });
      }
      return result.payload;
    } catch (error) {
      ui.notiError("Lỗi khi cập nhật người liên hệ");
      throw error;
    }
  };

  const deleteContact = async (contactId) => {
    try {
      await deleteContactRedux(contactId);
      ui.notiSuccess("Xóa người liên hệ thành công");
      // Refresh list sau khi delete
      if (clientId) {
        await fetchContactsRedux(clientId, { forceRefresh: true });
      }
    } catch (error) {
      ui.notiError("Lỗi khi xóa người liên hệ");
      throw error;
    }
  };

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    getContact,
    addContact,
    updateContact,
    deleteContact,
  };
};

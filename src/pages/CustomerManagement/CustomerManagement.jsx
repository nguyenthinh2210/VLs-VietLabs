import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Modal,
  Form,
  Popconfirm,
  Spin,
  Empty,
  Switch,
  Tabs,
  Radio,
  Upload,
  Checkbox,
  DatePicker,
  Table,
} from "antd";
import "../../styles/customer-management.scss";
import {
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  BankOutlined,
  MailOutlined,
  PhoneOutlined,
  PhoneFilled,
  SaveOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  LineChartOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  TagOutlined,
  UploadOutlined,
  FileTextOutlined,
  PaperClipOutlined,
  WarningOutlined,
  TeamOutlined,
  CloseOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useUI } from "../../common/UIProvider";
import lists from "../../common/lists";
import { handleError, exportToExcel } from "../../common/helpers";
import SPPagination from "../../common/components/SPPagination";
import { getCustomerTypeTag } from "./customerColumns";
import { useCustomers } from "../../QueryHook/useCustomers";
import { useContacts } from "../../QueryHook/useContacts";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const CustomerManagement = () => {
  const ui = useUI();
  const [form] = Form.useForm();
  const [contactForm] = Form.useForm();
  const [forecastForm] = Form.useForm();

  // Use Customers Hook
  const {
    customers,
    loading,
    fetchCustomers,
    getCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  // State
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("");
  const [salesInChargeFilter, setSalesInChargeFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [blacklistFilter, setBlacklistFilter] = useState("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [areaFilter, setAreaFilter] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [isActive, setIsActive] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [debtFileList, setDebtFileList] = useState([]);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [forecasts, setForecasts] = useState([]);
  const [isForecastModalVisible, setIsForecastModalVisible] = useState(false);
  const [editingForecast, setEditingForecast] = useState(null);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // Use Contacts Hook - fetch contacts khi có editingCustomer
  const clientId = editingCustomer?.ClientId;
  const {
    contacts: contactsFromAPI,
    loading: contactsLoading,
    addContact: addContactAPI,
    updateContact: updateContactAPI,
    deleteContact: deleteContactAPI,
  } = useContacts(clientId);

  // Map contacts từ API sang format UI
  const contacts = contactsFromAPI.map(contact => {
    // Parse roles từ string hoặc array
    let roles = [];
    if (contact.Roles) {
      if (typeof contact.Roles === 'string') {
        roles = contact.Roles.split(',').map(r => r.trim()).filter(r => r);
      } else if (Array.isArray(contact.Roles)) {
        roles = contact.Roles;
      }
    }
    // Nếu không có roles, có thể dùng Department làm fallback (nếu cần)
    
    return {
      id: contact.ContactId,
      name: contact.FullName,
      phone: contact.Phone,
      email: contact.Email,
      position: contact.Title,
      roles: roles,
      // Giữ nguyên data gốc để update
      originalData: contact,
    };
  });

  // Filter Options
  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const customerTypeOptions = [
    { value: "All", label: "All" },
    { value: "Doanh nghiệp", label: "Doanh nghiệp" },
    { value: "Cá nhân", label: "Cá nhân" },
    { value: "Nhà nước", label: "Nhà nước" },
    { value: "Đại lý", label: "Đại lý" },
  ];

  const blacklistOptions = [
    { value: "All", label: "All" },
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const industryOptions = [
    { value: "All", label: "All" },
    { value: "Thực phẩm", label: "Thực phẩm" },
    { value: "Dược phẩm", label: "Dược phẩm" },
    { value: "Mỹ phẩm", label: "Mỹ phẩm" },
  ];

  const areaOptions = [
    { value: "All", label: "All" },
    { value: "TP.HCM", label: "TP.HCM" },
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
  ];

  // Customer types (for form)
  const customerTypes = [
    { value: "All", label: "Tất cả" },
    { value: "Tiềm năng", label: "Tiềm năng" },
    { value: "Mới", label: "Mới" },
    { value: "VIP", label: "VIP" },
    { value: "Thường xuyên", label: "Thường xuyên" },
    { value: "Enterprise", label: "Enterprise" },
    { value: "Doanh nghiệp", label: "Doanh nghiệp" },
    { value: "Cá nhân", label: "Cá nhân" },
    { value: "Nhà nước", label: "Nhà nước" },
    { value: "Đại lý", label: "Đại lý" },
  ];

  // Profession options
  const professionOptions = [
    { value: "Thực phẩm", label: "Thực phẩm" },
    { value: "Dược phẩm", label: "Dược phẩm" },
    { value: "Mỹ phẩm", label: "Mỹ phẩm" },
    { value: "Công nghệ thông tin", label: "Công nghệ thông tin" },
  ];

  // Agent/CTV options
  const agentOptions = [
    { value: "agent1", label: "Đại lý 1" },
    { value: "agent2", label: "Đại lý 2" },
    { value: "ctv1", label: "CTV 1" },
  ];

  // Country options
  const countryOptions = [
    { value: "VN", label: "Việt Nam" },
    { value: "US", label: "United States" },
    { value: "CN", label: "China" },
  ];

  // Province/City options
  const provinceOptions = [
    { value: "hcm", label: "TP.HCM" },
    { value: "hanoi", label: "Hà Nội" },
    { value: "danang", label: "Đà Nẵng" },
    { value: "cantho", label: "Cần Thơ" },
  ];

  // Ward/Commune options
  const wardOptions = [
    { value: "ward1", label: "Phường 1" },
    { value: "ward2", label: "Phường 2" },
    { value: "ward3", label: "Phường 3" },
  ];

  // Staff options
  const staffOptions = [
    { value: "staff1", label: "Nhân viên 1" },
    { value: "staff2", label: "Nhân viên 2" },
    { value: "staff3", label: "Nhân viên 3" },
  ];

  // Cập nhật filteredCustomers khi customers thay đổi từ Redux
  useEffect(() => {
    applyFilters(
      searchText,
      statusFilter,
      customerTypeFilter,
      blacklistFilter,
      industryFilter,
      areaFilter,
      companyFilter,
      salesInChargeFilter,
      agentFilter
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers]);

  // Search function
  const handleSearch = (value) => {
    setSearchText(value);
    applyFilters(
      value,
      statusFilter,
      customerTypeFilter,
      blacklistFilter,
      industryFilter,
      areaFilter,
      companyFilter,
      salesInChargeFilter,
      agentFilter
    );
  };

  // Apply all filters - nhận tất cả filter values làm parameters
  const applyFilters = (
    search = searchText,
    status = statusFilter,
    customerType = customerTypeFilter,
    blacklist = blacklistFilter,
    industry = industryFilter,
    area = areaFilter,
    company = companyFilter,
    salesInCharge = salesInChargeFilter,
    agent = agentFilter
  ) => {
    // Nếu không có customers, set empty array
    if (!customers || customers.length === 0) {
      setFilteredCustomers([]);
      return;
    }

    let filtered = [...customers];

    // Search filter - chỉ áp dụng nếu có giá trị
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.CompanyName?.toLowerCase().includes(searchLower) ||
          customer.RepresentativeName?.toLowerCase().includes(searchLower) ||
          customer.RepresentativeEmail?.toLowerCase().includes(searchLower) ||
          customer.RepresentativePhone?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter - chỉ filter nếu không phải "All"
    if (status && status !== "All" && status !== "") {
      filtered = filtered.filter(
        (customer) => customer.Status === status
      );
    }

    // Customer Type filter - chỉ filter nếu không phải "All"
    if (customerType && customerType !== "All" && customerType !== "") {
      filtered = filtered.filter(
        (customer) => customer.CustomerType === customerType
      );
    }

    // Blacklist filter - chỉ filter nếu không phải "All"
    if (blacklist && blacklist !== "All" && blacklist !== "") {
      if (blacklist === "yes") {
        // Chỉ hiện customers có IsBlacklisted = true
        filtered = filtered.filter(
          (customer) => customer.IsBlacklisted === true
        );
      } else if (blacklist === "no") {
        // Hiện customers có IsBlacklisted = false hoặc null/undefined
        filtered = filtered.filter(
          (customer) => 
            customer.IsBlacklisted === false || 
            customer.IsBlacklisted == null
        );
      }
    }

    // Industry filter (Profession) - chỉ filter nếu không phải "All"
    if (industry && industry !== "All" && industry !== "") {
      filtered = filtered.filter(
        (customer) => customer.Profession === industry
      );
    }

    // Area filter (City) - chỉ filter nếu không phải "All"
    if (area && area !== "All" && area !== "") {
      filtered = filtered.filter(
        (customer) => customer.City === area
      );
    }

    // Company filter - chỉ filter nếu có giá trị
    if (company && company.trim()) {
      const companyLower = company.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.CompanyName?.toLowerCase().includes(companyLower)
      );
    }

    // Sales In charge filter (SalesOwnerName) - chỉ filter nếu có giá trị
    if (salesInCharge && salesInCharge.trim()) {
      const salesLower = salesInCharge.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.SalesOwnerName?.toLowerCase().includes(salesLower)
      );
    }

    // Agent filter - chỉ filter nếu có giá trị
    if (agent && agent.trim()) {
      const agentLower = agent.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.CustomerType === "Đại lý" &&
          (customer.CompanyName?.toLowerCase().includes(agentLower) ||
           customer.RepresentativeName?.toLowerCase().includes(agentLower))
      );
    }

    // Luôn set filteredCustomers, kể cả khi tất cả filter đều là "All"
    setFilteredCustomers(filtered);
  };

  // Add customer
  const handleAdd = () => {
    setEditingCustomer(null);
    setActiveTab("general");
    setIsActive(true);
    form.resetFields();
    setDebtFileList([]); // Reset debt file list
    setForecasts([]); // Reset forecasts
    setIsModalVisible(true);
  };

  // View customer - mở Add/Edit Modal với dữ liệu đã điền sẵn (giống như thêm khách hàng)
  const handleView = async (record) => {
    try {
      const customer = await getCustomer(record.ClientId);
      // Gọi handleEdit để mở modal ở chế độ edit (có thể chỉnh sửa)
      handleEdit(customer);
    } catch (error) {
      // Error đã được xử lý trong hook
    }
  };

  // Edit customer
  const handleEdit = (record) => {
    setEditingCustomer(record);
    setActiveTab("general");
    setIsActive(record.Status === "Active");
    setIsViewMode(false); // Reset view mode khi edit
    // Parse discount từ số thập phân (5.00) sang string ("5")
    const discountValue = record.DiscountRate != null 
      ? String(record.DiscountRate) 
      : "";
    
    form.setFieldsValue({
      CompanyName: record.CompanyName,
        CompanyNameEn: record.CompanyNameEn || "",
        TaxCode: record.TaxCode,
        InternalCode: record.InternalCode,
        CustomerType: record.CustomerType || "Cá nhân",
        Profession: record.Profession || "",
        Agent: record.Agent || "",
        IssueInvoice: record.IssueInvoice || false,
        BankName: record.BankName || "",
        BankAccountNumber: record.BankAccountNumber || "",
        BankAccountName: record.BankAccountName || "",
        Country: record.Country || "",
        Province: record.Province || "",
        Ward: record.Ward || "",
        StreetAddress: record.StreetAddress || "",
      RepresentativeName: record.RepresentativeName || "",
      RepresentativeEmail: record.RepresentativeEmail || "",
      RepresentativePhone: record.RepresentativePhone || "",
      RepresentativePosition: record.RepresentativePosition || "",
      DiscountRate: discountValue,
      CommissionRate: record.CommissionRate != null ? String(record.CommissionRate) : "",
      SalesStaff: record.SalesStaff || "",
      CustomerServiceStaff: record.CustomerServiceStaff || "",
      Notes: record.Notes || "",
      IsBlacklisted: record.IsBlacklisted || false,
      Status: record.Status || "Active",
      // Debt fields
      PaymentMethod: record.PaymentMethod || "",
      TotalDebt: record.TotalDebt || "",
      DebtTermDays: record.DebtTermDays || "",
      DebtLimit: record.DebtLimit || "",
      ContractEffectiveDate: record.ContractEffectiveDate 
        ? dayjs(record.ContractEffectiveDate) 
        : null,
      ContractEndDate: record.ContractEndDate 
        ? dayjs(record.ContractEndDate) 
        : null,
    });
    setIsModalVisible(true);
  };

  // Delete customer
  const handleDelete = async (clientId) => {
    try {
      await deleteCustomer(clientId);
      // Refresh list after delete
      const data = await fetchCustomers();
      setFilteredCustomers(data);
    } catch (error) {
      // Error đã được xử lý trong hook
    }
  };

  // Save customer (Add/Edit)
  const handleSave = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      const customerData = {
        CompanyName: values.CompanyName,
        CompanyNameEn: values.CompanyNameEn || "",
        TaxCode: values.TaxCode,
        InternalCode: values.InternalCode,
        CustomerType: values.CustomerType,
        Profession: values.Profession || "",
        Agent: values.Agent || "",
        IssueInvoice: values.IssueInvoice === "true" || values.IssueInvoice === true,
        BankName: values.BankName || "",
        BankAccountNumber: values.BankAccountNumber || "",
        BankAccountName: values.BankAccountName || "",
        Country: values.Country || "",
        Province: values.Province || "",
        Ward: values.Ward || "",
        StreetAddress: values.StreetAddress || "",
        RepresentativeName: values.RepresentativeName || "",
        RepresentativeEmail: values.RepresentativeEmail || "",
        RepresentativePhone: values.RepresentativePhone || "",
        RepresentativePosition: values.RepresentativePosition || "",
        DiscountRate: values.DiscountRate ? parseFloat(values.DiscountRate) : 0,
        CommissionRate: values.CommissionRate ? parseFloat(values.CommissionRate) : 0,
        SalesStaff: values.SalesStaff || "",
        CustomerServiceStaff: values.CustomerServiceStaff || "",
        Notes: values.Notes || "",
        IsBlacklisted: values.IsBlacklisted || false,
        Status: isActive ? "Active" : "Inactive",
        // Debt fields
        PaymentMethod: values.PaymentMethod || "",
        TotalDebt: values.TotalDebt ? parseFloat(values.TotalDebt) : 0,
        DebtTermDays: values.DebtTermDays ? parseInt(values.DebtTermDays) : 0,
        DebtLimit: values.DebtLimit || "",
        ContractEffectiveDate: values.ContractEffectiveDate 
          ? values.ContractEffectiveDate.format("YYYY-MM-DD") 
          : null,
        ContractEndDate: values.ContractEndDate 
          ? values.ContractEndDate.format("YYYY-MM-DD") 
          : null,
      };

      if (editingCustomer) {
        await updateCustomer(editingCustomer.ClientId, customerData);
      } else {
        await addCustomer(customerData);
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingCustomer(null);
      setActiveTab("general");
      setIsActive(true);
      
      // Data đã được cập nhật trong Redux, filteredCustomers sẽ tự động cập nhật qua useEffect
    } catch (error) {
      if (error.errorFields) {
        // Form validation error
        return;
      }
      // Error đã được xử lý trong hook
    }
  };

  // Handle cancel modal
  // History Modal Handlers
  const handleOpenHistory = () => {
    // TODO: Load history data from API when available
    // For now, using mock data
    const mockHistoryData = [
      {
        id: 1,
        date: "01/12/2024",
        activity: "Cập nhật thông tin chung",
        performer: {
          name: "Nguyễn Văn Minh",
          email: "contact@example.com"
        }
      },
      {
        id: 2,
        date: "01/12/2024",
        activity: "Cập nhật Forecast",
        performer: {
          name: "Admin",
          email: "Admin@example.com"
        }
      },
      {
        id: 3,
        date: "01/12/2024",
        activity: "Cập nhật Người liên hệ",
        performer: {
          name: "Nguyễn Văn Minh",
          email: "contact@example.com"
        }
      },
    ];
    setHistoryData(mockHistoryData);
    setIsHistoryModalVisible(true);
  };

  const handleCloseHistory = () => {
    setIsHistoryModalVisible(false);
    setHistoryData([]);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCustomer(null);
    setActiveTab("general");
    setIsActive(true);
    setIsViewMode(false); // Reset view mode
    setDebtFileList([]); // Reset debt file list
    setForecasts([]); // Reset forecasts
  };

  // Contact handlers
  const handleSaveContact = async (values) => {
    try {
      if (!clientId) {
        ui.notiError("Vui lòng lưu thông tin khách hàng trước khi thêm người liên hệ");
        return;
      }

      // Map UI format sang API format
      const contactData = {
        ClientId: clientId,
        FullName: values.name,
        Phone: values.phone,
        Email: values.email,
        Title: values.position || "",
        Department: values.department || "",
        // Roles có thể là array hoặc string tùy API
        // Nếu API hỗ trợ Roles field, thêm vào (dạng string hoặc array)
        Roles: Array.isArray(values.roles) ? values.roles.join(",") : (values.roles || ""),
        IsPrimary: values.isPrimary || false,
      };

      if (editingContact) {
        // Update existing contact
        await updateContactAPI(editingContact.originalData.ContactId, contactData);
      } else {
        // Add new contact
        await addContactAPI(contactData);
      }
      
      setIsContactModalVisible(false);
      contactForm.resetFields();
      setEditingContact(null);
    } catch (error) {
      // Error đã được xử lý trong hook
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    // Map từ API format sang UI format
    contactForm.setFieldsValue({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      position: contact.position,
      roles: contact.roles,
      department: contact.originalData?.Department || "",
      isPrimary: contact.originalData?.IsPrimary || false,
    });
    setIsContactModalVisible(true);
  };

  const handleDeleteContact = async (contactId) => {
    try {
      // Tìm contactId gốc từ API
      const contact = contacts.find(c => c.id === contactId);
      if (contact?.originalData?.ContactId) {
        await deleteContactAPI(contact.originalData.ContactId);
      }
    } catch (error) {
      // Error đã được xử lý trong hook
    }
  };

  // Forecast handlers
  const handleSaveForecast = async (values) => {
    try {
      if (!clientId) {
        ui.notiError("Vui lòng lưu thông tin khách hàng trước khi thêm forecast");
        return;
      }

      const forecastData = {
        ClientId: clientId,
        FromDate: values.fromDate.format("YYYY-MM-DD"),
        ToDate: values.toDate.format("YYYY-MM-DD"),
        ForecastAmount: values.forecastAmount ? parseFloat(values.forecastAmount) : 0,
        ActualRevenue: values.actualRevenue ? parseFloat(values.actualRevenue) : 0,
        UpdatedBy: {
          name: "Nguyễn Văn Minh", // TODO: Lấy từ user context
          email: "contact@example.com", // TODO: Lấy từ user context
        },
      };

      if (editingForecast) {
        // Update existing forecast
        setForecasts(forecasts.map(f => 
          f.id === editingForecast.id ? { ...forecastData, id: editingForecast.id } : f
        ));
        ui.notiSuccess("Cập nhật forecast thành công");
      } else {
        // Add new forecast
        setForecasts([...forecasts, { ...forecastData, id: Date.now().toString() }]);
        ui.notiSuccess("Thêm forecast thành công");
      }
      
      setIsForecastModalVisible(false);
      forecastForm.resetFields();
      setEditingForecast(null);
    } catch (error) {
      ui.notiError("Có lỗi xảy ra khi lưu forecast");
    }
  };

  const handleEditForecast = (forecast) => {
    setEditingForecast(forecast);
    forecastForm.setFieldsValue({
      fromDate: forecast.FromDate ? dayjs(forecast.FromDate) : null,
      toDate: forecast.ToDate ? dayjs(forecast.ToDate) : null,
      forecastAmount: forecast.ForecastAmount || "",
      actualRevenue: forecast.ActualRevenue || "",
    });
    setIsForecastModalVisible(true);
  };

  const handleViewForecast = (forecast) => {
    Modal.info({
      title: "Chi tiết Forecast",
      content: (
        <div>
          <p><strong>Từ ngày:</strong> {forecast.FromDate ? dayjs(forecast.FromDate).format("DD/MM/YYYY") : "N/A"}</p>
          <p><strong>Đến ngày:</strong> {forecast.ToDate ? dayjs(forecast.ToDate).format("DD/MM/YYYY") : "N/A"}</p>
          <p><strong>Forecast:</strong> {forecast.ForecastAmount ? new Intl.NumberFormat("vi-VN").format(forecast.ForecastAmount) : "0"}</p>
          <p><strong>Doanh số thực tế:</strong> {forecast.ActualRevenue ? new Intl.NumberFormat("vi-VN").format(forecast.ActualRevenue) : "0"}</p>
        </div>
      ),
    });
  };

  const handleDeleteForecast = (forecastId) => {
    setForecasts(forecasts.filter(f => f.id !== forecastId));
    ui.notiSuccess("Xóa forecast thành công");
  };

  // Forecast table columns
  const forecastColumns = [
    {
      title: "TỪ NGÀY",
      dataIndex: "FromDate",
      key: "FromDate",
      render: (date) => (
        <Space>
          <CalendarOutlined />
          <span>{date ? dayjs(date).format("DD/MM/YYYY") : "N/A"}</span>
        </Space>
      ),
    },
    {
      title: "ĐẾN NGÀY",
      dataIndex: "ToDate",
      key: "ToDate",
      render: (date) => (
        <Space>
          <CalendarOutlined />
          <span>{date ? dayjs(date).format("DD/MM/YYYY") : "N/A"}</span>
        </Space>
      ),
    },
    {
      title: "FORECAST",
      dataIndex: "ForecastAmount",
      key: "ForecastAmount",
      render: (amount) => (
        amount ? new Intl.NumberFormat("vi-VN").format(amount) : "0"
      ),
    },
    {
      title: "DOANH SỐ THỰC TẾ",
      dataIndex: "ActualRevenue",
      key: "ActualRevenue",
      render: (amount) => (
        <span style={{ color: "#52c41a" }}>
          {amount ? new Intl.NumberFormat("vi-VN").format(amount) : "0"}
        </span>
      ),
    },
    {
      title: "NGƯỜI CẬP NHẬT",
      dataIndex: "UpdatedBy",
      key: "UpdatedBy",
      render: (user) => (
        <div>
          <Space>
            <UserOutlined />
            <div>
              <div>{user?.name || "N/A"}</div>
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                {user?.email || ""}
              </div>
            </div>
          </Space>
        </div>
      ),
    },
    {
      title: "THAO TÁC",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewForecast(record)}
            style={{ color: "#1890ff" }}
            disabled={isViewMode}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditForecast(record)}
            style={{ color: "#52c41a" }}
            disabled={isViewMode}
          />
          <Popconfirm
            title="Xóa forecast"
            description="Bạn có chắc chắn muốn xóa forecast này?"
            onConfirm={() => handleDeleteForecast(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            disabled={isViewMode}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              disabled={isViewMode}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Export to Excel
  const handleExport = () => {
    try {
      const exportData = filteredCustomers.map((customer) => ({
        "Công ty/Doanh nghiệp": customer.CompanyName || "",
        "Mã số thuế": customer.TaxCode || "",
        "Mã nội bộ": customer.InternalCode || "",
        "Loại khách hàng": customer.CustomerType || "",
        "Người liên hệ": customer.RepresentativeName || "",
        "Email": customer.RepresentativeEmail || "",
        "Số điện thoại": customer.RepresentativePhone || "",
        "Địa chỉ": customer.Address || "",
        "Thành phố": customer.City || "",
        "Quốc gia": customer.Country || "",
        "Chiết khấu": customer.DiscountRate != null ? `${customer.DiscountRate}%` : "0%",
        "Trạng thái": customer.Status || "",
      }));

      exportToExcel(exportData, "Danh_sach_khach_hang.xlsx", {
        sheetName: "Khách hàng",
      });
      ui.notiSuccess("Xuất danh sách thành công");
    } catch (error) {
      handleError(error);
      ui.notiError("Lỗi khi xuất danh sách");
    }
  };


  return (
    <div className="customer-management">
      <Title level={2} className="mb-4">
        DANH SÁCH KHÁCH HÀNG
      </Title>

      {/* Search and Filter Section */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={24} md={16} lg={14} xl={12}>
          <Search
            placeholder="Tìm kiếm khách hàng"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
          />
        </Col>
        <Col xs={24} sm={24} md={8} lg={10} xl={12} className="text-right action-buttons-wrapper">
          <Space 
            size="small" 
            wrap
            className="desktop-horizontal-space"
          >
            <Button
              icon={<DownloadOutlined />}
              size="large"
              onClick={handleExport}
              className="mobile-block-button"
            >
              Xuất danh sách
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={handleAdd}
              className="mobile-block-button"
            >
              Thêm khách hàng
            </Button>
          </Space>
        </Col>
      </Row>
      
      {/* Filter Section - Row 1 */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500 }}>Status</label>
          </div>
          <Select
            placeholder="All"
            size="large"
            style={{ width: "100%" }}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              applyFilters(
                searchText,
                value,
                customerTypeFilter,
                blacklistFilter,
                industryFilter,
                areaFilter,
                companyFilter,
                salesInChargeFilter,
                agentFilter
              );
            }}
          >
            {statusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500 }}>Đối Tượng Khách Hàng</label>
          </div>
          <Select
            placeholder="All"
            size="large"
            style={{ width: "100%" }}
            value={customerTypeFilter}
            onChange={(value) => {
              setCustomerTypeFilter(value);
              applyFilters(
                searchText,
                statusFilter,
                value,
                blacklistFilter,
                industryFilter,
                areaFilter,
                companyFilter,
                salesInChargeFilter,
                agentFilter
              );
            }}
          >
            {customerTypeOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500 }}>Company*</label>
          </div>
          <Input
            placeholder="Select User"
            size="large"
            prefix={<UserOutlined />}
            value={companyFilter}
            onChange={(e) => {
              const value = e.target.value;
              setCompanyFilter(value);
              applyFilters(
                searchText,
                statusFilter,
                customerTypeFilter,
                blacklistFilter,
                industryFilter,
                areaFilter,
                value,
                salesInChargeFilter,
                agentFilter
              );
            }}
          />
        </Col>

        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500 }}>Sales In charge *</label>
          </div>
          <Input
            placeholder="Select Contact"
            size="large"
            prefix={<UserOutlined />}
            value={salesInChargeFilter}
            onChange={(e) => {
              const value = e.target.value;
              setSalesInChargeFilter(value);
              applyFilters(
                searchText,
                statusFilter,
                customerTypeFilter,
                blacklistFilter,
                industryFilter,
                areaFilter,
                companyFilter,
                value,
                agentFilter
              );
            }}
          />
        </Col>
      </Row>

      {/* Filter Section - Row 2 */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500 }}>Đại lý</label>
          </div>
          <Input
            placeholder="Select User"
            size="large"
            prefix={<UserOutlined />}
            value={agentFilter}
            onChange={(e) => {
              const value = e.target.value;
              setAgentFilter(value);
              applyFilters(
                searchText,
                statusFilter,
                customerTypeFilter,
                blacklistFilter,
                industryFilter,
                areaFilter,
                companyFilter,
                salesInChargeFilter,
                value
              );
            }}
          />
        </Col>

        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500 }}>Blacklist?</label>
          </div>
          <Select
            placeholder="All"
            size="large"
            style={{ width: "100%" }}
            value={blacklistFilter}
            onChange={(value) => {
              setBlacklistFilter(value);
              applyFilters(
                searchText,
                statusFilter,
                customerTypeFilter,
                value,
                industryFilter,
                areaFilter,
                companyFilter,
                salesInChargeFilter,
                agentFilter
              );
            }}
          >
            {blacklistOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500 }}>Ngành nghề</label>
          </div>
          <Select
            placeholder="All"
            size="large"
            style={{ width: "100%" }}
            value={industryFilter}
            onChange={(value) => {
              setIndustryFilter(value);
              applyFilters(
                searchText,
                statusFilter,
                customerTypeFilter,
                blacklistFilter,
                value,
                areaFilter,
                companyFilter,
                salesInChargeFilter,
                agentFilter
              );
            }}
          >
            {industryOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500 }}>Khu vực</label>
          </div>
          <Select
            placeholder="All"
            size="large"
            style={{ width: "100%" }}
            value={areaFilter}
            onChange={(value) => {
              setAreaFilter(value);
              applyFilters(
                searchText,
                statusFilter,
                customerTypeFilter,
                blacklistFilter,
                industryFilter,
                value,
                companyFilter,
                salesInChargeFilter,
                agentFilter
              );
            }}
          >
            {areaOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      {/* Customer Cards Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <Empty description="Không có khách hàng nào" />
      ) : (
        <Row gutter={[16, 16]} className="customer-cards-grid">
          {filteredCustomers.map((customer) => (
            <Col
              key={customer.ClientId}
              xs={24}
              sm={12}
              md={12}
              lg={8}
              xl={6}
            >
              <Card
                className="customer-card"
                hoverable
                actions={[
                  <Button
                    key="view"
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleView(customer)}
                    style={{ width: "100%", maxWidth: "300px" }}
                  >
                    Xem
                  </Button>,
                ]}
              >
                <div className="customer-card-content">
                  {/* Status Badge */}
                  <div className="customer-card-status">
                    {getCustomerTypeTag(customer.Status || "Active")}
                  </div>

                  {/* Company Name */}
                  <div className="customer-card-company">
                    <BankOutlined className="lucide lucide-building2 lucide-building-2 size-5 text-[#0f7798] mt-0.5 flex-shrink-0 company-icon" />
                    <span className="company-name">
                      {customer.CompanyName || "N/A"}
                    </span>
                  </div>

                  {/* Representative Info */}
                  <div className="customer-card-representative">
                    <div className="representative-label">Người đại diện</div>
                    <div className="representative-info">
                      <div className="info-item">
                        <UserOutlined className="info-icon" />
                        <span>{customer.RepresentativeName || "N/A"}</span>
                      </div>
                      <div className="info-item">
                        <MailOutlined className="info-icon" />
                        <span>{customer.RepresentativeEmail || "N/A"}</span>
                      </div>
                      <div className="info-item">
                        <PhoneFilled 
                          className="info-icon" 
                          style={{ transform: "scaleX(-1)" }}
                        />
                        <span>{customer.RepresentativePhone || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Industry & Location */}
                  <div className="customer-card-industry">
                    <span className="industry-profession">{customer.Profession || "N/A"}</span>
                    <span className="industry-city">• {customer.City || "N/A"}</span>
                  </div>

                  {/* Customer Type Badge */}
                  <div className="customer-card-type">
                    {getCustomerTypeTag(customer.CustomerType)}
                  </div>

                  {/* Financial Info */}
                  <div className="customer-card-financial">
                    <div className="financial-item">
                      <span className="financial-label">Forecast:</span>
                      <span className="financial-value forecast-value">
                        {customer.Forecast
                          ? new Intl.NumberFormat("vi-VN").format(
                              customer.Forecast
                            )
                          : "0"}{" "}
                      </span>
                    </div>
                    <div className="financial-item">
                      <span className="financial-label">Chiết khấu:</span>
                      <span className="financial-value discount-value">
                        {customer.DiscountRate != null
                          ? `${customer.DiscountRate}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1400}
        className="customer-form-modal-new"
        confirmLoading={loading}
        closable={false}
      >
        {/* Custom Header */}
        <div className="modal-header-custom">
          <Switch 
            checked={isActive} 
            onChange={setIsActive}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            disabled={isViewMode}
          />
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={handleCancel}
            className="modal-close-button"
          />
        </div>

        {/* Tabs Navigation with History Button */}
        <div className="tabs-with-history">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="customer-form-tabs"
            items={[
            { 
              key: "general", 
              label: "Thông tin chung",
            },
            { 
              key: "contacts", 
              label: (
                <span>
                  <UserOutlined /> Người liên hệ ({contacts.length})
                </span>
              ),
            },
            { 
              key: "debt", 
              label: (
                <span>
                  <DollarOutlined /> Quản lý công nợ
                </span>
              ),
            },
            { 
              key: "forecast", 
              label: (
                <span>
                  <LineChartOutlined /> Forecast
                </span>
              ),
            },
          ]}
          />
          <div className="history-button-wrapper">
            <Button 
              icon={<ClockCircleOutlined />}
              type="default"
              onClick={handleOpenHistory}
            >
              Lịch sử
            </Button>
          </div>
        </div>

        {/* Form Content */}
        {activeTab === "general" && (
          <div className="form-content-wrapper">
            <Form form={form} layout="vertical" className="customer-form" disabled={isViewMode}>
              {/* THÔNG TIN KHÁCH HÀNG Card */}
              <Card className="form-section-card">
                <div className="form-section-title">
                  <BankOutlined className="form-section-icon" />
                  <Title level={4} className="form-section-text">THÔNG TIN KHÁCH HÀNG</Title>
                </div>

                {/* Customer Type Radio Group */}
                <Form.Item
                  name="CustomerType"
                  label="Loại khách hàng"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại khách hàng" },
                  ]}
                  initialValue="Cá nhân"
                >
                  <Radio.Group>
                    <Radio value="Cá nhân">Cá nhân</Radio>
                    <Radio value="Doanh nghiệp">Doanh nghiệp</Radio>
                    <Radio value="Nhà nước">Nhà nước</Radio>
                    <Radio value="Đại lý">Đại lý</Radio>
                    <Radio value="CTV">CTV</Radio>
                  </Radio.Group>
                </Form.Item>

                {/* Two Column Layout */}
                <Row gutter={16}>
                  {/* Left Column */}
                  <Col span={12}>
                    <Form.Item
                      name="CompanyName"
                      label="Tên khách hàng"
                      rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
                    >
                      <Input placeholder="Tên khách hàng" />
                    </Form.Item>

                    <Form.Item
                      name="CompanyNameEn"
                      label="Tên khách hàng (Tiếng Anh)"
                    >
                      <Input placeholder="Tên khách hàng" disabled={true}/>
                    </Form.Item>

                    <Form.Item
                      name="Profession"
                      label="Ngành nghề"
                    >
                      <Select placeholder="---Chọn ngành nghề---">
                        {professionOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="Agent"
                      label="Đại lý/CTV"
                    >
                      <Select placeholder="---Chọn Đại Lý/CTV---">
                        {agentOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="IssueInvoice"
                      label="Xuất hóa đơn"
                    >
                      <Select placeholder="---Chọn---">
                        <Option value="true">Có</Option>
                        <Option value="false">Không</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Right Column */}
                  <Col span={12}>
                    <Form.Item
                      name="InternalCode"
                      label="Mã khách hàng nội bộ"
                      rules={[{ required: true, message: "Vui lòng nhập mã khách hàng nội bộ" }]}
                    >
                      <Input placeholder="Mã khách hàng" />
                    </Form.Item>

                    <Form.Item
                      name="TaxCode"
                      label="Mã số thuế"
                    >
                      <Input placeholder="Mã số thuế" />
                    </Form.Item>

                    <Form.Item
                      name="BankName"
                      label="Tên ngân hàng"
                    >
                      <Input placeholder="Tên ngân hàng" />
                    </Form.Item>

                    <Form.Item
                      name="BankAccountNumber"
                      label="Số tài khoản"
                    >
                      <Input placeholder="Số tài khoản" />
                    </Form.Item>

                    <Form.Item
                      name="BankAccountName"
                      label="Tên tài khoản"
                    >
                      <Input placeholder="Tên tài khoản" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* ĐỊA CHỈ DOANH NGHIỆP Card */}
              <Card className="form-section-card">
                <div className="form-section-title">
                  <EnvironmentOutlined className="form-section-icon" />
                  <Title level={4} className="form-section-text">ĐỊA CHỈ DOANH NGHIỆP</Title>
                </div>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="Country"
                      label="Quốc gia"
                      rules={[{ required: true, message: "Vui lòng chọn quốc gia" }]}
                    >
                      <Select placeholder="---Chọn Quốc gia---">
                        {countryOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      name="Province"
                      label="Tỉnh/Thành Phố"
                      rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
                    >
                      <Select placeholder="---Chọn Tỉnh/Thành Phố---">
                        {provinceOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      name="Ward"
                      label="Phường / Xã"
                      rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
                    >
                      <Select placeholder="---Chọn Phường/Xã---">
                        {wardOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="StreetAddress"
                      label="Địa chỉ + Tên đường"
                    >
                      <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* THÔNG TIN NGƯỜI ĐẠI DIỆN Card */}
              <Card className="form-section-card">
                <div className="form-section-title">
                  <UserOutlined className="form-section-icon" />
                  <Title level={4} className="form-section-text">THÔNG TIN NGƯỜI ĐẠI DIỆN</Title>
                </div>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="RepresentativeName"
                      label="Người đại diện"
                    >
                      <Input placeholder="Người Phụ trách" />
                    </Form.Item>

                    <Form.Item
                      name="RepresentativePosition"
                      label="Chức vụ"
                    >
                      <Input placeholder="Chức vụ" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="RepresentativeEmail"
                      label="Email người đại diện"
                      rules={[
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                      name="RepresentativePhone"
                      label="Số điện thoại người đại diện"
                    >
                      <Input placeholder="Số điện thoại" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* CHÍNH SÁCH Card */}
              <Card className="form-section-card">
                <div className="form-section-title">
                  <TagOutlined className="form-section-icon" />
                  <Title level={4} className="form-section-text">CHÍNH SÁCH</Title>
                </div>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="DiscountRate"
                      label="Giảm giá (%)"
                      rules={[
                        {
                          pattern: /^\d+(\.\d+)?$/,
                          message: "Vui lòng nhập số",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Mức giảm giá (%)"
                        suffix="%"
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="CommissionRate"
                      label="Chiết khấu (%)"
                      rules={[
                        {
                          pattern: /^\d+(\.\d+)?$/,
                          message: "Vui lòng nhập số",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Mức chiết khấu (%) (NOTE: VUI LÒNG NHẬP TỔNG)"
                        suffix="%"
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* THÔNG TIN NHÂN VIÊN PHỤ TRÁCH Card */}
              <Card className="form-section-card">
                <div className="form-section-title">
                  <TeamOutlined className="form-section-icon" />
                  <Title level={4} className="form-section-text">THÔNG TIN NHÂN VIÊN PHỤ TRÁCH</Title>
                </div>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="SalesStaff"
                      label="Nhân viên Kinh doanh (Sales)"
                      rules={[{ required: true, message: "Vui lòng chọn nhân viên kinh doanh" }]}
                    >
                      <Select placeholder="---Chọn nhân viên---">
                        {staffOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="CustomerServiceStaff"
                      label="Nhân viên chăm sóc khách hàng (CS)"
                      rules={[{ required: true, message: "Vui lòng chọn nhân viên chăm sóc khách hàng" }]}
                    >
                      <Select placeholder="---Chọn nhân viên---">
                        {staffOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* GHI CHÚ VÀ ĐÍNH KÈM Card */}
              <Card className="form-section-card">
                <div className="form-section-title">
                  <FileTextOutlined className="form-section-icon" />
                  <Title level={4} className="form-section-text">GHI CHÚ VÀ ĐÍNH KÈM</Title>
                </div>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="Notes"
                      label="Ghi chú"
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Ghi chú"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Đính kèm tài liệu"
                    >
                      <Upload
                        fileList={fileList}
                        onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                        beforeUpload={() => false}
                      >
                        <Button icon={<UploadOutlined />}>Tải lên</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* QUẢN LÝ BLACKLIST Card */}
              <Card className="form-section-card blacklist-card">
                <div className="form-section-title">
                  <WarningOutlined className="form-section-icon blacklist-icon" />
                  <Title level={4} className="form-section-text blacklist-text">QUẢN LÝ BLACKLIST</Title>
                </div>

                <Form.Item
                  name="IsBlacklisted"
                  valuePropName="checked"
                >
                  <Checkbox>Thêm vào danh sách đen (Blacklist)</Checkbox>
                </Form.Item>
              </Card>
            </Form>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === "contacts" && (
          <div className="contacts-tab-wrapper">
            <Form form={form} layout="vertical" className="customer-form" disabled={isViewMode}>
              {/* DANH SÁCH NGƯỜI LIÊN HỆ Card */}
              <Card className="form-section-card">
                <div className="form-section-title">
                  <Title level={4} className="form-section-text">DANH SÁCH NGƯỜI LIÊN HỆ</Title>
                  <div style={{ marginLeft: "auto" }}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setEditingContact(null);
                        contactForm.resetFields();
                        setIsContactModalVisible(true);
                      }}
                      disabled={isViewMode || !clientId}
                      className="add-contact-btn"
                    >
                      Thêm người liên hệ
                    </Button>
                  </div>
                </div>

                {/* Danh sách contacts */}
                <div className="contacts-list">
              {contactsLoading ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                  <Spin size="large" />
                </div>
              ) : contacts.length === 0 ? (
                <Empty description="Chưa có người liên hệ nào" />
              ) : (
                <Row gutter={[16, 16]}>
                  {contacts.map(contact => {
                    // Map roles to colors
                    const roleColors = {
                      "Người thanh toán": "#d4b3ff", // Tím nhạt
                      "Người gửi mẫu": "#b3e5fc",     // Xanh nhạt
                      "Người nhận kết quả": "#c8e6c9" // Xanh lá nhạt
                    };

                    return (
                      <Col xs={24} sm={12} md={12} lg={8} xl={6} key={contact.id}>
                        <Card className="contact-card">
                          {/* Tags section */}
                          <div className="contact-tags">
                            {contact.roles?.map(role => (
                              <Tag 
                                key={role} 
                                style={{ 
                                  backgroundColor: roleColors[role] || "#f0f0f0",
                                  border: "none",
                                  color: "#262626"
                                }}
                              >
                                {role}
                              </Tag>
                            ))}
                          </div>
                          
                          {/* Contact info */}
                          <div className="contact-info">
                            <div className="contact-item">
                              <span className="contact-label">Người liên hệ:</span>
                              <span className="contact-value">{contact.name}</span>
                            </div>
                            <div className="contact-item">
                              <span className="contact-label">Số điện thoại:</span>
                              <span className="contact-value">{contact.phone}</span>
                            </div>
                            <div className="contact-item">
                              <span className="contact-label">Email:</span>
                              <span className="contact-value">{contact.email}</span>
                            </div>
                            {contact.position && (
                              <div className="contact-item">
                                <span className="contact-label">Chức vụ:</span>
                                <span className="contact-value">{contact.position}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Action buttons */}
                          <div className="contact-actions">
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              onClick={() => handleEditContact(contact)}
                              className="contact-edit-btn"
                              disabled={isViewMode}
                            />
                            <Popconfirm
                              title="Xóa người liên hệ"
                              description="Bạn có chắc chắn muốn xóa người liên hệ này?"
                              onConfirm={() => handleDeleteContact(contact.id)}
                              okText="Xóa"
                              cancelText="Hủy"
                              disabled={isViewMode}
                            >
                              <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                danger
                                className="contact-delete-btn"
                                disabled={isViewMode}
                              />
                            </Popconfirm>
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              )}
                </div>
              </Card>
            </Form>
          </div>
        )}

        {activeTab === "debt" && (
          <div className="form-content-wrapper">
            <Form form={form} layout="vertical" className="customer-form" disabled={isViewMode}>
              {/* THÔNG TIN CÔNG NỢ Card */}
              <Card className="form-section-card">
                <div className="form-section-title">
                  <DollarOutlined className="form-section-icon" />
                  <Title level={4} className="form-section-text">THÔNG TIN CÔNG NỢ</Title>
                </div>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="PaymentMethod"
                      label="Hình thức thanh toán"
                    >
                      <Select placeholder="Hình thức thanh toán">
                        <Option value="cash">Tiền mặt</Option>
                        <Option value="bank_transfer">Chuyển khoản</Option>
                        <Option value="check">Séc</Option>
                        <Option value="credit_card">Thẻ tín dụng</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="TotalDebt"
                      label="Tổng công nợ"
                    >
                      <Input 
                        placeholder="Load từ MISA" 
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="DebtTermDays"
                      label="Thời hạn Công nợ (ngày)"
                    >
                      <Input placeholder="số ngày" type="number" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="DebtLimit"
                      label="Hạn mức dư nợ"
                    >
                      <Input placeholder="Hạn mức dư nợ" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="ContractEffectiveDate"
                      label="Tình trạng hợp đồng hiệu lực ngày"
                    >
                      <DatePicker
                        placeholder="--Chọn ngày--"
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="ContractEndDate"
                      label="Tình trạng hợp đồng kết thúc ngày"
                    >
                      <DatePicker
                        placeholder="--Chọn ngày--"
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Đính kèm tài liệu */}
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Đính kèm tài liệu"
                    >
                      <Upload
                        fileList={debtFileList}
                        onChange={({ fileList: newFileList }) => setDebtFileList(newFileList)}
                        beforeUpload={() => false}
                        disabled={isViewMode}
                      >
                        <Button icon={<UploadOutlined />} disabled={isViewMode}>Tải lên</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Form>
          </div>
        )}

        {activeTab === "forecast" && (
          <div className="forecast-tab-wrapper">
            <Form form={form} layout="vertical" className="customer-form" disabled={isViewMode}>
              {/* FORECAST Card */}
              <Card className="form-section-card">
                <div className="form-section-title">
                  <Title level={4} className="form-section-text">FORECAST</Title>
                  <div style={{ marginLeft: "auto" }}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setEditingForecast(null);
                        forecastForm.resetFields();
                        setIsForecastModalVisible(true);
                      }}
                      disabled={isViewMode || !clientId}
                      className="add-forecast-btn"
                    >
                      Thêm forecast
                    </Button>
                  </div>
                </div>

                {/* Forecast Table */}
                {forecasts.length > 0 ? (
                  <Table
                    columns={forecastColumns}
                    dataSource={forecasts}
                    rowKey="id"
                    pagination={false}
                    className="forecast-table"
                  />
                ) : (
                  <Empty description="Chưa có dữ liệu forecast" />
                )}
              </Card>
            </Form>
          </div>
        )}

        {/* Footer with Save and Cancel buttons */}
        <div className="modal-footer-custom">
          <Space>
            <Button onClick={handleCancel}>
              {isViewMode ? "Đóng" : "Hủy"}
            </Button>
            {!isViewMode && (
              <Button 
                type="primary"
                icon={<SaveOutlined />} 
                onClick={handleSave}
                loading={loading}
              >
                Lưu thay đổi
              </Button>
            )}
            {isViewMode && (
              <Button 
                type="primary"
                onClick={() => {
                  setIsViewMode(false); // Chuyển sang edit mode
                }}
              >
                Chỉnh sửa
              </Button>
            )}
          </Space>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Chi tiết khách hàng"
        open={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false);
          setViewingCustomer(null);
        }}
        footer={[
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setIsViewModalVisible(false);
              if (viewingCustomer) {
                handleEdit(viewingCustomer);
              }
            }}
          >
            Chỉnh sửa
          </Button>,
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {viewingCustomer && (
          <div>
            <p>
              <strong>Công ty/Doanh nghiệp:</strong> {viewingCustomer.CompanyName}
            </p>
            <p>
              <strong>Mã số thuế:</strong> {viewingCustomer.TaxCode || "N/A"}
            </p>
            <p>
              <strong>Mã nội bộ:</strong> {viewingCustomer.InternalCode || "N/A"}
            </p>
            <p>
              <strong>Loại khách hàng:</strong>{" "}
              {getCustomerTypeTag(viewingCustomer.CustomerType)}
            </p>
            <p>
              <strong>Người liên hệ:</strong> {viewingCustomer.RepresentativeName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {viewingCustomer.RepresentativeEmail || "N/A"}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {viewingCustomer.RepresentativePhone || "N/A"}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {viewingCustomer.Address || "N/A"}
            </p>
            <p>
              <strong>Thành phố:</strong> {viewingCustomer.City || "N/A"}
            </p>
            <p>
              <strong>Quốc gia:</strong> {viewingCustomer.Country || "N/A"}
            </p>
            <p>
              <strong>Chiết khấu:</strong> {viewingCustomer.DiscountRate != null ? `${viewingCustomer.DiscountRate}%` : "0%"}
            </p>
            <p>
              <strong>Trạng thái:</strong> {getCustomerTypeTag(viewingCustomer.Status)}
            </p>
          </div>
        )}
      </Modal>

      {/* Contact Modal */}
      <Modal
        title={editingContact ? "Chỉnh sửa người liên hệ" : "Thêm người liên hệ"}
        open={isContactModalVisible}
        onCancel={() => {
          setIsContactModalVisible(false);
          setEditingContact(null);
          contactForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={contactForm}
          layout="vertical"
          onFinish={handleSaveContact}
        >
          <Form.Item
            name="name"
            label="Người liên hệ"
            rules={[{ required: true, message: "Vui lòng nhập tên người liên hệ" }]}
          >
            <Input placeholder="Nhập tên người liên hệ" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="position"
            label="Chức vụ"
          >
            <Input placeholder="Nhập chức vụ" />
          </Form.Item>

          <Form.Item
            name="roles"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn ít nhất một vai trò" }]}
          >
            <Checkbox.Group>
              <Checkbox value="Người thanh toán">Người thanh toán</Checkbox>
              <Checkbox value="Người gửi mẫu">Người gửi mẫu</Checkbox>
              <Checkbox value="Người nhận kết quả">Người nhận kết quả</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => {
                setIsContactModalVisible(false);
                setEditingContact(null);
                contactForm.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingContact ? "Cập nhật" : "Thêm"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Forecast Modal */}
      <Modal
        title={editingForecast ? "Chỉnh sửa forecast" : "Thêm forecast"}
        open={isForecastModalVisible}
        onCancel={() => {
          setIsForecastModalVisible(false);
          setEditingForecast(null);
          forecastForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={forecastForm}
          layout="vertical"
          onFinish={handleSaveForecast}
        >
          <Form.Item
            name="fromDate"
            label="Từ ngày"
            rules={[{ required: true, message: "Vui lòng chọn từ ngày" }]}
          >
            <DatePicker
              placeholder="--Chọn ngày--"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="toDate"
            label="Đến ngày"
            rules={[{ required: true, message: "Vui lòng chọn đến ngày" }]}
          >
            <DatePicker
              placeholder="--Chọn ngày--"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="forecastAmount"
            label="Forecast"
            rules={[{ required: true, message: "Vui lòng nhập forecast" }]}
          >
            <Input
              placeholder="Nhập số tiền forecast"
              type="number"
            />
          </Form.Item>

          <Form.Item
            name="actualRevenue"
            label="Doanh số thực tế"
          >
            <Input
              placeholder="Nhập doanh số thực tế"
              type="number"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => {
                setIsForecastModalVisible(false);
                setEditingForecast(null);
                forecastForm.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingForecast ? "Cập nhật" : "Thêm"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* History Modal */}
      <Modal
        open={isHistoryModalVisible}
        onCancel={handleCloseHistory}
        footer={null}
        width={900}
        className="history-modal"
        title={
          <span style={{ color: "#007b8a", fontWeight: 600 }}>Lịch sử</span>
        }
      >
        <Table
          dataSource={historyData}
          columns={[
            {
              title: "NGÀY",
              dataIndex: "date",
              key: "date",
              width: 150,
              render: (date) => (
                <span>
                  <CalendarOutlined style={{ marginRight: 8, color: "#007b8a" }} />
                  {date}
                </span>
              ),
            },
            {
              title: "HOẠT ĐỘNG",
              dataIndex: "activity",
              key: "activity",
              render: (activity) => (
                <span style={{ color: "#1890ff" }}>{activity}</span>
              ),
            },
            {
              title: "NGƯỜI THỰC HIỆN",
              dataIndex: "performer",
              key: "performer",
              render: (performer) => (
                <div>
                  <div>
                    <UserOutlined style={{ marginRight: 8, color: "#007b8a" }} />
                    <strong>{performer.name}</strong>
                  </div>
                  <div style={{ color: "#8c8c8c", fontSize: "12px", marginLeft: 24 }}>
                    {performer.email}
                  </div>
                </div>
              ),
            },
          ]}
          pagination={false}
          rowKey="id"
          className="history-table"
        />
        <div style={{ textAlign: "right", marginTop: 24 }}>
          <Button onClick={handleCloseHistory}>
            Hủy
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerManagement;

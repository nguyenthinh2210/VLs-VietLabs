import { Button, Space, Tag, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

// Get customer type tag color
export const getCustomerTypeTag = (type) => {
  // Mapping từ tiếng Anh sang tiếng Việt
  const typeMapping = {
    "Enterprise": "Doanh nghiệp",
    "Individual": "Cá nhân",
    "Government": "Nhà nước",
    "Agent": "Đại lý",
    "SMB": "Doanh nghiệp vừa và nhỏ",
    "Prospect": "Tiềm năng",
  };

  // Convert type sang tiếng Việt nếu có mapping
  const displayType = typeMapping[type] || type;

  const tagConfig = {
    "Tiềm năng": { 
      color: "custom", 
      text: "Tiềm năng",
      style: { 
        backgroundColor: "#FFF9C4", // Vàng nhạt
        color: "#F57F17", // Vàng đậm
        border: "none",
        borderRadius: "5px",
        fontWeight: 600,
        padding: "4px 12px"
      }
    },
    "Doanh nghiệp vừa và nhỏ": { 
      color: "custom", 
      text: "Doanh nghiệp vừa và nhỏ",
      style: { 
        backgroundColor: "#E1F5FE", // Xanh dương nhạt
        color: "#0277BD", // Xanh dương đậm
        border: "none",
        borderRadius: "5px",
        fontWeight: 600,
        padding: "4px 12px"
      }
    },
    "Mới": { color: "blue", text: "Mới" },
    "VIP": { color: "purple", text: "VIP" },
    "Thường xuyên": { color: "cyan", text: "Thường xuyên" },
    "Enterprise": { 
      color: "custom", 
      text: "Doanh nghiệp",
      style: { 
        backgroundColor: "#E3F2FD", // Xanh nhạt
        color: "#1565C0", // Xanh đậm
        border: "none",
        borderRadius: "5px",
        fontWeight: 600,
        padding: "4px 12px"
      }
    },
    "Doanh nghiệp": { 
      color: "custom", 
      text: "Doanh nghiệp",
      style: { 
        backgroundColor: "#E3F2FD", // Xanh nhạt
        color: "#1565C0", // Xanh đậm
        border: "none",
        borderRadius: "5px",
        fontWeight: 600,
        padding: "4px 12px"
      }
    },
    "Cá nhân": { 
      color: "custom", 
      text: "Cá nhân",
      style: { 
        backgroundColor: "#E8F5E9", // Xanh lá nhạt
        color: "#2E7D32", // Xanh lá đậm
        border: "none",
        borderRadius: "5px",
        fontWeight: 600,
        padding: "4px 12px"
      }
    },
    "Nhà nước": { 
      color: "custom", 
      text: "Nhà nước",
      style: { 
        backgroundColor: "#F3E5F5", // Tím nhạt
        color: "#7B1FA2", // Tím đậm
        border: "none",
        borderRadius: "5px",
        fontWeight: 600,
        padding: "4px 12px"
      }
    },
    "Đại lý": { 
      color: "custom", 
      text: "Đại lý",
      style: { 
        backgroundColor: "#FFF3E0", // Cam nhạt
        color: "#E65100", // Cam đậm
        border: "none",
        borderRadius: "5px",
        fontWeight: 600,
        padding: "4px 12px"
      }
    },
    "Active": { 
      color: "custom", 
      text: "Active",
      style: { 
        backgroundColor: "#F1F8F4", 
        color: "#2E7D32", 
        border: "none",
        borderRadius: "5px",
        fontWeight: 600,
        padding: "4px 12px"
      }
    },
    "Inactive": { color: "red", text: "Inactive" },
  };
  
  // Sử dụng displayType (đã convert) để tìm config
  const config = tagConfig[displayType] || tagConfig[type] || { 
    color: "default", 
    text: displayType 
  };
  
  if (config.color === "custom" && config.style) {
    return <Tag style={config.style}>{config.text}</Tag>;
  }
  
  return <Tag color={config.color}>{config.text}</Tag>;
};

// export const getCustomerColumns = (handlers) => {
//   const { handleView, handleEdit, handleDelete } = handlers;

//   return [
//     {
//       title: "CÔNG TY/ DOANH NGHIỆP",
//       dataIndex: "CompanyName",
//       key: "CompanyName",
//       width: 160,
//       ellipsis: true,
//       align: "left",
//     },
//     {
//       title: "MÃ SỐ THUẾ",
//       dataIndex: "TaxCode",
//       key: "TaxCode",
//       width: 100,
//       align: "left",
//     },
//     {
//       title: "LOẠI KHÁCH HÀNG",
//       dataIndex: "CustomerType",
//       key: "CustomerType",
//       width: 130,
//       align: "left",
//       render: (type) => getCustomerTypeTag(type),
//     },
//     {
//       title: "NGƯỜI LIÊN HỆ",
//       dataIndex: "RepresentativeName",
//       key: "RepresentativeName",
//       width: 150,
//       align: "left",
//     },
//     {
//       title: "THÔNG TIN LIÊN HỆ",
//       key: "ContactInfo",
//       width: 200,
//       align: "left",
//       render: (_, record) => (
//         <div>
//           <div>{record.RepresentativeEmail}</div>
//           <div>{record.RepresentativePhone}</div>
//         </div>
//       ),
//     },
//     {
//       title: "ĐỊA CHỈ",
//       dataIndex: "Address",
//       key: "Address",
//       width: 150,
//       ellipsis: true,
//       align: "left",
//       render: (address, record) => {
//         const fullAddress = [
//           address,
//           record.City,
//           record.Country
//         ].filter(Boolean).join(", ");
//         return fullAddress || "N/A";
//       },
//     },
//     {
//       title: "CHIẾT KHẤU",
//       dataIndex: "DiscountRate",
//       key: "DiscountRate",
//       width: 80,
//       align: "left",
//       render: (rate) => rate != null ? `${rate}%` : "0%",
//     },
//     {
//       title: "THAO TÁC",
//       key: "action",
//       width: 130,
//       fixed: "right",
//       align: "left",
//       render: (_, record) => (
//         <Space size="small" wrap={false}>
//           <Button
//             type="link"
//             icon={<EyeOutlined />}
//             onClick={() => handleView(record)}
//             title="Xem chi tiết"
//             style={{ padding: 0 }}
//           />
//           <Button
//             type="link"
//             icon={<EditOutlined />}
//             onClick={() => handleEdit(record)}
//             title="Chỉnh sửa"
//             style={{ padding: 0 }}
//           />
//           <Popconfirm
//             title="Bạn có chắc chắn muốn xóa khách hàng này?"
//             onConfirm={() => handleDelete(record.ClientId)}
//             okText="Xóa"
//             cancelText="Hủy"
//           >
//             <Button
//               type="link"
//               danger
//               icon={<DeleteOutlined />}
//               title="Xóa"
//               style={{ padding: 0 }}
//             />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];
// };

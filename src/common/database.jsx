export const dataTable = [
  // Users
  {
    key: 'Person-1',
    name: 'Alice Johnson',
    context: 29,
    username: 'Los Angeles No. 2 Sunset Blvd',
    employeeNo: ['creative', 'designer'],
    departmentName: 'Marketing',
    jobTitle: 'Graphic Designer',
    jobType: 'Full-time',
    entity: 'Person',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'Person-2',
    name: 'Michael Smith',
    context: 35,
    username: 'San Francisco No. 3 Bay Area',
    employeeNo: ['strategist'],
    departmentName: 'Finance',
    jobTitle: 'Financial Analyst',
    jobType: 'Contract',
    entity: 'Person',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'Person-3',
    name: 'Sophia Lee',
    context: 41,
    username: 'Chicago No. 5 River Road',
    employeeNo: ['mentor', 'leader'],
    departmentName: 'Human Resources',
    jobTitle: 'HR Manager',
    jobType: 'Full-time',
    entity: 'Person',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'Person-4',
    name: 'Daniel Martinez',
    context: 27,
    username: 'Houston No. 7 Green Street',
    employeeNo: ['developer', 'innovator'],
    departmentName: 'Engineering',
    jobTitle: 'Software Engineer',
    jobType: 'Full-time',
    entity: 'Person',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'Person-5',
    name: 'Emma Wilson',
    context: 38,
    username: 'Boston No. 9 Ocean View',
    employeeNo: ['teacher', 'coach'],
    departmentName: 'Education',
    jobTitle: 'Professor',
    jobType: 'Part-time',
    entity: 'Person',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },

  // Groups
  {
    key: 'group-1',
    name: 'Marketing Team',
    context: 15, // Number of members
    username: 'Los Angeles HQ',
    employeeNo: ['creative', 'strategic'],
    departmentName: 'Marketing',
    jobTitle: 'Brand Management',
    jobType: 'Department',
    entity: 'Group',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'group-2',
    name: 'Finance Department',
    context: 10,
    username: 'Granting York HQ',
    employeeNo: ['analytical', 'risk management'],
    departmentName: 'Finance',
    jobTitle: 'Financial Analysis',
    jobType: 'Department',
    entity: 'Group',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'group-3',
    name: 'HR & Recruitment',
    context: 8,
    username: 'Chicago Office',
    employeeNo: ['recruitment', 'employee relations'],
    departmentName: 'Human Resources',
    jobTitle: 'Employee Support',
    jobType: 'Team',
    entity: 'Group',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'group-4',
    name: 'Engineering Squad',
    context: 20,
    username: 'San Francisco Lab',
    employeeNo: ['developers', 'QA testers'],
    departmentName: 'Engineering',
    jobTitle: 'Software Development',
    jobType: 'Team',
    entity: 'Group',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'group-5',
    name: 'Sales & Partnerships',
    context: 18,
    username: 'Miami Sales Hub',
    employeeNo: ['sales executives', 'account managers'],
    departmentName: 'Sales',
    jobTitle: 'Client Relations',
    jobType: 'Department',
    entity: 'Group',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  }
]

export const columnTable = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Context',
    dataIndex: 'context',
    key: 'context'
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: 'Employee No.',
    dataIndex: 'employeeNo',
    key: 'employeeNo',
    render: (employeeNo) => employeeNo.join(', ') // Hiển thị mảng employeeNo dưới dạng chuỗi
  },
  {
    title: 'Department Name',
    dataIndex: 'departmentName',
    key: 'departmentName'
  },
  {
    title: 'Job Title',
    dataIndex: 'jobTitle',
    key: 'jobTitle'
  },
  {
    title: 'Job Type',
    dataIndex: 'jobType',
    key: 'jobType'
  },
  {
    title: 'Entity',
    dataIndex: 'entity',
    key: 'entity', // Đảm bảo key này khớp với tên key trong dữ liệu
    render: (text) => (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          background: text === 'Person' ? '#E3F2FD' : '#FFE0B2',
          color: text === 'Person' ? '#0D47A1' : '#BF360C',
          fontWeight: 500
        }}>
        {text}
      </span>
    )
  }
]

export const columnTableSelected = [
  {
    title: 'User Name',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: 'Person Name',
    dataIndex: 'personname',
    key: 'personname'
  },
  {
    title: 'Domain Name',
    dataIndex: 'domainname',
    key: 'domainname  '
  },
  {
    title: 'Employee No.',
    dataIndex: 'employeeNo',
    key: 'employeeNo',
    render: (employeeNo) => employeeNo.join(', ') // Hiển thị mảng employeeNo dưới dạng chuỗi
  },
  {
    title: 'Department Name',
    dataIndex: 'departmentName',
    key: 'departmentName'
  },
  {
    title: 'Job Title',
    dataIndex: 'jobTitle',
    key: 'jobTitle'
  },
  {
    title: 'Job Type',
    dataIndex: 'jobType',
    key: 'jobType'
  },
  {
    title: 'Active Flag',
    dataIndex: 'activeflag',
    key: 'activeflag', // Đảm bảo key này khớp với tên key trong dữ liệu
    render: (text) => (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          background: text === 'True' ? '#EBF9F1' : '#FEF2E5',
          color: text === 'True' ? '#1F9254' : '#CD6200',
          fontWeight: 500
        }}>
        {text}
      </span>
    )
  }
]

export const dataTableSelectedGroup = [
  {
    key: 'group-1',
    name: 'Marketing Team',
    context: 15, // Number of members
    username: 'Los Angeles HQ',
    employeeNo: ['creative', 'strategic'],
    departmentName: 'Marketing',
    jobTitle: 'Brand Management',
    jobType: 'Department',
    entity: 'Group',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'group-2',
    name: 'Finance Department',
    context: 10,
    username: 'Granting York HQ',
    employeeNo: ['analytical', 'risk management'],
    departmentName: 'Finance',
    jobTitle: 'Financial Analysis',
    jobType: 'Department',
    entity: 'Group',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'group-3',
    name: 'HR & Recruitment',
    context: 8,
    username: 'Chicago Office',
    employeeNo: ['recruitment', 'employee relations'],
    departmentName: 'Human Resources',
    jobTitle: 'Employee Support',
    jobType: 'Team',
    entity: 'Group',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'group-4',
    name: 'Engineering Squad',
    context: 20,
    username: 'San Francisco Lab',
    employeeNo: ['developers', 'QA testers'],
    departmentName: 'Engineering',
    jobTitle: 'Software Development',
    jobType: 'Team',
    entity: 'Group',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'group-5',
    name: 'Sales & Partnerships',
    context: 18,
    username: 'Miami Sales Hub',
    employeeNo: ['sales executives', 'account managers'],
    departmentName: 'Sales',
    jobTitle: 'Client Relations',
    jobType: 'Department',
    entity: 'Group',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  }
]

export const dataTableSelectedPerson = [
  {
    key: 'user-1',
    name: 'Alice Johnson',
    context: 29,
    username: 'Los Angeles No. 2 Sunset Blvd',
    employeeNo: ['creative', 'designer'],
    departmentName: 'Marketing',
    jobTitle: 'Graphic Designer',
    jobType: 'Full-time',
    entity: 'User',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'user-2',
    name: 'Michael Smith',
    context: 35,
    username: 'San Francisco No. 3 Bay Area',
    employeeNo: ['strategist'],
    departmentName: 'Finance',
    jobTitle: 'Financial Analyst',
    jobType: 'Contract',
    entity: 'User',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'user-3',
    name: 'Sophia Lee',
    context: 41,
    username: 'Chicago No. 5 River Road',
    employeeNo: ['mentor', 'leader'],
    departmentName: 'Human Resources',
    jobTitle: 'HR Manager',
    jobType: 'Full-time',
    entity: 'User',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'user-4',
    name: 'Daniel Martinez',
    context: 27,
    username: 'Houston No. 7 Green Street',
    employeeNo: ['developer', 'innovator'],
    departmentName: 'Engineering',
    jobTitle: 'Software Engineer',
    jobType: 'Full-time',
    entity: 'User',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  },
  {
    key: 'user-5',
    name: 'Emma Wilson',
    context: 38,
    username: 'Boston No. 9 Ocean View',
    employeeNo: ['teacher', 'coach'],
    departmentName: 'Education',
    jobTitle: 'Professor',
    jobType: 'Part-time',
    entity: 'User',
    activeflag: Math.random() > 0.5 ? 'True' : 'False' // Random active flag
  }
]

export const dataMenuUserGroup = {
  Person: [
    { key: '1', label: 'Members' },
    { key: '2', label: 'Profiles' },
    { key: '3', label: 'Permissions' }
  ],
  Group: [
    { key: '1', label: 'Groups' },
    { key: '2', label: 'Profiles' },
    { key: '3', label: 'Permissions' }
  ]
}

//DATABASE CUA PPROFILE----------------------
export const dataProfileTable = [
  {
    key: 'hr',
    profilename: 'Human Resources',
    description: 'Quản lý mối quan hệ nhân viên, tuyển dụng và bảng lương.',
    accessible: 'Yes' // Cột accessible
  },
  {
    key: 'inventory',
    profilename: 'Inventory',
    description: 'Chịu trách nhiệm quản lý tồn kho sản phẩm và phân phối.',
    accessible: 'No' // Cột accessible
  },
  {
    key: 'laboratory',
    profilename: 'Laboratory',
    description: 'Xử lý các công việc nghiên cứu và phát triển cho việc thử nghiệm sản phẩm.',
    accessible: 'Yes' // Cột accessible
  },
  {
    key: 'pharmacy',
    profilename: 'Pharmacy',
    description: 'Quản lý dược phẩm, cung cấp thuốc và hỗ trợ tư vấn y tế.',
    accessible: 'Yes' // Cột accessible
  },
  {
    key: 'training',
    profilename: 'Training',
    description: 'Tổ chức các khóa đào tạo và phát triển kỹ năng cho nhân viên.',
    accessible: 'No' // Cột accessible
  },
  {
    key: 'marketing',
    profilename: 'Marketing',
    description: 'Tập trung vào việc quảng bá sản phẩm và dịch vụ đến khách hàng mục tiêu.',
    accessible: 'Yes' // Cột accessible
  },
  {
    key: 'finance',
    profilename: 'Finance',
    description: 'Quản lý kế hoạch tài chính, quản trị rủi ro và kế toán của công ty.',
    accessible: 'No' // Cột accessible
  }
]

export const columnProfileTable = [
  {
    title: 'Profile’s Name',
    dataIndex: 'profilename',
    key: 'profilename',
    width: '70%'
  },
  {
    title: 'Accessible',
    dataIndex: 'accessible',
    key: 'accessible',
    width: '20%', // Đảm bảo key này khớp với tên key trong dữ liệu
    render: (text) => (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          background: text === 'No' ? '#FEF2E5' : '#EBF9F1',
          color: text === 'Yes' ? '#1F9254' : '#CD6200',
          fontWeight: 500
        }}>
        {text}
      </span>
    )
  }
]

export const dataProfileNoAccessibleTable = [
  {
    key: 'hr',
    profilename: 'Human Resources',
    description: 'Quản lý mối quan hệ nhân viên, tuyển dụng và bảng lương.'
  },
  {
    key: 'inventory',
    profilename: 'Inventory',
    description: 'Chịu trách nhiệm quản lý tồn kho sản phẩm và phân phối.'
  },
  {
    key: 'laboratory',
    profilename: 'Laboratory',
    description: 'Xử lý các công việc nghiên cứu và phát triển cho việc thử nghiệm sản phẩm.'
  },
  {
    key: 'pharmacy',
    profilename: 'Pharmacy',
    description: 'Quản lý dược phẩm, cung cấp thuốc và hỗ trợ tư vấn y tế.'
  },
  {
    key: 'training',
    profilename: 'Training',
    description: 'Tổ chức các khóa đào tạo và phát triển kỹ năng cho nhân viên.'
  },
  {
    key: 'marketing',
    profilename: 'Marketing',
    description: 'Tập trung vào việc quảng bá sản phẩm và dịch vụ đến khách hàng mục tiêu.'
  },
  {
    key: 'finance',
    profilename: 'Finance',
    description: 'Quản lý kế hoạch tài chính, quản trị rủi ro và kế toán của công ty.'
  }
]

export const columnProfileNoAccessibleTable = [
  {
    title: 'Profile’s Name',
    dataIndex: 'profilename',
    key: 'profilename'
  }
]
//-------------------------------------------

//DATABASE CUA PERMISSION--------------------
export const dataFunctionTable = [
  { title: 'Recruitment', key: 'hr-recruitment', parentKey: 'hr' },
  { title: 'Employee Relations', key: 'hr-relations', parentKey: 'hr' },
  { title: 'Payroll Management', key: 'hr-payroll', parentKey: 'hr' },
  { title: 'Stock Management', key: 'inventory-stock', parentKey: 'inventory' },
  { title: 'Order Fulfillment', key: 'inventory-order', parentKey: 'inventory' },
  { title: 'Supply Chain', key: 'inventory-supply', parentKey: 'inventory' },
  { title: 'Research and Development', key: 'laboratory-research', parentKey: 'laboratory' },
  { title: 'Product Testing', key: 'laboratory-testing', parentKey: 'laboratory' },
  { title: 'Data Analysis', key: 'laboratory-analysis', parentKey: 'laboratory' },
  { title: 'Inventory Management', key: 'pharmacy-inventory', parentKey: 'pharmacy' },
  { title: 'Prescription Fulfillment', key: 'pharmacy-prescription', parentKey: 'pharmacy' },
  { title: 'Consultation Services', key: 'pharmacy-consultation', parentKey: 'pharmacy' },
  { title: 'Financial Planning', key: 'finance-planning', parentKey: 'finance' },
  { title: 'Risk Management', key: 'finance-risk', parentKey: 'finance' },
  { title: 'Accounting', key: 'finance-accounting', parentKey: 'finance' },
  { title: 'Brand Awareness', key: 'marketing-brand', parentKey: 'marketing' },
  { title: 'Market Research', key: 'marketing-research', parentKey: 'marketing' },
  { title: 'Advertising Campaigns', key: 'marketing-campaigns', parentKey: 'marketing' },
  { title: 'Employee Skill Development', key: 'training-skill', parentKey: 'training' },
  { title: 'Leadership Training', key: 'training-leadership', parentKey: 'training' },
  { title: 'Compliance Training', key: 'training-compliance', parentKey: 'training' }
]

export const columnFunctionTable = []
//-------------------------------------------

//DATABASE CUA FUNCTION----------------------
export const columnPermissionTable = [
  {
    title: 'Function Name',
    dataIndex: 'functionname',
    key: 'functionname',
    width: '30%'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: '50%'
  },
  {
    title: '',
    dataIndex: 'accessible',
    key: 'accessible',
    width: '20%', // Đảm bảo key này khớp với tên key trong dữ liệu
    render: (text) => (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          background: text === 'Grant' ? '#D8EDE1' : text === 'Deny' ? '#FACCC4' : '#D2CBCB',
          color: text === 'Grant' ? '#1F9254' : text === 'Deny' ? '#BE2020' : '#726D6D',
          fontWeight: 500
        }}>
        {text}
      </span>
    )
  }
]

export const dataPermissionTable = [
  // Human Resources Permissions
  // Recruitment Permissions
  {
    key: 'hr-recruitment-view',
    functionname: 'View Recruitment',
    description: 'Xem thông tin tuyển dụng.',
    accessible: 'Grant',
    parentKey: 'hr-recruitment'
  },
  {
    key: 'hr-recruitment-edit',
    functionname: 'Edit Recruitment',
    description: 'Chỉnh sửa thông tin tuyển dụng.',
    accessible: 'Grant',
    parentKey: 'hr-recruitment'
  },
  {
    key: 'hr-recruitment-Denying',
    functionname: 'Denying Recruitment',
    description: 'Xóa thông tin tuyển dụng.',
    accessible: 'Deny',
    parentKey: 'hr-recruitment'
  },

  // Employee Relations Permissions
  {
    key: 'hr-relations-view',
    functionname: 'View Employee Relations',
    description: 'Xem thông tin quan hệ nhân viên.',
    accessible: 'Grant',
    parentKey: 'hr-relations'
  },
  {
    key: 'hr-relations-edit',
    functionname: 'Edit Employee Relations',
    description: 'Chỉnh sửa thông tin quan hệ nhân viên.',
    accessible: 'Grant',
    parentKey: 'hr-relations'
  },
  {
    key: 'hr-relations-Denying',
    functionname: 'Denying Employee Relations',
    description: 'Xóa thông tin quan hệ nhân viên.',
    accessible: 'Deny',
    parentKey: 'hr-relations'
  },

  // Payroll Management Permissions
  {
    key: 'hr-payroll-view',
    functionname: 'View Payroll Management',
    description: 'Xem thông tin quản lý bảng lương.',
    accessible: 'Grant',
    parentKey: 'hr-payroll'
  },
  {
    key: 'hr-payroll-edit',
    functionname: 'Edit Payroll Management',
    description: 'Chỉnh sửa thông tin quản lý bảng lương.',
    accessible: 'Grant',
    parentKey: 'hr-payroll'
  },
  {
    key: 'hr-payroll-Denying',
    functionname: 'Denying Payroll Management',
    description: 'Xóa thông tin quản lý bảng lương.',
    accessible: 'Deny',
    parentKey: 'hr-payroll'
  },

  // Marketing Permissions
  // Brand Awareness Permissions
  {
    key: 'marketing-brand-view',
    functionname: 'View Brand Awareness',
    description: 'Xem thông tin nhận diện thương hiệu.',
    accessible: 'Grant',
    parentKey: 'marketing-brand'
  },
  {
    key: 'marketing-brand-edit',
    functionname: 'Edit Brand Awareness',
    description: 'Chỉnh sửa thông tin nhận diện thương hiệu.',
    accessible: 'Grant',
    parentKey: 'marketing-brand'
  },
  {
    key: 'marketing-brand-Denying',
    functionname: 'Denying Brand Awareness',
    description: 'Xóa thông tin nhận diện thương hiệu.',
    accessible: 'Deny',
    parentKey: 'marketing-brand'
  },

  // Market Research Permissions
  {
    key: 'marketing-research-view',
    functionname: 'View Market Research',
    description: 'Xem thông tin nghiên cứu thị trường.',
    accessible: 'Grant',
    parentKey: 'marketing-research'
  },
  {
    key: 'marketing-research-edit',
    functionname: 'Edit Market Research',
    description: 'Chỉnh sửa thông tin nghiên cứu thị trường.',
    accessible: 'Grant',
    parentKey: 'marketing-research'
  },
  {
    key: 'marketing-research-Denying',
    functionname: 'Denying Market Research',
    description: 'Xóa thông tin nghiên cứu thị trường.',
    accessible: 'Deny',
    parentKey: 'marketing-research'
  },

  // Advertising Campaigns Permissions
  {
    key: 'marketing-campaigns-view',
    functionname: 'View Advertising Campaigns',
    description: 'Xem các chiến dịch quảng cáo.',
    accessible: 'Grant',
    parentKey: 'marketing-campaigns'
  },
  {
    key: 'marketing-campaigns-edit',
    functionname: 'Edit Advertising Campaigns',
    description: 'Chỉnh sửa các chiến dịch quảng cáo.',
    accessible: 'Grant',
    parentKey: 'marketing-campaigns'
  },
  {
    key: 'marketing-campaigns-Denying',
    functionname: 'Denying Advertising Campaigns',
    description: 'Xóa các chiến dịch quảng cáo.',
    accessible: 'Deny',
    parentKey: 'marketing-campaigns'
  }
]
//-------------------------------------------
export const dataTree = [
  {
    title: 'Human Resources',
    key: 'hr',
    parentKey: 'hr', // Thêm parentKey
    children: [
      { title: 'Recruitment', key: 'hr-recruitment', parentKey: 'hr' },
      { title: 'Employee Relations', key: 'hr-relations', parentKey: 'hr' },
      { title: 'Payroll Management', key: 'hr-payroll', parentKey: 'hr' }
    ]
  },
  {
    title: 'Inventory',
    key: 'inventory',
    parentKey: 'inventory', // Thêm parentKey
    children: [
      { title: 'Stock Management', key: 'inventory-stock', parentKey: 'inventory' },
      { title: 'Order Fulfillment', key: 'inventory-order', parentKey: 'inventory' },
      { title: 'Supply Chain', key: 'inventory-supply', parentKey: 'inventory' }
    ]
  },
  {
    title: 'Laboratory',
    key: 'laboratory',
    parentKey: 'laboratory', // Thêm parentKey
    children: [
      { title: 'Research and Development', key: 'laboratory-research', parentKey: 'laboratory' },
      { title: 'Product Testing', key: 'laboratory-testing', parentKey: 'laboratory' },
      { title: 'Data Analysis', key: 'laboratory-analysis', parentKey: 'laboratory' }
    ]
  },
  {
    title: 'Pharmacy',
    key: 'pharmacy',
    parentKey: 'pharmacy', // Thêm parentKey
    children: [
      { title: 'Inventory Management', key: 'pharmacy-inventory', parentKey: 'pharmacy' },
      { title: 'Prescription Fulfillment', key: 'pharmacy-prescription', parentKey: 'pharmacy' },
      { title: 'Consultation Services', key: 'pharmacy-consultation', parentKey: 'pharmacy' }
    ]
  },
  {
    title: 'Training',
    key: 'training',
    parentKey: 'training', // Thêm parentKey
    children: [
      { title: 'Employee Skill Development', key: 'training-skill', parentKey: 'training' },
      { title: 'Leadership Training', key: 'training-leadership', parentKey: 'training' },
      { title: 'Compliance Training', key: 'training-compliance', parentKey: 'training' }
    ]
  },
  {
    title: 'Marketing',
    key: 'marketing',
    parentKey: 'marketing', // Thêm parentKey
    children: [
      { title: 'Brand Awareness', key: 'marketing-brand', parentKey: 'marketing' },
      { title: 'Market Research', key: 'marketing-research', parentKey: 'marketing' },
      { title: 'Advertising Campaigns', key: 'marketing-campaigns', parentKey: 'marketing' }
    ]
  },
  {
    title: 'Finance',
    key: 'finance',
    parentKey: 'finance', // Thêm parentKey
    children: [
      { title: 'Financial Planning', key: 'finance-planning', parentKey: 'finance' },
      { title: 'Risk Management', key: 'finance-risk', parentKey: 'finance' },
      { title: 'Accounting', key: 'finance-accounting', parentKey: 'finance' }
    ]
  }
]
//DATABASE CUA GROUP RELATED
export const columnUserGroupRelatedTable = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '40%'
  },
  {
    title: 'Organazation Unit',
    dataIndex: 'organazationunit',
    key: 'organazationunit',
    width: '40%'
  },
  {
    title: '',
    dataIndex: 'status',
    key: 'status',
    width: '20%', // Đảm bảo key này khớp với tên key trong dữ liệu
    render: (text) => (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          background: text === 'Denying' ? '#FEF2E5' : '#EBF9F1',
          color: text === 'Granting' ? '#1F9254' : '#CD6200',
          fontWeight: 500
        }}>
        {text}
      </span>
    )
  }
]

export const dataUserGroupRelateTable = [
  {
    name: 'System Administrator',
    organazationunit: 'FVH',
    status: 'Granting'
  },
  {
    name: 'Group Dev',
    organazationunit: 'FVH',
    status: 'Denying'
  }
]

export const columnMyRequestTable = [
  {
    title: 'Permission Name',
    dataIndex: 'perminssionname',
    key: 'perminssionname',
    width: '40%'
  },
  {
    title: 'Function Name',
    dataIndex: 'functionname',
    key: 'functionname',
    width: '40%'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: '40%'
  },
  {
    title: 'Created',
    dataIndex: 'created',
    key: 'created',
    width: '40%'
  },
  {
    title: 'Type Request',
    dataIndex: 'typerequest',
    key: 'typerequest',
    width: '20%',
    render: (text) => (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          background: text === 'Denying' ? '#FEF2E5' : '#EBF9F1',
          color: text === 'Granting' ? '#1F9254' : '#CD6200',
          fontWeight: 500
        }}>
        {text}
      </span>
    )
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '40%',
    render: (text) => (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          background:
            text === 'Rejected'
              ? '#FEF2E5'
              : text === 'Waiting for approval'
              ? '#D2CBCB'
              : '#EBF9F1',
          color:
            text === 'Approved'
              ? '#1F9254'
              : text === 'Waiting for approval'
              ? '#726D6D'
              : '#CD6200',
          fontWeight: 500
        }}>
        {text}
      </span>
    )
  }
]

export const dataMyRequestTable = [
  {
    key: '1',
    requestorname: 'Michael Smith',
    typerequest: 'Granting',
    perminssionname: 'View Recruitment',
    functionname: 'Recruitment',
    description: 'Xem thông tin tuyển dụng.',
    created: '2024-02-18',
    status: 'Waiting for approval'
  },
  {
    key: '2',
    requestorname: 'Michael Smith',
    typerequest: 'Granting',
    perminssionname: 'Edit Payroll Management',
    functionname: 'Payroll Management',
    description: 'Chỉnh sửa thông tin bảng lương.',
    created: '2024-02-17',
    status: 'Approved'
  },
  {
    key: '3',
    requestorname: 'Michael Smith',
    typerequest: 'Denying',
    perminssionname: 'Denying Market Research',
    functionname: 'Market Research',
    description: 'Xóa thông tin nghiên cứu thị trường.',
    created: '2024-02-16',
    status: 'Rejected'
  },
  {
    key: '4',
    requestorname: 'Michael Smith',
    typerequest: 'Granting',
    perminssionname: 'View Advertising Campaigns',
    functionname: 'Advertising Campaigns',
    description: 'Xem các chiến dịch quảng cáo.',
    created: '2024-02-15',
    status: 'Waiting for approval'
  },
  {
    key: '5',
    requestorname: 'Michael Smith',
    typerequest: 'Granting',
    perminssionname: 'Edit Financial Planning',
    functionname: 'Financial Planning',
    description: 'Chỉnh sửa kế hoạch tài chính.',
    created: '2024-02-14',
    status: 'Approved'
  }
]

export const columnMyApprovalTable = [
  {
    title: 'Requestor Name',
    dataIndex: 'requestorname',
    key: 'requestorname',
    width: '40%'
  },

  {
    title: 'Permission Name',
    dataIndex: 'perminssionname',
    key: 'perminssionname',
    width: '40%'
  },
  {
    title: 'Function Name',
    dataIndex: 'functionname',
    key: 'functionname',
    width: '40%'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: '40%'
  },
  {
    title: 'Created',
    dataIndex: 'created',
    key: 'created',
    width: '40%'
  },
  {
    title: 'Type Request',
    dataIndex: 'typerequest',
    key: 'typerequest',
    width: '20%',
    render: (text) => (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          background: text === 'Denying' ? '#FEF2E5' : '#EBF9F1',
          color: text === 'Granting' ? '#1F9254' : '#CD6200',
          fontWeight: 500
        }}>
        {text}
      </span>
    )
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: '40%',
    render: (text) => (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          background:
            text === 'Rejected'
              ? '#FEF2E5'
              : text === 'Waiting for approval'
              ? '#D2CBCB'
              : '#EBF9F1',
          color:
            text === 'Approved'
              ? '#1F9254'
              : text === 'Waiting for approval'
              ? '#726D6D'
              : '#CD6200',
          fontWeight: 500
        }}>
        {text}
      </span>
    )
  }
]

export const dataMyApprovalTable = [
  {
    key: '1',
    requestorname: 'Nguyễn Văn A',
    typerequest: 'Granting',
    perminssionname: 'View Recruitment',
    functionname: 'Recruitment',
    description: 'Xem thông tin tuyển dụng.',
    created: '2024-02-18',
    status: 'Waiting for approval'
  },
  {
    key: '2',
    requestorname: 'Trần Thị B',
    typerequest: 'Granting',
    perminssionname: 'Edit Payroll Management',
    functionname: 'Payroll Management',
    description: 'Chỉnh sửa thông tin bảng lương.',
    created: '2024-02-17',
    status: 'Approved'
  },
  {
    key: '3',
    requestorname: 'Lê Văn C',
    typerequest: 'Denying',
    perminssionname: 'Denying Market Research',
    functionname: 'Market Research',
    description: 'Xóa thông tin nghiên cứu thị trường.',
    created: '2024-02-16',
    status: 'Rejected'
  },
  {
    key: '4',
    requestorname: 'Phạm Minh D',
    typerequest: 'Granting',
    perminssionname: 'View Advertising Campaigns',
    functionname: 'Advertising Campaigns',
    description: 'Xem các chiến dịch quảng cáo.',
    created: '2024-02-15',
    status: 'Waiting for approval'
  },
  {
    key: '5',
    requestorname: 'Đặng Thị E',
    typerequest: 'Granting',
    perminssionname: 'Edit Financial Planning',
    functionname: 'Financial Planning',
    description: 'Chỉnh sửa kế hoạch tài chính.',
    created: '2024-02-14',
    status: 'Approved'
  }
]

export const menuTypeRequestDropdown = [
  { label: 'Granting', value: 'Granting' },
  { label: 'Denying', value: 'Denying' }
]

export const columnFunctionalityTable = [
  {
    title: 'Function Name',
    dataIndex: 'functionname',
    key: 'functionname',
    width: '30%'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: '50%'
  }
  // {
  //   title: '',
  //   dataIndex: 'accessible',
  //   key: 'accessible',
  //   width: '20%', // Đảm bảo key này khớp với tên key trong dữ liệu
  //   render: (text) => (
  //     <span
  //       style={{
  //         padding: '4px 8px',
  //         borderRadius: '4px',
  //         background: text === 'Grant' ? '#D8EDE1' : text === 'Deny' ? '#FACCC4' : '#D2CBCB',
  //         color: text === 'Grant' ? '#1F9254' : text === 'Deny' ? '#BE2020' : '#726D6D',
  //         fontWeight: 500
  //       }}>
  //       {text}
  //     </span>
  //   )
  // }
]

export const dataFunctionalityTable = [
  // Human Resources Permissions
  // Recruitment Permissions
  {
    key: 'hr-recruitment-view',
    functionname: 'View Recruitment',
    description: 'Xem thông tin tuyển dụng.',

    parentKey: 'hr-recruitment'
  },
  {
    key: 'hr-recruitment-edit',
    functionname: 'Edit Recruitment',
    description: 'Chỉnh sửa thông tin tuyển dụng.',

    parentKey: 'hr-recruitment'
  },
  {
    key: 'hr-recruitment-Denying',
    functionname: 'Denying Recruitment',
    description: 'Xóa thông tin tuyển dụng.',

    parentKey: 'hr-recruitment'
  },

  // Employee Relations Permissions
  {
    key: 'hr-relations-view',
    functionname: 'View Employee Relations',
    description: 'Xem thông tin quan hệ nhân viên.',

    parentKey: 'hr-relations'
  },
  {
    key: 'hr-relations-edit',
    functionname: 'Edit Employee Relations',
    description: 'Chỉnh sửa thông tin quan hệ nhân viên.',

    parentKey: 'hr-relations'
  },
  {
    key: 'hr-relations-Denying',
    functionname: 'Denying Employee Relations',
    description: 'Xóa thông tin quan hệ nhân viên.',

    parentKey: 'hr-relations'
  },

  // Payroll Management Permissions
  {
    key: 'hr-payroll-view',
    functionname: 'View Payroll Management',
    description: 'Xem thông tin quản lý bảng lương.',

    parentKey: 'hr-payroll'
  },
  {
    key: 'hr-payroll-edit',
    functionname: 'Edit Payroll Management',
    description: 'Chỉnh sửa thông tin quản lý bảng lương.',

    parentKey: 'hr-payroll'
  },
  {
    key: 'hr-payroll-Denying',
    functionname: 'Denying Payroll Management',
    description: 'Xóa thông tin quản lý bảng lương.',

    parentKey: 'hr-payroll'
  },

  // Marketing Permissions
  // Brand Awareness Permissions
  {
    key: 'marketing-brand-view',
    functionname: 'View Brand Awareness',
    description: 'Xem thông tin nhận diện thương hiệu.',

    parentKey: 'marketing-brand'
  },
  {
    key: 'marketing-brand-edit',
    functionname: 'Edit Brand Awareness',
    description: 'Chỉnh sửa thông tin nhận diện thương hiệu.',

    parentKey: 'marketing-brand'
  },
  {
    key: 'marketing-brand-Denying',
    functionname: 'Denying Brand Awareness',
    description: 'Xóa thông tin nhận diện thương hiệu.',

    parentKey: 'marketing-brand'
  },

  // Market Research Permissions
  {
    key: 'marketing-research-view',
    functionname: 'View Market Research',
    description: 'Xem thông tin nghiên cứu thị trường.',

    parentKey: 'marketing-research'
  },
  {
    key: 'marketing-research-edit',
    functionname: 'Edit Market Research',
    description: 'Chỉnh sửa thông tin nghiên cứu thị trường.',

    parentKey: 'marketing-research'
  },
  {
    key: 'marketing-research-Denying',
    functionname: 'Denying Market Research',
    description: 'Xóa thông tin nghiên cứu thị trường.',

    parentKey: 'marketing-research'
  },

  // Advertising Campaigns Permissions
  {
    key: 'marketing-campaigns-view',
    functionname: 'View Advertising Campaigns',
    description: 'Xem các chiến dịch quảng cáo.',

    parentKey: 'marketing-campaigns'
  },
  {
    key: 'marketing-campaigns-edit',
    functionname: 'Edit Advertising Campaigns',
    description: 'Chỉnh sửa các chiến dịch quảng cáo.',

    parentKey: 'marketing-campaigns'
  },
  {
    key: 'marketing-campaigns-Denying',
    functionname: 'Denying Advertising Campaigns',
    description: 'Xóa các chiến dịch quảng cáo.',
    parentKey: 'marketing-campaigns'
  }
]

export const columnSelectGroupTable = [
  {
    title: 'Group Name',
    dataIndex: 'groupname',
    key: 'groupname',
    width: '30%'
  }
]

export const dataSelectGroupTable = [
  {
    groupname: '(All-user)',
    organazationunit: ''
  },
  {
    groupname: 'System Administrator',
    organazationunit: 'FVH'
  },
  {
    groupname: 'Group Dev',
    organazationunit: 'FVH'
  }
]

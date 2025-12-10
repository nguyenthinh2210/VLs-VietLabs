export const MINUTE = [0, 15, 30, 45];

export const HOUR = Array.from({ length: 24 }, (_, i) => i);

export const LOGIN_TYPES = {
  OFFICE365: "OFFICE365LOGINTYPE",
  MANUAL: "MANUALLOGINTYPE",
};

export const ACCOUNT_TYPE = {
  Admin: "Admin",
  User: "User",
};

export const FIELDS = [
  {
    databank_field_id: 1,
    name: "FullName",
    display_e: "FullName",
    display_l: "Họ và tên",
  },
  {
    databank_field_id: 2,
    name: "Address",
    display_e: "Address",
    display_l: "Địa chỉ",
  },
  {
    databank_field_id: 3,
    name: "DateOfBirth",
    display_e: "DateOfBirth",
    display_l: "Ngày sinh",
  },
  {
    databank_field_id: 4,
    name: "Sex",
    display_e: "Sex",
    display_l: "Giới tính",
  },
  {
    databank_field_id: 5,
    name: "RecordLogbookNo",
    display_e: "Record Logbook No.",
    display_l: "Record Logbook No.",
  },
  {
    databank_field_id: 6,
    name: "HN",
    display_e: "HN",
    display_l: "HN",
  },
];

export const LOGBOOKS = {
  Value: [
    [
      {
        app_id: "330e8400-e29b-41d4-a716-446655442222",
        logbook_type_id: "LT002",
        log_book_status_rcd: null,
        logbook_field_values: [
          {
            logbook_field_value_id: "220e8400-e29b-41d4-a716-446655443333",
            app_id: "330e8400-e29b-41d4-a716-446655443333",
            databank_field_id: "550e8400-e29b-41d4-a716-446655442222",
            value_text: "Klein Moretti",
            value_date: null,
            value_number: null,
          },
        ],
      },
      {
        app_id: "330e8400-e29b-41d4-a716-446655443333",
        logbook_type_id: "LT002",
        log_book_status_rcd: null,
        logbook_field_values: [],
      },
    ],
  ],
};

export const CREATED_LOGBOOK_FIELD_VALUES = {
  logbook_field_value_id: "",
  app_id: "330e8400-e29b-41d4-a716-446655443333",
  databank_field_id: "550e8400-e29b-41d4-a716-446655442222",
  value_text: "Klein Moretti",
  value_date: null,
  value_number: null,
};

export const UPDATED_LOGBOOK_FIELD_VALUES = {
  logbook_field_value_id: "330e8400-e29b-41d4-a716-446655443333",
  app_id: "330e8400-e29b-41d4-a716-446655443333",
  databank_field_id: "550e8400-e29b-41d4-a716-446655442222",
  value_text: "Klein Moretti",
  value_date: null,
  value_number: null,
};

export const FORMAT_DATE = "YYYY-MM-DD";

export const FORMAT_DATETIME = "YYYY-MM-DD HH:mm:ss";

export const FORMAT_TIME = "h:mm A";
export const FORMAT_MONTHTIME = "MMM-YYYY";

export const ACTION_TYPE = [
  {
    key: "TYPE_KEEP_UNCHANGED",
    display_name: "Keep Unchanged",
  },
  {
    key: "TYPE_REQUEST_TO_CHANGE",
    display_name: "Request To Change",
  },
];

export const STATUS_CONFIRMATION = [
  {
    key: "STATUS_PENDING_INCOMPLETE_REQUEST",
    display_name: "Pending Incomplete Request",
  },
  {
    key: "STATUS_COMPLETE",
    display_name: "Complete",
  },
];

export const STATUS_PERMISSION_REQUEST = [
  {
    key: "STATUS_SUBMITTED",
    display_name: "Submitted",
  },
  {
    key: "STATUS_WAITING_FOR_MANAGER",
    display_name: "Waiting For Manager",
  },
  {
    key: "STATUS_IT_PROCESS",
    display_name: "IT Process",
  },
  {
    key: "STATUS_REJECTED",
    display_name: "Rejected",
  },
  {
    key: "STATUS_COMPLETE",
    display_name: "Complete",
  },
];

import { configureStore } from "@reduxjs/toolkit";
import { MODULE_AUTH, authReducer } from "./auth";
import { MODULE_COMMON, commonReducer } from "./common";
import { MODULE_LOGBOOK, logbookReducer } from "./logbook";
import { MODULE_SI_XML_TOOL, siXmlToolReducer } from "./SI/xml_tool";
import { MODULE_CUSTOMERS, customersReducer } from "./customers";
import { MODULE_CONTACTS, contactsReducer } from "./contacts";

export const store = configureStore({
  reducer: {
    [MODULE_AUTH]: authReducer,
    [MODULE_COMMON]: commonReducer,
    [MODULE_LOGBOOK]: logbookReducer,
    [MODULE_SI_XML_TOOL]: siXmlToolReducer,
    [MODULE_CUSTOMERS]: customersReducer,
    [MODULE_CONTACTS]: contactsReducer,
  },
});

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { getItemsService, getMetadataService } from '../../common/services'
import lists from '../../common/lists'
import { handleError } from '../../common/helpers'
import axios from 'axios'

const initialState = {
  WorkLocationList: [
    {
      WorkLocationID: '',
      MappingID: '',
      Worklocation_EN: ''
    }
  ],
  FieldList: [
    { databank_field_id: 1, name: 'FullName', display_e: 'FullName', display_l: 'Họ và tên' }
  ],
  AppRefList: [
    {
      logbook_type_id: 'test',
      name_e: 'A&E Digital Logbook Project',
      name_l: 'A&E Digital Logbook Project',
      active_flag: null,
      lu_updated: null,
      lu_user_id: null,
      description: null
    }
  ],
  FieldTypeRefList: [],
  AppRecordDetailChangeReasonRefList: [],
  RoleIndicatorRefList: [],
  MetadataXml: null,
  CommonSystemSettingTableColumnList: []
}

export const MODULE_COMMON = 'MODULE_COMMON'

export const getFieldList = createAsyncThunk(MODULE_COMMON + '/getfieldlist', async () => {
  try {
    // console.log('Calling getItemsService for field list...') // Debugging the API call
    let filter = `(active_flag eq true)`
    let data = await getItemsService(lists.databank_field, { filter: filter })
    // console.log('Data fetched: ', data) // Check if data is returned correctly

    return data.value
    // dispatch(commonActions.setFieldList(data.value))
  } catch (error) {
    handleError(error)
  }
})

export const getAppRefList = createAsyncThunk(MODULE_COMMON + '/getappreflist', async () => {
  try {
    //  console.log('Calling getItemsService for logbook type list...')
    let filter = `(active_flag eq true)`
    let data = await getItemsService(lists.app_ref, { filter: filter })
    //  console.log('Data fetched: ', data)

    return data.value // Make sure to return the fetched data so it can update the state
  } catch (error) {
    handleError(error)
  }
})
export const getFieldTypeRefList = createAsyncThunk(
  MODULE_COMMON + '/getfieldtypereflist',
  async () => {
    try {
      // console.log('Calling getItemsService for databank_field_type_ref type list...')
      let filter = `(active_flag eq true)`
      let data = await getItemsService(lists.databank_field_type_ref, { filter: filter })
      // console.log('Data fetched: ', data)

      return data.value // Make sure to return the fetched data so it can update the state
    } catch (error) {
      handleError(error)
    }
  }
)

export const getAppRecordDetailChangeReasonRefList = createAsyncThunk(
  MODULE_COMMON + '/getapprecorddetailchangereasonref',
  async () => {
    try {
      //  console.log('Calling getItemsService for app_record_detail_change_reason_ref list...')
      let filter = `(active_flag eq true)`
      let data = await getItemsService(lists.app_record_detail_change_reason_ref, {
        filter: filter
      })
      //  console.log('Data fetched: ', data)

      return data.value // Make sure to return the fetched data so it can update the state
    } catch (error) {
      handleError(error)
    }
  }
)

export const getRoleIndicatorRefList = createAsyncThunk(
  MODULE_COMMON + '/getroleindicatorref',
  async () => {
    try {
      // console.log('Calling getItemsService for field list...') // Debugging the API call
      let filter = `(active_flag eq true)`
      let data = await getItemsService(lists.role_indicator_ref, { filter: filter })
      // console.log('Data getAppFieldRoleIndicatorMappingList fetched: ', data) // Check if data is returned correctly

      return data.value
      // dispatch(commonActions.setFieldList(data.value))
    } catch (error) {
      handleError(error)
    }
  }
)

export const getMetadataXml = createAsyncThunk(MODULE_COMMON + '/get_si_xml_content', async () => {
  try {
    const response = await getMetadataService()
    return response.data // XML metadata
  } catch (error) {
    console.error('Error fetching metadata:', error)
  }
})

export const commonSlice = createSlice({
  name: MODULE_COMMON,
  initialState,
  reducers: {
    setWorkLocationList: (state, action) => {
      state.WorkLocationList = action.payload
    },
    setFieldList: (state, action) => {
      state.FieldList = action.payload
    },
    setAppRefList: (state, action) => {
      state.AppRefList = action.payload
    },
    reset: () => {
      return initialState
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getFieldList.fulfilled, (state, action) => {
      //  console.log('Updating FieldList state with: ', action.payload) // Log the action payload
      state.FieldList = action.payload
    })
    builder.addCase(getAppRefList.fulfilled, (state, action) => {
      //  console.log('Updating AppRefList state with: ', action.payload) // Log the action payload
      state.AppRefList = action.payload
    })
    builder.addCase(getFieldTypeRefList.fulfilled, (state, action) => {
      //   console.log('Updating FieldTypeRefList state with: ', action.payload) // Log the action payload
      state.FieldTypeRefList = action.payload
    })
    builder.addCase(getAppRecordDetailChangeReasonRefList.fulfilled, (state, action) => {
      //  console.log('Updating app_record_detail_change_reason_ref state with: ', action.payload) // Log the action payload
      state.AppRecordDetailChangeReasonRefList = action.payload
    })
    builder.addCase(getRoleIndicatorRefList.fulfilled, (state, action) => {
      state.RoleIndicatorRefList = action.payload
    })
    builder.addCase(getMetadataXml.fulfilled, (state, action) => {
      state.MetadataXml = action.payload
    })
  }
})

export const useCommon = () => {
  const data = useSelector((state) => state[MODULE_COMMON])
  return {
    WorkLocationList: data.WorkLocationList,
    FieldList: data.FieldList,
    AppRefList: data.AppRefList,
    FieldTypeRefList: data.FieldTypeRefList,
    AppRecordDetailChangeReasonRefList: data.AppRecordDetailChangeReasonRefList,
    MetadataXml: data.MetadataXml
  }
}

// Action creators are generated for each case reducer function
export const commonActions = { ...commonSlice.actions }

export const commonReducer = commonSlice.reducer

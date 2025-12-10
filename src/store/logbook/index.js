import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { getAppFieldRoleIndicatorMappingsService, getItemsService } from '../../common/services'
import lists from '../../common/lists'
import { handleError } from '../../common/helpers'
const initialState = {
  LogbookTypeField: [],
  DatabankFieldAppMappingList: [],
  PatientId: null,
  VisitId: null,
  CurrentPatientDataset: {},
  CurrentVisitDataset: {},
  CurrentAELogbookView: {},
  CurrentPersonIndicatorDatasetList: [],
  DatabankFieldLookupTableMappingList: [],
  AppFieldRoleIndicatorMappingList: [],
  AppRecordDetailChangeLogList: []
}
export const MODULE_LOGBOOK = 'MODULE_LOGBOOK'

export const getDatabankFieldAppMappingList = createAsyncThunk(
  MODULE_LOGBOOK + '/getdatabankfieldappmapping',
  async (selectedAppRcd) => {
    try {
      let filter = `(app_rcd eq '${selectedAppRcd}') and (active_flag eq true)`
      let data = await getItemsService(lists.databank_field_app_mapping, {
        filter: filter,
        orderBy: 'seq_num asc'
      })
      //  console.log('Data getDatabankFieldAppMapping fetched: ', data) // Check if data is returned correctly

      return data.value
      // dispatch(commonActions.setFieldList(data.value))
    } catch (error) {
      handleError(error)
    }
  }
)

export const getAppSectionList = createAsyncThunk(
  MODULE_LOGBOOK + '/getappsection',
  async (selectedAppRcd) => {
    try {
      //  console.log('Calling getItemsService for field list...') // Debugging the API call
      let filter = `(app_rcd eq '${selectedAppRcd}')`
      let data = await getItemsService(lists.app_section, {
        filter: filter,
        orderBy: 'seq_num asc'
      })
      //  console.log('Data getAppSectionList fetched: ', data) // Check if data is returned correctly

      return data.value
      // dispatch(commonActions.setFieldList(data.value))
    } catch (error) {
      handleError(error)
    }
  }
)

export const getAppRecordDetailChangeLogList = createAsyncThunk(
  MODULE_LOGBOOK + '/getapprecorddetailchangelog',
  async (selectedRecordId) => {
    try {
      // console.log('Calling getItemsService for field list...') // Debugging the API call
      let data = await getAppFieldRoleIndicatorMappingsService(selectedRecordId)
      // console.log('Data getAppSectionList fetched: ', data) // Check if data is returned correctly

      return data.value
      // dispatch(commonActions.setFieldList(data.value))
    } catch (error) {
      handleError(error)
    }
  }
)

export const getAppFieldRoleIndicatorMappingList = createAsyncThunk(
  MODULE_LOGBOOK + '/getappfieldroleindicatormapping',
  async (selectedAppRcd) => {
    try {
      console.log('Calling getItemsService for field list...') // Debugging the API call
      let data = await getAppFieldRoleIndicatorMappingsService(selectedAppRcd)
      console.log('Data getAppFieldRoleIndicatorMappingList fetched: ', data) // Check if data is returned correctly

      return data.value
      // dispatch(commonActions.setFieldList(data.value))
    } catch (error) {
      handleError(error)
    }
  }
)

export const getPersonIndicatorDatasetByPersonIndicatorRcd = createAsyncThunk(
  MODULE_LOGBOOK + '/getCurrentPersonIndicatorDataset',
  async (currentPatientDataset) => {
    const splitPatientIndicatorRcd = currentPatientDataset.person_indicator_rcd_list.split(', ')

    // Use Promise.all to handle async calls without modifying the array directly
    const personIndicatorDatasets = await Promise.all(
      splitPatientIndicatorRcd.map(async (item) => {
        try {
          let filter = `person_indicator_rcd eq '${item}'`
          const data = await getItemsService(lists.person_indicator_dataset, {
            filter: filter,
            top: 1
          })
          return data.value[0] || null // Return the first matching record or null
        } catch (error) {
          handleError(error)
          return null // Return null if there's an error for this item
        }
      })
    )

    // Filter out any null values in case of errors
    return personIndicatorDatasets.filter((dataset) => dataset !== null)
  }
)

export const logbookSlice = createSlice({
  name: MODULE_LOGBOOK,
  initialState,
  reducers: {
    reset: () => {
      return initialState
    },
    resetDatabankFieldLookupTableMappingList: (state) => {
      state.DatabankFieldLookupTableMappingList = []
    },
    setPatientId: (state, action) => {
      state.PatientId = action.payload
    },
    setPatientVisitId: (state, action) => {
      state.PatientVisitId = action.payload
    },
    setCurrentPatientDataset: (state, action) => {
      state.CurrentPatientDataset = action.payload
    },
    setCurrentVisitDataset: (state, action) => {
      state.CurrentVisitDataset = action.payload
    },
    setCurrentAELogbookView: (state, action) => {
      state.CurrentAELogbookView = action.payload
    },
    setDatabankFieldLookupTableMappingList: (state, action) => {
      // Merge new lookup values into the existing state
      state.DatabankFieldLookupTableMappingList = [
        ...state.DatabankFieldLookupTableMappingList,
        ...action.payload
      ]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getDatabankFieldAppMappingList.fulfilled, (state, action) => {
      //  console.log('Updating DatabankFieldAppMappingList state with: ', action.payload) // Log the action payload

      state.DatabankFieldAppMappingList = action.payload
    })
    builder.addCase(getAppSectionList.fulfilled, (state, action) => {
      state.AppSectionList = action.payload
    })
    builder.addCase(getAppFieldRoleIndicatorMappingList.fulfilled, (state, action) => {
      state.AppFieldRoleIndicatorMappingList = action.payload
    })
    builder.addCase(getAppRecordDetailChangeLogList.fulfilled, (state, action) => {
      state.AppRecordDetailChangeLogList = action.payload
    })
    builder.addCase(getPersonIndicatorDatasetByPersonIndicatorRcd.fulfilled, (state, action) => {
      state.CurrentPersonIndicatorDatasetList = action.payload
    })
  }
})
export const useCommonApp = () => {
  const data = useSelector((state) => state[MODULE_LOGBOOK])
  return {
    AppSectionList: data.AppSectionList,
    AppFieldRoleIndicatorMappingList: data.AppFieldRoleIndicatorMappingList,
    AppRecordDetailChangeLogList: data.AppFieldRoleIndicatorMappingList,
    CurrentPatientDataset: data.CurrentPatientDataset,
    CurrentVisitDataset: data.CurrentVisitDataset,
    CurrentAELogbookView: data.CurrentAELogbookView,
    CurrentPersonIndicatorDatasetList: data.CurrentPersonIndicatorDatasetList,
    DatabankFieldAppMappingList: data.DatabankFieldAppMappingList,
    DatabankFieldLookupTableMappingList: data.DatabankFieldLookupTableMappingList,
    PatientId: data.PatientId,
    PatientVisitId: data.PatientVisitId
  }
}
// Action creators are generated for each case reducer function
export const logbookActions = { ...logbookSlice.actions }

export const logbookReducer = logbookSlice.reducer

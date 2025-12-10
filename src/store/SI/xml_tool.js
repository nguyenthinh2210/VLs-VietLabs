import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { getItemsService } from '../../common/services'
import lists from '../../common/lists'
import { handleError } from '../../common/helpers'
const initialState = {
  SystemSettingTableColumnList: []
}
export const MODULE_SI_XML_TOOL = 'MODULE_SI_XML_TOOL'

// export const getAppSectionList = createAsyncThunk(
//   MODULE_LOGBOOK + '/getappsection',
//   async (selectedAppRcd) => {
//     try {
//       //  console.log('Calling getItemsService for field list...') // Debugging the API call
//       let filter = `(app_rcd eq '${selectedAppRcd}')`
//       let data = await getItemsService(lists.app_section, {
//         filter: filter,
//         orderBy: 'seq_num asc'
//       })
//       //  console.log('Data getAppSectionList fetched: ', data) // Check if data is returned correctly

//       return data.value
//       // dispatch(commonActions.setFieldList(data.value))
//     } catch (error) {
//       handleError(error)
//     }
//   }
// )

// export const getAppRecordDetailChangeLogList = createAsyncThunk(
//   MODULE_LOGBOOK + '/getapprecorddetailchangelog',
//   async (selectedRecordId) => {
//     try {
//       // console.log('Calling getItemsService for field list...') // Debugging the API call
//       let data = await getAppFieldRoleIndicatorMappingsService(selectedRecordId)
//       // console.log('Data getAppSectionList fetched: ', data) // Check if data is returned correctly

//       return data.value
//       // dispatch(commonActions.setFieldList(data.value))
//     } catch (error) {
//       handleError(error)
//     }
//   }
// )

// export const getAppFieldRoleIndicatorMappingList = createAsyncThunk(
//   MODULE_LOGBOOK + '/getappfieldroleindicatormapping',
//   async (selectedAppRcd) => {
//     try {
//       console.log('Calling getItemsService for field list...') // Debugging the API call
//       let data = await getAppFieldRoleIndicatorMappingsService(selectedAppRcd)
//       console.log('Data getAppFieldRoleIndicatorMappingList fetched: ', data) // Check if data is returned correctly

//       return data.value
//       // dispatch(commonActions.setFieldList(data.value))
//     } catch (error) {
//       handleError(error)
//     }
//   }
// )

// export const getPersonIndicatorDatasetByPersonIndicatorRcd = createAsyncThunk(
//   MODULE_LOGBOOK + '/getCurrentPersonIndicatorDataset',
//   async (currentPatientDataset) => {
//     const splitPatientIndicatorRcd = currentPatientDataset.person_indicator_rcd_list.split(', ')

//     // Use Promise.all to handle async calls without modifying the array directly
//     const personIndicatorDatasets = await Promise.all(
//       splitPatientIndicatorRcd.map(async (item) => {
//         try {
//           let filter = `person_indicator_rcd eq '${item}'`
//           const data = await getItemsService(lists.person_indicator_dataset, {
//             filter: filter,
//             top: 1
//           })
//           return data.value[0] || null // Return the first matching record or null
//         } catch (error) {
//           handleError(error)
//           return null // Return null if there's an error for this item
//         }
//       })
//     )

//     // Filter out any null values in case of errors
//     return personIndicatorDatasets.filter((dataset) => dataset !== null)
//   }
// )

export const siXmlToolSlice = createSlice({
  name: MODULE_SI_XML_TOOL,
  initialState,
  reducers: {
    reset: () => {
      return initialState
    },
    setSystemSettingTableColumnList: (state, action) => {
      state.SystemSettingTableColumnList = action.payload
    }
  }
  //   ,
  //   extraReducers: (builder) => {
  //     // builder.addCase(getSystemSettingTableColumnList.fulfilled, (state, action) => {
  //     //   //  console.log('Updating DatabankFieldAppMappingList state with: ', action.payload) // Log the action payload
  //     //   state.SystemSettingTableColumnList = action.payload
  //     // })
  //   }
})
export const useSIXmlTool = () => {
  const data = useSelector((state) => state[MODULE_SI_XML_TOOL])
  return {
    SystemSettingTableColumnList: data.SystemSettingTableColumnList
  }
}
// Action creators are generated for each case reducer function
export const siXmlToolActions = { ...siXmlToolSlice.actions }

export const siXmlToolReducer = siXmlToolSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchAuth } from '../../common/fetch'
import { useSelector } from 'react-redux'

export const MODULE_EQUIPMENTIO = 'MODULE_EQUIPMENTIO'

const initialState = {
  equipments: [],
  equipmentIOList: [],
  equipmentIOForReqOut: [],
  eIORequestOutItems: [],
  loading: true,
  eIORequests: [],
  staffs: []
}

export const equipmentIOSlice = createSlice({
  name: MODULE_EQUIPMENTIO,
  initialState,
  reducers: {
    setEquipments: (state, action) => {
      state.equipments = action.payload
    },
    setEquipmentIOList: (state, action) => {
      state.equipmentIOList = action.payload
    },
    setEquipmentIOForReqOut: (state, action) => {
      state.equipmentIOForReqOut = action.payload
    },
    setEIORequestOutItems: (state, action) => {
      state.eIORequestOutItems = action.payload
    },
    setEIORequests: (state, action) => {
      state.eIORequests = action.payload
    },
    setStaffs: (state, action) => {
      state.staffs = action.payload
    },
    reset: () => {
      return initialState
    }
  }
  // , extraReducers
})

export const useEquipmentIO = () => {
  return { ...useSelector((state) => state[MODULE_EQUIPMENTIO]) }
}

export const eIOActions = { ...equipmentIOSlice.actions }

export const equipmentIOReducer = equipmentIOSlice.reducer

// const extraReducers =  (builder) => {
//   return builder
//     .addCase(fetchSomething.pending, (state, action) => {
//       state.loading = true
//     })
//     .addCase(fetchSomething.fulfilled, (state, action) => {
//       state.loading = false
//     })
//     .addCase(fetchSomething.rejected, (state, action) => {
//       // action.payload = error
//     })
// }

// const fetchSomething = createAsyncThunk(
//   MODULE_EQUIPMENTIO + '/fetchSomething',
//   async (arg, thunkAPI) => {
//     try {
//       const res = await fetchAuth(arg)

//       return res
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error)
//     }
//   }
// )

// Action creators are generated for each case reducer function
// export const equipmentIOActions = { ...equipmentIOSlice.actions, fetchSomething }

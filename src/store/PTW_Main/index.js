import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

export const MODULE_PTW = 'MODULE_PTW'

const initialState = {
  ptwMainItem: {},
  ptwID: ''
}

export const ptwSlice = createSlice({
  name: MODULE_PTW,
  initialState,
  reducers: {
    setPTWItem: (state, action) => {
      state.ptwMainItem = action.payload
    },
    setPTWID: (state, action) => {
      state.ptwID = action.payload
    },
    reset: () => {
      return initialState
    }
  }
})

export const usePTW = () => {
  return { ...useSelector((state) => state[MODULE_PTW]) }
}

export const ptwActions = { ...ptwSlice.actions }
export const ptwReducer = ptwSlice.reducer

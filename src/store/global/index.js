import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import config from '../../common/config'
import { getItemsService } from '../../common/services'
import lists from '../../common/lists'

const initialState = {
  inTest: config.IN_TEST,
  systemConfigs: [],
  cateEHSListPage: ''
}

export const MODULE_GLOBAL = 'MODULE_GLOBAL'

export const onStartWithAuthAsyncThunk = createAsyncThunk(
  MODULE_GLOBAL + '/onStartWithAuthAsyncThunk',
  async (_, { rejectWithValue }) => {
    try {
      let [systemConfigs] = await Promise.all([
        getItemsService(lists.SystemConfig).then((res) => res.value)
      ])

      return { systemConfigs }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
const globalSlice = createSlice({
  name: MODULE_GLOBAL,
  initialState,
  reducers: {
    setInTest: (state, action) => {
      state.inTest = action.payload
    },
    setCateEHSListPage: (state, action) => {
      state.cateEHSListPage = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(onStartWithAuthAsyncThunk.fulfilled, (state, action) => {
      state.systemConfigs = action.payload.systemConfigs
    })
  }
})

export const { setInTest, setCateEHSListPage } = globalSlice.actions
export const globalReducer = globalSlice.reducer

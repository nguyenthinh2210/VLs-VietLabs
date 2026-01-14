import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'
import { getItemsService, getItemService, addListItemService, updateListItemService, deleteListItemService } from '../../common/services'
import lists from '../../common/lists'
import { handleError } from '../../common/helpers'

const initialState = {
  customers: [],
  loading: false,
  error: null,
  lastFetched: null, // Timestamp để kiểm tra đã fetch chưa
}

export const MODULE_CUSTOMERS = 'MODULE_CUSTOMERS'

// Fetch customers - chỉ fetch nếu chưa có data hoặc data cũ
export const fetchCustomers = createAsyncThunk(
  MODULE_CUSTOMERS + '/fetchCustomers',
  async (params = {}, { getState }) => {
    try {
      const state = getState()
      const customersState = state[MODULE_CUSTOMERS]
      
      // Nếu đã có data và không có params mới, không fetch lại
      if (customersState.customers.length > 0 && !params.forceRefresh) {
        return customersState.customers
      }

      const response = await getItemsService(lists.Customers, {
        orderBy: "CreatedDate desc",
        top: 100,
        ...params,
      })
      return response.value || []
    } catch (error) {
      handleError(error)
      throw error
    }
  }
)

// Get single customer
export const getCustomer = createAsyncThunk(
  MODULE_CUSTOMERS + '/getCustomer',
  async (clientId) => {
    try {
      const response = await getItemService(lists.Customers, clientId)
      return response
    } catch (error) {
      handleError(error)
      throw error
    }
  }
)

// Add customer
export const addCustomer = createAsyncThunk(
  MODULE_CUSTOMERS + '/addCustomer',
  async (customerData) => {
    try {
      const response = await addListItemService(lists.Customers, customerData)
      return response
    } catch (error) {
      handleError(error)
      throw error
    }
  }
)

// Update customer
export const updateCustomer = createAsyncThunk(
  MODULE_CUSTOMERS + '/updateCustomer',
  async ({ clientId, customerData }) => {
    try {
      const response = await updateListItemService(
        lists.Customers,
        clientId,
        customerData
      )
      return { clientId, customerData: response }
    } catch (error) {
      handleError(error)
      throw error
    }
  }
)

// Delete customer
export const deleteCustomer = createAsyncThunk(
  MODULE_CUSTOMERS + '/deleteCustomer',
  async (clientId) => {
    try {
      await deleteListItemService(lists.Customers, clientId)
      return clientId
    } catch (error) {
      handleError(error)
      throw error
    }
  }
)

export const customersSlice = createSlice({
  name: MODULE_CUSTOMERS,
  initialState,
  reducers: {
    reset: () => initialState,
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch customers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false
        state.customers = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

    // Get customer
    builder
      .addCase(getCustomer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCustomer.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(getCustomer.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

    // Add customer
    builder
      .addCase(addCustomer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false
        // Thêm customer mới vào đầu danh sách
        if (action.payload) {
          state.customers = [action.payload, ...state.customers]
        }
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

    // Update customer
    builder
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false
        const { clientId, customerData } = action.payload
        const index = state.customers.findIndex(
          (c) => c.ClientId === clientId
        )
        if (index !== -1) {
          state.customers[index] = { ...state.customers[index], ...customerData }
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

    // Delete customer
    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false
        state.customers = state.customers.filter(
          (c) => c.ClientId !== action.payload
        )
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const customersActions = { ...customersSlice.actions }
export const customersReducer = customersSlice.reducer

// Custom hook để sử dụng customers từ Redux
export const useCustomersRedux = () => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state[MODULE_CUSTOMERS])

  return {
    customers: data.customers,
    loading: data.loading,
    error: data.error,
    fetchCustomers: (params) => dispatch(fetchCustomers(params)),
    getCustomer: (clientId) => dispatch(getCustomer(clientId)),
    addCustomer: (customerData) => dispatch(addCustomer(customerData)),
    updateCustomer: (clientId, customerData) =>
      dispatch(updateCustomer({ clientId, customerData })),
    deleteCustomer: (clientId) => dispatch(deleteCustomer(clientId)),
    reset: () => dispatch(customersActions.reset()),
  }
}

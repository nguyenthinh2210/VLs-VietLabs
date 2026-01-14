import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'
import { getItemsService, getItemService, addListItemService, updateListItemService, deleteListItemService } from '../../common/services'
import lists from '../../common/lists'
import { handleError } from '../../common/helpers'

const initialState = {
  contacts: [],
  loading: false,
  error: null,
  lastFetched: null,
}

export const MODULE_CONTACTS = 'MODULE_CONTACTS'

// Fetch contacts by ClientId
export const fetchContacts = createAsyncThunk(
  MODULE_CONTACTS + '/fetchContacts',
  async ({ clientId, params = {} }, { getState }) => {
    try {
      const state = getState()
      const contactsState = state[MODULE_CONTACTS]
      
      // Nếu đã có data cho clientId này và không có forceRefresh, không fetch lại
      if (contactsState.contacts.length > 0 && 
          contactsState.contacts[0]?.ClientId === clientId && 
          !params.forceRefresh) {
        return contactsState.contacts
      }

      // Filter by ClientId
      const filter = `ClientId eq '${clientId}'`
      
      const response = await getItemsService(lists.Contacts, {
        filter,
        orderBy: "FullName asc",
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

// Get single contact
export const getContact = createAsyncThunk(
  MODULE_CONTACTS + '/getContact',
  async (contactId) => {
    try {
      const response = await getItemService(lists.Contacts, contactId)
      return response
    } catch (error) {
      handleError(error)
      throw error
    }
  }
)

// Add contact
export const addContact = createAsyncThunk(
  MODULE_CONTACTS + '/addContact',
  async (contactData) => {
    try {
      const response = await addListItemService(lists.Contacts, contactData)
      return response
    } catch (error) {
      handleError(error)
      throw error
    }
  }
)

// Update contact
export const updateContact = createAsyncThunk(
  MODULE_CONTACTS + '/updateContact',
  async ({ contactId, contactData }) => {
    try {
      const response = await updateListItemService(
        lists.Contacts,
        contactId,
        contactData
      )
      return { contactId, contactData: response }
    } catch (error) {
      handleError(error)
      throw error
    }
  }
)

// Delete contact
export const deleteContact = createAsyncThunk(
  MODULE_CONTACTS + '/deleteContact',
  async (contactId) => {
    try {
      await deleteListItemService(lists.Contacts, contactId)
      return contactId
    } catch (error) {
      handleError(error)
      throw error
    }
  }
)

export const contactsSlice = createSlice({
  name: MODULE_CONTACTS,
  initialState,
  reducers: {
    reset: () => initialState,
    clearError: (state) => {
      state.error = null
    },
    // Clear contacts khi chuyển sang customer khác
    clearContacts: (state) => {
      state.contacts = []
      state.lastFetched = null
    },
  },
  extraReducers: (builder) => {
    // Fetch contacts
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false
        state.contacts = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

    // Get contact
    builder
      .addCase(getContact.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getContact.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(getContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

    // Add contact
    builder
      .addCase(addContact.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.contacts = [action.payload, ...state.contacts]
        }
      })
      .addCase(addContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

    // Update contact
    builder
      .addCase(updateContact.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false
        const { contactId, contactData } = action.payload
        const index = state.contacts.findIndex(
          (c) => c.ContactId === contactId
        )
        if (index !== -1) {
          state.contacts[index] = { ...state.contacts[index], ...contactData }
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

    // Delete contact
    builder
      .addCase(deleteContact.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false
        state.contacts = state.contacts.filter(
          (c) => c.ContactId !== action.payload
        )
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const contactsActions = { ...contactsSlice.actions }
export const contactsReducer = contactsSlice.reducer

// Custom hook để sử dụng contacts từ Redux
export const useContactsRedux = () => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state[MODULE_CONTACTS])

  return {
    contacts: data.contacts,
    loading: data.loading,
    error: data.error,
    fetchContacts: (clientId, params) => dispatch(fetchContacts({ clientId, params })),
    getContact: (contactId) => dispatch(getContact(contactId)),
    addContact: (contactData) => dispatch(addContact(contactData)),
    updateContact: (contactId, contactData) =>
      dispatch(updateContact({ contactId, contactData })),
    deleteContact: (contactId) => dispatch(deleteContact(contactId)),
    clearContacts: () => dispatch(contactsActions.clearContacts()),
    reset: () => dispatch(contactsActions.reset()),
  }
}

import { Category } from '@/@types/tasks'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


export const SLICE_NAME = 'toolBar'


export type ToolsState = {
  sideBarExpand: boolean
  mobileSideBarExpand: boolean
  selectedCategory: Partial<Category>
}
const initialState = {
  sideBarExpand: true,
  mobileSideBarExpand: false,
  selectedCategory: {}
}

const toolBarSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    // updateMailList: (state, action) => {
    //   state.mailList = action.payload
    // },
    // updateMail: (state, action) => {
    //   state.mail = action.payload
    // },
    // updateMailId: (state, action) => {
    //   if (action.payload) {
    //     state.mailLoading = true
    //   }
    //   state.selectedMailId = action.payload
    // },
    // updateReply: (state, action) => {
    //   state.reply = action.payload
    // },
    toggleSidebar: (state, action) => {
      state.sideBarExpand = action.payload
    },
    toggleMobileSidebar: (state, action) => {
      state.mobileSideBarExpand = action.payload
    },
    // toggleNewMessageDialog: (state, action) => {
    //   state.newMessageDialog = action.payload
    // },
    updateSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },


    // startSyncMailAccountNew: (state, action) => {
    //   // state.syncNewState = action.payload
    //   if (action.payload) {
    //     state.syncNewState = true
    //   }
    // },

    // stopSyncMailAccountNew: (state, action) => {
    //     // state.syncNewState = action.payload
    //     if (action.payload) {
    //         state.syncNewState = false
    //     }
    // },
    // stopSyncMailAccountNew: (state, action) => {
    //   // Set syncNewState to false when stopping the sync
    //   state.syncNewState = false;
    // },

  },

})

export const {
  // updateMailList,
  // updateMail,
  // updateMailId,
  // updateReply,
  toggleSidebar,
  toggleMobileSidebar,
  // toggleNewMessageDialog,
  updateSelectedCategory,
  // stopSyncMailAccountNew,
  // startSyncMailAccountNew

} = toolBarSlice.actions

export default toolBarSlice.reducer

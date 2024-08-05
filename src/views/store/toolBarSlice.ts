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
    toggleSidebar: (state, action) => {
      state.sideBarExpand = action.payload
    },
    toggleMobileSidebar: (state, action) => {
      state.mobileSideBarExpand = action.payload
    },
    updateSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
  },
})

export const {
  toggleSidebar,
  toggleMobileSidebar,
  updateSelectedCategory,

} = toolBarSlice.actions

export default toolBarSlice.reducer

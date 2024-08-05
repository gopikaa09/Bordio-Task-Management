import { createSlice } from "@reduxjs/toolkit"

export type Status = {
  status1: number
  status2: number
  status3: number
  status4: number
  newStatus: []
}

export const initialState = {
  status1: 10,
  status2: 20,
  status3: 30,
  status4: 40,
  newStatus: []
}
export const SLICE_NAME = 'boardStatus'

const boardSlice = createSlice({
  name: `${SLICE_NAME}/status`,
  initialState,
  reducers: {
    updateStatus1: (state, action) => {
      state.status1 = action.payload
    },
    updateStatus2: (state, action) => {
      state.status2 = action.payload
    },
    updateStatus3: (state, action) => {
      state.status3 = action.payload
    },
    updateStatus4: (state, action) => {
      state.status4 = action.payload
    },
    newUpdatedStatus: (state, action) => {
      state.newStatus = action.payload
    }
  }
})

export const {
  updateStatus1,
  updateStatus2,
  updateStatus3,
  updateStatus4,
  newUpdatedStatus
} = boardSlice.actions
export default boardSlice.reducer
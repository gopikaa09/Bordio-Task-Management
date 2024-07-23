import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export type Query = {
    pageNumber?: number
    pageSize?: number
    search?: string | null
    sortBy?: string

}
export type IndexPageState = {
    view: 'grid' | 'list' | 'board' | 'flex'
    query: Query
}



export const SLICE_NAME = 'indexPage'
//{[key : string]: ProjectListState}
export const indexInitialState: IndexPageState = {
    view: 'grid',
    query: {
        pageNumber: 1,
        pageSize:10,
        sortBy: 'newestFirst',
    }

}


 const setStateKey= (state :any,key :string) => {
     if(!state.hasOwnProperty(key)) state[key]={
        // ...indexInitialState
     }
 }

const indexPageSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState : {},
    reducers: {
        setIndexView:(state, action : {type: string, payload :{key : string,value :Partial<string> }})=> {
            setStateKey(state,action.payload.key)
            state[action.payload.key]['view'] = action.payload.value
        },
        setIndexInitialState:(state, action : {type: string, payload :{key : string,value :Partial<IndexPageState> }})=> {
            setStateKey(state,action.payload.key)
            state[action.payload.key] = action.payload.value
        },
        setIndexQueryParam : (state, action : {type: string, payload :{key : string,value :Partial<Query> } }) => {
            setStateKey(state,action.payload.key)
            state[action.payload.key] = {...state[action.payload.key], query : {...state[action.payload.key].query,...action.payload.value}}
        },


        resetIndexFilter:(state,action)=> {
            setStateKey(state,action.payload.key)

            state[action.payload.key].query = action.payload.value
        }

    }
})

export const { setIndexView,setIndexQueryParam,resetIndexFilter,setIndexInitialState } =
    indexPageSlice.actions

export default indexPageSlice.reducer
import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'
import reducers,{IndexPageState,SLICE_NAME} from "@/store/slices/IndexPage/indexPageSlice";

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
    [SLICE_NAME]: {
        data: IndexPageState
    }
}
> = useSelector

export * from './indexPageSlice'
export { useAppDispatch } from '@/store'
export default reducer
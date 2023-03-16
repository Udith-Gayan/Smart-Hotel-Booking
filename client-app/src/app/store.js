import { configureStore } from '@reduxjs/toolkit'
import visibleReducer from '../features/visibility/visibleSlice'

export const store = configureStore({
    reducer: { visibility: visibleReducer },
})
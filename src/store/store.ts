import { configureStore } from '@reduxjs/toolkit'
import contentReducer from './features/contentSlice'
import userReducer from './features/userSlice'

export const store = configureStore({
  reducer: {
    content: contentReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

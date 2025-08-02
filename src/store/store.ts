import { configureStore } from '@reduxjs/toolkit'
import contentReducer from './features/contentSlice'
import mediaReducer from './features/mediaSlice'
import userReducer from './features/userSlice'

export const store = configureStore({
  reducer: {
    content: contentReducer,
    user: userReducer,
    media: mediaReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

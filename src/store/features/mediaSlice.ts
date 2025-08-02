// store/features/mediaSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MediaState {
  media: []
  loading: boolean
  error: string | null
}

const initialState: MediaState = {
  media: [],
  loading: false,
  error: null,
}

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setMedia(state, action: PayloadAction<[]>) {
      state.media = action.payload
      state.loading = false
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
      state.loading = false
    },
    setLoading(state) {
      state.loading = true
    },
  },
})

export const { setMedia, setError, setLoading } = mediaSlice.actions
export default mediaSlice.reducer

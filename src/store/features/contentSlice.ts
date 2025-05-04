import { ContentType, Post } from '@/types/content'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ContentState {
  contentTypes: ContentType[]
  posts: Post[]
  currentPost: Post | null
  loading: boolean
  error: string | null
  postTypeId: string | null
}

const initialState: ContentState = {
  contentTypes: [],
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  postTypeId: null,
}

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContentTypes: (state, action: PayloadAction<ContentType[]>) => {
      state.contentTypes = action.payload
    },
    setPostTypeId: (state, action: PayloadAction<string>) => {
      state.postTypeId = action.payload

      document.cookie = `postTypeId=${action.payload}; path=/`
    },
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setCurrentPost: (state, action: PayloadAction<Post | null>) => {
      state.currentPost = action.payload
    },
    clearCurrentPost: (state) => {
      state.currentPost = null
    },
  },
})

export const {
  setContentTypes,
  setPostTypeId,
  setPosts,
  setLoading,
  setError,
  setCurrentPost,
  clearCurrentPost,
} = contentSlice.actions
export default contentSlice.reducer

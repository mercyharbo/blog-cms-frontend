import { ContentType } from '@/types/content'
import { Post, SinglePost } from '@/types/post'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ContentState {
  contentTypes: ContentType[]
  posts: Post[]
  currentPost: SinglePost | null
  loading: boolean
  error: string | null
}

const initialState: ContentState = {
  contentTypes: [],
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
}

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContentTypes: (state, action: PayloadAction<ContentType[]>) => {
      state.contentTypes = action.payload
    },
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload
    },
    setCurrentPost: (state, action: PayloadAction<SinglePost>) => {
      state.currentPost = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setContentTypes,
  setPosts,
  setCurrentPost,
  setLoading,
  setError,
} = contentSlice.actions

export default contentSlice.reducer

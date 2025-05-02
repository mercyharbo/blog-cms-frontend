import { fetchApi } from '@/lib/fetch'
import { SignupData, SignupResponse } from '@/types'

/* This code snippet is defining an `authService` object that contains two methods: `signup` and
`login`. */
export const authService = {
  signup: (data: SignupData) =>
    fetchApi<SignupResponse>('/api/auth/signup', {
      method: 'POST',
      requireAuth: false,
      body: data,
    }),

  login: (data: SignupData) =>
    fetchApi<SignupResponse>('/api/auth/login', {
      method: 'POST',
      requireAuth: false,
      body: data,
    }),
}

export interface LoginResponse {
  message: string
  session: {
    access_token: string
    expires_in: number
    expires_at: number
    refresh_token: string
  }
  user: {
    email: string
    id: string
  }
}

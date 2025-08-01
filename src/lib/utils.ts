import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Cookies from 'universal-cookie'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useToken() {
  const cookie_store = new Cookies()
  const token = cookie_store.get('access_token')
  return token
}

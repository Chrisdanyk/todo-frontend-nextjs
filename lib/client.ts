import { env } from '@/env'
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL
})

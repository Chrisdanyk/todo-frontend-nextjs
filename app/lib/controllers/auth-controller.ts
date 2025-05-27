import { apiClient } from '@/lib/api/client'
import BaseController from '@/lib/api/controllers/base'
import { LogInFormType } from '@/schemas'
import type {
  LoginErrorResponse,
  LoginSuccessResponse,
  UserData
} from '@/types'

export default class AuthController extends BaseController {
  async login({
    email,
    password
  }: LogInFormType): Promise<LoginSuccessResponse | LoginErrorResponse> {
    try {
      const response = await apiClient.post<
        LoginSuccessResponse | LoginErrorResponse
      >('/auth/login', { email, password })

      const data = response.data

      return data
    } catch (error) {
      this.handleError(error)
    }
  }

  async logout(): Promise<{ message: string; status: number }> {
    try {
      const response = await apiClient.post<{
        message: string
        status: number
      }>('/auth/logout')

      const data = response.data
      return data
    } catch (error) {
      this.handleError(error)
    }
  }

  async getUserProfile(): Promise<UserData> {
    try {
      const response = await apiClient.get<UserData>('/proxy/auth/me')

      if (!response) {
        throw new Error(`HTTP error! status: `)
      }

      const data = response.data
      return data
    } catch (error) {
      this.handleError(error)
    }
  }
}

export const { login, logout, getUserProfile } = new AuthController()

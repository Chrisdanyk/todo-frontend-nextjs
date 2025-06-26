export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoData {
  title: string;
  completed?: boolean;
}

export interface UpdateTodoData {
  title?: string;
  completed?: boolean;
}

export interface TodoFilters {
  completed?: boolean;
  search?: string;
}

export interface TodoListResponse {
  data: Todo[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class TodoAPI {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api/v1/todos${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        // Token expired, try to refresh
        if (this.getRefreshToken()) {
          try {
            await this.refreshToken();
            // Retry the original request with new token
            const newToken = this.getAccessToken();
            if (newToken) {
              config.headers = {
                ...config.headers,
                Authorization: `Bearer ${newToken}`,
              };
              const retryResponse = await fetch(url, config);
              if (!retryResponse.ok) {
                const errorData = await retryResponse.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${retryResponse.status}`);
              }

              // Handle 204 No Content responses (like DELETE operations)
              if (retryResponse.status === 204) {
                return null as any;
              }

              return retryResponse.json();
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and throw error
            this.clearTokens();
            throw new Error('Authentication expired. Please log in again.');
          }
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content responses (like DELETE operations)
      if (response.status === 204) {
        return null as any;
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.message.includes('Authentication expired')) {
        // Redirect to login for expired authentication
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      throw error;
    }
  }

  // Token management (reusing from auth API)
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  private async refreshToken(): Promise<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to refresh token');
    }

    const authResponse = await response.json();
    this.setTokens(authResponse.access_token, authResponse.refresh_token);
    return authResponse;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Todo methods
  async createTodo(data: CreateTodoData): Promise<Todo> {
    return this.request<Todo>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTodos(page: number = 1, filters?: TodoFilters, limit?: number): Promise<TodoListResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());

    if (limit) {
      params.append('limit', limit.toString());
    }

    // Build a single where object with all filters
    const whereClause: any = {};

    if (filters?.completed !== undefined) {
      whereClause.completed = filters.completed;
    }

    if (filters?.search) {
      whereClause.title = { contains: filters.search, mode: 'insensitive' };
    }

    // Only add where parameter if we have filters
    if (Object.keys(whereClause).length > 0) {
      params.append('where', JSON.stringify(whereClause));
    }

    const queryString = params.toString();
    const endpoint = queryString ? `?${queryString}` : '';

    return this.request<TodoListResponse>(endpoint);
  }

  async getTodo(id: string): Promise<Todo> {
    return this.request<Todo>(`/${id}`);
  }

  async updateTodo(id: string, data: UpdateTodoData): Promise<Todo> {
    return this.request<Todo>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTodo(id: string): Promise<void> {
    try {
      const result = await this.request(`/${id}`, {
        method: 'DELETE',
      });
      console.log('✅ Frontend: Todo deleted successfully, result:', result);
    } catch (error) {
      console.error('❌ Frontend: Delete error:', error);
      console.error('❌ Frontend: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      throw error;
    }
  }

  async toggleTodo(id: string, completed: boolean): Promise<Todo> {
    return this.updateTodo(id, { completed });
  }

  async markAllCompleted(completed: boolean): Promise<void> {
    await this.request('/mark-all-completed', {
      method: 'POST',
      body: JSON.stringify({ completed }),
    });
  }

  async deleteCompletedTodos(): Promise<void> {
    // This would need to be implemented in the backend
    // For now, we'll handle this on the frontend by deleting each completed todo
    const todos = await this.getTodos(1);
    const deletePromises = todos.data
      .filter(todo => todo.completed)
      .map(todo => this.deleteTodo(todo.id));

    await Promise.all(deletePromises);
  }

  async reorderTodos(todoIds: string[]): Promise<void> {
    await this.request('/reorder', {
      method: 'POST',
      body: JSON.stringify({ todoIds }),
    });
  }

  async deleteCompletedTodosBulk(): Promise<void> {
    await this.request('/completed', {
      method: 'DELETE',
    });
  }

  async getStats(): Promise<{
    total: number;
    completed: number;
    active: number;
    completionRate: number;
  }> {
    console.log('📊 Frontend: Calling stats endpoint');
    try {
      const result = await this.request<{
        total: number;
        completed: number;
        active: number;
        completionRate: number;
      }>('/stats');
      console.log('📊 Frontend: Stats response:', result);
      return result;
    } catch (error) {
      console.error('❌ Frontend: Stats error:', error);
      throw error;
    }
  }
}

export const todoAPI = new TodoAPI(); 
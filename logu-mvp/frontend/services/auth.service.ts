import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      type: 'brand' | 'influencer' | 'admin';
      status: string;
    };
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  userType: 'brand' | 'influencer' | 'admin';
}

class AuthService {
  private tokenKey = 'token';
  private userKey = 'user';

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post<LoginResponse>('/api/auth/login', credentials);
      
      // Create a normalized user object from the API response
      const normalizedUser: User = {
        id: response.data.data.user.id,
        name: response.data.data.user.name,
        email: response.data.data.user.email,
        userType: response.data.data.user.type, // Backend returns lowercase type
      };
      
      // Store token and user data in localStorage
      localStorage.setItem(this.tokenKey, response.data.data.token);
      localStorage.setItem(this.userKey, JSON.stringify(normalizedUser));
      
      return normalizedUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    window.location.href = '/auth/login';
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUserType(): string | null {
    const user = this.getCurrentUser();
    return user ? user.userType : null;
  }

  isBrand(): boolean {
    return this.getUserType() === 'brand';
  }

  isInfluencer(): boolean {
    return this.getUserType() === 'influencer';
  }

  isAdmin(): boolean {
    return this.getUserType() === 'admin';
  }
}

export default new AuthService(); 
import { apiClient } from './api';
import { LoginRequest, RegistrationRequest, User } from '@/types/auth';

export const AuthService = {
  async login(data: LoginRequest): Promise<string | "user not verified"> {
    const response = await apiClient.post('/login', data);
    if (response.data) {
      // Check if response is "user not verified"
      if (response.data === "user not verified") {
        return "user not verified";
      }
      
      // Store token in localStorage
      localStorage.setItem('token', response.data);
      
      // Fetch complete user information
      try {
        const userResponse = await apiClient.get('/user/profile', {
          headers: {
            Authorization: `Bearer ${response.data}`
          }
        });
        
        if (userResponse.data) {
          const userData = userResponse.data;
          // Create a user object with all returned data
          const user: User = {
            id: userData.id,
            username: userData.username,
            name: userData.name,
            email: userData.email,
            isVerified: userData.isVerified,
            roles: userData.roles,
            quizID: userData.quizID,
            resultId: userData.resultId,
            token: response.data
          };
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          // Fallback to basic user info if profile fetch fails
          const user: User = {
            username: data.username,
            name: data.username,
            email: '',
            token: response.data
          };
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (error) {
        // Fallback in case of error
        const user: User = {
          username: data.username,
          name: data.username,
          email: '',
          token: response.data
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response.data;
    }
    return '';
  },
  
  async register(data: RegistrationRequest): Promise<string> {
    const response = await apiClient.post('/sign-up', data);
    return response.data;
  },
  
  async generateOtp(username: string): Promise<boolean> {
    const response = await apiClient.get('/generate-otp');
    return !!response.data;
  },
  
  async validateOtp(username: string, otp: string): Promise<string> {
    const response = await apiClient.post('/validate-otp', { otp });
    
    if (response.data) {
      // Store token in localStorage
      localStorage.setItem('token', response.data);
    }
    
    return response.data;
  },
  
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
  
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  },
  
  getToken(): string | null {
    return localStorage.getItem('token');
  },
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
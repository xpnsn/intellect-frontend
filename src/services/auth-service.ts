import { apiClient } from './api';
import { LoginRequest, RegistrationRequest, User } from '@/types/auth';

export const AuthService = {
  async login(data: LoginRequest): Promise<string | "user not verified"> {
    const response = await apiClient.post('/login', data);
  
    if (response.data === "user not verified") {
      return "user not verified";
    }
  
    if (response.data) {
      const token = response.data;
      localStorage.setItem('token', token);
  

      const user: User = {
        username: data.username,
        name: data.username,
        email: '',
        token
      };
      localStorage.setItem('user', JSON.stringify(user));
  
      return token; 
    }
  
    return '';
  },
  
  
  async register(data: RegistrationRequest): Promise<string> {
    const response = await apiClient.post('/sign-up', data);
  
    if (response.data) {
      const token = response.data;
  
      localStorage.setItem('token', token);
  
      return token;
    }
  
    return '';
  },
  
  
  async generateOtp(): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token) return false;
  
    const response = await apiClient.get('/generate-otp', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
    return !!response.data;
  }
,  
  
async validateOtp(userData: Partial<User>, otp: string): Promise<string> {
  const token = localStorage.getItem('token');
  if (!token) return '';

  // Step 1: Validate OTP
  const otpResponse = await apiClient.post(`/validate-otp/${otp}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!otpResponse.data) return '';

  try {
    const rootResponse = await apiClient.post('/', userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

 

    return token;
  } catch (error) {
    console.error("Error sending user data to `/`:", error);
    return '';
  }
}
,
  
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
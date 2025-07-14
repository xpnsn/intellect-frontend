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
      const tempToken = response.data;

      // Don't authenticate yet — store as temporary
      localStorage.setItem('temptoken', tempToken);

      return tempToken;
    }

    return '';
  },

  async generateOtp(): Promise<boolean> {
    const tempToken = localStorage.getItem('temptoken');
    if (!tempToken) return false;

    const response = await apiClient.get('/generate-otp', {
      headers: {
        Authorization: `Bearer ${tempToken}`
      }
    });

    return !!response.data;
  },

  async validateOtp(userData: Partial<User>, otp: string): Promise<string> {
    const tempToken = localStorage.getItem('temptoken');
    if (!tempToken) return '';

    const otpResponse = await apiClient.post(`/validate-otp/${otp}`, {}, {
      headers: {
        Authorization: `Bearer ${tempToken}`
      }
    });

    if (!otpResponse.data) return '';

    try {
      await apiClient.post('/', userData, {
        headers: {
          Authorization: `Bearer ${tempToken}`
        }
      });

      // ✅ Promote temptoken → real token after success
      localStorage.setItem('token', tempToken);
      localStorage.removeItem('temptoken');

      const user: User = {
        id: userData.id ?? '',
        username: userData.username ?? '',
        name: userData.name ?? '',
        email: userData.email ?? '',
        isVerified: userData.isVerified ?? false,
        roles: userData.roles ?? [],
        quizID: (userData.quizID ?? '') as string,
        resultId: (userData.resultId ?? '') as string,
        token: tempToken
      };
      
      localStorage.setItem('user', JSON.stringify(user));

      return tempToken;
    } catch (error) {
      console.error("Error sending user data to `/`:", error);
      return '';
    }
  },

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('temptoken');
  },

  getCurrentUser(): User | null {
    try {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  getToken(): string | null {
    try {
      const token = localStorage.getItem('token');
      return token ?? null;
    } catch (error) {
      console.error('Error accessing token from localStorage:', error);
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();

    return typeof token === 'string' && token.trim() !== '' && !!user;
  }
};

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegistrationRequest {
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface User {
  id?: string;
  username: string;
  name: string;
  email: string;
  isVerified?: boolean;
  roles?: string[];
  quizID?: string[];
  resultId?: string[];
  token?: string;
}
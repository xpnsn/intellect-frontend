import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthService } from "@/services/auth-service";

export default function LoginPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (AuthService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <h1 className="text-3xl font-bold text-center mb-8">IntellectAI</h1>
        <LoginForm />
      </div>
    </div>
  );
}
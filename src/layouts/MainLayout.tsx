import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth-service";
import { Separator } from "@/components/ui/separator";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  
  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 
            className="text-xl font-bold text-blue-600 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            IntellectAI
          </h1>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.username}</span>
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
              <Button variant="outline" onClick={() => navigate('/register')}>Register</Button>
            </div>
          )}
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white shadow-inner mt-auto">
        <div className="container mx-auto px-4 py-4">
          <Separator className="mb-4" />
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} IntellectAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
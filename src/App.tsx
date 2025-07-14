import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from './services/auth-service';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Verification from './pages/auth/Verification';

// Quiz Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import QuizList from './pages/quiz/QuizList';
import QuizCreate from './pages/quiz/QuizCreate';
import QuestionManagement from './pages/quiz/QuestionManagement';
import QuizPlay from './pages/quiz/QuizPlay';
import ResultsPage from './pages/quiz/ResultsPage';
import ExplorePage from './pages/quiz/ExplorePage';
import QuizPlayOptions from './pages/quiz/QuizPlayOptions';

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verification />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/quizzes" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
          <Route path="/quizzes/new" element={<ProtectedRoute><QuizCreate /></ProtectedRoute>} />
          <Route path="/quizzes/:quizId/questions" element={<ProtectedRoute><QuestionManagement /></ProtectedRoute>} />
          <Route path="/quizzes/:quizId/play" element={<ProtectedRoute><QuizPlay /></ProtectedRoute>} />
          <Route path="/quizzes/:quizId/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          <Route path="/play" element={<ProtectedRoute><QuizPlayOptions /></ProtectedRoute>} />
          <Route path="/play/ai" element={<ProtectedRoute><QuizPlay /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
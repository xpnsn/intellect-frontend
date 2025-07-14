import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { AuthService } from "@/services/auth-service";

export default function VerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Extract username from location state or use empty string
  const username = location.state?.username || '';
  
  const handleVerify = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    try {
      setIsLoading(true);
      const token = await AuthService.validateOtp(username, otp);
      
      if (token) {
        toast.success("Email verified successfully!");
        navigate('/');
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error) {
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendDisabled(true);
      const success = await AuthService.generateOtp();
      
      if (success) {
        toast.success("A new verification code has been sent to your email");
        
        // Set a countdown for 120 seconds
        setCountdown(120);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error("Failed to send verification code");
        setResendDisabled(false);
      }
    } catch (error) {
      toast.error("Failed to resend verification code");
      setResendDisabled(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <h1 className="text-3xl font-bold text-center mb-8">IntellectAI</h1>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              Enter the verification code sent to your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium">
                  Verification Code
                </label>
                <Input
                  id="otp"
                  placeholder="Enter verification code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              className="w-full" 
              onClick={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendCode}
              disabled={resendDisabled}
            >
              {countdown > 0 
                ? `Resend Code (${countdown}s)` 
                : "Resend Verification Code"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
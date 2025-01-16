import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BackgroundLines } from "../components/aceturnity/background-beams"
import { Button } from "../components/shadcn/button"
import { Input } from "../components/shadcn/input"
import { Label } from "../components/shadcn/label"
import { Checkbox } from "../components/shadcn/checkbox"
import { useAuth } from '../contexts/AuthenticationProvider';

export const Authentication: React.FC = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') === 'sign-up' ? 'sign-up' : 'login';
    const { login, register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = () => {
      loginWithGoogle(
          () => navigate('/dashboard'),
          (error) => setError(error.message)
      );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (mode === 'sign-up') {
            if (password !== confirmPassword) {
                setError("Passwords don't match");
                return;
            }
            register(email, password, name, 
                () => navigate('/dashboard'),
                (error) => setError(error.message)
            );
        } else {
            login(email, password, 
                () => navigate('/dashboard'),
                (error) => setError(error.message)
            );
        }
    };

    return (
      <div className="w-[100vw] h-[100vh] lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12 bg-corporate-50 dark:bg-corporate-900">
          <form onSubmit={handleSubmit} className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-semibold text-corporate-800 dark:text-corporate-50">
                {mode === 'sign-up' ? 'Create Account' : 'Sign In'}
              </h1>
              <p className="text-balance text-corporate-600 dark:text-corporate-300">
                {mode === 'sign-up' 
                  ? 'Enter your details to create your account'
                  : 'Enter your credentials to access your account'}
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-corporate-700 dark:text-corporate-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="border-corporate-200 focus:border-primary dark:border-corporate-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {mode === 'sign-up' && (
                <div className="grid gap-2">
                  <Label htmlFor="name" className="dark:text-white">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    className='dark:text-white'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="dark:text-white">Password</Label>
                  {mode === 'login' && (
                    <a
                      href="/reset-password"
                      className="ml-auto inline-block text-sm underline dark:text-gray-300"
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className='dark:text-white'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {mode === 'sign-up' && (
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="dark:text-white">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    required 
                    className='dark:text-white'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}
              {mode === 'sign-up' && (
                <div className="flex items-center space-x-2">
                  <Checkbox id="privacy-policy" />
                  <Label htmlFor="privacy-policy" className="text-sm dark:text-gray-300">
                    I agree to the <a href="/privacy-policy" className="underline">privacy policy</a>
                  </Label>
                </div>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white">
                {mode === 'sign-up' ? 'Create Account' : 'Sign In'}
              </Button>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-corporate-200 dark:border-corporate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-corporate-50 px-2 text-corporate-500 dark:bg-corporate-900 dark:text-corporate-400">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-corporate-200 hover:bg-corporate-100 dark:border-corporate-700 dark:hover:bg-corporate-800"
                onClick={handleGoogleSignIn}
              >
                <svg  xmlns="http://www.w3.org/2000/svg"  width="20"  height="20"  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-brand-google pr-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" /></svg>
                Continue with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm dark:text-gray-300">
              {mode === 'sign-up' 
                ? 'Already have an account? '
                : "Don't have an account? "}
              <a href={mode === 'sign-up' ? '/authentication?mode=login' : '/authentication?mode=sign-up'} className="underline">
                {mode === 'sign-up' ? 'Login' : 'Sign up'}
              </a>
            </div>
          </form>
        </div>
        <div className="relative hidden lg:block bg-primary dark:bg-primary-dark">
          <div className="flex items-center justify-center w-full h-full flex-col px-4">
            <h2 className="text-4xl font-semibold text-white mb-4">
              Welcome to Enterprise Analytics
            </h2>
            <p className="text-lg text-white/80 text-center max-w-md">
              {mode === 'sign-up' 
                ? 'Join thousands of companies using our platform for advanced data analysis.'
                : 'Access your enterprise dashboard to manage your analytics.'}
            </p>
          </div>
        </div>
      </div>
    )
}
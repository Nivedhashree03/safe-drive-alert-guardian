
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import Dashboard from '@/components/dashboard/Dashboard';
import ProfilePage from '@/components/profile/ProfilePage';
import { useToast } from '@/hooks/use-toast';

interface User {
  fullName: string;
  email: string;
  phone: string;
}

type AppState = 'login' | 'signup' | 'dashboard' | 'profile';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppState>('login');
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleLogin = (email: string, password: string) => {
    // Simulate login - in real app, this would validate against backend
    console.log('Login attempt:', { email, password });
    
    // Mock user data
    const mockUser: User = {
      fullName: 'John Driver',
      email: email,
      phone: '+1234567890'
    };
    
    setUser(mockUser);
    setCurrentView('dashboard');
    
    toast({
      title: "Login Successful",
      description: "Welcome to Safe Drive Guardian!",
    });
  };

  const handleSignup = (userData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }) => {
    // Simulate signup - in real app, this would create account in backend
    console.log('Signup attempt:', userData);
    
    const newUser: User = {
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone
    };
    
    setUser(newUser);
    setCurrentView('dashboard');
    
    toast({
      title: "Account Created",
      description: "Welcome to Safe Drive Guardian! Please set up your emergency contacts.",
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
    toast({
      title: "Logged Out",
      description: "Stay safe and drive carefully!",
    });
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setCurrentView('signup')}
          />
        );
      case 'signup':
        return (
          <SignupForm
            onSignup={handleSignup}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      case 'dashboard':
        return user ? (
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onOpenProfile={() => setCurrentView('profile')}
          />
        ) : null;
      case 'profile':
        return user ? (
          <ProfilePage
            user={user}
            onBack={() => setCurrentView('dashboard')}
            onUpdateUser={handleUpdateUser}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {(['login', 'signup'].includes(currentView)) ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          {renderCurrentView()}
        </div>
      ) : (
        renderCurrentView()
      )}
    </div>
  );
};

export default Index;

import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const router = useRouter();

    // Example guard logic, check if user is authenticated
    let isAuthenticated = false;
    if (typeof window !== 'undefined') {
      // Check if running on the client-side
      const storedUser = localStorage.getItem('CONNECTED_USER');
      isAuthenticated = storedUser !== null;
    }
  
    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/auth/login'); // Redirect to login page if not authenticated
      }
    }, [isAuthenticated, router]);
  
    return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;

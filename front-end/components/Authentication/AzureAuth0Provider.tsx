import axios from 'axios';
import Router from 'next/router';
import React, {
  useState,
  createContext,
  ReactNode,
  FC,
  useEffect,
  useCallback,
  useContext,
} from 'react';

type User = {
  identityProvider: string;
  userDetails: string;
  userId: string;
  userRoles: Array<string>;
};

interface AzureAuth0ContextType {
  user: User | undefined;
  auth0User: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AzureAuth0Context = createContext<AzureAuth0ContextType>(
  null as unknown as AzureAuth0ContextType
);

interface AzureAuth0ProviderProps {
  children: ReactNode;
}

const AzureAuth0Provider: FC<AzureAuth0ProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [auth0User, setAuth0User] = useState<User | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logOut = () => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${window.location.origin.toString()}/.auth/logout/auth0`
        : `${window.location.origin.toString()}/.auth/logout`;
    Router.push(url);
  };

  const getAzureUser = async () => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${window.location.origin.toString()}/.auth/me/auth0`
        : `${window.location.origin.toString()}/.auth/me`;
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      const { clientPrincipal } = response.data;
      if (clientPrincipal) {
        setUser(clientPrincipal);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(undefined);
      }
    } catch {
      setUser(undefined);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAzureUser();
  }, []);

  const handleAuth0user = useCallback(async () => {
    if (user) {
      const url =
        process.env.NODE_ENV === 'development'
          ? `${window.location.origin.toString()}/.auth/me/auth0`
          : `${window.location.origin.toString()}/.auth/me`;
      setIsLoading(true);
      try {
        const response = await axios.get(url);
        setAuth0User(response.data);
        setIsAuthenticated(true);
      } catch {
        setAuth0User(undefined);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const redirectURL = sessionStorage.getItem('redirectURL');
      if (redirectURL) {
        sessionStorage.removeItem('redirectURL');
        Router.push(redirectURL);
      }
      handleAuth0user();
    }
  }, [user, handleAuth0user]);

  return (
    <AzureAuth0Context.Provider
      value={{
        user,
        auth0User,
        isAuthenticated,
        isLoading,
        logout: logOut,
      }}
    >
      {children}
    </AzureAuth0Context.Provider>
  );
};

const useAuth0 = (): AzureAuth0ContextType => useContext(AzureAuth0Context);

export { AzureAuth0Provider, useAuth0 };

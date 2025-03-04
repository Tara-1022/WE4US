import AuthProvider from './auth/AuthProvider';
import ProfileContextProvider from './components/ProfileContext';
import LemmyContextProvider from './components/LemmyContextProvider';

// A file to contain relevant app-wide contexts
// to reduce bulk from App.tsx

export default function AppContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <LemmyContextProvider>
      <ProfileContextProvider>
        <AuthProvider >
          {children}
        </AuthProvider>
      </ProfileContextProvider >
    </LemmyContextProvider>
  );
}
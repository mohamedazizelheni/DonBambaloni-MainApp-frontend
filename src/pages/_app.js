import ErrorBoundary from "@/components/common/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext"; // Ensure you're importing AuthProvider correctly
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "@/styles/globals.css";
import Sidebar from "@/components/layout/Sidebar";
import useAuth from '@/hooks/useAuth';
import Spinner from "@/components/common/Spinner";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <MainComponent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

function MainComponent({ Component, pageProps }) {
  const { user, loading } = useAuth(); 

  if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;

  return (
    <div>
      {user && <Sidebar />}

      <main className={`p-6 ${user ? 'sm:ml-64' : ''}`}>
        <ErrorBoundary>
          <Component {...pageProps} />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
          />
        </ErrorBoundary>
      </main>
    </div>
  );
}

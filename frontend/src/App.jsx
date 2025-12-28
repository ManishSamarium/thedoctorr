import Navbar from "./components/common/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";
import Loader from "./components/common/Loader";

function App() {
  const { loading } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <AppRoutes />
    </div>
  );
}

export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import CycleEditorPage from "./pages/CycleEditorPage";
import WorkoutSession from "./pages/WorkoutSession";
import WorkoutHistory from "./pages/WorkoutHistory";
import Stats from "./pages/Stats";
import DevTools from "./pages/Devtools";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return !user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/cycle/create"
              element={
                <PrivateRoute>
                  <CycleEditorPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/cycle/edit"
              element={
                <PrivateRoute>
                  <CycleEditorPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/workout"
              element={
                <PrivateRoute>
                  <WorkoutSession />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <WorkoutHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <PrivateRoute>
                  <Stats />
                </PrivateRoute>
              }
            />
            <Route
              path="/dev"
              element={
                <PrivateRoute>
                  <DevTools />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

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
import Achievements from "./pages/Achievements";
import AppFooter from "./components/AppFooter";

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
                  <AppFooter />
                </PrivateRoute>
              }
            />
            <Route
              path="/cycle/create"
              element={
                <PrivateRoute>
                  <CycleEditorPage />
                  <AppFooter />
                </PrivateRoute>
              }
            />
            <Route
              path="/cycle/edit/:cycleId"
              element={
                <PrivateRoute>
                  <CycleEditorPage />
                  <AppFooter />
                </PrivateRoute>
              }
            />
            <Route
              path="/workout/:cycleId/:dayId"
              element={
                <PrivateRoute>
                  <WorkoutSession />
                  <AppFooter />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <WorkoutHistory />
                  <AppFooter />
                </PrivateRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <PrivateRoute>
                  <Stats />
                  <AppFooter />
                </PrivateRoute>
              }
            />{" "}
            <Route
              path="/achievements"
              element={
                <PrivateRoute>
                  <Achievements />
                  <AppFooter />
                </PrivateRoute>
              }
            />
            <Route
              path="/dev"
              element={
                <PrivateRoute>
                  <DevTools />
                  <AppFooter />
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

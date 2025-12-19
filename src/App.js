import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EntryPage from "./EntryPage";
import LoginPage from "./Login";
import SignupPage from "./Signup";
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import Forecasts from "./Forecasts";
import Profile from "./Profile";
import SplitTextTest from "./SplitTextTest";
import WelcomeScreen from "./WelcomeScreen";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/welcome" 
          element={
            <ProtectedRoute>
              <WelcomeScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/forecasts" element={<Forecasts />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route 
          path="/splittext-test" 
          element={
            <ProtectedRoute>
              <SplitTextTest />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

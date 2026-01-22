import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Topics from "./pages/Topics";
import Quiz from "./pages/Quiz";
import ProgressDetail from "./pages/ProgressDetail";
import QuizHistory from "./components/QuizHistory"; 
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import { fetchMe } from "./features/auth/authSlice";
import OAuthSuccess from "./pages/OAuthSuccess";

function App() {
  const dispatch = useDispatch();
  const { token, isAuth } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token && !isAuth) {
      dispatch(fetchMe());
    }
  }, [token, isAuth, dispatch]);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/topics"
          element={
            <ProtectedRoute>
              <Topics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:topicId"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress/topic/:topicId"
          element={
            <ProtectedRoute>
              <ProgressDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress/history/:topicId"
          element={
            <ProtectedRoute>
              <QuizHistory />
            </ProtectedRoute>
          }
        />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

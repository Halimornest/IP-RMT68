import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, isLoading, error } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuth) navigate("/");
  }, [isAuth, navigate]);

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <form
        className="card shadow p-4"
        style={{ width: 360 }}
        onSubmit={handleSubmit}
      >
        <h3 className="text-center mb-2">Welcome Back 👋</h3>
        <p className="text-center text-muted mb-4">
          Log in to continue your AI-powered learning journey.
        </p>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        {error && (
          <p className="text-danger text-center mt-3">
            Invalid email or password. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;

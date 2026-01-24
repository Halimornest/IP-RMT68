import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../features/auth/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, isAuth } = useSelector((s) => s.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ email, password }));
  };

  useEffect(() => {
    if (isAuth) navigate("/");
  }, [isAuth, navigate]);

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <form
        className="card shadow p-4"
        style={{ width: 380 }}
        onSubmit={handleSubmit}
      >
        <h3 className="text-center mb-2">Create Account</h3>
        <p className="text-center text-muted mb-4">
          Start your AI-powered learning journey 🚀
        </p>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-success w-100" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Register"}
        </button>

        {error && (
          <p className="text-danger text-center mt-3">
            {error}
          </p>
        )}

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="fw-bold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

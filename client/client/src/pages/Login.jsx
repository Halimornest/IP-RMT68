import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuth } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuth) {
      navigate("/"); 
    }
  }, [isAuth, navigate]);

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <form onSubmit={submit} className="card p-4 shadow" style={{ width: 350 }}>
        <h3 className="text-center mb-3">Login</h3>

        <input
          className="form-control mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-success w-100" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </button>

        {error && (
          <p className="text-danger text-center mt-2">{error}</p>
        )}
      </form>
    </div>
  );
};

export default Login;

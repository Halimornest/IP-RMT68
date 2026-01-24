import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>

      <div className="d-flex gap-2 mt-3">
        <Link to="/topics" className="btn btn-primary">
          Manage Topics
        </Link>

        <button
          className="btn btn-danger"
          onClick={() => dispatch(logout())}
        >
          Logout to Login Page
        </button>
      </div>
    </div>
  );
};

export default Home;

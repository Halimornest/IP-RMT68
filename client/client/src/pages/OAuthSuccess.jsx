import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginSuccess } from "../features/auth/authSlice";

const OAuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    dispatch(loginSuccess(token));

    navigate("/");
  }, [dispatch, navigate, params]);

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" />
        <p>Signing you in with Google...</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;

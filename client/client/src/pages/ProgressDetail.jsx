import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTopicProgress,
  fetchQuizHistory,
  resetProgress,
} from "../features/progress/progressSlice";

const ProgressDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { detail, history, isLoading } = useSelector(
    (s) => s.progress
  );

  useEffect(() => {
    dispatch(resetProgress());
    dispatch(fetchTopicProgress(topicId));
    dispatch(fetchQuizHistory(topicId));
  }, [topicId, dispatch]);

  if (isLoading || !detail) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-3">{detail.title}</h2>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h6>Attempts</h6>
              <h3>{detail.attempts}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h6>Best Score</h6>
              <h3>{detail.bestScore}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h6>Average</h6>
              <h3>{detail.averageScore}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h6>Status</h6>
              <span className="badge bg-info">
                {detail.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mb-3">Quiz History</h4>

      {history.length === 0 ? (
        <div className="alert alert-secondary">
          No quiz attempts yet.
        </div>
      ) : (
        <ul className="list-group mb-4">
          {history.map((h, i) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between"
            >
              <span>
                Attempt #{history.length - i}
              </span>
              <span className="fw-bold">
                Score: {h.score}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/")}
        >
          Back
        </button>
        <button
          className="btn btn-success"
          onClick={() => navigate(`/quiz/${topicId}`)}
        >
          Continue Quiz
        </button>
      </div>
    </div>
  );
};

export default ProgressDetail;

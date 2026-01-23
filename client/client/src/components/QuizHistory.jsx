import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuizHistory } from "../features/quiz/quizSlice";

const QuizHistory = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { history, isLoading } = useSelector((s) => s.quiz);

  useEffect(() => {
    dispatch(fetchQuizHistory(topicId));
  }, [dispatch, topicId]);

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Loading quiz history...</p>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h4>No Quiz History</h4>
        <p className="text-muted">
          You haven't completed any quizzes for this topic yet.
        </p>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  const scores = history.map((h) => h.score);
  const best = Math.max(...scores);
  const average = (
    scores.reduce((a, b) => a + b, 0) / scores.length
  ).toFixed(1);
  const last = scores[0];

  return (
    <div className="container py-5">
      <h2 className="mb-4">Quiz History</h2>

      <div className="row mb-4">
        <div className="col-md-3"><b>Attempts</b><div>{history.length}</div></div>
        <div className="col-md-3"><b>Best Score</b><div>{best}</div></div>
        <div className="col-md-3"><b>Average</b><div>{average}</div></div>
        <div className="col-md-3"><b>Last Attempt</b><div>{last}</div></div>
      </div>
      
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Attempt</th>
            <th>Score</th>
            <th>Trend</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => {
            const prev = history[i + 1]?.score;
            const diff = prev !== undefined ? h.score - prev : null;

            return (
              <tr key={i}>
                <td>Attempt #{history.length - i}</td>
                <td>
                  <span className="badge bg-warning text-dark">
                    {h.score}
                  </span>
                </td>
                <td>
                  {diff === null ? (
                    "-"
                  ) : diff > 0 ? (
                    <span className="text-success">▲ {diff}</span>
                  ) : (
                    <span className="text-danger">▼ {Math.abs(diff)}</span>
                  )}
                </td>
                <td>
                  {h.score >= 70 ? (
                    <span className="badge bg-success">Passed</span>
                  ) : (
                    <span className="badge bg-danger">Failed</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default QuizHistory;

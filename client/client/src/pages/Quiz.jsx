import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchQuiz,
  selectAnswer,
  submitQuiz,
  resetQuiz,
} from "../features/quiz/quizSlice";

const Quiz = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    questions,
    answers,
    isLoading,
    score,
    error,
  } = useSelector((s) => s.quiz);

  useEffect(() => {
    dispatch(resetQuiz());
    if (topicId) dispatch(fetchQuiz(topicId));
  }, [topicId, dispatch]);

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Preparing your quiz…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/topics")}
        >
          Back to Topics
        </button>
      </div>
    );
  }

  if (score !== null) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-3">Your Score</h2>

        <div className="display-1 fw-bold mb-3">
          {score}
        </div>

        <div className="progress mb-4" style={{ height: 12 }}>
          <div
            className={`progress-bar ${
              score >= 70 ? "bg-success" : "bg-warning"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>

        <p className="text-muted mb-4">
          {score >= 70
            ? "Great job! 🎉"
            : "Keep practicing, you’ll get better 💪"}
        </p>

        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/topics")}
          >
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="container py-5 text-center">
        <p>No quiz available for this topic.</p>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/topics")}
        >
          Back to Topics
        </button>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const total = questions.length;
  const progress = Math.round((answeredCount / total) * 100);
  const allAnswered = answeredCount === total;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="mb-2">Quiz</h2>
        <div className="progress" style={{ height: 8 }}>
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <small className="text-muted">
          Answered {answeredCount} / {total}
        </small>
      </div>

      {questions.map((q, index) => {
        const key = q.id || q._id || `${index}-${q.question}`;

        return (
          <div key={key} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">
                {index + 1}. {q.question}
              </h5>

              {q.options.map((opt, optIndex) => (
                <div className="form-check mb-2" key={optIndex}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={key}
                    checked={answers[key] === opt}
                    onChange={() =>
                      dispatch(
                        selectAnswer({
                          questionId: key,
                          option: opt,
                        })
                      )
                    }
                  />
                  <label className="form-check-label">
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/topics")}
        >
          Back to Topics
        </button>

        <button
          className="btn btn-success btn-lg"
          disabled={!allAnswered || isLoading}
          onClick={() => dispatch(submitQuiz())}
        >
          {isLoading ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>

      {!allAnswered && (
        <p className="text-muted mt-2">
          Answer all questions to submit.
        </p>
      )}
    </div>
  );
};

export default Quiz;

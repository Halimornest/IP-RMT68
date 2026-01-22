import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchQuiz,
  selectAnswer,
  submitQuiz,
  resetQuiz,
  explainAnswer,
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
    details,
    explanations,
    explainingIndex,
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
          className="btn btn-outline-secondary mt-3"
          onClick={() => navigate("/topics")}
        >
          Back to Topics
        </button>
      </div>
    );
  }

  if (score !== null) {
    return (
      <div className="container py-5">
        <h2 className="mb-4 text-center">Your Score</h2>

        <div className="display-3 fw-bold text-center mb-4">
          {score}
        </div>

        <div className="progress mb-5" style={{ height: 12 }}>
          <div
            className={`progress-bar ${
              score >= 70 ? "bg-success" : "bg-warning"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>

        {details.map((d, i) => (
          <div key={i} className="card mb-3 shadow-sm">
            <div className="card-body">
              <p className="fw-bold">{d.question}</p>

              <p>
                Your answer:{" "}
                <b className={d.isCorrect ? "text-success" : "text-danger"}>
                  {d.selectedOption || "-"}
                </b>
              </p>

              <p>
                Correct answer:{" "}
                <b className="text-success">{d.correctOption}</b>
              </p>

              {!d.isCorrect && (
                <>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      dispatch(
                        explainAnswer({
                          detail: d,
                          index: i,
                        })
                      )
                    }
                  >
                    Explain with AI
                  </button>

                  {explainingIndex === i && (
                    <p className="text-muted mt-2">
                      Explaining…
                    </p>
                  )}

                  {explanations[i] && (
                    <div className="alert alert-info mt-2">
                      {explanations[i]}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        <div className="text-center mt-4">
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/topics")}
          >
            Back to Topics
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/")}
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const total = questions.length;
  const allAnswered = answeredCount === total;

  return (
    <div className="container py-5">
      <h2 className="mb-4">Quiz</h2>

      <div className="progress mb-3" style={{ height: 8 }}>
        <div
          className="progress-bar"
          style={{
            width: `${Math.round((answeredCount / total) * 100)}%`,
          }}
        />
      </div>

      <small className="text-muted mb-4 d-block">
        Answered {answeredCount} / {total}
      </small>

      {questions.map((q, index) => (
        <div key={index} className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">
              {index + 1}. {q.question}
            </h5>

            {q.options.map((opt, i) => (
              <div className="form-check mb-2" key={i}>
                <input
                  type="radio"
                  className="form-check-input"
                  name={`q-${index}`}
                  checked={answers[index] === opt}
                  onChange={() =>
                    dispatch(
                      selectAnswer({
                        index,
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
      ))}

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/topics")}
        >
          Back to Topics
        </button>

        <button
          type="button"
          className="btn btn-success btn-lg"
          disabled={!allAnswered}
          onClick={() => dispatch(submitQuiz())}
        >
          Submit Quiz
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

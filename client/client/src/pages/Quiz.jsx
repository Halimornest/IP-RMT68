import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchQuiz,
  selectAnswer,
  submitQuiz,
  resetQuiz,
} from "../features/quiz/quizSlice";

const Quiz = () => {
  const { topicId } = useParams();
  const dispatch = useDispatch();
  const { questions, answers, score, isLoading } = useSelector(
    (s) => s.quiz
  );

  useEffect(() => {
    dispatch(resetQuiz());
    dispatch(fetchQuiz(topicId));
  }, [dispatch, topicId]);

  if (isLoading) return <p className="m-4">Loading quiz...</p>;

  if (score !== null) {
    return (
      <div className="container mt-5 text-center">
        <h2>Your Score</h2>
        <h1 className="display-4">{score}</h1>

        <Link to="/topics" className="btn btn-primary mt-3">
          Back to Topics
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quiz</h2>

      {questions.map((q, idx) => (
        <div key={q.id} className="mb-4">
          <p>
            <strong>
              {idx + 1}. {q.question}
            </strong>
          </p>

          {q.options.map((opt) => (
            <div key={opt} className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name={`q-${q.id}`}
                checked={answers[q.id] === opt}
                onChange={() =>
                  dispatch(
                    selectAnswer({
                      questionId: q.id,
                      answer: opt,
                    })
                  )
                }
              />
              <label className="form-check-label">{opt}</label>
            </div>
          ))}
        </div>
      ))}

      {questions.length > 0 && (
        <button
          className="btn btn-success"
          onClick={() =>
            dispatch(
              submitQuiz({
                topicId,
                answers,
              })
            )
          }
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
};

export default Quiz;

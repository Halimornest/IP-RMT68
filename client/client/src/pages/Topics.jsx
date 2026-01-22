import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchTopics,
  generateTopics,
} from "../features/topics/topicsSlice";

const Topics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, isLoading, error } = useSelector(
    (s) => s.topics
  );

  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("beginner");

  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!subject.trim()) return;
    dispatch(generateTopics({ subject, level }));
  };

  return (
    <div className="container py-5">
      <h2>Your Learning Topics 📚</h2>
      <p className="text-muted mb-4">
        Select a topic below to start learning and test your
        understanding with a quiz.
      </p>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5>Create New Topics with AI</h5>
          <form
            className="row g-2 mt-2"
            onSubmit={handleGenerate}
          >
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Enter a subject you want to learn"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">
                  Intermediate
                </option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="col-md-3 d-grid">
              <button
                className="btn btn-primary"
                disabled={isLoading}
              >
                Generate Topics
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {list.length === 0 && !isLoading && (
        <p className="text-muted">
          No topics available yet. Generate one to get
          started 👆
        </p>
      )}

      <ul className="list-group">
        {list.map((topic) => (
          <li
            key={topic.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{topic.title}</span>
            <button
              className="btn btn-sm btn-success"
              onClick={() =>
                navigate(`/quiz/${topic.id}`)
              }
            >
              Start Quiz →
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Topics;

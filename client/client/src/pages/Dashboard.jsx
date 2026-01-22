import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generateTopics } from "../features/topics/topicsSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { isLoading } = useSelector((s) => s.topics);

  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("beginner");

  const handleGenerate = () => {
    if (!subject.trim()) return;
    dispatch(generateTopics({ subject, level }));
    navigate("/topics");
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-2">
        AI Learning Dashboard 🚀
      </h1>
      <p className="text-muted mb-4">
        Tell us what you want to learn, and let AI create a
        personalized learning path for you.
      </p>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Subject</label>
              <input
                className="form-control"
                placeholder="Example: JavaScript, React, Backend Development"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">
                Difficulty Level
              </label>
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
                className="btn btn-primary btn-lg"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading
                  ? "Generating..."
                  : "Generate Learning Topics"}
              </button>
            </div>
          </div>

          <p className="text-muted mt-4 mb-0">
            Topics and quizzes are generated automatically
            using AI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

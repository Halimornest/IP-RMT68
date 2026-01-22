import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generateTopics } from "../features/topics/topicsSlice";
import { fetchMyProgress } from "../features/progress/progressSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, isLoading } = useSelector((s) => s.progress);

  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("beginner");

  useEffect(() => {
    dispatch(fetchMyProgress());
  }, [dispatch]);

  const handleGenerate = () => {
    if (!subject.trim()) return;
    dispatch(generateTopics({ subject, level }));
    navigate("/topics");
  };

  const totalAttempts = list.reduce((sum, t) => sum + t.attempts, 0);
  const completed = list.filter((t) => t.status === "completed").length;

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-2">AI Learning Dashboard 🚀</h1>
      <p className="text-muted mb-4">
        Generate topics with AI and track your learning progress.
      </p>

      <div className="card shadow-sm mb-4">
        <div className="card-body row g-3">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Example: JavaScript, React"
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
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="col-md-3 d-grid">
            <button className="btn btn-primary" onClick={handleGenerate}>
              Generate Topics
            </button>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h6>Total Attempts</h6>
              <h3>{totalAttempts}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h6>Topics Learned</h6>
              <h3>{list.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h6>Completed</h6>
              <h3>{completed}</h3>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mb-3">My Learning Progress</h4>

      {isLoading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <div className="alert alert-info">
          You haven't completed any quizzes yet.
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Attempts</th>
              <th>Best Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.topicId}>
                <td>{p.title}</td>
                <td>{p.attempts}</td>
                <td>{p.bestScore}</td>
                <td>
                  <span
                    className={`badge ${
                      p.status === "completed"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(`/progress/topic/${p.topicId}`)}
                  >
                    Progress
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() =>
                      navigate(`/quiz/start/${p.topicId}`)
                    }
                  >
                    Continue
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;

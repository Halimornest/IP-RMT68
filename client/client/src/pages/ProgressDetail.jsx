import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTopicProgress,
  fetchQuizHistory,
  fetchTopicVideos,
} from "../features/progress/progressSlice";

const ProgressDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    detail,
    history,
    videos,
    loadingDetail,
    loadingHistory,
    loadingVideos,
  } = useSelector((s) => s.progress);

  useEffect(() => {
    dispatch(fetchTopicProgress(topicId));
    dispatch(fetchQuizHistory(topicId));
    dispatch(fetchTopicVideos(topicId));
  }, [topicId, dispatch]);

  const safeHistory = Array.isArray(history) ? history : [];
  const safeVideos = Array.isArray(videos) ? videos : [];

  if (loadingDetail || !detail) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">{detail.title}</h2>

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
              <span className="badge bg-warning">
                {detail.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mb-3">📝 Quiz History</h4>

      {loadingHistory && <p>Loading quiz history...</p>}

      {!loadingHistory && safeHistory.length === 0 ? (
        <div className="alert alert-secondary">
          No quiz attempts yet.
        </div>
      ) : (
        <ul className="list-group mb-5">
          {safeHistory.map((h, i) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between"
            >
              <span>Attempt #{safeHistory.length - i}</span>
              <span className="fw-bold text-danger">
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

      <h4 className="mb-3">📺 Recommended Videos</h4>

      {loadingVideos && <p>Loading videos...</p>}

      {!loadingVideos && safeVideos.length === 0 && (
        <div className="alert alert-secondary">
          No recommended videos available.
        </div>
      )}

      <div className="row mb-5">
        {safeVideos.map((v) => (
          <div className="col-md-4" key={v.videoId}>
            <div className="card h-100 shadow-sm">
              <img
                src={v.thumbnail}
                className="card-img-top"
                alt={v.title}
              />
              <div className="card-body d-flex flex-column">
                <h6>{v.title}</h6>
                <p className="text-muted">{v.channel}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${v.videoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-danger btn-sm mt-auto"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressDetail;

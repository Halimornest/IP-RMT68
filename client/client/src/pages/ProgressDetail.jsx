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
    if (!topicId) return;

    dispatch(fetchTopicProgress(topicId));
    dispatch(fetchQuizHistory(topicId));
  }, [topicId, dispatch]);

  useEffect(() => {
    if (detail?.topicId && videos.length === 0) {
      dispatch(fetchTopicVideos(detail.topicId));
    }
  }, [detail, videos.length, dispatch]);

  const safeHistory = Array.isArray(history) ? history : [];
  const safeVideos = Array.isArray(videos) ? videos : [];

  if (loadingDetail || !detail) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Loading progress...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">{detail.title}</h2>

      <div className="row mb-4">
        {[
          ["Attempts", detail.attempts],
          ["Best Score", detail.bestScore],
          ["Average", detail.averageScore],
        ].map(([label, value]) => (
          <div className="col-md-3" key={label}>
            <div className="card text-center">
              <div className="card-body">
                <h6>{label}</h6>
                <h3>{value}</h3>
              </div>
            </div>
          </div>
        ))}

        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h6>Status</h6>
              <span className="badge bg-warning">{detail.status}</span>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mb-3">📝 Quiz History</h4>

      {loadingHistory ? (
        <p>Loading quiz history...</p>
      ) : safeHistory.length === 0 ? (
        <div className="alert alert-secondary">No quiz attempts yet.</div>
      ) : (
        <ul className="list-group mb-4">
          {safeHistory.map((h, i) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between"
            >
              <span>Attempt #{safeHistory.length - i}</span>
              <span
                className={`fw-bold ${
                  h.score >= 70 ? "text-success" : "text-danger"
                }`}
              >
                Score: {h.score}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h4 className="mb-3">📺 Recommended Videos</h4>

      {loadingVideos && <p>Loading videos...</p>}

      {!loadingVideos && safeVideos.length === 0 && (
        <div className="alert alert-secondary">
          No recommended videos available.
        </div>
      )}

      <div className="row mb-4">
        {safeVideos.map((v) => (
          <div className="col-md-4" key={v.videoId}>
            <div className="card h-100 shadow-sm">
              <img src={v.thumbnail} className="card-img-top" alt={v.title} />
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

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/")}
        >
          Back
        </button>
        <button
          className="btn btn-success"
          onClick={() => navigate(`/quiz/${detail.topicId}`)}
        >
          Continue Quiz
        </button>
      </div>
    </div>
  );
};

export default ProgressDetail;

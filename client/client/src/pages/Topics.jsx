import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchTopics,
  createTopic,
  deleteTopic,
} from "../features/topics/topicsSlice";

const Topics = () => {
  const dispatch = useDispatch();
  const { list = [], isLoading } = useSelector((s) => s.topics);
  const [title, setTitle] = useState("");

  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(createTopic({ title }));
    setTitle("");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Topics</h2>

      <form onSubmit={submit} className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="New topic"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn btn-primary">Add</button>
      </form>

      {isLoading && <p>Loading...</p>}

      {!isLoading && list.length === 0 && (
        <p className="text-muted">No topics yet.</p>
      )}

      <ul className="list-group">
        {Array.isArray(list) &&
            list.map((t) => (
            <li
                key={t.id}
                className="list-group-item d-flex justify-content-between align-items-center"
            >
                <span>{t.title}</span>

                <div className="d-flex gap-2">
                <Link
                    to={`/quiz/${t.id}`}
                    className="btn btn-sm btn-outline-primary"
                >
                    Start Quiz
                </Link>
                </div>
            </li>
            ))}
        </ul>

    </div>
  );
};

export default Topics;

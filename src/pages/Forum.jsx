import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../features/auth/authContext";
import Sidebar from "../features/dashboard/Sidebar";
import "../../css/dashboard.css";
import "../../css/forum.css";

const FORUM_STORAGE_KEY = "forumPosts";
const initialPosts = [];

export default function ForumPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/signin");
  }

  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(FORUM_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialPosts;
  });

  useEffect(() => {
    localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const [newPost, setNewPost] = useState("");

  function addPost(e) {
    e.preventDefault();
    if (!newPost.trim()) return;
    const p = {
      id: Date.now(),
      author: user?.name || "Saya",
      date: new Date().toLocaleDateString(),
      content: newPost.trim(),
      replies: [],
    };
    setPosts([p, ...posts]);
    setNewPost("");
  }

  function addReply(postId, text) {
    if (!text.trim()) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              replies: [
                ...p.replies,
                { id: Date.now(), author: user?.name || "Saya", date: new Date().toLocaleDateString(), text: text.trim() },
              ],
            }
          : p
      )
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content forum-page">
        <div className="topbar">
          <div>
            <h1>Forum Diskusi</h1>
            <p>Ajukan pertanyaan dan bagikan pendapat dengan teman Anda di sini.</p>
          </div>
        </div>

        <section className="forum-hero">
          <h2>Ayo Berdiskusi!</h2>
          <p>Ajukan pertanyaan dan berbagi pendapat dengan teman Anda di sini.</p>

          <form className="forum-compose" onSubmit={addPost}>
            <textarea
              placeholder="Tuliskan komentar Anda.."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="compose-actions">
              <button type="submit" className="btn-send" style={{ padding: "14px 28px", borderRadius: "12px", fontSize: "16px" }}>
                Kirim <i className="fa-solid fa-paper-plane" style={{ fontSize: "16px", marginLeft: "4px" }} />
              </button>
            </div>
          </form>
        </section>

        <section className="forum-list">
          {posts.length === 0 ? (
            <div className="forum-empty">
              Belum ada komentar. Jadilah yang pertama memulai diskusi.
            </div>
          ) : (
            posts.map((p) => (
              <article key={p.id} className="post-card">
                <div className="post-meta">
                  <div className="post-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="post-author-info">
                    <strong>{p.author}</strong>
                    <div className="post-date">{p.date}</div>
                  </div>
                </div>
                <div className="post-content">{p.content}</div>

                <div className="post-reply-info">
                  <i className="fa-regular fa-comment"></i> {p.replies.length} Pembahasan
                </div>

                <div className="post-reply">
                  <ReplyBox onReply={(text) => addReply(p.id, text)} />
                  {p.replies.length > 0 && (
                    <div className="replies">
                      {p.replies.map((r) => (
                        <div key={r.id} className="reply-item">
                          <div className="post-meta">
                            <div className="post-avatar">
                              <i className="fa-solid fa-user"></i>
                            </div>
                            <div className="post-author-info">
                              <strong>{r.author}</strong>
                              <div className="post-date">{r.date}</div>
                            </div>
                          </div>
                          <div className="reply-text">{r.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

function ReplyBox({ onReply }) {
  const [text, setText] = useState("");

  function submit(e) {
    e.preventDefault();
    onReply(text);
    setText("");
  }

  return (
    <form className="reply-box" onSubmit={submit}>
      <input
        placeholder="Berikan balasan Anda..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="reply-send">
        <i className="fa-solid fa-play"></i>
      </button>
    </form>
  );
}

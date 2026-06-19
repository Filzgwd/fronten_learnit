import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../features/auth/authContext";
import Sidebar from "../features/dashboard/Sidebar";
import { forumApi } from "../features/forum/forumApi";
import "../../css/dashboard.css";
import "../../css/forum.css";

export default function ForumPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/signin");
  }

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState("");

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await forumApi.getAllPosts();
      if (!res.ok) {
        throw new Error(res.error || "Gagal memuat forum");
      }

      const rawPosts = res.data || [];

      // Ambil balasan untuk setiap postingan secara asinkronus
      const postsWithReplies = await Promise.all(
        rawPosts.map(async (p) => {
          const commentsRes = await forumApi.getCommentsByPost(p.id);
          const replies = commentsRes.ok ? commentsRes.data : [];
          return {
            id: p.id,
            author: p.user_name || "Anonim",
            date: new Date(p.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            content: p.content,
            replies: replies.map((r) => ({
              id: r.id,
              author: r.user_name || "Anonim",
              date: new Date(r.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              text: r.content,
            })),
          };
        })
      );

      setPosts(postsWithReplies);
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal memuat diskusi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function addPost(e) {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      const res = await forumApi.createPost(newPost.trim());
      if (!res.ok) {
        throw new Error(res.error || "Gagal mengirim diskusi");
      }
      setNewPost("");
      await fetchPosts();
    } catch (err) {
      alert(err.message);
    }
  }

  async function addReply(postId, text) {
    if (!text.trim()) return;
    try {
      const res = await forumApi.createComment(postId, text.trim());
      if (!res.ok) {
        throw new Error(res.error || "Gagal mengirim balasan");
      }
      await fetchPosts();
    } catch (err) {
      alert(err.message);
    }
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
          {loading ? (
            <div className="forum-empty">
              Sedang memuat forum...
            </div>
          ) : error ? (
            <div className="forum-empty" style={{ color: "#ef4444" }}>
              {error}
            </div>
          ) : posts.length === 0 ? (
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

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/signup", form);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card">
        <h1>Create your account</h1>
        <p className="subtitle">Join in a few seconds, it's free</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
            />
          </div>
          <button className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="switch-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

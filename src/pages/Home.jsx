import { useRef, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const MAX_IMAGE_MB = 2;

const Home = () => {
  const { user, setUser, logout } = useAuth();
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_IMAGE_MB}MB`);
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await api.put("/api/user/profile", { avatar: avatarPreview, bio });
      setUser(res.data);
      setSuccess("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save your profile");
    } finally {
      setSaving(false);
    }
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="home-page">
      <div className="navbar">
        <span className="logo">MERN Auth App</span>
        <button className="logout-btn" onClick={logout}>
          Log out
        </button>
      </div>

      <div className="profile-card">
        <div className="avatar-wrap">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Profile" className="avatar-img" />
          ) : (
            <div className="avatar-placeholder">{initial}</div>
          )}
          <button
            className="avatar-upload-btn"
            onClick={() => fileInputRef.current.click()}
            title="Change picture"
            type="button"
          >
            +
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </div>

        <h2>{user?.name}</h2>
        <p className="email">{user?.email}</p>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <div className="field">
          <label>Tell something about you</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio..."
            maxLength={300}
          />
        </div>

        <button className="btn-primary" onClick={handleSave} disabled={saving} type="button">
          {saving ? "Saving..." : "Save profile"}
        </button>
      </div>
    </div>
  );
};

export default Home;

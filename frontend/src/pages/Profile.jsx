import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import RouteLoader from "../components/RouteLoader";

const BACKEND_URL = "http://localhost:5000"; // For static file serving

/**
 * Profile — Brutalist user profile with heatmap, stats, badges, and activity log.
 */
function Profile() {
  const { user: authUser } = useAuth();
  const { addToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userAPI.getProfile();
        setProfile(res.data);
      } catch (err) {
        addToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile(editData);
      const res = await userAPI.getProfile();
      setProfile(res.data);
      setEditMode(false);
      addToast("Profile updated", "success");
    } catch {
      addToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = () => {
    setEditData({
      bio: profile?.user?.bio || "",
      location: profile?.user?.location || "",
      githubUrl: profile?.user?.githubUrl || "",
      linkedinUrl: profile?.user?.linkedinUrl || "",
      websiteUrl: profile?.user?.websiteUrl || "",
      profilePicture: profile?.user?.profilePicture || "",
    });
    setEditMode(true);
  };

  const handleAvatarClick = () => {
    document.getElementById("avatarInput").click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate
    if (file.size > 2 * 1024 * 1024) {
      addToast("File too large (max 2MB)", "error");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setUploadingAvatar(true);
    try {
      const res = await userAPI.uploadAvatar(formData);
      // Update local profile with new picture path
      setProfile((prev) => ({
        ...prev,
        user: { ...prev.user, profilePicture: res.data.profilePicture },
      }));
      addToast("Avatar updated", "success");
    } catch (err) {
      addToast("Failed to upload avatar", "error");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) return <RouteLoader />;

  const { user: u, stats, languages, heatmap, badges, recentActivity } =
    profile || {};

  return (
    <div className="min-h-screen bg-mesh-brutal flex flex-col font-mono text-white">
      <Navbar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* ── Identity Header ── */}
        <section className="mb-8">
          <div className="card-brutal p-6 flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div 
              onClick={handleAvatarClick}
              className="shrink-0 w-24 h-24 bg-surface border-2 border-accent flex items-center justify-center text-4xl font-black text-accent select-none cursor-pointer group relative overflow-hidden"
            >
              {u?.profilePicture ? (
                <img 
                  src={u.profilePicture.startsWith("http") ? u.profilePicture : `${BACKEND_URL}${u.profilePicture}`} 
                  alt={u.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                u?.name?.[0]?.toUpperCase() || "?"
              )}

              {/* Upload Overlay */}
              <div className="absolute inset-0 bg-accent/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-black text-[10px] font-black tracking-tighter">CHANGE</span>
                <span className="text-black text-[10px] font-black tracking-tighter">AVATAR</span>
              </div>

              {/* Loading Spinner */}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent animate-spin" />
                </div>
              )}

              <input 
                id="avatarInput"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black uppercase tracking-tighter">
                  {u?.name}
                </h1>
                <span className="badge-brutal border-accent text-accent">
                  {u?.role}
                </span>
              </div>

              <div className="text-[11px] text-text-muted mt-1 font-bold">
                {u?.email}
              </div>

              {u?.bio && (
                <p className="text-xs text-text-muted mt-2 max-w-xl leading-relaxed">
                  {u.bio}
                </p>
              )}

              <div className="flex items-center gap-4 mt-3 flex-wrap">
                {u?.location && (
                  <span className="text-[10px] text-text-dim font-black uppercase tracking-widest flex items-center gap-1">
                    <span className="text-accent">◈</span> {u.location}
                  </span>
                )}
                <span className="text-[10px] text-text-dim font-black uppercase tracking-widest">
                  JOINED:{" "}
                  {new Date(u?.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3 mt-3">
                {u?.githubUrl && (
                  <a
                    href={u.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-black text-text-dim hover:text-accent transition-colors uppercase tracking-widest"
                  >
                    [GITHUB]
                  </a>
                )}
                {u?.linkedinUrl && (
                  <a
                    href={u.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-black text-text-dim hover:text-accent transition-colors uppercase tracking-widest"
                  >
                    [LINKEDIN]
                  </a>
                )}
                {u?.websiteUrl && (
                  <a
                    href={u.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-black text-text-dim hover:text-accent transition-colors uppercase tracking-widest"
                  >
                    [WEBSITE]
                  </a>
                )}
              </div>
            </div>

            {/* Edit button */}
            <button onClick={openEdit} className="btn-brutal-secondary shrink-0">
              EDIT_PROFILE
            </button>
          </div>
        </section>

        {/* ── Stats Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="PROBLEMS_SOLVED" value={stats?.totalSolved ?? 0} accent />
          <StatCard label="TOTAL_SUBMISSIONS" value={stats?.totalSubmissions ?? 0} />
          <StatCard label="ACCURACY" value={`${stats?.accuracy ?? 0}%`} accent />
          <StatCard label="CURRENT_STREAK" value={`${stats?.streak ?? 0}d`} />
        </section>

        {/* ── Heatmap ── */}
        <section className="mb-8">
          <div className="card-brutal p-5">
            <h2 className="text-[11px] font-black mb-4 border-b border-border pb-2 text-text-muted tracking-widest">
              ACTIVITY_HEATMAP // LAST_365_DAYS
            </h2>
            <ActivityHeatmap heatmap={heatmap} />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* ── Difficulty Breakdown ── */}
          <div className="card-brutal p-5">
            <h3 className="text-[11px] font-black mb-4 border-b border-border pb-2 text-text-muted tracking-widest">
              DIFFICULTY_PROGRESS
            </h3>
            <div className="flex flex-col gap-4">
              <DifficultyBar
                label="EASY"
                solved={stats?.difficulty?.easy?.solved ?? 0}
                total={stats?.difficulty?.easy?.total ?? 0}
                color="#22C55E"
              />
              <DifficultyBar
                label="MEDIUM"
                solved={stats?.difficulty?.medium?.solved ?? 0}
                total={stats?.difficulty?.medium?.total ?? 0}
                color="#EAB308"
              />
              <DifficultyBar
                label="HARD"
                solved={stats?.difficulty?.hard?.solved ?? 0}
                total={stats?.difficulty?.hard?.total ?? 0}
                color="#FF3B3B"
              />
            </div>
          </div>

          {/* ── Language Distribution ── */}
          <div className="card-brutal p-5">
            <h3 className="text-[11px] font-black mb-4 border-b border-border pb-2 text-text-muted tracking-widest">
              LANGUAGE_DISTRIBUTION
            </h3>
            {languages && languages.length > 0 ? (
              <div className="flex flex-col gap-3">
                {languages.map((lang) => (
                  <LanguageBar key={lang.language} lang={lang} />
                ))}
              </div>
            ) : (
              <div className="text-[10px] text-text-dim font-black">
                NO_DATA_AVAILABLE
              </div>
            )}
          </div>

          {/* ── Badges ── */}
          <div className="card-brutal p-5">
            <h3 className="text-[11px] font-black mb-4 border-b border-border pb-2 text-text-muted tracking-widest">
              ACHIEVEMENTS
            </h3>
            {badges && badges.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {badges.map((b) => (
                  <BadgeCard key={b.id} badge={b} />
                ))}
              </div>
            ) : (
              <div className="text-[10px] text-text-dim font-black">
                NO_BADGES_EARNED_YET
              </div>
            )}
          </div>
        </div>

        {/* ── Recent Submissions ── */}
        <section className="mb-8">
          <div className="card-brutal overflow-hidden">
            <div className="terminal-header">
              RECENT_SUBMISSIONS // LAST_15
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="border-b-2 border-border bg-surface">
                  <tr>
                    <th className="px-4 py-2.5 text-[10px] font-black text-text-dim uppercase text-left">
                      PROBLEM
                    </th>
                    <th className="px-4 py-2.5 text-[10px] font-black text-text-dim uppercase text-center">
                      DIFFICULTY
                    </th>
                    <th className="px-4 py-2.5 text-[10px] font-black text-text-dim uppercase text-center">
                      LANGUAGE
                    </th>
                    <th className="px-4 py-2.5 text-[10px] font-black text-text-dim uppercase text-center">
                      STATUS
                    </th>
                    <th className="px-4 py-2.5 text-[10px] font-black text-text-dim uppercase text-center">
                      TIME
                    </th>
                    <th className="px-4 py-2.5 text-[10px] font-black text-text-dim uppercase text-right">
                      DATE
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentActivity && recentActivity.length > 0 ? (
                    recentActivity.map((s) => (
                      <tr
                        key={s._id}
                        className="hover:bg-surface/50 transition-colors"
                      >
                        <td className="px-4 py-2.5 text-xs font-bold text-white">
                          {s.problemTitle}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <DifficultyBadge diff={s.problemDifficulty} />
                        </td>
                        <td className="px-4 py-2.5 text-center text-[10px] font-black text-text-muted uppercase">
                          {s.language}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <StatusBadge status={s.status} />
                        </td>
                        <td className="px-4 py-2.5 text-center text-[10px] font-black text-text-dim">
                          {s.executionTime || "—"}
                        </td>
                        <td className="px-4 py-2.5 text-right text-[10px] font-bold text-text-dim">
                          {new Date(s.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-[10px] text-text-dim font-black"
                      >
                        NO_SUBMISSIONS_RECORDED
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* ── Edit Modal ── */}
      {editMode && (
        <EditProfileModal
          editData={editData}
          setEditData={setEditData}
          onSave={handleSave}
          onCancel={() => setEditMode(false)}
          saving={saving}
        />
      )}

      <footer className="p-6 border-t border-border text-center text-[10px] text-text-dim font-black tracking-[0.2em]">
        CODESTAGE_V4.0 // PROFILE_MODULE // © 2026
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════ */

function StatCard({ label, value, accent }) {
  return (
    <div className="card-brutal p-4 flex flex-col justify-between gap-2">
      <span className="text-[9px] font-black text-text-dim tracking-widest uppercase">
        {label}
      </span>
      <span
        className={`text-3xl font-black leading-none ${accent ? "text-accent" : "text-white"}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ── Activity Heatmap ── */
function ActivityHeatmap({ heatmap }) {
  const { weeks, months } = useMemo(() => {
    // We use UTC dates for the heatmap calculation to stay consistent with the backend's
    // $dateToString (which defaults to UTC) and avoid local timezone shifts.
    const now = new Date();
    
    // endDate should be "today" in UTC
    const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    
    // startDate should be 364 days ago from Sunday nearest to then
    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - 364);

    // Adjust start to most recent Sunday
    const startDay = startDate.getUTCDay();
    startDate.setUTCDate(startDate.getUTCDate() - startDay);

    const weeks = [];
    let currentWeek = [];
    const monthLabels = [];
    let lastMonth = -1;

    const cursor = new Date(startDate);
    let weekIdx = 0;

    // Use loop to populate grid
    while (cursor <= endDate) {
      const key = cursor.toISOString().split("T")[0];
      const count = heatmap?.[key] || 0;
      const month = cursor.getUTCMonth();

      if (month !== lastMonth) {
        monthLabels.push({
          label: cursor.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
          weekIdx,
        });
        lastMonth = month;
      }

      currentWeek.push({ date: key, count });

      // If it's Saturday or the very last day in our range, push the week
      if (cursor.getUTCDay() === 6 || cursor.getTime() === endDate.getTime()) {
        weeks.push(currentWeek);
        currentWeek = [];
        weekIdx++;
      }

      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return { weeks, months: monthLabels };
  }, [heatmap]);

  const getColor = (count) => {
    if (count === 0) return "#0A0A0A";
    if (count === 1) return "rgba(255, 95, 31, 0.25)";
    if (count <= 3) return "rgba(255, 95, 31, 0.45)";
    if (count <= 5) return "rgba(255, 95, 31, 0.65)";
    return "rgba(255, 95, 31, 0.9)";
  };

  const totalSubmissions = Object.values(heatmap || {}).reduce(
    (a, b) => a + b,
    0
  );
  const activeDays = Object.keys(heatmap || {}).length;

  return (
    <div>
      {/* Month labels */}
      <div className="flex mb-1 pl-6" style={{ gap: "0px" }}>
        {months.map((m, i) => (
          <div
            key={i}
            className="text-[9px] font-black text-text-dim"
            style={{
              position: "relative",
              left: `${m.weekIdx * 14}px`,
              width: 0,
              whiteSpace: "nowrap",
            }}
          >
            {m.label}
          </div>
        ))}
      </div>

      <div className="flex gap-0.5 overflow-x-auto pb-2">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1 shrink-0 justify-start">
          {["", "M", "", "W", "", "F", ""].map((d, i) => (
            <div
              key={i}
              className="text-[8px] font-black text-text-dim h-[12px] flex items-center justify-end pr-1"
              style={{ width: "18px" }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} submission${day.count !== 1 ? "s" : ""}`}
                className="transition-all duration-150 hover:scale-150 cursor-pointer border border-transparent hover:border-accent"
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: getColor(day.count),
                  border:
                    day.count > 0
                      ? "1px solid rgba(255,95,31,0.2)"
                      : "1px solid #1A1A1A",
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-black text-text-dim tracking-widest">
            {totalSubmissions} SUBMISSIONS // {activeDays} ACTIVE_DAYS
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-black text-text-dim mr-1">LESS</span>
          {[0, 1, 2, 4, 6].map((c) => (
            <div
              key={c}
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: getColor(c),
                border: "1px solid #1A1A1A",
              }}
            />
          ))}
          <span className="text-[8px] font-black text-text-dim ml-1">MORE</span>
        </div>
      </div>
    </div>
  );
}

/* ── Difficulty Progress Bar ── */
function DifficultyBar({ label, solved, total, color }) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-black tracking-widest" style={{ color }}>
          {label}
        </span>
        <span className="text-[10px] font-black text-text-muted">
          {solved}/{total}
        </span>
      </div>
      <div className="h-2 bg-surface border border-border">
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ── Language Bar ── */
function LanguageBar({ lang }) {
  const langColors = {
    javascript: "#F7DF1E",
    python: "#3776AB",
    cpp: "#00599C",
    c: "#A8B9CC",
    java: "#ED8B00",
    go: "#00ADD8",
    rust: "#CE422B",
    typescript: "#3178C6",
  };
  const color =
    langColors[lang.language.toLowerCase()] || "var(--color-accent)";

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-black text-white uppercase tracking-widest">
          {lang.language}
        </span>
        <span className="text-[10px] font-black text-text-dim">
          {lang.percentage}% ({lang.count})
        </span>
      </div>
      <div className="h-1.5 bg-surface border border-border">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${lang.percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ── Badge Card ── */
function BadgeCard({ badge }) {
  return (
    <div className="border border-border bg-surface p-3 flex flex-col gap-1 hover:border-accent transition-colors group cursor-default">
      <span className="text-[10px] font-black text-accent group-hover:text-white transition-colors tracking-widest">
        ◆ {badge.label}
      </span>
      <span className="text-[9px] text-text-dim font-bold leading-snug">
        {badge.desc}
      </span>
    </div>
  );
}

/* ── Inline Badges ── */
function DifficultyBadge({ diff }) {
  const colorMap = {
    easy: "text-success border-success/30",
    medium: "text-yellow-500 border-yellow-500/30",
    hard: "text-error border-error/30",
  };
  const cls = colorMap[diff?.toLowerCase()] || "text-text-dim border-border";

  return (
    <span
      className={`badge-brutal ${cls} text-[9px]`}
    >
      {diff?.toUpperCase()}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = status?.toLowerCase() || "";
  let cls = "text-text-dim border-border";
  if (s === "accepted") cls = "text-success border-success/30";
  else if (s.includes("error") || s === "wrong answer" || s === "time limit exceeded")
    cls = "text-error border-error/30";

  return (
    <span className={`badge-brutal ${cls} text-[9px]`}>
      {status?.toUpperCase().replace(/ /g, "_")}
    </span>
  );
}

/* ── Edit Profile Modal ── */
function EditProfileModal({ editData, setEditData, onSave, onCancel, saving }) {
  const update = (field) => (e) =>
    setEditData((d) => ({ ...d, [field]: e.target.value }));

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="card-brutal-accent w-full max-w-lg">
        <div className="terminal-header mb-0 border-b-0">
          EDIT_PROFILE // MODIFY_DATA
        </div>
        <div className="p-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-text-dim tracking-widest">
              BIO
            </span>
            <textarea
              className="input-brutal resize-none h-20"
              value={editData.bio}
              onChange={update("bio")}
              maxLength={300}
              placeholder="Tell us about yourself..."
            />
            <span className="text-[9px] text-text-dim text-right">
              {editData.bio?.length || 0}/300
            </span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-text-dim tracking-widest">
              LOCATION
            </span>
            <input
              className="input-brutal"
              value={editData.location}
              onChange={update("location")}
              placeholder="e.g. Mumbai, India"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-text-dim tracking-widest">
              GITHUB_URL
            </span>
            <input
              className="input-brutal"
              value={editData.githubUrl}
              onChange={update("githubUrl")}
              placeholder="https://github.com/username"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-text-dim tracking-widest">
              LINKEDIN_URL
            </span>
            <input
              className="input-brutal"
              value={editData.linkedinUrl}
              onChange={update("linkedinUrl")}
              placeholder="https://linkedin.com/in/username"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-text-dim tracking-widest">
              WEBSITE_URL
            </span>
            <input
              className="input-brutal"
              value={editData.websiteUrl}
              onChange={update("websiteUrl")}
              placeholder="https://yoursite.com"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-text-dim tracking-widest">
              PROFILE_PICTURE_URL (OPTIONAL)
            </span>
            <input
              className="input-brutal"
              value={editData.profilePicture}
              onChange={update("profilePicture")}
              placeholder="https://example.com/image.jpg"
            />
          </label>

          <div className="flex items-center gap-3 mt-2">
            <button
              className="btn-brutal flex-1"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? "SAVING..." : "SAVE_CHANGES"}
            </button>
            <button
              className="btn-brutal-secondary flex-1"
              onClick={onCancel}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

export function VolunteerProfileSkeleton() {
  return (
    <div className="profile-container">
      {/* Identity card */}
      <div className="profile-skel-card">
        <div className="profile-skel-banner skel" />
        <div className="profile-skel-head">
          <div className="skel" style={{ height: 28, width: 220, borderRadius: 6 }} />
          <div className="skel" style={{ height: 14, width: 120, borderRadius: 6 }} />
          <div style={{ display: "flex", gap: 6 }}>
            <div className="skel" style={{ height: 24, width: 70, borderRadius: 12 }} />
            <div className="skel" style={{ height: 24, width: 90, borderRadius: 12 }} />
            <div className="skel" style={{ height: 24, width: 60, borderRadius: 12 }} />
          </div>
        </div>
      </div>

      {/* About section */}
      <div className="profile-skel-section">
        <div className="skel" style={{ height: 20, width: 60, borderRadius: 6 }} />
        <div className="skel" style={{ height: 13, width: "100%", borderRadius: 4 }} />
        <div className="skel" style={{ height: 13, width: "95%", borderRadius: 4 }} />
        <div className="skel" style={{ height: 13, width: "70%", borderRadius: 4 }} />
      </div>

      {/* Experience section */}
      <div className="profile-skel-section">
        <div className="skel" style={{ height: 20, width: 100, borderRadius: 6 }} />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingTop: 4 }}
          >
            <div
              className="skel"
              style={{ width: 36, height: 36, borderRadius: 6, flexShrink: 0 }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="skel" style={{ height: 13, width: "90%", borderRadius: 4 }} />
              <div className="skel" style={{ height: 13, width: "60%", borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VolunteerGridSkeleton() {
  return (
    <div>
      <div className="skel" style={{ height: 14, width: 180, marginBottom: 18 }} />

      <div className="volunteer-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="volunteer-card" style={{ pointerEvents: "none" }}>
            {/* Banner */}
            <div className="volunteer-card-banner skel" style={{ borderRadius: 0 }} />

            <div className="volunteer-card-body" style={{ paddingTop: 36 }}>
              {/* Name */}
              <div className="skel" style={{ height: 18, width: "65%", borderRadius: 6 }} />
              {/* Location */}
              <div className="skel" style={{ height: 12, width: "40%", borderRadius: 6 }} />
              {/* Desc lines */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
                <div className="skel" style={{ height: 11, width: "100%", borderRadius: 4 }} />
                <div className="skel" style={{ height: 11, width: "80%", borderRadius: 4 }} />
              </div>
              {/* Tags */}
              <div style={{ display: "flex", gap: 5, marginTop: "auto", paddingTop: 6 }}>
                <div className="skel" style={{ height: 20, width: 52, borderRadius: 10 }} />
                <div className="skel" style={{ height: 20, width: 44, borderRadius: 10 }} />
                <div className="skel" style={{ height: 20, width: 60, borderRadius: 10 }} />
              </div>
            </div>

            <div className="volunteer-card-footer">
              <div className="skel" style={{ height: 12, width: 80, borderRadius: 4 }} />
              <div className="skel" style={{ height: 12, width: 72, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

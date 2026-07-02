export function AuthLeft({ heading, sub }) {
  return (
    <div className="auth-left">
      <div className="auth-left-grid" />
      <div className="auth-left-glow" />
      <div className="logo" style={{ position: "relative", zIndex: 2 }}>
        <div className="logo-mark" />
        VCS
      </div>
      <div className="auth-left-body">
        <div className="auth-left-tag">Vehicle Charter Service</div>
        <h2 className="auth-left-h" dangerouslySetInnerHTML={{ __html: heading }} />
        <p className="auth-left-p">{sub}</p>
      </div>
      <div className="auth-mini-stats">
        {[{ v:"12K+",l:"Journeys"},{v:"98%",l:"On-Time"},{v:"200+",l:"Fleet"},{v:"24/7",l:"Support"}].map((s)=>(
          <div className="ams" key={s.l}><div className="ams-v">{s.v}</div><div className="ams-l">{s.l}</div></div>
        ))}
      </div>
    </div>
  );
}

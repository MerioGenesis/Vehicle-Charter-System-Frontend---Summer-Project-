import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFleet } from "../api/vehicles";
import { useAuth } from "../auth/AuthContext";
import { useReveal } from "../hooks/useReveal";
import { FleetVisual } from "../components/FleetVisual";
import { SERVICES, FLEET_CATS, STATS } from "../data/landingContent";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeFleet, setActiveFleet] = useState(0);
  const [fleetCat, setFleetCat] = useState("all");
  const [fleet, setFleet] = useState([]);
  const [fleetLoading, setFleetLoading] = useState(true);
  const [fleetError, setFleetError] = useState(null);
  useReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    getFleet()
      .then((data) => { setFleet(data); setFleetError(null); })
      .catch((err) => { console.error("Failed to load fleet from API:", err); setFleetError(err.message); })
      .finally(() => setFleetLoading(false));
  }, []);

  const filteredFleet = fleet.filter(v => fleetCat === "all" || v.cat === fleetCat);
  const selectedVehicle = filteredFleet[activeFleet] || filteredFleet[0] || null;

  return (
    <>
      {/* NAV */}
      <nav className={`nav${scrolled ? " stuck" : ""}`}>
        <div className="logo"><div className="logo-mark" />Vehicle Charter Service</div>
        <ul className="nav-links">
          {["Services","Fleet","About","Contact"].map((l) => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-greeting">Hi, {user.u_f_name}</span>
              <button className="btn-ghost" onClick={() => { logout(); navigate("/"); }}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => navigate("/login")}>Sign In</button>
              <button className="btn-gold"  onClick={() => navigate("/register")}>Register</button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-bar" />
        <div className="hero-content">
          <div className="hero-eye">Vehicle Charter Service</div>
          <h1 className="hero-h1">
            Cars, Coaches,
            <strong><em>&amp; Boats</em> for hire.</strong>
          </h1>
          <p className="hero-sub">
            Charter a car for a business trip, a coach for your group, or a boat for a day on the water. Professional drivers and crew, straightforward booking.
          </p>
          <div className="hero-btns">
            <button className="btn-lg" onClick={() => navigate(user ? "/customer/book" : "/register")}>Book a Vehicle</button>
            <button className="btn-txt"><span />View Our Fleet</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        {STATS.map((s, i) => (
          <div className={`stat reveal d${i+1}`} key={s.label}>
            <div className="stat-v">{s.value}</div>
            <div className="stat-l">{s.label}</div>
          </div>
        ))}
      </div>

      {/* SERVICES */}
      <section className="section" id="services" style={{ background:"var(--black)" }}>
        <div className="svc-head reveal">
          <div>
            <div className="sec-eye">What We Offer</div>
            <h2 className="sec-h2">Charter Services<br /><em>by Land &amp; Water</em></h2>
            <p className="svc-desc">Whether you need a car, a coach, or a boat — we have the right vehicle and crew for the job.</p>
          </div>
        </div>
        <div className="svc-grid">
          {SERVICES.map((s, i) => (
            <div className={`svc-card reveal d${i+1}`} key={s.title}>
              <span className="svc-icon">{s.icon}</span>
              <div className="svc-title">{s.title}</div>
              <p className="svc-text">{s.desc}</p>
              <div className="svc-more">Learn more →</div>
            </div>
          ))}
        </div>
      </section>

      {/* FLEET */}
      <section className="section" id="fleet" style={{ background:"var(--b2)" }}>
        <div className="fleet-wrap">
          <div>
            <div className="sec-eye reveal">Our Fleet</div>
            <h2 className="sec-h2 reveal d1">Cars, Coaches<br /><em>&amp; Boats</em></h2>
            <div className="fleet-cats reveal d2">
              {FLEET_CATS.map((c) => (
                <button
                  key={c}
                  className={`fleet-cat-btn${fleetCat === c ? " on" : ""}`}
                  onClick={() => { setFleetCat(c); setActiveFleet(0); }}
                >
                  {c === "all" ? "All" : c === "car" ? "🚗 Cars" : c === "coach" ? "🚌 Coaches" : "⛵ Boats"}
                </button>
              ))}
            </div>
            <div className="fleet-tabs reveal d3">
              {fleetLoading && <p className="fleet-status">Loading fleet…</p>}
              {!fleetLoading && fleetError && <p className="fleet-status">Couldn't load the fleet ({fleetError}).</p>}
              {!fleetLoading && !fleetError && filteredFleet.length === 0 && <p className="fleet-status">No vehicles found.</p>}
              {filteredFleet.map((v, i) => (
                <div key={v.id ?? v.name} className={`fleet-tab${activeFleet === i ? " on" : ""}`} onClick={() => setActiveFleet(i)}>
                  <div>
                    <div className="ft-name">{v.name}</div>
                    <div className="ft-type">{v.type} · {v.seats}</div>
                  </div>
                  <div className="ft-tag">{v.tag}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="fleet-vis-col">
            <div className="fleet-vis reveal d2">
              <FleetVisual vehicle={selectedVehicle} />
              {selectedVehicle && (
                <div className="fleet-info">
                  <div className="fi-name">{selectedVehicle.name}</div>
                  <div className="fi-detail">
                    {selectedVehicle.type}
                    <b>·</b>
                    {selectedVehicle.seats}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="section" id="contact" style={{ background:"var(--black)" }}>
        <div className="book-wrap reveal">
          <div>
            <div className="sec-eye">Make a Booking</div>
            <h2 className="sec-h2">Ready to<br /><em>Get Moving?</em></h2>
            <p className="book-sub">Fill in the quick form to request a vehicle. Our team will confirm availability and get back to you promptly.</p>
          </div>
          <div className="book-form">
            <div><label className="f-lbl">Pickup Location</label><input className="f-inp" placeholder="Enter address or postcode" /></div>
            <div><label className="f-lbl">Date &amp; Time</label><input className="f-inp" type="datetime-local" /></div>
            <div>
              <label className="f-lbl">Vehicle Type</label>
              <select className="f-inp" style={{ cursor:"pointer" }}>
                <option value="">Select a vehicle type</option>
                {fleet.map((v) => <option key={v.id ?? v.name} value={v.id}>{v.name} — {v.seats}</option>)}
              </select>
            </div>
            <button className="btn-book" onClick={() => navigate(user ? "/customer/book" : "/register")}>Request a Quote</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="foot-grid">
          <div>
            <div className="logo"><div className="logo-mark" />Vehicle Charter Service</div>
            <p className="foot-desc">A professional vehicle charter operator serving individuals, businesses, and groups across the region.</p>
          </div>
          {[
            { t:"Services", ls:["Corporate Charter","Event Transport","Airport Transfers","Long-Distance Hire"] },
            { t:"Company",  ls:["About Us","Our Fleet","Careers","News"] },
            { t:"Contact",  ls:["0800 000 0000","info@vcs.co.uk","Mon–Sun 24hr","Live Chat"] },
          ].map((col) => (
            <div key={col.t}>
              <div className="foot-ht">{col.t}</div>
              <ul className="foot-ul">{col.ls.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="foot-bot">
          <div className="foot-copy">© 2026 <span>Vehicle Charter Service</span>. All rights reserved.</div>
          <div className="foot-copy">Privacy · Terms</div>
        </div>
      </footer>
    </>
  );
}

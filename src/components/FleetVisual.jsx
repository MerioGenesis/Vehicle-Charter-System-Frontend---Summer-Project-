export function FleetVisual({ vehicle }) {
  if (!vehicle) return null;
  const cat = vehicle.cat;

  if (vehicle.imageUrl) {
    return (
      <div className="vis-wrap vis-photo">
        <img className="vis-img" src={vehicle.imageUrl} alt={vehicle.name} loading="lazy" />
      </div>
    );
  }

  return (
    <div className="vis-wrap">
      {cat === "car" && (
        <>
          <div className="car-body" />
          <div className="car-roof" />
          <div className="car-wl" />
          <div className="car-wr" />
        </>
      )}
      {cat === "coach" && (
        <>
          <div className="coach-body" />
          <div className="coach-windows">
            {[...Array(6)].map((_, i) => <div className="coach-win" key={i} />)}
          </div>
          <div className="coach-wl" />
          <div className="coach-wm" />
          <div className="coach-wr" />
        </>
      )}
      {cat === "boat" && (
        <>
          <div className="boat-water" />
          <div className="boat-hull" />
          <div className="boat-cabin" />
          <div className="boat-mast" />
        </>
      )}
      <div className="vis-glow" />
    </div>
  );
}

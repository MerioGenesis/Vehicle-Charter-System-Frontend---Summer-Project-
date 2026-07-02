import { apiFetch } from "./client";

// Maps a backend vehicle record ({ v_name, v_seatsNo, vehicleType, ... })
// into the shape the fleet UI (mainpage.jsx) was already built around.
export function toFleetItem(vehicle) {
  const cat = (vehicle.vehicleType || "").toLowerCase();
  return {
    id: vehicle.v_id,
    name: vehicle.v_name,
    type: vehicle.vehicleType,
    seats: `${vehicle.v_seatsNo} passengers`,
    tag: (vehicle.vehicleType || "").toUpperCase(),
    cat,
  };
}

export async function getFleet() {
  const vehicles = await apiFetch("/vehicles");
  return vehicles.map(toFleetItem);
}

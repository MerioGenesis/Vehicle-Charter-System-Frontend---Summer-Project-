import { apiFetch } from "./client";

// Maps a backend vehicle record ({ v_name, v_seatsNo, vehicleType, ... })
// into the shape the fleet UI (LandingPage, the booking wizard) expects.
export function toFleetItem(vehicle) {
  const cat = (vehicle.vehicleType || "").toLowerCase();
  return {
    id: vehicle.v_id,
    name: vehicle.v_name,
    type: vehicle.vehicleType,
    seats: `${vehicle.v_seatsNo} passengers`,
    tag: (vehicle.vehicleType || "").toUpperCase(),
    cat,
    imageUrl: vehicle.v_imageURL || null,
  };
}

export async function getFleet() {
  const vehicles = await apiFetch("/vehicles");
  return vehicles.map(toFleetItem);
}

export async function getVehicle(id) {
  return toFleetItem(await apiFetch(`/vehicles/${id}`));
}

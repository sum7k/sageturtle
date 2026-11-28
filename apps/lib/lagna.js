// The lagna: the sign of the zodiac that is rising on the eastern horizon at a place and a moment. It moves through
// all twelve signs in a day, about two hours each. Home will arrange its buttons by it (sumeet, 2026-11-28).
// This is the Vedic (sidereal) lagna with the Lahiri ayanamsa, the one printed in Indian almanacs.
// North Indian way of reading it: the twelve houses stay where they are; the rising sign sits in house 1 and the
// other signs follow in order.
export const SIGN_NAMES = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];
/** Ujjain, the old zero point of Indian astronomy. Used when the person does not share where they are. */
export const UJJAIN = { lat: 23.1765, lon: 75.7885 };

const RAD = Math.PI / 180;
const turn = (deg) => ((deg % 360) + 360) % 360;

/** The rising point of the zodiac, in degrees from the start of Mesha (0 to 360). */
export function risingDegree(now = Date.now(), { lat, lon } = UJJAIN) {
  const days = now / 86400000 - 10957.5; // days since noon on 1 January 2000 (UTC)
  const t = days / 36525;
  const star = turn(280.46061837 + 360.98564736629 * days + 0.000387933 * t * t + lon) * RAD; // local star time
  const tilt = (23.439291 - 0.0130042 * t) * RAD; // the tilt of the Earth
  const safe = Math.max(-66, Math.min(66, lat)) * RAD; // near the poles some signs never rise
  const tropical = Math.atan2(Math.cos(star), -(Math.sin(star) * Math.cos(tilt) + Math.tan(safe) * Math.sin(tilt))) / RAD;
  const ayanamsa = 23.853 + 0.0139689 * (days / 365.25); // Lahiri: how far the star zodiac has slipped from the seasons
  return turn(tropical - ayanamsa);
}

/** The rising sign, 0 (Mesha) to 11 (Meena). */
export const lagna = (now, place) => Math.floor(risingDegree(now, place) / 30);

/** The sign in each of the twelve houses, house 1 first. */
export const houses = (now, place) => { const first = lagna(now, place); return Array.from({ length: 12 }, (_, i) => (first + i) % 12); };

// Where the person is. The first screen asks the phone for its place. It is used for two things only: to guess the
// language, and to work out the lagna (lib/lagna.js). If the person says no, nothing depends on it: the language guess
// falls back to the phone's language and the state Cloudflare sees, and the lagna to Ujjain.
// The place stays on the phone, rounded to about 10 km. It is not sent to the server.
import { UJJAIN } from "./lagna.js";

export const KEY = "bodhilabs.place.v1";

// Towns, by the language most people there speak. The nearest town decides. Rough on purpose: it is only a first guess.
const TOWNS = {
  hi: [[28.61, 77.21], [26.85, 80.95], [25.6, 85.14], [23.26, 77.41], [26.91, 75.79], [23.36, 85.33], [21.25, 81.63], [30.32, 78.03], [31.1, 77.17], [25.32, 82.97], [22.72, 75.86], [29.39, 76.97], [26.22, 78.18], [24.59, 73.71], [26.3, 73.02], [25.44, 81.85], [27.18, 78.01], [30.73, 76.78], [31.63, 74.87], [30.9, 75.85]],
  bn: [[22.57, 88.36], [26.72, 88.43], [23.83, 91.28], [23.24, 87.86], [24.1, 88.25]],
  mr: [[19.08, 72.88], [18.52, 73.86], [21.15, 79.09], [19.88, 75.34], [20.0, 73.79], [16.7, 74.24], [17.66, 75.91]],
  te: [[17.39, 78.49], [16.51, 80.65], [17.69, 83.22], [13.63, 79.42], [18.0, 79.59], [15.83, 78.04]],
  ta: [[13.08, 80.27], [11.0, 76.96], [9.93, 78.12], [10.79, 78.7], [8.73, 77.7], [11.66, 78.15], [11.94, 79.81]],
  gu: [[23.02, 72.57], [21.17, 72.83], [22.31, 73.18], [22.3, 70.8], [21.76, 72.15], [23.25, 69.67]],
  ur: [[34.08, 74.8]],
  kn: [[12.97, 77.59], [12.3, 76.64], [15.36, 75.12], [12.91, 74.86], [15.85, 74.5], [17.33, 76.83], [14.46, 75.92]],
  or: [[20.3, 85.82], [20.46, 85.88], [21.47, 83.97], [19.31, 84.79], [22.26, 84.85]],
  pa: [[31.63, 74.87], [30.9, 75.85], [31.33, 75.58], [30.34, 76.39], [30.21, 74.95], [30.73, 76.78]],
  ml: [[8.52, 76.94], [9.93, 76.27], [11.26, 75.78], [10.53, 76.21], [11.87, 75.37]],
};
const FAR = 3.5; // degrees; farther than this from every town, we make no guess

/** The language to guess for a place, or "" when the place is far from every town we know. */
export function placeLang(place) {
  if (!place) return "";
  let best = "", near = FAR * FAR;
  for (const [lang, towns] of Object.entries(TOWNS)) for (const [lat, lon] of towns) {
    const d = (lat - place.lat) ** 2 + ((lon - place.lon) * Math.cos((place.lat * Math.PI) / 180)) ** 2;
    if (d < near) { near = d; best = lang; }
  }
  return best;
}

const good = (p) => p && Number.isFinite(p.lat) && Number.isFinite(p.lon) && Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180;
const round = (p) => ({ lat: Math.round(p.lat * 10) / 10, lon: Math.round(p.lon * 10) / 10 });

/** The place this phone gave earlier, or null. */
export function savedPlace() {
  try { const p = JSON.parse(localStorage.getItem(KEY)); return good(p) ? p : null; } catch { return null; }
}
/** The place to work the lagna out for: the person's own, else Ujjain. */
export const placeOrUjjain = () => savedPlace() ?? UJJAIN;

/** Ask the phone where it is. Gives the place (rounded, and saved on the phone) or null. It never throws and never waits long. */
export function askPlace(geo = globalThis.navigator?.geolocation) {
  return new Promise((done) => {
    if (!geo) return done(null);
    const stop = setTimeout(() => done(null), 20000);
    geo.getCurrentPosition(
      (pos) => {
        clearTimeout(stop);
        const p = round({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        if (!good(p)) return done(null);
        try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
        done(p);
      },
      () => { clearTimeout(stop); done(null); },
      { enableHighAccuracy: false, maximumAge: 86400000, timeout: 15000 },
    );
  });
}

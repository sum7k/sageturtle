// Home has eleven buttons. Only Book is open. The other ten are greyed out and carry no name: each shows one
// picture from the pool below. A tap on one does nothing but get counted, so we learn which kinds of picture
// people reach for. Each phone sees ten of the pool, and a different ten each day.
// This file is also read by the Worker, to accept counts only for things that exist.
export const BOOK = { id: "book", href: "/book", icon: "M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z M5 17a3 3 0 0 1 3-3h10" };

/** The pool of pictures. The id is what the admin panel shows; the picture is an emoji, which costs nothing. */
export const ICONS = {
  money: "💰", bank: "🏦", job: "💼", shop: "🛒", gift: "🎁", gold: "🪙",
  calendar: "📅", clock: "⏰", weather: "⛅", map: "🗺️", bus: "🚌", train: "🚆", bike: "🏍️",
  chat: "💬", phone: "📞", video: "📹", people: "👨‍👩‍👧", heart: "❤️", baby: "👶",
  news: "📰", tv: "📺", radio: "📻", movie: "🎬", music: "🎵", mic: "🎤", camera: "📷",
  cricket: "🏏", game: "🎮", star: "⭐", moon: "🌙",
  health: "🩺", medicine: "💊", food: "🍲", farm: "🌾", tractor: "🚜", cow: "🐄",
  school: "🏫", tools: "🛠️", house: "🏠", law: "⚖️",
};
export const ICON_IDS = Object.keys(ICONS);
export const LOCKED = 10;

/** A small repeatable random number maker, so the same phone gets the same pictures all day. */
function maker(text) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.codePointAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/** The ten pictures one phone shows on one day. `seed` is any text that stays the same for the phone. */
export function iconsFor(seed, day) {
  const next = maker(`${seed}|${day}`);
  const pool = [...ICON_IDS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, LOCKED);
}

/** What is counted: taps on Book, taps on a picture ("icon:money"), and a picture being shown ("seen:money"). */
export const TRACKED = [BOOK.id, ...ICON_IDS.map((i) => `icon:${i}`), ...ICON_IDS.map((i) => `seen:${i}`)];

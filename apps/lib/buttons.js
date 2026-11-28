// The eleven buttons of Home, in order. Apps are released one by one: only Book is open now, the rest are locked.
// A locked button shows a lock and counts the tap, so we learn which app people want next.
// The icons are placeholders. This file is also read by the Worker, to accept taps only for buttons that exist.
export const BUTTONS = [
  { id: "book", open: true, href: "/book", icon: "M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z M5 17a3 3 0 0 1 3-3h10" },
  { id: "horoscope", icon: "M20 14.5A8 8 0 1 1 9.500 4a6.5 6.5 0 0 0 10.500 10.500z M17 3v4 M15 5h4" },
  { id: "khabri", icon: "M4 5h13v14H6a2 2 0 0 1-2-2V5z M17 9h3v8a2 2 0 0 1-2 2 M8 9h5 M8 13h5" },
  { id: "earn", icon: "M7 5h10 M7 9h10 M7 5h3a4 4 0 0 1 0 8H7l7 7" },
  { id: "reminders", icon: "M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4" },
  { id: "hobbies", icon: "M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3z" },
  { id: "meetings", icon: "M3 7h12v10H3z M15 10.5l6-3v9l-6-3" },
  { id: "messages", icon: "M4 5h16v11H9l-5 4V5z" },
  { id: "discussions", icon: "M3 4h12v8H8l-5 4V4z M9 14v2h7l5 4V8h-4" },
  { id: "events", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 3" },
  { id: "directory", icon: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4" },
];
export const buttonById = (id) => BUTTONS.find((b) => b.id === id) ?? null;
/** Everything whose taps are counted: the eleven buttons and the ad on Home. */
export const TRACKED = [...BUTTONS.map((b) => b.id), "ad"];

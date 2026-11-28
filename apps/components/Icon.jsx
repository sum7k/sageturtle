/** Line pictures. They stand in for drawn pictures in Khabri's style. Each is one SVG path. */
export const P = {
  back: "M15 5l-7 7 7 7",
  next: "M5 12h14 M13 6l6 6-6 6",
  tick: "M5 12.5l4.5 4.5L19 7.5",
  cross: "M6 6l12 12 M18 6L6 18",
  plus: "M12 5v14 M5 12h14",
  home: "M4 11l8-7 8 7 M6 10v10h12V10 M10 20v-6h4v6",
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4.5 20a7.5 7.5 0 0 1 15 0",
  speak: "M4 10v4h3l5 4V6L7 10H4z M16 9a4 4 0 0 1 0 6 M18.5 6.5a8 8 0 0 1 0 11",
  mic: "M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z M6 11a6 6 0 0 0 12 0 M12 17v4",
  share: "M12 15V4 M8 8l4-4 4 4 M5 13v6h14v-6",
  heart: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z",
  finger: "M7 19c1-2 1.5-4.5 1.5-7a3.5 3.5 0 0 1 7 0c0 3-.5 5.5-1.5 8 M12 12c0 3-.5 5.5-1.7 8 M5 15.5c.3-1.2.5-2.3.5-3.5a6.5 6.5 0 0 1 11.500-4.2 M18.5 11.5c.1 2.5-.2 5-.9 7",
  keypad: "M6 5h.01 M12 5h.01 M18 5h.01 M6 11h.01 M12 11h.01 M18 11h.01 M6 17h.01 M12 17h.01 M18 17h.01",
  pin: "M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.400-6 11-6 11z M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  bell: "M6 16v-5a6 6 0 0 1 12 0v5l2 2H4l2-2z M10 20a2 2 0 0 0 4 0",
  talk: "M4 5h16v11H9l-5 4V5z",
  grid: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z",
  erase: "M9 6h11v12H9l-6-6 6-6z M13 10l4 4 M17 10l-4 4",
  camera: "M4 8h3l2-2h6l2 2h3v11H4z M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  noads: "M4 10v4h3l8 4V6L7 10H4z M18 9v6 M3 3l18 18",
  down: "M12 4v12 M6 11l6 6 6-6 M5 20h14",
  dots: "M6 12h.01 M12 12h.01 M18 12h.01",
  star: "M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3z",
  hide: "M3 3l18 18 M10.5 6.2A9 9 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3 3.5 M6.5 7.5A17 17 0 0 0 2 12s4 6 10 6a9 9 0 0 0 3-.5 M9.9 9.9a3 3 0 0 0 4.2 4.2",
  left: "M19 12H5 M11 6l-6 6 6 6",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  whatsapp: "M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3z M9 8.5c0 3 2.5 6 6 6.5l1-1.5-2-1-1 .8c-1-.5-1.8-1.3-2.3-2.3l.8-1-1-2z",
  telegram: "M21 4L3 11l6 2 2 6 3-4 4 3 3-14z M9 13l8-6",
  sms: "M4 5h16v11H9l-5 4V5z M8 10.5h.01 M12 10.5h.01 M16 10.5h.01",
  picture: "M4 5h16v14H4z M4 16l5-5 4 4 3-3 4 4 M15 9.500h.01",
  open: "M9 5H5v14h14v-4 M13 5h6v6 M19 5l-9 9",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18",
  lock: "M6 11h12v9H6z M8.500 11V8a3.5 3.5 0 0 1 7 0v3",
  book: "M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z M5 17a3 3 0 0 1 3-3h10",
};

export default function Icon({ d, size = 24, sw = 2, label, style }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })} style={style}>
      <path d={d} />
    </svg>
  );
}

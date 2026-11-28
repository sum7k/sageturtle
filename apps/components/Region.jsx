/**
 * One line drawing per language for the first screen: a place, a food or a thing from where the language is spoken.
 * No religious symbols. These are placeholders until proper drawings are made.
 */
const D = {
  // Taj Mahal
  hi: "M6 41h36 M12 41V25h24v16 M17 25a7 8 0 0 1 14 0 M24 13v4 M8 41V19 M40 41V19 M6 19h4 M38 19h4 M21 41v-7a3 3 0 0 1 6 0v7",
  // Howrah Bridge
  bn: "M4 33h40 M14 33V13 M34 33V13 M14 13Q24 22 34 13 M14 13Q8 23 4 33 M34 13Q40 23 44 33 M9 33v-9 M39 33v-9 M24 33V18 M19 33V16 M29 33V16 M5 40q3-3 6 0t6 0 6 0 6 0 6 0 6 0",
  // Gateway of India
  mr: "M5 41h38 M9 41V17h30v24 M19 41V29a5 5 0 0 1 10 0v12 M9 23h30 M9 17v-6h5v6 M34 17v-6h5v6 M19 17v-4h10v4 M21 13a3 3 0 0 1 6 0 M12 41v-9h3v9 M33 41v-9h3v9",
  // Charminar
  te: "M10 42V10 M38 42V10 M16 42V19h16v23 M10 19h28 M10 27h28 M20 42V34a4 4 0 0 1 8 0v8 M8 10a2 3 0 0 1 4 0 M36 10a2 3 0 0 1 4 0 M10 7V4 M38 7V4 M16 19v-6 M32 19v-6 M14 13h4 M30 13h4",
  // A dosa on a plate, with two bowls
  ta: "M4 31a20 7 0 0 0 40 0a20 7 0 0 0-40 0z M11 30L34 12l-3 19z M17 26l14-4 M36 31a3 1.5 0 0 0 6 0 M31 35a3 1.5 0 0 0 6 0",
  // A kite
  gu: "M24 4l13 15-13 18-13-18z M24 4v33 M11 19h26 M24 37q-5 2-1 5t-1 4 M21 40l-3 1 M26 43l3 1",
  // A pen and an inkpot
  ur: "M33 5l7 7-17 17-9 3 3-9z M29 9l7 7 M14 32l-4 4 M7 43h18 M9 43v-5h14v5 M12 38v-2h8v2",
  // An elephant
  kn: "M16 18a13 9 0 0 1 24 3v17h-5v-8H24v8h-5V27 M17 18a7 7 0 0 0-10 6c0 5 1 9 2 14 M9 38h4c0-4-1-7-1-10 M11.500 23h.01 M15 17q5 4 3 11 M40 22q4 3 3 9",
  // The stone wheel of Konark
  or: "M24 43a19 19 0 1 0 0-38 19 19 0 0 0 0 38z M24 28a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M24 5v15 M24 28v15 M5 24h15 M28 24h15 M10.500 10.500l10.700 10.700 M26.800 26.800l10.700 10.700 M37.500 10.500L26.800 21.200 M21.200 26.800L10.500 37.500",
  // A coconut palm and a boat
  ml: "M31 38V17 M31 17q-8-7-15-1 M31 17q8-7 14-1 M31 17q-5-10-13-8 M31 17q5-10 12-7 M31 17q-1-8 1-12 M4 38q11 8 24 0z M10 38v-5h10v5 M4 44q3-2 6 0t6 0 6 0 6 0 6 0 6 0",
};

export default function Region({ lang, size = 64 }) {
  if (lang === "en") {
    return (
      <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
        <text x="24" y="31" textAnchor="middle" fontSize="20" fontWeight="700" fill="currentColor" fontFamily="inherit">ABC</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={D[lang]} />
    </svg>
  );
}

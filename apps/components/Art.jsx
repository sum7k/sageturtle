/** The drawn picture of a khabar: a sun and a hill in the khabar's colours. We never reuse a publisher's photo. */
export default function Art({ art = {} }) {
  const a = { bg: "#fff0bf", c1: "#ffc531", c2: "#bfe6cc", ...art };
  return (
    <svg aria-hidden="true" viewBox="0 0 358 150" preserveAspectRatio="xMidYMid slice" style={{ background: a.bg, display: "block", width: "100%", height: "100%" }}>
      <circle cx="262" cy="62" r="44" fill={a.c1} />
      <path d="M0 112 Q90 66 190 106 T358 90 V150 H0 Z" fill={a.c2} />
    </svg>
  );
}

/** The turtle on its hill, the only picture on the landing page. */
export function Turtle() {
  return (
    <svg role="img" aria-label="A turtle on a green hill under the sun" viewBox="0 0 300 240" style={{ width: "100%", maxWidth: 320 }}>
      <circle cx="228" cy="62" r="40" fill="#ffc531" />
      <path d="M0 190 Q80 120 170 170 T300 150 V240 H0 Z" fill="#bfe6cc" />
      <ellipse cx="130" cy="150" rx="52" ry="34" fill="#7fb894" />
      <path d="M92 150a38 26 0 0 1 76 0z" fill="#5a9c74" />
      <circle cx="190" cy="140" r="14" fill="#7fb894" />
      <circle cx="195" cy="136" r="2.5" fill="#14174a" />
      <path d="M100 176v12 M160 176v12" stroke="#7fb894" strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}

// The drawings of the lessons (lib/lessons.js). Each is a small SVG that the phone draws and moves by itself
// (the moves are CSS, in app/globals.css under "lessons"). There is no video file and no animation library.
// No drawing holds a written word, so one drawing serves every language. Animals and fruit are the phone's own
// emoji, as elsewhere in the app; fire, people, land and sky are drawn here.

const NIGHT = "#14174a", DUSK = "#2b2f5e", SKY = "#cfe8ff", HILL = "#bfe6cc", GRASS = "#7fb894", LEAF = "#5a9c74";
const SUN = "#ffc531", FLAME = "#ff8a3d", EARTH = "#c9a27a", STONE = "#9aa0b5", WOOD = "#8a5a3c", SKIN = "#c68a5e", WATER = "#8fd0f5";

/** A picture from the phone's emoji, placed by its middle. `move` is one of the CSS moves. */
const E = ({ x, y, s = 90, move = "", children, delay }) => (
  <text x={x} y={y} fontSize={s} textAnchor="middle" dominantBaseline="central" className={`mv ${move}`} style={delay ? { animationDelay: `${delay}s` } : undefined}>{children}</text>
);
const Flame = ({ x, y, s = 1, move = "flick" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g className={`mv ${move}`}>
      <path d="M0 0c-26 0-36-22-24-44 6-11 8-20 6-32 16 8 22 20 24 30 4-8 4-16 2-24 20 14 30 32 26 48C30-8 18 0 0 0z" fill={FLAME} />
      <path d="M0 0c-13 0-18-12-12-24 4-8 8-12 10-22 10 10 16 18 16 30C14-6 8 0 0 0z" fill={SUN} />
    </g>
  </g>
);
const Logs = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} stroke={WOOD} strokeWidth="12" strokeLinecap="round">
    <path d="M-34 4L30-8" /><path d="M-30-8L34 4" stroke="#6f4630" />
  </g>
);
/** A simple person: a head and a body. `c` is the colour of what they wear. */
const Person = ({ x, y, s = 1, c = EARTH, move = "" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g className={`mv ${move}`}>
      <path d="M-20 0c0-30 8-44 20-44s20 14 20 44z" fill={c} />
      <circle cx="0" cy="-58" r="15" fill={SKIN} />
      <path d="M-15-60a15 15 0 0 1 30 0c-8-8-22-8-30 0z" fill={NIGHT} />
    </g>
  </g>
);
const Stars = () => [[40, 40], [110, 70], [170, 30], [250, 60], [320, 36], [290, 110], [70, 120]].map(([x, y], i) => (
  <circle key={i} cx={x} cy={y} r="3" fill="#fff" className="mv twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
));
const Ground = ({ c = GRASS, y = 236 }) => <path d={`M0 ${y}Q90 ${y - 18} 180 ${y - 6}T360 ${y - 10}V300H0z`} fill={c} />;
const Day = ({ children }) => (<><rect width="360" height="300" fill={SKY} /><circle cx="300" cy="56" r="30" fill={SUN} className="mv glow" /><path d="M0 210Q80 150 170 196T360 176V300H0z" fill={HILL} /><Ground />{children}</>);
const Dark = ({ children, c = NIGHT }) => (<><rect width="360" height="300" fill={c} /><Stars /><Ground c="#22264f" />{children}</>);
const Tree = ({ x, y, c = LEAF }) => (<g transform={`translate(${x} ${y})`}><rect x="-9" y="-70" width="18" height="74" rx="6" fill={WOOD} /><circle cx="0" cy="-96" r="40" fill={c} /><circle cx="-30" cy="-76" r="26" fill={c} /><circle cx="30" cy="-76" r="26" fill={c} /></g>);

/** The face used for the five senses. `on` rings one part in gold; `tongue` shows the tongue. */
function Face({ on, tongue, x = 130, y = 150 }) {
  const ring = (cx, cy, r) => <circle cx={cx} cy={cy} r={r} fill="none" stroke={SUN} strokeWidth="6" className="mv ringing" />;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="-78" cy="6" rx="14" ry="22" fill={SKIN} /><ellipse cx="78" cy="6" rx="14" ry="22" fill={SKIN} />
      <circle r="80" fill={SKIN} />
      <path d="M-80-8a80 80 0 0 1 160 0c-30-34-60-44-80-44s-50 10-80 44z" fill={NIGHT} />
      <g className="mv blink"><circle cx="-28" cy="-6" r="9" fill={NIGHT} /><circle cx="28" cy="-6" r="9" fill={NIGHT} /></g>
      <path d="M0 4c-6 12-8 18-2 20h8" fill="none" stroke="#8a5a3c" strokeWidth="5" strokeLinecap="round" />
      {tongue ? <><path d="M-24 40q24 22 48 0z" fill={NIGHT} /><path d="M-10 46q10 20 20 0z" fill="#ff7a8a" className="mv lick" /></>
        : <path d="M-24 42q24 18 48 0" fill="none" stroke={NIGHT} strokeWidth="6" strokeLinecap="round" />}
      {on === "eyes" && <>{ring(-28, -6, 20)}{ring(28, -6, 20)}</>}
      {on === "ears" && <>{ring(-80, 6, 24)}{ring(80, 6, 24)}</>}
      {on === "nose" && ring(2, 14, 20)}
      {on === "tongue" && ring(0, 50, 26)}
      {on === "skin" && <circle r="88" fill="none" stroke={SUN} strokeWidth="6" className="mv ringing" />}
    </g>
  );
}
const Waves = ({ x, y, c = "#fff" }) => [0, 1, 2].map((i) => (
  <path key={i} d={`M${x + i * 18} ${y}q-8-10 0-20t0-20`} fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" className="mv rise" style={{ animationDelay: `${i * 0.5}s` }} />
));

const ART = {
  // Fire
  night: () => (<Dark><circle cx="290" cy="60" r="22" fill="#e9e4ff" /><path d="M150 236a70 70 0 0 1 140 0z" fill="#0c0e33" /><Person x="196" y="236" move="shiver" c="#6d6f96" /><Person x="244" y="236" s={0.8} move="shiver" c="#55587f" /></Dark>),
  lightning: () => (<Dark c={DUSK}><ellipse cx="150" cy="50" rx="90" ry="30" fill="#55587f" /><ellipse cx="220" cy="62" rx="70" ry="26" fill="#6d6f96" /><path d="M176 70l-26 60h22l-18 56 52-76h-24l20-40z" fill={SUN} className="mv flash" /><Tree x="170" y="240" c="#7a6a4a" /><g className="mv appear"><Flame x="170" y="150" s={1.1} /></g></Dark>),
  light: () => (<Dark><circle cx="180" cy="210" r="130" fill={SUN} opacity="0.28" className="mv glow" /><circle cx="180" cy="210" r="76" fill={SUN} opacity="0.35" className="mv glow" /><Person x="84" y="240" c={EARTH} /><Person x="276" y="240" s={0.8} c="#d98c6a" /><Logs x="180" y="236" /><Flame x="180" y="232" /></Dark>),
  warm: () => (<Dark><circle cx="180" cy="214" r="110" fill={FLAME} opacity="0.3" className="mv glow" /><Waves x="120" y="170" c={FLAME} /><Waves x="214" y="170" c={FLAME} /><Person x="76" y="240" c={EARTH} move="sway" /><Person x="284" y="240" s={0.8} c="#d98c6a" move="sway" /><Logs x="180" y="236" /><Flame x="180" y="232" s={1.2} /></Dark>),
  cook: () => (<Dark><circle cx="180" cy="214" r="110" fill={SUN} opacity="0.25" className="mv glow" /><path d="M96 240v-92M264 240v-92" stroke={WOOD} strokeWidth="8" strokeLinecap="round" /><path d="M86 150h188" stroke={WOOD} strokeWidth="6" strokeLinecap="round" /><E x="180" y="146" s={64} move="turn">🐟</E><Waves x="162" y="110" /><Logs x="180" y="240" /><Flame x="180" y="236" s={0.9} /></Dark>),
  burns: () => (<Day><Logs x="110" y="232" /><g className="mv appear"><Flame x="110" y="226" /></g><E x="250" y="222" s={70}>🍂</E><g className="mv appear" style={{ animationDelay: "2.4s" }}><Flame x="252" y="212" s={0.7} /></g></Day>),
  noburn: () => (<Day><ellipse cx="96" cy="226" rx="52" ry="34" fill={STONE} /><ellipse cx="84" cy="216" rx="18" ry="8" fill="#b8bdd0" /><Logs x="252" y="236" /><Flame x="252" y="232" move="shrink" />{[0, 1, 2].map((i) => <E key={i} x={232 + i * 20} y={90} s={30} move="fall" delay={i * 0.35}>💧</E>)}</Day>),
  safe: () => (<Day><circle cx="120" cy="226" r="76" fill="none" stroke="#e5484d" strokeWidth="5" strokeDasharray="10 12" className="mv glow" /><Logs x="120" y="236" /><Flame x="120" y="232" /><g className="mv back"><Person x="260" y="244" c="#6f8fd6" /><Person x="306" y="244" s={0.72} c="#e58fb0" /></g></Day>),
  // The five senses
  face: () => (<><rect width="360" height="300" fill="#fff0bf" /><Face x={180} /></>),
  see: () => (<><rect width="360" height="300" fill="#fff0bf" /><Face on="eyes" /><E x="290" y="150" s={84} move="bob">🌻</E></>),
  hear: () => (<><rect width="360" height="300" fill="#ddf3e4" /><Face on="ears" /><E x="292" y="170" s={72} move="bob">🐦</E><E x="262" y="96" s={34} move="rise">🎵</E><E x="312" y="80" s={28} move="rise" delay={0.8}>🎶</E></>),
  smell: () => (<><rect width="360" height="300" fill="#ffe3dc" /><Face on="nose" /><E x="296" y="186" s={78}>🌸</E><Waves x="262" y="150" c="#ff9fb3" /></>),
  taste: () => (<><rect width="360" height="300" fill="#fff0bf" /><Face on="tongue" tongue /><E x="294" y="160" s={84} move="bob">🥭</E></>),
  touch: () => (<><rect width="360" height="300" fill="#eaf4ff" /><Face on="skin" x={112} /><path d="M236 250q60-24 124 0v50H236z" fill={WATER} /><E x="296" y="196" s={76} move="dip">✋</E>{[0, 1, 2].map((i) => <E key={i} x={270 + i * 26} y={90} s={24} move="fall" delay={i * 0.4}>💧</E>)}</>),
  five: () => (<><rect width="360" height="300" fill="#e9e4ff" /><Face x={180} y={120} />{["👁️", "👂", "👃", "👅", "✋"].map((p, i) => <E key={p} x={44 + i * 68} y={254} s={44} move="pop" delay={i * 0.9}>{p}</E>)}</>),
  // Animals
  many: () => (<Day><Tree x="60" y="236" /><E x="150" y="204" s={70} move="bob">🐘</E><E x="250" y="222" s={54} move="bob" delay={0.5}>🐄</E><E x="64" y="116" s={38} move="bob" delay={0.9}>🐒</E><E x="316" y="238" s={44} move="bob" delay={0.3}>🦚</E><E x="210" y="90" s={30} move="fly">🐦</E></Day>),
  elephant: () => (<Day><Tree x="320" y="240" /><E x="170" y="176" s={170} move="walk">🐘</E></Day>),
  cow: () => (<Day>{[40, 110, 300].map((x) => <E key={x} x={x} y={262} s={34}>🌱</E>)}<E x="180" y="190" s={150} move="graze">🐄</E></Day>),
  peacock: () => (<Day><Tree x="50" y="240" /><E x="190" y="184" s={160} move="proud">🦚</E></Day>),
  fish: () => (<><rect width="360" height="300" fill={WATER} /><path d="M0 40q45-20 90 0t90 0 90 0 90 0V0H0z" fill={SKY} className="mv sway" />{[[60, 230], [300, 250], [250, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="8" fill="#fff" opacity="0.6" className="mv rise" style={{ animationDelay: `${i * 0.7}s` }} />)}<E x="40" y="270" s={50}>🌿</E><E x="180" y="160" s={140} move="swim">🐟</E></>),
  monkey: () => (<Day><rect x="238" y="60" width="24" height="190" rx="8" fill={WOOD} /><circle cx="250" cy="70" r="62" fill={LEAF} /><circle cx="196" cy="96" r="40" fill={LEAF} /><circle cx="304" cy="96" r="40" fill={LEAF} /><E x="200" y="200" s={96} move="climb">🐒</E></Day>),
  each: () => (<Day>{["🐘", "🐄", "🦚", "🐟", "🐒"].map((p, i) => <E key={p} x={44 + i * 68} y={i % 2 ? 150 : 206} s={56} move="pop" delay={i * 0.9}>{p}</E>)}</Day>),
};

export const ART_IDS = Object.keys(ART);

/** One drawing, by its name. `still` holds every move (used while the lesson is paused). */
export default function LessonArt({ art, still = false }) {
  const Draw = ART[art];
  return (
    <svg aria-hidden="true" viewBox="0 0 360 300" className={`art${still ? " still" : ""}`}>
      {Draw ? <Draw /> : <rect width="360" height="300" fill={SKY} />}
    </svg>
  );
}

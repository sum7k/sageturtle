// The drawings of the lessons (lib/lessons.js). Each is a small SVG that the phone draws and moves by itself
// (the moves are CSS, in app/globals.css under "lessons"). There is no video file and no animation library.
// No drawing holds a written word, so one drawing serves every language. Animals and fruit are the phone's own
// emoji, as elsewhere in the app; fire, people, land and sky are drawn here.

import { ZERO_ART } from "./art/zero";

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

/** A child, whole. `on` rings one part in gold; `move` moves that part. */
function Kid({ x = 180, y = 250, s = 1, c = "#6f8fd6", on, wave, hop }) {
  const ring = (cx, cy, r) => <circle cx={cx} cy={cy} r={r} fill="none" stroke={SUN} strokeWidth="6" className="mv ringing" />;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className={`mv ${hop ? "hop" : ""}`}>
        <path d="M-16-70v64M16-70v64" stroke={SKIN} strokeWidth="16" strokeLinecap="round" />
        <path d="M-26-8h18M8-8h18" stroke={NIGHT} strokeWidth="12" strokeLinecap="round" />
        <g className={`mv ${wave ? "wave" : ""}`}><path d="M-30-132l-28 44M30-132l28-44" stroke={SKIN} strokeWidth="14" strokeLinecap="round" /></g>
        <rect x="-32" y="-144" width="64" height="84" rx="20" fill={c} />
        <circle cx="0" cy="-176" r="32" fill={SKIN} />
        <path d="M-32-180a32 32 0 0 1 64 0c-16-14-48-14-64 0z" fill={NIGHT} />
        <circle cx="-11" cy="-174" r="4" fill={NIGHT} /><circle cx="11" cy="-174" r="4" fill={NIGHT} />
        <path d="M-10-162q10 8 20 0" fill="none" stroke={NIGHT} strokeWidth="3" strokeLinecap="round" />
        {on === "head" && ring(0, -178, 44)}
        {on === "hands" && <>{ring(-58, -88, 18)}{ring(58, -176, 18)}</>}
        {on === "legs" && <>{ring(-16, -30, 30)}{ring(16, -30, 30)}</>}
      </g>
    </g>
  );
}
const Room = ({ c = "#fff0bf", children }) => (<><rect width="360" height="300" fill={c} /><path d="M0 250h360v50H0z" fill="#ffe3dc" />{children}</>);
const Soil = ({ children }) => (<><rect width="360" height="300" fill={SKY} /><circle cx="300" cy="50" r="28" fill={SUN} className="mv glow" /><path d="M0 190h360v110H0z" fill={EARTH} /><path d="M0 190q90-14 180 0t180 0v14H0z" fill={GRASS} />{children}</>);
const Roots = ({ x, y }) => <path d={`M${x} ${y}v40M${x} ${y + 8}l-26 30M${x} ${y + 8}l26 30M${x - 12} ${y + 24}l-14 6M${x + 12} ${y + 24}l14 6`} fill="none" stroke={WOOD} strokeWidth="5" strokeLinecap="round" />;
const Drops = ({ x, y = 90, n = 3 }) => Array.from({ length: n }, (_, i) => <E key={i} x={x + i * 24} y={y} s={26} move="fall" delay={i * 0.35}>💧</E>);
const No = ({ x, y, r }) => (<g className="mv glow"><circle cx={x} cy={y} r={r} fill="none" stroke="#e5484d" strokeWidth="7" /><path d={`M${x - r * 0.7} ${y - r * 0.7}L${x + r * 0.7} ${y + r * 0.7}`} stroke="#e5484d" strokeWidth="7" /></g>);

Object.assign(ART, {
  // The teller says who they are: a person, and one thing of their work beside them.
  teller: ({ prop }) => (<Room c="#fff0bf"><circle cx="180" cy="150" r="120" fill="#fff" opacity="0.6" className="mv glow" /><Person x="150" y="252" s={2} c="#8a6fb0" move="sway" /><E x="268" y="150" s={64} move="bob">{prop}</E></Room>),
  // My body
  body: () => (<Room><Kid hop /></Room>),
  head: () => (<Room c="#ddf3e4"><Kid on="head" /></Room>),
  hands: () => (<Room c="#e9e4ff"><Kid on="hands" wave /><E x="296" y="120" s={50} move="bob">🏺</E></Room>),
  legs: () => (<Room c="#eaf4ff"><Kid on="legs" hop /></Room>),
  wash: () => (<Room c="#eaf4ff"><Kid x={150} /><Drops x={110} y={40} n={4} /><path d="M236 262q60-20 124 0v38H236z" fill={WATER} /><E x="296" y="216" s={56} move="dip">🙌</E></Room>),
  bodies: () => (<Room><Kid x={70} s={0.72} c="#e58fb0" /><Kid x={180} c="#6f8fd6" wave /><Kid x={290} s={0.86} c="#7fb894" /></Room>),
  // Birds
  wings: () => (<Day><Tree x="60" y="240" /><E x="180" y="110" s={90} move="flap">🐦</E><E x="290" y="150" s={40} move="fly">🐦</E></Day>),
  parrot: () => (<Day><Tree x="300" y="244" /><path d="M0 150h210" stroke={WOOD} strokeWidth="12" strokeLinecap="round" /><E x="130" y="96" s={130} move="proud">🦜</E></Day>),
  rooster: () => (<Day><E x="180" y="184" s={150} move="crow">🐓</E><E x="270" y="96" s={30} move="rise">🎵</E></Day>),
  owl: () => (<Dark><circle cx="290" cy="60" r="22" fill="#e9e4ff" /><Tree x="110" y="244" c="#2f5a45" /><path d="M110 150h160" stroke="#6f4630" strokeWidth="12" strokeLinecap="round" /><E x="220" y="100" s={110} move="bob">🦉</E></Dark>),
  duck: () => (<><rect width="360" height="300" fill={SKY} /><circle cx="300" cy="50" r="28" fill={SUN} className="mv glow" /><path d="M0 190q45-14 90 0t90 0 90 0 90 0v110H0z" fill={WATER} className="mv sway" /><E x="180" y="150" s={130} move="swim">🦆</E></>),
  nest: () => (<Day><Tree x="320" y="244" /><path d="M96 200a84 50 0 0 0 168 0z" fill={WOOD} /><path d="M100 200h160" stroke="#6f4630" strokeWidth="8" strokeLinecap="round" />{[140, 180, 220].map((x, i) => <ellipse key={x} cx={x} cy={186} rx="18" ry="24" fill="#fff" className="mv pop" style={{ animationDelay: `${i * 0.6}s` }} />)}<g className="mv appear" style={{ animationDelay: "5s" }}><E x="180" y="150" s={54}>🐣</E></g></Day>),
  // Plants
  seed: () => (<Soil><ellipse cx="180" cy="236" rx="14" ry="10" fill={WOOD} className="mv glow" /></Soil>),
  sprout: () => (<Soil><ellipse cx="180" cy="236" rx="14" ry="10" fill={WOOD} /><Drops x={156} y={70} /><g className="mv grow"><E x="180" y="166" s={70}>🌱</E></g></Soil>),
  tree: () => (<Soil><Roots x={180} y={196} /><g className="mv grow"><Tree x="180" y="200" /></g></Soil>),
  flower: () => (<Soil><Tree x="180" y="200" />{[[150, 96], [206, 88], [180, 130]].map(([x, y], i) => <E key={i} x={x} y={y} s={30} move="pop" delay={i * 0.6}>🌸</E>)}{[[136, 128], [226, 122]].map(([x, y], i) => <E key={i} x={x} y={y} s={30} move="pop" delay={3.4 + i * 0.6}>🥭</E>)}</Soil>),
  shade: () => (<Day><ellipse cx="180" cy="250" rx="120" ry="16" fill={LEAF} opacity="0.5" /><g transform="translate(180 244) scale(1.5)"><Tree x={0} y={0} /></g><E x="150" y="96" s={34} move="bob">🐦</E><E x="220" y="130" s={28} move="bob" delay={0.6}>🥭</E><Person x="110" y="258" s={0.8} c="#6f8fd6" /><Person x="246" y="258" s={0.62} c="#e58fb0" /></Day>),
  // What we eat
  fruit: () => (<Day><Tree x="64" y="240" />{["🥭", "🍌", "🍇"].map((p, i) => <E key={p} x={140 + i * 80} y={170} s={76} move="pop" delay={i * 1.4}>{p}</E>)}</Day>),
  roots: () => (<Soil><E x="120" y="216" s={84} move="pull">🥕</E><E x="244" y="236" s={76} move="pull" delay={1.6}>🍠</E></Soil>),
  nuts: () => (<Day><E x="90" y="200" s={76} move="pop">🥜</E><E x="190" y="196" s={84} move="pop" delay={2.2}>🍯</E><E x="280" y="110" s={44} move="fly">🐝</E></Day>),
  noteat: () => (<Day><E x="180" y="196" s={120}>🍄</E><No x={180} y={190} r={84} /></Day>),
  askfirst: () => (<Day><Person x="130" y="252" s={1.25} c="#6f8fd6" /><Person x="230" y="252" s={0.9} c="#e58fb0" move="sway" /><E x="290" y="150" s={54} move="bob">🍄</E><E x="296" y="80" s={44} move="pop" delay={1.2}>❓</E></Day>),
  drink: () => (<Day><path d="M0 220q45-14 90 0t90 0 90 0 90 0v80H0z" fill={WATER} className="mv sway" /><Kid x={110} y={236} s={0.8} /><E x="230" y="150" s={84} move="bob">💧</E></Day>),
});

// Stage 1 Nature, houses 8 to 12: water, weather, small creatures, mothers and young, caring.
const Cloud = ({ x, y, s = 1, c = "#fff", move = "" }) => (<g transform={`translate(${x} ${y}) scale(${s})`}><g className={`mv ${move}`}><ellipse cx="0" cy="0" rx="56" ry="24" fill={c} /><circle cx="-22" cy="-14" r="24" fill={c} /><circle cx="16" cy="-20" r="30" fill={c} /></g></g>);
const Rain = ({ x0 = 40, x1 = 320, y = 70, n = 10 }) => Array.from({ length: n }, (_, i) => (
  <path key={i} d={`M${x0 + (i * (x1 - x0)) / (n - 1)} ${y + (i % 3) * 14}l-6 18`} stroke={WATER} strokeWidth="4" strokeLinecap="round" className="mv fall" style={{ animationDelay: `${(i % 4) * 0.3}s` }} />
));
const River = ({ y = 230 }) => (<path d={`M0 ${y}q60-24 120 0t120 0 120 0v${300 - y}H0z`} fill={WATER} className="mv sway" />);
const Grass = ({ y = 236 }) => [30, 90, 270, 330].map((x) => <path key={x} d={`M${x} ${y}l-6-18M${x} ${y}l0-22M${x} ${y}l6-18`} stroke={LEAF} strokeWidth="4" strokeLinecap="round" className="mv sway" />);
const Bowl = ({ x, y }) => (<g><path d={`M${x - 40} ${y}a40 22 0 0 0 80 0z`} fill="#c97b4a" /><ellipse cx={x} cy={y} rx="40" ry="7" fill={WATER} /></g>);
const Web = ({ x, y }) => (<g stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.9">{[0, 45, 90, 135].map((a) => <path key={a} d={`M${x} ${y - 90}v180`} transform={`rotate(${a} ${x} ${y})`} />)}{[30, 55, 80].map((r) => <circle key={r} cx={x} cy={y} r={r} className="mv grow" />)}</g>);

Object.assign(ART, {
  // Water
  rain: () => (<><rect width="360" height="300" fill="#b9cbe0" /><Cloud x={110} y={60} c="#8d99b3" move="sway" /><Cloud x={250} y={50} s={1.2} c="#7c88a3" /><Rain /><Ground /><Grass /></>),
  river: () => (<Day><path d="M0 180Q80 120 170 166T360 146V300H0z" fill={HILL} /><River y={214} /><E x="80" y="200" s={36}>🪨</E><E x="290" y="176" s={40}>🌾</E><E x="180" y="250" s={44} move="swim">🐟</E></Day>),
  well: () => (<Day><ellipse cx="180" cy="208" rx="74" ry="18" fill="#6f4630" /><path d="M106 208v40a74 18 0 0 0 148 0v-40" fill={STONE} /><path d="M120 208v-100M240 208v-100M110 108h140" stroke={WOOD} strokeWidth="9" strokeLinecap="round" /><path d="M180 108v40" stroke="#6f4630" strokeWidth="3" /><g className="mv bob"><path d="M164 148h32l-4 30h-24z" fill="#c97b4a" /></g></Day>),
  thirsty: () => (<Day><Tree x="56" y="236" /><Drops x={40} y={70} n={2} /><E x="170" y="200" s={80} move="graze">🐄</E><Bowl x={270} y={238} /><E x="270" y="200" s={46} move="dip">🐦</E><Kid x={330} y={262} s={0.5} /></Day>),
  save: () => (<Room c="#eaf4ff"><path d="M150 40h60v26h-18v20h-24v-20h-18z" fill={STONE} /><path d="M180 86v80" stroke={WATER} strokeWidth="10" strokeLinecap="round" className="mv shrink" /><path d="M140 250v-64h80v64z" fill="#c97b4a" /><ellipse cx="180" cy="186" rx="40" ry="8" fill={WATER} className="mv glow" /><Kid x={290} y={262} s={0.7} wave /></Room>),
  // Weather
  hot: () => (<><rect width="360" height="300" fill="#ffe7a8" /><circle cx="180" cy="80" r="50" fill={SUN} className="mv glow" />{Array.from({ length: 8 }, (_, i) => <path key={i} d="M180 14v-12" stroke={SUN} strokeWidth="8" strokeLinecap="round" transform={`rotate(${i * 45} 180 80)`} />)}<Ground c="#d9c27a" /><g transform="translate(250 246) scale(1.1)"><Tree x={0} y={0} /></g><Person x="240" y="252" s={0.8} c="#6f8fd6" /><E x="300" y="230" s={36}>🫙</E><Waves x="70" y="200" c="#ff8a3d" /></>),
  rainy: () => (<><rect width="360" height="300" fill="#8d99b3" /><Cloud x={100} y={56} c="#4f5a78" move="sway" /><Cloud x={250} y={48} s={1.2} c="#454f6b" /><Rain n={12} /><Ground c="#5fae7a" /><E x="120" y="246" s={54} move="hop">🐸</E><E x="250" y="250" s={40}>🌱</E></>),
  windy: () => (<Day>{[0, 1, 2].map((i) => <path key={i} d={`M20 ${90 + i * 36}q60-20 120 0t120 0`} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" className="mv fly" style={{ animationDelay: `${i * 0.8}s` }} />)}<g className="mv sway"><Tree x="270" y="236" /></g>{[0, 1, 2].map((i) => <E key={i} x={100 + i * 50} y={150 + i * 20} s={28} move="fly" delay={i * 0.6}>🍃</E>)}</Day>),
  cold: () => (<><rect width="360" height="300" fill="#dfe6ef" /><circle cx="290" cy="60" r="26" fill="#fff3c4" opacity="0.8" /><Ground c="#b9c9b8" />{[60, 130, 200, 270].map((y, i) => <rect key={y} x="0" y={y - 60} width="360" height="22" fill="#fff" opacity="0.35" className="mv sway" style={{ animationDelay: `${i * 0.5}s` }} />)}<Kid x={180} c="#c94f4f" /><E x="180" y="122" s={36}>🧣</E></>),
  rainbow: () => (<Day>{["#e5484d", "#ff8a3d", "#ffc531", "#5fae7a", "#4f8ed6", "#3d4ab0", "#8a5fb8"].map((c, i) => <path key={c} d={`M${40 + i * 10} 220a${140 - i * 10} ${140 - i * 10} 0 0 1 ${280 - i * 20} 0`} fill="none" stroke={c} strokeWidth="10" className="mv appear" style={{ animationDelay: `${i * 0.3}s` }} />)}<Cloud x={70} y={70} s={0.7} /><Rain x0={200} x1={330} n={6} /></Day>),
  // Small creatures
  ants: () => (<Soil>{Array.from({ length: 6 }, (_, i) => <E key={i} x={40 + i * 50} y={236 - (i % 2) * 6} s={34} move="walk" delay={i * 0.2}>🐜</E>)}<E x="330" y="214" s={36}>🍞</E></Soil>),
  bee: () => (<Day>{[[90, 200], [180, 220], [270, 196]].map(([x, y], i) => <E key={x} x={x} y={y} s={54}>{["🌼", "🌸", "🌻"][i]}</E>)}<E x="180" y="140" s={58} move="fly">🐝</E><E x="300" y="90" s={44}>🍯</E></Day>),
  change: () => (<Day><path d="M30 170q80-30 160 0" stroke={LEAF} strokeWidth="10" fill="none" strokeLinecap="round" /><E x="80" y="168" s={44} move="walk">🐛</E><ellipse cx="190" cy="186" rx="14" ry="26" fill="#9ab07a" className="mv glow" /><g className="mv appear" style={{ animationDelay: "2.5s" }}><E x="280" y="120" s={80} move="flap">🦋</E></g></Day>),
  spider: () => (<><rect width="360" height="300" fill="#2b2f5e" /><Stars /><Web x={180} y={140} /><E x="200" y="120" s={44} move="bob">🕷️</E><Ground c="#22264f" /></>),
  worm: () => (<Soil>{[[60, 250], [140, 270], [250, 260], [310, 236]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill="#a37f5a" />)}<path d="M120 240q20-16 40 0t40 0 40 0" fill="none" stroke="#d98c8c" strokeWidth="14" strokeLinecap="round" className="mv walk" /><E x="300" y="170" s={40}>🌱</E></Soil>),
  // Mothers and young
  hen: () => (<Day><E x="120" y="196" s={110} move="graze">🐔</E>{[0, 1, 2].map((i) => <E key={i} x={210 + i * 46} y={232} s={40} move="walk" delay={i * 0.3}>🐤</E>)}</Day>),
  calf: () => (<Day><E x="130" y="184" s={130}>🐄</E><g transform="translate(250 220) scale(-1 1)"><E x={0} y={0} s={70} move="graze">🐄</E></g></Day>),
  carry: () => (<Day><rect x="238" y="60" width="24" height="190" rx="8" fill={WOOD} /><circle cx="250" cy="70" r="62" fill={LEAF} /><g className="mv climb"><E x="200" y="190" s={96}>🐒</E><E x="230" y="214" s={44}>🐒</E></g></Day>),
  herd: () => (<Day><E x="80" y="196" s={90} move="walk">🐘</E><E x="180" y="214" s={54} move="walk" delay={0.3}>🐘</E><E x="280" y="196" s={90} move="walk" delay={0.6}>🐘</E></Day>),
  grow: () => (<Day><E x="70" y="226" s={36} move="pop">🐣</E><E x="160" y="212" s={56} move="pop" delay={1}>🐥</E><E x="270" y="190" s={96} move="pop" delay={2}>🐓</E></Day>),
  // Caring
  plant: () => (<Soil><Kid x={110} y={232} s={0.8} /><g className="mv grow"><E x="230" y="164" s={66}>🌱</E></g><Drops x={210} y={70} /></Soil>),
  birdwater: () => (<><rect width="360" height="300" fill="#ffe7a8" /><circle cx="300" cy="56" r="34" fill={SUN} className="mv glow" /><Ground c="#d9c27a" /><Bowl x={180} y={230} /><E x="150" y="196" s={50} move="dip">🐦</E><E x="214" y="190" s={44} move="dip" delay={0.6}>🐦</E></>),
  gentle: () => (<Day><Kid x={130} y={258} s={0.85} /><E x="230" y="216" s={84} move="bob">🐕</E><E x="190" y="110" s={40} move="pop">❤️</E></Day>),
  nobreak: () => (<Day><g transform="translate(200 244) scale(1.3)"><Tree x={0} y={0} /></g>{[[170, 110], [230, 120], [200, 80]].map(([x, y], i) => <E key={i} x={x} y={y} s={28}>🌸</E>)}<Kid x={80} y={262} s={0.7} /><E x="150" y="190" s={40} move="pop" delay={1}>✋</E></Day>),
  together: () => (<Day><Tree x="60" y="236" /><Kid x={150} y={262} s={0.6} c="#e58fb0" /><Person x="200" y="256" s={0.9} c="#6f8fd6" /><E x="270" y="216" s={56} move="bob">🐄</E><E x="56" y="110" s={36} move="bob">🐦</E><E x="320" y="240" s={40} move="walk">🐕</E><E x="200" y="90" s={40} move="fly">🦋</E></Day>),
});

// Stage 1, one lesson in each other subject: number, earth, people, rule, hand, body, music, art.
const Mango = ({ x, y, s = 60, delay }) => <E x={x} y={y} s={s} move="pop" delay={delay}>🥭</E>;
const Fingers = ({ n, x = 270, y = 230 }) => (<g transform={`translate(${x} ${y})`}><rect x="-34" y="-30" width="68" height="60" rx="22" fill={SKIN} />{Array.from({ length: n }, (_, i) => <rect key={i} x={-28 + i * 20} y="-84" width="16" height="60" rx="8" fill={SKIN} className="mv pop" style={{ animationDelay: `${i * 0.6}s` }} />)}</g>);
const Rock = ({ c = "#b07a52", children }) => (<><rect width="360" height="300" fill={c} /><path d="M0 0h360v40q-90 20-180 0T0 30z" fill="#8a5a3c" /><path d="M0 300v-30q90-14 180 0t180-6v36z" fill="#8a5a3c" />{children}</>);
const OCHRE = "#b5402c";
const Deer = ({ x, y, s = 1, c = OCHRE }) => (<g transform={`translate(${x} ${y}) scale(${s})`} stroke={c} strokeWidth="6" strokeLinecap="round" fill="none"><path d="M-40 0h70M-34 0l-8 34M-22 0l6 34M18 0l-6 34M28 0l8 34M30 0l14-24M44-24l12-4M44-24l-4-16M48-30l6-12" /><path d="M-40 0q-10-8-14 4" /></g>);
const Ball = ({ x, y, move = "", delay }) => <circle cx={x} cy={y} r="14" fill="#e5484d" className={`mv ${move}`} style={delay ? { animationDelay: `${delay}s` } : undefined} />;

Object.assign(ART, {
  // Number
  one: () => (<Room c="#ddf3e4"><Mango x={110} y={150} s={90} /><Fingers n={1} /></Room>),
  two: () => (<Room c="#ddf3e4"><Mango x={80} y={150} s={70} /><Mango x={160} y={150} s={70} delay={0.6} /><Fingers n={2} /></Room>),
  three: () => (<Room c="#ddf3e4">{[60, 120, 180].map((x, i) => <Mango key={x} x={x} y={150} s={58} delay={i * 0.6} />)}<Fingers n={3} /></Room>),
  tally: () => (<Room c="#fff0bf"><path d="M50 150q130-40 260 0q-130 50-260 0z" fill="#f4ead2" stroke="#c9b48a" strokeWidth="4" />{Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${100 + i * 24} 128v40`} stroke="#6f4630" strokeWidth="5" strokeLinecap="round" className="mv appear" style={{ animationDelay: `${i * 0.5}s` }} />)}</Room>),
  more: () => (<Day><path d="M180 120v150" stroke="#fff" strokeWidth="4" strokeDasharray="8 8" />{[0, 1].map((i) => <E key={i} x={70 + i * 50} y={200} s={44} move="bob" delay={i * 0.3}>🐦</E>)}{[0, 1, 2, 3].map((i) => <E key={i} x={220 + (i % 2) * 60} y={170 + Math.floor(i / 2) * 50} s={44} move="bob" delay={i * 0.3}>🐦</E>)}</Day>),
  // Earth
  sunrise: () => (<><rect width="360" height="300" fill="#ffd9b8" /><circle cx="60" cy="210" r="40" fill={SUN} className="mv rise" /><Ground c={GRASS} /><path d="M40 270l-20-20M40 270l-20 20M40 270h80" stroke={NIGHT} strokeWidth="6" strokeLinecap="round" /></>),
  noon: () => (<><rect width="360" height="300" fill={SKY} /><circle cx="180" cy="50" r="34" fill={SUN} className="mv glow" /><Ground /><Tree x="180" y="240" /><ellipse cx="180" cy="244" rx="40" ry="8" fill={LEAF} opacity="0.5" /></>),
  sunset: () => (<><rect width="360" height="300" fill="#f2a27a" /><circle cx="300" cy="214" r="40" fill={FLAME} className="mv back" /><Ground c="#5a7f60" /><path d="M320 270l20-20M320 270l20 20M320 270h-80" stroke={NIGHT} strokeWidth="6" strokeLinecap="round" /></>),
  moon: () => (<Dark><circle cx="250" cy="70" r="28" fill="#fff3c4" /><circle cx="262" cy="62" r="24" fill={NIGHT} /><path d="M90 240a60 40 0 0 1 120 0z" fill="#0c0e33" /><E x="150" y="226" s={34}>💤</E></Dark>),
  near: () => (<Day><Tree x="90" y="250" /><g transform="translate(290 196) scale(0.35)"><Tree x={0} y={0} /></g><E x="196" y="120" s={40} move="pop">👀</E></Day>),
  turns: () => (<><rect width="360" height="300" fill={NIGHT} /><Stars /><circle cx="60" cy="150" r="34" fill={SUN} className="mv glow" /><g transform="translate(230 150)"><g className="mv spin"><circle r="70" fill="#4f8ed6" /><path d="M-40-30q30-20 50 10t-20 50q-30 0-30-60z" fill={GRASS} /><path d="M20-56q30 10 30 40t-30 0z" fill={GRASS} /></g><path d="M0-70a70 70 0 0 1 0 140z" fill={NIGHT} opacity="0.55" /></g></>),
  // People
  footprints: () => (<><rect width="360" height="300" fill="#a89a88" />{Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={60 + i * 50} cy={i % 2 ? 130 : 170} rx="14" ry="24" fill="#6e6152" transform={`rotate(70 ${60 + i * 50} ${i % 2 ? 130 : 170})`} className="mv appear" style={{ animationDelay: `${i * 0.5}s` }} />)}</>),
  band: () => (<Day><Logs x="180" y="240" /><Flame x="180" y="236" s={0.7} />{[[90, 1], [140, 0.7], [230, 0.9], [280, 0.6]].map(([x, s], i) => <Person key={x} x={x} y={250} s={s} c={["#8a6fb0", "#e58fb0", "#6f8fd6", "#7fb894"][i]} />)}</Day>),
  walk: () => (<Day><g className="mv walk">{[[120, 1], [170, 0.7], [220, 0.9]].map(([x, s], i) => <Person key={x} x={x} y={252} s={s} c={["#8a6fb0", "#e58fb0", "#6f8fd6"][i]} />)}</g></Day>),
  spread: () => (<><rect width="360" height="300" fill="#bfe3f5" /><path d="M60 80q40-30 80 0t40 60-40 50-60 0-20-110z" fill={GRASS} /><path d="M170 60q60-20 120 10t20 60-60 30-80-20 0-80z" fill={GRASS} /><path d="M220 170q30 0 30 40t-30 30-10-70z" fill={GRASS} /><path d="M120 150q-30 20 10 60" stroke={FLAME} strokeWidth="4" fill="none" strokeDasharray="6 6" />{[[120, 170], [180, 100], [240, 200], [270, 110], [90, 90]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill={FLAME} className="mv pop" style={{ animationDelay: `${i * 0.7}s` }} />)}</>),
  family: () => (<Day>{[50, 105, 160, 215, 270, 320].map((x, i) => <Person key={x} x={x} y={250} s={0.6 + (i % 3) * 0.15} c={["#8a6fb0", "#e58fb0", "#6f8fd6", "#7fb894", "#c94f4f", "#d9a441"][i]} move="sway" />)}</Day>),
  // Rule
  group: () => (<Day>{[[110, 1], [180, 0.7], [250, 0.9]].map(([x, s], i) => <Person key={x} x={x} y={252} s={s} c={["#8a6fb0", "#e58fb0", "#6f8fd6"][i]} move="sway" />)}<E x="180" y="110" s={44} move="pop">❤️</E></Day>),
  sharefood: () => (<Day>{[[80, 1], [280, 0.8]].map(([x, s], i) => <Person key={x} x={x} y={252} s={s} c={["#8a6fb0", "#e58fb0"][i]} />)}<path d="M140 232h80" stroke={WOOD} strokeWidth="8" strokeLinecap="round" />{[0, 1, 2, 3].map((i) => <E key={i} x={150 + i * 20} y={216} s={26} move="pop" delay={i * 0.4}>🍌</E>)}</Day>),
  turn: () => (<Day><path d="M60 240q60-120 120-120h40" stroke={WOOD} strokeWidth="10" fill="none" strokeLinecap="round" /><Kid x={110} y={262} s={0.6} c="#e58fb0" hop /><Kid x={200} y={262} s={0.6} c="#6f8fd6" /><Kid x={260} y={262} s={0.6} c="#7fb894" /></Day>),
  help: () => (<Day><Kid x={140} y={262} s={0.8} wave /><g transform="rotate(-20 230 250)"><Kid x={230} y={262} s={0.6} c="#e58fb0" /></g></Day>),
  sorry: () => (<Room c="#ffe3dc"><Kid x={120} s={0.85} c="#6f8fd6" /><Kid x={240} s={0.85} c="#7fb894" wave /><E x="180" y="90" s={44} move="pop">🤝</E></Room>),
  // Hand
  knap: () => (<Soil><ellipse cx="180" cy="186" rx="44" ry="26" fill={STONE} /><g className="mv dip"><ellipse cx="180" cy="110" rx="26" ry="20" fill="#7d8296" /></g>{[0, 1, 2].map((i) => <circle key={i} cx={150 + i * 30} cy={168} r="4" fill="#fff" className="mv rise" style={{ animationDelay: `${i * 0.3}s` }} />)}</Soil>),
  cut: () => (<Day><path d="M90 200l60-20 10 20-60 20z" fill={STONE} className="mv sway" /><E x="240" y="200" s={80}>🍉</E></Day>),
  rope: () => (<Room c="#fff0bf">{[0, 1, 2].map((i) => <path key={i} d={`M40 ${130 + i * 6}q35-20 70 0t70 0 70 0 70 0`} stroke={["#c9a27a", "#a37f5a", "#8a6a48"][i]} strokeWidth="8" fill="none" strokeLinecap="round" className="mv sway" style={{ animationDelay: `${i * 0.2}s` }} />)}<E x="180" y="220" s={50}>🌾</E></Room>),
  knot: () => (<Room c="#fff0bf"><path d="M40 160h100q40 0 40-36t-30-20q-24 16 10 56h160" stroke="#a37f5a" strokeWidth="12" fill="none" strokeLinecap="round" /><E x="300" y="110" s={46} move="pop">🙌</E></Room>),
  careful: () => (<Day><Person x="120" y="252" s={1.2} c="#6f8fd6" /><Kid x={220} y={262} s={0.6} c="#e58fb0" /><path d="M150 180l30-10 6 12-30 10z" fill={STONE} /></Day>),
  // Body
  walking: () => (<Day><g className="mv walk"><Kid x={180} s={0.9} /></g></Day>),
  running: () => (<Day><g className="mv fly"><Kid x={180} s={0.9} wave /></g></Day>),
  jumping: () => (<Day><Kid x={180} s={0.9} hop wave /></Day>),
  throwing: () => (<Day><Kid x={100} s={0.8} wave /><Ball x={200} y={110} move="fly" /></Day>),
  squat: () => (<Room c="#ddf3e4"><g className="mv dip"><Kid x={180} s={0.9} /></g></Room>),
  // Music
  clap: () => (<Room c="#e9e4ff"><Kid x={140} s={0.9} /><E x="260" y="140" s={70} move="pop">👏</E>{[0, 1, 2, 3].map((i) => <circle key={i} cx={60 + i * 80} cy={40} r="10" fill={SUN} className="mv pop" style={{ animationDelay: `${i * 0.5}s` }} />)}</Room>),
  call: () => (<Room c="#e9e4ff"><Person x="100" y="250" s={1.1} c="#8a6fb0" /><Kid x={260} s={0.75} c="#7fb894" /><E x="150" y="110" s={36} move="rise">🎵</E><E x="210" y="110" s={36} move="rise" delay={1.2}>🎶</E></Room>),
  circle: () => (<Dark><Logs x="180" y="210" /><Flame x="180" y="206" s={0.7} /><g transform="translate(180 210)"><g className="mv spin">{Array.from({ length: 6 }, (_, i) => <g key={i} transform={`rotate(${i * 60}) translate(0 -70) rotate(${-i * 60})`}><circle r="12" fill={SKIN} /><rect x="-10" y="8" width="20" height="24" rx="8" fill={["#8a6fb0", "#e58fb0", "#6f8fd6", "#7fb894", "#c94f4f", "#d9a441"][i]} /></g>)}</g></g></Dark>),
  flute: () => (<Room c="#fff0bf"><rect x="70" y="140" width="220" height="24" rx="12" fill="#f4ead2" stroke="#c9b48a" strokeWidth="3" />{[130, 170, 210, 250].map((x) => <circle key={x} cx={x} cy={152} r="6" fill="#6f4630" />)}<E x="300" y="100" s={34} move="rise">🎵</E></Room>),
  leaf: () => (<Day><E x="160" y="170" s={110}>🍃</E><E x="160" y="210" s={60}>👍</E><E x="250" y="110" s={34} move="rise">🎵</E></Day>),
  // Art
  rocks: () => (<><rect width="360" height="300" fill={SKY} /><path d="M0 300V140q40-60 100-40t60-50 90 20 110 10v220z" fill="#b07a52" /><path d="M120 300v-90a40 40 0 0 1 80 0v90z" fill="#5a3d28" /><Tree x="320" y="300" /></>),
  palms: () => (<Rock>{[[100, 130], [200, 160], [270, 110]].map(([x, y], i) => <E key={i} x={x} y={y} s={70} move="pop" delay={i * 0.8}>🖐🏾</E>)}</Rock>),
  lines: () => (<Rock><path d="M50 120h120" stroke={OCHRE} strokeWidth="7" strokeLinecap="round" className="mv appear" /><path d="M190 120q20-20 40 0t40 0 40 0" stroke={OCHRE} strokeWidth="7" fill="none" strokeLinecap="round" className="mv appear" style={{ animationDelay: "1s" }} />{Array.from({ length: 8 }, (_, i) => <circle key={i} cx={70 + i * 30} cy={200} r="6" fill={OCHRE} className="mv pop" style={{ animationDelay: `${1.6 + i * 0.2}s` }} />)}</Rock>),
  animal: () => (<Rock><g className="mv appear"><Deer x={170} y={150} s={1.6} /></g></Rock>),
  yours: () => (<Room c="#fff"><rect x="40" y="40" width="280" height="190" rx="12" fill="#fffaf0" stroke="#e0d6c0" strokeWidth="3" /><g className="mv appear"><Deer x={170} y={130} s={1.3} c="#4f5a78" /></g><E x="300" y="240" s={50} move="sway">✏️</E></Room>),
});

// Chapters for older learners keep their drawings in their own files (components/art).
Object.assign(ART, ZERO_ART);

export const ART_IDS = Object.keys(ART);

/** One drawing, by its name. `still` holds every move (used while the lesson is paused). */
export default function LessonArt({ art, prop, still = false }) {
  const Draw = ART[art];
  return (
    <svg aria-hidden="true" viewBox="0 0 360 300" className={`art${still ? " still" : ""}`}>
      {Draw ? <Draw prop={prop} /> : <rect width="360" height="300" fill={SKY} />}
    </svg>
  );
}

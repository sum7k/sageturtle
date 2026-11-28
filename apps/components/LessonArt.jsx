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

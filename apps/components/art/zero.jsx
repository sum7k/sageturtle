// The drawings of the chapter "Zero, fortune and debt" (lib/chapters/zero.js), for older learners: sums that write
// themselves, coins and debts that cancel, and a dot that walks the number line. Like every lesson drawing, each is
// a small SVG that the phone draws and moves itself (CSS in app/globals.css, under "lessons"); there is no video file.
// A drawing holds numbers and signs only, never a word, so one drawing serves every language.
// A gold coin is a fortune (धन); a red broken ring is a debt (ऋण). Times are in seconds from the start of the scene.

const INK = "#14174a", GOLD = "#ffc531", EDGE = "#d99a00", RED = "#e5484d", LEAF = "#fbf3df", RULE = "#e6d7ae", GREEN = "#2f9e6a", MUTED = "#6b6f99", SKIN = "#c68a5e";
const M = "−";
const at = (d) => (d === undefined ? undefined : { animationDelay: `${d}s` });
const seq = (n) => Array.from({ length: n }, (_, i) => i);

/** The page: a palm leaf, as a book of that time was written on. */
const Leaf = ({ children }) => (<><rect width="360" height="300" fill={LEAF} /><path d="M0 18h360M0 282h360" stroke={RULE} strokeWidth="2" />{children}</>);
/** Written numbers and signs. With `d` it appears at that second. */
const T = ({ x = 180, y, s = 34, c = INK, d, children }) => (
  <text x={x} y={y} fontSize={s} fontWeight="700" textAnchor="middle" dominantBaseline="central" fill={c} className={d === undefined ? undefined : "mv show"} style={at(d)}>{children}</text>
);
/** A debt inside a sum is written in red. */
const R = ({ children }) => <tspan fill={RED}>{children}</tspan>;
/** A line drawn through something that does not hold. */
const Strike = ({ y, d, w = 200 }) => <path d={`M${180 - w / 2} ${y + 10}L${180 + w / 2} ${y - 10}`} pathLength="1" stroke={RED} strokeWidth="6" strokeLinecap="round" className="draw" style={at(d)} />;

/** One coin, or one debt. `d`: it pops in then. `out`: it goes then. `drop`: it first moves down by `drop.by` at `drop.d`. */
const Tok = ({ x, y, debt, d, out, drop, r = 13 }) => (
  <g className={out === undefined ? undefined : "mv gone"} style={at(out)}>
    <g className={drop ? "mv to" : undefined} style={drop ? { "--ty": `${drop.by}px`, animationDelay: `${drop.d}s` } : undefined}>
      <circle cx={x} cy={y} r={r} className={d === undefined ? undefined : "mv pop"} style={at(d)} {...(debt ? { fill: "none", stroke: RED, strokeWidth: 3.5, strokeDasharray: "6 4" } : { fill: GOLD, stroke: EDGE, strokeWidth: 3 })} />
    </g>
  </g>
);
/** A row of them, centred on x. They come one by one from `d`, and go one by one from `out`. */
const Toks = ({ n, x = 180, y, gap = 34, debt, d, step = 0.25, out, outStep = 0.5 }) => seq(n).map((i) => (
  <Tok key={i} x={x - ((n - 1) * gap) / 2 + i * gap} y={y} debt={debt} d={d === undefined ? undefined : d + i * step} out={out === undefined ? undefined : out + i * outStep} />
));
/** `p` coins over `q` debts. From second `d` each coin drops on a debt and the pair is gone; what has no pair stays. */
const Cancel = ({ p, q, y = 80, gap = 34, d = 2.5, step = 0.9 }) => {
  const x0 = 180 - ((Math.max(p, q) - 1) * gap) / 2, k = Math.min(p, q);
  return (<>
    {seq(q).map((i) => <Tok key={`q${i}`} x={x0 + i * gap} y={y + 56} debt out={i < k ? d + i * step + 0.7 : undefined} />)}
    {seq(p).map((i) => <Tok key={`p${i}`} x={x0 + i * gap} y={y} drop={i < k ? { by: 56, d: d + i * step } : undefined} out={i < k ? d + i * step + 0.7 : undefined} />)}
  </>);
};

const U = 30, X = (v) => 180 + v * U; // the number line: zero in the middle, 30 to a step, from −5 to 5
const Line = ({ y = 190, lo = -5, hi = 5 }) => (
  <g>
    <path d={`M${X(lo) - 14} ${y}H${X(hi) + 14}`} stroke={INK} strokeWidth="3" strokeLinecap="round" />
    {seq(hi - lo + 1).map((i) => lo + i).map((v) => (
      <g key={v}>
        <path d={`M${X(v)} ${y - 7}v14`} stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <text x={X(v)} y={y + 30} fontSize="17" fontWeight="700" textAnchor="middle" fill={v < 0 ? RED : INK}>{v < 0 ? `${M}${-v}` : v}</text>
      </g>
    ))}
  </g>
);
/** An arc over the line from a to b, drawn at second `d`: gold to the right, red to the left. */
const Arc = ({ a, b, d, y = 190 }) => {
  const h = 16 + Math.abs(b - a) * 9;
  return <path d={`M${X(a)} ${y - 14}Q${(X(a) + X(b)) / 2} ${y - 14 - h * 2} ${X(b)} ${y - 14}`} pathLength="1" fill="none" stroke={b < a ? RED : EDGE} strokeWidth="4" strokeLinecap="round" className="draw" style={at(d)} />;
};
/** A dot that starts on `from` and makes its hops in turn, [[by, at second], ...], with an arc over each. */
const Walk = ({ from, hops, y = 190 }) => {
  let v = from;
  const arcs = hops.map(([by, d], i) => { const a = v; v += by; return <Arc key={i} a={a} b={v} d={d} y={y} />; });
  const dot = hops.reduceRight((inner, [by, d]) => <g className="mv to" style={{ "--tx": `${by * U}px`, "--t": "1.2s", animationDelay: `${d}s` }}>{inner}</g>, <circle cx={X(from)} cy={y} r="10" fill={INK} stroke={LEAF} strokeWidth="3" />);
  return (<>{arcs}{dot}</>);
};
/** Three lines of working, one under the other, each appearing in its turn. */
const Steps = ({ lines, ds = [0.5, 4, 7.5], s = 34, ys = [70, 150, 230] }) => lines.map((l, i) => (
  <g key={i}>{i > 0 && <T y={(ys[i - 1] + ys[i]) / 2} s={22} c={MUTED} d={ds[i] - 0.4}>↓</T>}<T y={ys[i]} s={s} d={ds[i]}>{l}</T></g>
));
const Pot = ({ x, y }) => <path d={`M${x - 13} ${y - 12}h26l-4 26h-18z`} fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
const Night = ({ children }) => (<><rect width="360" height="300" fill={INK} />{[[40, 40], [110, 70], [170, 30], [250, 60], [320, 36], [290, 110], [70, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#fff" className="mv twinkle" style={at(i * 0.4)} />)}<path d="M0 250Q90 232 180 244T360 240V300H0z" fill="#2b2f5e" />{children}</>);
const Sage = ({ x, y, c = "#c9a27a", s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-20 0c0-30 8-44 20-44s20 14 20 44z" fill={c} /><circle cx="0" cy="-58" r="15" fill={SKIN} /><path d="M-15-60a15 15 0 0 1 30 0c-8-8-22-8-30 0z" fill="#fff" />
  </g>
);

export const ZERO_ART = {
  // Zero is a number
  z_sky: () => (<Night><circle cx="180" cy="90" r="9" fill={GOLD} className="mv fly" /><Sage x={180} y={262} s={1.2} /><T x={104} y={226} s={44} c="#ffc531" d={3}>०</T></Night>),
  z_place: () => (<Leaf>{[110, 180, 250].map((x, i) => <rect key={x} x={x - 30} y={90} width="60" height="76" rx="12" fill="#fff" stroke={i === 1 ? RED : RULE} strokeWidth="3" strokeDasharray={i === 1 ? "7 5" : undefined} />)}<T x={110} y={128} s={44} d={0.4}>2</T><T x={250} y={128} s={44} d={1}>5</T><circle cx="180" cy="128" r="7" fill={INK} className="mv glow" style={at(2.5)} /><T y={222} s={24} c={MUTED} d={5}>2 · 5</T></Leaf>),
  z_take: () => (<Leaf><Toks n={5} y={100} gap={44} out={2.5} outStep={0.7} /><T y={210} d={7}>5 {M} 5 = 0</T></Leaf>),
  z_same: () => (<Leaf><T y={70} d={1.5}>3 {M} 3 = 0</T><T y={150} d={4}>100 {M} 100 = 0</T><T y={230} d={7}>◻ {M} ◻ = 0</T></Leaf>),
  z_add: () => (<Leaf><Toks n={7} y={64} gap={36} d={0.3} step={0.15} /><T y={150} d={3}>7 + 0 = 7</T><T y={224} d={7}>7 {M} 0 = 7</T></Leaf>),
  z_times: () => (<Leaf>{seq(7).map((i) => <g key={i} className="mv pop" style={at(1.5 + i * 0.3)}><Pot x={54 + i * 42} y={100} /></g>)}<T y={210} d={5}>7 × 0 = 0</T></Leaf>),
  z_line: () => (<Leaf><Line lo={0} /><circle cx={X(0)} cy="190" r="16" fill="none" stroke={EDGE} strokeWidth="4" className="mv glow" /><path d={`M${X(0) - 22} 190H${X(-5)}`} pathLength="1" stroke={RED} strokeWidth="3" strokeLinecap="round" className="draw" style={at(5)} /><T x={X(-3)} y={150} s={40} c={RED} d={6}>?</T></Leaf>),
  // Fortune and debt
  d_owe: () => (<Leaf><Cancel p={3} q={5} /><T y={226} d={7}>3 {M} 5 = <R>{M}2</R></T></Leaf>),
  d_names: () => (<Leaf><Tok x={110} y={110} r={40} d={0.3} /><T x={110} y={110} s={40} d={0.6}>+</T><Tok x={250} y={110} r={40} debt d={2} /><T x={250} y={110} s={40} c={RED} d={2.3}>{M}</T><T x={110} y={214} s={40} d={7}>3</T><T x={250} y={214} s={40} c={RED} d={9}>{M}3</T></Leaf>),
  d_line: () => (<Leaf><Line /><circle cx={X(0)} cy="190" r="16" fill="none" stroke={INK} strokeWidth="3" className="mv show" style={at(1.5)} /><path d={`M${X(0) + 18} 150H${X(5)}`} pathLength="1" stroke={GOLD} strokeWidth="12" strokeLinecap="round" className="draw slow" style={at(3)} /><path d={`M${X(0) - 18} 150H${X(-5)}`} pathLength="1" stroke={RED} strokeWidth="12" strokeLinecap="round" opacity="0.75" className="draw slow" style={at(7)} /><T x={X(2.5)} y={104} s={40} c={EDGE} d={3}>+</T><T x={X(-2.5)} y={104} s={40} c={RED} d={7}>{M}</T></Leaf>),
  d_mirror: () => (<Leaf><Line /><Arc a={0} b={3} d={1.5} /><Arc a={0} b={-3} d={1.5} /><Tok x={X(3)} y={190} r={11} d={2.5} /><Tok x={X(-3)} y={190} r={11} debt d={2.5} /><T x={X(3)} y={84} d={4}>3</T><T x={X(-3)} y={84} c={RED} d={5.5}>{M}3</T></Leaf>),
  d_cancel: () => (<Leaf><Cancel p={3} q={3} gap={48} d={3} /><T y={226} d={7}>3 + (<R>{M}3</R>) = 0</T></Leaf>),
  d_well: () => (<><rect width="360" height="300" fill="#cfe8ff" /><rect y="160" width="360" height="140" fill="#c9a27a" /><rect x="216" y="160" width="56" height="104" fill="#5b4636" /><rect x="216" y="236" width="56" height="28" fill="#8fd0f5" /><text x="110" y="108" fontSize="110" textAnchor="middle" dominantBaseline="central">🌳</text><path d="M24 160h312" stroke={INK} strokeWidth="3" /><T x={36} y={142} s={24} d={1.5}>0</T><path d="M170 158V60" pathLength="1" stroke={EDGE} strokeWidth="5" strokeLinecap="round" className="draw" style={at(4)} /><T x={196} y={84} s={30} d={5}>+4</T><path d="M296 162v100" pathLength="1" stroke={RED} strokeWidth="5" strokeLinecap="round" className="draw" style={at(7)} /><T x={326} y={236} s={30} c={RED} d={8}>{M}3</T></>),
  // The rules of adding
  a_pp: () => (<Leaf><Line /><Walk from={0} hops={[[2, 4], [3, 6.5]]} /><T y={60} d={8.5}>2 + 3 = 5</T></Leaf>),
  a_dd: () => (<Leaf><Line /><Walk from={0} hops={[[-2, 4], [-3, 6.5]]} /><T y={60} d={8.5}>(<R>{M}2</R>) + (<R>{M}3</R>) = <R>{M}5</R></T></Leaf>),
  a_pd: () => (<Leaf><Cancel p={5} q={3} d={6} /><T y={226} d={10}>5 + (<R>{M}3</R>) = 2</T></Leaf>),
  a_dp: () => (<Leaf><Cancel p={3} q={7} d={3} /><T y={226} d={7}>3 + (<R>{M}7</R>) = <R>{M}4</R></T></Leaf>),
  a_walk: () => (<Leaf><Line /><Walk from={-4} hops={[[6, 7]]} /><T y={50} d={9.5}>(<R>{M}4</R>) + 6 = 2</T></Leaf>),
  a_zero: () => (<Leaf><T y={70} d={1.5}>4 + 0 = 4</T><T y={150} d={4.5}>(<R>{M}4</R>) + 0 = <R>{M}4</R></T><T y={230} d={7.5}>0 + 0 = 0</T></Leaf>),
  // The rules of subtracting
  s_less: () => (<Leaf><Line /><Walk from={3} hops={[[-5, 4]]} /><T y={50} d={7}>3 {M} 5 = <R>{M}2</R></T></Leaf>),
  s_zero: () => (<Leaf><T y={100} d={0.5}>0 {M} 4 = <R>{M}4</R></T><T y={196} d={4.5}>0 {M} (<R>{M}4</R>) = 4</T></Leaf>),
  s_debt: () => (<Leaf><Toks n={4} y={40} gap={40} debt out={5} outStep={0.4} /><Line /><Walk from={-4} hops={[[4, 6.5]]} /><T x={96} y={254} s={20} d={9}>(<R>{M}4</R>) {M} (<R>{M}4</R>) = 0</T><T x={270} y={254} s={20} d={11}>(<R>{M}4</R>) + 4 = 0</T></Leaf>),
  s_rule: () => (<Leaf><Steps ds={[4, 8, 10.5]} lines={[<>5 {M} (<R>{M}3</R>)</>, "5 + 3", "= 8"]} /></Leaf>),
  s_ex: () => (<Leaf><Steps ds={[0.5, 3.5, 6.5]} lines={[<>(<R>{M}2</R>) {M} (<R>{M}6</R>)</>, <>(<R>{M}2</R>) + 6</>, "= 4"]} /></Leaf>),
  s_ex2: () => (<Leaf><Steps ds={[0.5, 3.5, 6.5]} lines={[<>(<R>{M}3</R>) {M} 4</>, <>(<R>{M}3</R>) + (<R>{M}4</R>)</>, <>= <R>{M}7</R></>]} /></Leaf>),
  // The rules of multiplying
  m_pp: () => (<Leaf>{[90, 180, 270].map((x, i) => <Toks key={x} n={2} x={x} y={100} gap={32} d={1.5 + i * 0.9} step={0.15} />)}<T y={210} d={5}>3 × 2 = 6</T></Leaf>),
  m_pd: () => (<Leaf>{[90, 180, 270].map((x, i) => <Toks key={x} n={2} x={x} y={100} gap={32} debt d={0.5 + i * 0.9} step={0.15} />)}<T y={210} d={3.5}>3 × (<R>{M}2</R>) = <R>{M}6</R></T></Leaf>),
  m_fall: () => (<Leaf>{[[3, 6, 5], [2, 4, 7], [1, 2, 9]].map(([n, r, d], i) => <T key={n} x={160} y={48 + i * 68} s={30} d={d}>{n} × (<R>{M}2</R>) = <R>{M}{r}</R></T>)}<T x={160} y={252} s={30} d={11}>0 × (<R>{M}2</R>) = 0</T>{[82, 150, 218].map((y, i) => <T key={y} x={320} y={y} s={22} c={GREEN} d={13 + i * 0.5}>+2</T>)}</Leaf>),
  m_rise: () => (<Leaf><T x={160} y={48} s={30}>0 × (<R>{M}2</R>) = 0</T>{[[1, 2, 4], [2, 4, 6.5], [3, 6, 9]].map(([n, r, d], i) => <T key={n} x={160} y={116 + i * 68} s={30} d={d}>(<R>{M}{n}</R>) × (<R>{M}2</R>) = {r}</T>)}{[82, 150, 218].map((y, i) => <T key={y} x={326} y={y} s={22} c={GREEN} d={4 + i * 2.5}>+2</T>)}</Leaf>),
  m_why: () => (<Leaf>{[90, 180, 270].map((x, i) => <g key={x}><Toks n={2} x={x} y={100} gap={32} debt out={2 + i * 1.3} outStep={0} /><Toks n={2} x={x} y={100} gap={32} d={2.6 + i * 1.3} step={0} /></g>)}<T y={210} d={7.5}>(<R>{M}3</R>) × (<R>{M}2</R>) = 6</T></Leaf>),
  m_signs: () => (<Leaf>{[["+", "+", "+", 2.5], [M, M, "+", 4], ["+", M, M, 7], [M, "+", M, 8.5]].map(([a, b, r, d], i) => <T key={i} y={44 + i * 54} s={32} d={d}><tspan fill={a === M ? RED : INK}>{a}</tspan> × <tspan fill={b === M ? RED : INK}>{b}</tspan> = <tspan fill={r === M ? RED : INK}>{r}</tspan></T>)}<T y={262} s={28} c={MUTED} d={11}>◻ × 0 = 0</T></Leaf>),
  m_sq: () => (<Leaf><T y={64} d={2}>3 × 3 = 9</T><T y={140} d={4.5}>(<R>{M}3</R>) × (<R>{M}3</R>) = 9</T><T x={120} y={226} s={30} c={MUTED} d={8.5}>◻ × ◻ = 9</T><T x={250} y={226} s={30} d={10}>3</T><T x={306} y={226} s={30} c={RED} d={11}>{M}3</T></Leaf>),
  // Dividing, and where I stopped
  v_share: () => (<Leaf>{[110, 250].map((x, i) => <g key={x}><ellipse cx={x} cy="84" rx="62" ry="34" fill="#fff" stroke={RULE} strokeWidth="3" /><Toks n={3} x={x} y={84} gap={32} d={2 + i * 0.9} step={0.2} /></g>)}<T y={176} d={4}>6 ÷ 2 = 3</T><T y={244} s={26} c={MUTED} d={8}>3 × 2 = 6</T></Leaf>),
  v_signs: () => (<Leaf><T y={70} s={30} d={3}>(<R>{M}6</R>) ÷ (<R>{M}2</R>) = 3</T><T y={150} s={30} d={6}>(<R>{M}6</R>) ÷ 2 = <R>{M}3</R></T><T y={230} s={30} d={7.5}>6 ÷ (<R>{M}2</R>) = <R>{M}3</R></T></Leaf>),
  v_zeroby: () => (<Leaf>{seq(5).map((i) => <ellipse key={i} cx={60 + i * 60} cy="96" rx="24" ry="14" fill="#fff" stroke={INK} strokeWidth="3" className="mv pop" style={at(1 + i * 0.3)} />)}<T y={200} d={4}>0 ÷ 5 = 0</T></Leaf>),
  v_byzero: () => (<Leaf><T y={90} s={40} d={2}>6 ÷ 0 = ?</T><T y={190} s={40} d={7}>? × 0 = 6</T><Strike y={190} d={12} w={230} /></Leaf>),
  v_honest: () => (<Leaf><T y={90} s={40} d={1}>0 ÷ 0 = 0</T><Strike y={90} d={9} w={230} /><T y={200} s={40} d={13}>◻ ÷ 0</T><g className="mv show" style={at(14.5)}><circle cx="180" cy="200" r="52" fill="none" stroke={RED} strokeWidth="6" /><path d="M143 237L217 163" stroke={RED} strokeWidth="6" /></g></Leaf>),
  v_grow: () => (<Night><Sage x={70} y={256} /><g className="mv show" style={at(3.5)}><Sage x={180} y={256} c="#6f8fd6" /></g><g className="mv show" style={at(5.5)}><Sage x={290} y={256} c="#7fb894" /></g><g className="mv to" style={{ "--tx": "110px", "--t": "1.4s", animationDelay: "6s" }}><g className="mv to" style={{ "--tx": "110px", "--t": "1.4s", animationDelay: "4s" }}><text x="70" y="150" fontSize="44" textAnchor="middle" dominantBaseline="central" className="mv bob">📜</text></g></g></Night>),
};

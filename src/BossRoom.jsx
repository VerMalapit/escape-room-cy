import { useState, useEffect, useRef, useCallback } from "react";
import { GREEN_SHADES, CIPHER_WORDS } from "./data.js";

// ─── green/black theme for boss room ─────────────────────
const G = {
  bg: "#010a01",
  panel: "#040f04",
  border: "#0a2a0a",
  accent: "#00ff88",
  accentDim: "#00ff8833",
  text: "#a0e0a0",
  textDim: "#2a5a2a",
  success: "#00ff88",
  error: "#ff4466",
  warn: "#ffcc00",
};

// ─── helpers ──────────────────────────────────────────────
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function encode(word, shift) {
  return word.split("").map(c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90)
      return String.fromCharCode((code - 65 + shift) % 26 + 65);
    return c;
  }).join("");
}

function generateStages() {
  // Attack 1: teaching years in binary
  // Attack 2: random green shade
  // Attack 3: random cipher word with random shift 3-5
  // Attack 4: necktie count guess (126)

  const shade = pickRandom(GREEN_SHADES);
  const others = GREEN_SHADES.filter(s => s.name !== shade.name)
    .sort(() => Math.random() - 0.5).slice(0, 8);
  const allOptions = [...others, shade].sort(() => Math.random() - 0.5);

  const cipherEntry = pickRandom(CIPHER_WORDS);
  const shift = 3 + Math.floor(Math.random() * 3); // 3,4,5
  const encoded = encode(cipherEntry.word, shift);

  return [
    {
      id: "binary_years",
      attackName: "LOGIC OVERFLOW",
      type: "binary_input",
      clue: "⚡ GYM LEADER VER used LOGIC OVERFLOW!\n\n\"I have dedicated my life to this profession. Students come and go. I remain.\"\n\nHow many years have I been teaching? Enter your answer in binary.",
      answer: "1100",
      altAnswers: ["001100", "0001100"],
      placeholder: "Enter in binary...",
      damage: 25,
      betweenText: "Acceptable.",
    },
    {
      id: "hex_green",
      attackName: "HEX BLAST",
      type: "hex_pick",
      clue: "🎨 GYM LEADER VER used HEX BLAST!\n\nThis hex code represents my favourite colour.\n\nIdentify the shade.",
      hexCode: shade.hex,
      hexOptions: allOptions,
      answer: shade.name,
      altAnswers: [shade.name.toLowerCase()],
      damage: 25,
      betweenText: "...Fine.",
    },
    {
      id: "cipher",
      attackName: "KERNEL PANIC",
      type: "cipher_input",
      clue: `🎮 GYM LEADER VER used KERNEL PANIC!\n\nI have a well-known obsession outside of computing.\nIts name has been encoded — Caesar cipher, shift of ${shift}.\n\nDecode it.`,
      encoded,
      shift,
      answer: cipherEntry.word,
      altAnswers: [cipherEntry.word.toLowerCase()],
      placeholder: "Decoded word...",
      damage: 25,
      betweenText: "I see you've been paying attention. Surprising.",
    },
    {
      id: "necktie_guess",
      attackName: "STACK SMASH",
      type: "guess_input",
      clue: "👔 GYM LEADER VER used STACK SMASH — his most powerful attack!\n\nEvery morning I open my wardrobe and face a difficult decision. I have been collecting them since my first day of teaching. Students have tried to count them. None have succeeded. The count is even and greater than 100.\n\nHow many do I own? You have 3 chances.",
      answer: 126,
      placeholder: "Enter a number...",
      damage: 25,
      betweenText: "",
    },
  ];
}

// ─── typewriter dialogue ──────────────────────────────────
function DialogueBox({ lines, onDone }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [charIdx, setCharIdx] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => { setDisplayed(""); setCharIdx(0); }, [idx]);

  useEffect(() => {
    if (idx >= lines.length) return;
    const line = lines[idx];
    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setDisplayed(line.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      }, 22);
      return () => clearTimeout(t);
    }
  }, [charIdx, idx, lines]);

  const advance = () => {
    const line = lines[idx];
    if (charIdx < line.length) {
      setDisplayed(line); setCharIdx(line.length);
    } else if (idx + 1 < lines.length) {
      setIdx(i => i + 1);
    } else {
      setFinished(true);
      onDone();
    }
  };

  return (
    <div onClick={advance} style={{
      cursor: "pointer", background: "#020f02",
      border: `2px solid ${G.border}`, borderRadius: 8,
      padding: "20px 24px", minHeight: 90,
      position: "relative", userSelect: "none",
    }}>
      <div style={{
        position: "absolute", top: -14, left: 16,
        background: G.accent, color: "#000",
        fontFamily: "Orbitron, monospace", fontSize: 11,
        fontWeight: 700, padding: "2px 12px", borderRadius: 3,
        letterSpacing: 2,
      }}>GYM LEADER VER</div>
      <p style={{
        color: G.text, fontFamily: "Share Tech Mono",
        fontSize: 15, lineHeight: 1.8, minHeight: 48,
        whiteSpace: "pre-line",
      }}>{displayed}<span style={{ opacity: 0.3 }}>█</span></p>
      {!finished && charIdx >= (lines[idx]?.length || 0) && (
        <div style={{
          position: "absolute", bottom: 10, right: 16,
          color: G.accent, fontSize: 16,
          animation: "blink 0.8s step-end infinite",
        }}>▼</div>
      )}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}

// ─── HP bar ───────────────────────────────────────────────
function HPBar({ hp, maxHp, label, color }) {
  const pct = Math.max(0, (hp / maxHp) * 100);
  const barColor = pct > 50 ? G.success : pct > 20 ? G.warn : G.error;
  return (
    <div style={{
      background: "#020f02", border: `2px solid ${G.border}`,
      borderRadius: 8, padding: "12px 16px", flex: 1,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color, fontFamily: "Orbitron", fontSize: 12, fontWeight: 700 }}>{label}</span>
        <span style={{ color: barColor, fontFamily: "Share Tech Mono", fontSize: 12 }}>
          {hp}/{maxHp} HP
        </span>
      </div>
      <div style={{ background: "#010801", borderRadius: 4, height: 12, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4, width: `${pct}%`,
          background: `linear-gradient(90deg, ${barColor}, ${barColor}aa)`,
          boxShadow: `0 0 8px ${barColor}66`,
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}

// ─── ATTACK: binary input ─────────────────────────────────
function BinaryInputAttack({ stage, onHit, onMiss }) {
  const [val, setVal] = useState("");
  const [result, setResult] = useState(null);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setVal(""); setResult(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const check = () => {
    if (result === "correct") return;
    const v = val.trim().replace(/^0+/, "") || "0";
    const correct = v === stage.answer.replace(/^0+/, "")
      || (stage.altAnswers || []).some(a => v === a.replace(/^0+/, ""));
    if (correct) {
      setResult("correct");
      setTimeout(() => onHit(stage.damage), 900);
    } else {
      setResult("wrong"); setShake(true);
      setTimeout(() => { setShake(false); setResult(null); }, 700);
      onMiss();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10 }} className={shake ? "shake" : ""}>
        <input ref={inputRef} value={val}
          onChange={e => setVal(e.target.value.replace(/[^01]/g, ""))}
          onKeyDown={e => e.key === "Enter" && check()}
          placeholder={stage.placeholder}
          style={{
            flex: 1, padding: "12px 16px", background: "#020f02",
            border: `2px solid ${result === "correct" ? G.success : result === "wrong" ? G.error : G.border}`,
            color: G.accent, borderRadius: 6,
            fontFamily: "Share Tech Mono", fontSize: 18,
            letterSpacing: 4, outline: "none", transition: "border-color 0.2s",
          }} />
        <button onClick={check} style={{
          padding: "12px 24px",
          background: "#010f01",
          border: `2px solid ${G.accent}`, color: G.accent,
          borderRadius: 6, cursor: "pointer",
          fontFamily: "Orbitron", fontWeight: 700,
          fontSize: 12, letterSpacing: 2,
          boxShadow: `0 0 12px ${G.accentDim}`,
        }}>USE MOVE</button>
      </div>
      <p style={{ color: G.textDim, fontSize: 11, marginTop: 8, fontFamily: "Share Tech Mono" }}>
        Only 0s and 1s accepted.
      </p>
      {result === "correct" && <HitBanner damage={stage.damage} />}
      {result === "wrong" && <MissBanner />}
    </div>
  );
}

// ─── ATTACK: hex colour pick ──────────────────────────────
function HexPickAttack({ stage, onHit, onMiss }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const pick = (opt) => {
    if (result === "correct") return;
    setSelected(opt.name);
    const correct = opt.name === stage.answer;
    if (correct) {
      setResult("correct");
      setTimeout(() => onHit(stage.damage), 900);
    } else {
      setResult("wrong");
      setTimeout(() => { setResult(null); setSelected(null); }, 700);
      onMiss();
    }
  };

  return (
    <div>
      {/* Hex code display only — no swatch */}
      <div style={{
        textAlign: "center", marginBottom: 20,
        padding: "16px", background: "#010f01",
        border: `1px solid ${G.border}`, borderRadius: 8,
      }}>
        <div style={{
          fontFamily: "Orbitron", fontSize: 32, fontWeight: 900,
          color: stage.hexCode, letterSpacing: 6,
          textShadow: `0 0 20px ${stage.hexCode}`,
        }}>{stage.hexCode}</div>
        <div style={{ color: G.textDim, fontSize: 11, marginTop: 6, fontFamily: "Share Tech Mono" }}>
          Identify the shade of green.
        </div>
      </div>

      {/* Colour buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {stage.hexOptions.map(opt => {
          const isSel = selected === opt.name;
          return (
            <button key={opt.name} onClick={() => pick(opt)} style={{
              padding: "12px 6px", borderRadius: 6, cursor: "pointer",
              background: opt.hex,
              border: `3px solid ${isSel ? "#fff" : "transparent"}`,
              color: isLight(opt.hex) ? "#000" : "#fff",
              fontFamily: "Share Tech Mono", fontSize: 11,
              fontWeight: "bold",
              boxShadow: isSel ? `0 0 16px ${opt.hex}` : "none",
              transition: "all 0.15s",
              textShadow: isLight(opt.hex) ? "none" : "0 1px 3px #000",
            }}>{opt.name}</button>
          );
        })}
      </div>

      {result === "correct" && <HitBanner damage={stage.damage} />}
      {result === "wrong" && <MissBanner />}
    </div>
  );
}

function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

// ─── ATTACK: cipher input ─────────────────────────────────
function CipherInputAttack({ stage, onHit, onMiss }) {
  const [val, setVal] = useState("");
  const [result, setResult] = useState(null);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setVal(""); setResult(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const check = () => {
    if (result === "correct") return;
    const v = val.trim().toUpperCase();
    const correct = v === stage.answer.toUpperCase()
      || (stage.altAnswers || []).some(a => v === a.toUpperCase());
    if (correct) {
      setResult("correct");
      setTimeout(() => onHit(stage.damage), 900);
    } else {
      setResult("wrong"); setShake(true);
      setTimeout(() => { setShake(false); setResult(null); }, 700);
      onMiss();
    }
  };

  return (
    <div>
      <div style={{
        textAlign: "center", marginBottom: 16,
        fontSize: 28, fontWeight: "bold",
        color: G.accent, letterSpacing: 10,
        textShadow: `0 0 14px ${G.accentDim}`,
        fontFamily: "Share Tech Mono",
      }}>{stage.encoded}</div>
      <div style={{ display: "flex", gap: 10 }} className={shake ? "shake" : ""}>
        <input ref={inputRef} value={val}
          onChange={e => setVal(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && check()}
          placeholder={stage.placeholder}
          style={{
            flex: 1, padding: "12px 16px", background: "#020f02",
            border: `2px solid ${result === "correct" ? G.success : result === "wrong" ? G.error : G.border}`,
            color: G.accent, borderRadius: 6,
            fontFamily: "Share Tech Mono", fontSize: 16,
            letterSpacing: 3, outline: "none", transition: "border-color 0.2s",
          }} />
        <button onClick={check} style={{
          padding: "12px 24px", background: "#010f01",
          border: `2px solid ${G.accent}`, color: G.accent,
          borderRadius: 6, cursor: "pointer",
          fontFamily: "Orbitron", fontWeight: 700,
          fontSize: 12, letterSpacing: 2,
          boxShadow: `0 0 12px ${G.accentDim}`,
        }}>USE MOVE</button>
      </div>
      {result === "correct" && <HitBanner damage={stage.damage} />}
      {result === "wrong" && <MissBanner />}
    </div>
  );
}

// ─── ATTACK: necktie guess (3 chances, higher/lower) ──────
function GuessInputAttack({ stage, onHit, onFail }) {
  const [val, setVal] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [result, setResult] = useState(null);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);
  const MAX = 3;

  useEffect(() => {
    setVal(""); setResult(null); setGuesses([]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const submit = () => {
    if (result === "correct" || guesses.length >= MAX) return;
    const n = parseInt(val.trim());
    if (isNaN(n)) return;
    const correct = n === stage.answer;
    const hint = n < stage.answer ? "↑ Higher" : "↓ Lower";
    const newGuesses = [...guesses, { val: n, hint, correct }];
    setGuesses(newGuesses);
    setVal("");

    if (correct) {
      setResult("correct");
      setTimeout(() => onHit(stage.damage), 900);
    } else if (newGuesses.length >= MAX) {
      setResult("failed");
      setTimeout(onFail, 1800);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const remaining = MAX - guesses.length;

  return (
    <div>
      {/* Guess history */}
      {guesses.length > 0 && (
        <div style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          {guesses.map((g, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, alignItems: "center",
              padding: "8px 14px", borderRadius: 4,
              background: g.correct ? "#00ff8812" : "#0a1a0a",
              border: `1px solid ${g.correct ? G.success : G.border}`,
              fontFamily: "Share Tech Mono", fontSize: 13,
            }}>
              <span style={{ color: G.textDim, fontSize: 11 }}>#{i + 1}</span>
              <span style={{ color: G.text }}>{g.val}</span>
              {!g.correct && (
                <span style={{
                  marginLeft: "auto", fontWeight: "bold",
                  color: G.warn, fontSize: 14,
                }}>{g.hint}</span>
              )}
              {g.correct && <span style={{ marginLeft: "auto", color: G.success }}>✓ Correct!</span>}
            </div>
          ))}
        </div>
      )}

      {/* Chances remaining */}
      {result !== "correct" && result !== "failed" && (
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {Array.from({ length: MAX }, (_, i) => (
            <div key={i} style={{
              width: 28, height: 8, borderRadius: 2,
              background: i < guesses.length ? G.error : G.accent,
              boxShadow: i < guesses.length ? "none" : `0 0 6px ${G.accentDim}`,
              transition: "all 0.3s",
            }} />
          ))}
          <span style={{ color: G.textDim, fontSize: 11, fontFamily: "Share Tech Mono", marginLeft: 8, alignSelf: "center" }}>
            {remaining} chance{remaining !== 1 ? "s" : ""} remaining
          </span>
        </div>
      )}

      {/* Input */}
      {result !== "correct" && result !== "failed" && (
        <div style={{ display: "flex", gap: 10 }} className={shake ? "shake" : ""}>
          <input ref={inputRef} value={val}
            onChange={e => setVal(e.target.value.replace(/\D/g, ""))}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder={stage.placeholder}
            style={{
              flex: 1, padding: "12px 16px", background: "#020f02",
              border: `2px solid ${G.border}`,
              color: G.accent, borderRadius: 6,
              fontFamily: "Share Tech Mono", fontSize: 16,
              outline: "none",
            }} />
          <button onClick={submit} style={{
            padding: "12px 24px", background: "#010f01",
            border: `2px solid ${G.accent}`, color: G.accent,
            borderRadius: 6, cursor: "pointer",
            fontFamily: "Orbitron", fontWeight: 700,
            fontSize: 12, letterSpacing: 2,
            boxShadow: `0 0 12px ${G.accentDim}`,
          }}>GUESS</button>
        </div>
      )}

      {result === "correct" && <HitBanner damage={stage.damage} />}
      {result === "failed" && (
        <div className="fade-up" style={{
          marginTop: 14, padding: "14px 16px",
          background: "#1a020a", border: `1px solid ${G.error}`,
          borderRadius: 4, color: G.error,
          fontFamily: "Share Tech Mono", fontSize: 13, lineHeight: 1.7,
        }}>
          ✗ Three guesses exhausted. VER resists.<br />
          <span style={{ color: "#6a2a3a", fontSize: 12 }}>Restarting boss battle...</span>
        </div>
      )}
    </div>
  );
}

// ─── shared banners ───────────────────────────────────────
function HitBanner({ damage }) {
  return (
    <div className="fade-up" style={{
      marginTop: 12, padding: "11px 16px",
      background: "#00ff8811", border: `1px solid ${G.success}`,
      borderRadius: 6, color: G.success,
      fontFamily: "Share Tech Mono", fontSize: 13,
    }}>⚡ It's super effective! VER takes {damage} damage!</div>
  );
}

function MissBanner() {
  return (
    <div style={{
      marginTop: 12, padding: "11px 16px",
      background: "#ff446611", border: `1px solid ${G.error}`,
      borderRadius: 6, color: G.error,
      fontFamily: "Share Tech Mono", fontSize: 13,
    }}>✗ The move missed. Try again.</div>
  );
}

// ─── badge reveal ─────────────────────────────────────────
function BadgeReveal({ teamName, onComplete }) {
  const [step, setStep] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const defeatLines = [
    "...",
    "Correct.",
    "All four.",
    "I have nothing further to add.",
    "Except...",
    `Well done, ${teamName}.`,
    "The SYNTAX BADGE is yours.",
    "Don't make me regret this.",
  ];

  return (
    <div>
      {step === 0 && (
        <DialogueBox lines={defeatLines} onDone={() => setStep(1)} />
      )}
      {step === 1 && (
        <div className="fade-up" style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "Orbitron", fontSize: 24, fontWeight: 900,
            color: "#ffd700", textShadow: "0 0 30px #ffd70066",
            marginBottom: 16, letterSpacing: 3,
          }}>✦ SYNTAX BADGE OBTAINED ✦</div>
          <div
            onClick={() => setZoomed(true)}
            style={{
              display: "inline-block", cursor: "zoom-in",
              borderRadius: 16, overflow: "hidden",
              boxShadow: "0 0 40px #ffd70044, 0 0 80px #00ff8822",
              border: "3px solid #ffd70066",
              maxWidth: 300, width: "100%",
              animation: "holographic 3s ease-in-out infinite",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.03) rotate(-1deg)";
              e.currentTarget.style.boxShadow = "0 0 60px #ffd70088, 0 0 100px #00ff8844";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 40px #ffd70044, 0 0 80px #00ff8822";
            }}
          >
            <img src="./syntax-badge.png" alt="Syntax Badge"
              style={{ width: "100%", display: "block" }} />
          </div>
          <p style={{
            color: G.textDim, fontFamily: "Share Tech Mono",
            fontSize: 11, marginTop: 12, letterSpacing: 2,
          }}>Tap to enlarge · Screenshot as proof 📸</p>
          <button onClick={onComplete} style={{
            marginTop: 16, padding: "12px 36px",
            background: "#010f01", border: `2px solid ${G.success}`,
            color: G.success, borderRadius: 6, cursor: "pointer",
            fontFamily: "Orbitron", fontWeight: 700,
            fontSize: 12, letterSpacing: 3,
          }}>CONTINUE →</button>
          {zoomed && (
            <div onClick={() => setZoomed(false)} style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.95)",
              display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "zoom-out", padding: 20,
            }}>
              <img src="./syntax-badge.png" alt="Syntax Badge"
                style={{
                  maxWidth: "88vw", maxHeight: "88vh",
                  borderRadius: 20,
                  boxShadow: "0 0 80px #ffd70066, 0 0 160px #00ff8833",
                  border: "4px solid #ffd70088",
                }} />
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes holographic {
          0%,100%{filter:hue-rotate(0deg) brightness(1)}
          33%{filter:hue-rotate(10deg) brightness(1.06)}
          66%{filter:hue-rotate(-10deg) brightness(1.08)}
        }
      `}</style>
    </div>
  );
}

// ─── BOSS ROOM MAIN ───────────────────────────────────────
const INTRO_LINES = [
  "...",
  "So. You made it through all eight rooms.",
  "Noted.",
  "I am GYM LEADER VER.",
  "Keeper of the Syntax Badge. Master of this domain.",
  "My logic has no errors. My cache has never missed.",
  "You have four challenges remaining.",
  "I suggest you think before you type.",
  "Begin.",
];

export default function BossRoom({ onSolve, teamName }) {
  const [phase, setPhase] = useState("intro");
  const [stages, setStages] = useState(() => generateStages());
  const [stageIdx, setStageIdx] = useState(0);
  const [oliverHp, setOliverHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [battleLog, setBattleLog] = useState([]);
  const [betweenLines, setBetweenLines] = useState([]);
  const [runCount, setRunCount] = useState(1);

  const stage = stages[stageIdx];

  const addLog = (msg) => setBattleLog(prev => [msg, ...prev].slice(0, 3));

  const handleHit = (dmg) => {
    const newHp = Math.max(0, oliverHp - dmg);
    setOliverHp(newHp);
    addLog(`⚡ ${stage.attackName} — VER takes ${dmg} damage!`);
    const nextIdx = stageIdx + 1;
    if (nextIdx >= stages.length) {
      setTimeout(() => setPhase("defeat"), 700);
    } else {
      const between = stages[stageIdx].betweenText;
      if (between) {
        setBetweenLines([between]);
        setPhase("between");
      } else {
        setStageIdx(nextIdx);
      }
    }
  };

  const handleMiss = () => {
    const newHp = Math.max(0, playerHp - 5);
    setPlayerHp(newHp);
    addLog("✗ Move missed — 5 recoil damage.");
  };

  // Attack 4 failed — restart boss
  const handleFinalFail = () => {
    const newStages = generateStages();
    setStages(newStages);
    setStageIdx(0);
    setOliverHp(100);
    setPlayerHp(100);
    setBattleLog([]);
    setRunCount(r => r + 1);
    setPhase("rematch");
  };

  const afterBetween = () => {
    setStageIdx(i => i + 1);
    setPhase("battle");
  };

  const renderAttack = () => {
    if (!stage) return null;
    switch (stage.type) {
      case "binary_input":
        return <BinaryInputAttack key={`${runCount}-${stageIdx}`} stage={stage} onHit={handleHit} onMiss={handleMiss} />;
      case "hex_pick":
        return <HexPickAttack key={`${runCount}-${stageIdx}`} stage={stage} onHit={handleHit} onMiss={handleMiss} />;
      case "cipher_input":
        return <CipherInputAttack key={`${runCount}-${stageIdx}`} stage={stage} onHit={handleHit} onMiss={handleMiss} />;
      case "guess_input":
        return <GuessInputAttack key={`${runCount}-${stageIdx}`} stage={stage} onHit={handleHit} onFail={handleFinalFail} />;
      default: return null;
    }
  };

  const rematchLines = [
    "...",
    "You failed to breach my final defence.",
    "Impressive persistence, however.",
    "We go again.",
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at center, #020f02 0%, #010601 70%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, fontFamily: "Share Tech Mono",
    }}>
      <div className="scanlines" />
      <div style={{ maxWidth: 700, width: "100%", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ color: G.textDim, fontSize: 10, letterSpacing: 6, marginBottom: 4 }}>
            BOSS ROOM // COMPUTING GYM // V.E.R.
          </div>
          <div style={{
            fontFamily: "Orbitron", fontSize: 24, fontWeight: 900,
            color: G.accent, textShadow: `0 0 30px ${G.accentDim}`,
            letterSpacing: 3,
          }}>GYM LEADER VER'S LAIR</div>
          <div style={{ color: G.textDim, fontSize: 11, letterSpacing: 4, marginTop: 4 }}>
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>
          {runCount > 1 && (
            <div style={{ color: G.error, fontSize: 11, letterSpacing: 3, marginTop: 4 }}>
              REMATCH #{runCount}
            </div>
          )}
        </div>

        {/* HP bars */}
        {(phase === "battle" || phase === "between" || phase === "defeat" || phase === "rematch") && (
          <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
            <HPBar hp={oliverHp} maxHp={100} label="VER" color={G.accent} />
            <HPBar hp={playerHp} maxHp={100} label={teamName.toUpperCase()} color="#00d4ff" />
          </div>
        )}

        {/* Main panel */}
        <div style={{
          background: G.panel, border: `2px solid ${G.border}`,
          borderRadius: 12, overflow: "hidden",
          boxShadow: `0 0 60px ${G.accentDim}`,
        }}>
          {/* Trainer area */}
          <div style={{
            background: "linear-gradient(180deg, #010f01 0%, #040f04 100%)",
            padding: "22px 28px", borderBottom: `1px solid ${G.border}`,
            display: "flex", alignItems: "center", gap: 18,
          }}>
            <div style={{
              width: 76, height: 76, borderRadius: 8, flexShrink: 0,
              background: "linear-gradient(135deg, #010f01, #020f02)",
              border: `2px solid ${G.accent}44`,
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 36,
              boxShadow: `0 0 20px ${G.accentDim}`,
              animation: phase === "defeat" ? "none" : "trainer-bob 1.6s ease-in-out infinite",
            }}>👔</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "Orbitron", fontSize: 15,
                color: G.accent, fontWeight: 700, marginBottom: 4,
              }}>GYM LEADER VER</div>
              <div style={{ color: G.textDim, fontSize: 11, letterSpacing: 2 }}>
                COMPUTING TYPE · MATI GYM · DUBAI, UAE
              </div>
              {(phase === "battle" || phase === "between") && (
                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  {stages.map((_, i) => (
                    <div key={i} style={{
                      width: 26, height: 7, borderRadius: 2,
                      background: i < stageIdx ? G.success
                        : i === stageIdx ? G.accent : G.border,
                      border: `1px solid ${i === stageIdx ? G.accent : G.border}`,
                      boxShadow: i === stageIdx ? `0 0 8px ${G.accent}` : "none",
                      transition: "all 0.4s",
                    }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clue / content */}
          <div style={{ padding: "24px 28px" }}>
            {phase === "intro" && (
              <DialogueBox lines={INTRO_LINES} onDone={() => setPhase("battle")} />
            )}
            {phase === "rematch" && (
              <DialogueBox lines={rematchLines} onDone={() => setPhase("battle")} />
            )}
            {phase === "between" && (
              <DialogueBox lines={betweenLines} onDone={afterBetween} />
            )}

            {phase === "battle" && stage && (
              <div>
                {/* Attack clue box */}
                <div style={{
                  background: "#010f01", border: `2px solid ${G.border}`,
                  borderRadius: 8, padding: "16px 20px", marginBottom: 16,
                  color: G.text, fontFamily: "Share Tech Mono",
                  fontSize: 13, lineHeight: 1.9, whiteSpace: "pre-line",
                }}>
                  {stage.clue}
                </div>

                {renderAttack()}

                {/* Battle log */}
                {battleLog.length > 0 && (
                  <div style={{
                    marginTop: 16, background: "#010801",
                    border: `1px solid ${G.border}`,
                    borderRadius: 6, padding: "10px 14px",
                  }}>
                    {battleLog.map((log, i) => (
                      <div key={i} style={{
                        color: i === 0 ? G.text : G.textDim,
                        fontSize: 12, lineHeight: 1.7,
                      }}>{log}</div>
                    ))}
                  </div>
                )}

                {/* Hint */}
                <div style={{ marginTop: 18 }}>
                  <details>
                    <summary style={{
                      cursor: "pointer", fontSize: 11, color: G.textDim,
                      letterSpacing: 1, fontFamily: "Share Tech Mono",
                      listStyle: "none",
                    }}>▶ USE POTION (hint)</summary>
                    <p style={{
                      color: "#3a6a3a", fontSize: 12, marginTop: 8,
                      lineHeight: 1.7, background: "#010f01",
                      padding: "10px 14px", borderRadius: 4,
                      border: `1px solid ${G.border}`,
                    }}>
                      💡 Challenge {stageIdx + 1} of {stages.length}. Think carefully — Ver's weakness is his own story.
                    </p>
                  </details>
                </div>
              </div>
            )}

            {phase === "defeat" && (
              <BadgeReveal teamName={teamName} onComplete={onSolve} />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes trainer-bob {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-6px)}
        }
      `}</style>
    </div>
  );
}

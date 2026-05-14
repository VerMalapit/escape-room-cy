import { useState, useEffect, useRef, useCallback } from "react";
import { ROOMS } from "./data.js";
import BossRoom from "./BossRoom.jsx";

// ─── colour palette ───────────────────────────────────────
const C = {
  bg: "#04080f", panel: "#070d1a", border: "#0f2044",
  accent: "#00d4ff", accentDim: "#00d4ff33",
  text: "#a0c8e8", textDim: "#3a6a9a",
  success: "#00ff88", error: "#ff4466",
  boss: "#ff6600",
};

// ─── shared UI ────────────────────────────────────────────
function RoomHeader({ section, sectionTitle, roomNum, total, elapsed }) {
  const m = Math.floor(elapsed / 60), s = elapsed % 60;
  return (
    <div style={{
      background: C.panel, padding: "12px 24px",
      borderBottom: `1px solid ${C.border}`,
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: 8,
    }}>
      <div style={{ color: C.accentDim, fontSize: 10, letterSpacing: 3, fontFamily: "Share Tech Mono" }}>
        {section} // {sectionTitle}
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        <span style={{ color: C.textDim, fontSize: 11, fontFamily: "Share Tech Mono" }}>
          ⏱ {m}:{s.toString().padStart(2, "0")}
        </span>
        <span style={{ color: C.textDim, fontSize: 11, fontFamily: "Share Tech Mono" }}>
          ROOM {roomNum}/{total}
        </span>
      </div>
    </div>
  );
}

function HintToggle({ hint }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={() => setShow(!show)} style={{
        background: "none", border: "none", color: C.textDim,
        cursor: "pointer", fontFamily: "Share Tech Mono",
        fontSize: 11, padding: 0, letterSpacing: 1,
      }}>
        {show ? "▼ HIDE HINT" : "▶ NEED A HINT?"}
      </button>
      {show && (
        <p style={{
          color: "#4a8aaa", fontSize: 13, marginTop: 8, lineHeight: 1.7,
          fontFamily: "Share Tech Mono", background: "#00d4ff08",
          padding: "10px 14px", borderRadius: 4,
          border: "1px solid #00d4ff18",
        }}>💡 {hint}</p>
      )}
    </div>
  );
}

function SuccessBanner({ msg }) {
  return (
    <div className="fade-up" style={{
      marginTop: 16, padding: "14px 18px",
      background: "#00ff8811", border: `1px solid ${C.success}`,
      borderRadius: 4, color: C.success,
      fontWeight: "bold", fontSize: 14,
      fontFamily: "Share Tech Mono", letterSpacing: 1,
    }}>✓ {msg}</div>
  );
}

function ErrorBanner({ msg }) {
  return (
    <div style={{
      marginTop: 10, padding: "10px 14px",
      background: "#ff446611", border: `1px solid ${C.error}`,
      borderRadius: 4, color: C.error,
      fontSize: 13, fontFamily: "Share Tech Mono",
    }}>✗ {msg || "Incorrect. Try again."}</div>
  );
}

// ─── PUZZLE: spec_error ───────────────────────────────────
// ─── PUZZLE: detective ────────────────────────────────────
function DetectivePuzzle({ room, onSolve }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState([]);
  const [solved, setSolved] = useState(false);
  const [wrongMsg, setWrongMsg] = useState(null);

  const pick = (suspect) => {
    if (solved) return;
    setSelected(suspect.id);
    if (suspect.guilty) {
      setSolved(true);
      setTimeout(onSolve, 1800);
    } else {
      setWrongMsg(suspect.alibi);
      if (!revealed.includes(suspect.id)) setRevealed(r => [...r, suspect.id]);
      setTimeout(() => { setWrongMsg(null); setSelected(null); }, 2400);
    }
  };

  return (
    <div style={{ fontFamily: "Share Tech Mono" }}>
      <div style={{
        background: "#050b15", border: "1px solid #1a3a1a",
        borderRadius: 6, marginBottom: 18, overflow: "hidden",
      }}>
        <div style={{
          background: "#0a1a0a", padding: "9px 16px",
          borderBottom: "1px solid #1a3a1a",
          color: "#00ff88", fontSize: 11, letterSpacing: 3,
        }}>🔍 {room.crimeReport.title}</div>
        <div style={{ padding: "12px 16px" }}>
          {room.crimeReport.details.map((d, i) => (
            <div key={i} style={{
              color: i < 2 ? "#cc4444" : C.text,
              fontSize: 12, lineHeight: 1.9,
              borderBottom: i < room.crimeReport.details.length - 1 ? "1px solid #0a1a0a" : "none",
              paddingBottom: 4, marginBottom: 4,
            }}>
              <span style={{ color: "#2a5a2a", marginRight: 8 }}>▸</span>{d}
            </div>
          ))}
        </div>
      </div>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 14 }}>
        Study the evidence. Click the suspect that matches ALL clues.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {room.suspects.map(suspect => {
          const isSel = selected === suspect.id;
          const isCleared = revealed.includes(suspect.id);
          return (
            <div key={suspect.id} onClick={() => !isCleared && !solved && pick(suspect)} style={{
              padding: "14px", borderRadius: 6,
              cursor: isCleared || solved ? "default" : "pointer",
              background: isCleared ? "#0a0a0a"
                : isSel && suspect.guilty ? "#00ff8812"
                : isSel ? "#ff446612" : "#050b15",
              border: `1px solid ${isCleared ? "#111"
                : isSel && suspect.guilty ? C.success
                : isSel ? C.error : C.border}`,
              opacity: isCleared ? 0.35 : 1,
              transition: "all 0.3s",
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{suspect.icon}</div>
              <div style={{
                fontFamily: "Orbitron", fontSize: 12, fontWeight: 700,
                color: isCleared ? "#222"
                  : isSel && suspect.guilty ? C.success : C.accent,
                marginBottom: 8,
              }}>
                {suspect.name}
                {isCleared && <span style={{ color: "#333", fontSize: 10, marginLeft: 6 }}>— CLEARED</span>}
              </div>
              {suspect.profile.map((p, i) => (
                <div key={i} style={{ fontSize: 11, color: isCleared ? "#222" : C.textDim, lineHeight: 1.7 }}>
                  <span style={{ color: isCleared ? "#1a1a1a" : "#1a3a5a", marginRight: 6 }}>·</span>{p}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {wrongMsg && (
        <div className="fade-up" style={{
          marginTop: 14, padding: "12px 16px",
          background: "#ff446611", border: `1px solid ${C.error}`,
          borderRadius: 4, color: "#ff8899",
          fontFamily: "Share Tech Mono", fontSize: 13, lineHeight: 1.7,
        }}>✗ Wrong suspect. ALIBI: {wrongMsg}</div>
      )}
      {solved && (
        <div className="fade-up" style={{
          marginTop: 14, padding: "14px 16px",
          background: "#00ff8811", border: `1px solid ${C.success}`,
          borderRadius: 4, color: C.success,
          fontFamily: "Share Tech Mono", fontSize: 13, lineHeight: 1.7,
        }}>✓ CASE CLOSED. {room.suspects.find(s => s.guilty)?.convictMsg}</div>
      )}
    </div>
  );
}

// ─── PUZZLE: fde_chase ────────────────────────────────────
function FDEChasePuzzle({ room, onSolve }) {
  const [activated, setActivated] = useState(false);
  const [escapes, setEscapes] = useState(0);
  const [caught, setCaught] = useState(false);
  const [wrongId, setWrongId] = useState(null);
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });
  const [tired, setTired] = useState(false);
  const containerRef = useRef(null);
  const MAX_ESCAPES = 10;

  const randomPos = () => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    const cardW = 300, cardH = 100, margin = 10;
    const x = Math.random() * Math.max(10, rect.width - cardW - margin * 2) + margin;
    const y = Math.random() * Math.max(10, rect.height - cardH - margin * 2) + margin;
    return { x, y };
  };

  const handleHoverC = () => {
    if (!activated || caught || tired) return;
    const newEscapes = escapes + 1;
    setEscapes(newEscapes);
    setCardPos(randomPos());
    if (newEscapes >= MAX_ESCAPES) setTired(true);
  };

  const handleClickEntry = (entry) => {
    if (caught) return;
    if (entry.id === room.correctImposter) {
      if (!activated) {
        setActivated(true);
        setTimeout(() => setCardPos(randomPos()), 60);
      } else if (tired) {
        setCaught(true);
        setTimeout(onSolve, 1600);
      }
    } else {
      setWrongId(entry.id);
      setTimeout(() => setWrongId(null), 900);
    }
  };

  const staticEntries = room.entries.filter(e => e.id !== room.correctImposter);
  const chaseEntry = room.entries.find(e => e.id === room.correctImposter);

  return (
    <div style={{ fontFamily: "Share Tech Mono" }}>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 14 }}>
        One entry contains an error. Click it to identify the saboteur.
      </p>
      {activated && !caught && (
        <div style={{
          marginBottom: 12, padding: "9px 14px",
          background: tired ? "#1a1000" : "#1a0505",
          border: `1px solid ${tired ? "#ffaa0044" : C.error + "44"}`,
          borderRadius: 4,
          color: tired ? "#ffaa00" : C.error,
          fontSize: 12, letterSpacing: 1,
        }}>
          {tired
            ? "⚠ ENTRY C IS EXHAUSTED. It can no longer resist. Click it now."
            : `⚠ ENTRY RESISTING DELETION — ${MAX_ESCAPES - escapes} escapes remaining`}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
        {staticEntries.map((entry, idx) => {
          const isWrong = wrongId === entry.id;
          return (
            <div key={entry.id} onClick={() => handleClickEntry(entry)} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              padding: "13px 16px", borderRadius: 6, cursor: "pointer",
              background: isWrong ? "#ff446612" : "#050b15",
              border: `1px solid ${isWrong ? C.error : C.border}`,
              color: isWrong ? C.error : C.text,
              transition: "all 0.2s", lineHeight: 1.7, fontSize: 13,
            }}>
              <span style={{ color: C.accentDim, minWidth: 22, marginTop: 1 }}>
                [{String.fromCharCode(65 + idx)}]
              </span>
              <span>{entry.text}</span>
            </div>
          );
        })}
      </div>
      <div ref={containerRef} style={{
        position: "relative",
        height: activated && !caught ? 200 : "auto",
        minHeight: activated && !caught ? 200 : 0,
      }}>
        <div
          onClick={() => handleClickEntry(chaseEntry)}
          onMouseEnter={handleHoverC}
          style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            padding: "13px 16px", borderRadius: 6,
            cursor: caught ? "default" : "pointer",
            background: caught ? "#00ff8812"
              : tired ? "#1a1000"
              : activated ? "#0f0505" : "#050b15",
            border: `1px solid ${caught ? C.success
              : tired ? "#ffaa00"
              : activated ? C.error + "66" : C.border}`,
            color: caught ? C.success : tired ? "#ffaa00" : C.text,
            lineHeight: 1.7, fontSize: 13,
            position: activated && !caught ? "absolute" : "relative",
            width: activated && !caught ? 300 : "auto",
            left: activated && !caught ? cardPos.x : "auto",
            top: activated && !caught ? cardPos.y : "auto",
            transition: tired
              ? "left 0.5s ease, top 0.5s ease"
              : "left 0.07s linear, top 0.07s linear",
            zIndex: 2,
            boxShadow: tired ? "0 0 16px #ffaa0033"
              : activated ? `0 0 8px ${C.error}22` : "none",
            animation: tired && !caught ? "tremble 0.25s infinite" : "none",
            userSelect: "none",
          }}
        >
          <span style={{ color: C.accentDim, minWidth: 22, marginTop: 1 }}>[C]</span>
          <span>{chaseEntry.text}</span>
        </div>
      </div>
      {wrongId && (
        <div style={{
          marginTop: 10, padding: "10px 14px",
          background: "#ff446611", border: `1px solid ${C.error}`,
          borderRadius: 4, color: C.error, fontSize: 13,
        }}>✗ That entry is accurate. Look more carefully.</div>
      )}
      {caught && (
        <div className="fade-up" style={{
          marginTop: 14, padding: "12px 16px",
          background: "#00ff8811", border: `1px solid ${C.success}`,
          borderRadius: 4, color: C.success,
          fontFamily: "Share Tech Mono", fontSize: 13, lineHeight: 1.7,
        }}>✓ Caught. {room.errorExplanation}</div>
      )}
      <style>{`
        @keyframes tremble {
          0%,100%{transform:translate(0,0) rotate(0deg)}
          25%{transform:translate(-3px,2px) rotate(-1deg)}
          75%{transform:translate(3px,-2px) rotate(1deg)}
        }
      `}</style>
    </div>
  );
}


// ─── PUZZLE: gauntlet ─────────────────────────────────────
function GauntletPuzzle({ room, onSolve }) {
  const [qi, setQi] = useState(0);
  const [streak, setStreak] = useState(0);
  const [flash, setFlash] = useState(null); // "correct" | "wrong"
  const [done, setDone] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const q = room.questions[qi];

  const pick = (option) => {
    if (flash) return;
    if (option === q.correct) {
      setFlash("correct");
      const next = qi + 1;
      const newStreak = streak + 1;
      setTimeout(() => {
        setFlash(null);
        if (next >= room.questions.length) {
          setDone(true);
          setTimeout(onSolve, 900);
        } else {
          setQi(next);
          setStreak(newStreak);
        }
      }, 500);
    } else {
      setFlash("wrong");
      setAttempts(a => a + 1);
      setTimeout(() => {
        setFlash(null);
        setQi(0);
        setStreak(0);
      }, 900);
    }
  };

  return (
    <div style={{ fontFamily: "Share Tech Mono" }}>
      {/* Progress chain */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {room.questions.map((_, i) => (
          <div key={i} style={{
            width: 22, height: 8, borderRadius: 2,
            background: i < streak ? C.success : i === qi ? C.accent : "#0a1828",
            border: `1px solid ${i < streak ? C.success : i === qi ? C.accent : C.border}`,
            boxShadow: i === qi ? `0 0 6px ${C.accent}` : "none",
            transition: "all 0.3s",
          }} />
        ))}
        <span style={{ color: C.textDim, fontSize: 11, marginLeft: 8, alignSelf: "center" }}>
          {streak}/10
        </span>
      </div>

      {/* Device card */}
      <div style={{
        background: flash === "correct" ? "#00ff8818"
          : flash === "wrong" ? "#ff446618" : "#050b15",
        border: `2px solid ${flash === "correct" ? C.success
          : flash === "wrong" ? C.error : C.border}`,
        borderRadius: 8, padding: "28px 20px",
        textAlign: "center", marginBottom: 20,
        transition: "all 0.2s",
      }}>
        <div style={{ color: C.textDim, fontSize: 11, letterSpacing: 3, marginBottom: 8 }}>
          DEVICE {qi + 1} OF 10
        </div>
        <div style={{
          color: C.accent, fontFamily: "Orbitron",
          fontSize: 22, fontWeight: 700, letterSpacing: 2,
        }}>{q.device}</div>
        {flash === "wrong" && (
          <div style={{ color: C.error, fontSize: 12, marginTop: 10 }}>
            ✗ Wrong — resetting to Q1...
          </div>
        )}
      </div>

      {/* Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {q.options.map(opt => (
          <button key={opt} onClick={() => pick(opt)} style={{
            padding: "12px 8px", borderRadius: 4, cursor: "pointer",
            background: "#070d1a", border: `1px solid ${C.border}`,
            color: C.text, fontFamily: "Share Tech Mono",
            fontSize: 14, transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}
          >{opt}</button>
        ))}
      </div>

      {attempts > 0 && !done && (
        <p style={{ color: "#2a4a6a", fontSize: 11, marginTop: 14 }}>
          Attempts: {attempts} — each reset starts from Device 1.
        </p>
      )}
      {done && <SuccessBanner msg={room.successMsg} />}
    </div>
  );
}

// ─── PUZZLE: imposter ─────────────────────────────────────
function ImposterPuzzle({ room, onSolve }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const pick = (id) => {
    if (result === "correct") return;
    setSelected(id);
    if (id === room.correctImposter) {
      setResult("correct");
      setTimeout(onSolve, 1500);
    } else {
      setResult("wrong");
      setTimeout(() => { setResult(null); setSelected(null); }, 1000);
    }
  };

  return (
    <div style={{ fontFamily: "Share Tech Mono" }}>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 14 }}>
        Click the entry that contains a factual error.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {room.entries.map((entry, idx) => {
          const isSel = selected === entry.id;
          const isCorrect = entry.id === room.correctImposter;
          return (
            <div key={entry.id} onClick={() => pick(entry.id)} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              padding: "13px 16px", borderRadius: 6, cursor: "pointer",
              background: isSel ? (isCorrect ? "#00ff8812" : "#ff446612") : "#050b15",
              border: `1px solid ${isSel ? (isCorrect ? C.success : C.error) : C.border}`,
              color: isSel ? (isCorrect ? C.success : C.error) : C.text,
              transition: "all 0.2s", lineHeight: 1.7, fontSize: 13,
            }}>
              <span style={{ color: C.accentDim, minWidth: 22, marginTop: 1 }}>
                [{String.fromCharCode(65 + idx)}]
              </span>
              <span>{entry.text}</span>
            </div>
          );
        })}
      </div>
      {result === "wrong" && <ErrorBanner msg="That entry is accurate. Keep looking." />}
      {result === "correct" && (
        <div className="fade-up" style={{
          marginTop: 14, padding: "12px 16px",
          background: "#00ff8811", border: `1px solid ${C.success}`,
          borderRadius: 4, color: C.success,
          fontFamily: "Share Tech Mono", fontSize: 13, lineHeight: 1.7,
        }}>
          ✓ Correct. {room.errorExplanation}
        </div>
      )}
    </div>
  );
}

// ─── PUZZLE: binary_decode ────────────────────────────────
function BinaryDecodePuzzle({ room, onSolve }) {
  const [inputs, setInputs] = useState(room.binaryWords.map(() => ""));
  const [result, setResult] = useState(null);
  const [shake, setShake] = useState(false);

  const setLetter = (i, val) => {
    const next = [...inputs];
    next[i] = val.toUpperCase().slice(0, 1);
    setInputs(next);
  };

  const check = () => {
    const word = inputs.join("");
    if (word === room.answer) {
      setResult("correct");
      setTimeout(onSolve, 1200);
    } else {
      setResult("wrong");
      setShake(true);
      setTimeout(() => { setShake(false); setResult(null); }, 600);
    }
  };

  return (
    <div style={{ fontFamily: "Share Tech Mono" }}>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        Convert each binary value to decimal, then find its ASCII letter. Enter one letter per box.
      </p>

      {/* Place value header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "30px repeat(8, 1fr) 60px 60px 60px",
        gap: 4, marginBottom: 8,
        color: C.textDim, fontSize: 10, textAlign: "center",
      }}>
        <div></div>
        {["128","64","32","16","8","4","2","1"].map(v => (
          <div key={v}>{v}</div>
        ))}
        <div>DEC</div>
        <div>ASCII</div>
        <div>LETTER</div>
      </div>

      {/* Rows */}
      {room.binaryWords.map((word, i) => (
        <div key={i} style={{
          display: "grid",
          gridTemplateColumns: "30px repeat(8, 1fr) 60px 60px 60px",
          gap: 4, marginBottom: 6, alignItems: "center",
        }}>
          <div style={{ color: C.accentDim, fontSize: 11 }}>{i + 1}.</div>
          {word.binary.split("").map((bit, bi) => (
            <div key={bi} style={{
              textAlign: "center", padding: "8px 4px",
              background: bit === "1" ? "#0a1f0a" : "#050b15",
              border: `1px solid ${bit === "1" ? "#1a4a1a" : C.border}`,
              borderRadius: 3,
              color: bit === "1" ? C.success : C.textDim,
              fontSize: 14, fontWeight: bit === "1" ? "bold" : "normal",
            }}>{bit}</div>
          ))}
          <div style={{
            textAlign: "center", color: C.textDim,
            fontSize: 12, padding: "8px 4px",
            background: "#050b15", borderRadius: 3,
            border: `1px solid ${C.border}`,
          }}>{word.decimal}</div>
          <div style={{
            textAlign: "center", color: C.accent,
            fontSize: 12, padding: "8px 4px",
            background: "#050b15", borderRadius: 3,
            border: `1px solid ${C.border}`,
          }}>{word.decimal}</div>
          <input
            value={inputs[i]}
            onChange={e => setLetter(i, e.target.value)}
            maxLength={1}
            placeholder="?"
            style={{
              textAlign: "center", padding: "6px 4px",
              background: "#0a1828",
              border: `1px solid ${result === "correct" && inputs[i] === word.letter ? C.success : C.border}`,
              color: C.accent, borderRadius: 3,
              fontFamily: "Share Tech Mono", fontSize: 15,
              outline: "none",
            }}
          />
        </div>
      ))}

      {/* Assembled word */}
      <div style={{
        display: "flex", gap: 8, marginTop: 18,
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: C.textDim, fontSize: 12, marginRight: 4 }}>DECODED WORD:</span>
        {inputs.map((l, i) => (
          <div key={i} style={{
            width: 40, height: 40,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: l ? "#0a1f10" : "#050b15",
            border: `2px solid ${l ? C.success : C.border}`,
            borderRadius: 4, color: C.success,
            fontFamily: "Orbitron", fontSize: 18, fontWeight: 700,
          }}>{l || ""}</div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <button onClick={check} className={shake ? "shake" : ""} style={{
          padding: "11px 32px", background: "#0a1828",
          border: `1px solid ${C.accent}`, color: C.accent,
          borderRadius: 4, cursor: "pointer",
          fontFamily: "Share Tech Mono", fontSize: 13,
          fontWeight: "bold", letterSpacing: 2,
        }}>SUBMIT WORD</button>
      </div>

      {result === "wrong" && <ErrorBanner msg="Incorrect word. Check your binary conversions." />}
      {result === "correct" && <SuccessBanner msg={room.successMsg} />}
    </div>
  );
}

// ─── PUZZLE: parity ──────────────────────────────────────
// ─── PUZZLE: parity_gauntlet ─────────────────────────────
function generateParityQuestion() {
  const parity = Math.random() > 0.5 ? "EVEN" : "ODD";
  const bits = Array.from({ length: 7 }, () => Math.random() > 0.5 ? 1 : 0);
  const count = bits.reduce((a, b) => a + b, 0);
  // randomly decide if parity bit is correct or not
  const makeCorrect = Math.random() > 0.5;
  let parityBit;
  if (parity === "EVEN") {
    const correctBit = count % 2 === 0 ? 0 : 1;
    parityBit = makeCorrect ? correctBit : (correctBit === 0 ? 1 : 0);
  } else {
    const correctBit = count % 2 === 1 ? 0 : 1;
    parityBit = makeCorrect ? correctBit : (correctBit === 0 ? 1 : 0);
  }
  const isCorrect = makeCorrect;
  return { bits, parityBit, parity, isCorrect };
}

function ParityGauntletPuzzle({ room, onSolve }) {
  const TOTAL = 5;
  const TIME_LIMIT = 5;

  const [streak, setStreak] = useState(0);
  const [q, setQ] = useState(() => generateParityQuestion());
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [swapPos, setSwapPos] = useState(false);
  const [swapColor, setSwapColor] = useState(false);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);
  const streakRef = useRef(0);

  const nextQuestion = (resetStreak = false) => {
    if (resetStreak) {
      streakRef.current = 0;
      setStreak(0);
    }
    setQ(generateParityQuestion());
    setTimeLeft(TIME_LIMIT);
    setFeedback(null);
    setSwapPos(Math.random() > 0.6);
    setSwapColor(Math.random() > 0.6);
  };

  useEffect(() => {
    if (feedback || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setFeedback("timeout");
          setAttempts(a => a + 1);
          setTimeout(() => nextQuestion(true), 1000);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [q, feedback, finished]);

  const answer = (userSaysCorrect) => {
    if (feedback || finished) return;
    clearInterval(timerRef.current);
    const right = userSaysCorrect === q.isCorrect;
    if (right) {
      const newStreak = streakRef.current + 1;
      streakRef.current = newStreak;
      setStreak(newStreak);
      setFeedback("correct");
      if (newStreak >= TOTAL) {
        setFinished(true);
        onSolve();
      } else {
        setTimeout(() => nextQuestion(false), 700);
      }
    } else {
      setFeedback("wrong");
      setAttempts(a => a + 1);
      setTimeout(() => nextQuestion(true), 900);
    }
  };

  const leftLabel = swapPos ? "INCORRECT" : "CORRECT";
  const rightLabel = swapPos ? "CORRECT" : "INCORRECT";
  const leftAction = !swapPos;
  const rightAction = swapPos;

  const correctColor = "#00ff88";
  const wrongColor = "#ff4466";
  const leftColor = swapColor
    ? (swapPos ? correctColor : wrongColor)
    : (swapPos ? wrongColor : correctColor);
  const rightColor = swapColor
    ? (swapPos ? wrongColor : correctColor)
    : (swapPos ? correctColor : wrongColor);

  const timerPct = (timeLeft / TIME_LIMIT) * 100;
  const timerColor = timeLeft > 2 ? C.success : C.error;

  return (
    <div style={{ fontFamily: "Share Tech Mono" }}>
      {/* Streak dots + attempts */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: TOTAL }, (_, i) => (
            <div key={i} style={{
              width: 22, height: 8, borderRadius: 2,
              background: i < streak ? C.success : C.border,
              boxShadow: i < streak ? `0 0 6px ${C.success}` : "none",
              transition: "all 0.3s",
            }} />
          ))}
          <span style={{ color: C.textDim, fontSize: 11, marginLeft: 8, alignSelf: "center" }}>
            {streak}/{TOTAL} streak
          </span>
        </div>
        {attempts > 0 && (
          <span style={{ color: "#2a3a6a", fontSize: 11 }}>
            Resets: {attempts}
          </span>
        )}
      </div>

      {/* Timer bar */}
      <div style={{ background: "#050b15", borderRadius: 4, height: 6, marginBottom: 16, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4,
          width: `${timerPct}%`,
          background: timerColor,
          boxShadow: `0 0 6px ${timerColor}`,
          transition: "width 1s linear, background 0.3s",
        }} />
      </div>

      {/* Parity rule */}
      <div style={{
        background: "#050b15", border: `1px solid ${C.border}`,
        borderRadius: 6, padding: "10px 16px", marginBottom: 14,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ color: C.textDim, fontSize: 11 }}>PARITY RULE THIS ROUND:</span>
        <span style={{
          color: q.parity === "EVEN" ? C.accent : "#ffcc00",
          fontFamily: "Orbitron", fontSize: 14, fontWeight: 700, letterSpacing: 2,
        }}>{q.parity} PARITY</span>
      </div>

      {/* Bit display */}
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 6 }}>
        {q.bits.map((bit, i) => (
          <div key={i} style={{
            width: 36, height: 40,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 4, fontSize: 20, fontWeight: "bold",
            background: bit === 1 ? "#0a1f0a" : "#050b15",
            border: `1px solid ${bit === 1 ? "#1a4a1a" : C.border}`,
            color: bit === 1 ? C.success : "#2a4a6a",
          }}>{bit}</div>
        ))}
        <div style={{ width: 4, alignSelf: "stretch", background: C.border, borderRadius: 2, margin: "0 4px" }} />
        <div style={{
          width: 36, height: 40,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 4, fontSize: 20, fontWeight: "bold",
          background: q.parityBit === 1 ? "#1a0a1a" : "#050b15",
          border: `2px solid ${q.parityBit === 1 ? "#3a1a3a" : C.border}`,
          color: q.parityBit === 1 ? "#cc88ff" : "#2a4a6a",
        }}>{q.parityBit}</div>
      </div>
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 20 }}>
        {q.bits.map((_, i) => (
          <div key={i} style={{ width: 36, textAlign: "center", color: "#1a3a5a", fontSize: 9 }}>DATA</div>
        ))}
        <div style={{ width: 4, margin: "0 4px" }} />
        <div style={{ width: 36, textAlign: "center", color: "#3a1a5a", fontSize: 9 }}>P</div>
      </div>

      {/* Buttons */}
      {!finished && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <button onClick={() => answer(leftAction)} style={{
            padding: "16px", borderRadius: 6, cursor: "pointer",
            background: leftColor + "22", border: `2px solid ${leftColor}`,
            color: leftColor, fontFamily: "Orbitron", fontWeight: 700,
            fontSize: 14, letterSpacing: 2, transition: "all 0.15s",
            boxShadow: `0 0 12px ${leftColor}33`,
          }}>{leftLabel}</button>
          <button onClick={() => answer(rightAction)} style={{
            padding: "16px", borderRadius: 6, cursor: "pointer",
            background: rightColor + "22", border: `2px solid ${rightColor}`,
            color: rightColor, fontFamily: "Orbitron", fontWeight: 700,
            fontSize: 14, letterSpacing: 2, transition: "all 0.15s",
            boxShadow: `0 0 12px ${rightColor}33`,
          }}>{rightLabel}</button>
        </div>
      )}

      {feedback === "correct" && !finished && (
        <div className="fade-up" style={{
          marginTop: 12, padding: "10px 14px",
          background: "#00ff8811", border: `1px solid ${C.success}`,
          borderRadius: 4, color: C.success, fontSize: 13,
        }}>✓ Correct! Keep going.</div>
      )}
      {feedback === "wrong" && (
        <div style={{
          marginTop: 12, padding: "10px 14px",
          background: "#ff446611", border: `1px solid ${C.error}`,
          borderRadius: 4, color: C.error, fontSize: 13,
        }}>✗ Wrong — streak reset.</div>
      )}
      {feedback === "timeout" && (
        <div style={{
          marginTop: 12, padding: "10px 14px",
          background: "#ff446611", border: `1px solid ${C.error}`,
          borderRadius: 4, color: C.error, fontSize: 13,
        }}>⏱ Too slow — streak reset.</div>
      )}
      {finished && <SuccessBanner msg={room.successMsg} />}
    </div>
  );
}


// ─── PUZZLE: logic ────────────────────────────────────────
function LogicPuzzle({ room, onSolve }) {
  const [vals, setVals] = useState({ A: false, B: false, C: false });
  const g1 = vals.A && vals.B;
  const g2 = vals.B || vals.C;
  const g3 = !vals.C;
  const all = g1 && g2 && g3;

  useEffect(() => { if (all) onSolve(); }, [all]);

  const Led = ({ on }) => (
    <span style={{
      display: "inline-block", width: 12, height: 12, borderRadius: "50%",
      background: on ? C.success : "#0a1020",
      boxShadow: on ? `0 0 8px ${C.success}` : "none",
      border: `1px solid ${on ? C.success : C.border}`,
      verticalAlign: "middle", marginRight: 6,
      transition: "all 0.2s",
    }} />
  );

  return (
    <div style={{ fontFamily: "Share Tech Mono" }}>
      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        Toggle inputs A, B, C. Make ALL three gate outputs TRUE.
      </p>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {["A", "B", "C"].map(k => (
          <button key={k} onClick={() => setVals(v => ({ ...v, [k]: !v[k] }))} style={{
            padding: "10px 24px", borderRadius: 4,
            background: vals[k] ? "#00ff8818" : "#070d1a",
            border: `1px solid ${vals[k] ? C.success : C.border}`,
            color: vals[k] ? C.success : C.textDim,
            cursor: "pointer", fontFamily: "Share Tech Mono",
            fontSize: 15, fontWeight: "bold", transition: "all 0.2s",
          }}>{k}: {vals[k] ? "TRUE" : "FALSE"}</button>
        ))}
      </div>
      {[
        { lbl: "Gate 1: A AND B", out: g1 },
        { lbl: "Gate 2: B OR C",  out: g2 },
        { lbl: "Gate 3: NOT C",   out: g3 },
      ].map(({ lbl, out }) => (
        <div key={lbl} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 14px", marginBottom: 7, borderRadius: 4,
          background: "#050b15",
          border: `1px solid ${out ? C.success + "55" : C.border}`,
          transition: "all 0.2s",
        }}>
          <Led on={out} />
          <span style={{ color: out ? C.success : C.textDim, fontSize: 13 }}>{lbl}</span>
          <span style={{ marginLeft: "auto", color: out ? C.success : C.error, fontSize: 12 }}>
            {out ? "TRUE ✓" : "FALSE"}
          </span>
        </div>
      ))}
      {all && <SuccessBanner msg={room.successMsg} />}
    </div>
  );
}

// ─── PUZZLE: type_debug ───────────────────────────────────
function TypeDebugPuzzle({ room, onSolve }) {
  const [selected, setSelected] = useState(null);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState("select");
  const [result, setResult] = useState(null);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  const nonClickable = ["{", "}", "else"];

  const pickLine = (id) => {
    if (nonClickable.includes(room.code.find(l => l.id === id)?.text.trim())) return;
    setSelected(id);
    setPhase("type");
    setTyped("");
    setResult(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const checkTyped = () => {
    if (selected !== room.bugLine) {
      setResult("wrong_line");
      setShake(true);
      setTimeout(() => { setShake(false); setResult(null); setPhase("select"); setSelected(null); }, 1200);
      return;
    }
    const normalize = s => s.trim().split(/[ \t]+/).join(" ");
    const correct = "if (score >= passMark)";
    if (normalize(typed) === normalize(correct)) {
      setResult("correct");
      setTimeout(onSolve, 1000);
    } else {
      setResult("wrong_type");
      setShake(true);
      setTimeout(() => { setShake(false); setResult(null); }, 800);
    }
  };

  return (
    <div style={{ fontFamily: "Share Tech Mono" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{
          flex: 1, padding: "10px 14px",
          background: "#050b15", border: `1px solid ${C.border}`, borderRadius: 4,
        }}>
          <div style={{ color: C.textDim, fontSize: 10, letterSpacing: 3, marginBottom: 4 }}>EXPECTED</div>
          <div style={{ color: C.success, fontSize: 13 }}>Access Granted</div>
        </div>
        <div style={{
          flex: 1, padding: "10px 14px",
          background: "#150505", border: `1px solid ${C.error}44`, borderRadius: 4,
        }}>
          <div style={{ color: "#6a2a2a", fontSize: 10, letterSpacing: 3, marginBottom: 4 }}>ACTUAL</div>
          <div style={{ color: C.error, fontSize: 13 }}>Access Denied</div>
        </div>
      </div>

      <p style={{ color: C.textDim, fontSize: 12, marginBottom: 10 }}>
        {phase === "select"
          ? "Step 1: Click the line containing the bug."
          : "Step 2: Type the corrected version of that line."}
      </p>

      <div style={{
        background: "#050b15", border: `1px solid ${C.border}`,
        borderRadius: 6, overflow: "hidden", marginBottom: 14,
      }}>
        {room.code.map(line => {
          const isSel = selected === line.id;
          const isNC = nonClickable.includes(line.text.trim());
          return (
            <div key={line.id}
              onClick={() => phase === "select" && !isNC && pickLine(line.id)}
              style={{
                display: "flex", gap: 0,
                cursor: phase === "select" && !isNC ? "pointer" : "default",
                background: isSel ? "#0a1828" : "transparent",
                borderLeft: `3px solid ${isSel ? C.accent : "transparent"}`,
                transition: "all 0.15s",
              }}>
              <div style={{
                padding: "7px 14px", minWidth: 40, textAlign: "right",
                color: "#1a3a5a", fontSize: 12, userSelect: "none",
                borderRight: `1px solid ${C.border}`, background: "#040810",
              }}>{line.line}</div>
              <div style={{
                padding: "7px 16px", flex: 1,
                color: isSel ? C.accent : isNC ? "#2a4a6a" : C.text,
                fontSize: 13, lineHeight: 1.6,
              }}>{line.text}</div>
            </div>
          );
        })}
      </div>

      {phase === "type" && (
        <div>
          <p style={{ color: C.textDim, fontSize: 11, marginBottom: 8 }}>
            Type the corrected version of line {room.code.find(l => l.id === selected)?.line}:
          </p>
          <div style={{ display: "flex", gap: 10 }} className={shake ? "shake" : ""}>
            <input ref={inputRef} value={typed}
              onChange={e => setTyped(e.target.value)}
              onKeyDown={e => e.key === "Enter" && checkTyped()}
              placeholder="Type the corrected line..."
              style={{
                flex: 1, padding: "11px 14px", background: "#070d1a",
                border: `1px solid ${result === "correct" ? C.success : result?.startsWith("wrong") ? C.error : C.border}`,
                color: C.accent, borderRadius: 4,
                fontFamily: "Share Tech Mono", fontSize: 13, outline: "none",
              }} />
            <button onClick={checkTyped} style={{
              padding: "11px 20px", background: "#0a1828",
              border: `1px solid ${C.accent}`, color: C.accent,
              borderRadius: 4, cursor: "pointer",
              fontFamily: "Share Tech Mono", fontSize: 13, fontWeight: "bold",
            }}>CHECK</button>
          </div>
          <button onClick={() => { setPhase("select"); setSelected(null); setResult(null); }}
            style={{
              marginTop: 8, background: "none", border: "none",
              color: C.textDim, cursor: "pointer",
              fontFamily: "Share Tech Mono", fontSize: 11,
            }}>← Pick a different line</button>
        </div>
      )}

      {result === "wrong_line" && <ErrorBanner msg="That line is not the bug. Pick again." />}
      {result === "wrong_type" && <ErrorBanner msg="Not quite. Check your operators carefully." />}
      {result === "correct" && (
        <div className="fade-up" style={{
          marginTop: 14, padding: "12px 16px",
          background: "#00ff8811", border: `1px solid ${C.success}`,
          borderRadius: 4, color: C.success,
          fontSize: 13, lineHeight: 1.7,
        }}>✓ {room.errorExplanation}</div>
      )}
    </div>
  );
}

// ─── ROOM WRAPPER ─────────────────────────────────────────
function Room({ room, onComplete, roomNum, total, elapsed }) {

  const renderPuzzle = () => {
    switch (room.type) {
      case "detective":     return <DetectivePuzzle room={room} onSolve={onComplete} />;
      case "gauntlet":      return <GauntletPuzzle room={room} onSolve={onComplete} />;
      case "imposter":      return <ImposterPuzzle room={room} onSolve={onComplete} />;
      case "fde_chase":     return <FDEChasePuzzle room={room} onSolve={onComplete} />;
      case "binary_decode": return <BinaryDecodePuzzle room={room} onSolve={onComplete} />;
      case "parity_gauntlet": return <ParityGauntletPuzzle room={room} onSolve={onComplete} />;
      case "parity":        return <ParityGauntletPuzzle room={room} onSolve={onComplete} />;
      case "logic":         return <LogicPuzzle room={room} onSolve={onComplete} />;
      case "type_debug":    return <TypeDebugPuzzle room={room} onSolve={onComplete} />;
      case "debug":         return <TypeDebugPuzzle room={room} onSolve={onComplete} />;
      default: return null;
    }
  };

  return (
    <div className="flicker" style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px 16px", fontFamily: "Share Tech Mono",
    }}>
      <div className="scanlines" />
      <div className="pulse-glow" style={{
        maxWidth: 720, width: "100%", position: "relative", zIndex: 1,
        border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden",
      }}>
        <RoomHeader section={room.section} sectionTitle={room.sectionTitle}
          roomNum={roomNum} total={total} elapsed={elapsed} />

        {/* Title bar */}
        <div style={{
          background: "#060c18", padding: "24px 28px 18px",
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              fontSize: 18, fontWeight: "bold", fontFamily: "Orbitron",
              color: C.accent,
              border: `1px solid ${C.accentDim}`,
              padding: "10px 16px", borderRadius: 4,
              background: "#0a1828", minWidth: 60, textAlign: "center",
              boxShadow: `0 0 12px ${C.accentDim}`,
            }}>{room.icon}</div>
            <div>
              <h2 style={{
                fontFamily: "Orbitron", fontSize: 17,
                color: C.accent, letterSpacing: 2, marginBottom: 4,
              }}>{room.title}</h2>
              <div style={{ color: C.textDim, fontSize: 10, letterSpacing: 4 }}>
                {"━".repeat(30)}
              </div>
            </div>
          </div>
          <p style={{ color: "#5a8aaa", fontSize: 13, lineHeight: 1.8, marginTop: 14 }}>
            {room.flavor}
          </p>
        </div>

        {/* Puzzle area */}
        <div style={{ padding: "24px 28px", background: C.panel }}>
          {renderPuzzle()}

          <HintToggle hint={room.hint} />
        </div>
      </div>
    </div>
  );
}

// ─── ENTRY SCREEN ─────────────────────────────────────────
function NameEntry({ onStart }) {
  const [team, setTeam] = useState("");

  const go = () => {
    if (!team.trim()) return;
    onStart(team.trim());
  };

  const sections = [
    "01 Intro to Computers", "02 Components",
    "03 Microarchitecture",  "04 FDE Cycle",
    "05 Data & Comms",       "06 Transmission",
    "07 Boolean & Algo",     "08 C# Programming",
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Share Tech Mono", padding: 20,
    }}>
      <div className="scanlines" />
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 6, marginBottom: 20 }}>
          MATI // FUNDAMENTALS OF COMPUTING // END OF SEMESTER
        </div>

        {/* V.E.R. title */}
        <div style={{
          fontFamily: "Orbitron", fontSize: 64, fontWeight: 900,
          color: C.accent, textShadow: `0 0 40px ${C.accentDim}`,
          lineHeight: 1, marginBottom: 4, letterSpacing: 8,
        }}>V.E.R.</div>
        <div style={{
          color: C.textDim, fontSize: 11, letterSpacing: 4, marginBottom: 6,
        }}>VIRTUAL ENCRYPTED ROOMS</div>
        <div style={{ color: "#1a3a6a", fontSize: 11, letterSpacing: 3, marginBottom: 28 }}>
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        </div>

        {/* Section grid — 8 rooms only, no boss mentioned */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 6, marginBottom: 28, textAlign: "left",
        }}>
          {sections.map(s => (
            <div key={s} style={{
              padding: "7px 12px", borderRadius: 3,
              background: "#050b15", border: `1px solid ${C.border}`,
              color: C.textDim, fontSize: 11,
            }}>{s}</div>
          ))}
        </div>

        {/* Team name input */}
        <input
          value={team}
          onChange={e => setTeam(e.target.value)}
          onKeyDown={e => e.key === "Enter" && go()}
          placeholder="Enter your team name..."
          style={{
            width: "100%", padding: "13px 16px",
            background: "#070d1a",
            border: `1px solid ${C.border}`,
            color: C.accent, borderRadius: 4,
            fontFamily: "Share Tech Mono", fontSize: 15,
            outline: "none", textAlign: "center",
            marginBottom: 16,
          }}
        />

        <button onClick={go} style={{
          padding: "14px 52px", background: "#060e1a",
          border: `2px solid ${C.accent}`, color: C.accent,
          borderRadius: 4, cursor: "pointer",
          fontFamily: "Orbitron", fontSize: 14, fontWeight: 700,
          letterSpacing: 4, boxShadow: `0 0 24px ${C.accentDim}`,
        }}>INITIATE SEQUENCE</button>

        <p style={{ color: C.textDim, fontSize: 11, marginTop: 18, lineHeight: 1.8 }}>
          8 encrypted rooms · one per section covered in class<br />
          Multiple teams can play simultaneously on separate devices
        </p>
      </div>
    </div>
  );
}

// ─── WIN SCREEN ───────────────────────────────────────────
function Win({ time, teamName }) {
  const m = Math.floor(time / 60), s = time % 60;
  const [showCard, setShowCard] = useState(false);
  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Share Tech Mono", padding: 20, textAlign: "center",
    }}>
      <div className="scanlines" />
      <div className="fade-up" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🏆</div>
        <div style={{
          fontFamily: "Orbitron", fontSize: 28, color: C.success,
          letterSpacing: 2, marginBottom: 4,
        }}>SYSTEM RESTORED</div>
        <div style={{
          color: "#ffd700", fontFamily: "Orbitron",
          fontSize: 12, letterSpacing: 3, marginBottom: 20,
        }}>✦ SYNTAX BADGE HOLDER ✦</div>
        <div style={{ color: "#ffaa66", fontSize: 16, marginBottom: 6 }}>
          ⚡ {teamName} defeated Gym Leader Ver! ⚡
        </div>
        <p style={{ color: "#5a9a7a", fontSize: 13, lineHeight: 2, marginBottom: 20 }}>
          All 9 rooms cleared.<br />
          Ver tips his tie. He says nothing. He is proud.<br />
          Probably.
        </p>
        <div style={{
          display: "inline-block", padding: "14px 36px",
          background: "#0a1828", border: `1px solid ${C.success}`,
          borderRadius: 4, marginBottom: 24,
        }}>
          <div style={{ color: C.textDim, fontSize: 10, letterSpacing: 4 }}>COMPLETION TIME</div>
          <div style={{
            color: C.success, fontFamily: "Orbitron",
            fontSize: 34, fontWeight: 900,
          }}>{m}m {s.toString().padStart(2, "0")}s</div>
        </div>

        <div>
          <button onClick={() => setShowCard(!showCard)} style={{
            padding: "12px 32px",
            background: "linear-gradient(135deg, #1a1000, #2a1a00)",
            border: "2px solid #ffd700", color: "#ffd700",
            borderRadius: 6, cursor: "pointer",
            fontFamily: "Orbitron", fontWeight: 700,
            fontSize: 12, letterSpacing: 3,
            boxShadow: "0 0 20px #ffd70044",
            marginBottom: 16, display: "block", margin: "0 auto 16px",
          }}>{showCard ? "HIDE BADGE" : "CLAIM YOUR SYNTAX BADGE 🏅"}</button>

          {showCard && (
            <div className="fade-up" style={{ marginTop: 16 }}>
              <img src="./syntax-badge.png" alt="Syntax Badge"
                style={{
                  maxWidth: 300, width: "100%", borderRadius: 14,
                  boxShadow: "0 0 40px #ffd70055, 0 0 80px #00d4ff22",
                  border: "3px solid #ffd70066",
                  animation: "holographic 3s ease-in-out infinite",
                }} />
              <style>{`
                @keyframes holographic {
                  0%,100%{filter:hue-rotate(0deg) brightness(1)}
                  33%{filter:hue-rotate(10deg) brightness(1.06)}
                  66%{filter:hue-rotate(-10deg) brightness(1.08)}
                }
              `}</style>
              <p style={{ color: "#3a6a9a", fontSize: 11, marginTop: 10, letterSpacing: 2 }}>
                Screenshot this. It's your proof. 📸
              </p>
            </div>
          )}
        </div>

        <p style={{ color: "#2a5a4a", fontSize: 11, letterSpacing: 2, marginTop: 24 }}>
          V.E.R. // VIRTUAL ENCRYPTED ROOMS // MATI DXB
        </p>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────
export default function App() {
  const [stage, setStage] = useState("name");
  const [roomIdx, setRoomIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [teamName, setTeamName] = useState("");
  const timer = useRef(null);

  const start = (team) => {
    setTeamName(team);
    setStage("playing"); setRoomIdx(0); setElapsed(0);
    timer.current = setInterval(() => setElapsed(e => e + 1), 1000);
  };

  const next = useCallback(() => {
    if (roomIdx + 1 >= ROOMS.length) {
      clearInterval(timer.current);
      setStage("win");
    } else {
      setRoomIdx(i => i + 1);
    }
  }, [roomIdx]);

  if (stage === "name") return <NameEntry onStart={start} />;
  if (stage === "win") return <Win time={elapsed} teamName={teamName} />;

  const currentRoom = ROOMS[roomIdx];
  if (currentRoom.type === "boss") {
    return <BossRoom onSolve={next} teamName={teamName} />;
  }

  return (
    <Room key={roomIdx} room={currentRoom} onComplete={next}
      roomNum={roomIdx + 1} total={ROOMS.length} elapsed={elapsed} />
  );
}

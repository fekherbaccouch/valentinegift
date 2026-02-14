import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flower2, Heart, Sparkles, Star } from "lucide-react";

const SETTINGS = {
  name: "Amore",
  date: "14 February 2026",
};

const LETTER = {
  intro: "My Love,",
  title: "Happy Valentine’s Day, my heart. ❤️",
  paragraphs: [
    "Even with all these miles between us, I feel you in everything I do. I miss your voice, the way you say my name, the warmth of your hugs I can only imagine for now. Some nights I close my eyes and picture us together, and it’s that thought that makes the distance easier to bear.",
    "Being apart isn’t easy, but loving you is. I would choose you in every city, every country, every lifetime. You are worth every second of waiting, every countdown, every “goodnight” through a screen.",
    "One day, this distance will end — and when I finally hold you, I swear I’ll never want to let go.",
    "Until then, you have my whole heart. Always. 💕",
  ],
  signoff: "Forever yours,",
  signature: "Jasmine",
};

const BUBU_DUDU_SRC = "/bubu-dudu.jpg";
const ROSE_BOUQUET_SRC = "/rose-bouquet.jpg";
const HAND_FONT = "'Times New Roman', 'Garamond', serif";

const makeHearts = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: `h-${i}-${Math.random().toString(36).slice(2, 8)}`,
    left: `${Math.random() * 100}%`,
    size: 8 + Math.random() * 24,
    delay: `${Math.random() * 4}s`,
    duration: `${5 + Math.random() * 8}s`,
  }));

const makeSparkles = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: `s-${i}-${Math.random().toString(36).slice(2, 8)}`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 5 + Math.random() * 10,
    delay: `${Math.random() * 3}s`,
    duration: `${2 + Math.random() * 2.5}s`,
  }));

const stepMotion = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.985 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

export default function App() {
  const [step, setStep] = useState(1);
  const [suspense, setSuspense] = useState("");
  const [burstOn, setBurstOn] = useState(false);
  const [revealedWords, setRevealedWords] = useState(0);
  const [replyText, setReplyText] = useState("");
  const [sentReply, setSentReply] = useState("");

  const hearts = useMemo(() => makeHearts(64), []);
  const sparkles = useMemo(() => makeSparkles(34), []);
  const burstHearts = useMemo(() => makeHearts(76), []);

  const nextStep = (to, message, delay) => {
    setSuspense(message);
    setTimeout(() => {
      setStep(to);
      setSuspense("");
    }, delay);
  };

  const onYes = () => {
    setBurstOn(true);
    nextStep(2, "A little vintage letter for you...", 1700);
    setTimeout(() => setBurstOn(false), 2400);
  };

  const sendReply = () => {
    const t = replyText.trim();
    if (!t) return;
    setSentReply(t);
    setReplyText("");
  };

  const letterAllWords = useMemo(
    () => [LETTER.title, ...LETTER.paragraphs].join(" ").split(" "),
    []
  );

  useEffect(() => {
    if (step !== 2) return;
    const revealDurationMs = letterAllWords.length * 140;
    const timer = setTimeout(
      () => nextStep(3, "Now flowers and love...", 1500),
      revealDurationMs + 5000
    );
    return () => clearTimeout(timer);
  }, [step, letterAllWords.length]);

  useEffect(() => {
    if (step !== 2) return;
    setRevealedWords(0);
    const t = setInterval(() => {
      setRevealedWords((v) => {
        if (v >= letterAllWords.length) {
          clearInterval(t);
          return v;
        }
        return v + 1;
      });
    }, 140);
    return () => clearInterval(t);
  }, [step, letterAllWords.length]);

  const buildVisibleParagraphs = () => {
    let used = 0;
    const all = [LETTER.title, ...LETTER.paragraphs];
    return all.map((para) => {
      const words = para.split(" ");
      const remaining = Math.max(0, revealedWords - used);
      const take = Math.min(words.length, remaining);
      used += words.length;
      return words.slice(0, take).join(" ");
    });
  };

  const visibleParagraphs = buildVisibleParagraphs();

  const styles = {
    page: {
      minHeight: "100vh",
      position: "relative",
      overflowX: "hidden",
      background:
        "radial-gradient(1200px 700px at -25% -20%, rgba(255,255,255,0.45), transparent), radial-gradient(1200px 700px at 125% 130%, rgba(255,220,220,0.52), transparent), linear-gradient(145deg, #f8d1d1 0%, #e99d9d 55%, #de8c8c 100%)",
      color: "#4f1f1f",
      fontFamily: HAND_FONT,
    },
    floating: {
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 0,
      overflow: "hidden",
    },
    shell: {
      maxWidth: 1200,
      margin: "0 auto",
      minHeight: "100vh",
      position: "relative",
      zIndex: 2,
      padding: "18px",
      boxSizing: "border-box",
      display: "grid",
      placeItems: "center",
    },
    card: {
      width: "100%",
      minHeight: "88vh",
      borderRadius: 30,
      border: "4px double #b27455",
      outline: "2px dashed rgba(210, 156, 128, 0.9)",
      outlineOffset: "-14px",
      background:
        "linear-gradient(180deg, rgba(254,247,235,0.96), rgba(243,228,203,0.92)), repeating-linear-gradient(0deg, rgba(139,98,67,0.14) 0px, rgba(139,98,67,0.14) 1px, transparent 1px, transparent 35px)",
      boxShadow: "0 26px 52px rgba(100, 42, 26, 0.2)",
      position: "relative",
      overflow: "hidden",
      padding: "30px 22px",
      boxSizing: "border-box",
    },
    thread: {
      position: "absolute",
      top: 22,
      left: 18,
      right: 18,
      height: 2,
      background: "rgba(130, 64, 64, 0.32)",
      pointerEvents: "none",
    },
    heartsLine: {
      position: "absolute",
      top: 10,
      left: 18,
      right: 18,
      display: "flex",
      justifyContent: "space-between",
      color: "#bb2d2d",
      pointerEvents: "none",
    },
    inner: {
      width: "100%",
      maxWidth: 980,
      margin: "38px auto 0",
    },
    bigTitle: {
      textAlign: "center",
      margin: "0 0 10px",
      color: "#8f1f1f",
      fontSize: "clamp(2.4rem, 6.2vw, 5rem)",
      fontWeight: 800,
      letterSpacing: "0.02em",
      fontFamily: HAND_FONT,
      animation: "heartBeat 1.7s ease-in-out infinite",
    },
    subtitle: {
      textAlign: "center",
      margin: "0 0 18px",
      color: "#7c3e3e",
      fontSize: "1.2rem",
      fontWeight: 700,
      fontFamily: HAND_FONT,
    },
    bubuBigWrap: {
      margin: "0 auto 14px",
      width: "min(430px, 92%)",
      borderRadius: 22,
      border: "2px solid #d8a588",
      background: "rgba(255,250,245,0.94)",
      boxShadow: "0 12px 22px rgba(100, 42, 26, 0.16)",
      padding: 10,
      textAlign: "center",
      animation: "softPop 2.5s ease-in-out infinite",
    },
    bubuBigImg: {
      width: "100%",
      maxHeight: 340,
      objectFit: "contain",
      display: "block",
      margin: "0 auto",
      borderRadius: 14,
    },
    bubuFallback: {
      fontSize: "2rem",
      fontFamily: HAND_FONT,
      color: "#8f2d2d",
      padding: "16px 6px",
    },
    yesNoWrap: {
      borderRadius: 20,
      border: "2px solid #d9ab90",
      background: "rgba(255, 247, 236, 0.86)",
      boxShadow: "0 14px 24px rgba(102, 41, 26, 0.1)",
      padding: "18px",
      minHeight: 360,
      position: "relative",
      overflow: "hidden",
    },
    clickHere: {
      margin: "16px auto 0",
      width: "fit-content",
      border: "none",
      borderRadius: 999,
      cursor: "pointer",
      padding: "16px 30px",
      color: "#fff",
      fontWeight: 900,
      fontSize: "clamp(1.4rem, 3.8vw, 2.1rem)",
      letterSpacing: "0.5px",
      fontFamily: HAND_FONT,
      background: "linear-gradient(135deg, #c81515, #ff6d6d)",
      boxShadow: "0 18px 30px rgba(200,21,21,0.35)",
      animation: "shakeCute 1.6s ease-in-out infinite, pulseGlow 1.8s ease-in-out infinite",
      transition: "transform .25s ease, box-shadow .25s ease",
      display: "block",
    },
    loveStickers: {
      marginTop: 16,
      display: "flex",
      justifyContent: "center",
      gap: 10,
      flexWrap: "wrap",
    },
    sticker: {
      borderRadius: 999,
      border: "1px solid #d9ab90",
      background: "rgba(255,250,245,0.92)",
      color: "#7d2f2f",
      padding: "8px 12px",
      fontWeight: 800,
      fontSize: "1rem",
      fontFamily: HAND_FONT,
      animation: "softPop 2.8s ease-in-out infinite",
    },
    letterPaper: {
      margin: "6px auto 0",
      width: "min(860px, 100%)",
      borderRadius: 20,
      border: "10px solid transparent",
      background:
        "linear-gradient(180deg, rgba(250,242,226,0.98), rgba(242,227,198,0.95)) padding-box, repeating-linear-gradient(45deg, #c82929 0 8px, #ff8b8b 8px 16px) border-box, repeating-linear-gradient(0deg, rgba(146,106,75,0.14) 0px, rgba(146,106,75,0.14) 1px, transparent 1px, transparent 35px)",
      boxShadow: "0 18px 38px rgba(100, 58, 34, 0.2)",
      padding: "26px 22px",
      boxSizing: "border-box",
      animation: "paperFloat 4.5s ease-in-out infinite",
    },
    letterTitle: {
      margin: "0 0 10px",
      color: "#6f3a20",
      textAlign: "center",
      fontSize: "clamp(2rem, 5vw, 3.4rem)",
      fontWeight: 800,
      fontFamily: HAND_FONT,
      letterSpacing: "0.03em",
    },
    date: { margin: "0 0 8px", textAlign: "right", color: "#7e4f33", fontSize: "1rem", fontFamily: HAND_FONT },
    intro: { margin: "0 0 8px", color: "#6f3a20", fontSize: "1.3rem", fontWeight: 700, fontFamily: HAND_FONT },
    p: { margin: "0 0 10px", lineHeight: 1.9, fontSize: "1.16rem", color: "#5f3b2b", fontFamily: HAND_FONT },
    sign: { marginTop: 16, lineHeight: 1.75, fontSize: "1.1rem", color: "#5f3b2b", fontFamily: HAND_FONT },
    sig: { display: "inline-block", marginTop: 4, color: "#6c2f1a", fontWeight: 800, fontSize: "1.2rem", fontFamily: HAND_FONT },
    bouquetBigWrap: {
      margin: "0 auto 14px",
      width: "min(420px, 92%)",
      borderRadius: 22,
      border: "2px solid #d8a588",
      background: "rgba(255,250,245,0.94)",
      boxShadow: "0 12px 22px rgba(100, 42, 26, 0.16)",
      padding: 10,
      textAlign: "center",
    },
    bouquetImg: {
      width: "100%",
      maxHeight: 360,
      objectFit: "contain",
      display: "block",
      margin: "0 auto",
      borderRadius: 14,
    },
    flowersWrap: {
      textAlign: "center",
      marginBottom: 8,
    },
    flowersTitle: {
      margin: "0 0 10px",
      color: "#7a2c2c",
      fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
      fontWeight: 800,
      fontFamily: HAND_FONT,
    },
    flowerPillRow: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      justifyContent: "center",
      marginBottom: 12,
    },
    flowerPill: {
      borderRadius: 999,
      padding: "8px 12px",
      border: "1px solid #d9ab90",
      background: "rgba(255,250,245,0.9)",
      color: "#7a2c2c",
      fontWeight: 700,
      fontSize: "0.95rem",
      fontFamily: HAND_FONT,
    },
    suspense: {
      position: "absolute",
      inset: 0,
      zIndex: 20,
      display: "grid",
      placeItems: "center",
      background: "radial-gradient(circle at center, rgba(130,0,0,0.24), rgba(25,0,0,0.78))",
      color: "#fff",
      fontWeight: 700,
      fontSize: "clamp(1.1rem, 3vw, 1.7rem)",
      textShadow: "0 0 14px rgba(255,255,255,0.35)",
      animation: "fadeIn .25s ease, pulseText .95s ease-in-out infinite",
      fontFamily: HAND_FONT,
    },
    replyWrap: {
      marginTop: 14,
      borderRadius: 18,
      border: "1px solid #d9ab90",
      background: "rgba(255,250,245,0.9)",
      padding: "12px",
      maxWidth: 640,
      marginLeft: "auto",
      marginRight: "auto",
    },
    replyTitle: {
      margin: "0 0 8px",
      color: "#7a2c2c",
      fontFamily: HAND_FONT,
      fontSize: "1.15rem",
      fontWeight: 800,
    },
    replyRow: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
    },
    replyInput: {
      flex: 1,
      minWidth: 200,
      borderRadius: 999,
      border: "2px solid #d9ab90",
      padding: "10px 14px",
      fontSize: "1rem",
      fontFamily: HAND_FONT,
      color: "#6a2a2a",
      outline: "none",
      background: "#fffdfb",
    },
    replyBtn: {
      border: "none",
      borderRadius: 999,
      padding: "10px 14px",
      cursor: "pointer",
      fontWeight: 800,
      fontFamily: HAND_FONT,
      color: "#fff",
      background: "linear-gradient(135deg, #c81515, #ff6d6d)",
      boxShadow: "0 10px 16px rgba(200,21,21,0.25)",
    },
    sentCard: {
      marginTop: 8,
      borderRadius: 14,
      border: "1px solid #e7b7b7",
      background: "#fff",
      padding: "10px 12px",
      color: "#6b2c2c",
      fontFamily: HAND_FONT,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.floating}>
        {hearts.map((h) => (
          <Heart
            key={h.id}
            size={h.size}
            fill="rgba(219, 39, 39, 0.24)"
            color="rgba(146, 27, 27, 0.5)"
            style={{
              position: "absolute",
              left: h.left,
              bottom: "-40px",
              animation: `floatHeart ${h.duration} linear ${h.delay} infinite`,
            }}
          />
        ))}
        {sparkles.map((s) => (
          <Sparkles
            key={s.id}
            size={s.size}
            color="rgba(159, 35, 35, 0.25)"
            style={{
              position: "absolute",
              left: s.left,
              top: s.top,
              animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
            }}
          />
        ))}
      </div>

      {burstOn && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 6 }}>
          {burstHearts.map((h) => (
            <Heart
              key={`b-${h.id}`}
              size={h.size}
              fill="rgba(220,38,38,0.35)"
              color="rgba(185,28,28,0.68)"
              style={{
                position: "absolute",
                left: h.left,
                bottom: "-20px",
                animation: `burstUp ${h.duration} cubic-bezier(.18,.7,.3,1.01) ${h.delay} forwards`,
              }}
            />
          ))}
        </div>
      )}

      <main style={styles.shell}>
        <section style={styles.card}>
          <div style={styles.thread} />
          <div style={styles.heartsLine}>
            <Heart size={20} fill="currentColor" />
            <Heart size={16} fill="currentColor" />
            <Heart size={22} fill="currentColor" />
            <Heart size={16} fill="currentColor" />
            <Heart size={20} fill="currentColor" />
          </div>

          <AnimatePresence>
            {suspense && (
              <motion.div
                key="suspense"
                style={styles.suspense}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {suspense}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={styles.inner}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" {...stepMotion}>
                  <h1 style={styles.bigTitle}>Happy Valentine&apos;s Day, {SETTINGS.name} ❤️</h1>
                  <p style={styles.subtitle}>click here for a surprise made with love 💌</p>

                  <div style={styles.bubuBigWrap}>
                    <img
                      src={BUBU_DUDU_SRC}
                      alt="Bubu and Dudu kissing"
                      style={styles.bubuBigImg}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.nextSibling;
                        if (fallback) fallback.style.display = "block";
                      }}
                    />
                    <div style={{ ...styles.bubuFallback, display: "none" }}>🐼💋🐻 bubu dudu</div>
                  </div>

                  <section style={styles.yesNoWrap}>
                    <div style={{ textAlign: "center", color: "#7d2d2d", fontWeight: 800, fontSize: "1.1rem", fontFamily: HAND_FONT }}>
                      Will You Be My Valentine?
                    </div>

                    <motion.button
                      type="button"
                      style={styles.clickHere}
                      onClick={onYes}
                      initial={{ opacity: 0, scale: 0.85, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.08) rotate(-2deg)";
                        e.currentTarget.style.boxShadow = "0 22px 34px rgba(200,21,21,0.42)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                        e.currentTarget.style.boxShadow = "0 18px 30px rgba(200,21,21,0.35)";
                      }}
                    >
                      CLICK HERE, AMORE 💖
                    </motion.button>

                    <div style={styles.loveStickers}>
                      <span style={{ ...styles.sticker, animationDelay: "0s" }}>you + me</span>
                      <span style={{ ...styles.sticker, animationDelay: ".4s" }}>forever</span>
                      <span style={{ ...styles.sticker, animationDelay: ".8s" }}>amore mio</span>
                    </div>
                  </section>
                </motion.div>
              )}

              {step === 2 && (
                <motion.article key="step2" style={styles.letterPaper} {...stepMotion}>
                  <h2 style={styles.letterTitle}>Heart 2 Heart</h2>
                  <div style={styles.bubuBigWrap}>
                    <img
                      src={BUBU_DUDU_SRC}
                      alt="Bubu and Dudu kissing"
                      style={{ ...styles.bubuBigImg, maxHeight: 280 }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.nextSibling;
                        if (fallback) fallback.style.display = "block";
                      }}
                    />
                    <div style={{ ...styles.bubuFallback, display: "none", fontSize: "1.8rem" }}>🐼💋🐻</div>
                  </div>

                  <p style={styles.date}>{SETTINGS.date}</p>
                  <p style={styles.intro}>{LETTER.intro}</p>
                  <p style={styles.p}><strong>{visibleParagraphs[0]}</strong></p>
                  <p style={styles.p}>{visibleParagraphs[1]}</p>
                  <p style={styles.p}>{visibleParagraphs[2]}</p>
                  <p style={styles.p}>{visibleParagraphs[3]}</p>
                  <p style={styles.p}>{visibleParagraphs[4]}</p>
                  <p style={styles.sign}>
                    {LETTER.signoff}
                    <br />
                    <span style={styles.sig}>{LETTER.signature}</span>
                  </p>

                  <div style={styles.bouquetBigWrap}>
                    <img
                      src={ROSE_BOUQUET_SRC}
                      alt="Rose bouquet"
                      style={styles.bouquetImg}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.nextSibling;
                        if (fallback) fallback.style.display = "block";
                      }}
                    />
                    <div style={{ ...styles.bubuFallback, display: "none", fontSize: "1.6rem" }}>🌹 bouquet</div>
                  </div>
                </motion.article>
              )}

              {step === 3 && (
                <motion.div key="step3" {...stepMotion}>
                  <div style={styles.flowersWrap}>
                    <h3 style={styles.flowersTitle}>Flowers For You 🌹</h3>
                    <div style={styles.bouquetBigWrap}>
                      <img
                        src={ROSE_BOUQUET_SRC}
                        alt="Rose bouquet"
                        style={styles.bouquetImg}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextSibling;
                          if (fallback) fallback.style.display = "block";
                        }}
                      />
                      <div style={{ ...styles.bubuFallback, display: "none", fontSize: "1.6rem" }}>🌹 bouquet</div>
                    </div>

                    <div style={styles.flowerPillRow}>
                      <span style={styles.flowerPill}><Flower2 size={14} style={{ verticalAlign: "text-bottom", marginRight: 6 }} />You are my peace</span>
                      <span style={styles.flowerPill}><Star size={14} style={{ verticalAlign: "text-bottom", marginRight: 6 }} />You are my best part</span>
                      <span style={styles.flowerPill}><Heart size={14} style={{ verticalAlign: "text-bottom", marginRight: 6 }} fill="currentColor" />You are my forever</span>
                    </div>

                    <div style={styles.replyWrap}>
                      <p style={styles.replyTitle}>Leave me a little message, amore 💌</p>
                      <div style={styles.replyRow}>
                        <input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write something sweet..."
                          style={styles.replyInput}
                        />
                        <button type="button" style={styles.replyBtn} onClick={sendReply}>
                          Send
                        </button>
                      </div>
                      {sentReply && <div style={styles.sentCard}>{sentReply}</div>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes floatHeart {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-115vh) rotate(360deg); opacity: 0; }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.9); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }

        @keyframes burstUp {
          0% { transform: translateY(0) scale(0.7); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: translateY(-105vh) scale(1.15); opacity: 0; }
        }

        @keyframes heartBeat {
          0%,100% { transform: scale(1); }
          30% { transform: scale(1.04); }
          45% { transform: scale(0.98); }
          60% { transform: scale(1.06); }
        }

        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 18px 30px rgba(200,21,21,0.35); }
          50% { box-shadow: 0 23px 36px rgba(200,21,21,0.5); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulseText {
          0%,100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        @keyframes paperFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes shakeCute {
          0%,100% { transform: rotate(0deg); }
          25% { transform: rotate(1.2deg); }
          75% { transform: rotate(-1.2deg); }
        }

        @keyframes softPop {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

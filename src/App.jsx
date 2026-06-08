import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";

// ─── UTILITIES & HOOKS ──────────────────────────────────────────────────────

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setT(d.toLocaleTimeString("en-IN", { 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit", 
        hour12: true 
      }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// Custom scramble decoder text component
function Scrambler({ text }) {
  const [display, setDisplay] = useState(text);
  const [trigger, setTrigger] = useState(0);
  const chars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  useEffect(() => {
    let frame = 0;
    const totalFrames = 18;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      if (progress >= 1) {
        setDisplay(text);
        clearInterval(interval);
        return;
      }
      
      const scrambled = text.split("").map((char, index) => {
        if (char === " ") return " ";
        if (index / text.length < progress) {
          return char;
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      
      setDisplay(scrambled);
    }, 35);

    return () => clearInterval(interval);
  }, [text, trigger]);

  return (
    <span 
      onMouseEnter={() => setTrigger(prev => prev + 1)}
      style={{
        cursor: "pointer",
        color: "var(--color-green)",
        fontWeight: 600,
        transition: "text-shadow 0.3s ease",
      }}
      className="clickable"
    >
      {display}
    </span>
  );
}

// Custom hook to detect section scroll state and switch body theme
function useScrollSectionTheme(sectionsRef) {
  const [activeTheme, setActiveTheme] = useState("light");

  useEffect(() => {
    const handleScroll = () => {
      let currentTheme = "light";
      sectionsRef.current.forEach(({ ref, theme }) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          // If the section occupies the center of the viewport
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
            currentTheme = theme;
          }
        }
      });
      if (currentTheme !== activeTheme) {
        setActiveTheme(currentTheme);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTheme, sectionsRef]);

  return activeTheme;
}

// ─── CONSTANTS & DATA ───────────────────────────────────────────────────────

const SKILLS = {
  Frontend: ["HTML", "CSS", "JS"],
  Backend: ["JDBC", "Servlets", "JSP"],
  Database: ["MySQL"],
  Tools: ["Vercel", "Render", "Git"],
  "AI Tools": ["ChatGPT", "GitHub Copilot", "Claude"]
};

const PROJECTS = [
  {
    num: "01",
    ref: "ACM-0724",
    title: "AI Code Mentor",
    year: "2024",
    tag: "MERN · AI",
    desc: "Full-stack AI Code Mentor using MERN stack with Groq API for real-time code analysis and automated debugging. Secure JWT auth, scalable REST APIs.",
    tech: ["MongoDB", "React.js", "Express.js", "Node.js", "Groq API", "JWT"],
    live: "https://ai-code-mentor.vercel.app/",
    github: "https://github.com/rajathos07/AICodeMentor.git",
    bgClass: "mentor-mockup"
  },
  {
    num: "02",
    ref: "AEE-1124",
    title: "AI Exam Evaluation",
    year: "2024",
    tag: "OCR · Gemini",
    desc: "AI-powered evaluation system using OCR + Google Gemini API to extract handwritten answers, auto-assign marks, and translate across multiple languages.",
    tech: ["React.js", "Node.js", "Express.js", "MySQL", "OCR", "Gemini API"],
    live: null,
    github: "https://github.com/rajathos07/text_processing.git",
    bgClass: "exam-mockup"
  }
];

const MARQUEE = [
  "React", "Node.js", "Spring Boot", "MongoDB", "MySQL", "Express.js", 
  "JavaScript", "Git", "Vercel", "Groq API", "Gemini API", "OCR", 
  "REST APIs", "JWT Auth", "Full Stack"
];

// ─── REDESIGNED SUBCOMPONENTS ────────────────────────────────────────────────

// 1. Entry Curtain Loader
function CurtainLoader() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="curtain-loader"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.8 }}
          onAnimationComplete={() => setVisible(false)}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center" }}
          >
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 5vw, 4rem)", fontStyle: "italic", fontWeight: 400, color: "var(--color-green)" }}>
              Rajath O S
            </h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "1rem", opacity: 0.6 }}>
              Move Fast. Build to Last.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 2. Custom Cursor Follower
function CursorFollower() {
  const [cursorType, setCursorType] = useState("");
  const [cursorText, setCursorText] = useState("");
  const [isMobile, setIsMobile] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorSpringX = useSpring(cursorX, springConfig);
  const cursorSpringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect mobile touch devices to prevent rendering custom cursor
    const checkDevice = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    const onMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target;
      if (!target) return;

      const interactive = target.closest("[data-cursor]");
      if (interactive) {
        const type = interactive.getAttribute("data-cursor");
        setCursorType(type);
        setCursorText(interactive.getAttribute("data-cursor-text") || "");
      } else if (target.closest("a") || target.closest("button") || target.closest(".clickable")) {
        setCursorType("link");
        setCursorText("");
      } else {
        setCursorType("");
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", checkDevice);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [cursorX, cursorY]);

  if (isMobile) return null;

  return (
    <motion.div
      className={`custom-cursor ${cursorType ? `hovering-${cursorType}` : ""}`}
      style={{
        left: cursorSpringX,
        top: cursorSpringY,
      }}
    >
      {cursorText}
    </motion.div>
  );
}

// 3. Grid Background Helper (Blueprint guidelines)
function GridLines() {
  return (
    <div className="blueprint-grid">
      <div className="grid-line-v" style={{ left: "calc(var(--grid-margin) / 2)" }} />
      <div className="grid-line-v" style={{ left: "25%" }} />
      <div className="grid-line-v" style={{ left: "50%" }} />
      <div className="grid-line-v" style={{ left: "75%" }} />
      <div className="grid-line-v" style={{ right: "calc(var(--grid-margin) / 2)" }} />
    </div>
  );
}

// 4. Scroll Reveal Wrapper (with dynamic zoom-in / scale effect)
function Reveal({ children, delay = 0, y = 20, scale = 0.94 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1], delay }}
      style={{ transformOrigin: "center center" }}
    >
      {children}
    </motion.div>
  );
}

// 5. Skewed Folder Title Label
function SectionLabel({ index, text }) {
  return (
    <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "flex-end", marginBottom: "2rem" }}>
      <div className="folder-tab">
        <span style={{ opacity: 0.5, marginRight: "0.5rem" }}>{String(index).padStart(2, "0")} //</span>
        <span>{text}</span>
      </div>
      <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)", transition: "background-color 0.8s" }} />
    </div>
  );
}

// 5.1 Ambient Glowing Gradient Background Blobs
function AmbientGlows({ theme }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 0,
      overflow: "hidden"
    }}>
      {/* Orb 1 */}
      <motion.div
        animate={{
          x: theme === "light" ? [0, 80, -40, 0] : [0, -60, 40, 0],
          y: theme === "light" ? [0, -100, 50, 0] : [0, 80, -90, 0],
          backgroundColor: theme === "light" ? "rgba(238, 255, 168, 0.07)" : "rgba(238, 255, 168, 0.14)"
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "15%",
          left: "20%",
          width: "clamp(300px, 45vw, 600px)",
          height: "clamp(300px, 45vw, 600px)",
          borderRadius: "50%",
          filter: "blur(140px)",
        }}
      />

      {/* Orb 2 */}
      <motion.div
        animate={{
          x: theme === "light" ? [0, -120, 60, 0] : [0, 90, -70, 0],
          y: theme === "light" ? [0, 80, -110, 0] : [0, -90, 60, 0],
          backgroundColor: theme === "light" ? "rgba(238, 255, 168, 0.05)" : "rgba(238, 255, 168, 0.08)"
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: "clamp(250px, 40vw, 500px)",
          height: "clamp(250px, 40vw, 500px)",
          borderRadius: "50%",
          filter: "blur(140px)",
        }}
      />

      {/* Orb 3 */}
      <motion.div
        animate={{
          x: theme === "light" ? [0, 50, -50, 0] : [0, 0, 0, 0],
          y: theme === "light" ? [0, 50, -50, 0] : [0, 0, 0, 0],
          backgroundColor: theme === "light" ? "rgba(238, 255, 168, 0.02)" : "rgba(238, 255, 168, 0.04)"
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(300px, 35vw, 450px)",
          height: "clamp(300px, 35vw, 450px)",
          borderRadius: "50%",
          filter: "blur(130px)",
        }}
      />
    </div>
  );
}

// ─── DETAILED COMPONENT RENDER ───────────────────────────────────────────────

function Navbar() {
  const clock = useClock();

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "var(--header-height)",
      padding: "0 var(--grid-margin)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid var(--color-border)",
      backgroundColor: "rgba(5, 5, 5, 0.75)",
      backdropFilter: "blur(12px)",
      zIndex: 500,
      transition: "background-color 0.8s, border-color 0.8s"
    }} className="navbar-ref">
      <a href="#hero" className="hover-bracket-link" style={{ fontSize: "1.05rem", fontFamily: "var(--font-serif)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
        Rajath O S
      </a>

      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }} className="nav-links-container">
        {["About", "Skills", "Projects", "Education", "Contact"].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className="hover-bracket-link" style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase"
          }}>
            {item}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }} className="nav-right-container">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.05em", opacity: 0.6 }} className="clock-span">
          IST // {clock || "00:00:00 PM"}
        </span>
        
        <a 
          href="https://drive.google.com/file/d/17GBGLCzu9BwmZLYxAdkFQRlzdRQQW75M/view?usp=drive_link" 
          target="_blank" 
          rel="noopener noreferrer"
          className="folder-tab"
          style={{ height: "30px", textDecoration: "none", color: "inherit", marginTop: "-3px" }}
        >
          Resume ↓
        </a>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section id="hero" style={{
      position: "relative",
      minHeight: "100vh",
      paddingTop: "calc(var(--header-height) + 2rem)",
      paddingBottom: "4rem",
      paddingLeft: "var(--grid-margin)",
      paddingRight: "var(--grid-margin)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      <GridLines />

      {/* Floating blueprint decorations for visual depth */}
      <motion.div
        animate={{ 
          y: [0, -25, 0], 
          rotate: [0, 360],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "28%",
          left: "8%",
          width: "40px",
          height: "40px",
          border: "1px dashed var(--color-green)",
          borderRadius: "50%",
          opacity: 0.15,
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      <motion.div
        animate={{ 
          y: [0, 25, 0], 
          x: [0, -10, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "22%",
          right: "18%",
          padding: "0.5rem 1rem",
          border: "1px solid var(--color-border)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          color: "var(--color-green)",
          opacity: 0.2,
          pointerEvents: "none",
          zIndex: 1
        }}
      >
        [ &lt;JS / JDBC / SQL&gt; ]
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, -35, 0], 
          x: [0, 15, 0]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "14%",
          right: "6%",
          width: "24px",
          height: "24px",
          borderLeft: "2px solid var(--color-border)",
          borderTop: "2px solid var(--color-border)",
          opacity: 0.25,
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      {/* Meta Header */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--color-border)",
        paddingBottom: "1.5rem",
        transition: "border-color 0.8s"
      }} className="hero-meta-row">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--color-green)" }} />
          <span className="mono-label" style={{ opacity: 0.7 }}>Open to Opportunities</span>
        </div>
        <div className="mono-label" style={{ opacity: 0.7 }}>Bengaluru, India</div>
        <div className="mono-label" style={{ opacity: 0.7 }}>BE · Graduated 2026</div>
      </div>

      {/* Hero Headline */}
      <div style={{ position: "relative", zIndex: 10, margin: "4rem 0" }} className="hero-main-title">
        <Reveal>
          <h1 className="editorial-title" style={{ display: "flex", flexDirection: "column" }}>
            <span>CRAFT SCALE.</span>
            <span style={{ color: "var(--color-green)", alignSelf: "flex-end" }}>BUILD TO LAST.</span>
          </h1>
        </Reveal>
      </div>

      {/* Description Bottom Bar */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr",
        gap: "4rem",
        borderTop: "1px solid var(--color-border)",
        paddingTop: "2rem",
        transition: "border-color 0.8s"
      }} className="hero-bottom-bar">
        <div>
          <span className="mono-label" style={{ opacity: 0.5, display: "block", marginBottom: "0.5rem" }}>Currently // Role</span>
          <div style={{ 
            fontFamily: "var(--font-serif)", 
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)", 
            minHeight: "3rem",
            color: "var(--color-green)"
          }}>
            <Scrambler text="Java FullStack Developer" />
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>|</motion.span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1.5rem" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem", lineHeight: 1.6, opacity: 0.8 }}>
            Crafting scalable web applications with the MERN stack and Spring Boot. Passionate about clean code and real-world impact.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href="#projects" className="folder-tab" style={{ height: "36px", textDecoration: "none", color: "inherit" }}>
              Explore Work →
            </a>
            <a href="#contact" className="hover-bracket-link" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Infinite Scrolling Marquee
function MarqueeBand() {
  return (
    <div className="infinite-marquee">
      <div className="infinite-marquee-content">
        {[...Array(3)].map((_, i) => (
          <span key={i} style={{ display: "inline-flex", gap: "2rem" }}>
            {MARQUEE.map(item => (
              <span key={item} style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                opacity: 0.5,
                marginRight: "2rem"
              }}>
                {item} &bull;
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

// 6. Projects Section: Featured Carousel (ref.digital Copy)
function ProjectsCarousel() {
  const [index, setIndex] = useState(0);
  const autoplayTimer = useRef(null);
  const slideDuration = 6000; // 6 seconds

  const nextSlide = () => {
    setIndex(prev => (prev + 1) % PROJECTS.length);
  };

  const prevSlide = () => {
    setIndex(prev => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  useEffect(() => {
    autoplayTimer.current = setInterval(nextSlide, slideDuration);
    return () => clearInterval(autoplayTimer.current);
  }, []);

  const activeProject = PROJECTS[index];

  return (
    <section style={{
      position: "relative",
      padding: "6rem var(--grid-margin)",
      borderBottom: "1px solid var(--color-border)",
      transition: "border-color 0.8s"
    }}>
      <GridLines />
      <SectionLabel index={1} text="Featured Work" />

      {/* Main Carousel Frame */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1.2fr 1.8fr",
        gap: "4rem",
        alignItems: "center"
      }} className="carousel-grid">
        
        {/* Left Side: Info */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", minHeight: "380px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--color-green)", opacity: 0.9 }}>
                CASE: {activeProject.ref}
              </span>
              <span style={{ width: 1, height: 12, backgroundColor: "var(--color-border)" }} />
              <span className="mono-label" style={{ opacity: 0.6 }}>{activeProject.year}</span>
            </div>

            <h2 className="editorial-h2" style={{ marginBottom: "1.5rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              {activeProject.title}
            </h2>
            
            <p style={{ lineHeight: 1.7, opacity: 0.8, fontSize: "0.95rem", marginBottom: "2rem" }}>
              {activeProject.desc}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
              {activeProject.tech.map(t => (
                <span key={t} style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "100px",
                  border: "1px solid var(--color-border)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem"
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            {activeProject.live && (
              <a href={activeProject.live} target="_blank" rel="noopener noreferrer" className="folder-tab" style={{ height: "36px", textDecoration: "none", color: "inherit" }}>
                Live Site ↗
              </a>
            )}
            <a href={activeProject.github} target="_blank" rel="noopener noreferrer" className="hover-bracket-link" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
              GitHub Repository
            </a>
          </div>
        </div>

        {/* Right Side: Interactive Mockup Display */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/10" }} className="carousel-mockup-wrap">
          
          {/* Custom Styled Code Editor and Scanner Visualizations (Pure CSS) */}
          <div style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#1C1917",
            borderRadius: "6px",
            border: "1px solid var(--color-border)",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            position: "relative"
          }}>
            {/* Window bar */}
            <div style={{
              height: "36px",
              backgroundColor: "#2E2A27",
              borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 1rem"
            }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#EF4444" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#10B981" }} />
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", opacity: 0.4, color: "#fff" }}>
                {activeProject.title.toLowerCase().replace(/\s+/g, "-")}.visual
              </span>
              <div style={{ width: 30 }} />
            </div>

            {/* Editor Screen: Dynamic representation based on current slide */}
            <div style={{ flex: 1, padding: "2rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "#F3F1EF", overflow: "hidden", position: "relative" }}>
              {index === 0 ? (
                /* AI CODE MERN MOCKUP */
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", height: "100%" }}>
                  <div><span style={{ color: "#E0A458" }}>import</span> AI <span style={{ color: "#E0A458" }}>from</span> <span style={{ color: "#8ECAE6" }}>"@groq/sdk"</span>;</div>
                  <div><span style={{ color: "#E0A458" }}>const</span> mentor = <span style={{ color: "#E0A458" }}>new</span> AI.Mentor();</div>
                  <div style={{ paddingLeft: "1rem", color: "#625d58" }}>// Analyze codebase schema</div>
                  <div style={{ paddingLeft: "1rem" }}><span style={{ color: "#E0A458" }}>await</span> mentor.review(database.schema);</div>
                  
                  {/* Floating AI Notification Overlay */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    key="mentor-notif"
                    style={{
                      marginTop: "auto",
                      backgroundColor: "#2E2A27",
                      border: "1px solid var(--color-green)",
                      borderRadius: "6px",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-green)", fontSize: "0.7rem", fontWeight: "bold" }}>
                      <span>💡 AI CODE MENTOR LOGS</span>
                      <span>JWT: OK</span>
                    </div>
                    <p style={{ color: "#F3F1EF", fontSize: "0.72rem" }}>
                      Optimization found: Add index key to User schema queries in Mongo client for 40% performance gain.
                    </p>
                  </motion.div>
                </div>
              ) : (
                /* AI EXAM EVALUATION MOCKUP */
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", height: "100%", color: "#231F1D", backgroundColor: "#fff", margin: "-2rem", padding: "2rem", backgroundImage: "radial-gradient(#C4BAB0 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
                  <div style={{ borderBottom: "1px solid #E1DDD7", paddingBottom: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "bold" }}>EXAM SCAN: PAPER_02</span>
                    <span style={{ color: "#10B981", fontWeight: "bold" }}>OCR EXTRACTED</span>
                  </div>
                  
                  <div style={{ fontStyle: "italic", color: "#625d58", fontSize: "0.85rem" }}>
                    "Answer: React utilizes a virtual DOM to optimize client updates. It renders elements dynamically."
                  </div>

                  <div style={{ borderTop: "1px dashed #E1DDD7", paddingTop: "0.5rem" }}>
                    <span style={{ fontWeight: "bold" }}>Gemini API translation Kannada:</span>
                    <p style={{ fontSize: "0.72rem", opacity: 0.8, color: "#625d58" }}>
                      ರಿಯಾಕ್ಟ್ ಕ್ಲೈಂಟ್ ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಆಪ್ಟಿಮೈಸ್ ಮಾಡಲು ವರ್ಚುವಲ್ DOM ಅನ್ನು ಬಳಸುತ್ತದೆ...
                    </p>
                  </div>

                  {/* Scoring Overlay */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                    animate={{ opacity: 1, scale: 1, rotate: -2 }}
                    key="exam-score"
                    style={{
                      marginTop: "auto",
                      alignSelf: "flex-end",
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      border: "2px solid #10B981",
                      borderRadius: "4px",
                      padding: "0.5rem 1rem",
                      color: "#10B981",
                      fontFamily: "var(--font-mono)",
                      fontWeight: "bold",
                      fontSize: "0.9rem"
                    }}
                  >
                    MARKS: 10/10 [PASS]
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls & Thumbnails */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "3rem",
        borderTop: "1px solid var(--color-border)",
        paddingTop: "2rem",
        transition: "border-color 0.8s"
      }} className="carousel-controls-row">
        
        {/* Navigation Brackets */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={prevSlide} className="hover-bracket-link" style={{ background: "none", border: "none", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
            Prev Slide
          </button>
          <button onClick={nextSlide} className="hover-bracket-link" style={{ background: "none", border: "none", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
            Next Slide
          </button>
        </div>

        {/* Dynamic Marker Box Slide indicating active project */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="carousel-slide-indicators">
          {PROJECTS.map((proj, idx) => (
            <button 
              key={proj.num} 
              onClick={() => setIndex(idx)}
              style={{
                background: "none",
                border: "none",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: index === idx ? "var(--color-green)" : "inherit",
                opacity: index === idx ? 1 : 0.4,
                cursor: "pointer",
                transition: "opacity 0.3s, color 0.3s"
              }}
            >
              {proj.num} &mdash; {proj.tag.split(" · ")[0]}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// 7. About Section: Portrait & Narrative Blueprint Layout
function AboutSection() {
  const stats = [
    { val: "6+", label: "Projects Built" },
    { val: "5+", label: "Tech Stacks" },
    { val: "2026", label: "Graduated" },
    { val: "BLR", label: "Based In" }
  ];

  return (
    <section id="about" style={{
      position: "relative",
      padding: "6rem var(--grid-margin)",
      borderBottom: "1px solid var(--color-border)",
      transition: "border-color 0.8s"
    }}>
      <GridLines />
      <SectionLabel index={2} text="About" />

      <div style={{
        position: "relative",
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1.6fr 1.4fr",
        gap: "5rem"
      }} className="about-grid-ref">
        
        {/* Left Side Narrative */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <Reveal>
            <h2 className="editorial-h2" style={{ lineHeight: 1.15 }}>
              Building for the web,<br />
              <span style={{ color: "var(--color-green)" }}>one clean line</span><br />
              at a time.
            </h2>
          </Reveal>
          
          <Reveal delay={0.1}>
            <p style={{ lineHeight: 1.8, fontSize: "1rem", opacity: 0.85, fontWeight: 300 }}>
              I'm an aspiring Full Stack Developer passionate about crafting modern, user-friendly web applications. Having graduated with a BE in Computer Science from GM Institute of Technology, Davanagere, in 2026.
            </p>
            <p style={{ lineHeight: 1.8, fontSize: "1rem", opacity: 0.85, marginTop: "1rem", fontWeight: 300 }}>
              My focus is on building scalable, maintainable solutions with the MERN stack and Java backend technologies. Driven by continuous learning and a passion for impactful software.
            </p>
          </Reveal>

          {/* Social Contacts Blueprint */}
          <Reveal delay={0.2}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "2rem" }} className="about-links-grid">
              {[
                { label: "Email", val: "rajathos07@gmail.com", href: "mailto:rajathos07@gmail.com" },
                { label: "GitHub", val: "github.com/rajathos07", href: "https://github.com/rajathos07" },
                { label: "LinkedIn", val: "in/rajath-os", href: "https://www.linkedin.com/in/rajath-os/" }
              ].map(c => (
                <a 
                  key={c.label} 
                  href={c.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="grid-cell"
                  style={{
                    padding: "1.2rem",
                    textDecoration: "none",
                    color: "inherit",
                    backgroundColor: "rgba(35, 31, 29, 0.02)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "100px"
                  }}
                >
                  <span className="mono-label" style={{ opacity: 0.5 }}>{c.label}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.val}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right Side Photo & Stats Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          
          {/* Framed Portrait from prompt */}
          <Reveal>
            <div className="grid-cell" style={{
              position: "relative",
              padding: "1.5rem",
              backgroundColor: "rgba(35, 31, 29, 0.02)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {/* Wireframe corners */}
              <span style={{ position: "absolute", top: -1, left: -1, width: 8, height: 8, borderLeft: "2px solid var(--color-green)", borderTop: "2px solid var(--color-green)" }} />
              <span style={{ position: "absolute", top: -1, right: -1, width: 8, height: 8, borderRight: "2px solid var(--color-green)", borderTop: "2px solid var(--color-green)" }} />
              <span style={{ position: "absolute", bottom: -1, left: -1, width: 8, height: 8, borderLeft: "2px solid var(--color-green)", borderBottom: "2px solid var(--color-green)" }} />
              <span style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRight: "2px solid var(--color-green)", borderBottom: "2px solid var(--color-green)" }} />
              
              <div style={{ width: "100%", overflow: "hidden", border: "1px solid var(--color-border)" }}>
                {/* Visual rendering of portrait */}
                <img 
                  src="/src/assets/hero.png" 
                  alt="Rajath O S Portrait" 
                  style={{ width: "100%", height: "auto", display: "block", filter: "grayscale(10%) contrast(105%)" }} 
                  onError={(e) => {
                    // Fail-safe default placeholder if image is missing
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </div>
          </Reveal>

          {/* Stats Grid */}
          <Reveal delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {stats.map(s => (
                <div 
                  key={s.label}
                  className="grid-cell"
                  style={{
                    padding: "1.5rem",
                    backgroundColor: "rgba(35, 31, 29, 0.02)"
                  }}
                >
                  <div style={{ 
                    fontFamily: "var(--font-serif)", 
                    fontSize: "2.2rem", 
                    fontStyle: "italic", 
                    fontWeight: 400, 
                    color: "var(--color-green)",
                    lineHeight: 1
                  }}>{s.val}</div>
                  <div className="mono-label" style={{ opacity: 0.5, marginTop: "0.5rem" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

// 8. Skills Section: Interactive Capability Cards Grid
function SkillsSection() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <section id="skills" style={{
      position: "relative",
      padding: "6rem var(--grid-margin)",
      borderBottom: "1px solid var(--color-border)",
      transition: "border-color 0.8s"
    }}>
      <GridLines />
      <SectionLabel index={3} text="Skills & Capabilities" />

      <div style={{
        position: "relative",
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: "5rem"
      }} className="skills-grid-ref">
        
        {/* Left Side Sticky Column */}
        <div style={{ position: "sticky", top: "120px" }}>
          <Reveal>
            <h2 className="editorial-h2" style={{ lineHeight: 1.1 }}>
              Core Stack &<br />
              <span style={{ color: "var(--color-green)" }}>Capabilities.</span>
            </h2>
            <p style={{ marginTop: "1.5rem", opacity: 0.7, lineHeight: 1.6, fontSize: "0.95rem" }}>
              A curated suite of modern web standards, API protocols, database utilities, and generative AI configurations.
            </p>
          </Reveal>
        </div>

        {/* Right Side Categories Accordion List */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Object.entries(SKILLS).map(([cat, list], idx) => (
            <Reveal key={cat} delay={idx * 0.08}>
              <div 
                className="grid-cell"
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{
                  borderTop: "1px solid var(--color-border)",
                  borderBottom: idx === Object.keys(SKILLS).length - 1 ? "1px solid var(--color-border)" : "none",
                  borderLeft: "none",
                  borderRight: "none",
                  padding: "2rem 1.5rem",
                  display: "grid",
                  gridTemplateColumns: "1.5fr 3.5fr",
                  gap: "2rem",
                  alignItems: "center",
                  backgroundColor: hoveredCategory === cat ? "rgba(35, 31, 29, 0.02)" : "transparent",
                  transition: "background-color 0.3s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", opacity: 0.4 }}>
                    {String(idx + 1).padStart(2, "0")} /
                  </span>
                  <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {cat}
                  </h3>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                  {list.map(sk => (
                    <span 
                      key={sk} 
                      style={{
                        padding: "0.35rem 0.95rem",
                        borderRadius: "100px",
                        border: "1px solid var(--color-border)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        backgroundColor: hoveredCategory === cat ? "var(--color-bg)" : "transparent",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}

// 9. Interactive Projects List (ref.digital Copy)
function ProjectsListSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (hoveredIndex !== null) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoveredIndex]);

  return (
    <section id="projects" style={{
      position: "relative",
      padding: "6rem var(--grid-margin)",
      borderBottom: "1px solid var(--color-border)",
      transition: "border-color 0.8s"
    }}>
      <GridLines />
      <SectionLabel index={4} text="All Work" />

      {/* Grid Row header */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "0.8fr 3fr 1.5fr 1fr",
        padding: "1rem 1.5rem",
        borderBottom: "2px solid var(--color-text)",
        opacity: 0.6
      }} className="project-table-header">
        <span className="mono-label">No.</span>
        <span className="mono-label">Project Title</span>
        <span className="mono-label">Scope</span>
        <span className="mono-label" style={{ textAlign: "right" }}>Year</span>
      </div>

      <div style={{ position: "relative", zIndex: 10 }} className="projects-table-body">
        {PROJECTS.map((proj, idx) => (
          <Reveal key={proj.num} delay={idx * 0.1}>
            <a 
              href={proj.github} 
              target="_blank" 
              rel="noopener noreferrer"
              data-cursor="project"
              data-cursor-text="CODE ↗"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "0.8fr 3fr 1.5fr 1fr",
                padding: "2.5rem 1.5rem",
                borderBottom: "1px solid var(--color-border)",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                cursor: "none"
              }}
              className="project-row-ref clickable"
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", opacity: 0.5 }}>{proj.num}</span>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)", fontStyle: "italic", fontWeight: 400 }}>{proj.title}</h3>
              <span className="mono-label" style={{ opacity: 0.7 }}>{proj.tag}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", textAlign: "right" }}>{proj.year}</span>
            </a>
          </Reveal>
        ))}
      </div>

      {/* Floating Thumbnail following cursor on row hover */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="floating-thumbnail"
            style={{
              left: mousePos.x + 20,
              top: mousePos.y + 20,
              backgroundColor: "#1C1917",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* Displaying simple visual representation inside hover thumb */}
            <div style={{ color: "var(--color-green)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", padding: "1rem", textAlign: "center" }}>
              <span style={{ display: "block", color: "#fff", fontWeight: "bold", marginBottom: "0.4rem" }}>{PROJECTS[hoveredIndex].title}</span>
              {PROJECTS[hoveredIndex].tag}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// 10. Education Section: Timeline Layout
function EducationSection() {
  return (
    <section id="education" style={{
      position: "relative",
      padding: "6rem var(--grid-margin)",
      borderBottom: "1px solid var(--color-border)",
      transition: "border-color 0.8s"
    }}>
      <GridLines />
      <SectionLabel index={5} text="Education" />

      <div style={{
        position: "relative",
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: "5rem"
      }} className="edu-grid-ref">
        
        <Reveal>
          <h2 className="editorial-h2" style={{ lineHeight: 1.1 }}>
            Academic<br />
            <span style={{ color: "var(--color-green)" }}>Background.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid-cell" style={{
            position: "relative",
            backgroundColor: "rgba(35, 31, 29, 0.02)",
            padding: "2.5rem",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "3px", background: "linear-gradient(90deg, var(--color-green), var(--color-green))" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <div>
                <span className="mono-label" style={{ color: "var(--color-green)", display: "block", marginBottom: "0.4rem", fontWeight: "bold" }}>
                  Bachelor of Engineering
                </span>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontStyle: "italic", fontWeight: 400, color: "inherit" }}>
                  GM Institute of Technology
                </h3>
                <p style={{ fontSize: "0.88rem", opacity: 0.6, marginTop: "0.2rem" }}>Davanagere, India</p>
              </div>
              
              <span style={{
                height: "fit-content",
                padding: "0.4rem 1rem",
                borderRadius: "4px",
                border: "1px solid var(--color-border)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem"
              }}>
                Graduated 2026
              </span>
            </div>

            <div style={{
              display: "flex",
              gap: "3rem",
              borderTop: "1px solid var(--color-border)",
              paddingTop: "1.5rem"
            }} className="edu-details-row">
              {[
                ["Degree", "B.E."],
                ["Stream", "Computer Sci."],
                ["Status", "Graduated"]
              ].map(([lbl, val]) => (
                <div key={lbl}>
                  <div className="mono-label" style={{ opacity: 0.5, marginBottom: "0.25rem" }}>{lbl}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9rem" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

// 11. Contact Form & CTA Popup
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const submit = () => {
    if (!form.name || !form.email || !form.message) return;
    const s = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const b = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:rajathos07@gmail.com?subject=${s}&body=${b}`);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" style={{
      position: "relative",
      padding: "6rem var(--grid-margin)",
      borderBottom: "1px solid var(--color-border)",
      transition: "border-color 0.8s"
    }}>
      <GridLines />
      <SectionLabel index={6} text="Get In Touch" />

      <div style={{
        position: "relative",
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1.2fr 1.8fr",
        gap: "5rem"
      }} className="contact-grid-ref">
        
        {/* Left Side Call To Action */}
        <div>
          <Reveal>
            <span className="mono-label" style={{ color: "var(--color-green)", display: "block", marginBottom: "1rem" }}>
              Let's Collaborate
            </span>
            <h2 className="editorial-h2" style={{ lineHeight: 0.95, fontSize: "clamp(2rem, 5vw, 4.5rem)", marginBottom: "1.5rem" }}>
              Ready to build<br />
              <span style={{ color: "var(--color-green)" }}>something great?</span>
            </h2>
            <p style={{ opacity: 0.7, lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "3rem" }}>
              Open to fresher roles, internships and exciting projects. Let's design modular software together.
            </p>
          </Reveal>

          {/* Core contact links */}
          <Reveal delay={0.1}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { label: "Email", val: "rajathos07@gmail.com", href: "mailto:rajathos07@gmail.com" },
                { label: "LinkedIn", val: "linkedin.com/in/rajath-os", href: "https://www.linkedin.com/in/rajath-os/" }
              ].map(c => (
                <a 
                  key={c.label} 
                  href={c.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="grid-cell"
                  style={{
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "1rem 1.2rem", 
                    textDecoration: "none", 
                    color: "inherit",
                    backgroundColor: "rgba(35, 31, 29, 0.02)"
                  }}
                >
                  <span className="mono-label" style={{ opacity: 0.5 }}>{c.label}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>{c.val}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right Side Input Forms */}
        <Reveal delay={0.15}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <div className="blueprint-input-group">
              <label>Name</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handle} 
                type="text" 
                placeholder="Rajath O S" 
                required 
              />
            </div>

            <div className="blueprint-input-group">
              <label>Email</label>
              <input 
                name="email" 
                value={form.email} 
                onChange={handle} 
                type="email" 
                placeholder="rajathos07@gmail.com" 
                required 
              />
            </div>

            <div className="blueprint-input-group">
              <label>Message</label>
              <textarea 
                name="message" 
                value={form.message} 
                onChange={handle} 
                rows={5} 
                placeholder="Describe your project requirements..." 
                required 
              />
            </div>

            <button 
              onClick={submit} 
              className="folder-tab clickable"
              style={{
                height: "50px",
                width: "100%",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: sent ? "var(--color-green)" : "var(--color-text)",
                color: sent ? "var(--color-bg-dark)" : "var(--color-bg)",
                fontFamily: "var(--font-mono)",
                fontWeight: "bold",
                fontSize: "0.8rem",
                marginTop: "1rem"
              }}
              data-cursor="link"
            >
              {sent ? "✓ Message Sent!" : "Send Message →"}
            </button>

          </div>
        </Reveal>

      </div>
    </section>
  );
}

// 12. Footer with Infinite Marquee Loop
function Footer() {
  return (
    <footer style={{
      position: "relative",
      backgroundColor: "var(--color-bg)",
      borderTop: "1px solid var(--color-border)",
      transition: "background-color 0.8s, border-color 0.8s"
    }}>
      {/* Infinite scrolling name marquee */}
      <div style={{ overflow: "hidden", borderBottom: "1px solid var(--color-border)", padding: "1.5rem 0", transition: "border-color 0.8s" }}>
        <div className="infinite-marquee-content" style={{ display: "flex", whiteSpace: "nowrap" }}>
          {[...Array(6)].map((_, i) => (
            <span key={i} style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              color: i % 2 === 0 ? "var(--color-green)" : "transparent",
              WebkitTextStroke: i % 2 === 0 ? "none" : "1px var(--color-green)",
              letterSpacing: "-0.02em",
              paddingRight: "3rem",
              lineHeight: 1
            }}>
              Rajath O S
            </span>
          ))}
        </div>
      </div>

      <div style={{
        maxWidth: "1440px",
        margin: "0 auto",
        padding: "3rem var(--grid-margin)",
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr 1fr",
        alignItems: "center",
        gap: "2rem"
      }} className="footer-cols-ref">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", opacity: 0.5 }}>
          &copy; 2026 Rajath O S. All rights reserved. Crafted in Bengaluru.
        </span>

        <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }} className="footer-links">
          {[
            { label: "LinkedIn", url: "https://www.linkedin.com/in/rajath-os/" },
            { label: "GitHub", url: "https://github.com/rajathos07" }
          ].map(s => (
            <a 
              key={s.label} 
              href={s.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover-bracket-link" 
              style={{
                fontSize: "0.72rem",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase"
              }}
            >
              {s.label} ↗
            </a>
          ))}
        </div>

        <a 
          href="https://drive.google.com/file/d/17GBGLCzu9BwmZLYxAdkFQRlzdRQQW75M/view?usp=drive_link"
          target="_blank" 
          rel="noopener noreferrer"
          className="folder-tab"
          style={{ height: "34px", textDecoration: "none", color: "inherit", justifySelf: "end" }}
        >
          Resume ↓
        </a>
      </div>
    </footer>
  );
}

// ─── MAIN APPLICATION REDESIGN ────────────────────────────────────────────────

export default function PortfolioRedesign() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const eduRef = useRef(null);
  const contactRef = useRef(null);

  // Set section refs to dynamically control scroll background themes
  const sectionsRef = useRef([
    { id: "hero", ref: heroRef, theme: "light" },
    { id: "about", ref: aboutRef, theme: "light" },
    { id: "skills", ref: skillsRef, theme: "light" },
    // Projects Carousel is styled dark to copy ref.digital's case study highlight!
    { id: "projects", ref: projectsRef, theme: "dark" },
    { id: "education", ref: eduRef, theme: "light" },
    { id: "contact", ref: contactRef, theme: "light" }
  ]);

  const activeTheme = useScrollSectionTheme(sectionsRef);

  return (
    <>
      <style>{`
        /* Responsive CSS utilities to clean up layouts on tablet & mobile */
        @media (max-width: 1024px) {
          .hero-bottom-bar {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .carousel-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .about-grid-ref {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .skills-grid-ref {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .skills-grid-ref > div:first-child {
            position: relative !important;
            top: 0 !important;
          }
          .edu-grid-ref {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .contact-grid-ref {
            grid-template-columns: 1fr !important;
            gap: 3.5rem !important;
          }
        }

        @media (max-width: 768px) {
          .nav-links-container,
          .clock-span {
            display: none !important;
          }
          .navbar-ref {
            height: 60px !important;
          }
          .hero-meta-row > div:nth-child(2),
          .hero-meta-row > div:nth-child(3) {
            display: none !important;
          }
          .project-table-header {
            display: none !important;
          }
          .project-row-ref {
            grid-template-columns: 1fr auto !important;
            padding: 1.5rem 0.5rem !important;
            gap: 1rem;
          }
          .project-row-ref > span:nth-child(1),
          .project-row-ref > span:nth-child(3) {
            display: none !important;
          }
          .edu-details-row {
            gap: 1.5rem !important;
          }
          .footer-cols-ref {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
            text-align: center;
          }
          .footer-links {
            justify-content: center !important;
          }
          .footer-cols-ref > a {
            justify-self: center !important;
          }
        }
      `}</style>

      {/* Setup Premium Elements */}
      <CurtainLoader />
      <CursorFollower />

      <div ref={containerRef} className={`page-theme-container theme-${activeTheme}`}>
        <Navbar />
        <AmbientGlows theme={activeTheme} />

        {/* Hero Section */}
        <div ref={heroRef}>
          <HeroSection />
        </div>

        {/* Infinite Scrolling Tech Marquee */}
        <MarqueeBand />

        {/* About Section */}
        <div ref={aboutRef}>
          <AboutSection />
        </div>

        {/* Skills Section */}
        <div ref={skillsRef}>
          <SkillsSection />
        </div>

        {/* Project Section (Carousel + Interactive List) */}
        <div ref={projectsRef}>
          <ProjectsCarousel />
          <ProjectsListSection />
        </div>

        {/* Education Section */}
        <div ref={eduRef}>
          <EducationSection />
        </div>

        {/* Contact Form & CTA Popup */}
        <div ref={contactRef}>
          <ContactSection />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

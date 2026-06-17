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

// Scramble decoder text component
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
        color: "var(--color-action-blue)",
        fontWeight: "inherit",
        transition: "color 0.3s ease",
      }}
      className="clickable"
    >
      {display}
    </span>
  );
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
    github: "https://github.com/rajathos07/AICodeMentor.git"
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
    github: "https://github.com/rajathos07/text_processing.git"
  }
];

const MARQUEE = [
  "React", "Node.js", "Spring Boot", "MongoDB", "MySQL", "Express.js", 
  "JavaScript", "Git", "Vercel", "Groq API", "Gemini API", "OCR", 
  "REST APIs", "JWT Auth", "Full Stack"
];

// ─── SUBCOMPONENTS ──────────────────────────────────────────────────────────

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
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.8 }}
          onAnimationComplete={() => setVisible(false)}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#324a67", color: "var(--color-cloud-white)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center" }}
          >
            <h1 className="air-display" style={{ fontSize: "60px", color: "var(--color-cloud-white)" }}>
              Rajath O S
            </h1>
            <p className="air-caption" style={{ letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "1rem", opacity: 0.8, color: "var(--color-cloud-white)" }}>
              Move Fast. Build to Last.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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

function Reveal({ children, delay = 0, y = 30, scale = 0.97 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1], delay }}
      style={{ transformOrigin: "center center", width: "100%" }}
    >
      {children}
    </motion.div>
  );
}

function AmbientGlows() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 0,
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        top: "10%",
        left: "30%",
        width: "50vw",
        height: "50vw",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)",
        filter: "blur(80px)",
      }} />
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "10%",
        width: "60vw",
        height: "60vw",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 70%)",
        filter: "blur(100px)",
      }} />
    </div>
  );
}

// ─── MAIN PORTFOLIO SECTIONS ────────────────────────────────────────────────

function Navbar() {
  const clock = useClock();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`nav-bar-air ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
        <a href="#hero" className="nav-wordmark" onClick={() => setMenuOpen(false)}>
          RAJATH O S
        </a>

        <div className="nav-menu nav-links-container">
          {["About", "Skills", "Projects", "Education"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">
              {item}
            </a>
          ))}
        </div>

        <div className="nav-right-container" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span className="pulse-live-dot desktop-only-dot" />
          
          <span className="air-caption clock-span" style={{ opacity: 0.8, fontFamily: "monospace", fontWeight: "bold" }}>
            LIVE // {clock || "00:00:00 PM"}
          </span>
          
          <a 
            href="https://drive.google.com/file/d/17GBGLCzu9BwmZLYxAdkFQRlzdRQQW75M/view?usp=drive_link" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ghost-btn-charcoal nav-btn-resume"
          >
            Resume ↓
          </a>
          
          <a href="#contact" className="action-pill nav-btn-contact">
            Contact
          </a>
        </div>

        {/* Hamburger Toggle Button (mobile only) */}
        <button 
          className="nav-hamburger" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
        </button>
      </nav>

      {/* Mobile Drawer Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="mobile-menu-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-menu-links">
              {["About", "Skills", "Projects", "Education"].map((item, idx) => (
                <motion.a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="mobile-nav-link"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.3 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
            
            <div className="mobile-menu-actions">
              <a 
                href="https://drive.google.com/file/d/17GBGLCzu9BwmZLYxAdkFQRlzdRQQW75M/view?usp=drive_link" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ghost-btn-charcoal mobile-action-btn"
                onClick={() => setMenuOpen(false)}
              >
                Resume ↓
              </a>
              <a 
                href="#contact" 
                className="action-pill mobile-action-btn"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </a>
            </div>

            <div className="mobile-menu-footer">
              <span className="pulse-live-dot" />
              <span className="air-caption" style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                LIVE // {clock || "00:00:00 PM"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xOffset = (clientX - window.innerWidth / 2) * 0.04;
    const yOffset = (clientY - window.innerHeight / 2) * 0.04;
    mouseX.set(xOffset);
    mouseY.set(yOffset);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 15 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 15 });

  return (
    <section id="hero" className="sky-section" style={{ minHeight: "100vh", paddingTop: "calc(var(--header-height) + 1.5rem)", display: "flex", flexDirection: "column" }}>
      {/* Floating glass shapes */}
      <motion.img 
        src="/frosted_glass_hero.png" 
        className="glass-visual-wrap glass-visual-hero" 
        alt="Frosted Glass shapes"
        style={{ x: smoothX, y: smoothY }}
      />

      {/* Responsive watermark */}
      <motion.div 
        className="air-display" 
        style={{ 
          position: "absolute", 
          top: "22%", 
          left: "5%", 
          width: "90%",
          opacity: 0.15, 
          WebkitTextStroke: "1px rgba(255, 255, 255, 0.25)",
          color: "transparent",
          pointerEvents: "none",
          zIndex: 0,
          x: smoothX,
          y: smoothY
        }}
      >
        RAJATH O S
      </motion.div>

      {/* Meta Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.18)",
        paddingBottom: "1rem",
        zIndex: 10
      }} className="hero-meta-row">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--color-cloud-white)" }} />
          <span className="air-caption" style={{ opacity: 0.8 }}>SYSTEM READY // OPEN TO OPPORTUNITIES</span>
        </div>
        <div className="air-caption" style={{ opacity: 0.8 }}>LOC // BENGALURU, IN [12.9716° N]</div>
        <div className="air-caption" style={{ opacity: 0.8 }}>GRAD // BE CS 2026</div>
      </div>

      {/* Hero Content Grid */}
      <div className="hero-grid-ref" style={{
        position: "relative",
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1.25fr 0.75fr",
        gap: "3rem",
        alignItems: "center",
        margin: "auto 0",
        padding: "2rem 0",
        flex: 1
      }}>
        {/* Left column: Text card */}
        <Reveal>
          <div className="card-cloud" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <span className="air-cursive" style={{ color: "var(--color-action-blue)", fontSize: "36px", lineHeight: 1.0 }}>
              Move Fast. Build to Last.
            </span>
            <h1 className="air-heading-lg" style={{ fontWeight: 900, color: "var(--color-charcoal-text)", textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Rajath O S
            </h1>
            <div className="air-heading-sm" style={{ fontWeight: 500, color: "var(--color-charcoal-text)", borderLeft: "4px solid var(--color-action-blue)", paddingLeft: "16px" }}>
              <Scrambler text="Java FullStack Developer" />
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>|</motion.span>
            </div>
            <p className="air-body" style={{ color: "var(--color-charcoal-text)", opacity: 0.8, lineHeight: 1.6 }}>
              Crafting scalable web applications with the MERN stack and Spring Boot. Passionate about clean code and real-world impact.
            </p>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "8px" }}>
              <a href="#projects" className="action-pill">
                Explore Work →
              </a>
              <a href="#contact" className="ghost-btn-charcoal" style={{ fontSize: "13px" }}>
                Get in Touch
              </a>
            </div>
          </div>
        </Reveal>

        {/* Right column: Interactive Visual Card */}
        <Reveal delay={0.15}>
          <div className="card-cloud hero-visual-card" style={{
            position: "relative",
            padding: "20px",
            aspectRatio: "1.1/1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            minHeight: "300px"
          }}>
            {/* Ambient background glow inside the card */}
            <div style={{
              position: "absolute",
              top: "-20%",
              right: "-20%",
              width: "120%",
              height: "120%",
              backgroundImage: "radial-gradient(circle, rgba(43, 127, 255, 0.08) 0%, transparent 60%)",
              pointerEvents: "none"
            }} />

            {/* A micro terminal or stats summary */}
            <div style={{
              backgroundColor: "rgba(0, 0, 0, 0.025)",
              border: "1px solid rgba(0,0,0,0.05)",
              borderRadius: "8px",
              padding: "16px",
              fontFamily: "var(--font-control-tnt)",
              fontSize: "12px",
              lineHeight: "1.6",
              color: "var(--color-charcoal-text)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              zIndex: 1
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "6px" }}>
                <span style={{ color: "var(--color-action-blue)", fontWeight: "bold" }}>SYSTEM_STATS</span>
                <span style={{ opacity: 0.5 }}>v2.4.0</span>
              </div>
              <div><span style={{ opacity: 0.5 }}>$</span> whoami: <span style={{ fontWeight: "bold" }}>rajathos</span></div>
              <div><span style={{ opacity: 0.5 }}>$</span> status: <span style={{ color: "#10b981", fontWeight: "bold" }}>ACTIVE_BUILDER</span></div>
              <div><span style={{ opacity: 0.5 }}>$</span> location: <span style={{ fontWeight: "bold" }}>Bengaluru, IN</span></div>
              <div><span style={{ opacity: 0.5 }}>$</span> core_stack: <span style={{ opacity: 0.8 }}>[Java, Spring, MERN, AI]</span></div>
              <div style={{ marginTop: "auto", display: "flex", gap: "6px", alignItems: "center" }}>
                <span className="pulse-live-dot" style={{ width: 6, height: 6 }} />
                <span style={{ fontSize: "10px", opacity: 0.5 }}>Ready to execute incoming commands...</span>
              </div>
            </div>

            {/* Floating glass prism inside the card */}
            <motion.img 
              src="/glass_prism_hero.png" 
              alt="Glass Sphere" 
              style={{ 
                position: "absolute",
                bottom: "-10px",
                right: "-20px",
                width: "140px",
                height: "auto",
                opacity: 0.95,
                pointerEvents: "none",
                y: smoothY
              }}
            />
          </div>
        </Reveal>
      </div>

      {/* Pulsing Mouse Scroll indicator */}
      <div style={{ zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "0.5rem" }}>
        <span className="air-caption" style={{ opacity: 0.8, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Scroll to Explore</span>
        <div className="scroll-icon-wrap">
          <div className="scroll-icon-dot" />
        </div>
      </div>
    </section>
  );
}

function MarqueeBand() {
  return (
    <div className="infinite-marquee" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderTop: "1px solid rgba(255,255,255,0.12)", borderBottom: "1px solid rgba(255,255,255,0.12)", padding: "16px 0" }}>
      <motion.div 
        className="infinite-marquee-content"
        animate={{ x: [0, "-50%"] }}
        transition={{ ease: "linear", duration: 24, repeat: Infinity }}
        style={{ display: "inline-flex", whiteSpace: "nowrap" }}
      >
        {[...Array(2)].map((_, i) => (
          <span key={i} style={{ display: "inline-flex", gap: "32px", alignItems: "center" }}>
            {MARQUEE.map(item => (
              <span key={item} className="air-mono" style={{
                textTransform: "uppercase",
                opacity: 0.8,
                marginRight: "32px",
                color: "var(--color-cloud-white)"
              }}>
                {item} &nbsp; &bull;
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function AboutSection() {
  const stats = [
    { val: "6+", label: "Projects Built" },
    { val: "5+", label: "Tech Stacks" },
    { val: "2026", label: "Graduated" },
    { val: "BLR", label: "Based In" }
  ];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xOffset = (clientX - window.innerWidth / 2) * -0.03;
    const yOffset = (clientY - window.innerHeight / 2) * -0.03;
    mouseX.set(xOffset);
    mouseY.set(yOffset);
  };

  return (
    <section id="about" className="sky-section" onMouseMove={handleMouseMove}>
      <motion.img 
        src="/frosted_glass_panel.png" 
        className="glass-visual-wrap glass-visual-panel" 
        alt="Frosted Glass Panel"
        style={{ x: mouseX, y: mouseY }}
      />

      <div style={{
        position: "relative",
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1.6fr 1.4fr",
        gap: "4rem"
      }} className="about-grid-ref">
        
        {/* Left Side Narrative */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          <Reveal>
            <h2 className="air-cursive-lg" style={{ color: "var(--color-cloud-white)" }}>
              Building for the web, one clean line at a time.
            </h2>
          </Reveal>
          
          <Reveal delay={0.1}>
            <div className="card-cloud" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <p className="air-body" style={{ lineHeight: 1.6 }}>
                I'm an aspiring Full Stack Developer passionate about crafting modern, user-friendly web applications. Having graduated with a BE in Computer Science from GM Institute of Technology, Davanagere, in 2026.
              </p>
              <p className="air-body" style={{ lineHeight: 1.6 }}>
                My focus is on building scalable, maintainable solutions with the MERN stack and Java backend technologies. Driven by continuous learning and a passion for impactful software.
              </p>
            </div>
          </Reveal>

          {/* Social Contacts Card */}
          <Reveal delay={0.2}>
            <div className="card-cloud about-links-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
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
                  className="card-haze"
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "100px"
                  }}
                >
                  <span className="air-caption" style={{ opacity: 0.5, fontWeight: "bold" }}>{c.label}</span>
                  <span style={{ fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{c.val}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right Side Portrait & Stats Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          
          <Reveal>
            <div className="card-cloud" style={{ padding: "12px", display: "flex", justifyContent: "center" }}>
              <div className="image-frame" style={{ width: "100%" }}>
                <img 
                  src="/src/assets/hero.png" 
                  alt="Portrait" 
                  style={{ width: "100%", height: "auto", display: "block", filter: "contrast(102%)" }} 
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </div>
          </Reveal>

          {/* Stats Grid */}
          <Reveal delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {stats.map(s => (
                <div key={s.label} className="card-haze" style={{ textAlign: "center" }}>
                  <div className="air-heading-lg" style={{ color: "var(--color-action-blue)", fontWeight: 900, lineHeight: 1 }}>
                    {s.val}
                  </div>
                  <div className="air-caption" style={{ opacity: 0.6, marginTop: "0.5rem", fontWeight: "bold", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xOffset = (clientX - window.innerWidth / 2) * 0.035;
    const yOffset = (clientY - window.innerHeight / 2) * -0.035;
    mouseX.set(xOffset);
    mouseY.set(yOffset);
  };

  return (
    <section id="skills" className="sky-section" onMouseMove={handleMouseMove}>
      <motion.img 
        src="/frosted_glass_ribbon.png" 
        className="glass-visual-wrap glass-visual-ribbon" 
        alt="Frosted Glass Ribbon"
        style={{ x: mouseX, y: mouseY }}
      />

      <div style={{
        position: "relative",
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: "4rem"
      }} className="skills-grid-ref">
        
        <div style={{ position: "sticky", top: "120px" }}>
          <Reveal>
            <h2 className="air-cursive-lg" style={{ color: "var(--color-cloud-white)" }}>
              Core Stack & Capabilities.
            </h2>
            <p className="air-body" style={{ marginTop: "1.5rem", opacity: 0.8, lineHeight: 1.6 }}>
              A curated suite of modern web standards, API protocols, database utilities, and generative AI configurations.
            </p>
          </Reveal>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {Object.entries(SKILLS).map(([cat, list], idx) => (
            <Reveal key={cat} delay={idx * 0.08}>
              <div className="card-cloud" style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 3.5fr",
                gap: "24px",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className="air-caption" style={{ opacity: 0.4, fontFamily: "monospace" }}>0{idx+1}/</span>
                  <h3 className="air-heading-sm" style={{ fontWeight: 700, textTransform: "uppercase" }}>{cat}</h3>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {list.map(sk => (
                    <span 
                      key={sk} 
                      className="card-haze"
                      style={{
                        padding: "6px 14px",
                        fontSize: "13px",
                        borderRadius: "8px",
                        border: "1px solid rgba(0,0,0,0.03)"
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

function ProjectsCarousel() {
  const [index, setIndex] = useState(0);
  const autoplayTimer = useRef(null);
  const slideDuration = 6000;

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
    <section style={{ position: "relative", padding: "6rem var(--grid-margin)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="card-cloud carousel-grid" style={{
        position: "relative",
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1.2fr 1.8fr",
        gap: "4rem",
        alignItems: "center"
      }}>
        
        {/* Left Side: Info details */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", minHeight: "380px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
              <span className="air-caption" style={{ color: "var(--color-action-blue)", fontWeight: "bold" }}>
                CASE: {activeProject.ref}
              </span>
              <span style={{ width: 1, height: 12, backgroundColor: "rgba(0,0,0,0.1)" }} />
              <span className="air-caption" style={{ opacity: 0.5 }}>{activeProject.year}</span>
            </div>

            <h2 className="air-heading" style={{ marginBottom: "1.5rem", fontWeight: 700 }}>
              {activeProject.title}
            </h2>
            
            <p className="air-body" style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: "2rem" }}>
              {activeProject.desc}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "2rem" }}>
              {activeProject.tech.map(t => (
                <span key={t} className="card-haze" style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  borderRadius: "6px"
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {activeProject.live && (
              <a href={activeProject.live} target="_blank" rel="noopener noreferrer" className="action-pill">
                Live Site ↗
              </a>
            )}
            <a href={activeProject.github} target="_blank" rel="noopener noreferrer" className="ghost-btn-charcoal" style={{ fontSize: "13px" }}>
              GitHub Repo
            </a>
          </div>
        </div>

        {/* Right Side: Interactive Mockup Display */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/10" }}>
          <div style={{
            width: "100%",
            height: "100%",
            backgroundColor: "var(--color-haze-grey)",
            borderRadius: "14px",
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative"
          }}>
            {/* Window bar */}
            <div style={{
              height: "36px",
              backgroundColor: "rgba(0,0,0,0.03)",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 1rem"
            }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.15)" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.15)" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.15)" }} />
              </div>
              <span className="air-caption" style={{ opacity: 0.5 }}>
                {activeProject.title.toLowerCase().replace(/\s+/g, "-")}.config
              </span>
              <div style={{ width: 30 }} />
            </div>

            {/* Screen */}
            <div style={{ flex: 1, padding: "2rem", fontFamily: "monospace", fontSize: "12px", color: "var(--color-charcoal-text)", overflow: "hidden", position: "relative" }}>
              {index === 0 ? (
                /* AI CODE MENTOR LOGS */
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", height: "100%" }}>
                  <div><span style={{ color: "var(--color-action-blue)" }}>import</span> AI <span style={{ color: "var(--color-action-blue)" }}>from</span> <span style={{ opacity: 0.8 }}>"@groq/sdk"</span>;</div>
                  <div><span style={{ color: "var(--color-action-blue)" }}>const</span> mentor = <span style={{ color: "var(--color-action-blue)" }}>new</span> AI.Mentor();</div>
                  <div style={{ color: "rgba(0,0,0,0.4)" }}>// Analysing dynamic schemas...</div>
                  <div><span style={{ color: "var(--color-action-blue)" }}>await</span> mentor.review(database.schema);</div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key="mentor-notif"
                    style={{
                      marginTop: "auto",
                      backgroundColor: "var(--color-cloud-white)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-action-blue)", fontSize: "11px", fontWeight: "bold" }}>
                      <span>💡 SYSTEM RECOMMENDATION</span>
                      <span>JWT: OK</span>
                    </div>
                    <p style={{ color: "var(--color-charcoal-text)", fontSize: "11px", opacity: 0.8 }}>
                      Database optimization found: Index queries in User schemas to improve search speed by 40%.
                    </p>
                  </motion.div>
                </div>
              ) : (
                /* AI EXAM EVALUATION MOCKUP */
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", height: "100%", color: "var(--color-charcoal-text)" }}>
                  <div style={{ borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "bold" }}>OCR EXTRACTOR</span>
                    <span style={{ color: "var(--color-action-blue)", fontWeight: "bold" }}>COMPLETED</span>
                  </div>
                  
                  <div style={{ fontStyle: "italic", opacity: 0.7, fontSize: "11px" }}>
                    "Answer: React utilizes a virtual DOM to optimize client updates. It renders elements dynamically."
                  </div>

                  <div style={{ borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: "0.5rem" }}>
                    <span style={{ color: "var(--color-action-blue)" }}>Gemini Kannada Translation:</span>
                    <p style={{ opacity: 0.7, fontSize: "11px", marginTop: "4px" }}>
                      ರಿಯಾಕ್ಟ್ ಕ್ಲೈಂಟ್ ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಆಪ್ಟಿಮೈಸ್ ಮಾಡಲು ವರ್ಚುವಲ್ DOM ಅನ್ನು ಬಳಸುತ್ತದೆ...
                    </p>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, rotate: -2 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    key="exam-score"
                    style={{
                      marginTop: "auto",
                      alignSelf: "flex-end",
                      backgroundColor: "rgba(43, 127, 255, 0.1)",
                      border: "1px solid var(--color-action-blue)",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      color: "var(--color-action-blue)",
                      fontWeight: "bold"
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

      {/* Carousel Controls */}
      <div className="carousel-controls" style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "3rem"
      }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={prevSlide} className="ghost-btn-white">
            Prev Slide
          </button>
          <button onClick={nextSlide} className="ghost-btn-white">
            Next Slide
          </button>
        </div>

        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {PROJECTS.map((proj, idx) => (
            <button 
              key={proj.num} 
              onClick={() => setIndex(idx)}
              style={{
                background: "none",
                border: "none",
                fontFamily: "monospace",
                fontSize: "13px",
                color: index === idx ? "var(--color-cloud-white)" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                transition: "color 0.3s"
              }}
            >
              {proj.num} — {proj.tag.split(" · ")[0]}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsListSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Spring physics mouse follow rotation
  const rotateVal = useMotionValue(0);
  const rotateSpring = useSpring(rotateVal, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    rotateVal.set(e.movementX * 1.2);
  };

  return (
    <section id="projects" className="sky-section">
      <div className="card-cloud">
        <span className="air-caption" style={{ opacity: 0.5, fontWeight: "bold", textTransform: "uppercase" }}>03 // Archive Directory</span>
        
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "0.8fr 3fr 1.5fr 1fr",
          padding: "1.5rem 1rem",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          opacity: 0.5,
          marginTop: "2rem"
        }} className="project-table-header">
          <span className="air-caption" style={{ fontWeight: "bold" }}>No.</span>
          <span className="air-caption" style={{ fontWeight: "bold" }}>Project Title</span>
          <span className="air-caption" style={{ fontWeight: "bold" }}>Scope</span>
          <span className="air-caption" style={{ fontWeight: "bold", textAlign: "right" }}>Year</span>
        </div>

        {/* Directory body */}
        <div style={{ position: "relative" }} className="row-focus-container">
          {PROJECTS.map((proj, idx) => (
            <Reveal key={proj.num} delay={idx * 0.1}>
              <a 
                href={proj.github} 
                target="_blank" 
                rel="noopener noreferrer"
                data-cursor="project"
                data-cursor-text="CODE ↗"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  rotateVal.set(0);
                }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.8fr 3fr 1.5fr 1fr",
                  padding: "2.5rem 1rem",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "none"
                }}
                className="project-row-air clickable"
              >
                <span style={{ fontFamily: "monospace", fontSize: "14px", opacity: 0.4 }}>{proj.num}</span>
                <h3 className="air-heading-sm" style={{ fontWeight: 500 }}>{proj.title}</h3>
                <span className="air-caption" style={{ opacity: 0.6 }}>{proj.tag}</span>
                <span style={{ fontFamily: "monospace", fontSize: "14px", textAlign: "right", opacity: 0.8 }}>{proj.year}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Floating Mouse-follow Preview Card */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="floating-preview-card"
            style={{
              left: mousePos.x + 24,
              top: mousePos.y + 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              rotate: rotateSpring
            }}
          >
            <div style={{ color: "var(--color-charcoal-text)", padding: "1.5rem", textAlign: "center" }}>
              <span className="air-caption" style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem" }}>
                {PROJECTS[hoveredIndex].title}
              </span>
              <span className="air-caption" style={{ opacity: 0.6, fontSize: "11px" }}>
                {PROJECTS[hoveredIndex].tag}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const EDUCATION_ITEMS = [
  {
    type: "BACHELOR OF ENGINEERING",
    title: "GM Institute of Technology",
    loc: "Davanagere, Karnataka, India",
    year: "Graduated 2026",
    desc: "Graduated with a Bachelor of Engineering in Computer Science and Engineering. Developed comprehensive technical systems, focusing on Object-Oriented methodologies, Database Architecture, and modular Java Backend structures. Completed training modules in web technologies and OCR data processing.",
    details: [
      ["Degree", "B.E. CS & Eng."],
      ["Status", "Completed"],
      ["Focus Area", "Fullstack Development"]
    ],
    showCurriculum: true
  }
];


const CURRICULUM_DATA = {
  "Core CS": ["Data Structures", "Algorithms", "Object-Oriented Programming", "Computer Networks", "Operating Systems"],
  "Full Stack": ["React.js", "Node.js", "Express.js", "Servlets & JSP", "REST APIs", "JDBC"],
  "Databases & AI": ["MySQL", "MongoDB", "Groq API", "Gemini API", "OCR Integration"]
};

function EducationSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [activeTab, setActiveTab] = useState("Core CS");

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xOffset = (clientX - window.innerWidth / 2) * -0.025;
    const yOffset = (clientY - window.innerHeight / 2) * 0.025;
    mouseX.set(xOffset);
    mouseY.set(yOffset);
  };

  return (
    <section id="education" className="sky-section" onMouseMove={handleMouseMove}>
      <motion.img 
        src="/frosted_glass_college.png" 
        className="glass-visual-wrap glass-visual-ribbon" 
        alt="Frosted glass college graduation cap and diploma backdrop" 
        style={{ x: mouseX, y: mouseY, bottom: "10%", left: "5%" }}
      />

      <div style={{
        position: "relative",
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1fr 2.2fr",
        gap: "4rem"
      }} className="edu-grid-ref">
        
        <Reveal>
          <span className="air-caption" style={{ opacity: 0.6, fontWeight: "bold", textTransform: "uppercase" }}>04 // ACADEMIC RECORD</span>
          <h2 className="air-cursive-lg" style={{ color: "var(--color-cloud-white)", marginTop: "1rem" }}>
            Academic Background.
          </h2>
        </Reveal>

        {/* Vertical Timeline Card Re-engineering */}
        <Reveal delay={0.1}>
          <div style={{ position: "relative", paddingLeft: "45px" }}>
            {/* Dashed background track */}
            <div style={{
              position: "absolute",
              top: "12px",
              bottom: "12px",
              left: "19px",
              width: "2px",
              background: "linear-gradient(to bottom, var(--color-action-blue) 0%, rgba(255, 255, 255, 0.15) 100%)",
              zIndex: 1
            }} />
            
            <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
              {EDUCATION_ITEMS.map((edu) => (
                <div key={edu.title} style={{ position: "relative" }}>
                  
                  {/* Timeline Pulse Node */}
                  <span 
                    className="timeline-pulse-node" 
                    style={{ 
                      top: "28px", 
                      left: "-34px", 
                      width: "16px", 
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-cloud-white)",
                      border: "4px solid var(--color-action-blue)",
                      boxShadow: "0 0 0 6px rgba(43, 127, 255, 0.15)",
                      zIndex: 2,
                      transform: "translateX(-50%)"
                    }} 
                  />

                  <div className="card-cloud">
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", alignItems: "flex-start" }}>
                      <div>
                        <span className="air-caption" style={{ color: "var(--color-action-blue)", display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                          {edu.type}
                        </span>
                        <h3 className="air-heading" style={{ fontWeight: 800 }}>
                          {edu.title}
                        </h3>
                        <p className="air-caption" style={{ opacity: 0.6, marginTop: "0.3rem" }}>{edu.loc}</p>
                      </div>
                      
                      <span className="action-pill" style={{ height: "fit-content", pointerEvents: "none" }}>
                        {edu.year}
                      </span>
                    </div>

                    <p className="air-body" style={{ lineHeight: 1.7, marginBottom: "1.5rem", opacity: 0.85 }}>
                      {edu.desc}
                    </p>

                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "20px",
                      borderTop: "1px solid rgba(0,0,0,0.08)",
                      paddingTop: "1.5rem"
                    }} className="edu-details-row">
                      {edu.details.map(([lbl, val]) => (
                        <div key={lbl}>
                          <div className="air-caption" style={{ opacity: 0.5, marginBottom: "0.4rem", fontWeight: "bold", textTransform: "uppercase" }}>{lbl}</div>
                          <div style={{ fontWeight: 600, fontSize: "14px" }}>{val}</div>
                        </div>
                      ))}
                    </div>

                    {edu.showCurriculum && (
                      <div style={{ marginTop: "2rem", borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "1.5rem" }}>
                        <span className="air-caption" style={{ display: "block", marginBottom: "1rem", fontWeight: "bold", opacity: 0.6, textTransform: "uppercase" }}>
                          Curriculum Focus & Course Mastery
                        </span>
                        
                        {/* Tabs */}
                        <div style={{ display: "flex", gap: "8px", marginBottom: "1.2rem", flexWrap: "wrap" }}>
                          {Object.keys(CURRICULUM_DATA).map(tab => (
                            <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className="clickable"
                              style={{
                                padding: "6px 14px",
                                fontSize: "12.5px",
                                borderRadius: "20px",
                                border: activeTab === tab ? "1px solid var(--color-action-blue)" : "1px solid rgba(0,0,0,0.08)",
                                backgroundColor: activeTab === tab ? "rgba(43, 127, 255, 0.08)" : "transparent",
                                color: activeTab === tab ? "var(--color-action-blue)" : "var(--color-charcoal-text)",
                                cursor: "pointer",
                                fontWeight: activeTab === tab ? 600 : 500,
                                transition: "all 0.25s ease"
                              }}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>

                        {/* Course tags */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {CURRICULUM_DATA[activeTab].map(course => (
                            <motion.span
                              key={course}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className="card-haze"
                              style={{
                                padding: "6px 12px",
                                fontSize: "13px",
                                borderRadius: "8px",
                                fontWeight: 500,
                                border: "1px solid rgba(0, 0, 0, 0.02)"
                              }}
                              whileHover={{ scale: 1.05, borderColor: "rgba(43, 127, 255, 0.2)", color: "var(--color-action-blue)" }}
                            >
                              {course}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

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
    <section id="contact" className="sky-section">
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1.2fr 1.8fr",
        gap: "4rem"
      }} className="contact-grid-ref">
        
        {/* Left Side: Call to Action */}
        <div>
          <Reveal>
            <span className="air-caption" style={{ color: "var(--color-cloud-white)", display: "block", marginBottom: "1rem", fontWeight: "bold" }}>
              Let's Collaborate
            </span>
            <h2 className="air-cursive-lg" style={{ color: "var(--color-cloud-white)", lineHeight: 0.95, marginBottom: "2rem" }}>
              Ready to build something great?
            </h2>
            <p className="air-body" style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: "3rem" }}>
              Open to fresher roles, internships, and exciting projects. Let's design modular software together.
            </p>
          </Reveal>

          {/* Contact info card */}
          <Reveal delay={0.1}>
            <div className="card-cloud" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Email", val: "rajathos07@gmail.com", href: "mailto:rajathos07@gmail.com" },
                { label: "LinkedIn", val: "linkedin.com/in/rajath-os", href: "https://www.linkedin.com/in/rajath-os/" }
              ].map(c => (
                <a 
                  key={c.label} 
                  href={c.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="card-haze"
                  style={{
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "1rem 1.2rem", 
                    textDecoration: "none"
                  }}
                >
                  <span className="air-caption" style={{ opacity: 0.5, fontWeight: "bold" }}>{c.label}</span>
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>{c.val}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right Side: Form Inputs inside Card */}
        <Reveal delay={0.15}>
          <div className="card-cloud" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div>
              <span className="air-caption" style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Name</span>
              <input 
                className="input-air"
                name="name" 
                value={form.name} 
                onChange={handle} 
                type="text" 
                placeholder="Rajath O S" 
                required 
              />
            </div>

            <div>
              <span className="air-caption" style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Email</span>
              <input 
                className="input-air"
                name="email" 
                value={form.email} 
                onChange={handle} 
                type="email" 
                placeholder="rajathos07@gmail.com" 
                required 
              />
            </div>

            <div>
              <span className="air-caption" style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Message</span>
              <textarea 
                className="input-air"
                name="message" 
                value={form.message} 
                onChange={handle} 
                rows={5} 
                placeholder="Describe your requirements..." 
                required 
              />
            </div>

            <button 
              onClick={submit} 
              className="action-pill clickable"
              style={{
                height: "48px",
                width: "100%",
                fontWeight: "bold",
                backgroundColor: sent ? "var(--color-action-blue)" : "transparent",
                color: sent ? "var(--color-cloud-white)" : "var(--color-action-blue)",
                borderColor: "var(--color-action-blue)",
                transition: "all 0.3s ease",
                borderRadius: "8px"
              }}
              data-cursor="link"
            >
              {sent ? "✓ Message Sent!" : "Send Message"}
            </button>

          </div>
        </Reveal>

      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ position: "relative", backgroundColor: "rgba(255, 255, 255, 0.04)", borderTop: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
      {/* Seamless Infinite Marquee with Framer Motion */}
      <div style={{ overflow: "hidden", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", padding: "1.5rem 0" }}>
        <motion.div 
          className="infinite-marquee-content"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 18, repeat: Infinity }}
          style={{ display: "inline-flex", whiteSpace: "nowrap" }}
        >
          {[...Array(8)].map((_, i) => (
            <span key={i} className="air-cursive-lg" style={{
              fontWeight: 700,
              color: i % 2 === 0 ? "var(--color-action-blue)" : "transparent",
              WebkitTextStroke: i % 2 === 0 ? "none" : "1.5px var(--color-action-blue)",
              paddingRight: "5rem",
              lineHeight: 1
            }}>
              Rajath O S
            </span>
          ))}
        </motion.div>
      </div>

      <div style={{
        maxWidth: "1440px",
        margin: "0 auto",
        padding: "4rem var(--grid-margin)",
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr 1fr",
        alignItems: "center",
        gap: "2rem"
      }} className="footer-cols-ref">
        <span className="air-caption" style={{ opacity: 0.8, color: "var(--color-cloud-white)" }}>
          &copy; 2026 Rajath O S. All rights reserved. Crafted in Bengaluru.
        </span>

        <div style={{ display: "flex", gap: "24px", justifyContent: "center" }} className="footer-links">
          {[
            { label: "LinkedIn", url: "https://www.linkedin.com/in/rajath-os/" },
            { label: "GitHub", url: "https://github.com/rajathos07" }
          ].map(s => (
            <a 
              key={s.label} 
              href={s.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link" 
              style={{ fontSize: "13px", color: "var(--color-cloud-white)" }}
            >
              {s.label} ↗
            </a>
          ))}
        </div>

        <a 
          href="https://drive.google.com/file/d/17GBGLCzu9BwmZLYxAdkFQRlzdRQQW75M/view?usp=drive_link"
          target="_blank" 
          rel="noopener noreferrer"
          className="ghost-btn-white"
          style={{ justifySelf: "end" }}
        >
          Resume ↓
        </a>
      </div>
    </footer>
  );
}

// ─── MAIN PORTFOLIO COMPONENT ───────────────────────────────────────────────

export default function PortfolioRedesign() {
  return (
    <>
      <style>{`
        /* Hamburger Button */
        .nav-hamburger {
          display: none;
          background: none;
          border: none;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          padding: 8px;
          z-index: 600;
        }

        .hamburger-line {
          display: block;
          width: 24px;
          height: 2px;
          background-color: var(--color-charcoal-text);
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
        }

        /* Animate hamburger to X when open */
        .hamburger-line.open:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .hamburger-line.open:nth-child(2) {
          opacity: 0;
        }
        .hamburger-line.open:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* Mobile Drawer Menu */
        .mobile-menu-overlay {
          position: fixed;
          top: 90px;
          left: 20px;
          right: 20px;
          background-color: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(43, 127, 255, 0.25);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          z-index: 499;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .mobile-menu-links {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          padding-bottom: 1.5rem;
        }

        .mobile-nav-link {
          font-size: 20px;
          font-weight: 700;
          color: var(--color-charcoal-text);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: color 0.3s;
        }

        .mobile-nav-link:hover {
          color: var(--color-action-blue);
        }

        .mobile-menu-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-action-btn {
          width: 100%;
          text-align: center;
          padding: 12px 18px !important;
          box-sizing: border-box;
        }

        .mobile-menu-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 0.5rem;
          color: var(--color-charcoal-text);
          opacity: 0.6;
        }

        /* Responsive CSS overrides for viewport matching */
        @media (max-width: 1024px) {
          .hero-grid-ref {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
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
          .clock-span,
          .nav-btn-resume,
          .nav-btn-contact,
          .desktop-only-dot {
            display: none !important;
          }
          .nav-hamburger {
            display: flex !important;
          }
          .nav-bar-air {
            height: 60px !important;
            top: 15px !important;
            width: calc(100% - 30px) !important;
            padding: 0 20px !important;
          }
          .nav-bar-air.scrolled {
            top: 10px !important;
          }
          .mobile-menu-overlay {
            top: 85px !important;
            left: 15px !important;
            right: 15px !important;
          }
          .air-display {
            font-size: clamp(2.5rem, 8vw, 4.5rem) !important;
          }
          .hero-meta-row {
            flex-direction: column;
            gap: 0.5rem;
            align-items: center;
            text-align: center;
          }
          .hero-meta-row > div:nth-child(2),
          .hero-meta-row > div:nth-child(3) {
            display: none !important;
          }
          .about-links-grid {
            grid-template-columns: 1fr !important;
          }
          .skills-grid-ref .card-cloud {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .carousel-controls {
            flex-direction: column !important;
            gap: 1.5rem !important;
            align-items: center !important;
          }
          .project-table-header {
            display: none !important;
          }
          .project-row-air {
            grid-template-columns: 1fr auto !important;
            padding: 1.5rem 0.5rem !important;
            gap: 1rem;
          }
          .project-row-air > span:nth-child(1),
          .project-row-air > span:nth-child(3) {
            display: none !important;
          }
          .edu-details-row {
            grid-template-columns: 1fr !important;
            gap: 1.2rem !important;
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

      {/* Main Premium Curtains and Cursor */}
      <CurtainLoader />
      <CursorFollower />

      <div className="sky-stage">
        <Navbar />
        <AmbientGlows />

        {/* Sections */}
        <HeroSection />
        <MarqueeBand />
        <AboutSection />
        <SkillsSection />
        <ProjectsCarousel />
        <ProjectsListSection />
        <EducationSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}

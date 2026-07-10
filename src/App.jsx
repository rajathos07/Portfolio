import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import ThreeDCard from './components/ThreeDCard';
import ThreeDWireframe from './components/ThreeDWireframe';

export default function App() {
  // Navigation & Scroll states
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home-section');

  // Form submit state simulation
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle | loading | success | error

  // Project table hover coordinates
  const [hoveredProject, setHoveredProject] = useState(null);
  const projectsCardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth coordinate tracking
  const springX = useSpring(mouseX, { stiffness: 250, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 250, damping: 25 });

  // Handle scroll spy
  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 50);

      const sections = ['home-section', 'about-section', 'skills-section', 'education-section', 'projects-section', 'contact-section'];
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProjectMouseMove = (e) => {
    if (!projectsCardRef.current) return;
    const rect = projectsCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus('loading');
    setTimeout(() => {
      console.log('Specimen Transmission Logged:', formState);
      setFormStatus('success');
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  // Category classes mapping to solid category colors (Iris, Periwinkle, Orchid, etc.)
  const skillsData = [
    { index: '01', title: 'FRONTEND', tags: ['HTML', 'CSS', 'JS'], bgClass: 'card-color-iris' },
    { index: '02', title: 'BACKEND', tags: ['Spring Core', 'Hibernate', 'JDBC', 'JSP'], bgClass: 'card-color-periwinkle' },
    { index: '03', title: 'DATABASE', tags: ['MySQL'], bgClass: 'card-color-orchid' },
    { index: '04', title: 'TOOLS', tags: ['Vercel', 'Render', 'Git', 'GitHub'], bgClass: 'card-color-pale-iris' },
    { index: '05', title: 'AI TOOLS', tags: ['ChatGPT', 'GitHub Copilot', 'Claude', 'Groq API'], bgClass: 'card-color-deep-iris' }
  ];

  const projectsData = [
    {
      num: '01',
      title: 'InstaFoods',
      scope: 'Java • Servlets • JSP • MySQL • Docker',
      desc: 'Architected a full-stack, responsive e-commerce ordering platform with clean DAO isolation and containerized deployment.',
      link: 'https://github.com/rajathos07/InstaFoods'
    },
    {
      num: '02',
      title: 'AI Code Mentor',
      scope: 'MERN • Express • MongoDB • Groq API',
      desc: 'Engineered a developer assistant using the MERN stack and Groq API to deliver real-time code analysis and refactoring recommendations.',
      link: 'https://github.com/rajathos07/AICodeMentor'
    },
    {
      num: '03',
      title: 'Smart Job Portal',
      scope: 'Spring Core • Java • Groq API • MySQL',
      desc: 'Developed a role-based job recruitment engine integrating Groq AI API for automated resume parsing and candidate ranking.',
      link: 'https://github.com/rajathos07/Job-Portal'
    }
  ];

  return (
    <div className="obsidian-canvas">
      
      {/* Blueprint Grid Lines */}
      <div className="lines-wrap">
        <div className="lines-inner">
          <div className="lines-grid"></div>
          <div className="lines-grid"></div>
          <div className="lines-grid"></div>
        </div>
      </div>

      {/* Navigation Header (Sticky Glassmorphism) */}
      <nav className={`unfold-navbar scrolled ${navbarScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-menu-side side-left">
            <a href="#home-section" className={`nav-item-link ${activeSection === 'home-section' ? 'active' : ''}`}>Home</a>
            <a href="#about-section" className={`nav-item-link ${activeSection === 'about-section' ? 'active' : ''}`}>About</a>
            <a href="#skills-section" className={`nav-item-link ${activeSection === 'skills-section' ? 'active' : ''}`}>Skills</a>
          </div>

          <div className="navbar-logo-center">
            <a href="#home-section" className="site-logo">Rajath O S<span className="accent-dot">.</span></a>
          </div>

          <div className="navbar-menu-side side-right">
            <a href="#education-section" className={`nav-item-link ${activeSection === 'education-section' ? 'active' : ''}`}>Education</a>
            <a href="#projects-section" className={`nav-item-link ${activeSection === 'projects-section' ? 'active' : ''}`}>Projects</a>
            <a href="#contact-section" className={`nav-item-link ${activeSection === 'contact-section' ? 'active' : ''}`}>Contact</a>
          </div>
        </div>
      </nav>

      {/* Mobile nav trigger */}
      <button 
        className="mobile-nav-toggle-btn" 
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Toggle menu"
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
          <i className="bi bi-x"></i>
        </button>
        <div className="mobile-nav-menu-links">
          <a href="#home-section" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#about-section" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#skills-section" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Skills</a>
          <a href="#education-section" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Education</a>
          <a href="#projects-section" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Projects</a>
          <a href="#contact-section" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </div>
      </div>

      {/* HERO SECTION */}
      <header className="cover-hero-dashboard" id="home-section">
        <div className="container grid-container-2 hero-dashboard-grid">
          
          {/* Left card: Profile details wrapped in 3D perspective hook */}
          <ThreeDCard>
            <div>
              {/* Promo eyebrow tag (Monad / Origin style) */}
              <div className="promo-eyebrow-badge">MOVE FAST • BUILD TO LAST</div>
              
              {/* Display Headline with mixed italic tension */}
              <h1 className="dashboard-name">Own the <i>code</i>. Build the <i>future</i>.</h1>
              <span className="developer-subheading">| Java FullStack Developer</span>
              
              <p className="profile-intro-text">
                Crafting robust backend schemas in Spring Boot and fluid frontend interfaces. Dedicated to high-fidelity engineering and editorial clarity.
              </p>
              
              {/* Mockup AI query input field */}
              <div className="ai-prompt-wrapper">
                <span className="ai-prompt-text">Review my Spring Boot configuration...</span>
                <button className="ai-prompt-btn" aria-label="Submit prompt">
                  <i className="bi bi-arrow-right-short" style={{ fontSize: '20px' }}></i>
                </button>
              </div>
            </div>
            
            <div className="dashboard-btn-row" style={{ marginTop: '24px' }}>
              <a href="#projects-section" className="btn-primary-blue-pill">
                Explore Work <i className="bi bi-arrow-right" style={{ marginLeft: '4px' }}></i>
              </a>
              <a href="#contact-section" className="btn-ghost-pill">
                Get in Touch
              </a>
            </div>
          </ThreeDCard>

          {/* Right card: System Terminal with 3D Wireframe object */}
          <ThreeDCard>
            <div>
              <div className="stats-card-header">
                <span className="stats-header-title">SYSTEM_STATS</span>
                <span className="stats-version-code">v3.0.0_react</span>
              </div>
              
              <div className="stats-card-body">
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span> <span className="terminal-cmd">whoami:</span> <span className="terminal-val">rajathos</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span> <span className="terminal-cmd">status:</span> <span className="terminal-val status-active">ACTIVE_BUILDER</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span> <span className="terminal-cmd">location:</span> <span className="terminal-val">Bengaluru, IN</span>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span> <span className="terminal-cmd">core_stack:</span> <span className="terminal-val">[Java, Spring, MERN]</span>
                </div>
              </div>
            </div>

            {/* Footer with 3D rotating cube visual */}
            <div className="stats-card-footer">
              <span className="stats-status-indicator">
                <span className="pulse-dot"></span> Ready to execute commands...
              </span>
              
              {/* SVG 3D wireframe interactive object */}
              <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', width: '140px', height: '140px' }}>
                <ThreeDWireframe />
              </div>
            </div>
          </ThreeDCard>

        </div>
      </header>

      {/* ABOUT SECTION */}
      <section className="section-layout" id="about-section">
        <div className="container grid-container-2">
          
          <div className="photo-frame-col">
            <div className="photo-offset-wrapper">
              <div className="photo-offset-frame"></div>
              <img src="/assets/img/profile-img.png" alt="Profile Image" className="photo-profile" />
            </div>
          </div>

          <div className="bio-text-col">
            <span className="section-badge-pre">01 / Biography</span>
            
            {/* Display title with italic tension */}
            <h2 className="section-heading">Simplify the <i>complex</i>.</h2>
            
            <p className="bio-paragraph-intro">Passionate and results-driven Information Science &amp; Engineering student with hands-on experience in full-stack web application development.</p>
            <p className="bio-paragraph">Skilled in architecting robust backend systems in Java/Spring and crafting interactive, modern user experiences. With a solid academic foundation in Core CS Concepts (OOP, DBMS, DSA) and industry-aligned internship exposure at TAP Academy, I focus on building scalable web projects that solve real-world problems.</p>
            
            <div className="details-checklist">
              <div className="details-item">
                <span className="details-label">Degree</span>
                <span className="details-value">B.E. in Information Science</span>
              </div>
              <div className="details-item">
                <span className="details-label">CGPA</span>
                <span className="details-value">8.9 / 10.0</span>
              </div>
              <div className="details-item">
                <span className="details-label">Email</span>
                <span className="details-value">rajathos07@gmail.com</span>
              </div>
              <div className="details-item">
                <span className="details-label">Phone</span>
                <span className="details-value">+91 8660726402</span>
              </div>
              <div className="details-item">
                <span className="details-label">GitHub</span>
                <span className="details-value">github.com/rajathos07</span>
              </div>
              <div className="details-item">
                <span className="details-label">Location</span>
                <span className="details-value">Davangere, KA, India</span>
              </div>
            </div>

            <a href="#contact-section" className="btn-primary-blue-pill">
              Connect With Me <i className="bi bi-arrow-right" style={{ marginLeft: '4px' }}></i>
            </a>
          </div>

        </div>
      </section>

      {/* SKILLS SECTION: Chromatic Category Tiles */}
      <section className="section-layout section-bg-abyss" id="skills-section">
        <div className="container grid-container-2 core-stack-layout">
          
          <div className="core-stack-info">
            <h2 className="cursive-serif-title">Curated <i>capabilities</i>.</h2>
            <p className="core-stack-desc">A curated suite of modern web standards, API protocols, database utilities, and generative AI configurations.</p>
          </div>

          <div className="core-stack-cards-deck">
            {skillsData.map((skill, index) => (
              <motion.div 
                key={index} 
                className={`capability-horizontal-card ${skill.bgClass}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="capability-card-header">
                  <span className="capability-card-index">{skill.index}/</span>
                  <span className="capability-card-title">{skill.title}</span>
                </div>
                <div className="capability-tags-container">
                  {skill.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="capability-tag-pill">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Marquee Banner */}
        <div className="marquee-ticker-wrap">
          <div className="marquee-ticker-inner">
            {['JAVA', 'SPRING CORE', 'HIBERNATE', 'JDBC', 'JSP', 'MYSQL', 'REACT.JS', 'NODE.JS', 'EXPRESS.JS', 'GIT', 'VERCEL', 'GITHUB', 'CLAUDE', 'GROQ API'].map((t, idx) => (
              <React.Fragment key={idx}>
                <span>{t}</span>
                <span className="ticker-dot">•</span>
              </React.Fragment>
            ))}
          </div>
          <div className="marquee-ticker-inner" aria-hidden="true">
            {['JAVA', 'SPRING CORE', 'HIBERNATE', 'JDBC', 'JSP', 'MYSQL', 'REACT.JS', 'NODE.JS', 'EXPRESS.JS', 'GIT', 'VERCEL', 'GITHUB', 'CLAUDE', 'GROQ API'].map((t, idx) => (
              <React.Fragment key={idx}>
                <span>{t}</span>
                <span className="ticker-dot">•</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION TIMELINE: Silver Inverted Card block (breaking dark rhythm) */}
      <section className="section-layout" id="education-section">
        <div className="container">
          
          <div className="section-title-center">
            <span className="section-badge-pre">02 / Specimen</span>
            <h2 className="section-heading-centered">Education &amp; Experience<span className="accent-dot">.</span></h2>
            <p className="section-tagline-center">Chronological overview of my training background and internships.</p>
          </div>

          {/* Silver Inverted Card Container (light surface, black text inside) */}
          <div className="silver-inverted-container-card">
            <div className="resume-split-grid">
              
              {/* Experience */}
              <div className="resume-column">
                <h3 className="resume-title-header"><i className="bi bi-briefcase"></i> Experience</h3>
                
                <motion.div 
                  className="resume-card-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="resume-header">
                    <h4>Full Stack Developer Intern</h4>
                    <span className="date-badge">Jan 2026 — Present</span>
                  </div>
                  <span className="company-sub">TAP Academy, Bengaluru (Remote/Hybrid)</span>
                  <ul className="bullet-list">
                    <li>Collaborated in designing and building full-stack web applications using Java, JSP/Servlets, and MySQL, achieving cross-browser compatibility and optimized page responsiveness.</li>
                    <li>Constructed secure backend modules and RESTful API endpoints using Spring Framework and JDBC, locking sensitive data endpoints with BCrypt authentication protocols.</li>
                    <li>Participated in code reviews and agile sprints, enhancing team collaboration and software quality assurance.</li>
                  </ul>
                </motion.div>
              </div>

              {/* Education */}
              <div className="resume-column">
                <h3 className="resume-title-header"><i className="bi bi-mortarboard"></i> Education</h3>
                
                <motion.div 
                  className="resume-card-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="resume-header">
                    <h4>B.E. in Information Science &amp; Engineering</h4>
                    <span className="date-badge">2022 — 2026</span>
                  </div>
                  <span className="company-sub">GM Institute of Technology, Davangere</span>
                  <p className="resume-description">Focused on Core Computer Science studies, including OOP, Database Management Systems, Data Structures &amp; Algorithms, and computer networking. Maintaining a consistent CGPA of 8.9.</p>
                </motion.div>

                <motion.div 
                  className="resume-card-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="resume-header">
                    <h4>Pre-University Course (2nd PUC)</h4>
                    <span className="date-badge">2020 — 2022</span>
                  </div>
                  <span className="company-sub">Mandaara PU College, Davangere</span>
                  <p className="resume-description">Completed secondary education specializing in Physics, Chemistry, Mathematics, and Computer Science. Graduated with a score of 87%.</p>
                </motion.div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* PROJECTS SECTION: Table directory with Framer Motion cursor follow popups */}
      <section className="section-layout section-bg-abyss" id="projects-section">
        <div className="container">
          
          <div className="section-title-center">
            <span className="section-badge-pre">03 / Portfolio</span>
            <h2 className="section-heading-centered">Archive Directory<span className="accent-dot">.</span></h2>
            <p className="section-tagline-center">A comprehensive directory of my engineered applications, software systems, and AI modules.</p>
          </div>

          <div 
            ref={projectsCardRef}
            className="projects-directory-card"
            onMouseMove={handleProjectMouseMove}
          >
            <div className="directory-card-header">
              <span className="directory-card-title">03 // ARCHIVE DIRECTORY</span>
            </div>

            <div className="directory-table">
              <div className="directory-row header-row">
                <div className="dir-col col-num">No.</div>
                <div className="dir-col col-title">Project Title</div>
                <div className="dir-col col-scope">Scope</div>
                <div className="dir-col col-year">Year</div>
              </div>

              {projectsData.map((project, idx) => (
                <div 
                  key={idx}
                  className="directory-row body-row"
                  onMouseEnter={() => setHoveredProject(project)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => window.open(project.link, '_blank')}
                >
                  <div className="dir-col col-num">{project.num}</div>
                  <div className="dir-col col-title">{project.title}</div>
                  <div className="dir-col col-scope">{project.scope}</div>
                  <div className="dir-col col-year">2026</div>
                </div>
              ))}
            </div>

            {/* Framer Motion GPU-accelerated Cursor follow action badge */}
            <motion.div
              className="hover-circle-badge"
              style={{
                left: springX,
                top: springY,
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: 10
              }}
              animate={{
                opacity: hoveredProject ? 1 : 0,
                scale: hoveredProject ? 1 : 0.6
              }}
              transition={{ duration: 0.2 }}
            >
              <span>CODE ↗</span>
            </motion.div>

            {/* Framer Motion GPU-accelerated Cursor follow Popover popup */}
            <motion.div
              className="hover-preview-card"
              style={{
                left: springX,
                top: springY,
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: 9,
                transform: 'translate(40px, -50%)'
              }}
              animate={{
                opacity: hoveredProject ? 1 : 0,
                scale: hoveredProject ? 1 : 0.9,
                x: 40,
                y: -50
              }}
              transition={{ duration: 0.2 }}
            >
              <h3>{hoveredProject?.title || 'Project'}</h3>
              <p style={{ fontWeight: '700', fontSize: '11px', color: 'var(--color-iris-gleam)' }}>
                {hoveredProject?.scope}
              </p>
              <p style={{ marginTop: '8px', opacity: 0.85 }}>
                {hoveredProject?.desc}
              </p>
            </motion.div>

          </div>

        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="section-layout" id="contact-section">
        <div className="container grid-container-2">
          
          <div className="contact-text-col">
            <span className="section-badge-pre">04 / Connect</span>
            
            {/* Display title with italic tension */}
            <h2 className="section-heading">Simplify your <i>advisory</i>.</h2>
            <p className="contact-sub">Feel free to reach out for internship inquiries, project collaborations, or developer networking.</p>

            <div className="contact-info-list">
              <div className="contact-info-card">
                <div className="card-icon"><i className="bi bi-geo-alt"></i></div>
                <div className="card-text">
                  <h3>Address</h3>
                  <p>Davangere, Karnataka, India - 577002</p>
                </div>
              </div>
              <div className="contact-info-card">
                <div className="card-icon"><i className="bi bi-telephone"></i></div>
                <div className="card-text">
                  <h3>Call Me</h3>
                  <p>+91 8660726402</p>
                </div>
              </div>
              <div className="contact-info-card">
                <div className="card-icon"><i className="bi bi-envelope"></i></div>
                <div className="card-text">
                  <h3>Email Me</h3>
                  <p><a href="mailto:rajathos07@gmail.com">rajathos07@gmail.com</a></p>
                </div>
              </div>
              <div className="contact-info-card">
                <div className="card-icon"><i className="bi bi-linkedin"></i></div>
                <div className="card-text">
                  <h3>LinkedIn</h3>
                  <p><a href="https://linkedin.com/in/rajath-os" target="_blank" rel="noopener noreferrer">linkedin.com/in/rajath-os</a></p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-col">
            <form onSubmit={handleFormSubmit} className="specimen-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-field">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    required 
                    className="form-control-input"
                    value={formState.name}
                    onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    required 
                    className="form-control-input"
                    value={formState.email}
                    onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-field">
                <input 
                  type="text" 
                  placeholder="Subject" 
                  required 
                  className="form-control-input"
                  value={formState.subject}
                  onChange={e => setFormState(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <textarea 
                  rows="4" 
                  placeholder="Your Message" 
                  required 
                  className="form-control-textarea"
                  value={formState.message}
                  onChange={e => setFormState(prev => ({ ...prev, message: e.target.value }))}
                ></textarea>
              </div>

              <div className="form-status">
                {formStatus === 'loading' && <div style={{ color: 'var(--color-fog)', display: 'flex', gap: '8px' }}><i className="bi bi-arrow-repeat spin"></i> Transmitting...</div>}
                {formStatus === 'success' && <div style={{ color: 'var(--color-iris-gleam)' }}><i className="bi bi-check-circle-fill"></i> Delivery successful. Thank you!</div>}
              </div>

              <button type="submit" className="btn-primary-blue-pill" style={{ border: 'none', alignSelf: 'flex-start' }}>
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="unfold-footer">
        <div className="container footer-content-wrap">
          <div className="footer-details-row">
            <h3 className="footer-logo">Rajath O S<span className="accent-dot">.</span></h3>
            <p className="footer-tagline">Building clean backend architectures and dynamic web experiences.</p>
            <div className="footer-social-links">
              <a href="https://github.com/rajathos07" target="_blank" rel="noopener noreferrer"><i className="bi bi-github"></i></a>
              <a href="https://linkedin.com/in/rajath-os" target="_blank" rel="noopener noreferrer"><i className="bi bi-linkedin"></i></a>
              <a href="mailto:rajathos07@gmail.com"><i className="bi bi-envelope-fill"></i></a>
            </div>
          </div>
          
          <div className="footer-divider"></div>
          
          <div className="footer-bottom-row">
            <p className="copyright-info">&copy; 2026 Rajath O S. All Rights Reserved.</p>
            <p className="credits-info">Inspired by <a href="https://themewagon.github.io/unfold/" target="_blank" rel="noopener noreferrer">Unfold</a> &amp; built with React + Framer Motion</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

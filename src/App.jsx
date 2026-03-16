import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// ─── PALETTE: Lilac · White · Golden Olive ─────────────────────────────────
const C = {
  bg:       "#F2F7F2",       // palette white (off-white/mint)
  card:     "#F8F6FB",       // lilac-tinted card
  cardAlt:  "#EEF0E8",       // olive-tinted card
  border:   "#DDD5E8",       // soft lilac border
  border2:  "#DDD8C0",       // olive border
  text:     "#2A2535",       // deep purple-dark
  sub:      "#5E566E",       // muted purple
  muted:    "#9E93AD",       // light lilac muted
  peach:    "#C8A2C8",       // LILAC — primary accent
  peachLt:  "#E4D2E4",       // light lilac
  sage:     "#C2B97F",       // GOLDEN OLIVE — secondary accent
  sageLt:   "#DDD8B0",       // light golden
  amber:    "#A89860",       // deeper olive
  rose:     "#B882B8",       // deeper lilac
  cream:    "#EDE8F5",       // lavender cream
};

function useTyping(words,spd=80,pause=2200){
  const[txt,setTxt]=useState("");const[wi,setWi]=useState(0);
  const[ci,setCi]=useState(0);const[del,setDel]=useState(false);
  useEffect(()=>{
    const w=words[wi%words.length];
    const t=setTimeout(()=>{
      if(!del){setTxt(w.slice(0,ci+1));if(ci+1===w.length)setTimeout(()=>setDel(true),pause);else setCi(c=>c+1);}
      else{setTxt(w.slice(0,ci-1));if(ci-1===0){setDel(false);setWi(x=>x+1);setCi(0);}else setCi(c=>c-1);}
    },del?spd/2:spd);
    return()=>clearTimeout(t);
  },[ci,del,wi,words,spd,pause]);
  return txt;
}

function useClock(){
  const[t,setT]=useState("");
  useEffect(()=>{
    const tick=()=>{const d=new Date();setT(d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true}));};
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[]);
  return t;
}

function useMouse(){
  const x=useMotionValue(-200);const y=useMotionValue(-200);
  const sx=useSpring(x,{stiffness:80,damping:20});const sy=useSpring(y,{stiffness:80,damping:20});
  useEffect(()=>{const fn=e=>{x.set(e.clientX);y.set(e.clientY);};window.addEventListener("mousemove",fn);return()=>window.removeEventListener("mousemove",fn);},[x,y]);
  return{x:sx,y:sy};
}

function Reveal({children,delay=0,y=32}){
  const ref=useRef(null);const inView=useInView(ref,{once:true,amount:0.12});
  return(<motion.div ref={ref} initial={{opacity:0,y}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.75,ease:[0.22,1,0.36,1],delay}}>{children}</motion.div>);
}

function Label({index,text}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1rem"}}>
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"0.78rem",color:C.muted,letterSpacing:"0.08em"}}>{String(index).padStart(2,"0")}</span>
      <div style={{flex:1,height:"1px",background:C.border}}/>
      <span style={{fontFamily:"'Jost',sans-serif",fontSize:"0.68rem",color:C.sage,letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:500}}>{text}</span>
    </div>
  );
}

const SKILLS={Frontend:["HTML","CSS","JavaScript","React"],Backend:["Spring Boot"],Database:["MySQL"],Tools:["Vercel","Render","Git"],"AI Tools":["ChatGPT","GitHub Copilot","Claude"]};
const PROJECTS=[
  {num:"01",title:"AI Code Mentor",year:"2024",tag:"MERN · AI",accent:C.peach,accentLt:C.peachLt,
   desc:"Full-stack AI Code Mentor using MERN stack with Groq API for real-time code analysis and automated debugging. Secure JWT auth, scalable REST APIs.",
   tech:["MongoDB","React.js","Express.js","Node.js","Groq API","JWT"],
   live:"https://ai-code-mentor.vercel.app/",github:"https://github.com/rajathos07/AICodeMentor.git"},
  {num:"02",title:"AI Exam Evaluation & Translation",year:"2024",tag:"OCR · Gemini",accent:C.sage,accentLt:C.sageLt,
   desc:"AI-powered evaluation system using OCR + Google Gemini API to extract handwritten answers, auto-assign marks, and translate across multiple languages.",
   tech:["React.js","Node.js","Express.js","MySQL","OCR","Gemini API"],
   live:null,github:"https://github.com/rajathos07/text_processing.git"},
];
const MARQUEE=["React","Node.js","Spring Boot","MongoDB","MySQL","Express.js","JavaScript","Git","Vercel","Groq API","Gemini API","OCR","REST APIs","JWT Auth","Full Stack"];

function CursorGlow(){
  const{x,y}=useMouse();
  return(<motion.div style={{position:"fixed",left:x,top:y,zIndex:999,width:360,height:360,borderRadius:"50%",background:`radial-gradient(circle, ${C.peach}18 0%, transparent 65%)`,pointerEvents:"none",transform:"translate(-50%,-50%)"}}/>);
}

function Navbar(){
  const[scrolled,setScrolled]=useState(false);const[open,setOpen]=useState(false);const clock=useClock();
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>30);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);
  const links=["About","Skills","Projects","Education","Contact"];
  return(
    <motion.nav initial={{y:-60,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.7,ease:[0.22,1,0.36,1]}}
      style={{position:"fixed",top:0,left:0,right:0,zIndex:500,height:"64px",padding:"0 clamp(1.2rem,4vw,2.5rem)",display:"flex",alignItems:"center",justifyContent:"space-between",
        background:scrolled?"rgba(253,250,246,0.92)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",
        borderBottom:scrolled?`1px solid ${C.border}`:"none",transition:"all 0.4s"}}>
      <a href="#hero" style={{textDecoration:"none"}}>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"1.25rem",color:C.text,letterSpacing:"0.02em",fontStyle:"italic"}}>Portfolio</span>
      </a>
      <div className="nav-links" style={{display:"flex",gap:"2.5rem",alignItems:"center"}}>
        {links.map(l=>(<motion.a key={l} href={`#${l.toLowerCase()}`} whileHover={{y:-1}}
          style={{color:C.muted,textDecoration:"none",fontSize:"0.78rem",letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:500,fontFamily:"'Jost',sans-serif",transition:"color 0.2s"}}
          onMouseEnter={e=>e.target.style.color=C.text} onMouseLeave={e=>e.target.style.color=C.muted}>{l}</motion.a>))}
      </div>
      <div className="nav-right" style={{display:"flex",alignItems:"center",gap:"1.5rem"}}>
        <span style={{fontFamily:"'Jost',sans-serif",fontSize:"0.72rem",color:C.muted,letterSpacing:"0.06em"}}>{clock}</span>
        <motion.a href="https://drive.google.com/file/d/17GBGLCzu9BwmZLYxAdkFQRlzdRQQW75M/view?usp=drive_link"
          target="_blank" rel="noopener noreferrer" whileHover={{scale:1.04}} whileTap={{scale:0.96}}
          style={{padding:"0.45rem 1.2rem",border:`1px solid ${C.border}`,borderRadius:"6px",color:C.text,textDecoration:"none",fontSize:"0.76rem",fontWeight:600,fontFamily:"'Jost',sans-serif",transition:"border-color 0.2s",background:C.cream}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=C.peach}
          onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>Resume ↓</motion.a>
      </div>
      <button onClick={()=>setOpen(!open)} className="hamburger"
        style={{display:"none",background:"none",border:"none",color:C.text,fontSize:"1.3rem",cursor:"pointer"}}>{open?"✕":"☰"}</button>
      <AnimatePresence>{open&&(<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
        style={{position:"absolute",top:"64px",left:0,right:0,background:"rgba(253,250,246,0.98)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`,padding:"1.5rem clamp(1.2rem,4vw,2.5rem)",display:"flex",flexDirection:"column",gap:"1.2rem"}}>
        {links.map(l=>(<a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setOpen(false)} style={{color:C.text,textDecoration:"none",fontSize:"1.1rem",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontStyle:"italic"}}>{l}</a>))}
      </motion.div>)}</AnimatePresence>
    </motion.nav>
  );
}

function Hero(){
  const typed=useTyping(["Full Stack Developer","MERN Stack Engineer","React Developer","Problem Solver"]);
  const{scrollY}=useScroll();
  const bgY=useTransform(scrollY,[0,600],[0,100]);
  const orbs=[
    {w:520,h:520,top:"2%",left:"58%",color:C.peach,dur:16},
    {w:420,h:420,top:"52%",left:"3%",color:C.sage,dur:20},
    {w:320,h:320,top:"22%",left:"28%",color:C.rose,dur:24},
  ];
  return(
    <section id="hero" style={{minHeight:"100vh",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"0 clamp(1.2rem,4vw,3rem) clamp(3rem,6vw,5rem)"}}>
      <motion.div style={{position:"absolute",inset:0,y:bgY,pointerEvents:"none"}}>
        {orbs.map((o,i)=>(
          <motion.div key={i} animate={{x:[0,30*(i%2?1:-1),0],y:[0,-25*(i%2?1:-1),0]}}
            transition={{duration:o.dur,repeat:Infinity,ease:"easeInOut",delay:i*2}}
            style={{position:"absolute",top:o.top,left:o.left,width:o.w,height:o.h,borderRadius:"50%",
              background:`radial-gradient(circle, ${o.color}20 0%, transparent 70%)`,filter:"blur(8px)"}}/>
        ))}
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${C.peach}07 1px,transparent 1px),linear-gradient(90deg,${C.sage}07 1px,transparent 1px)`,backgroundSize:"80px 80px"}}/>
      </motion.div>

      {/* Watermark */}
      <motion.div initial={{opacity:0}} animate={{opacity:0.045}} transition={{duration:1.5,delay:0.5}}
        style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Cormorant Garamond',serif",fontWeight:900,fontSize:"clamp(7rem,20vw,20rem)",color:C.peach,whiteSpace:"nowrap",pointerEvents:"none",userSelect:"none",letterSpacing:"-0.04em",lineHeight:1,fontStyle:"italic"}}>
        DEV
      </motion.div>

      <div style={{position:"relative",zIndex:2}}>
        {/* Meta row */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1,duration:0.6}}
          style={{display:"flex",alignItems:"center",gap:"1.5rem",marginBottom:"2.5rem",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
            <motion.span animate={{scale:[1,1.5,1],opacity:[1,0.5,1]}} transition={{duration:2,repeat:Infinity}}
              style={{width:7,height:7,borderRadius:"50%",background:C.sage,display:"block"}}/>
            <span style={{fontFamily:"'Jost',sans-serif",fontSize:"0.72rem",color:C.sub,letterSpacing:"0.12em",textTransform:"uppercase"}}>Open to Opportunities</span>
          </div>
          <div style={{width:1,height:14,background:C.border}}/>
          <span style={{fontFamily:"'Jost',sans-serif",fontSize:"0.72rem",color:C.muted}}>Bengaluru, India</span>
          <div style={{width:1,height:14,background:C.border}}/>
          <span style={{fontFamily:"'Jost',sans-serif",fontSize:"0.72rem",color:C.muted}}>BE · Expected 2026</span>
        </motion.div>

        {/* Name reveal */}
        <div style={{marginBottom:"2rem",overflow:"hidden"}}>
          {"Rajath O S".split("").map((char,i)=>(
            <motion.span key={i} initial={{y:120,opacity:0}} animate={{y:0,opacity:1}}
              transition={{duration:0.7,delay:0.2+i*0.04,ease:[0.22,1,0.36,1]}}
              style={{display:"inline-block",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,
                fontSize:"clamp(4rem,10vw,9rem)",lineHeight:0.9,letterSpacing:"-0.02em",
                color:char===" "?"transparent":C.text,marginRight:char===" "?"0.2em":"0",fontStyle:"italic"}}>
              {char===" "?"\u00A0":char}
            </motion.span>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.85,duration:0.7}}
          style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:"3rem",alignItems:"end",paddingTop:"1.5rem",borderTop:`1px solid ${C.border}`}} className="hero-bottom-bar">
          <div>
            <div style={{fontSize:"0.65rem",fontFamily:"'Jost',sans-serif",color:C.muted,letterSpacing:"0.15em",marginBottom:"0.5rem",textTransform:"uppercase"}}>Currently</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontStyle:"italic",fontSize:"clamp(1.1rem,2vw,1.45rem)",color:C.text,minHeight:"1.8rem"}}>
              <span style={{background:`linear-gradient(135deg, ${C.peach}, ${C.sage})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{typed}</span>
              <motion.span animate={{opacity:[1,0,1]}} transition={{duration:1,repeat:Infinity}} style={{color:C.peach}}>|</motion.span>
            </div>
          </div>
          <p style={{color:C.sub,fontSize:"0.9rem",lineHeight:1.85,fontFamily:"'Jost',sans-serif",margin:0,fontWeight:300}}>
            Crafting scalable web applications with the MERN stack and Spring Boot. Passionate about clean code and real-world impact.
          </p>
          <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
            <motion.a href="#projects" whileHover={{scale:1.05,y:-2}} whileTap={{scale:0.96}}
              style={{padding:"0.75rem 1.6rem",background:C.peach,color:"#fff",borderRadius:"6px",textDecoration:"none",fontWeight:600,fontSize:"0.85rem",fontFamily:"'Jost',sans-serif",letterSpacing:"0.04em"}}>Work</motion.a>
            <motion.a href="#contact" whileHover={{scale:1.05,borderColor:C.sage}} whileTap={{scale:0.96}}
              style={{padding:"0.75rem 1.6rem",background:"transparent",color:C.sub,border:`1px solid ${C.border}`,borderRadius:"6px",textDecoration:"none",fontWeight:500,fontSize:"0.85rem",fontFamily:"'Jost',sans-serif",transition:"all 0.2s",letterSpacing:"0.04em"}}>Contact</motion.a>
          </div>
        </motion.div>
      </div>

      <motion.div animate={{y:[0,10,0]}} transition={{duration:2.2,repeat:Infinity}}
        style={{position:"absolute",bottom:"2rem",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.5rem",color:C.muted,fontSize:"0.6rem",letterSpacing:"0.22em"}}>
        <span style={{fontFamily:"'Jost',sans-serif"}}>SCROLL</span>
        <div style={{width:1,height:36,background:`linear-gradient(to bottom, ${C.peach}aa, transparent)`}}/>
      </motion.div>
    </section>
  );
}

function MarqueeBand(){
  const txt=MARQUEE.join("  ·  ");
  return(
    <div style={{overflow:"hidden",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:"0.75rem 0",background:C.cream}}>
      <motion.div animate={{x:["0%","-50%"]}} transition={{duration:22,repeat:Infinity,ease:"linear"}} style={{display:"flex",whiteSpace:"nowrap"}}>
        {[...Array(4)].map((_,i)=>(<span key={i} style={{fontFamily:"'Jost',sans-serif",fontSize:"0.7rem",letterSpacing:"0.16em",color:C.muted,textTransform:"uppercase",paddingRight:"3rem",fontWeight:500}}>{txt}</span>))}
      </motion.div>
    </div>
  );
}

function About(){
  const stats=[{val:"2+",label:"Projects Built",accent:C.peach},{val:"5+",label:"Tech Stacks",accent:C.sage},{val:"2026",label:"Graduating",accent:C.amber},{val:"BLR",label:"Based In",accent:C.rose}];
  return(
    <section id="about" style={{padding:"clamp(4rem,8vw,8rem) clamp(1.2rem,4vw,3rem)",maxWidth:"1200px",margin:"0 auto"}}>
      <Reveal><Label index={1} text="About"/></Reveal>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",marginTop:"3rem"}} className="about-grid">
        <Reveal>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontStyle:"italic",fontSize:"clamp(1.9rem,3.5vw,3rem)",lineHeight:1.15,letterSpacing:"0em",color:C.text,marginBottom:"1.5rem"}}>
            Building for the web,<br/><span style={{color:C.muted}}>one clean line</span><br/>at a time.
          </h2>
          <p style={{color:C.sub,fontSize:"0.96rem",lineHeight:1.95,fontFamily:"'Jost',sans-serif",marginBottom:"1.2rem",fontWeight:300}}>
            I'm an aspiring Full Stack Developer passionate about crafting modern, user-friendly web applications. Currently pursuing a BE at GM Institute of Technology, Davanagere, graduating in 2026.
          </p>
          <p style={{color:C.sub,fontSize:"0.96rem",lineHeight:1.95,fontFamily:"'Jost',sans-serif",fontWeight:300}}>
            My focus is on building scalable, maintainable solutions with the MERN stack and Java backend technologies. Driven by continuous learning and a passion for impactful software.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"1.5rem"}}>
            {stats.map(s=>(<motion.div key={s.label} whileHover={{y:-4,borderColor:s.accent}}
              style={{padding:"1.6rem",background:C.card,border:`1px solid ${C.border}`,borderRadius:"14px",transition:"border-color 0.25s"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontStyle:"italic",fontSize:"2.3rem",color:s.accent,lineHeight:1}}>{s.val}</div>
              <div style={{fontFamily:"'Jost',sans-serif",fontSize:"0.78rem",color:C.muted,marginTop:"0.3rem",letterSpacing:"0.06em"}}>{s.label}</div>
            </motion.div>))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.55rem"}}>
            {[{label:"Email",val:"rajathos07@gmail.com",href:"mailto:rajathos07@gmail.com"},
              {label:"GitHub",val:"github.com/rajathos07",href:"https://github.com/rajathos07"},
              {label:"LinkedIn",val:"in/rajath-os",href:"https://www.linkedin.com/in/rajath-os/"}].map(c=>(
              <motion.a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                whileHover={{borderColor:C.peach,x:4}}
                style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.75rem 1rem",border:`1px solid ${C.border}`,borderRadius:"10px",textDecoration:"none",background:C.card,transition:"all 0.2s"}}>
                <span style={{fontSize:"0.7rem",color:C.muted,fontFamily:"'Jost',sans-serif",letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:500}}>{c.label}</span>
                <span style={{fontSize:"0.82rem",color:C.sub,fontFamily:"'Jost',sans-serif"}}>{c.val}</span>
              </motion.a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Skills(){
  return(
    <section id="skills" style={{padding:"clamp(4rem,8vw,8rem) clamp(1.2rem,4vw,3rem)",borderTop:`1px solid ${C.border}`,background:C.cardAlt}}>
      <div style={{maxWidth:"1200px",margin:"0 auto"}}>
        <Reveal><Label index={2} text="Skills & Stack"/></Reveal>
        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"5rem",alignItems:"start",marginTop:"3rem"}} className="skills-grid">
          <Reveal>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontStyle:"italic",fontSize:"clamp(1.9rem,3vw,2.8rem)",lineHeight:1.1,color:C.text}}>
              Technologies<br/><span style={{color:C.muted}}>I work with</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{border:`1px solid ${C.border2}`,borderRadius:"16px",overflow:"hidden",background:C.bg}}>
              {Object.entries(SKILLS).map(([cat,items],i,arr)=>(
                <div key={cat} style={{display:"grid",gridTemplateColumns:"clamp(110px,15vw,160px) 1fr",borderBottom:i<arr.length-1?`1px solid ${C.border2}`:"none"}}>
                  <div style={{padding:"1.4rem 1.5rem",borderRight:`1px solid ${C.border2}`,display:"flex",alignItems:"center",background:C.cardAlt}}>
                    <span style={{fontFamily:"'Jost',sans-serif",fontSize:"0.7rem",color:C.sage,letterSpacing:"0.14em",textTransform:"uppercase",fontWeight:500}}>{cat}</span>
                  </div>
                  <div style={{padding:"1.4rem 1.5rem",display:"flex",flexWrap:"wrap",gap:"0.5rem",alignItems:"center"}}>
                    {items.map(sk=>(<motion.span key={sk} whileHover={{borderColor:C.sage,color:C.text}}
                      style={{padding:"0.3rem 0.85rem",border:`1px solid ${C.border}`,borderRadius:"100px",fontFamily:"'Jost',sans-serif",fontSize:"0.78rem",color:C.sub,background:C.card,transition:"all 0.2s",fontWeight:400}}>{sk}</motion.span>))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Projects(){
  const[active,setActive]=useState(null);
  return(
    <section id="projects" style={{padding:"clamp(4rem,8vw,8rem) clamp(1.2rem,4vw,3rem)",borderTop:`1px solid ${C.border}`,maxWidth:"1200px",margin:"0 auto"}}>
      <Reveal><Label index={3} text="Work"/></Reveal>
      <Reveal>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontStyle:"italic",fontSize:"clamp(2rem,4vw,3.5rem)",letterSpacing:"-0.01em",color:C.text,marginTop:"2rem",marginBottom:"3.5rem"}}>Selected Projects</h2>
      </Reveal>
      <div style={{borderTop:`1px solid ${C.border}`}}>
        {PROJECTS.map((p,i)=>(
          <Reveal key={p.num} delay={i*0.1}>
            <div style={{borderBottom:`1px solid ${C.border}`}}>
              <motion.div onClick={()=>setActive(active===i?null:i)} whileHover={{paddingLeft:"0.5rem"}}
                style={{display:"grid",gridTemplateColumns:"clamp(44px,6vw,60px) 1fr auto auto",gap:"clamp(0.75rem,2vw,1.5rem)",alignItems:"center",padding:"2rem 0",cursor:"pointer",transition:"padding 0.25s"}}>
                <span style={{fontFamily:"'Jost',sans-serif",fontSize:"0.75rem",color:C.muted,fontStyle:"italic"}}>{p.num}</span>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontStyle:"italic",fontSize:"clamp(1.2rem,2.5vw,2rem)",letterSpacing:"-0.01em",color:C.text,margin:0}}>{p.title}</h3>
                <span style={{fontFamily:"'Jost',sans-serif",fontSize:"0.72rem",color:p.accent,whiteSpace:"nowrap",letterSpacing:"0.08em",display:"none"}} className="proj-tag">{p.tag}</span>
                <span style={{fontFamily:"'Jost',sans-serif",fontSize:"0.72rem",color:p.accent,whiteSpace:"nowrap",letterSpacing:"0.08em"}}>{p.tag}</span>
                <motion.span animate={{rotate:active===i?45:0}} transition={{duration:0.25}}
                  style={{fontSize:"1.4rem",color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,fontWeight:300}}>+</motion.span>
              </motion.div>
              <AnimatePresence>
                {active===i&&(
                  <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.4,ease:[0.22,1,0.36,1]}} style={{overflow:"hidden"}}>
                    <div style={{display:"grid",gridTemplateColumns:"clamp(44px,6vw,60px) 1fr",gap:"clamp(0.75rem,2vw,1.5rem)",paddingBottom:"2.5rem"}}>
                      <div/>
                      <div>
                        <p style={{color:C.sub,fontSize:"0.93rem",lineHeight:1.85,fontFamily:"'Jost',sans-serif",marginBottom:"1.5rem",maxWidth:"640px",fontWeight:300}}>{p.desc}</p>
                        <div style={{display:"flex",flexWrap:"wrap",gap:"0.45rem",marginBottom:"1.5rem"}}>
                          {p.tech.map(t=>(<span key={t} style={{padding:"0.25rem 0.75rem",border:`1px solid ${p.accentLt}`,background:`${p.accent}0d`,borderRadius:"100px",fontFamily:"'Jost',sans-serif",fontSize:"0.74rem",color:p.accent,fontWeight:500}}>{t}</span>))}
                        </div>
                        <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
                          {p.live&&(<motion.a href={p.live} target="_blank" rel="noopener noreferrer" whileHover={{scale:1.04}} whileTap={{scale:0.96}}
                            style={{padding:"0.6rem 1.5rem",background:p.accent,color:"#fff",borderRadius:"6px",textDecoration:"none",fontWeight:600,fontSize:"0.82rem",fontFamily:"'Jost',sans-serif",letterSpacing:"0.04em"}}>Live ↗</motion.a>)}
                          <motion.a href={p.github} target="_blank" rel="noopener noreferrer" whileHover={{scale:1.04,borderColor:C.text}} whileTap={{scale:0.96}}
                            style={{padding:"0.6rem 1.5rem",background:"transparent",color:C.sub,border:`1px solid ${C.border}`,borderRadius:"6px",textDecoration:"none",fontWeight:500,fontSize:"0.82rem",fontFamily:"'Jost',sans-serif",transition:"all 0.2s",letterSpacing:"0.04em"}}>GitHub →</motion.a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Education(){
  return(
    <section id="education" style={{padding:"clamp(4rem,8vw,8rem) clamp(1.2rem,4vw,3rem)",borderTop:`1px solid ${C.border}`,background:C.cardAlt}}>
      <div style={{maxWidth:"1200px",margin:"0 auto"}}>
        <Reveal><Label index={4} text="Education"/></Reveal>
        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"5rem",marginTop:"3rem",alignItems:"start"}} className="edu-grid">
          <Reveal>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontStyle:"italic",fontSize:"clamp(1.9rem,3vw,2.8rem)",lineHeight:1.1,color:C.text}}>
              Academic<br/><span style={{color:C.muted}}>Background</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <motion.div whileHover={{borderColor:C.peach}} style={{border:`1px solid ${C.border}`,borderRadius:"16px",background:C.bg,overflow:"hidden",transition:"border-color 0.3s"}}>
              <div style={{height:"3px",background:`linear-gradient(90deg, ${C.peach}, ${C.sage})`}}/>
              <div style={{padding:"2rem 2.5rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"1rem",marginBottom:"1.5rem"}}>
                  <div>
                    <span style={{fontFamily:"'Jost',sans-serif",fontSize:"0.68rem",color:C.peach,letterSpacing:"0.15em",textTransform:"uppercase",display:"block",marginBottom:"0.4rem",fontWeight:500}}>Bachelor of Engineering</span>
                    <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontStyle:"italic",fontSize:"1.5rem",color:C.text,margin:0}}>GM Institute of Technology</h3>
                    <p style={{fontFamily:"'Jost',sans-serif",fontSize:"0.85rem",color:C.muted,margin:"0.3rem 0 0",fontWeight:300}}>Davanagere, India</p>
                  </div>
                  <span style={{padding:"0.35rem 1rem",border:`1px solid ${C.amber}55`,background:`${C.amber}0d`,borderRadius:"6px",fontFamily:"'Jost',sans-serif",fontSize:"0.76rem",color:C.amber,fontWeight:500}}>Expected 2026</span>
                </div>
                <div style={{display:"flex",gap:"2rem",paddingTop:"1.5rem",borderTop:`1px solid ${C.border}`,flexWrap:"wrap"}}>
                  {[["Degree","B.E."],["Stream","Computer Sci."],["Status","Pursuing"]].map(([l,v])=>(
                    <div key={l}>
                      <div style={{fontSize:"0.62rem",color:C.muted,fontFamily:"'Jost',sans-serif",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.25rem",fontWeight:500}}>{l}</div>
                      <div style={{fontSize:"0.88rem",color:C.sub,fontFamily:"'Jost',sans-serif"}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CTA(){
  return(
    <section style={{padding:"clamp(5rem,10vw,10rem) clamp(1.2rem,4vw,3rem)",position:"relative",overflow:"hidden",borderTop:`1px solid ${C.border}`,background:C.cream}}>
      <motion.div animate={{opacity:[0.3,0.65,0.3],scale:[1,1.05,1]}} transition={{duration:6,repeat:Infinity}}
        style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:700,height:400,borderRadius:"50%",background:`radial-gradient(ellipse, ${C.peach}18 0%, transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{maxWidth:"900px",margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
        <Reveal>
          <span style={{fontFamily:"'Jost',sans-serif",fontSize:"0.7rem",color:C.sage,letterSpacing:"0.22em",textTransform:"uppercase",display:"block",marginBottom:"1.5rem",fontWeight:500}}>Let's Collaborate</span>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontStyle:"italic",fontSize:"clamp(2.8rem,8vw,6.5rem)",letterSpacing:"-0.02em",lineHeight:0.95,color:C.text,marginBottom:"2rem"}}>
            Ready to build<br/><span style={{color:C.muted}}>something great?</span>
          </h2>
          <p style={{color:C.muted,fontSize:"1rem",lineHeight:1.85,fontFamily:"'Jost',sans-serif",marginBottom:"3rem",fontWeight:300}}>Open to fresher roles, internships and exciting projects.</p>
          <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
            <motion.a href="mailto:rajathos07@gmail.com" whileHover={{scale:1.04,y:-3}} whileTap={{scale:0.97}}
              style={{padding:"1rem 2.5rem",background:C.peach,color:"#fff",borderRadius:"8px",textDecoration:"none",fontWeight:600,fontSize:"0.95rem",fontFamily:"'Jost',sans-serif",letterSpacing:"0.04em"}}>Send an Email →</motion.a>
            <motion.a href="https://www.linkedin.com/in/rajath-os/" target="_blank" rel="noopener noreferrer"
              whileHover={{scale:1.04,y:-3,borderColor:C.sage}} whileTap={{scale:0.97}}
              style={{padding:"1rem 2.5rem",background:"transparent",color:C.sub,border:`1px solid ${C.border}`,borderRadius:"8px",textDecoration:"none",fontWeight:500,fontSize:"0.95rem",fontFamily:"'Jost',sans-serif",transition:"all 0.2s",letterSpacing:"0.04em"}}>LinkedIn Profile</motion.a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact(){
  const[form,setForm]=useState({name:"",email:"",message:""});const[sent,setSent]=useState(false);
  const handle=e=>setForm({...form,[e.target.name]:e.target.value});
  const submit=()=>{if(!form.name||!form.email||!form.message)return;const s=encodeURIComponent(`Portfolio Contact from ${form.name}`);const b=encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);window.open(`mailto:rajathos07@gmail.com?subject=${s}&body=${b}`);setSent(true);setTimeout(()=>setSent(false),3000);};
  const inp={width:"100%",padding:"1rem 1.2rem",background:C.bg,border:`1px solid ${C.border}`,borderRadius:"10px",color:C.text,fontSize:"0.9rem",outline:"none",fontFamily:"'Jost',sans-serif",transition:"border-color 0.2s",boxSizing:"border-box",fontWeight:300};
  return(
    <section id="contact" style={{padding:"clamp(4rem,8vw,8rem) clamp(1.2rem,4vw,3rem)",borderTop:`1px solid ${C.border}`,background:C.card}}>
      <div style={{maxWidth:"1200px",margin:"0 auto"}}>
        <Reveal><Label index={5} text="Contact"/></Reveal>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6rem",marginTop:"3rem",alignItems:"start"}} className="contact-grid">
          <Reveal>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontStyle:"italic",fontSize:"clamp(1.9rem,3.5vw,3rem)",letterSpacing:"-0.01em",color:C.text,marginBottom:"1.5rem"}}>Get in touch</h2>
            <p style={{color:C.muted,fontSize:"0.93rem",lineHeight:1.85,fontFamily:"'Jost',sans-serif",marginBottom:"2.5rem",fontWeight:300}}>Have a project or opportunity in mind? I'd love to hear from you.</p>
            <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
              {[{label:"Email",val:"rajathos07@gmail.com",href:"mailto:rajathos07@gmail.com"},
                {label:"LinkedIn",val:"linkedin.com/in/rajath-os",href:"https://www.linkedin.com/in/rajath-os/"},
                {label:"GitHub",val:"github.com/rajathos07",href:"https://github.com/rajathos07"}].map(c=>(
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1rem 1.2rem",border:`1px solid ${C.border}`,borderRadius:"10px",textDecoration:"none",background:C.bg,transition:"border-color 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.peach}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                  <span style={{fontSize:"0.7rem",color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Jost',sans-serif",fontWeight:500}}>{c.label}</span>
                  <span style={{fontSize:"0.82rem",color:C.sub,fontFamily:"'Jost',sans-serif"}}>{c.val}</span>
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              {["name","email","message"].map(field=>(
                <div key={field}>
                  <label style={{display:"block",color:C.muted,fontSize:"0.72rem",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Jost',sans-serif",marginBottom:"0.5rem",fontWeight:500}}>{field}</label>
                  {field==="message"?<textarea name={field} value={form[field]} onChange={handle} placeholder="Your message..." rows={5} style={{...inp,resize:"vertical"}} onFocus={e=>e.target.style.borderColor=C.peach} onBlur={e=>e.target.style.borderColor=C.border}/>
                    :<input name={field} value={form[field]} onChange={handle} type={field==="email"?"email":"text"} placeholder={field==="email"?"your@email.com":"Your name"} style={inp} onFocus={e=>e.target.style.borderColor=C.peach} onBlur={e=>e.target.style.borderColor=C.border}/>}
                </div>
              ))}
              <motion.button onClick={submit} whileHover={{scale:1.02,y:-2}} whileTap={{scale:0.97}}
                style={{padding:"1rem",border:"none",cursor:"pointer",background:sent?C.sage:C.peach,color:"#fff",borderRadius:"10px",fontWeight:600,fontSize:"0.95rem",fontFamily:"'Jost',sans-serif",transition:"background 0.4s",letterSpacing:"0.04em"}}>
                {sent?"✓ Message Sent!":"Send Message →"}
              </motion.button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer(){
  return(
    <footer style={{borderTop:`1px solid ${C.border}`,background:C.bg}}>
      <div style={{overflow:"hidden",borderBottom:`1px solid ${C.border}`,padding:"1.2rem 0"}}>
        <motion.div animate={{x:["0%","-50%"]}} transition={{duration:20,repeat:Infinity,ease:"linear"}} style={{display:"flex",whiteSpace:"nowrap"}}>
          {[...Array(6)].map((_,i)=>(<span key={i} style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontStyle:"italic",fontSize:"clamp(2.5rem,6vw,5rem)",color:i%2===0?C.peach:"transparent",WebkitTextStroke:i%2===0?"none":`1px ${C.peachLt}`,letterSpacing:"-0.02em",paddingRight:"1.5rem",lineHeight:1}}>Rajath O S</span>))}
        </motion.div>
      </div>
      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"2.5rem clamp(1.2rem,4vw,3rem)",display:"grid",gridTemplateColumns:"1fr auto auto",gap:"2rem",alignItems:"center"}} className="footer-cols">
        <span style={{fontFamily:"'Jost',sans-serif",fontSize:"0.78rem",color:C.muted,fontWeight:300}}>© 2025 Rajath O S. All rights reserved.</span>
        <div style={{display:"flex",gap:"2rem"}}>
          {[{label:"LinkedIn",url:"https://www.linkedin.com/in/rajath-os/"},{label:"GitHub",url:"https://github.com/rajathos07"}].map(s=>(
            <motion.a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" whileHover={{y:-2}}
              style={{color:C.muted,textDecoration:"none",fontSize:"0.82rem",fontFamily:"'Jost',sans-serif",transition:"color 0.2s",fontWeight:400}}
              onMouseEnter={e=>e.target.style.color=C.text} onMouseLeave={e=>e.target.style.color=C.muted}>{s.label} ↗</motion.a>
          ))}
        </div>
        <motion.a href="https://drive.google.com/file/d/17GBGLCzu9BwmZLYxAdkFQRlzdRQQW75M/view?usp=drive_link"
          target="_blank" rel="noopener noreferrer" whileHover={{scale:1.05,borderColor:C.peach}}
          style={{padding:"0.45rem 1.2rem",border:`1px solid ${C.border}`,borderRadius:"6px",color:C.muted,textDecoration:"none",fontSize:"0.78rem",fontFamily:"'Jost',sans-serif",transition:"all 0.2s",fontWeight:400}}>Resume ↓</motion.a>
      </div>
    </footer>
  );
}

export default function Portfolio(){
  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Jost:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:#F2F7F2;color:#2A2535;font-family:'Jost',sans-serif;overflow-x:hidden;}
        ::selection{background:#E4D2E4;color:#2A2535;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#F2F7F2;}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}
        ::-webkit-scrollbar-thumb:hover{background:${C.peach}66;}

        @media(max-width:1024px){
          .hero-bottom-bar{grid-template-columns:1fr 1fr !important;gap:1.5rem !important;}
          .hero-bottom-bar>*:last-child{grid-column:1/-1;}
          .about-grid,.skills-grid,.edu-grid,.contact-grid{grid-template-columns:1fr !important;gap:2.5rem !important;}
          .footer-cols{grid-template-columns:1fr !important;gap:1rem !important;}
          .skills-grid>*:first-child{margin-bottom:0 !important;}
        }
        @media(max-width:768px){
          .nav-links,.nav-right{display:none !important;}
          .hamburger{display:flex !important;}
          .hero-bottom-bar{grid-template-columns:1fr !important;gap:1.2rem !important;}
          .proj-tag{display:none !important;}
        }
        @media(max-width:480px){
          .about-grid .stat-grid{grid-template-columns:1fr 1fr;}
        }
      `}</style>
      <CursorGlow/>
      <div style={{background:"#FDFAF6",minHeight:"100vh"}}>
        <Navbar/>
        <Hero/>
        <MarqueeBand/>
        <About/>
        <Skills/>
        <Projects/>
        <Education/>
        <CTA/>
        <Contact/>
        <Footer/>
      </div>
    </>
  );
}

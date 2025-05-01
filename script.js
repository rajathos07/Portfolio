// Typing Animation
var typed = new Typed(".text", {
  strings: ["Data Analyst Learner", "Machine Learning Enthusiast", "Data Science Begineer"],
  typeSpeed: 100,
  backSpeed: 100,
  backDelay: 1000,
  loop: true,
});

// Scroll Reveal Animation
ScrollReveal({
  // basic settings
  reset: true,
  distance: "80px",
  duration: 2000,
  delay: 200,
});

ScrollReveal().reveal('.home-content, .heading1', { origin: "top" });
ScrollReveal().reveal('.home-imgHover, .services_list, .Technical-bar, .radial-bars', { origin: "bottom" });
ScrollReveal().reveal('.home-content h1, .about-img', { origin: "left" });
ScrollReveal().reveal('.home-content p, .about-text', { origin: "right" });

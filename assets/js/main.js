/**
* Rajath O S Portfolio — Specimen Redesign Behavior
* Pure vanilla JS implementations for scroll spy, overlays, typewriter, reveals, and project directory hover tracking.
*/

document.addEventListener('DOMContentLoaded', () => {

  /*--------------------------------------------------------------
  # Header Navbar Background Adjust on Scroll
  --------------------------------------------------------------*/
  const navbar = document.getElementById('unfold-navbar');
  
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll();


  /*--------------------------------------------------------------
  # Mobile Navigation Menu Overlay Toggles
  --------------------------------------------------------------*/
  const mobileNavToggleBtn = document.getElementById('mobile-nav-toggle-btn');
  const mobileNavCloseBtn = document.getElementById('mobile-nav-close-btn');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileNav = () => {
    mobileNavOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    mobileNavOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (mobileNavToggleBtn) mobileNavToggleBtn.addEventListener('click', openMobileNav);
  if (mobileNavCloseBtn) mobileNavCloseBtn.addEventListener('click', closeMobileNav);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });


  /*--------------------------------------------------------------
  # Scroll Reveal Animation (Intersection Observer)
  --------------------------------------------------------------*/
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if (revealElements.length > 0) {
    const revealOnScroll = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    };

    const revealObserver = new IntersectionObserver(revealOnScroll, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }


  /*--------------------------------------------------------------
  # Skills Cards Staggered Animation (on viewport entry)
  --------------------------------------------------------------*/
  const skillsSection = document.getElementById('skills-section');
  const skillCards = document.querySelectorAll('.scroll-reveal-card');
  
  if (skillsSection && skillCards.length > 0) {
    const animateSkillCards = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('reveal-active');
            }, index * 180);
          });
          observer.unobserve(entry.target);
        }
      });
    };
    
    const skillsObserver = new IntersectionObserver(animateSkillCards, {
      threshold: 0.15
    });
    
    skillsObserver.observe(skillsSection);
  }


  /*--------------------------------------------------------------
  # Projects Archive Directory Row Hover Logic
  --------------------------------------------------------------*/
  const projectsCard = document.querySelector('.projects-directory-card');
  const bodyRows = document.querySelectorAll('.directory-table .body-row');
  const circleBadge = document.getElementById('hover-circle-badge');
  const previewCard = document.getElementById('hover-preview-card');
  const previewTitle = document.getElementById('preview-title');
  const previewScope = document.getElementById('preview-scope');
  const previewDesc = document.getElementById('preview-desc');

  if (projectsCard && bodyRows.length > 0 && circleBadge && previewCard) {
    
    bodyRows.forEach(row => {
      
      row.addEventListener('mouseenter', () => {
        // Fetch variables from row details
        const title = row.getAttribute('data-title');
        const scope = row.getAttribute('data-scope');
        const desc = row.getAttribute('data-desc');
        
        previewTitle.textContent = title;
        previewScope.textContent = scope;
        previewDesc.textContent = desc;
        
        // Show badges
        circleBadge.style.opacity = '1';
        previewCard.style.opacity = '1';
      });

      row.addEventListener('mousemove', (e) => {
        // Calculate pointer location relative to projects card wrapper
        const rect = projectsCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Position circular white CODE badge centered on cursor
        circleBadge.style.left = `${x}px`;
        circleBadge.style.top = `${y}px`;
        circleBadge.style.transform = 'translate(-50%, -50%) scale(1)';

        // Position popover card offset to the right
        const cardWidth = 280;
        let previewX = x + 40;
        
        if (previewX + cardWidth > rect.width - 20) {
          previewX = x - cardWidth - 40; // Shift to left side of cursor if right is full
        }

        previewCard.style.left = `${previewX}px`;
        previewCard.style.top = `${y}px`;
        previewCard.style.transform = 'translate(0, -50%) scale(1)';
      });

      row.addEventListener('mouseleave', () => {
        // Hide overlay panels
        circleBadge.style.opacity = '0';
        circleBadge.style.transform = 'translate(-50%, -50%) scale(0.6)';
        
        previewCard.style.opacity = '0';
        previewCard.style.transform = 'translate(20px, -50%) scale(0.9)';
      });

      // Redirect on Click to Project Repository
      row.addEventListener('click', () => {
        const repoLink = row.getAttribute('data-link');
        if (repoLink) {
          window.open(repoLink, '_blank');
        }
      });

    });

  }


  /*--------------------------------------------------------------
  # Scrollspy Link Highlighter
  --------------------------------------------------------------*/
  const spySections = document.querySelectorAll('section, header');
  const deskNavLinks = document.querySelectorAll('.unfold-navbar .nav-item-link');
  
  const scrollspy = () => {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    
    spySections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.offsetHeight;
      const secId = sec.getAttribute('id');
      
      if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
        deskNavLinks.forEach(link => {
          link.classList.remove('active');
          
          let targetHref = `#${secId}`;
          if (link.getAttribute('href') === targetHref) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', scrollspy);
  scrollspy();


  /*--------------------------------------------------------------
  # Simulated Contact Form Submit Handler
  --------------------------------------------------------------*/
  const contactForm = document.getElementById('contact-form');
  const formLoading = document.getElementById('form-loading');
  const formSuccess = document.getElementById('form-success');
  const formError = document.getElementById('form-error');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      formSuccess.style.display = 'none';
      formError.style.display = 'none';
      formLoading.style.display = 'flex';
      
      setTimeout(() => {
        const formData = new FormData(contactForm);
        console.log('Specimen Transmission Logged:', {
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message')
        });

        formLoading.style.display = 'none';
        formSuccess.style.display = 'flex';
        contactForm.reset();
        
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 5000);
        
      }, 1500);
    });
  }

});

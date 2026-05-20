/* ============================================
   VEER JI FAST FOOD — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------
     SECTION 1: SPLASH SCREEN — 1.5s then fade
     ---------------------------------------- */
  const splash = document.getElementById('splash-screen');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('fade-out');
    }, 1500);
    // Remove from DOM after transition
    splash.addEventListener('transitionend', () => {
      splash.style.display = 'none';
    });
  }

  /* ----------------------------------------
     SCROLL REVEAL — fade in + slide up
     ---------------------------------------- */
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ----------------------------------------
     BACKGROUND COLOR CHANGE ON SCROLL
     ---------------------------------------- */
  const bgWrapper = document.getElementById('bg-wrapper');
  const bgSections = document.querySelectorAll('[data-bg]');

  const bgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const newBg = entry.target.dataset.bg;
        if (bgWrapper && newBg) {
          bgWrapper.style.backgroundColor = newBg;
        }

        // Handle text color for light backgrounds
        const isLight = entry.target.dataset.bgLight === 'true';
        if (isLight) {
          document.body.classList.add('light-theme');
          bgWrapper.classList.add('light-theme');
        } else {
          document.body.classList.remove('light-theme');
          bgWrapper.classList.remove('light-theme');
        }
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '0px 0px -10% 0px'
  });

  bgSections.forEach(el => bgObserver.observe(el));

  /* ----------------------------------------
     SECTION 4: COLD DRINK BAR — Interactive
     ---------------------------------------- */
  const drinkThumbs = document.querySelectorAll('.drink-thumb');
  const liquid = document.getElementById('liquid');
  const drinkNameEl = document.getElementById('drink-name');

  drinkThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Remove active state from all
      drinkThumbs.forEach(t => t.classList.remove('active'));

      // Set active on clicked
      thumb.classList.add('active');

      // Get liquid colors
      const fromColor = thumb.dataset.liquidFrom;
      const toColor = thumb.dataset.liquidTo;
      const drinkName = thumb.dataset.drinkName;

      // Pouring animation logic
      if (liquid) {
        liquid.style.height = '0%';
        setTimeout(() => {
          liquid.style.background = `linear-gradient(180deg, ${fromColor} 0%, ${toColor} 100%)`;
          liquid.style.height = '72%';
          
          // Re-trigger bubbles
          const bubbles = liquid.querySelectorAll('.bubble');
          bubbles.forEach(b => {
            b.style.animation = 'none';
            void b.offsetHeight; // trigger reflow
            b.style.animation = '';
          });
        }, 250);
      }

      // Update drink name label
      if (drinkNameEl && drinkName) {
        drinkNameEl.textContent = drinkName;
      }
    });
  });

  // Set default drink (first active one)
  const defaultDrink = document.querySelector('.drink-thumb.active');
  if (defaultDrink) {
    const fromColor = defaultDrink.dataset.liquidFrom;
    const toColor = defaultDrink.dataset.liquidTo;
    if (liquid) {
      liquid.style.background = `linear-gradient(180deg, ${fromColor} 0%, ${toColor} 100%)`;
    }
  }

  /* ----------------------------------------
     IMAGE ERROR FALLBACK
     ---------------------------------------- */
  const foodImages = document.querySelectorAll('.food-img, .hero-food-img');
  foodImages.forEach(img => {
    img.addEventListener('error', function() {
      // Replace with a styled placeholder
      const placeholder = document.createElement('div');
      placeholder.className = 'food-img-placeholder';
      placeholder.textContent = this.alt || 'Food Image';
      placeholder.style.width = '100%';
      placeholder.style.maxWidth = '420px';
      placeholder.style.aspectRatio = '1';
      placeholder.style.borderRadius = '20px';
      placeholder.style.display = 'flex';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      placeholder.style.fontSize = '1.2rem';
      placeholder.style.fontWeight = '600';
      placeholder.style.color = 'rgba(255,255,255,0.4)';
      placeholder.style.background = 'rgba(255,255,255,0.05)';
      placeholder.style.border = '1px dashed rgba(255,255,255,0.15)';
      this.parentNode.replaceChild(placeholder, this);
    });
  });

  /* ----------------------------------------
     3D PARALLAX EFFECT ON MOUSE MOVE
     ---------------------------------------- */
  const sections = document.querySelectorAll('.hero-section, .menu-item-section');
  
  sections.forEach(section => {
    section.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 768) return; // disable on mobile
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const img = section.querySelector('.food-img, .hero-food-img');
      const tags = section.querySelectorAll('.glass-tag');
      const base = section.querySelector('.product-base');
      
      if (img) {
        // Subtle tilt and shift
        img.style.transform = `translate(${x * 0.025}px, ${y * 0.025}px) rotateX(${-y * 0.015}deg) rotateY(${x * 0.015}deg) scale(1.04)`;
      }
      
      if (base) {
        // Translate base slower than the image to create depth
        base.style.transform = `translate(${x * 0.01}px, ${y * 0.01}px) rotateX(75deg) rotateY(${-x * 0.005}deg)`;
      }
      
      tags.forEach((tag, idx) => {
        // Different movement speed for each floating tag to look 3D
        const factorX = (idx + 1) * 0.04;
        const factorY = (idx + 1) * 0.03;
        tag.style.transform = `translate(${x * factorX}px, ${y * factorY}px)`;
      });
    });

    section.addEventListener('mouseleave', () => {
      const img = section.querySelector('.food-img, .hero-food-img');
      const tags = section.querySelectorAll('.glass-tag');
      const base = section.querySelector('.product-base');
      
      if (img) {
        img.style.transform = '';
      }
      if (base) {
        base.style.transform = '';
      }
      tags.forEach(tag => {
        tag.style.transform = '';
      });
    });
  });

  /* ----------------------------------------
     SMOOTH PARALLAX DEPTH EFFECT ON SCROLL (MOBILE/DESKTOP ALTERNATIVE)
     ---------------------------------------- */
  const menuSections = document.querySelectorAll('.menu-item-section');

  if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      menuSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const scrollPercent = rect.top / window.innerHeight;
        const img = section.querySelector('.food-img');
        const base = section.querySelector('.product-base');
        
        // Only run scroll parallax if mouse parallax is not actively overriding
        if (img && Math.abs(scrollPercent) < 1.5 && !section.matches(':hover')) {
          const translateY = scrollPercent * 25;
          img.style.transform = `translateY(${translateY}px)`;
        }
        if (base && Math.abs(scrollPercent) < 1.5 && !section.matches(':hover')) {
          const translateYBase = scrollPercent * 10;
          base.style.transform = `translateY(${translateYBase}px) rotateX(75deg)`;
        }
      });
    }, { passive: true });
  }

});

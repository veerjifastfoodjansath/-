/* ============================================================
   VEER JI FAST FOOD — MAIN JAVASCRIPT (BUG FIXED)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     PART 1: SPLASH SCREEN
     ────────────────────────────────────────────── */
 const splash = document.getElementById('splash-screen');

  // Lock scroll + force page to top immediately
  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);

  if (splash) {
    setTimeout(() => {
      splash.classList.add('fade-out');

      // Force remove after 1s regardless of transitionend
      setTimeout(() => {
        splash.style.display = 'none';
        document.body.style.overflow = '';
      }, 1000);

    }, 2000);
  }

  /* ──────────────────────────────────────────────
     PART 2: VIDEO HERO
     ────────────────────────────────────────────── */
  const heroVideo = document.getElementById('hero-video');
  const heroContent = document.getElementById('hero-content');
  const scrollHint = document.getElementById('scroll-hint');

  if (heroVideo) {
    // Force visible immediately
    heroVideo.style.opacity = '1';
    });

    heroVideo.addEventListener('ended', () => {
      heroVideo.pause();
      if (heroContent) heroContent.classList.add('visible');
      setTimeout(() => {
        if (scrollHint) scrollHint.classList.add('show');
      }, 1000);
    });

    // Fallback if video takes too long to load
    setTimeout(() => {
      if (heroContent && !heroContent.classList.contains('visible')) {
        heroContent.classList.add('visible');
        if (scrollHint) scrollHint.classList.add('show');
      }
    }, 4000);
  } else {
    if (heroContent) heroContent.classList.add('visible');
    if (scrollHint) setTimeout(() => scrollHint.classList.add('show'), 800);
  }


  /* ──────────────────────────────────────────────
     PART 3: MENU SECTION
     ────────────────────────────────────────────── */
  const menuSection = document.getElementById('menu-section');
  const menuItems = document.querySelectorAll('.menu-item');
  const menuDots = document.querySelectorAll('.dot');
  const currentItemEl = document.getElementById('current-item');
  let activeMenuIndex = 0;

  const menuItemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.dataset.index);
        menuItems.forEach(item => item.classList.remove('active'));
        menuDots.forEach(dot => dot.classList.remove('active'));
        
        entry.target.classList.add('active');
        if (menuDots[idx]) menuDots[idx].classList.add('active');
        if (currentItemEl) currentItemEl.textContent = idx + 1;
        activeMenuIndex = idx;
      }
    });
  }, { threshold: 0.5, rootMargin: '0px 0px -20% 0px' });

  menuItems.forEach(item => menuItemObserver.observe(item));

  const menuSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        menuSection.classList.add('section-active');
      } else {
        menuSection.classList.remove('section-active');
      }
    });
  }, { threshold: 0.1 });

  if (menuSection) menuSectionObserver.observe(menuSection);

  menuDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.dataset.target);
      if (menuItems[targetIdx]) {
        menuItems[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  menuItems.forEach(item => {
    const img = item.querySelector('.food-photo');
    if (!img) return;
    item.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      img.style.transform = `translate(${x * 18}px, ${y * 12}px) rotate(${x * 1.5}deg) scale(1.03)`;
    });
    item.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });


  /* ──────────────────────────────────────────────
     PART 4: COLD DRINK BAR (BUG FIXED)
     ────────────────────────────────────────────── */
  const drinkSlides = document.querySelectorAll('.drink-slide');
  const glassDrinkName = document.getElementById('glass-drink-name');
  const glassSubEl = document.querySelector('.glass-drink-sub');
  const drinksSlider = document.getElementById('drinks-slider');
  const sliderPrev = document.getElementById('slider-prev');
  const sliderNext = document.getElementById('slider-next');
  const drinkDots = document.querySelectorAll('.ddot');
  let currentDrinkIndex = 0;

  function activateDrink(index) {
    const slide = drinkSlides[index];
    if (!slide) return;

    drinkSlides.forEach(s => s.classList.remove('active'));
    drinkDots.forEach(d => d.classList.remove('active'));

    slide.classList.add('active');
    if (drinkDots[index]) drinkDots[index].classList.add('active');

    const fromColor = slide.dataset.liquidFrom;
    const drinkName = slide.dataset.drinkName;
    const drinkPrice = slide.dataset.drinkPrice;

    // THE CLEAN BOTTLE SWAP LOGIC
    const centerBottleImg = document.getElementById('center-bottle-img');
    const bottleGlow = document.getElementById('bottle-glow');
    
    if (centerBottleImg) {
      centerBottleImg.style.opacity = '0';
      centerBottleImg.style.transform = 'scale(0.8)';
      
      setTimeout(() => {
        const slideImg = slide.querySelector('img');
        if (slideImg) {
          centerBottleImg.src = slideImg.src;
        }
        if (bottleGlow) bottleGlow.style.background = fromColor;
        
        centerBottleImg.style.opacity = '1';
        centerBottleImg.style.transform = 'scale(1)';
      }, 250);
    }

    if (glassDrinkName) glassDrinkName.textContent = drinkName;
    if (glassSubEl) glassSubEl.textContent = `Chilled & Fresh — ${drinkPrice}`;

    slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    currentDrinkIndex = index;
  }

  drinkSlides.forEach((slide, index) => {
    slide.addEventListener('click', () => activateDrink(index));
  });

  drinkDots.forEach(dot => {
    dot.addEventListener('click', () => {
      activateDrink(parseInt(dot.dataset.di));
    });
  });

  if (sliderPrev) {
    sliderPrev.addEventListener('click', () => {
      const prev = (currentDrinkIndex - 1 + drinkSlides.length) % drinkSlides.length;
      activateDrink(prev);
    });
  }

  if (sliderNext) {
    sliderNext.addEventListener('click', () => {
      const next = (currentDrinkIndex + 1) % drinkSlides.length;
      activateDrink(next);
    });
  }

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  if (drinksSlider) {
    drinksSlider.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    drinksSlider.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          activateDrink((currentDrinkIndex + 1) % drinkSlides.length);
        } else {
          activateDrink((currentDrinkIndex - 1 + drinkSlides.length) % drinkSlides.length);
        }
      }
    }, { passive: true });
  }

  // Initialize first drink
  activateDrink(0);

  /* ──────────────────────────────────────────────
     SMOOTH ANCHOR SCROLLING
     ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

}); // THIS IS THE CLOSING BRACKET THAT WAS MISSING!

/* ============================================================
   VEER JI FAST FOOD — MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     PART 1: SPLASH SCREEN
     Shows for 2s then fades out with scale effect
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
     Video plays once → text fades in → scroll hint appears
     ────────────────────────────────────────────── */
  const heroVideo = document.getElementById('hero-video');
  const heroContent = document.getElementById('hero-content');
  const scrollHint = document.getElementById('scroll-hint');

  if (heroVideo) {
    // Show video once loaded
    heroVideo.addEventListener('loadeddata', () => {
      heroVideo.classList.add('loaded');
    });

    // After video ends (plays once), show hero text + scroll hint
    heroVideo.addEventListener('ended', () => {
      // Freeze on last frame
      heroVideo.pause();

      // Fade in headline + CTA
      if (heroContent) {
        heroContent.classList.add('visible');
      }

      // Show scroll hint after text appears
      setTimeout(() => {
        if (scrollHint) scrollHint.classList.add('show');
      }, 1000);
    });

    // Fallback: if video takes too long to load, show content after 4s
    setTimeout(() => {
      if (heroContent && !heroContent.classList.contains('visible')) {
        heroContent.classList.add('visible');
        if (scrollHint) scrollHint.classList.add('show');
      }
    }, 4000);
  } else {
    // No video — show content immediately
    if (heroContent) heroContent.classList.add('visible');
    if (scrollHint) setTimeout(() => scrollHint.classList.add('show'), 800);
  }


  /* ──────────────────────────────────────────────
     PART 3: MENU SECTION — Scroll-triggered item reveal
     Background stays fixed, each item activates on scroll
     ────────────────────────────────────────────── */
  const menuSection = document.getElementById('menu-section');
  const menuItems = document.querySelectorAll('.menu-item');
  const menuDots = document.querySelectorAll('.dot');
  const currentItemEl = document.getElementById('current-item');

  // Track which menu item is currently visible
  let activeMenuIndex = 0;

  // IntersectionObserver for each menu item
  const menuItemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.dataset.index);

        // Remove active from all items
        menuItems.forEach(item => item.classList.remove('active'));
        menuDots.forEach(dot => dot.classList.remove('active'));

        // Set active on current
        entry.target.classList.add('active');
        if (menuDots[idx]) menuDots[idx].classList.add('active');
        if (currentItemEl) currentItemEl.textContent = idx + 1;

        activeMenuIndex = idx;
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px -20% 0px'
  });

  menuItems.forEach(item => menuItemObserver.observe(item));

  // Show/hide menu section nav dots based on section visibility
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

  // Dot click → scroll to that menu item
  menuDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.dataset.target);
      if (menuItems[targetIdx]) {
        menuItems[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Mouse parallax on food photos
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
     PART 4: COLD DRINK BAR — Horizontal slider + glass color change
     Kumo-style: click a bottle → glass liquid morphs
     ────────────────────────────────────────────── */
  const drinkSlides = document.querySelectorAll('.drink-slide');
  const glassLiquid = document.getElementById('glass-liquid');
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

    // Remove active from all
    drinkSlides.forEach(s => s.classList.remove('active'));
    drinkDots.forEach(d => d.classList.remove('active'));

    // Set active
    slide.classList.add('active');
    if (drinkDots[index]) drinkDots[index].classList.add('active');

    const fromColor = slide.dataset.liquidFrom;
    const toColor = slide.dataset.liquidTo;
    const drinkName = slide.dataset.drinkName;
    const drinkPrice = slide.dataset.drinkPrice;

    // Drain liquid first then refill with new color
    if (glassLiquid) {
      glassLiquid.style.height = '5%';

      setTimeout(() => {
        glassLiquid.style.background = `linear-gradient(180deg, ${fromColor} 0%, ${toColor} 100%)`;
        glassLiquid.style.height = '70%';

        // Restart bubble animations
        const bubbles = glassLiquid.querySelectorAll('.bubble');
        bubbles.forEach(b => {
          b.style.animation = 'none';
          void b.offsetHeight;
          b.style.animation = '';
        });
      }, 300);
    }

    // Update name label
    if (glassDrinkName) glassDrinkName.textContent = drinkName;
    if (glassSubEl) glassSubEl.textContent = `Chilled & Fresh — ${drinkPrice}`;

    // Scroll slide into view
    slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    currentDrinkIndex = index;
  }

  // Click on drink slide
  drinkSlides.forEach((slide, index) => {
    slide.addEventListener('click', () => activateDrink(index));
  });

  // Dot click
  drinkDots.forEach(dot => {
    dot.addEventListener('click', () => {
      activateDrink(parseInt(dot.dataset.di));
    });
  });

  // Arrow navigation
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

  // Touch/swipe support for drink slider
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
          // Swiped left → next
          activateDrink((currentDrinkIndex + 1) % drinkSlides.length);
        } else {
          // Swiped right → prev
          activateDrink((currentDrinkIndex - 1 + drinkSlides.length) % drinkSlides.length);
        }
      }
    }, { passive: true });
  }

  // Initialize first drink
  activateDrink(0);


  /* ──────────────────────────────────────────────
     BACKGROUND LAYER MANAGEMENT
     Shows kitchen bg only when menu section is active,
     hides it for hero and drinks sections
     ────────────────────────────────────────────── */
  const menuBg = document.querySelector('.menu-bg');
  const menuBgOverlay = document.querySelector('.menu-bg-overlay');

  const sections = [
    document.getElementById('hero-section'),
    document.getElementById('menu-section'),
    document.getElementById('drinks-section'),
    document.getElementById('footer-section')
  ].filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        // Show kitchen bg only for menu section
        if (menuBg) {
          menuBg.style.opacity = id === 'menu-section' ? '1' : '0';
          menuBgOverlay.style.opacity = id === 'menu-section' ? '1' : '0';
        }
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ──────────────────────────────────────────────
     SMOOTH ANCHOR SCROLLING
     For "Explore Menu" CTA button
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

});

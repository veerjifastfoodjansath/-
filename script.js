/* ============================================================
   VEER JI FAST FOOD — MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     FORCE PAGE TO LOAD FROM TOP
     ────────────────────────────────────────────── */
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  requestAnimationFrame(() => { window.scrollTo(0, 0); });


  /* ──────────────────────────────────────────────
     PART 1: SPLASH SCREEN
     Shows for 2s then fades out
     ────────────────────────────────────────────── */
  const splash = document.getElementById('splash-screen');
  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);

  if (splash) {
    setTimeout(() => {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.style.display = 'none';
        document.body.style.overflow = '';
        window.scrollTo(0, 0);
      }, 1000);
    }, 2000);
  }


  /* ──────────────────────────────────────────────
     PART 2: VIDEO HERO
     Video plays once → text fades in → scroll hint
     ────────────────────────────────────────────── */
  const heroVideo = document.getElementById('hero-video');
  const heroContent = document.getElementById('hero-content');
  const scrollHint = document.getElementById('scroll-hint');

  if (heroVideo) {
    heroVideo.style.opacity = '1';
    heroVideo.style.display = 'block';
    heroVideo.loop = false;
    heroVideo.muted = false; // mute/unmute from here
    heroVideo.playsInline = true;

    // Wait for splash to finish before playing video
    setTimeout(() => {
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
       playPromise.catch(error => {
          console.log('Video autoplay failed:', error);
        });
      }
    }, 2000);

    // After video ends → show headline + button
    heroVideo.addEventListener('ended', () => {
      heroVideo.pause();
      if (heroContent) heroContent.classList.add('visible');
      setTimeout(() => {
        if (scrollHint) scrollHint.classList.add('show');
      }, 1000);
    });

    // Fallback: show content after 8s if video never ends
    setTimeout(() => {
      if (heroContent && !heroContent.classList.contains('visible')) {
        heroContent.classList.add('visible');
        if (scrollHint) scrollHint.classList.add('show');
      }
    }, 8000);  //if not work then change to 4000 from 8000

  } else {
    if (heroContent) heroContent.classList.add('visible');
    if (scrollHint) setTimeout(() => scrollHint.classList.add('show'), 800);
  }


  /* ──────────────────────────────────────────────
     PART 3: MENU SECTION — Scroll-triggered reveal
     Background fixed, each item activates on scroll
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

  // Mouse parallax on food photos (desktop only)
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
    item.addEventListener('mouseleave', () => { img.style.transform = ''; });
  });


  /* ──────────────────────────────────────────────
     EXPLORE VARIETIES BUTTONS
     Each button goes to varieties.html?item=X
     Item key from data-item on parent .menu-item div
     ────────────────────────────────────────────── */
  document.querySelectorAll('.item-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const menuItem = this.closest('.menu-item');
      const itemKey = menuItem ? menuItem.dataset.item : null;
      if (itemKey) {
        window.location.href = `varieties.html?item=${itemKey}`;
      }
    });
  });


  /* ──────────────────────────────────────────────
     PART 4: COLD DRINK BAR
     Click bottle → bottle image swaps + name updates
     ────────────────────────────────────────────── */
  const drinkSlides = document.querySelectorAll('.drink-slide');
  const glassDrinkName = document.getElementById('glass-drink-name');
  const glassSubEl = document.querySelector('.glass-drink-sub');
  const drinksSlider = document.getElementById('drinks-slider');
  const sliderPrev = document.getElementById('slider-prev');
  const sliderNext = document.getElementById('slider-next');
  const drinkDots = document.querySelectorAll('.ddot');
  const glassLiquid = document.getElementById('glass-liquid');

  let currentDrinkIndex = 0;

  function activateDrink(index) {
    const slide = drinkSlides[index];
    if (!slide) return;

    drinkSlides.forEach(s => s.classList.remove('active'));
    drinkDots.forEach(d => d.classList.remove('active'));
    slide.classList.add('active');
    if (drinkDots[index]) drinkDots[index].classList.add('active');

    const drinkName = slide.dataset.drinkName;
    const drinkPrice = slide.dataset.drinkPrice;
    const fromColor = slide.dataset.liquidFrom;
    const toColor = slide.dataset.liquidTo;

    // Swap bottle image in centre display
    const bottleImg = document.getElementById('active-bottle-img');
    if (bottleImg) {
      bottleImg.style.opacity = '0';
      bottleImg.style.transform = 'scale(0.85)';
      setTimeout(() => {
        const newSrc = slide.querySelector('img')?.src;
        if (newSrc) bottleImg.src = newSrc;
        bottleImg.style.opacity = '1';
        bottleImg.style.transform = 'scale(1)';
      }, 200);
    }

    // Glass liquid color (if glass HTML still present)
    if (glassLiquid) {
      glassLiquid.style.height = '5%';
      setTimeout(() => {
        glassLiquid.style.background = `linear-gradient(180deg, ${fromColor} 0%, ${toColor} 100%)`;
        glassLiquid.style.height = '70%';
        glassLiquid.querySelectorAll('.bubble').forEach(b => {
          b.style.animation = 'none';
          void b.offsetHeight;
          b.style.animation = '';
        });
      }, 300);
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
    dot.addEventListener('click', () => activateDrink(parseInt(dot.dataset.di)));
  });

  if (sliderPrev) {
    sliderPrev.addEventListener('click', () => {
      activateDrink((currentDrinkIndex - 1 + drinkSlides.length) % drinkSlides.length);
    });
  }

  if (sliderNext) {
    sliderNext.addEventListener('click', () => {
      activateDrink((currentDrinkIndex + 1) % drinkSlides.length);
    });
  }

  // Touch swipe support
  let touchStartX = 0;
  if (drinksSlider) {
    drinksSlider.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    drinksSlider.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        activateDrink(diff > 0
          ? (currentDrinkIndex + 1) % drinkSlides.length
          : (currentDrinkIndex - 1 + drinkSlides.length) % drinkSlides.length
        );
      }
    }, { passive: true });
  }

  activateDrink(0);


  /* ──────────────────────────────────────────────
     BACKGROUND LAYER MANAGEMENT
     Kitchen BG shows only during menu section
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
      if (entry.isIntersecting && menuBg) {
        const show = entry.target.id === 'menu-section';
        menuBg.style.opacity = show ? '1' : '0';
        if (menuBgOverlay) menuBgOverlay.style.opacity = show ? '1' : '0';
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));


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


  /* ──────────────────────────────────────────────
     CART BADGE ON MAIN PAGE
     Shows count on sticky 🛒 button when items in cart
     ────────────────────────────────────────────── */
  function updateMainCartBadge() {
    try {
      const cart = JSON.parse(sessionStorage.getItem('veerji_cart') || '[]');
      const count = cart.length;
      const badge = document.getElementById('cart-count-badge');
      const cartBtn = document.getElementById('cart-nav-btn');
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
      if (cartBtn && count > 0) {
        cartBtn.style.borderColor = '#D4A853';
        cartBtn.style.color = '#D4A853';
      }
    } catch (e) {}
  }

  updateMainCartBadge();
  window.addEventListener('focus', updateMainCartBadge);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateMainCartBadge();
  });

});

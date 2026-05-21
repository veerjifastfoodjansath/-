/* ============================================================
   VEER JI FAST FOOD — MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     FORCE PAGE TO LOAD FROM TOP (HERO SECTION)
     ────────────────────────────────────────────── */
  // Reset scroll position to absolute top
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  
  // Also use requestAnimationFrame to ensure it works
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });

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
        // Ensure scroll is still at top after splash ends
        window.scrollTo(0, 0);
      }, 1000);

    }, 2000);
  }


 /* ──────────────────────────────────────────────
     PART 2: VIDEO HERO
     Video plays once, text appears on top, video visible
     ────────────────────────────────────────────── */
  const heroVideo = document.getElementById('hero-video');
  const heroContent = document.getElementById('hero-content');
  const scrollHint = document.getElementById('scroll-hint');

  if (heroVideo) {
    // Force video visible immediately
    heroVideo.style.opacity = '1';
    heroVideo.style.display = 'block';
    heroVideo.loop = false; // Play only once
    heroVideo.muted = true;
    heroVideo.playsInline = true;

    // WAIT 2 SECONDS FOR SPLASH SCREEN TO FADE BEFORE DROPPING BURGER
    setTimeout(() => {
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Video autoplay failed:', error);
        });
      }
    }, 2000);

    // After video ends (plays once), freeze on last frame and show text
    heroVideo.addEventListener('ended', () => {
      heroVideo.pause();
      if (heroContent) heroContent.classList.add('visible');
      setTimeout(() => {
        if (scrollHint) scrollHint.classList.add('show');
      }, 1000);
    });

    // Fallback: if video takes too long to load, ensure content is visible
    setTimeout(() => {
      if (heroContent && !heroContent.classList.contains('visible')) {
        heroContent.classList.add('visible');
      }
      if (scrollHint && !scrollHint.classList.contains('show')) {
        scrollHint.classList.add('show');
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

     // --- PASTE THIS NEW LINE RIGHT HERE ---
    resetDrinkButton();

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

    // Update centre bottle image
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


/* ──────────────────────────────────────────────
   MAIN PAGE: CENTRAL DRINK ADD TO CART
   ────────────────────────────────────────────── */
function addCurrentDrinkToCart(btnElement) {
  // 1. If already added, act as a fast-travel to cart
  if (btnElement.classList.contains('added-state')) {
    window.location.href = 'cart.html';
    return;
  }

  // 2. Read what drink is currently sitting in the center stage
  const drinkName = document.getElementById('glass-drink-name').textContent.trim();
  const priceText = document.querySelector('.glass-drink-sub').textContent;
  
  // Extract just the number from the price text (e.g., "₹20" becomes 20)
  const drinkPrice = parseInt(priceText.match(/\d+/)[0], 10);
  
  // Create a clean ID for the cart
  const itemID = 'drink-' + drinkName.toLowerCase().replace(/\s+/g, '-');

  // 3. Open the sessionStorage backpack
  let cart = JSON.parse(sessionStorage.getItem('veerji_cart') || '[]');
  
  // Check if it's already in the bag
  const existingItem = cart.find(item => item.id === itemID);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id: itemID, name: drinkName, price: drinkPrice, parent: 'Cold Drinks', qty: 1 });
  }

  // Save the bag
  sessionStorage.setItem('veerji_cart', JSON.stringify(cart));
  
  // 4. Update the Button UI to look successful (Green)
  btnElement.classList.add('added-state');
  btnElement.style.background = '#25D366';
  btnElement.style.borderColor = '#25D366';
  btnElement.style.color = '#fff';
  btnElement.innerHTML = 'Go to Cart 🛒';
  
  // 5. Update the global cart counter at the top of the page
  if (typeof updateMainCartCounter === "function") {
    updateMainCartCounter();
  }
}

// This function resets the button back to normal when they slide to a new drink
function resetDrinkButton() {
  const drinkBtn = document.getElementById('drink-add-btn');
  if (drinkBtn) {
    drinkBtn.classList.remove('added-state');
    drinkBtn.style.background = '';
    drinkBtn.style.borderColor = '';
    drinkBtn.style.color = '';
    drinkBtn.innerHTML = 'Add to Cart +';
  }
}


/* ============================================================
   UNIVERSAL ADD TO CART ENGINE (For all menu pages)
   ============================================================ */
function addToCart(itemName, itemPrice, btnElement) {
  // 1. Create a clean ID based on the item's name
  const itemID = 'item-' + itemName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // 2. Open the sessionStorage backpack
  let cart = JSON.parse(sessionStorage.getItem('veerji_cart') || '[]');

  // 3. Check if it is already in the cart
  const existingItem = cart.find(item => item.id === itemID);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    // Add new item to the cart
    cart.push({ 
      id: itemID, 
      name: itemName, 
      price: itemPrice, 
      parent: 'Menu Item', 
      qty: 1 
    });
  }

  // 4. Save the backpack
  sessionStorage.setItem('veerji_cart', JSON.stringify(cart));

  // 5. Update the Cart Counter at the top of the screen
  // (Checks for both types of counters you used on different pages)
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const countEl1 = document.getElementById('cartCount');
  const countEl2 = document.getElementById('nav-cart-count');
  const countEl3 = document.getElementById('main-cart-counter');
  
  if (countEl1) countEl1.textContent = totalItems;
  if (countEl2) countEl2.textContent = totalItems + " items";
  if (countEl3) countEl3.textContent = totalItems;

  // 6. Visual Feedback: Make the button turn Green and say "Added ✓"
  if (btnElement) {
    const originalText = btnElement.innerHTML;
    const originalBg = btnElement.style.background;
    
    btnElement.classList.add('added');
    btnElement.innerHTML = 'Added ✓';
    btnElement.style.background = '#28a745'; // Green success color
    btnElement.style.color = '#fff';

    // Reset the button after 1.5 seconds so they can buy another one
    setTimeout(() => {
      btnElement.classList.remove('added');
      btnElement.innerHTML = originalText;
      btnElement.style.background = originalBg;
    }, 1500);
  }
}

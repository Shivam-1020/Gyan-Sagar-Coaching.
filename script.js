/* ============================================================
   XYZ INSTITUTE – script.js
   Features:
   1.  Sticky Navbar with scroll detection
   2.  Mobile hamburger menu
   3.  Active nav link highlighting on scroll
   4.  Hero Banner Slider (auto + manual)
   5.  Animated number counters (triggered on scroll)
   6.  FAQ Accordion
   7.  Gallery Lightbox
   8.  Scroll-reveal animations
   9.  Smooth scrolling for all anchor links
   10. Scroll-to-top button
   11. Enquiry form submission feedback
============================================================ */


/* ============================================================
   UTILITY: Wait for the DOM to be fully loaded
============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  // Run all feature initialisers
  initNavbar();
  initMobileMenu();
  initSlider();
  initScrollReveal();
  initCounters();
  initFAQ();
  initGalleryLightbox();
  initScrollTopButton();
  initActiveNavLinks();

});


/* ============================================================
   1. STICKY NAVBAR — adds .scrolled class on scroll
============================================================ */
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}


/* ============================================================
   2. MOBILE MENU — open/close on hamburger click
============================================================ */
function initMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  // Toggle menu open/close
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close the menu when any nav link is clicked
  var links = navLinks.querySelectorAll('.nav-link, .nav-cta-btn');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close the menu when clicking outside of it
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

// Get navbar element for use in closeMenuOnOutsideClick
var navbar = document.querySelector('.navbar');


/* ============================================================
   3. ACTIVE NAV LINK — highlight the section that is in view
============================================================ */
function initActiveNavLinks() {
  var sections = document.querySelectorAll('section[id], div[id]');
  var navLinks  = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  // IntersectionObserver watches each section
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(function (section) {
    observer.observe(section);
  });
}


/* ============================================================
   4. HERO BANNER SLIDER
      — auto advances every 5 seconds
      — responds to prev/next buttons and dot clicks
============================================================ */
function initSlider() {
  var slides   = document.querySelectorAll('.slide');
  var dots     = document.querySelectorAll('.dot');
  var prevBtn  = document.getElementById('sliderPrev');
  var nextBtn  = document.getElementById('sliderNext');

  if (!slides.length) return;

  var currentSlide = 0;
  var autoTimer;

  // Activate a specific slide by index
  function goToSlide(index) {
    // Remove active from current
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Calculate new index (wrap around)
    currentSlide = (index + slides.length) % slides.length;

    // Activate new slide
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  // Move to next slide
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  // Move to previous slide
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Auto-advance every 5 seconds
  function startAutoSlide() {
    autoTimer = setInterval(nextSlide, 5000);
  }

  // Reset timer when manually navigating
  function resetTimer() {
    clearInterval(autoTimer);
    startAutoSlide();
  }

  // Button event listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      nextSlide();
      resetTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      prevSlide();
      resetTimer();
    });
  }

  // Dot click listeners
  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      goToSlide(index);
      resetTimer();
    });
  });

  // Keyboard arrow key support for accessibility
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { nextSlide(); resetTimer(); }
    if (e.key === 'ArrowLeft')  { prevSlide(); resetTimer(); }
  });

  // Start auto-slide
  startAutoSlide();
}


/* ============================================================
   5. ANIMATED NUMBER COUNTERS
      — counts up from 0 to target value
      — triggered when the stats section enters the viewport
============================================================ */
function initCounters() {
  var counters  = document.querySelectorAll('.stat-number');
  var hasRun    = false; // Run only once

  if (!counters.length) return;

  // Animate a single counter element
  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-target'), 10);
    var duration = 2000; // 2 seconds total
    var start    = 0;
    var step     = target / (duration / 16); // 60fps approximation

    var timer = setInterval(function () {
      start += step;
      if (start >= target) {
        el.textContent = target.toLocaleString('en-IN');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start).toLocaleString('en-IN');
      }
    }, 16);
  }

  // Use IntersectionObserver to trigger only when visible
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        counters.forEach(function (counter) {
          animateCounter(counter);
        });
      }
    });
  }, { threshold: 0.4 });

  // Observe the stats section
  var statsSection = document.getElementById('stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
}


/* ============================================================
   6. FAQ ACCORDION
      — clicking a question toggles the answer open/closed
      — only one question open at a time
============================================================ */
function initFAQ() {
  var faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all other FAQ items
      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove('open');
      });

      // If the clicked item was not open, open it now
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}


/* ============================================================
   7. GALLERY LIGHTBOX
      — clicking a gallery image opens a full-screen popup
      — prev/next navigation inside lightbox
      — closes on X button or pressing Escape
============================================================ */
function initGalleryLightbox() {
  var galleryItems  = document.querySelectorAll('.gallery-item');
  var lightbox      = document.getElementById('lightbox');
  var lightboxImg   = document.getElementById('lightboxImg');
  var closeBtn      = document.getElementById('lightboxClose');
  var prevBtn       = document.getElementById('lightboxPrev');
  var nextBtn       = document.getElementById('lightboxNext');

  if (!lightbox || !galleryItems.length) return;

  var currentIndex = 0;
  var imageSrcs    = [];

  // Build array of image sources from gallery items
  galleryItems.forEach(function (item, index) {
    var src = item.getAttribute('data-src') || '';
    imageSrcs.push(src);

    // Click on gallery item → open lightbox at that index
    item.addEventListener('click', function () {
      currentIndex = index;
      openLightbox(src);
    });
  });

  // Open the lightbox with a given image src
  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  // Close the lightbox
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  // Navigate to next image
  function showNext() {
    currentIndex = (currentIndex + 1) % imageSrcs.length;
    lightboxImg.src = imageSrcs[currentIndex];
  }

  // Navigate to previous image
  function showPrev() {
    currentIndex = (currentIndex - 1 + imageSrcs.length) % imageSrcs.length;
    lightboxImg.src = imageSrcs[currentIndex];
  }

  // Event listeners
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn)  nextBtn.addEventListener('click', showNext);
  if (prevBtn)  prevBtn.addEventListener('click', showPrev);

  // Close when clicking the background overlay (not the image)
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard controls
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
  });
}


/* ============================================================
   8. SCROLL REVEAL ANIMATIONS
      — elements with class .reveal fade in when they scroll
        into the viewport
============================================================ */
function initScrollReveal() {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Stagger the animation slightly for sibling elements
        var delay = entry.target.dataset.delay || 0;
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Add staggered delays to sibling cards automatically
  var cardGroups = [
    '.courses-grid .course-card',
    '.faculty-grid .faculty-card',
    '.toppers-grid .topper-card',
    '.testimonials-grid .testi-card',
    '.stats-grid .stat-card',
    '.gallery-grid .gallery-item',
    '.faq-list .faq-item'
  ];

  cardGroups.forEach(function (selector) {
    var cards = document.querySelectorAll(selector);
    cards.forEach(function (card, index) {
      card.dataset.delay = index * 80; // 80ms stagger between each card
    });
  });

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
}


/* ============================================================
   9. SMOOTH SCROLLING
      — intercepts clicks on all anchor links starting with #
      — scrolls smoothly and offsets for fixed navbar height
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var targetId = anchor.getAttribute('href');
    if (targetId === '#') return; // Skip empty hash links

    var targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    var navbarHeight = document.getElementById('navbar')
      ? document.getElementById('navbar').offsetHeight
      : 68;

    var elementTop = targetEl.getBoundingClientRect().top + window.scrollY;
    var offsetTop  = elementTop - navbarHeight;

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  });
});


/* ============================================================
   10. SCROLL TO TOP BUTTON
       — appears when user scrolls down 400px
       — scrolls smoothly back to top on click
============================================================ */
function initScrollTopButton() {
  var scrollTopBtn = document.getElementById('scrollTop');
  if (!scrollTopBtn) return;

  // Show/hide based on scroll position
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  // Scroll to top on click
  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============================================================
   11. ENQUIRY FORM SUBMISSION
       — simple validation and visual feedback
       — in a real site, you would POST to a backend or
         a form service (Formspree, EmailJS, etc.)
============================================================ */
function submitEnquiry() {
  // Gather field values
  var parentName   = document.getElementById('parentName');
  var phone        = document.getElementById('phone');
  var studentName  = document.getElementById('studentName');
  var classSelect  = document.getElementById('classSelect');

  // Basic validation — check required fields
  if (!parentName || !parentName.value.trim()) {
    showFormMessage('Please enter the parent / guardian name.', 'error');
    parentName.focus();
    return;
  }

  if (!phone || !phone.value.trim()) {
    showFormMessage('Please enter a phone number.', 'error');
    phone.focus();
    return;
  }

  if (!studentName || !studentName.value.trim()) {
    showFormMessage('Please enter the student\'s name.', 'error');
    studentName.focus();
    return;
  }

  if (!classSelect || !classSelect.value) {
    showFormMessage('Please select a course.', 'error');
    classSelect.focus();
    return;
  }

  // All validations passed — show success message
  showFormMessage(
    '✅ Thank you! Your enquiry has been submitted. Our team will contact you within a few hours.',
    'success'
  );

  // Clear the form fields
  if (parentName)  parentName.value  = '';
  if (phone)       phone.value       = '';
  if (studentName) studentName.value = '';
  if (classSelect) classSelect.value = '';

  var messageEl = document.getElementById('message');
  if (messageEl) messageEl.value = '';
}

// Helper: show a temporary form feedback message
function showFormMessage(text, type) {
  // Remove any existing message
  var existing = document.getElementById('formMessage');
  if (existing) existing.remove();

  // Create the message element
  var msg = document.createElement('div');
  msg.id   = 'formMessage';
  msg.textContent = text;

  // Style based on type
  msg.style.cssText = [
    'margin-top: 14px',
    'padding: 14px 18px',
    'border-radius: 10px',
    'font-size: 0.9rem',
    'font-weight: 500',
    'line-height: 1.5',
    type === 'success'
      ? 'background: #f0fdf4; color: #166534; border: 1.5px solid #bbf7d0;'
      : 'background: #fff1f2; color: #9f1239; border: 1.5px solid #fecdd3;'
  ].join(';');

  // Insert message after the submit button
  var submitBtn = document.querySelector('.btn-full');
  if (submitBtn && submitBtn.parentNode) {
    submitBtn.parentNode.insertBefore(msg, submitBtn.nextSibling);
  }

  // Auto-remove after 5 seconds
  setTimeout(function () {
    if (msg.parentNode) msg.remove();
  }, 6000);
}


/* ============================================================
   TICKER: duplicate ticker content for seamless loop
============================================================ */
(function initTicker() {
  var ticker = document.querySelector('.ticker-content');
  if (!ticker) return;

  // Duplicate ticker content to create a seamless infinite scroll
  ticker.innerHTML += ticker.innerHTML;
})();
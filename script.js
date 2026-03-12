(function() {
  'use strict';

  // --- Scroll Animations (Intersection Observer) ---
  function initAnimations() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          var children = entry.target.querySelectorAll('.animate-child');
          children.forEach(function(child, i) {
            child.style.transitionDelay = (i * 0.12 + 0.1) + 's';
            child.classList.add('visible');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
      observer.observe(el);
    });
  }

  // --- Counter Animation for Stats ---
  function initCounters() {
    var counters = document.querySelectorAll('.stats-value');
    if (!counters.length) return;

    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(el) {
      counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var text = el.textContent.trim();
    var match = text.match(/([\d]+)/);
    if (!match) return;

    var target = parseInt(match[1], 10);
    var suffix = text.replace(match[1], '');
    var duration = 1800;
    var start = performance.now();

    function update(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // --- Mobile Navigation Toggle ---
  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function() {
      menu.classList.toggle('nav-open');
      toggle.classList.toggle('nav-toggle-active');
      document.body.classList.toggle('nav-mobile-open');
    });

    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.remove('nav-open');
        toggle.classList.remove('nav-toggle-active');
        document.body.classList.remove('nav-mobile-open');
      });
    });
  }

  // --- Smooth Scroll for anchor links ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var navHeight = document.querySelector('[data-section*="navigation"]');
          var offset = navHeight ? navHeight.offsetHeight : 0;
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  // --- Navbar background on scroll ---
  function initNavScroll() {
    var nav = document.querySelector('[data-section*="navigation"]');
    if (!nav) return;
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    }, { passive: true });
  }

  // --- Broken Image Fallback ---
  function initImageFallbacks() {
    document.querySelectorAll('img').forEach(function(img) {
      if (img.complete && img.naturalWidth === 0 && img.src) {
        handleBrokenImage(img);
      }
      img.addEventListener('error', function() {
        handleBrokenImage(this);
      });
    });
  }

  function handleBrokenImage(img) {
    if (img.dataset.fallback) return;
    img.dataset.fallback = 'true';

    var primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#1e3a5f';
    var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#f59e0b';
    var w = img.getAttribute('width') || img.offsetWidth || 800;
    var h = img.getAttribute('height') || img.offsetHeight || 500;

    // Create an elegant placeholder with icon
    img.src = 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<rect fill="' + primary + '" width="' + w + '" height="' + h + '" opacity="0.08"/>' +
      '<g transform="translate(' + (w/2 - 20) + ',' + (h/2 - 20) + ')" opacity="0.2">' +
      '<rect x="2" y="6" width="36" height="28" rx="4" fill="none" stroke="' + primary + '" stroke-width="2"/>' +
      '<circle cx="13" cy="16" r="4" fill="none" stroke="' + primary + '" stroke-width="2"/>' +
      '<path d="M2 28l10-8 6 5 8-10 12 13" fill="none" stroke="' + accent + '" stroke-width="2"/>' +
      '</g></svg>'
    );
    img.style.backgroundColor = 'color-mix(in srgb, ' + primary + ' 5%, white)';
  }

  // --- Init everything on DOM ready ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initAnimations();
    initCounters();
    initMobileNav();
    initSmoothScroll();
    initNavScroll();
    initImageFallbacks();
  }
})();
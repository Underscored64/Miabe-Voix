/* Miabevoix — Interactions */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);

    const heroContent = document.querySelector('.hero__content');
    if (heroContent && window.scrollY < window.innerHeight) {
      const progress = window.scrollY / window.innerHeight;
      heroContent.style.transform = `translateY(${window.scrollY * 0.18}px)`;
      heroContent.style.opacity = String(1 - progress * 0.85);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const navItems = navLinks.querySelectorAll('a');

  function highlightNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  function observeReveals(root = document) {
    root.querySelectorAll('.reveal, .catalogue-item').forEach((el, i) => {
      if (el.classList.contains('visible')) return;
      const siblingIndex = el.parentElement
        ? Array.from(el.parentElement.children).indexOf(el)
        : i;
      el.style.setProperty('--d', `${Math.min(siblingIndex, 8) * 70}ms`);
      revealObserver.observe(el);
    });
  }

  observeReveals();

  const statNumbers = document.querySelectorAll('.stat__number');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.closest('.stat').classList.add('visible');
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* Catalogue filters */
  const filterButtons = document.querySelectorAll('.catalogue__filters button');
  const groups = document.querySelectorAll('.catalogue-group');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach((b) => b.classList.toggle('is-active', b === btn));

      groups.forEach((group) => {
        const match = filter === 'all' || group.dataset.group === filter;
        group.classList.toggle('is-hidden', !match);
        group.classList.toggle('is-filtered', filter !== 'all' && match);
      });

      observeReveals(document.getElementById('catalogue'));
    });
  });

  /* Lightbox */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    lightboxImage.src = src;
    lightboxImage.alt = alt || '';
    lightboxCaption.textContent = alt || '';
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!lightbox.classList.contains('is-open')) {
        lightbox.hidden = true;
        lightboxImage.src = '';
      }
    }, 320);
  }

  document.querySelectorAll('.catalogue-item').forEach((item) => {
    item.addEventListener('click', () => {
      openLightbox(item.dataset.src, item.dataset.alt);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
})();

/* Miabevoix  Interactions */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const heroBg = document.getElementById('heroBg');
  const galleryTrack = document.getElementById('galleryTrack');

  /* Header scroll effect */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);

    /* Hero content parallax */
    const heroContent = document.querySelector('.hero__content');
    if (heroContent && window.scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      heroContent.style.opacity = 1 - window.scrollY / (window.innerHeight * 0.9);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  /* Active nav link on scroll */
  const sections = document.querySelectorAll('section[id]');
  const navItems = navLinks.querySelectorAll('a');

  function highlightNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* Scroll reveal with staggered delays */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  revealEls.forEach((el, i) => {
    el.dataset.delay = (i % 6) * 100;
    revealObserver.observe(el);
  });

  /* Animated counters */
  const statNumbers = document.querySelectorAll('.stat__number');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.closest('.stat').classList.add('visible');
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* Gallery: pause on hover (CSS) + subtle speed on scroll */
  if (galleryTrack) {
    const gallery = galleryTrack.closest('.gallery');
    gallery.addEventListener('mouseenter', () => {
      galleryTrack.style.animationPlayState = 'paused';
    });
    gallery.addEventListener('mouseleave', () => {
      galleryTrack.style.animationPlayState = 'running';
    });
  }

  /* Service cards: tilt on mouse move */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) scale(1.01) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();

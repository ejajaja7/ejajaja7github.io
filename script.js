const nav = document.querySelector('.navbar');
const currentPage = document.body.dataset.page;

document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.dataset.page === currentPage) link.classList.add('active');
});

const onScroll = () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 18);
};
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// Slowly draws the Journey line after the page enters the viewport.
const journeyTrack = document.querySelector('.journey-track');
if (journeyTrack && 'IntersectionObserver' in window) {
  const journeyObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      journeyTrack.classList.add('active');
      journeyObserver.disconnect();
    }
  }, {threshold:0.18});
  journeyObserver.observe(journeyTrack);
}

// Very subtle pointer movement for desktop: interactive, but never distracting.
const portrait = document.querySelector('.portrait-stage');
if (portrait && window.matchMedia('(pointer:fine)').matches) {
  portrait.addEventListener('pointermove', event => {
    const r = portrait.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - .5;
    const y = (event.clientY - r.top) / r.height - .5;
    portrait.style.setProperty('--mx', `${x * 10}px`);
    portrait.style.setProperty('--my', `${y * 10}px`);
  });
  portrait.addEventListener('pointerleave', () => {
    portrait.style.setProperty('--mx', '0px');
    portrait.style.setProperty('--my', '0px');
  });
}


// Visual-only interaction layer: no text or image content is changed.
document.addEventListener('DOMContentLoaded', () => {
  // Scroll progress line
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.width = `${Math.max(0, Math.min(100, ratio * 100))}%`;
  };
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  // Fine-pointer ambient cursor light — subtle and non-blocking.
  if (window.matchMedia('(pointer:fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.append(glow, dot);

    let mx = window.innerWidth * .5, my = window.innerHeight * .5;
    let gx = mx, gy = my;
    const tick = () => {
      gx += (mx - gx) * .13;
      gy += (my - gy) * .13;
      glow.style.left = `${gx}px`;
      glow.style.top = `${gy}px`;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
      requestAnimationFrame(tick);
    };
    tick();

    document.addEventListener('pointermove', e => {
      mx = e.clientX;
      my = e.clientY;
      document.body.classList.add('cursor-active');
    }, {passive:true});
    document.addEventListener('pointerleave', () => {
      document.body.classList.remove('cursor-active');
    });
  }

  // Stagger hover emphasis for text rows, keeping the editorial layout intact.
  document.querySelectorAll('.interest-row, .trait, .journey-stop').forEach((item, i) => {
    item.style.setProperty('--item-delay', `${i * 55}ms`);
  });

  // Magnetic micro-interaction for links/buttons only.
  if (window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) / r.width;
        const y = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = `translate(${x * 8}px,${y * 6}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  // Cross-page fade: content is unchanged; only the visual transition changes.
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    if (link.target === '_blank') return;
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      e.preventDefault();
      document.body.classList.add('page-leaving');
      setTimeout(() => { window.location.href = url.href; }, 260);
    });
  });
});

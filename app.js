(() => {
  'use strict';
  const config = window.PORTFOLIO_CONFIG || {};
  const projects = {
    tinyFarm: {
      title: 'Tiny Farm: A Willowbrook Story', category: 'FARMING SIM · UNITY · URP 2D',
      description: 'You have twelve days to restore a farm before the village’s Harvest Festival. There are crops to grow, buildings to repair, and villagers with quests. You can keep farming after the story ends.',
      details: ['Farming, inventory, and shop rules live in plain C# classes, separate from the Unity components.', 'Quests use story flags to track progress. The save system stores the game state as versioned JSON.'],
      images: [['tiny-farm-menu', 'Tiny Farm’s illustrated title screen'], ['tiny-farm-gameplay', 'Tiny Farm gameplay with crops, farm buildings, and an inventory hotbar'], ['tiny-farm-night', 'Willowbrook at night with warmly lit buildings']],
      credit: 'Game assets include Kenney’s Tiny Farm pack. Screenshots from the Unity project.'
    },
    foldspace: {
      title: 'Foldspace', category: 'ARCADE SURVIVAL · UNITY · C#',
      description: 'Your ship leaves a trail as it moves. Closing that trail into a loop damages the enemies inside it. Closing more loops in quick succession builds a score chain.',
      details: ['The game detects closed trail loops and checks which enemies are inside before applying damage.', 'Enemy spawning and score chains control the pace, with camera, sound, and UI effects providing feedback.'],
      images: [['foldspace-gameplay', 'Foldspace gameplay in a glowing circular arena'], ['foldspace-fold', 'Foldspace’s loop-folding mechanic in action'], ['foldspace-title', 'Foldspace title screen']],
      credit: 'Screenshots from the Unity project.'
    },
    worms: {
      title: 'Worms', category: 'PUZZLE · CONSTRUCT 3 · HTML5',
      description: 'Guide a worm across the board and fill every tile without trapping yourself. Work through 80 levels with touch-based directional controls and saved progress.',
      details: ['I developed the game and created its sound and audio.', 'The movement system checks the path ahead, draws the worm’s body through each turn, and detects when no valid moves remain.', 'Level selection and local storage track unlocked stages. The game includes a first-level tutorial, music, and sound effects.'],
      images: [['worms-cover', 'Worms title artwork with colorful cartoon worms around a green play button']],
      credit: 'Game development and audio by Jay Mehta. Artwork from the supplied Worms project package.'
    },
    grandPrix: {
      title: 'Grand Prix', category: 'ARCADE RACING · UNITY · 3D',
      description: 'A racing game with a black-and-white cartoon style. You race against AI drivers, use turbo on the straights, and try to improve your lap times.',
      details: ['Separate race states handle the countdown, racing, and results.', 'The HUD shows lap times, race position, and turbo charge while you drive.'],
      images: [['grand-prix-menu', 'Grand Prix’s vintage cartoon title screen'], ['grand-prix-gameplay', 'Grand Prix racing with a third-person camera and monochrome race HUD']],
      credit: 'Game assets include Kenney’s Car Kit. Screenshots from the Unity project.'
    }
  };
  function safeUrl(value, domain) {
    try {
      const url = new URL(value);
      if (url.protocol === 'https:' && (url.hostname === domain || url.hostname.endsWith('.' + domain))) return url.href;
    } catch { /* An empty or invalid URL leaves the release status visible. */ }
    return null;
  }
  function releaseLink(id) {
    const url = safeUrl(config.games?.[id], 'itch.io');
    if (!url) {
      const status = document.createElement('span');
      status.className = 'release';
      status.textContent = 'Coming to itch.io';
      return status;
    }
    const link = document.createElement('a');
    link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.className = 'release live'; link.textContent = 'Play on itch.io ↗';
    link.setAttribute('aria-label', `Play ${projects[id].title} on itch.io`);
    return link;
  }
  document.querySelectorAll('[data-release]').forEach(el => el.replaceWith(releaseLink(el.dataset.release)));
  [['itch', config.itchProfile, 'itch.io'], ['github', config.githubProfile, 'github.com']].forEach(([key, value, domain]) => {
    const url = safeUrl(value, domain), link = document.querySelector(`[data-profile="${key}"]`);
    if (url) { link.href = url; link.hidden = false; }
  });
  if (Object.keys(projects).every(id => safeUrl(config.games?.[id], 'itch.io'))) {
    document.querySelector('.work-footnote').textContent = 'You can play these games on itch.io.';
  }
  document.querySelector('#year').textContent = new Date().getFullYear();
  const recommendations = (Array.isArray(config.recommendations) ? config.recommendations : [])
    .filter(item => item && typeof item.name === 'string' && item.name.trim() && typeof item.quote === 'string' && item.quote.trim());
  if (recommendations.length) {
    const section = document.querySelector('#recommendations');
    const track = document.querySelector('#recommendations-track');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let dragging = false;
    recommendations.forEach(item => {
      const card = document.createElement('a');
      card.className = 'recommendation-card';
      card.href = 'https://www.linkedin.com/in/jaymehta721/details/recommendations/';
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.setAttribute('aria-label', `Read ${item.name.trim()}’s recommendation on LinkedIn (opens in a new tab)`);
      const quote = document.createElement('blockquote');
      const excerpt = typeof item.excerpt === 'string' && item.quote.includes(item.excerpt) ? item.excerpt.trim() : item.quote.trim();
      quote.textContent = excerpt;
      const credit = document.createElement('div');
      credit.className = 'recommendation-credit';
      const avatar = document.createElement('span');
      avatar.className = 'recommendation-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = item.name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join('');
      const attribution = document.createElement('div');
      const name = document.createElement('span');
      name.textContent = item.name.trim();
      attribution.append(name);
      if (typeof item.role === 'string' && item.role.trim()) {
        const role = document.createElement('span');
        role.className = 'recommendation-role'; role.textContent = item.role.trim();
        attribution.append(role);
      }
      const metadata = [item.relationship, item.date].filter(value => typeof value === 'string' && value.trim());
      if (metadata.length) {
        const meta = document.createElement('span'); meta.className = 'recommendation-meta';
        meta.textContent = metadata.join(' · '); attribution.append(meta);
      }
      credit.append(avatar, attribution);
      card.append(quote, credit); track.append(card);
    });
    section.hidden = false;
    // A second copy lets the row wrap without jumping between cards.
    const originals = [...track.children];
    const copies = originals.map(card => {
      const copy = card.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.tabIndex = -1;
      track.append(copy);
      return copy;
    });
    let cycleWidth = 0;
    let moving = false;
    function sizeMarquee() {
      const step = originals[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
      cycleWidth = step * originals.length;
      moving = !reducedMotion.matches && cycleWidth - parseFloat(getComputedStyle(track).gap) > track.clientWidth + 1;
      copies.forEach(copy => { copy.hidden = !moving; });
      track.scrollLeft = moving ? cycleWidth : 0;
    }
    track.addEventListener('pointerdown', () => { dragging = true; });
    window.addEventListener('pointerup', () => { dragging = false; });
    window.addEventListener('pointercancel', () => { dragging = false; });
    reducedMotion.addEventListener('change', sizeMarquee);
    window.addEventListener('resize', sizeMarquee);
    sizeMarquee();
    let previousTime;
    function animate(time) {
      const elapsed = previousTime === undefined ? 0 : Math.min(time - previousTime, 50);
      previousTime = time;
      const bounds = track.getBoundingClientRect();
      if (moving && !dragging && !document.hidden && !track.matches(':hover, :focus-within') && bounds.bottom > 0 && bounds.top < window.innerHeight) {
        // Decreasing scrollLeft moves the cards visually from left to right.
        let next = track.scrollLeft - elapsed * 0.03;
        if (next <= 0) next += cycleWidth;
        track.scrollLeft = next;
      }
      window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
  }
  const dialog = document.querySelector('#project-dialog');
  const galleryImage = document.querySelector('#gallery-image');
  let activeProject, imageIndex = 0;
  function showImage(index) {
    const images = activeProject.images;
    imageIndex = (index + images.length) % images.length;
    galleryImage.src = `assets/images/${images[imageIndex][0]}.webp`;
    galleryImage.alt = images[imageIndex][1];
    document.querySelector('#gallery-count').textContent = `${imageIndex + 1} / ${images.length}`;
    document.querySelector('.gallery-controls').hidden = images.length < 2;
  }
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.project;
    activeProject = projects[id];
    document.querySelector('#dialog-title').textContent = activeProject.title;
    document.querySelector('#dialog-category').textContent = activeProject.category;
    document.querySelector('#dialog-description').textContent = activeProject.description;
    document.querySelector('#dialog-credit').textContent = activeProject.credit;
    document.querySelector('#dialog-details').replaceChildren(...activeProject.details.map(text => {
      const li = document.createElement('li'); li.textContent = text; return li;
    }));
    document.querySelector('#dialog-release').replaceChildren(releaseLink(id));
    showImage(0);
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
    dialog.querySelector('.close-button').focus();
  }));
  document.querySelector('#previous-image').addEventListener('click', () => showImage(imageIndex - 1));
  document.querySelector('#next-image').addEventListener('click', () => showImage(imageIndex + 1));
  dialog.querySelector('.close-button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(imageIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showImage(imageIndex + 1); }
  });
})();

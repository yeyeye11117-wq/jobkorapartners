// services_outsourcing_modal.js
(function () {
  const cards = document.querySelectorAll('.service_item');
  const modal = document.getElementById('outsModal');
  if (!cards.length || !modal) return;

  const titleEl = document.getElementById('outsModalTitle');
  const descEl  = document.getElementById('outsModalDesc');
  const listEl  = document.getElementById('outsModalList');
  const imgEl   = document.getElementById('outsModalImg');

  function openModal(data) {
    titleEl.textContent = data.title || '';
    descEl.textContent  = data.desc  || '';
    listEl.innerHTML = '';
    if (data.bullets && data.bullets.length) {
      const ul = document.createElement('ul');
      data.bullets.forEach(t => { const li = document.createElement('li'); li.textContent = t.trim(); ul.appendChild(li); });
      listEl.appendChild(ul);
    }
    if (data.img) imgEl.src = data.img;

    modal.classList.add('is-open');
    document.body.classList.add('body--modal-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('body--modal-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const title   = card.getAttribute('data-title') || '';
      const desc    = card.getAttribute('data-desc')  || '';
      const bullets = (card.getAttribute('data-bullets') || '').split('|').filter(Boolean);
      const img     = card.getAttribute('data-img')   || '';
      openModal({ title, desc, bullets, img });
    });
  });

  // 닫기: 배경/버튼/ESC
  modal.addEventListener('click', (e) => { if (e.target.dataset.close === 'true') closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
})();

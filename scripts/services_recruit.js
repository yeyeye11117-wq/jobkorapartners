// services_switcher.js
// 버튼 클릭 즉시 이미지 전환: Blob prefetch + ObjectURL 캐시 사용
// 요구사항: 오른쪽은 이미지 전용, 왼쪽 버튼은 활성 항목만 설명문구로 전환

document.addEventListener('DOMContentLoaded', () => {
  const btns = document.querySelectorAll('.service_btn');
  const imgEl = document.getElementById('servicePreviewImg');
  if (!btns.length || !imgEl) return;

  // 렌더 지연 방지 설정
  imgEl.loading = 'eager';
  imgEl.decoding = 'sync';
  try { imgEl.fetchPriority = 'high'; } catch (_) {}

  // 1) URL 수집
  const urls = [...new Set(Array.from(btns).map(b => b.getAttribute('data-img')).filter(Boolean))];

  // 2) Blob 캐시: url -> objectURL
  const urlToObjectURL = new Map();

  // 3) 프리패치: 모든 이미지를 Blob으로 미리 받아 메모리에 보관
  async function prefetchAll() {
    await Promise.all(urls.map(async (url) => {
      if (!url || urlToObjectURL.has(url)) return;
      try {
        const res = await fetch(url, { cache: 'force-cache' });
        if (!res.ok) throw new Error('fetch failed: ' + res.status);
        const blob = await res.blob();
        const objectURL = URL.createObjectURL(blob);
        urlToObjectURL.set(url, objectURL);
      } catch (e) {
        // 실패 시에도 즉시 전환을 위해 원본 URL을 그대로 사용
        urlToObjectURL.set(url, url);
      }
    }));
  }

function syncLabels(activeBtn) {
  btns.forEach((b) => {
    const txtEl = b.querySelector('.txt');
    const label = b.getAttribute('data-label') || '';
    const desc  = b.getAttribute('data-desc')  || '';

    const sub = (b.getAttribute('data-sub') || '').replace(/\n/g, '<br>');

    const isActive = b === activeBtn;
    b.classList.toggle('is-active', isActive);
    b.setAttribute('aria-selected', isActive ? 'true' : 'false');

    if (!txtEl) return;

    if (isActive) {
      // 활성 시: 설명문 + 부제 함께 표시
      txtEl.innerHTML = `
        <span class="desc">${desc}</span>
        ${sub ? `<span class="sub">${sub}</span>` : ''}
      `;
    } else {
      // 비활성 시: 기본 라벨만 표시
      txtEl.textContent = label;
    }
  });
}

  // 5) 즉시 이미지 교체 (오브젝트 URL 우선)
  function swapImage(url) {
    if (!url) return;
    const cached = urlToObjectURL.get(url);
    // 캐시에 있으면 즉시 교체, 없으면 원본 URL로 교체 후 비동기 프리패치
    if (cached) {
      imgEl.src = cached;
    } else {
      imgEl.src = url;
      // 뒤늦게라도 캐시에 적재
      (async () => {
        try {
          const res = await fetch(url, { cache: 'force-cache' });
          if (!res.ok) return;
          const blob = await res.blob();
          const objectURL = URL.createObjectURL(blob);
          urlToObjectURL.set(url, objectURL);
        } catch (_) {}
      })();
    }
  }

  function activate(btn) {
    const url = btn.getAttribute('data-img');
    swapImage(url);
    syncLabels(btn);
  }

  // 초기 상태: .is-active 우선 동기화
  const initialActive = document.querySelector('.service_btn.is-active') || btns[0];
  if (initialActive) {
    const initUrl = initialActive.getAttribute('data-img');
    if (initUrl) imgEl.src = initUrl; // 첫 페인트 즉시 표시
    syncLabels(initialActive);
  }

  // 프리패치 시작 (백그라운드로 다운로드)
  prefetchAll();

  // 이벤트
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // 클릭 직전에 대상 URL만이라도 보장
      const url = btn.getAttribute('data-img');
      if (url && !urlToObjectURL.has(url)) {
        // 캐시에 없으면 즉시 프리패치 시도(병렬)
        (async () => {
          try {
            const res = await fetch(url, { cache: 'force-cache' });
            if (res.ok) {
              const blob = await res.blob();
              const objectURL = URL.createObjectURL(blob);
              urlToObjectURL.set(url, objectURL);
            }
          } catch (_) {}
        })();
      }
      activate(btn);
    });

    // 접근성(선택적)
    btn.addEventListener('keydown', (e) => {
      const list = Array.from(btns);
      const i = list.indexOf(btn);
      if (e.key === 'ArrowDown') { e.preventDefault(); (list[i + 1] || list[0]).focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); (list[i - 1] || list[list.length - 1]).focus(); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(btn); }
    });
  });
});



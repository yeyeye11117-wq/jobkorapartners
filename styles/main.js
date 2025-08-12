/* =========================
 * main.js (one file)
 * - mainSec02: 가로 아코디언
 * - mainSec03: 좌측 클릭 → 우측 내용 표시/전환 (패널 or 리스트+이미지)
 * - mainSec04: 1400×420 → 100vw×100vh 스크롤 확대
 * - mainSec05: 드래그형 가로 스크롤 뉴스
 * - mainSec01_bottom: 영역 벗어나면 하단 고정 앱 배너
 * ========================= */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- mainSec02: 가로 아코디언 (호버/클릭/키보드 접근성) ---------- */
  (() => {
    const root = document.querySelector('.mainSec02');
    if (!root) return;

    const panels = Array.from(root.querySelectorAll('.panel'));
    const gaps   = Array.from(root.querySelectorAll('.gap'));
    if (!panels.length) return;

    // ARIA 초기화
    panels.forEach((p, i) => {
      p.setAttribute('role', 'button');
      p.setAttribute('aria-expanded', 'false');
      p.setAttribute('aria-controls', `panel-${i}-content`);
      p.setAttribute('tabindex', '0');
      const inner = p.querySelector('.panel__inner');
      if (inner) inner.id = `panel-${i}-content`;
    });

    let current = 0;
    expand(current, false);

    function expand(index, withHoverCollapse = true) {
      current = index;
      panels.forEach((p, i) => p.setAttribute('aria-expanded', String(i === index)));
      if (!withHoverCollapse) root.classList.add('no-hover');
      clearTimeout(expand._t);
      expand._t = setTimeout(() => root.classList.remove('no-hover'), 500);
    }

    // 마우스/터치 클릭
    panels.forEach((p, i) => p.addEventListener('click', () => expand(i)));
    gaps.forEach(g => {
      g.addEventListener('click', () => {
        const idx = Number(g.dataset.target) || 0;
        expand(idx);
      });
    });

    // 키보드 내비게이션
    root.addEventListener('keydown', (e) => {
      const key = e.key;
      if (!['ArrowLeft','ArrowRight','Home','End','Enter',' '].includes(key)) return;
      const focusedIndex = panels.indexOf(document.activeElement);
      let next = focusedIndex < 0 ? current : focusedIndex;

      if (key === 'ArrowRight') next = (next + 1) % panels.length;
      if (key === 'ArrowLeft')  next = (next - 1 + panels.length) % panels.length;
      if (key === 'Home')       next = 0;
      if (key === 'End')        next = panels.length - 1;

      if (key === 'Enter' || key === ' ') {
        expand(next, false);
        e.preventDefault();
        return;
      }

      panels[next].focus();
      expand(next, false);
      e.preventDefault();
    });

    // 호버 상호작용
    panels.forEach((p, i) => p.addEventListener('mouseenter', () => expand(i)));
  })();


  /* ---------- mainSec03: 좌측 클릭 → 우측 표시/전환 ---------- */
 /* ---------- mainSec03: 좌측 클릭 → 우측 표시/전환 ---------- */
(() => {
  const leftTabs  = document.querySelectorAll('.mainSec03Conleft ul li');
  const rightRoot = document.querySelector('.mainSec03ConRight');
  if (!leftTabs.length || !rightRoot) return;

  const paneMode = rightRoot.querySelector('[data-pane]') !== null;
  const listEl   = rightRoot.querySelector('ul');
  const imgEl    = rightRoot.querySelector('.img-wrap img');

  leftTabs.forEach((li, i) => {
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    if (paneMode) {
      const pane = rightRoot.querySelectorAll('[data-pane]')[i];
      if (pane) {
        li.setAttribute('aria-controls', `ms3-pane-${i}`);
        pane.id = `ms3-pane-${i}`;
      }
    }
  });

  const defaultData = [
    { bullets: ['국내 파견·도급 기업 다수가 활용하는 플랫폼','연동 가능한 채용시스템으로 효율화','제한 없는 공고 등록과 서칭 지원','데이터 기반 리포트 제공'], img: '/assets/img/mainSec03-0.png', alt: '플랫폼 개요' },
    { bullets: ['대규모 구직자 DB 기반 탐색','직무/경력 필터로 정밀 매칭','브랜딩형 채용관 구성','성과 지표 대시보드 제공'], img: '/assets/img/mainSec03-1.png', alt: '탐색/매칭' },
    { bullets: ['운영 표준 프로세스 적용','근태·정산 연동 옵션','담당 매니저 1:1 대응','FAQ/가이드 제공'], img: '/assets/img/mainSec03-2.png', alt: '운영/지원' },
    { bullets: ['보안/개인정보 보호 기준 준수','지속 가능한 파트너십 지향','안정적인 운영 품질','투명한 커뮤니케이션'], img: '/assets/img/mainSec03-3.png', alt: '보안/파트너십' }
  ];

  function getPayload(index) {
    const li = leftTabs[index];
    const def = defaultData[index] || defaultData[0];
    const raw = (li && li.dataset.bullets) ? li.dataset.bullets : null;
    const bullets = raw ? raw.split('|').map(s => s.trim()).filter(Boolean) : def.bullets;
    const src = (li && li.dataset.img) || def.img;
    const alt = (li && li.dataset.alt) || def.alt;
    return { bullets, src, alt };
  }

  function show(index) {
    leftTabs.forEach(li => li.classList.remove('active'));
    leftTabs[index]?.classList.add('active');
    rightRoot.classList.add('is-open');

    if (paneMode) {
      const panes = rightRoot.querySelectorAll('[data-pane]');
      panes.forEach(p => p.classList.remove('is-active'));
      panes[index]?.classList.add('is-active');
    } else if (listEl && imgEl) {
      const { bullets, src, alt } = getPayload(index);
      listEl.innerHTML = '';
      bullets.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        listEl.appendChild(li);
      });
      imgEl.src = src;
      imgEl.alt = alt;
      imgEl.loading = imgEl.loading || 'lazy';
    }
  }

  leftTabs.forEach((li, i) => {
    li.addEventListener('click', () => show(i));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        show(i);
        e.preventDefault();
      }
    });
  });

  // 초기 상태: 첫 번째 항목 활성
  rightRoot.classList.remove('is-open');
  if (paneMode) {
    rightRoot.querySelectorAll('[data-pane]').forEach(p => p.classList.remove('is-active'));
  }
  leftTabs[0]?.classList.add('active');
  show(0);
})();

  /* ---------- mainSec04: 1400×420 → 100vw×100vh 확대 ---------- */
  (() => {
    const stage  = document.querySelector('[data-stage]');
    const sticky = document.querySelector('[data-sticky]');
    const card   = document.querySelector('[data-card]');
    if (!stage || !sticky || !card) return;

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    const lerp  = (a, b, t) => a + (b - a) * t;
    const ease  = (t) => 1 - Math.pow(1 - t, 3);

    const START_W = 1400, START_H = 420, START_R = 32;
    const calcEnd = () => ({ w: window.innerWidth, h: window.innerHeight, r: 0 });

    const getProgress = () => {
      const rect = stage.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const y = clamp(-rect.top, 0, total);
      return total > 0 ? y / total : 0;
    };

    const apply = () => {
      const p = ease(getProgress());
      const { w: EW, h: EH, r: ER } = calcEnd();
      const curW = Math.round(lerp(START_W, EW, p));
      const curH = Math.round(lerp(START_H, EH, p));
      const curR = lerp(START_R, ER, p);
      card.style.width = curW + 'px';
      card.style.height = curH + 'px';
      card.style.borderRadius = curR + 'px';
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { apply(); ticking = false; });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', apply);
    apply();
  })();


  /* ---------- mainSec05: 드래그 가로 스크롤 ---------- */
  (() => {
    const scrollers = document.querySelectorAll('[data-drag-scroll]');
    if (!scrollers.length) return;

    scrollers.forEach(scroller => {
      const track = scroller.querySelector('.mainSec05-track');
      if (!track) return;

      scroller.style.overflow = 'hidden';
      scroller.scrollLeft = 0;

      let isDown = false, startX = 0, startScroll = 0, moved = false;

      const onDown = x => {
        isDown = true; moved = false;
        startX = x; startScroll = scroller.scrollLeft;
        scroller.classList.add('is-grabbing');
      };
      const onMove = x => {
        if (!isDown) return;
        const d = x - startX;
        scroller.scrollLeft = startScroll - d;
        if (Math.abs(d) > 5) moved = true;
      };
      const onUp = () => {
        isDown = false;
        scroller.classList.remove('is-grabbing');
      };

      scroller.addEventListener('mousedown', e => onDown(e.clientX));
      window.addEventListener('mousemove', e => onMove(e.clientX));
      window.addEventListener('mouseup', onUp);

      scroller.addEventListener('touchstart', e => onDown(e.touches[0].clientX), { passive: true });
      scroller.addEventListener('touchmove',  e => onMove(e.touches[0].clientX),  { passive: true });
      scroller.addEventListener('touchend', onUp);

      scroller.addEventListener('click', e => { if (moved) e.preventDefault(); }, true);

      scroller.addEventListener('wheel', e => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          scroller.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      }, { passive: false });
    });
  })();


  /* ---------- mainSec01_bottom: 영역 벗어나면 하단 고정 ---------- */
  (() => {
    const host = document.querySelector('[data-stick-bottom]');
    const banner = document.querySelector('[data-app-banner]');
    if (!host || !banner) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          banner.classList.remove('is-fixed');
        } else {
          const rect = host.getBoundingClientRect();
          if (rect.bottom <= 0) banner.classList.add('is-fixed');
        }
      });
    }, { root: null, threshold: 0 });

    io.observe(host);

    const init = () => {
      const rect = host.getBoundingClientRect();
      if (rect.bottom <= 0) banner.classList.add('is-fixed');
    };
    window.addEventListener('load', init);
  })();

});

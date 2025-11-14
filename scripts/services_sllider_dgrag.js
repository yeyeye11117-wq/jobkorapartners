// services_slider_drag.js
// 데스크톱: 마우스 드래그로 가로 스크롤, 모바일: 네이티브 터치 스크롤
(function () {
  const sliders = document.querySelectorAll('.service_slider');
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    // 드래그 시작
    const onPointerDown = (e) => {
      isDown = true;
      slider.setPointerCapture?.(e.pointerId);
      startX = e.clientX;
      startScroll = slider.scrollLeft;
      // 링크 클릭 방지용
      slider.dataset.dragging = '1';
    };

    // 드래그 이동
    const onPointerMove = (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      slider.scrollLeft = startScroll - dx;
      e.preventDefault();
    };

    // 드래그 종료
    const endDrag = (e) => {
      if (!isDown) return;
      isDown = false;
      slider.releasePointerCapture?.(e.pointerId);
      // 약간의 관성 효과
      // 필요 없으면 아래 3줄 삭제
      const v = (slider.scrollLeft - startScroll) * 0.12;
      slider.scrollTo({ left: slider.scrollLeft + v, behavior: 'smooth' });
      // 클릭 방지 플래그 해제(한 프레임 뒤)
      requestAnimationFrame(() => { slider.dataset.dragging = '0'; });
    };

    // 포인터 이벤트(마우스/펜/터치 통합)
    slider.addEventListener('pointerdown', onPointerDown, { passive: true });
    slider.addEventListener('pointermove', onPointerMove, { passive: false });
    slider.addEventListener('pointerup', endDrag, { passive: true });
    slider.addEventListener('pointerleave', endDrag, { passive: true });
    slider.addEventListener('pointercancel', endDrag, { passive: true });

    // 드래그 중 카드 내부 링크 오동작 방지
    slider.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', (e) => {
        if (slider.dataset.dragging === '1') e.preventDefault();
      });
    });
  });
})();

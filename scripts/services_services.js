
const slider = document.querySelector('.service_slider');
const prevBtn = document.querySelector('.slide_btn.prev');
const nextBtn = document.querySelector('.slide_btn.next');

const cardWidth = 340 + 20; // 카드 너비 + gap
let scrollPosition = 0;

nextBtn.addEventListener('click', () => {
  scrollPosition += cardWidth;
  slider.scrollTo({ left: scrollPosition, behavior: 'smooth' });
});

prevBtn.addEventListener('click', () => {
  scrollPosition -= cardWidth;
  if (scrollPosition < 0) scrollPosition = 0;
  slider.scrollTo({ left: scrollPosition, behavior: 'smooth' });
});

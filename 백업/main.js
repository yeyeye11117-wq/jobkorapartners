document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------
  // ① 모바일 메뉴 토글
  // ------------------------------
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeBtn = document.getElementById("closeBtn");
  const overlay = document.getElementById("overlay");

  function openMenu() {
    mobileMenu.classList.add("active");
    overlay.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("active");
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  if (hamburger && closeBtn && overlay) {
    hamburger.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
  }

// ------------------------------
// Floating CTA: 스크롤 이벤트 및 footer 감지 + mainSec06 진입 시 숨김
// ------------------------------
const floatingCTA = document.getElementById("floatingCTA");
const footer = document.querySelector("footer");
const mainSec06 = document.querySelector(".mainSec06");

window.addEventListener("scroll", () => {
  if (!floatingCTA || !footer) return;

  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const footerTop = footer.getBoundingClientRect().top + window.scrollY;
  const windowHeight = window.innerHeight;
  const ctaHeight = floatingCTA.offsetHeight;
  const stopPoint = footerTop - windowHeight + ctaHeight + 40;

  // mainSec06의 위치 계산
  let hidePoint = 0;
  if (mainSec06) {
    const mainSec06Top = mainSec06.getBoundingClientRect().top + window.scrollY;
    hidePoint = mainSec06Top - windowHeight / 2; // mainSec06 중간쯤에서 숨김 시작
  }

  // CTA 노출 조건: 600px 이상 스크롤 & mainSec06 이전까지만
  if (scrollY > 600 && scrollY < hidePoint) {
    floatingCTA.classList.add("show");
  } else {
    floatingCTA.classList.remove("show");
  }

  // footer에 닿으면 fixed → absolute 변경
  if (scrollY > stopPoint) {
    floatingCTA.classList.add("stop");
  } else {
    floatingCTA.classList.remove("stop");
  }
});


  // ------------------------------
  // ③ mainSec04 탭 클릭 + 자동 전환
  // ------------------------------
  const tabs = document.querySelectorAll(".mainSec04_tab");
  const images = document.querySelectorAll(".mainSec04_image");
  let current = 0;
  let interval;

  if (tabs.length && images.length) {
    function activateTab(index) {
      tabs.forEach((tab, i) => {
        tab.classList.toggle("is-active", i === index);
        images[i].classList.toggle("is-active", i === index);
      });
      current = index;
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        activateTab(index);
        resetInterval();
      });
    });

    function startAutoPlay() {
      interval = setInterval(() => {
        const next = (current + 1) % tabs.length;
        activateTab(next);
      }, 4000);
    }

    function resetInterval() {
      clearInterval(interval);
      startAutoPlay();
    }

    // 초기 실행
    activateTab(0);
    startAutoPlay();
  }
  

const header = document.querySelector('.header#main-header');
const megaMenu = document.querySelector('.nav_megamenu_all');

header.addEventListener('mouseenter', () => header.classList.add('menu-open'));
megaMenu.addEventListener('mouseenter', () => header.classList.add('menu-open'));
header.addEventListener('mouseleave', () => header.classList.remove('menu-open'));
megaMenu.addEventListener('mouseleave', () => header.classList.remove('menu-open'));




});


document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.scroll-fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // 1회만 작동
      }
    });
  }, {
    threshold: 0.2
  });

  elements.forEach(el => observer.observe(el));
});




window.addEventListener('scroll', () => {
  const section = document.querySelector('.mainSec04a');
  const track = document.querySelector('.mainSec04a_track');
  const rect = section.getBoundingClientRect();

  // 섹션이 화면에 들어왔을 때만 작동
  if (rect.top <= 0 && rect.bottom >= 0) {
    const scrollProgress = Math.min(Math.max(-rect.top / (rect.height - window.innerHeight), 0), 1);
    const maxTranslate = track.scrollWidth - window.innerWidth + 600; // 왼쪽 기준 600px 여유
    const translateX = -scrollProgress * maxTranslate;

    track.style.transform = `translateX(${translateX}px)`;
  }
});

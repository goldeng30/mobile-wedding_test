/* ──────────────────────────────────────────
   유틸: 캐릭터를 body로 꺼내 fixed 고정
────────────────────────────────────────── */

function attachCharFixed() {
  const char = document.getElementById("page1-char");
  const rect = char.getBoundingClientRect();

  // body 직속으로 이동 (부모 position의 영향 차단)
  document.body.appendChild(char);

  char.style.cssText = [
    "position: fixed",
    `top: ${rect.top}px`,
    `left: ${rect.left}px`,
    `width: ${rect.width}px`,
    `height: ${rect.height}px`,
    "transform: none",
    "z-index: 500",
    "opacity: 1",
    "transition: none",
    "margin: 0",
    "padding: 0"
  ].join("; ");

  return char;
}

/* 캐릭터를 page1-scene으로 복귀 */
function detachChar() {
  const char  = document.getElementById("page1-char");
  const scene = document.getElementById("page1-scene");
  if (char.parentNode !== scene) scene.appendChild(char);
  char.style.cssText = "";
}

/* ──────────────────────────────────────────
   1페이지 애니메이션
────────────────────────────────────────── */

function playPage1Animation() {
  detachChar(); // scene으로 복귀

  const char        = document.getElementById("page1-char");
  const bg          = document.getElementById("page1-bg");
  const parentLeft  = document.getElementById("name-parent-left");
  const nameLeft    = document.getElementById("name-main-left");
  const parentRight = document.getElementById("name-parent-right");
  const nameRight   = document.getElementById("name-main-right");
  const heart       = document.getElementById("page1-heart");

  [bg, parentLeft, nameLeft, parentRight, nameRight].forEach(el => {
    el.style.transition = "none";
    el.style.opacity    = "0";
  });
  char.style.transition = "none";
  char.style.opacity    = "0";
  char.style.transform  = "translateX(-50%) translateY(-150%)";
  heart.style.transition = "none";
  heart.style.opacity    = "0";
  heart.style.transform  = "scale(0.15)";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      char.style.transition = "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.1s";
      char.style.opacity    = "1";
      char.style.transform  = "translateX(-50%) translateY(0)";
      // 캐릭터 낙하 효과음
      const sfxDrop = document.getElementById("sfx-drop");
      if (sfxDrop) { sfxDrop.currentTime = 0; sfxDrop.play().catch(() => {}); }

      setTimeout(() => {
        bg.style.transition = "opacity 4s ease";
        bg.style.opacity    = "1";
        const sfxBg = document.getElementById("sfx-background");
        if (sfxBg) { sfxBg.volume = 0.3; sfxBg.currentTime = 0; sfxBg.play().catch(() => {}); }
        setTimeout(() => {
          parentLeft.style.transition = "opacity 0.6s ease";
          parentLeft.style.opacity    = "1";
          setTimeout(() => {
            nameLeft.style.transition = "opacity 0.6s ease";
            nameLeft.style.opacity    = "1";
            setTimeout(() => {
              parentRight.style.transition = "opacity 0.6s ease";
              parentRight.style.opacity    = "1";
              setTimeout(() => {
                nameRight.style.transition = "opacity 0.6s ease";
                nameRight.style.opacity    = "1";
                setTimeout(() => {
                  // 하트 효과음
                  const sfx = document.getElementById("sfx-heart");
                  if (sfx) { sfx.currentTime = 0; sfx.play().catch(() => {}); }

                  heart.style.transition = "opacity 0.4s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
                  heart.style.opacity    = "1";
                  heart.style.transform  = "scale(1)";
                }, 700);
              }, 700);
            }, 700);
          }, 700);
        }, 1500);
      }, 1430);
    });
  });
}

/* ──────────────────────────────────────────
   스플래시 & 배경음악
────────────────────────────────────────── */

function startExperience() {
  const bgm    = document.getElementById("bgm");
  const splash = document.getElementById("splash");
  bgm.volume = 0.6;
  bgm.play().catch(() => {});

  // 모든 효과음을 버튼 클릭 직후(사용자 인터랙션 컨텍스트) 미리 unlock
  // → 이후 setTimeout 안에서도 재생 가능해짐
  ["sfx-heart","sfx-down","sfx-drop","sfx-background","sfx-walk"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.volume = 1;
    el.muted  = true;
    el.play().then(() => { el.pause(); el.muted = false; el.currentTime = 0; }).catch(() => {});
  });
  splash.classList.add("hide");
  setTimeout(() => {
    splash.style.display = "none";
    playPage1Animation();
  }, 800);
}

/* ──────────────────────────────────────────
   페이지 이동
────────────────────────────────────────── */

const pages = ["page1", "page2", "page3"];
let currentPage = 0;
let isAnimating = false;

function initWrapper() {
  const wrapper = document.createElement("div");
  wrapper.id = "pages-wrapper";
  const sections = [...document.querySelectorAll(".section")];
  sections.forEach(s => wrapper.appendChild(s));
  document.body.insertBefore(wrapper, document.body.firstChild);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function goToPage(targetIndex) {
  if (isAnimating || targetIndex === currentPage) return;
  if (targetIndex < 0 || targetIndex >= pages.length) return;
  isAnimating = true;

  if (currentPage === 0 && targetIndex === 1) {
    transitionPage1To2();
  } else if (currentPage === 1 && targetIndex === 0) {
    transitionPage2To1();
  } else if (currentPage === 1 && targetIndex === 2) {
    transitionPage2To3();
  } else if (currentPage === 2 && targetIndex === 0) {
    transitionPage3To1();
  } else {
    slideToPage(targetIndex, null);
  }
}

/* ──────────────────────────────────────────
   1→2: 다른 요소 페이드아웃 → 캐릭터 fixed → 슬라이드
────────────────────────────────────────── */

function transitionPage1To2() {
  const sfxDown = document.getElementById("sfx-down");
  if (sfxDown) { sfxDown.currentTime = 0; sfxDown.play().catch(() => {}); }

  const bg      = document.getElementById("page1-bg");
  const heart   = document.getElementById("page1-heart");
  const parentL = document.getElementById("name-parent-left");
  const nameL   = document.getElementById("name-main-left");
  const parentR = document.getElementById("name-parent-right");
  const nameR   = document.getElementById("name-main-right");
  const btn     = document.querySelector("#page1 .button");

  // 1. rect 먼저 측정 (body 이동 전)
  const char = document.getElementById("page1-char");
  char.style.transition = "none";
  const rect = char.getBoundingClientRect();

  // 2. body로 이동
  document.body.appendChild(char);

  // 3. fixed 고정 — top/left를 측정값으로, transition 완전 차단
  char.style.cssText = [
    "position: fixed",
    `top: ${rect.top}px`,
    `left: ${rect.left}px`,
    `width: ${rect.width}px`,
    `height: ${rect.height}px`,
    "transform: none",
    "z-index: 500",
    "opacity: 1",
    "transition: none",     // 슬라이드 내내 절대 움직이지 않음
    "will-change: auto",
    "margin: 0",
    "padding: 0"
  ].join("; ");

  // 4. 나머지 요소 페이드아웃
  [bg, heart, parentL, nameL, parentR, nameR, btn].forEach(el => {
    if (!el) return;
    el.style.transition = "opacity 0.5s ease";
    el.style.opacity    = "0";
  });

  // 5. 슬라이드 실행 — 캐릭터는 transition:none 이므로 완전 고정
  setTimeout(() => {
    slideToPage(1, () => {
      // 슬라이드 완료 후 타임라인 시작
      startTimelineWithFixedChar();
    });
  }, 500);
}

/* ──────────────────────────────────────────
   2→1: 타임라인 정지 → 슬라이드 → 1페이지 초기화
────────────────────────────────────────── */

function transitionPage2To1() {
  if (interval) { clearInterval(interval); interval = null; }

  const char    = document.getElementById("page1-char");
  const topview = document.getElementById("topview");
  const line2   = document.querySelector(".line");
  const dot2    = document.querySelector(".start-dot");
  [char, topview].forEach(el => { el.style.transition = "opacity 0.3s ease"; el.style.opacity = "0"; });
  [line2, dot2].forEach(el => { if(el){ el.style.transition = "opacity 0.3s ease"; el.style.opacity = "0"; } });

  setTimeout(() => {
    slideToPage(0, () => {
      playPage1Animation();
    });
  }, 300);
}

/* ──────────────────────────────────────────
   2→3: 캐릭터 페이드아웃 → 슬라이드
────────────────────────────────────────── */

function transitionPage2To3() {
  if (interval) { clearInterval(interval); interval = null; }

  const char    = document.getElementById("page1-char");
  const topview = document.getElementById("topview");

  // 캐릭터만 숨김 (길·dot·tl-dot 전부 유지)
  char.style.transition = "opacity 0.4s ease";
  char.style.opacity    = "0";

  // topview: 아래로 이동하며 페이드아웃
  const sfxWalk = document.getElementById("sfx-walk");
  if (sfxWalk) { sfxWalk.currentTime = 0; sfxWalk.play().catch(() => {}); }
  const currentTop = parseFloat(topview.style.top) || 0;
  const exitTop    = currentTop + window.innerHeight * 0.25;
  topview.style.transition = "top 1.8s cubic-bezier(0.4, 0, 0.6, 1), opacity 1.5s ease";
  topview.style.top        = exitTop + "px";
  topview.style.opacity    = "0";

  setTimeout(() => {
    slideToPage(2, null);
  }, 650);
}

/* ──────────────────────────────────────────
   3→1: 슬라이드 → 1페이지 완전 초기화
────────────────────────────────────────── */

function transitionPage3To1() {
  slideToPage(0, () => {
    playPage1Animation(); // detachChar 포함
  });
}

/* ──────────────────────────────────────────
   일반 슬라이드
────────────────────────────────────────── */

function slideToPage(targetIndex, callback) {
  const wrapper = document.getElementById("pages-wrapper");
  const vh      = window.innerHeight;
  const startOffset = -currentPage * vh;
  const endOffset   = -targetIndex * vh;
  const duration    = 2000;
  let startTime     = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed  = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeInOutCubic(progress);
    const cur      = startOffset + (endOffset - startOffset) * eased;
    wrapper.style.transform = `translateY(${cur}px)`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      wrapper.style.transform = `translateY(${endOffset}px)`;
      currentPage = targetIndex;
      isAnimating = false;
      if (callback) callback();
    }
  }
  requestAnimationFrame(step);
}





/* ──────────────────────────────────────────
   타임라인 (fixed 캐릭터 top 이동 + 지그재그)
────────────────────────────────────────── */

const pointsVh = [16, 30, 44, 58, 72];
const photos   = ["photo1.jpg","photo2.jpg","photo3.jpg","photo4.jpg","photo5.jpg"];
const texts    = [
  { date:"2025.03.24", title:"우리가 만난 지 100일 🎉", desc:"강릉으로 첫 여행을 떠났던 날, 바다 앞에서 100일을 기념했어요. 그 바람과 웃음이 아직도 생생해요." },
  { date:"2025.05.11", title:"함께한 첫 번째 봄 🌸",   desc:"벚꽃이 흐드러지게 핀 공원을 함께 걸었어요. 꽃비가 내리던 그날, 손을 잡고 걷던 기억이 떠올라요." },
  { date:"2025.07.28", title:"여름 바다에서 🌊",        desc:"뜨거운 여름, 제주도로 떠난 둘만의 여행. 투명한 바닷속처럼 서로를 더 깊이 알아간 시간이었어요." },
  { date:"2025.10.14", title:"단풍길 드라이브 🍂",      desc:"빨갛게 물든 산길을 드라이브하며 처음으로 '앞으로도 늘 함께하자'고 말했던 날이에요." },
  { date:"2025.12.24", title:"프러포즈 그날 밤 💍",     desc:"눈이 내리던 크리스마스 이브, 반짝이는 도시 야경 앞에서 평생을 함께하자고 약속했어요." }
];

let current  = 0;
let interval = null;

function initPage2Layout() {
  const vh = window.innerHeight;
  const startRatio = 0.13;
  const entryH     = 0.13;
  const lineEndR   = 0.88;

  const line = document.querySelector(".line");
  if (line) {
    line.style.top    = (startRatio * vh) + "px";
    line.style.height = ((lineEndR - startRatio) * vh) + "px";
  }

  const startDot = document.querySelector(".start-dot");
  if (startDot) startDot.style.top = (startRatio * vh) + "px";

  pointsVh.forEach((ratio, i) => {
    const entry = document.getElementById("e" + (i + 1));
    if (entry) {
      entry.style.top    = (ratio / 100 * vh) + "px";
      entry.style.height = (entryH * vh) + "px";
    }
  });
}

function startTimelineWithFixedChar() {
  if (interval) clearInterval(interval);
  current = 0;

  // 레이아웃 px 초기화
  initPage2Layout();

  // 라인·스타트도트 숨김 상태 확인
  const line     = document.querySelector(".line");
  const startDot = document.querySelector(".start-dot");
  if (line)     { line.style.transition = "none"; line.style.opacity = "0"; }
  if (startDot) { startDot.style.transition = "none"; startDot.style.opacity = "0"; }

  for (let i = 1; i <= 5; i++) {
    const photo = document.getElementById("p" + i);
    const text  = document.querySelector("#e" + i + " .tl-text");
    if (photo) { photo.style.display = "none"; photo.classList.remove("visible"); }
    if (text)  { text.classList.remove("visible"); }
  }

  const char    = document.getElementById("page1-char");
  const topview = document.getElementById("topview");
  const vh      = window.innerHeight;
  const startTop = 0.13 * vh;
  const entryH   = 0.13 * vh;

  // topview 초기 위치 세팅 (투명)
  topview.style.transition = "none";
  topview.style.top        = startTop + "px";
  topview.style.opacity    = "0";

  // 1단계: 캐릭터 페이드아웃
  char.style.transition = "opacity 0.5s ease";
  char.style.opacity    = "0";

  // 2단계: topview 페이드인
  setTimeout(() => {
    topview.style.transition = "top 1.2s cubic-bezier(0.45, 0, 0.55, 1), opacity 0.6s ease";
    topview.style.opacity    = "1";

    // 3단계: topview 페이드인 완료 후 → 길 페이드인
    setTimeout(() => {
      if (line)     { line.style.transition = "opacity 0.8s ease"; line.style.opacity = "1"; }
      if (startDot) { startDot.style.transition = "opacity 0.8s ease"; startDot.style.opacity = "1"; }
      document.querySelectorAll(".tl-dot").forEach(el => {
        el.style.transition = "opacity 0.8s ease";
        el.style.opacity    = "1";
      });

      // 4단계: 길 페이드인 완료 후 → topview 이동 시작
      setTimeout(() => {
        interval = setInterval(() => {
          if (current >= pointsVh.length) { clearInterval(interval); return; }
          const idx = current;

          const entryTop = (pointsVh[idx] / 100) * vh;
          topview.style.top = (entryTop + entryH / 2) + "px";

          const dateEl  = document.getElementById("td" + (idx + 1));
          const titleEl = document.getElementById("tt" + (idx + 1));
          if (dateEl)  dateEl.textContent  = texts[idx].date;
          if (titleEl) titleEl.textContent = texts[idx].title;

          const photo = document.getElementById("p" + (idx + 1));
          const text  = document.querySelector("#e" + (idx + 1) + " .tl-text");
          if (photo) {
            photo.style.display = "block";
            setTimeout(() => {
              photo.classList.add("visible");
              if (text) text.classList.add("visible");
            }, 30);
            photo.onclick = () => openDetail(idx);
          }
          current++;
        }, 1500);
      }, 100); // 길 페이드인(0.8s) 완료 후
    }, 700); // topview 페이드인(0.6s) 완료 후
  }, 600); // 캐릭터 아웃(0.5s) 완료 후
}

/* ──────────────────────────────────────────
   상세보기
────────────────────────────────────────── */

function openDetail(idx) {
  const detail = document.getElementById("detail");
  document.getElementById("detail-img").src          = photos[idx];
  document.getElementById("detail-date").textContent  = texts[idx].date;
  document.getElementById("detail-title").textContent = texts[idx].title;
  document.getElementById("detail-desc").textContent  = texts[idx].desc;
  detail.style.display = "flex";
  requestAnimationFrame(() => detail.classList.add("open"));
}

function closeDetail() {
  const detail = document.getElementById("detail");
  detail.classList.remove("open");
  setTimeout(() => { detail.style.display = "none"; }, 300);
}

/* ──────────────────────────────────────────
   초기화
────────────────────────────────────────── */

window.addEventListener("load", () => {
  const _char  = document.getElementById("page1-char");
  const _bg    = document.getElementById("page1-bg");
  const _heart = document.getElementById("page1-heart");
  _char.style.opacity  = "0";
  _bg.style.opacity    = "0";
  if (_heart) { _heart.style.opacity = "0"; _heart.style.transform = "scale(0.15)"; }

  initWrapper();

  document.addEventListener("wheel",     e => e.preventDefault(), { passive: false });
  document.addEventListener("touchmove", e => e.preventDefault(), { passive: false });
  document.addEventListener("keydown", e => {
    if (["ArrowUp","ArrowDown","PageUp","PageDown","Space"].includes(e.code)) {
      e.preventDefault();
    }
  });
});

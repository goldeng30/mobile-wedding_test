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
  detachChar(); // scene으로 복귀 초기화

  const char        = document.getElementById("page1-char");
  const bg          = document.getElementById("page1-bg");
  const scene       = document.getElementById("page1-scene");
  const parentLeft  = document.getElementById("name-parent-left");
  const nameLeft    = document.getElementById("name-main-left");
  const parentRight = document.getElementById("name-parent-right");
  const nameRight   = document.getElementById("name-main-right");
  const heart       = document.getElementById("page1-heart");

  const upper  = document.getElementById("page1-upper");
  const bottom = document.getElementById("page1-bottom");

  // 모든 요소 초기화
  [bg, parentLeft, nameLeft, parentRight, nameRight].forEach(el => {
    el.style.transition = "none"; el.style.opacity = "0";
  });
  if (upper)  { upper.style.transition  = "none"; upper.style.opacity  = "0"; }
  if (bottom) { bottom.style.transition = "none"; bottom.style.opacity = "0"; }
  if (scene)  { scene.style.transition  = "none"; scene.style.opacity  = "0"; }
  heart.style.transition = "none";
  heart.style.opacity    = "0";
  heart.style.transform  = "scale(0.15)";

  // 캐릭터를 body fixed로 꺼내 화면 위에서 시작
  const sceneRect  = scene.getBoundingClientRect();
  const charW      = sceneRect.width * 0.30;
  const charH      = charW; // 정사각형 근사
  const charLeft   = sceneRect.left + sceneRect.width / 2 - charW / 2;
  const charFinalTop = sceneRect.top + sceneRect.height * (1 - 0.18) - charH;

  document.body.appendChild(char);
  char.style.cssText = [
    "position: fixed",
    `top: ${-charH * 3}px`,
    `left: ${charLeft}px`,
    `width: ${charW}px`,
    "transform: none",
    "z-index: 500",
    "opacity: 1",
    "transition: none",
    "margin: 0", "padding: 0"
  ].join("; ");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // 낙하
      char.style.transition = "top 0.65s cubic-bezier(0.22, 1, 0.36, 1)";
      char.style.top = charFinalTop + "px";
      const sfxDrop = document.getElementById("sfx-drop");
      if (sfxDrop) { sfxDrop.currentTime = 0; sfxDrop.play().catch(() => {}); }

      setTimeout(() => {
        // 착지 후 캐릭터는 fixed 유지 (z-index 높여서 bg 위에 보이게)
        char.style.zIndex = "600";

        // bg + upper + bottom + scene 페이드인
        if (scene)  { scene.style.transition  = "opacity 4s ease"; scene.style.opacity  = "1"; }
        bg.style.transition = "opacity 4s ease";
        bg.style.opacity    = "1";
        if (upper)  { upper.style.transition  = "opacity 4s ease"; upper.style.opacity  = "1"; }
        if (bottom) {
          // names 영역 하단 기준으로 bottom_back 위치 설정
          const namesEl = document.getElementById("page1-names");
          if (namesEl) {
            const namesRect = namesEl.getBoundingClientRect();
            const page1Rect = document.getElementById("page1").getBoundingClientRect();
            bottom.style.top = (namesRect.bottom - page1Rect.top + 8) + "px";
          }
          bottom.style.transition = "opacity 4s ease";
          bottom.style.opacity = "1";
        }
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
                  const sfx = document.getElementById("sfx-heart");
                  if (sfx) { sfx.currentTime = 0; sfx.play().catch(() => {}); }
                  heart.style.transition = "opacity 0.4s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
                  heart.style.opacity    = "1";
                  heart.style.transform  = "scale(1)";
                  // 하트 완성 후 1초 뒤 스크롤 힌트 등장
                  setTimeout(() => {
                    const hint = document.getElementById("page1-scroll-hint");
                    if (hint) hint.classList.add("visible");
                  }, 1200);
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
  ["sfx-heart","sfx-down","sfx-drop","sfx-background","sfx-walk","sfx-typing","sfx-button","sfx-bird"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.volume = 1;
    el.muted  = true;
    el.play().then(() => { el.pause(); el.muted = false; el.currentTime = 0; }).catch(() => { el.muted = false; });
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

const pages = ["page1", "page2", "page3", "page4"];
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

function onScrollHintClick() {
  const hint = document.getElementById("page1-scroll-hint");
  const sfx  = document.getElementById("sfx-button");
  if (sfx) { sfx.currentTime = 0; sfx.play().catch(() => {}); }

  // 눌림 효과 적용
  if (hint) {
    hint.style.transform = "translateX(-50%) scale(0.88)";
    hint.style.opacity   = "0.6";
    setTimeout(() => {
      hint.style.transform = "translateX(-50%) scale(1)";
      hint.style.opacity   = "1";
      setTimeout(() => { goToPage(1); }, 120);
    }, 150);
  } else {
    goToPage(1);
  }
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
  } else if (currentPage === 2 && targetIndex === 1) {
    transitionPage3To2();
  } else if (currentPage === 2 && targetIndex === 3) {
    transitionPage3To4();
  } else if (currentPage === 3 && targetIndex === 0) {
    transitionPage4To1();
  } else {
    slideToPage(targetIndex, null);
  }
}

/* ──────────────────────────────────────────
   인사말 텍스트
────────────────────────────────────────── */

const greetingFull = "드디어 저희가 결혼해요! 🎉\n두 사람이 만나 함께한 시간들이\n쌓이고 쌓여 이 날까지 왔어요.\n기쁜 날인 만큼 사랑하는 분들과\n함께하고 싶어서 이렇게 청첩장을\n보내게 됐어요.\n부디 함께 자리해 주세요.\n꼭 와주실 거죠? 💕";

/* ──────────────────────────────────────────
   1→2: 캐릭터 fixed 유지 → 슬라이드 → 말풍선 타이핑
────────────────────────────────────────── */

function transitionPage1To2() {
  const char = document.getElementById("page1-char");
  char.style.transition = "none";
  const rect = char.getBoundingClientRect();

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
    "will-change: auto",
    "margin: 0",
    "padding: 0"
  ].join("; ");

  const hint = document.getElementById("page1-scroll-hint");
  if (hint) { hint.classList.remove("visible"); }

  // 점프 효과: 커졌다가 작아지며 화면을 건너뛰는 느낌
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // 도약: 천천히 커지며 위로
      char.style.transition = "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      char.style.transform  = "scale(1.7) translateY(-20px)";
      setTimeout(() => {
        // 착지: 줄어들며 내려옴
        char.style.transition = "transform 0.55s cubic-bezier(0.45, 0, 0.55, 1)";
        char.style.transform  = "scale(1) translateY(0)";
      }, 700);
    });
  });

  const sfxDown = document.getElementById("sfx-down");
  if (sfxDown) { sfxDown.currentTime = 0; sfxDown.play().catch(() => {}); }
  slideToPage(1, () => { startGreetingAnimation(); });
}

function startGreetingAnimation() {
  const bubble  = document.getElementById("greeting-bubble");
  const textEl  = document.getElementById("greeting-text");
  const char    = document.getElementById("page1-char");

  // 전체 텍스트로 높이 미리 확보 후 박스 고정
  textEl.innerHTML = greetingFull.replace(/\n/g, "<br>");
  const fullHeight = textEl.offsetHeight;
  textEl.style.height = fullHeight + "px";
  textEl.style.overflow = "hidden";
  textEl.innerHTML = "";

  const titleBlock = document.getElementById("p2-title-block");
  if (titleBlock) { titleBlock.style.transition = "opacity 1.4s ease"; titleBlock.style.opacity = "1"; }
  bubble.style.transition = "opacity 1.4s ease";
  bubble.style.opacity = "1";

  // upper/bottom 이미지 말풍선과 함께 페이드인
  const p2upper = document.getElementById("p2-upper");
  const p2bottom = document.getElementById("p2-bottom");
  if (p2upper)  p2upper.style.opacity  = "1";
  if (p2bottom) p2bottom.style.opacity = "1";

  // 말풍선 렌더링 후 캐릭터를 바로 아래 배치
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const bubbleRect = bubble.getBoundingClientRect();
      const tailH = 14;
      const charW = parseFloat(char.style.width) || char.offsetWidth;
      char.style.transition = "top 0.5s cubic-bezier(0.45,0,0.55,1), left 0.5s cubic-bezier(0.45,0,0.55,1), opacity 0.4s ease";
      char.style.opacity = "1";
      char.style.top  = (bubbleRect.bottom + tailH + 6) + "px";
      char.style.left = (bubbleRect.left + bubbleRect.width / 2 - charW / 2) + "px";

      // 타이핑 시작 (캐릭터 자리잡은 후 0.5초 딜레이)
      setTimeout(() => {
        const sfxTyping = document.getElementById("sfx-typing");
        if (sfxTyping) { sfxTyping.currentTime = 0; sfxTyping.play().catch(() => {}); }
        let i = 0;
        function typeNext() {
          if (i >= greetingFull.length) {
            if (sfxTyping) { sfxTyping.pause(); sfxTyping.currentTime = 0; }
            // bird.gif 실행 (0.5초 딜레이 후 한 번만 재생)
            setTimeout(() => {
              const bird = document.getElementById("p2-bird");
              if (bird) {
                bird.src = "bird.gif?" + Date.now();
                bird.style.display = "block";
                const sfxBird = document.getElementById("sfx-bird");
                if (sfxBird) { sfxBird.currentTime = 0; sfxBird.play().catch(() => {}); }
                setTimeout(() => { bird.style.display = "none"; }, 1800);
              }
            }, 500);
            const hint2 = document.getElementById("page2-scroll-hint");
            if (hint2) hint2.classList.add("visible");
            return;
          }
          const ch = greetingFull[i];
          textEl.innerHTML += ch === "\n" ? "<br>" : ch;
          i++;
          setTimeout(typeNext, 48);
        }
        typeNext();
      }, 1000);
    });
  });
}

/* ──────────────────────────────────────────
   2→1: 인사말 → 1페이지
────────────────────────────────────────── */

function onPage2ScrollHintClick() {
  const hint = document.getElementById("page2-scroll-hint");
  const sfx  = document.getElementById("sfx-button");
  if (sfx) { sfx.currentTime = 0; sfx.play().catch(() => {}); }
  if (hint) {
    hint.style.transform = "translateX(-50%) scale(0.88)";
    hint.style.opacity   = "0.6";
    setTimeout(() => {
      hint.style.transform = "translateX(-50%) scale(1)";
      hint.style.opacity   = "1";
      setTimeout(() => { goToPage(2); }, 120);
    }, 150);
  } else {
    goToPage(2);
  }
}

function transitionPage2To1() {
  const bubble  = document.getElementById("greeting-bubble");
  const char    = document.getElementById("page1-char");
  const hint2   = document.getElementById("page2-scroll-hint");
  const p2upper  = document.getElementById("p2-upper");
  const p2bottom = document.getElementById("p2-bottom");
  if (hint2) { hint2.classList.remove("visible"); }
  bubble.style.transition = "opacity 0.3s ease";
  bubble.style.opacity    = "0";
  char.style.transition   = "opacity 0.3s ease";
  char.style.opacity      = "0";
  if (p2upper)  { p2upper.style.transition  = "opacity 0.3s ease"; p2upper.style.opacity  = "0"; }
  if (p2bottom) { p2bottom.style.transition = "opacity 0.3s ease"; p2bottom.style.opacity = "0"; }
  setTimeout(() => {
    slideToPage(0, () => { playPage1Animation(); });
  }, 300);
}

/* ──────────────────────────────────────────
   2→3: 인사말 → 타임라인
────────────────────────────────────────── */

function transitionPage2To3() {
  const bubble = document.getElementById("greeting-bubble");
  const char   = document.getElementById("page1-char");
  const hint2  = document.getElementById("page2-scroll-hint");
  if (hint2) { hint2.classList.remove("visible"); }

  // 캐릭터를 fixed로 고정
  const rect = char.getBoundingClientRect();
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
    "will-change: auto",
    "margin: 0",
    "padding: 0"
  ].join("; ");

  // walk 효과음 재생
  const sfxWalk = document.getElementById("sfx-walk");
  if (sfxWalk) { sfxWalk.muted = false; sfxWalk.volume = 1.0; sfxWalk.currentTime = 0; sfxWalk.play().catch(() => {}); }

  // 캐릭터 아래로 걸어내려가며 페이드아웃 (1.2초로 느리게)
  setTimeout(() => {
    const walkDistance = window.innerHeight * 0.30;
    char.style.transition = "top 1.2s cubic-bezier(0.4, 0, 0.6, 1), opacity 1.0s ease";
    char.style.top     = (rect.top + walkDistance) + "px";
    char.style.opacity = "0";
    char.style.pointerEvents = "none";

    // 캐릭터 퇴장 완료 후 슬라이딩 시작
    setTimeout(() => {
      if (sfxWalk) { sfxWalk.pause(); sfxWalk.currentTime = 0; }

      // ★ 슬라이딩 전에 3페이지 요소 미리 숨기기
      ["album-title-area","album-section","album-photo-row","page3-scroll-hint"].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.transition = "none"; el.style.opacity = "0"; }
      });
      const charImg  = document.getElementById("album-char-img");
      const speechBub = document.getElementById("album-speech-bubble");
      if (charImg)   charImg.style.opacity  = "0";
      if (speechBub) speechBub.style.opacity = "0";

      const sfxDown = document.getElementById("sfx-down");
      if (sfxDown) { sfxDown.currentTime = 0; sfxDown.play().catch(() => {}); }
      slideToPage(2, () => { initAlbumPuzzle(); });
    }, 1250);
  }, 150);
}

/* ──────────────────────────────────────────
   3→2: 타임라인 → 인사말
────────────────────────────────────────── */

function transitionPage3To2() {
  stopPetalFall();
  const sfxDown = document.getElementById("sfx-down");
  if (sfxDown) { sfxDown.currentTime = 0; sfxDown.play().catch(() => {}); }
  slideToPage(1, () => { startGreetingAnimation(); });
}

/* ──────────────────────────────────────────
   3→4: 타임라인 → 일시장소
────────────────────────────────────────── */

function transitionPage3To4() {
  stopPetalFall();
  const sfxDown = document.getElementById("sfx-down");
  if (sfxDown) { sfxDown.currentTime = 0; sfxDown.play().catch(() => {}); }
  slideToPage(3, null);
}

/* ──────────────────────────────────────────
   4→1: 일시장소 → 1페이지
────────────────────────────────────────── */

function transitionPage4To1() {
  slideToPage(0, () => { playPage1Animation(); });
}

/* ──────────────────────────────────────────
   일반 슬라이드
────────────────────────────────────────── */

function slideToPage(targetIndex, callback) {
  const wrapper = document.getElementById("pages-wrapper");
  const vh      = window.innerHeight;
  const startOffset = -currentPage * vh;
  const endOffset   = -targetIndex * vh;
  const duration    = 1500;
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
   앨범 퍼즐
────────────────────────────────────────── */

const albumTexts = [
  { date:"2025.03.24", title:"우리가 만난 지 100일 🎉", desc:"강릉으로 첫 여행을 떠났던 날, 바다 앞에서 100일을 기념했어요." },
  { date:"2025.05.11", title:"함께한 첫 번째 봄 🌸",   desc:"벚꽃이 흐드러지게 핀 공원을 함께 걸었어요." },
  { date:"2025.07.28", title:"여름 바다에서 🌊",        desc:"뜨거운 여름, 제주도로 떠난 둘만의 여행이에요." },
  { date:"2025.10.14", title:"단풍길 드라이브 🍂",      desc:"빨갛게 물든 산길을 드라이브하며 함께하자고 말했던 날이에요." },
  { date:"2025.12.24", title:"프러포즈 그날 밤 💍",     desc:"눈이 내리던 크리스마스 이브, 평생을 함께하자고 약속했어요." },
  { date:"2026.09.05", title:"드디어 결혼해요! 💕",     desc:"두 사람이 함께한 시간들이 쌓여 이 날까지 왔어요." }
];
const albumPhotos = ["photo1.jpg","photo2.jpg","photo3.jpg","photo4.jpg","photo5.jpg","photo6.jpg"];
const albumMsgs   = [
  "힌트를 읽고 맞는 칸에 넣어봐요!",
  "잘했어요! 계속해봐요 👍",
  "두 개 맞췄어요! 🎉",
  "절반 왔어요! 화이팅 💪",
  "조금만 더요! ✨",
  "한 장만 남았어요! 🌸",
  "앨범 완성! 우리의 모든 기억이 모였어요 💕"
];

let albumDragId   = null;
let albumCorrect  = 0;
let albumTouchCard = null;
let albumTouchClone = null;

function initAlbumPuzzle() {
  albumCorrect = 0;
  albumDragId  = null;
  document.getElementById("album-progress-fill").style.width = "0%";
  document.getElementById("album-speech-bubble").textContent = albumMsgs[0];
  initPhotoSlider();

  // 슬롯 초기화
  for (let i = 0; i < 6; i++) {
    const slot = document.getElementById("slot-" + i);
    if (!slot) continue;
    slot.classList.remove("correct", "wrong");
    slot.querySelector(".slot-num").style.display = "";
    slot.querySelector(".slot-hint").style.display = "";
    slot.querySelector(".slot-icon").style.display = "none";
    const fi = slot.querySelector(".slot-filled-img");
    if (fi) { fi.style.display = "none"; }
    const ck = slot.querySelector(".slot-check");
    if (ck) ck.style.display = "none";
  }
  // 사진카드 초기화
  for (let i = 0; i < 6; i++) {
    const ids = [3, 0, 5, 1, 4, 2];
    const card = document.getElementById("apc-" + ids[i]);
    if (card) { card.classList.remove("placed", "dragging"); }
  }

  // 3페이지 인트로 연출 시작
  playAlbumIntro();
}

/* ──────────────────────────────────────────
   3페이지 인트로
   - introSet이 화면 중앙에서 설명 후
   - scale(1) + charArea 위치로 이동
   - 도착 후 position:fixed 해제 → charArea 안으로 DOM 이동
   - 같은 요소가 끊김 없이 사진탭 캐릭터가 됨
────────────────────────────────────────── */
function playAlbumIntro() {
  const titleArea  = document.getElementById("album-title-area");
  const albumSec   = document.getElementById("album-section");
  const photoRow   = document.getElementById("album-photo-row");
  const scrollHint = document.getElementById("page3-scroll-hint");
  const charImg    = document.getElementById("album-char-img");
  const speechBub  = document.getElementById("album-speech-bubble");
  const charArea   = document.getElementById("album-char-area");

  [titleArea, albumSec, photoRow, scrollHint].forEach(el => {
    if (el) { el.style.transition = "none"; el.style.opacity = "0"; el.style.pointerEvents = "none"; }
  });
  // 원래 charImg, speechBub는 완전히 숨김 — introSet이 그 역할을 대신
  if (charImg)   { charImg.style.display   = "none"; }
  if (speechBub) { speechBub.style.display = "none"; }
  // trayArea(사진 슬라이더)도 미리 숨김 — 나중에 별도 페이드인
  const trayArea = document.getElementById("album-tray-area");
  if (trayArea) { trayArea.style.transition = "none"; trayArea.style.opacity = "0"; }

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // charArea 실제 크기 측정
  photoRow.style.visibility = "hidden";
  photoRow.style.opacity    = "1";
  const caRect = charArea.getBoundingClientRect();
  photoRow.style.opacity    = "0";
  photoRow.style.visibility = "";

  const realW = caRect.width  || 68;
  const realH = caRect.height || 120;

  const SCALE   = Math.min((vw * 0.45) / realW, 3.5);
  const scaledW = realW * SCALE;
  const scaledH = realH * SCALE;

  const setL   = vw / 2 - scaledW / 2;
  const setT   = vh * 0.52 - scaledH / 2;
  const startT = setT - vh * 0.22;

  // 제목 페이드인
  setTimeout(() => {
    if (titleArea) { titleArea.style.transition = "opacity 0.6s ease"; titleArea.style.opacity = "1"; }
  }, 80);

  // introSet 생성
  const introSet = document.createElement("div");
  introSet.id = "album-intro-set";
  introSet.style.cssText = [
    `width:${realW}px`, `height:${realH}px`,
    `left:${setL}px`,   `top:${startT}px`,
    `transform:scale(${SCALE})`,
    "transform-origin:top left",
    "opacity:1", "transition:none"
  ].join(";");

  const introBubble = document.createElement("div");
  introBubble.id = "album-intro-bubble";
  const textSpan = document.createElement("span");
  introBubble.appendChild(textSpan);

  const introCharEl = document.createElement("img");
  introCharEl.src = "cry.gif";
  introCharEl.id  = "album-intro-char";
  introCharEl.style.opacity    = "0";
  introCharEl.style.transition = "none";

  introSet.appendChild(introBubble);
  introSet.appendChild(introCharEl);
  document.body.appendChild(introSet);

  // STEP1: 내려오며 캐릭터 페이드인
  setTimeout(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      introSet.style.transition    = "top 0.65s cubic-bezier(0.34,1.15,0.64,1)";
      introSet.style.top           = setT + "px";
      introCharEl.style.transition = "opacity 0.45s ease";
      introCharEl.style.opacity    = "1";
    }));

    // STEP2: 착지 후 말풍선 페이드인
    setTimeout(() => {
      introBubble.style.opacity = "1";

      // STEP3: 말풍선 내용 3번 교체 — 각각 새로 타이핑
      setTimeout(() => {
        // 대화 3세트: 각 세트는 줄 배열
        const dialogues = [
          ["어떡하죠?.."],                        // 1번: 1줄 (가운데)
          ["실수로", "사진들이", "섞여버렸어요"], // 2번: 3줄
          ["여러분의", "도움이", "필요해요"]      // 3번: 3줄
        ];
        const sfxTyping = document.getElementById("sfx-typing");

        // 기존 textSpan 제거 — bubble은 JS가 직접 관리
        textSpan.remove();

        // bubble 내부를 교체하고 줄 div 반환
        function setBubbleLines(lineTexts) {
          introBubble.innerHTML = "";
          // 말풍선 꼬리 (::before/::after는 CSS에 있으므로 별도 처리 불필요)
          return lineTexts.map(() => {
            const d = document.createElement("div");
            d.style.cssText = "opacity:0; white-space:nowrap; line-height:1.6;";
            introBubble.appendChild(d);
            return d;
          });
        }

        // 한 줄 타이핑 — sfx 제어 없음 (세트 단위로 관리)
        function typeLine(el, text, onDone) {
          el.style.opacity = "1";
          let i = 0, buf = "";
          function next() {
            if (i >= text.length) { onDone(); return; }
            buf += text[i++];
            el.textContent = buf;
            setTimeout(next, 65);
          }
          next();
        }

        // 한 세트(여러 줄) 순차 타이핑 — sfx는 세트 시작/끝에만
        function typeDialogue(lineTexts, onDone) {
          const divs = setBubbleLines(lineTexts);
          if (lineTexts.length === 1) {
            introBubble.style.justifyContent = "center";
            divs[0].style.textAlign = "center";
          } else {
            introBubble.style.justifyContent = "center";
          }
          // sfx 세트 시작
          if (sfxTyping) { sfxTyping.currentTime = 0; sfxTyping.play().catch(() => {}); }
          let idx = 0;
          function nextLine() {
            if (idx >= divs.length) {
              // sfx 세트 끝
              if (sfxTyping) { sfxTyping.pause(); sfxTyping.currentTime = 0; }
              onDone(); return;
            }
            typeLine(divs[idx++], lineTexts[idx - 1], nextLine); // 줄 끝나면 바로 다음 줄
          }
          nextLine();
        }

        // 3세트 순차 실행 (세트 사이 1초 대기 후 내용 교체)
        function runDialogues(idx, onAllDone) {
          if (idx >= dialogues.length) { onAllDone(); return; }
          typeDialogue(dialogues[idx], () => {
            if (idx < dialogues.length - 1) {
              setTimeout(() => runDialogues(idx + 1, onAllDone), 1000);
            } else {
              onAllDone();
            }
          });
        }

        // 3세트 타이핑 → STEP4
        runDialogues(0, () => {

            // STEP4: 타이핑 완료 → charArea 위치로 이동·축소
            setTimeout(() => {
              // 이동 전 캐릭터를 normal 표정으로 복귀
              introCharEl.src = "character.gif";

              photoRow.style.visibility = "hidden";
              photoRow.style.opacity    = "1";
              const fCa = charArea.getBoundingClientRect();
              photoRow.style.opacity    = "0";
              photoRow.style.visibility = "";

              const dur  = "0.85s";
              const ease = "cubic-bezier(0.45,0,0.55,1)";
              introSet.style.transition = `left ${dur} ${ease}, top ${dur} ${ease}, transform ${dur} ${ease}`;
              introSet.style.left      = fCa.left + "px";
              introSet.style.top       = fCa.top  + "px";
              introSet.style.transform = "scale(1)";

              // STEP5: 도착 후 처리
              setTimeout(() => {
                // introSet은 body fixed 그대로 유지 — 캐릭터 절대 안 사라짐

                // photoRow, albumSec, trayArea, scrollHint 순차 페이드인
                // 순서: 사진첩(trayArea) → 앨범(albumSec) → 스크롤힌트
                // charArea는 opacity 0인채로 페이드인되지만 introSet이 fixed로 그 위를 덮고있음
                photoRow.style.transition = "opacity 1.2s ease";
                photoRow.style.opacity    = "1";
                // 페이드인 완료 후 터치 활성화 (1.2s)
                setTimeout(() => { if (photoRow) photoRow.style.pointerEvents = ""; }, 1200);

                const trayArea = document.getElementById("album-tray-area");
                const fi = (el, delay, d = 0.5) => {
                  if (!el) return;
                  setTimeout(() => { el.style.transition = `opacity ${d}s ease`; el.style.opacity = "1"; }, delay);
                };
                fi(trayArea,    0,     1.2);  // 사진첩 먼저 (1.2초 동안 서서히)
                fi(albumSec,    1400,  1.2);  // 1.4초 후 앨범 (1.2초 동안 서서히)
                // scrollHint는 튜토리얼 종료 후 표시 (아래 showAlbumTutorial 참조)
                setTimeout(() => { if (albumSec) albumSec.style.pointerEvents = "auto"; }, 2600);

                // 앨범 페이드인 완료와 동시에 튜토리얼
                setTimeout(() => { showAlbumTutorial(scrollHint); }, 2600);

                // 모든 요소 페이드인 완료 후 → introSet을 charArea 안으로 조용히 교체
                setTimeout(() => {
                  // charArea 안 기존 요소 제거
                  if (charImg)   charImg.remove();
                  if (speechBub) speechBub.remove();

                  // introSet fixed 위치를 charArea 위치와 맞춤 (이미 거기 있지만 정확히)
                  const caR = charArea.getBoundingClientRect();
                  introSet.style.transition = "none";
                  introSet.style.left   = caR.left + "px";
                  introSet.style.top    = caR.top  + "px";

                  // charArea에 삽입 후 즉시 static으로 전환
                  charArea.appendChild(introSet);
                  requestAnimationFrame(() => {
                    introSet.style.position  = "static";
                    introSet.style.left      = "";
                    introSet.style.top       = "";
                    introSet.style.transform = "";
                    introSet.style.width     = "100%";
                    introSet.style.height    = "100%";
                    introSet.style.zIndex    = "";
                  });

                  // 말풍선 내용 교체
                  introBubble.innerHTML = "";
                  const finalSpan = document.createElement("span");
                  finalSpan.textContent = albumMsgs[0];
                  introBubble.appendChild(finalSpan);
                }, 2000); // 페이드인 끝난 후

              }, 900);

            }, 500);

        }); // runDialogues 콜백 끝
      }, 400);

    }, 700);
  }, 180);
}

/* ──────────────────────────────────────────
   3페이지 튜토리얼 오버레이
────────────────────────────────────────── */

function showAlbumTutorial(scrollHint) {
  const slot0    = document.getElementById("slot-0");
  const tray     = document.getElementById("album-photo-row");
  if (!slot0 || !tray) return;

  const s = slot0.getBoundingClientRect();
  const t = tray.getBoundingClientRect();
  const pad = 6;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // 오버레이 컨테이너 — 터치는 아래(slot-0, photo-row)로 통과
  const ov = document.createElement("div");
  ov.id = "album-tutorial";
  ov.style.pointerEvents = "none";

  // 딤: 단순 rgba div 4개로 slot-0, photo-row 구멍 주변을 둘러쌈
  // 방식: 상단 / 중단좌 / 중단우 / 하단 4 패널 + 트레이위 패널
  function mkDim(l,t2,w,h) {
    const d = document.createElement("div");
    d.style.cssText = `position:absolute;left:${l}px;top:${t2}px;width:${w}px;height:${h}px;background:rgba(20,5,5,0.72);pointer-events:none;`;
    return d;
  }

  // slot-0 구멍: sx, sy, sw, sh
  const sx = s.left - pad, sy = s.top - pad, sw = s.width + pad*2, sh = s.height + pad*2;
  // tray 구멍: tx, ty, tw, th
  const tx = t.left - pad, ty = t.top - pad, tw = t.width + pad*2, th = t.height + pad*2;

  // 구멍이 없는 영역들 (slot-0 기준 좌우상하 + tray 기준)
  // 상단 전체 (0 ~ min(sy, ty))
  const topEnd = Math.min(sy, ty);
  if (topEnd > 0) ov.appendChild(mkDim(0, 0, vw, topEnd));

  // slot-0 행: slot-0 좌측 + slot-0 우측
  // slot-0와 tray 사이 행 (sy ~ ty 또는 ty ~ sy)
  // 접근: slot-0 구멍 행
  ov.appendChild(mkDim(0,   sy,   sx,         sh));          // slot-0 좌
  ov.appendChild(mkDim(sx + sw, sy, vw - sx - sw, sh));      // slot-0 우

  // slot-0 아래 ~ tray 위 사이
  const midTop = sy + sh, midBot = ty;
  if (midBot > midTop) ov.appendChild(mkDim(0, midTop, vw, midBot - midTop));

  // tray 행: tray 좌측 + tray 우측
  ov.appendChild(mkDim(0,   ty,   tx,         th));
  ov.appendChild(mkDim(tx + tw, ty, vw - tx - tw, th));

  // tray 아래 ~ 화면 하단
  const botTop = ty + th;
  if (vh > botTop) ov.appendChild(mkDim(0, botTop, vw, vh - botTop));

  // 하이라이트 테두리 (slot-0)
  const hlSlot = document.createElement("div");
  hlSlot.id = "tut-highlight-slot";
  hlSlot.style.cssText = `left:${sx}px;top:${sy}px;width:${sw}px;height:${sh}px;`;
  ov.appendChild(hlSlot);

  // 하이라이트 테두리 (photo-row)
  const hlTray = document.createElement("div");
  hlTray.id = "tut-highlight-tray";
  hlTray.style.cssText = `left:${tx}px;top:${ty}px;width:${tw}px;height:${th}px;`;
  ov.appendChild(hlTray);

  // 화살표 SVG (트레이 → 슬롯 방향)
  const svgNS = "http://www.w3.org/2000/svg";
  const ax1 = tx + tw / 2;
  const ay1 = ty - pad - 8;
  const ax2 = sx + sw / 2;
  const ay2 = sy + sh + pad + 8;

  const arrowSvg = document.createElementNS(svgNS, "svg");
  arrowSvg.id = "tut-arrow";
  arrowSvg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);
  arrowSvg.style.cssText = `position:absolute;inset:0;width:${vw}px;height:${vh}px;pointer-events:none;`;

  // 곡선 경로
  const cx = (ax1 + ax2) / 2 + 30;
  const cy = (ay1 + ay2) / 2;
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", `M ${ax1} ${ay1} Q ${cx} ${cy} ${ax2} ${ay2}`);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "rgba(255,200,200,0.9)");
  path.setAttribute("stroke-width", "2.5");
  path.setAttribute("stroke-dasharray", "6 4");
  path.setAttribute("marker-end", "url(#tut-arrowhead)");

  // 화살촉 마커
  const markerDefs = document.createElementNS(svgNS, "defs");
  const marker = document.createElementNS(svgNS, "marker");
  marker.setAttribute("id", "tut-arrowhead");
  marker.setAttribute("markerWidth", "8");
  marker.setAttribute("markerHeight", "8");
  marker.setAttribute("refX", "4");
  marker.setAttribute("refY", "4");
  marker.setAttribute("orient", "auto");
  const arrowPoly = document.createElementNS(svgNS, "polygon");
  arrowPoly.setAttribute("points", "0,0 8,4 0,8");
  arrowPoly.setAttribute("fill", "rgba(255,180,180,0.95)");
  marker.appendChild(arrowPoly);
  markerDefs.appendChild(marker);
  arrowSvg.appendChild(markerDefs);
  arrowSvg.appendChild(path);
  ov.appendChild(arrowSvg);

  // 안내 툴팁 — 트레이 위에
  const tip = document.createElement("div");
  tip.id = "tut-tooltip";
  const tipText = "적절한 사진을 골라 앨범 칸으로 드래그해주세요 🌸";
  tip.innerHTML = tipText.replace(/\n/g, "<br>");

  // 트레이 위쪽에 배치, 화면 밖 나가면 아래쪽으로
  const tipH = 68;
  let tipTop = ty - pad - tipH - 16;
  let arrowDir = "arrow-down";
  if (tipTop < 8) {
    tipTop = ty + th + pad + 16;
    arrowDir = "arrow-up";
  }
  tip.classList.add(arrowDir);
  tip.style.cssText = `top:${tipTop}px;left:50%;transform:translateX(-50%);`;
  ov.appendChild(tip);

  // 탭해서 닫기 안내
  const dismiss = document.createElement("div");
  dismiss.id = "tut-dismiss";
  dismiss.textContent = "첫 번째 칸에 사진을 맞춰보세요";
  ov.appendChild(dismiss);

  document.body.appendChild(ov);

  // 페이드인
  requestAnimationFrame(() => requestAnimationFrame(() => {
    ov.classList.add("visible");
  }));

  // 탭/클릭으로 닫기
  function closeTutorial() {
    ov.style.transition = "opacity 0.35s ease";
    ov.style.opacity = "0";
    setTimeout(() => {
      ov.remove();
      startPetalFall();
      if (scrollHint) {
        scrollHint.style.transition = "opacity 0.8s ease";
        scrollHint.style.opacity = "1";
        scrollHint.style.pointerEvents = "";
      }
    }, 370);
  }
  // 클릭으로 닫기 제거 — slot-0 정답 드래그 시에만 닫힘
}

/* ──────────────────────────────────────────
   꽃잎 낙하 애니메이션
────────────────────────────────────────── */

let _petalTimer = null;

function stopPetalFall() {
  if (_petalTimer) { clearTimeout(_petalTimer); _petalTimer = null; }
  const canvas = document.getElementById("petal-canvas");
  if (canvas) canvas.remove();
}

function startPetalFall() {
  const old = document.getElementById("petal-canvas");
  if (old) old.remove();
  if (_petalTimer) { clearTimeout(_petalTimer); _petalTimer = null; }

  const canvas = document.createElement("div");
  canvas.id = "petal-canvas";
  // page3 안에 absolute로 배치해야 section z-index 계층 아래로 들어감
  const page3 = document.getElementById("page3");
  if (page3) page3.appendChild(canvas);
  else document.body.appendChild(canvas);

  const srcs = ["fall1.png", "fall2.png", "fall3.png"];
  const vw   = window.innerWidth;

  function spawnPetal() {
    if (typeof currentPage !== "undefined" && currentPage !== 2) return;

    const petal = document.createElement("div");
    petal.className = "petal";

    const img = document.createElement("img");
    img.src = srcs[Math.floor(Math.random() * srcs.length)];
    img.draggable = false;
    petal.appendChild(img);

    // page3 기준 절대좌표 — 화면 상단(page3 top)에서 시작
    petal.style.left = (Math.random() * (vw + 30) - 15) + "px";
    petal.style.top  = "-50px";

    // 생성 시 크기 고정 (0.7 ~ 1.5 랜덤)
    const size = Math.round(22 * (0.7 + Math.random() * 0.8));
    petal.style.width  = size + "px";
    petal.style.height = size + "px";

    const base = (Math.random() - 0.5) * 30;
    const amp  = 18 + Math.random() * 14;
    petal.style.setProperty("--sw1", (base + amp)  + "px");
    petal.style.setProperty("--sw2", (base - amp)  + "px");
    petal.style.setProperty("--r1",  ((Math.random()-0.5)*40)  + "deg");
    petal.style.setProperty("--r2",  ((Math.random()-0.5)*80)  + "deg");
    petal.style.setProperty("--r3",  ((Math.random()-0.5)*120) + "deg");
    petal.style.setProperty("--r4",  ((Math.random()-0.5)*160) + "deg");

    const dur = 7 + Math.random() * 4;
    petal.style.animation = `petalFall ${dur}s linear forwards`;

    canvas.appendChild(petal);
    petal.addEventListener("animationend", () => petal.remove(), { once: true });
  }

  // 처음 2장 즉시, 1장 0.6초 후
  spawnPetal(); spawnPetal();
  setTimeout(spawnPetal, 600);

  // 이후 1.8~2.5초 간격으로 무한 반복
  function scheduleNext() {
    const delay = 1800 + Math.random() * 700;
    _petalTimer = setTimeout(() => { spawnPetal(); scheduleNext(); }, delay);
  }
  scheduleNext();
}

function albumSetMsg(text) {
  // 원래 speechBub 또는 introSet 안의 bubble 둘 다 커버
  const b = document.getElementById("album-speech-bubble");
  if (b) b.textContent = text;
  const ib = document.getElementById("album-intro-bubble");
  if (ib) {
    const span = ib.querySelector("span");
    if (span) span.innerHTML = text;
    else ib.textContent = text;
  }
}

/* ── 드래그 + 트레이 통합 핸들러 ── */
function initCardPointerDrag() { /* attachTrayEvents와 통합됨 */ }

function albumCheckDrop(slot, pid) {
  if (slot.classList.contains("correct")) return;
  const answer = parseInt(slot.dataset.answer);
  const pidInt = parseInt(pid);

  if (answer === pidInt) {
    slot.classList.add("correct");

    // 사진 이미지 — 폴라로이드 상단 영역에 표시
    const icon = slot.querySelector(".slot-icon");
    const img = document.createElement("img");
    img.src = albumPhotos[pidInt];
    img.className = "slot-filled-img";
    img.style.display = "block";
    icon.replaceWith(img);

    // 번호 숨기고 힌트 텍스트는 그대로 유지
    const numEl = slot.querySelector(".slot-num");
    if (numEl) numEl.style.display = "none";

    const ck = slot.querySelector(".slot-check");
    if (ck) { ck.textContent = "✦ 딩동"; ck.style.display = "flex"; }

    // 하트 버스트 이펙트
    const burst = document.createElement("div");
    burst.className = "slot-burst";
    burst.textContent = "💕";
    slot.appendChild(burst);
    setTimeout(() => burst.remove(), 700);

    document.getElementById("apc-" + pid)?.classList.add("placed");
    setTimeout(() => advanceToNextUnplaced(), 350);

    // slot-0 정답 시 튜토리얼 자동 종료
    if (slot.id === "slot-0") {
      const tutOv = document.getElementById("album-tutorial");
      if (tutOv) {
        tutOv.style.transition = "opacity 0.35s ease";
        tutOv.style.opacity = "0";
        setTimeout(() => {
          tutOv.remove();
          startPetalFall();
          const scrollHint = document.getElementById("page3-scroll-hint");
          if (scrollHint) {
            scrollHint.style.transition = "opacity 0.8s ease";
            scrollHint.style.opacity = "1";
            scrollHint.style.pointerEvents = "";
          }
        }, 370);
      }
    }

    // 하트 효과음
    const sfx = document.getElementById("sfx-heart");
    if (sfx) { sfx.currentTime = 0; sfx.play().catch(() => {}); }

    albumCorrect++;
    document.getElementById("album-progress-fill").style.width = (albumCorrect / 6 * 100) + "%";
    albumSetMsg(albumMsgs[albumCorrect]);

    if (albumCorrect === 6) {
      setTimeout(() => showAlbumComplete(), 800);
    }
  } else {
    slot.classList.add("wrong");
    setTimeout(() => slot.classList.remove("wrong"), 400);
    albumSetMsg("다시 생각해봐요 🤔");
    setTimeout(() => albumSetMsg(albumMsgs[albumCorrect]), 1200);
  }
}

/* ──────────────────────────────────────────
   상세보기 (퍼즐용 - 슬롯 클릭 시)
────────────────────────────────────────── */

function openDetail(idx) {
  const detail = document.getElementById("detail");
  document.getElementById("detail-img").src          = albumPhotos[idx];
  document.getElementById("detail-date").textContent  = albumTexts[idx].date;
  document.getElementById("detail-title").textContent = albumTexts[idx].title;
  document.getElementById("detail-desc").textContent  = albumTexts[idx].desc;
  detail.style.display = "flex";
  requestAnimationFrame(() => detail.classList.add("open"));
}

/* ──────────────────────────────────────────
   앨범 완성 축하 연출
────────────────────────────────────────── */

function showAlbumComplete() {
  // 효과음
  const sfxComplete = document.getElementById("sfx-complete");
  if (sfxComplete) { sfxComplete.currentTime = 0; sfxComplete.play().catch(() => {}); }

  // 슬롯 글로우
  document.querySelectorAll(".slot.correct").forEach(s => s.classList.add("all-done"));

  // fall 이미지 대량 낙하 (화면 전면 fixed)
  runCompleteFall();

  // 4초 후 (낙하 효과 끝나면) 트레이를 댄스 영역으로 교체
  setTimeout(() => swapTrayToDance(), 4000);
}

function swapTrayToDance() {
  const photoRow = document.getElementById("album-photo-row");
  if (!photoRow) return;

  // 부드럽게 페이드아웃 후 교체
  photoRow.style.transition = "opacity 0.4s ease";
  photoRow.style.opacity = "0";

  setTimeout(() => {
    photoRow.innerHTML = `
      <div id="dance-area">
        <div id="dance-notes-wrap">
          <span class="dance-note" style="--ni:0">♪</span>
          <span class="dance-note" style="--ni:1">♫</span>
          <span class="dance-note" style="--ni:2">♩</span>
          <span class="dance-note" style="--ni:3">♬</span>
          <span class="dance-note" style="--ni:4">♪</span>
          <span class="dance-note" style="--ni:5">♫</span>
        </div>
        <img src="dance.gif" id="dance-gif" alt="dance">
        <div id="dance-label">
          <span class="dance-char" style="--i:0">감</span>
          <span class="dance-char" style="--i:1">사</span>
          <span class="dance-char" style="--i:2">의</span>
          <span class="dance-space"> </span>
          <span class="dance-char" style="--i:3">댄</span>
          <span class="dance-char" style="--i:4">스</span>
        </div>
      </div>
    `;
    photoRow.style.transition = "opacity 0.5s ease";
    photoRow.style.opacity = "1";
  }, 420);
}

function runCompleteFall() {
  // 기존 완성 캔버스 정리
  const old = document.getElementById("complete-fall-wrap");
  if (old) old.remove();

  // fixed 래퍼 — 화면 최전면
  const wrap = document.createElement("div");
  wrap.id = "complete-fall-wrap";
  wrap.style.cssText = "position:fixed;inset:0;z-index:9000;pointer-events:none;overflow:hidden;";
  document.body.appendChild(wrap);

  const srcs = ["fall1.png", "fall2.png", "fall3.png"];
  const vw   = window.innerWidth;
  const vh   = window.innerHeight;

  function spawnOne(delayMs) {
    setTimeout(() => {
      if (!document.getElementById("complete-fall-wrap")) return;

      const petal = document.createElement("div");
      petal.className = "petal complete-petal";

      const img = document.createElement("img");
      img.src = srcs[Math.floor(Math.random() * srcs.length)];
      img.draggable = false;
      petal.appendChild(img);

      // 크기 — 완성 효과라 기존보다 약간 크게
      const size = Math.round(28 * (0.8 + Math.random() * 0.9));
      petal.style.width  = size + "px";
      petal.style.height = size + "px";
      petal.style.position = "absolute";
      petal.style.top  = "-60px";
      petal.style.left = (Math.random() * (vw + 40) - 20) + "px";

      const base = (Math.random() - 0.5) * 40;
      const amp  = 20 + Math.random() * 20;
      petal.style.setProperty("--sw1", (base + amp) + "px");
      petal.style.setProperty("--sw2", (base - amp) + "px");
      petal.style.setProperty("--r1",  ((Math.random()-0.5)*50)  + "deg");
      petal.style.setProperty("--r2",  ((Math.random()-0.5)*90)  + "deg");
      petal.style.setProperty("--r3",  ((Math.random()-0.5)*130) + "deg");
      petal.style.setProperty("--r4",  ((Math.random()-0.5)*170) + "deg");

      // 속도 — 기존 7~11s보다 살짝 빠르게
      const dur = 3.0 + Math.random() * 1.2;
      petal.style.animation = `petalFall ${dur}s linear forwards`;

      wrap.appendChild(petal);
      petal.addEventListener("animationend", () => petal.remove(), { once: true });
    }, delayMs);
  }

  // ── Phase 1: 시작 즉시 40개 한꺼번에 (화면 전체에 분산)
  for (let i = 0; i < 40; i++) {
    spawnOne(i * 20);
  }

  // ── Phase 2: 0.4s 후 추가 25개
  for (let i = 0; i < 25; i++) {
    spawnOne(400 + i * 25);
  }

  // ── Phase 3: 1.2s 후 15개 더
  for (let i = 0; i < 15; i++) {
    spawnOne(1200 + i * 40);
  }

  // ── Phase 4: 2s~3.4s 동안 잔여 흘려보내기
  for (let i = 0; i < 10; i++) {
    spawnOne(2000 + i * 140);
  }

  // 3.4초 후 페이드아웃 (0.6s) → 총 4초
  setTimeout(() => {
    const w = document.getElementById("complete-fall-wrap");
    if (!w) return;
    w.style.transition = "opacity 0.6s ease";
    w.style.opacity = "0";
    setTimeout(() => w.remove(), 650);
  }, 3400);
}


function closeDetail() {
  const detail = document.getElementById("detail");
  detail.classList.remove("open");
  setTimeout(() => { detail.style.display = "none"; }, 300);
}

/* ──────────────────────────────────────────
   사진 슬라이더 (팬 캐러셀)
────────────────────────────────────────── */
let traySlideIdx = 0;

/** 각 카드에 data-pos를 계산해서 부여 */
function updateCarouselPositions() {
  const cards = Array.from(document.querySelectorAll("#photo-slider .photo-card"));
  const total = cards.length;
  cards.forEach(card => {
    const cardId = parseInt(card.dataset.order); // 순서 인덱스
    let diff = cardId - traySlideIdx;
    // 원형 보정
    if (diff > total / 2)  diff -= total;
    if (diff < -total / 2) diff += total;
    // -1, 0, 1 외는 숨김(-2)
    const pos = Math.max(-2, Math.min(2, diff));
    card.setAttribute("data-pos", pos);
  });
  updateTrayDots();
}

function initPhotoSlider() {
  const slider = document.getElementById("photo-slider");
  if (!slider) return;
  // 각 카드에 순서 인덱스 부여
  const cards = Array.from(slider.querySelectorAll(".photo-card"));
  cards.forEach((card, i) => {
    card.dataset.order = i;
    card.removeAttribute("data-pos");
    card.classList.remove("drag-ready", "dragging");
    card.style.transition = "none";
  });
  // slot-0 정답(data-id="0") 카드를 맨 처음 메인으로
  const answerCard = cards.findIndex(c => c.dataset.id === "0");
  traySlideIdx = answerCard >= 0 ? answerCard : 0;
  requestAnimationFrame(() => {
    updateCarouselPositions();
    requestAnimationFrame(() => {
      cards.forEach(card => { card.style.transition = ""; });
    });
  });
}

function slideToTray(idx, direction) {
  closePhotoZoom();
  const cards = Array.from(document.querySelectorAll("#photo-slider .photo-card"));
  const total = cards.length;
  let target = ((idx % total) + total) % total;

  // placed 카드는 건너뜀 — direction(1 또는 -1)으로 방향 유지
  if (direction !== undefined) {
    let tries = 0;
    while (cards[target].classList.contains("placed") && tries < total) {
      target = ((target + direction) % total + total) % total;
      tries++;
    }
    // 모두 placed면 현재 유지
    if (tries >= total) return;
  }

  traySlideIdx = target;
  updateCarouselPositions();
}

function openPhotoZoom(card) {
  // 카드 안의 원본 img src 추출
  const imgEl = card.querySelector(".pc-img");
  if (!imgEl) return;
  const src = imgEl.src;

  // 오버레이 생성/재사용
  let overlay = document.getElementById("photo-zoom-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "photo-zoom-overlay";
    document.body.appendChild(overlay);
  }

  // 확대 이미지 컨테이너
  let viewer = document.getElementById("photo-zoom-viewer");
  if (!viewer) {
    viewer = document.createElement("div");
    viewer.id = "photo-zoom-viewer";
    document.body.appendChild(viewer);
  }

  // 원본 해상도 img 세팅
  viewer.innerHTML = "";
  const bigImg = document.createElement("img");
  bigImg.src = src;
  bigImg.id  = "photo-zoom-img";
  viewer.appendChild(bigImg);

  overlay.classList.add("active");
  viewer.classList.add("active");

  // 다음 탭에서 닫기
  setTimeout(() => {
    document.addEventListener("touchend", _zoomCloseTap, { once: true, passive: true });
    document.addEventListener("click",    _zoomCloseTap, { once: true });
  }, 50);
}

function _zoomCloseTap() {
  closePhotoZoom();
}

function closePhotoZoom() {
  const overlay = document.getElementById("photo-zoom-overlay");
  const viewer  = document.getElementById("photo-zoom-viewer");
  document.removeEventListener("touchend", _zoomCloseTap);
  document.removeEventListener("click",    _zoomCloseTap);
  if (!viewer || !viewer.classList.contains("active")) return;

  // closing 애니메이션 재생 후 실제로 숨기기
  viewer.classList.remove("active");
  overlay.classList.remove("active");
  viewer.classList.add("closing");
  overlay.classList.add("closing");
  setTimeout(() => {
    viewer.classList.remove("closing");
    overlay.classList.remove("closing");
  }, 220);
}

function updateTrayDots() {
  document.querySelectorAll(".tray-dot").forEach((d, i) => {
    d.classList.toggle("active", i === traySlideIdx);
  });
}

function advanceToNextUnplaced() {
  const cards = Array.from(document.querySelectorAll("#photo-slider .photo-card"));
  for (let i = 1; i <= cards.length; i++) {
    const ni = (traySlideIdx + i) % cards.length;
    if (!cards[ni].classList.contains("placed")) { slideToTray(ni); return; }
  }
}

function attachTrayEvents() {
  const tray = document.getElementById("album-photo-row");
  if (!tray || tray._eventsAttached) return;
  tray._eventsAttached = true;

  /* ── 공유 드래그 상태 ── */
  let dragClone = null, dragCard = null, cloneW = 0, cloneH = 0;
  let isDragging = false;

  /* ── 공유 터치 상태 ── */
  let startX = 0, startY = 0;
  let activeCard = null;   // 트레이 탭/스와이프용
  let dragStarted = false; // 위로 스와이프 드래그 전환 여부

  /* 슬라이더 안의 카드 중 (x,y)에 해당하는 카드 반환 */
  function getCardAt(x, y) {
    const cards = Array.from(document.querySelectorAll("#photo-slider .photo-card"));
    const candidates = cards.filter(c => {
      if (c.classList.contains("placed")) return false;
      const r = c.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    });
    candidates.sort((a, b) =>
      Math.abs(parseInt(a.getAttribute("data-pos") ?? "0")) -
      Math.abs(parseInt(b.getAttribute("data-pos") ?? "0"))
    );
    return candidates[0] || null;
  }

  /* 드래그 시작 — 클론 중앙을 (x,y)에 맞춤 */
  function startDrag(card, x, y) {
    isDragging = true;
    dragStarted = true;
    dragCard = card;
    albumDragId = card.dataset.id;
    card.classList.add("dragging", "drag-ready");
    if (navigator.vibrate) navigator.vibrate(30);

    const r = card.getBoundingClientRect();
    cloneW = r.width * 1.15;
    cloneH = r.height * 1.15;

    dragClone = card.cloneNode(true);
    dragClone.classList.remove("dragging", "drag-ready"); // cloneNode로 딸려온 클래스 제거
    // photo-card CSS(transform:translate(-50%,-50%) 등)가 남아있으면 위치가 틀어지므로
    // style.cssText로 완전 덮어쓰고 transform:none 반드시 포함
    dragClone.style.cssText =
      `position:fixed;width:${cloneW}px;height:${cloneH}px;` +
      `transform:none;top:${y - cloneH / 2}px;left:${x - cloneW / 2}px;` +
      `opacity:1;pointer-events:none;z-index:9999;` +
      `border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.35);transition:none;`;
    dragClone.id = "photo-drag-clone";
    document.body.appendChild(dragClone);
  }

  /* 드래그 이동 */
  function moveDrag(x, y) {
    if (!dragClone) return;
    dragClone.style.left = (x - cloneW / 2) + "px";
    dragClone.style.top  = (y - cloneH / 2) + "px";
    document.querySelectorAll(".slot").forEach(s => {
      const r = s.getBoundingClientRect();
      s.classList.toggle("drag-over",
        x > r.left && x < r.right && y > r.top && y < r.bottom);
    });
  }

  /* 드래그 종료 — 슬롯 드롭 판정 */
  function endDrag(x, y) {
    if (dragClone) { dragClone.remove(); dragClone = null; }
    if (dragCard)  { dragCard.classList.remove("dragging", "drag-ready"); }
    document.querySelectorAll(".slot").forEach(s => {
      const r = s.getBoundingClientRect();
      s.classList.remove("drag-over");
      if (x > r.left && x < r.right && y > r.top && y < r.bottom) {
        if (albumDragId) albumCheckDrop(s, albumDragId);
      }
    });
    isDragging = false; dragCard = null; albumDragId = null;
  }

  /* 드래그 취소 */
  function cancelDrag() {
    if (dragClone) { dragClone.remove(); dragClone = null; }
    if (dragCard)  { dragCard.classList.remove("dragging", "drag-ready"); }
    document.querySelectorAll(".slot").forEach(s => s.classList.remove("drag-over"));
    isDragging = false; dragCard = null; albumDragId = null;
  }

  /* ── TOUCHSTART ── */
  tray.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    dragStarted = false;
    activeCard = getCardAt(touch.clientX, touch.clientY);
  }, { passive: true });

  /* ── TOUCHMOVE ── */
  tray.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    /* 이미 드래그 진행 중 */
    if (isDragging) {
      e.preventDefault();
      moveDrag(touch.clientX, touch.clientY);
      return;
    }

    /* 위로 10px 이상 스와이프 → 즉시 드래그 시작 */
    if (activeCard && dy < -10 && Math.abs(dy) > Math.abs(dx)) {
      e.preventDefault();
      startDrag(activeCard, touch.clientX, touch.clientY);
      activeCard = null;
      return;
    }

    /* 옆으로 움직이면 activeCard 무효화 (좌우 스와이프로 처리) */
    if (Math.abs(dx) > 10) {
      activeCard = null;
    }
  }, { passive: false });

  /* ── TOUCHEND ── */
  tray.addEventListener("touchend", (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    /* 드래그 중이었으면 드롭 처리 */
    if (isDragging) {
      e.preventDefault();
      endDrag(touch.clientX, touch.clientY);
      return;
    }

    /* 좌우 스와이프 → 캐러셀 이동 */
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) slideToTray(traySlideIdx + 1, 1);
      else        slideToTray(traySlideIdx - 1, -1);
      activeCard = null;
      return;
    }

    /* 탭 → 옆 카드 이동 or 확대 */
    if (Math.abs(dx) < 14 && Math.abs(dy) < 14 && activeCard && !activeCard.classList.contains("placed")) {
      const pos = parseInt(activeCard.getAttribute("data-pos") ?? "0");
      if      (pos === -1) slideToTray(traySlideIdx - 1, -1);
      else if (pos ===  1) slideToTray(traySlideIdx + 1,  1);
      else if (pos === -2) slideToTray(traySlideIdx - 2, -1);
      else if (pos ===  2) slideToTray(traySlideIdx + 2,  1);
      else openPhotoZoom(activeCard);
    }
    activeCard = null;
  }, { passive: false });

  tray.addEventListener("touchcancel", () => {
    cancelDrag();
    activeCard = null;
  }, { passive: true });

  /* ── 마우스 기반 (데스크탑) ── */
  let mouseCard = null;
  tray.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    mouseCard = getCardAt(e.clientX, e.clientY);
    startX = e.clientX; startY = e.clientY;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) { moveDrag(e.clientX, e.clientY); return; }
    if (!mouseCard) return;
    const dy = e.clientY - startY;
    const dx = e.clientX - startX;
    if (dy < -8 && Math.abs(dy) > Math.abs(dx)) {
      startDrag(mouseCard, e.clientX, e.clientY);
      mouseCard = null;
    } else if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      mouseCard = null;
    }
  });

  document.addEventListener("mouseup", (e) => {
    if (isDragging) endDrag(e.clientX, e.clientY);
    mouseCard = null;
  });
}

function stopHint() {}
function hintPhoto() {}
function floatHeart() {}

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
  const _scene = document.getElementById("page1-scene");
  if (_scene) _scene.style.opacity = "0";

  initWrapper();
  attachTrayEvents();
  initCardPointerDrag();

  document.addEventListener("wheel",     e => e.preventDefault(), { passive: false });
  document.addEventListener("touchmove", e => {
    // 사진 드래그 클론이 활성화된 경우 허용 (attachTrayEvents에서 처리)
    if (document.getElementById("photo-drag-clone")) return;
    // 앨범 트레이 내부도 허용 (touchmove passive:false로 직접 제어)
    if (e.target.closest("#album-photo-row") || e.target.closest("#album-section")) return;
    e.preventDefault();
  }, { passive: false });
  document.addEventListener("keydown", e => {
    if (["ArrowUp","ArrowDown","PageUp","PageDown","Space"].includes(e.code)) {
      e.preventDefault();
    }
  });
});

/* ──────────────────────────────────────────
   네이버 지도 앱 열기
────────────────────────────────────────── */
function openNaverMap() {
  const lat  = 38.1947;
  const lng  = 128.5403;
  const name = encodeURIComponent("델피노 골프 앤 리조트 웨딩");

  // 네이버 지도 앱 URL 스킴
  const appUrl = `nmap://place?lat=${lat}&lng=${lng}&name=${name}&appname=com.wedding.invitation`;
  // 앱 없을 때 네이버 지도 모바일 웹 fallback
  const webUrl = `https://map.naver.com/v5/search/${encodeURIComponent("델피노 골프 앤 리조트")}`;

  // 앱 실행 시도
  window.location.href = appUrl;
  // 1.5초 후에도 페이지가 그대로면 앱 없는 것 → 웹으로
  setTimeout(() => {
    window.location.href = webUrl;
  }, 1500);
}

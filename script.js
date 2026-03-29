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
  if (titleBlock) { titleBlock.style.transition = "opacity 0.6s ease"; titleBlock.style.opacity = "1"; }
  bubble.style.transition = "opacity 0.6s ease";
  bubble.style.opacity = "1";

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
  const bubble = document.getElementById("greeting-bubble");
  const char   = document.getElementById("page1-char");
  const hint2  = document.getElementById("page2-scroll-hint");
  if (hint2) { hint2.classList.remove("visible"); }
  bubble.style.transition = "opacity 0.3s ease";
  bubble.style.opacity    = "0";
  char.style.transition   = "opacity 0.3s ease";
  char.style.opacity      = "0";
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

  setTimeout(() => {
    char.style.transition = "opacity 0.4s ease";
    char.style.opacity = "0";
    const sfxDown = document.getElementById("sfx-down");
    if (sfxDown) { sfxDown.currentTime = 0; sfxDown.play().catch(() => {}); }
    slideToPage(2, () => { initAlbumPuzzle(); });
  }, 300);
}

/* ──────────────────────────────────────────
   3→2: 타임라인 → 인사말
────────────────────────────────────────── */

function transitionPage3To2() {
  const sfxDown = document.getElementById("sfx-down");
  if (sfxDown) { sfxDown.currentTime = 0; sfxDown.play().catch(() => {}); }
  slideToPage(1, () => { startGreetingAnimation(); });
}

/* ──────────────────────────────────────────
   3→4: 타임라인 → 일시장소
────────────────────────────────────────── */

function transitionPage3To4() {
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
}

function albumSetMsg(text) {
  const b = document.getElementById("album-speech-bubble");
  if (b) b.textContent = text;
}

function albumDragStart(e) {
  albumDragId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add("dragging");
}
function albumDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add("drag-over");
}
function albumDragLeave(e) {
  e.currentTarget.classList.remove("drag-over");
}
function albumDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove("drag-over");
  if (!albumDragId) return;
  albumCheckDrop(e.currentTarget, albumDragId);
  document.getElementById("apc-" + albumDragId)?.classList.remove("dragging");
  albumDragId = null;
}

function albumTouchStart(e) {
  albumTouchCard = e.currentTarget;
  albumDragId = albumTouchCard.dataset.id;
  const r = albumTouchCard.getBoundingClientRect();
  albumTouchClone = albumTouchCard.cloneNode(true);
  albumTouchClone.style.cssText = `position:fixed;width:${r.width}px;height:${r.height}px;opacity:0.85;pointer-events:none;z-index:9999;border-radius:10px;`;
  document.body.appendChild(albumTouchClone);
  albumTouchCard.classList.add("dragging");
}
function albumTouchMove(e) {
  e.preventDefault();
  const t = e.touches[0];
  if (albumTouchClone) {
    albumTouchClone.style.left = (t.clientX - 34) + "px";
    albumTouchClone.style.top  = (t.clientY - 34) + "px";
  }
  document.querySelectorAll(".slot").forEach(s => {
    const r = s.getBoundingClientRect();
    (t.clientX > r.left && t.clientX < r.right && t.clientY > r.top && t.clientY < r.bottom)
      ? s.classList.add("drag-over") : s.classList.remove("drag-over");
  });
}
function albumTouchEnd(e) {
  if (albumTouchClone) { albumTouchClone.remove(); albumTouchClone = null; }
  albumTouchCard?.classList.remove("dragging");
  const t = e.changedTouches[0];
  document.querySelectorAll(".slot").forEach(s => {
    const r = s.getBoundingClientRect();
    if (t.clientX > r.left && t.clientX < r.right && t.clientY > r.top && t.clientY < r.bottom) {
      s.classList.remove("drag-over");
      if (albumDragId) albumCheckDrop(s, albumDragId);
    }
  });
  albumDragId = null; albumTouchCard = null;
}

function albumCheckDrop(slot, pid) {
  if (slot.classList.contains("correct")) return;
  const answer = parseInt(slot.dataset.answer);
  const pidInt = parseInt(pid);

  if (answer === pidInt) {
    slot.classList.add("correct");
    slot.querySelector(".slot-num").style.display = "none";
    slot.querySelector(".slot-hint").style.display = "none";
    // 사진 이미지로 채우기
    const icon = slot.querySelector(".slot-icon");
    const img = document.createElement("img");
    img.src = albumPhotos[pidInt];
    img.className = "slot-filled-img";
    img.style.cssText = "width:100%;height:60px;object-fit:cover;border-radius:7px;display:block;margin-bottom:3px;";
    icon.replaceWith(img);
    // 날짜
    const dateEl = document.createElement("div");
    dateEl.style.cssText = "font-size:8px;color:#c9848a;font-family:'Noto Sans KR',sans-serif;";
    dateEl.textContent = albumTexts[pidInt].date;
    slot.appendChild(dateEl);

    const ck = slot.querySelector(".slot-check");
    if (ck) ck.style.display = "flex";

    document.getElementById("apc-" + pid)?.classList.add("placed");

    // 하트 효과음
    const sfx = document.getElementById("sfx-heart");
    if (sfx) { sfx.currentTime = 0; sfx.play().catch(() => {}); }

    albumCorrect++;
    document.getElementById("album-progress-fill").style.width = (albumCorrect / 6 * 100) + "%";
    albumSetMsg(albumMsgs[albumCorrect]);

    if (albumCorrect === 6) {
      setTimeout(() => goToPage(3), 1500);
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

function closeDetail() {
  const detail = document.getElementById("detail");
  detail.classList.remove("open");
  setTimeout(() => { detail.style.display = "none"; }, 300);
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

  document.addEventListener("wheel",     e => e.preventDefault(), { passive: false });
  document.addEventListener("touchmove", e => e.preventDefault(), { passive: false });
  document.addEventListener("keydown", e => {
    if (["ArrowUp","ArrowDown","PageUp","PageDown","Space"].includes(e.code)) {
      e.preventDefault();
    }
  });
});

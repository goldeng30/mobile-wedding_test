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
  ["sfx-heart","sfx-down","sfx-drop","sfx-background","sfx-walk","sfx-typing","sfx-button"].forEach(id => {
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
  if (hint) { hint.classList.remove("visible"); hint.style.opacity = "0"; }

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
  if (hint2) { hint2.classList.remove("visible"); hint2.style.opacity = "0"; }
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
  if (hint2) { hint2.classList.remove("visible"); hint2.style.opacity = "0"; }

  // 캐릭터 현재 위치 fixed로 고정 (슬라이드 내내 화면에 머무름)
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
    const sfxDown = document.getElementById("sfx-down");
    if (sfxDown) { sfxDown.currentTime = 0; sfxDown.play().catch(() => {}); }
    slideToPage(2, () => { startTimelineWithFixedChar(); });
  }, 500);
}

/* ──────────────────────────────────────────
   3→2: 타임라인 → 인사말
────────────────────────────────────────── */

function transitionPage3To2() {
  if (interval) { clearTimeout(interval); interval = null; }
  stopHint();
  const topview = document.getElementById("topview");
  const char    = document.getElementById("page1-char");
  const header  = document.getElementById("page2-header");
  if (header) header.classList.remove("visible");
  [topview, char].forEach(el => { el.style.transition = "opacity 0.3s ease"; el.style.opacity = "0"; });
  setTimeout(() => {
    slideToPage(1, () => { startGreetingAnimation(); });
  }, 300);
}

/* ──────────────────────────────────────────
   3→4: 타임라인 → 일시장소
────────────────────────────────────────── */

function transitionPage3To4() {
  if (interval) { clearTimeout(interval); interval = null; }
  stopHint();
  const char    = document.getElementById("page1-char");
  const topview = document.getElementById("topview");
  char.style.transition = "opacity 0.4s ease";
  char.style.opacity    = "0";
  const sfxWalk = document.getElementById("sfx-walk");
  if (sfxWalk) { sfxWalk.currentTime = 0; sfxWalk.play().catch(() => {}); }
  const currentTop = parseFloat(topview.style.top) || 0;
  const exitTop    = currentTop + window.innerHeight * 0.25;
  topview.style.transition = "top 1.8s cubic-bezier(0.4, 0, 0.6, 1), opacity 1.5s ease";
  topview.style.top        = exitTop + "px";
  topview.style.opacity    = "0";
  setTimeout(() => { slideToPage(3, null); }, 650);
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
   타임라인 (fixed 캐릭터 top 이동 + 지그재그)
────────────────────────────────────────── */

const pointsVh = [24, 35, 46, 57, 68];
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
  const startRatio = 0.17;
  const entryH     = 0.11;
  const lineEndR   = 0.79;

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
  if (interval) clearTimeout(interval);
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
  const startTop = 0.17 * vh;
  const entryH   = 0.11 * vh;

  // topview 초기 위치 세팅 (투명)
  topview.style.transition = "none";
  topview.style.top        = startTop + "px";
  topview.style.opacity    = "0";

  // 헤더 초기화 (숨김)
  const header = document.getElementById("page2-header");
  if (header) { header.classList.remove("visible"); }

  // 1단계: 헤더 낙하 등장
  setTimeout(() => {
    if (header) { header.classList.add("visible"); }

    // 2단계: 헤더 등장 후 캐릭터 페이드아웃
    setTimeout(() => {
      char.style.transition = "opacity 0.5s ease";
      char.style.opacity    = "0";

      // 3단계: topview 페이드인
      setTimeout(() => {
        topview.style.transition = "top 1.2s cubic-bezier(0.45, 0, 0.55, 1), opacity 0.6s ease";
        topview.style.opacity    = "1";

        // 4단계: 길 페이드인
        setTimeout(() => {
          if (line)     { line.style.transition = "opacity 0.8s ease"; line.style.opacity = "1"; }
          if (startDot) { startDot.style.transition = "opacity 0.8s ease"; startDot.style.opacity = "1"; }
          document.querySelectorAll(".tl-dot").forEach(el => {
            el.style.transition = "opacity 0.8s ease";
            el.style.opacity    = "1";
          });

        // 5단계: 순차적으로 각 포인트 이동
          const moveToNext = () => {
            if (current >= pointsVh.length) return;
            const idx = current;
            current++;

            // topview 이동
            const entryTop = (pointsVh[idx] / 100) * vh;
            topview.style.top = (entryTop + entryH / 2) + "px";

            // 도착 후(1.2s) 사진/텍스트 페이드인 + 하트 효과
            const moveTime = 1200;
            setTimeout(() => {
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

              // 하트 띄우기
              floatHeart();

              // 페이드인 완료(2s) + 0.1초 대기 후 다음 포인트
              setTimeout(() => {
                if (idx === pointsVh.length - 1) {
                  // 마지막 포인트 → 첫 사진 힌트
                  setTimeout(() => hintPhoto(0), 500);
                } else {
                  interval = setTimeout(moveToNext, 0);
                }
              }, 2000 + 100);
            }, moveTime);
          };

          interval = setTimeout(moveToNext, 1000); // 스타팅 → 첫 포인트 1초 딜레이
        }, 700); // 길 페이드인(0.8s) 완료 후
      }, 600); // 캐릭터 아웃(0.5s) 완료 후
    }, 500); // 헤더 낙하(0.5s) 완료 후
  }, 100); // 슬라이드 완료 직후
}

/* ──────────────────────────────────────────
   하트 플로팅
────────────────────────────────────────── */

function floatHeart() {
  const topview = document.getElementById("topview");
  const heart   = document.getElementById("tl-heart");
  if (!topview || !heart) return;

  const rect = topview.getBoundingClientRect();
  // topview 우측 상단에 배치
  heart.style.left = (rect.right - 28) + "px";
  heart.style.top  = (rect.top - 8) + "px";

  // 효과음
  const sfx = document.getElementById("sfx-heart");
  if (sfx) { sfx.currentTime = 0; sfx.play().catch(() => {}); }

  // 애니메이션 재시작
  heart.classList.remove("floating");
  void heart.offsetWidth; // reflow
  heart.classList.add("floating");
}

/* ──────────────────────────────────────────
   사진 힌트 (반복 흔들림)
────────────────────────────────────────── */

let hintTimer = null;
let hintIdx   = -1;

function hintPhoto(idx) {
  if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; }
  hintIdx = idx;

  const photo = document.getElementById("p" + (idx + 1));
  if (!photo) return;

  function shake() {
    const p = document.getElementById("p" + (hintIdx + 1));
    if (!p) return;
    p.classList.remove("hint");
    void p.offsetWidth;
    p.classList.add("hint");
    setTimeout(() => p.classList.remove("hint"), 700);
    hintTimer = setTimeout(shake, 2500);
  }
  shake();
}

function stopHint() {
  if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; }
  hintIdx = -1;
}

/* ──────────────────────────────────────────
   상세보기
────────────────────────────────────────── */

function openDetail(idx) {
  stopHint(); // 상세보기 열리면 흔들림 정지
  const detail = document.getElementById("detail");
  document.getElementById("detail-img").src          = photos[idx];
  document.getElementById("detail-date").textContent  = texts[idx].date;
  document.getElementById("detail-title").textContent = texts[idx].title;
  document.getElementById("detail-desc").textContent  = texts[idx].desc;
  detail.style.display = "flex";
  requestAnimationFrame(() => detail.classList.add("open"));

  const nextIdx = idx + 1;
  if (nextIdx < photos.length) {
    detail.dataset.nextHint = nextIdx;
  } else {
    delete detail.dataset.nextHint;
  }
}

function closeDetail() {
  const detail = document.getElementById("detail");
  const nextHint = detail.dataset.nextHint;
  detail.classList.remove("open");
  setTimeout(() => {
    detail.style.display = "none";
    if (nextHint !== undefined) {
      setTimeout(() => hintPhoto(parseInt(nextHint)), 400);
    }
  }, 300);
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

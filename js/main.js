"use strict";

/**
 * Alex cumple 8
 * Cáele.mx
 *
 * Responsibilities:
 * - Decorative streamers
 * - Ribbon (scroll-drawn connector)
 * - Parallax
 * - Countdown
 * - Music
 * - Maps
 * - RSVP
 * - Calendar
 * - Sharing
 */

/* ==========================================================
   CONFIG
========================================================== */

const invitation = document.querySelector(".invitation");

const config = {
  title: invitation?.dataset.eventTitle ?? "Alex cumple 8",

  start: invitation?.dataset.eventStart ?? "",

  end: invitation?.dataset.eventEnd ?? "",

  location: invitation?.dataset.eventLocation ?? "",

  mapsUrl: invitation?.dataset.mapsUrl ?? "",

  rsvpNumber: invitation?.dataset.rsvpNumber ?? "",
};

/* ==========================================================
   DOM
========================================================== */

const elements = {
  streamers: document.querySelector("[data-streamers]"),

  ribbon: document.querySelector("[data-ribbon]"),

  ribbonSvg: document.querySelector("[data-ribbon-svg]"),

  ribbonPaths: document.querySelector("[data-ribbon-paths]"),

  ribbonNodes: document.querySelector("[data-ribbon-nodes]"),

  ribbonAnchors: document.querySelectorAll("[data-ribbon-anchor]"),

  ribbonLoops: document.querySelectorAll("[data-ribbon-loop]"),

  parallaxElements: document.querySelectorAll("[data-parallax-speed]"),

  audio: document.querySelector("#background-music"),

  musicToggle: document.querySelector("#music-toggle"),

  days: document.querySelector("[data-countdown-days]"),

  hours: document.querySelector("[data-countdown-hours]"),

  minutes: document.querySelector("[data-countdown-minutes]"),

  seconds: document.querySelector("[data-countdown-seconds]"),

  rsvp: document.querySelector("[data-rsvp]"),

  mapsLinks: document.querySelectorAll("[data-maps-link]"),

  calendar: document.querySelector("[data-calendar]"),

  share: document.querySelector("[data-share]"),

  status: document.querySelector("#action-status"),
};

/* ==========================================================
   HELPERS
========================================================== */

const announce = (message) => {
  if (!elements.status) {
    return;
  }

  elements.status.textContent = message;
};

const pad = (value) => String(value).padStart(2, "0");

const randomBetween = (minimum, maximum) => Math.random() * (maximum - minimum) + minimum;

/* ==========================================================
   STREAMERS
========================================================== */

const STREAMER_COUNT = 6;

/*
 * All of these are deliberately different.
 *
 * Some are:
 * - waves
 * - S curves
 * - large loops
 * - compact loops
 * - wide ribbons
 * - spirals
 */

const streamerPaths = [
  `
        M70 0
        C150 80 -15 160 70 240
        C145 320 -10 400 70 480
        C140 560 -5 640 70 720
        C130 800 5 880 70 960
        C120 1040 20 1120 70 1200
    `,

  `
        M70 0
        C20 55 20 125 70 180
        C120 235 120 305 70 360
        C20 415 20 485 70 540
        C120 595 120 665 70 720
        C20 775 20 845 70 900
        C120 955 120 1025 70 1080
        C25 1130 30 1175 70 1200
    `,

  `
        M70 0
        C-30 115 170 210 70 320
        C-25 430 165 525 70 640
        C-10 750 150 850 70 960
        C5 1055 130 1140 70 1200
    `,

  `
        M70 0
        C175 35 180 160 70 180
        C-40 200 -25 330 70 350
        C170 370 175 500 70 525
        C-25 550 -30 680 70 700
        C170 720 170 850 70 875
        C-20 900 -10 1035 70 1050
        C145 1070 140 1160 70 1200
    `,

  `
        M70 0
        C135 72 5 145 70 220
        C135 295 8 370 70 445
        C132 520 12 595 70 670
        C128 745 18 820 70 895
        C120 970 25 1045 70 1115
        C98 1160 85 1185 70 1200
    `,

  `
        M70 0
        C128 22 155 80 122 120
        C88 160 26 150 15 102
        C5 55 60 22 108 55
        C155 88 138 165 90 208
        C25 265 15 340 70 400
        C130 465 130 540 70 600
        C10 660 10 735 70 795
        C130 855 130 930 70 990
        C10 1050 20 1140 70 1200
    `,

  `
        M70 0
        C200 125 -70 255 70 380
        C195 505 -60 635 70 760
        C185 885 -40 1015 70 1140
        C90 1165 85 1185 70 1200
    `,

  `
        M70 0
        C145 35 168 105 118 153
        C70 200 8 180 18 124
        C30 65 120 72 130 135
        C142 205 40 250 28 320
        C15 395 120 445 130 515
        C140 590 35 640 28 715
        C20 790 115 840 128 910
        C142 985 48 1050 35 1115
        C28 1155 48 1180 70 1200
    `,

  `
        M70 0
        C35 80 110 125 70 205
        C30 285 110 330 70 410
        C30 490 110 535 70 615
        C30 695 110 740 70 820
        C30 900 110 945 70 1025
        C35 1090 92 1150 70 1200
    `,
];

/* ==========================================================
   CREATE STREAMER
========================================================== */

const createStreamer = () => {
  const wrapper = document.createElement("span");

  wrapper.className = "streamer";

  /*
   * We deliberately distribute them
   * through a slightly wider area than
   * the viewport.
   */
  const horizontalPosition = randomBetween(-6, 98);

  /*
   * Less aggressive differences in size.
   */
  const scale = randomBetween(0.8, 1.25);

  /*
   * Slow background motion.
   */
  const duration = randomBetween(26, 42);

  const drift = randomBetween(-7, 7);

  const rotation = randomBetween(-80, 80);

  /*
   * Pick one of our different geometries:
   * waves, loops, spirals, etc.
   */
  const path = streamerPaths[Math.floor(Math.random() * streamerPaths.length)];

  wrapper.style.setProperty("--streamer-x", `${horizontalPosition}%`);

  wrapper.style.setProperty("--streamer-size", String(scale));

  wrapper.style.setProperty("--streamer-duration", `${duration}s`);

  wrapper.style.setProperty("--streamer-drift", `${drift}rem`);

  wrapper.style.setProperty("--streamer-rotation", `${rotation}deg`);

  /*
   * Start them in different points of
   * their animation so they don't arrive
   * as a synchronized group.
   */
  wrapper.style.animationDelay = `${randomBetween(-42, 0)}s`;

  wrapper.innerHTML = `
        <svg
            viewBox="0 0 150 1200"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <path d="${path}" />
        </svg>
    `;

  return wrapper;
};

/* ==========================================================
   CONFIGURE STREAMERS
========================================================== */

const configureStreamers = () => {
  if (!elements.streamers) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    return;
  }

  const fragment = document.createDocumentFragment();

  for (let index = 0; index < STREAMER_COUNT; index += 1) {
    fragment.appendChild(createStreamer());
  }

  elements.streamers.appendChild(fragment);
};

/* ==========================================================
   RIBBON
========================================================== */

/*
 * One x position (as a fraction of the ribbon's width)
 * per *regular* anchor, in DOM order. This is what gives
 * the connecting line its zig-zag, hand-drawn feel.
 *
 * Fork/merge anchors ignore this pattern and are always
 * centered, so the three loop branches fan out and
 * regroup symmetrically.
 */
const RIBBON_X_PATTERN = [0.5, 0.78, 0.24, 0.28, 0.5];

/*
 * Extra vertical gap added below the quick-actions row
 * before the branches finish merging, purely so the taper
 * described above has somewhere to happen.
 */
const RIBBON_MERGE_EXTRA_DROP = 42;

let ribbonWidth = 0;
let ribbonAnchorPoints = [];
let ribbonSegments = [];
let ribbonFrame = null;

const buildRibbonPath = (points) => {
  if (points.length < 2) {
    return "";
  }

  const segments = [`M ${points[0].x} ${points[0].y}`];

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];

    const current = points[index];

    const midY = (previous.y + current.y) / 2;

    segments.push(
      `C ${previous.x} ${midY}, ` + `${current.x} ${midY}, ` + `${current.x} ${current.y}`,
    );
  }

  return segments.join(" ");
};

/*
 * A branch that leaves `start`, passes straight through a
 * quick-action button's `center`, lingers there briefly,
 * then tapers gradually back to `end` — rather than
 * snapping straight back to center right after the icon.
 */
const buildBranchPath = (start, end, center) => {
  const settle = {
    x: center.x + (end.x - center.x),

    y: center.y + (end.y - center.y),
  };

  return buildRibbonPath([start, center, settle, end]);
};

const measureRibbonAnchors = (invitationTop) => {
  let patternIndex = 0;

  return Array.from(elements.ribbonAnchors).map((anchor) => {
    const rect = anchor.getBoundingClientRect();

    const isFork = "ribbonFork" in anchor.dataset;

    const isMerge = "ribbonMerge" in anchor.dataset;

    /*
     * The fork/merge anchors sit right at the RSVP
     * button and the quick-actions row, so we hang
     * the branches off their bottom edge instead of
     * their center. The merge point gets a little
     * extra breathing room below the row, so the
     * three branches have room to taper back in
     * gently instead of snapping together.
     */
    const y =
      isFork || isMerge
        ? rect.bottom + window.scrollY - invitationTop + (isMerge ? RIBBON_MERGE_EXTRA_DROP : 0)
        : rect.top + window.scrollY - invitationTop + rect.height / 2;

    let x;

    if (isFork || isMerge) {
      x = 0.5 * ribbonWidth;
    } else {
      x = RIBBON_X_PATTERN[patternIndex % RIBBON_X_PATTERN.length] * ribbonWidth;

      patternIndex += 1;
    }

    return { x, y, isFork, isMerge };
  });
};

const renderRibbonNodes = (points) => {
  if (!elements.ribbonNodes) {
    return;
  }

  elements.ribbonNodes.innerHTML = "";

  const fragment = document.createDocumentFragment();

  points.forEach((point) => {
    const node = document.createElement("span");

    node.className = "ribbon__node";

    node.style.insetInlineStart = `${point.x}px`;

    node.style.insetBlockStart = `${point.y}px`;

    fragment.appendChild(node);
  });

  elements.ribbonNodes.appendChild(fragment);
};

const createRibbonPathElement = (d) => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path.setAttribute("class", "ribbon__path");

  path.setAttribute("vector-effect", "non-scaling-stroke");

  path.setAttribute("d", d);

  return path;
};

const addRibbonSegment = (segments, element, startY, endY) => {
  elements.ribbonPaths.appendChild(element);

  const length = element.getTotalLength();

  element.style.strokeDasharray = String(length);

  segments.push({
    element,
    length,
    startY,
    endY,
  });
};

const layoutRibbon = () => {
  if (
    !invitation ||
    !elements.ribbon ||
    !elements.ribbonSvg ||
    !elements.ribbonPaths ||
    !elements.ribbonAnchors.length
  ) {
    return;
  }

  const invitationRect = invitation.getBoundingClientRect();

  const invitationTop = invitationRect.top + window.scrollY;

  const invitationLeft = invitationRect.left;

  ribbonWidth = elements.ribbon.clientWidth || invitation.clientWidth;

  const points = measureRibbonAnchors(invitationTop);

  const ribbonHeight = points[points.length - 1]?.y || 0;

  elements.ribbon.style.blockSize = `${ribbonHeight}px`;

  elements.ribbonSvg.setAttribute("viewBox", `0 0 ${ribbonWidth} ${ribbonHeight}`);

  elements.ribbonPaths.innerHTML = "";

  const segments = [];

  const forkIndex = points.findIndex((point) => point.isFork);

  const mergeIndex = points.findIndex((point) => point.isMerge);

  const canBranch =
    forkIndex !== -1 && mergeIndex === forkIndex + 1 && elements.ribbonLoops.length > 0;

  if (!canBranch) {
    addRibbonSegment(
      segments,
      createRibbonPathElement(buildRibbonPath(points)),
      points[0]?.y || 0,
      ribbonHeight,
    );
  } else {
    const forkPoint = points[forkIndex];

    const mergePoint = points[mergeIndex];

    addRibbonSegment(
      segments,
      createRibbonPathElement(buildRibbonPath(points.slice(0, forkIndex + 1))),
      points[0]?.y || 0,
      forkPoint.y,
    );

    Array.from(elements.ribbonLoops).forEach((loopElement) => {
      const rect = loopElement.getBoundingClientRect();

      const center = {
        x: rect.left - invitationLeft + rect.width / 2,

        y: rect.top + window.scrollY - invitationTop + rect.height / 2,
      };

      addRibbonSegment(
        segments,
        createRibbonPathElement(buildBranchPath(forkPoint, mergePoint, center)),
        forkPoint.y,
        mergePoint.y,
      );
    });

    addRibbonSegment(
      segments,
      createRibbonPathElement(buildRibbonPath(points.slice(mergeIndex))),
      mergePoint.y,
      ribbonHeight,
    );
  }

  ribbonSegments = segments;
  ribbonAnchorPoints = points;

  renderRibbonNodes(points);

  updateRibbonProgress();
};

const updateRibbonProgress = () => {
  if (!ribbonSegments.length) {
    return;
  }

  const revealPoint = window.scrollY + window.innerHeight * 0.65;

  ribbonSegments.forEach((segment) => {
    const span = segment.endY - segment.startY || 1;

    const progress = Math.min(Math.max((revealPoint - segment.startY) / span, 0), 1);

    segment.element.style.strokeDashoffset = String(segment.length * (1 - progress));
  });

  elements.ribbonNodes?.querySelectorAll(".ribbon__node").forEach((node, index) => {
    const point = ribbonAnchorPoints[index];

    node.classList.toggle("is-active", Boolean(point) && revealPoint >= point.y);
  });
};

const requestRibbonUpdate = () => {
  if (ribbonFrame) {
    return;
  }

  ribbonFrame = window.requestAnimationFrame(() => {
    ribbonFrame = null;

    updateRibbonProgress();
  });
};

const configureRibbon = () => {
  if (
    !invitation ||
    !elements.ribbon ||
    !elements.ribbonSvg ||
    !elements.ribbonPaths ||
    !elements.ribbonAnchors.length
  ) {
    return;
  }

  layoutRibbon();

  window.addEventListener("scroll", requestRibbonUpdate, { passive: true });

  window.addEventListener("resize", layoutRibbon);

  window.addEventListener("load", layoutRibbon);
};

/* ==========================================================
   PARALLAX
========================================================== */

let parallaxFrame = null;

const updateParallax = () => {
  const viewportCenter = window.scrollY + window.innerHeight / 2;

  elements.parallaxElements.forEach((element) => {
    const speed = Number(element.dataset.parallaxSpeed) || 0;

    const rect = element.getBoundingClientRect();

    const elementCenter = rect.top + window.scrollY + rect.height / 2;

    const offset = (viewportCenter - elementCenter) * speed;

    element.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  });
};

const requestParallaxUpdate = () => {
  if (parallaxFrame) {
    return;
  }

  parallaxFrame = window.requestAnimationFrame(() => {
    parallaxFrame = null;

    updateParallax();
  });
};

const configureParallax = () => {
  if (!elements.parallaxElements.length) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    return;
  }

  updateParallax();

  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });

  window.addEventListener("resize", requestParallaxUpdate);
};

/* ==========================================================
   MAPS
========================================================== */

const configureMaps = () => {
  if (!config.mapsUrl) {
    return;
  }

  elements.mapsLinks.forEach((link) => {
    link.href = config.mapsUrl;
  });
};

/* ==========================================================
   COUNTDOWN
========================================================== */

let countdownInterval = null;

const renderCountdown = () => {
  if (!config.start) {
    return;
  }

  const eventDate = new Date(config.start);

  const difference = eventDate.getTime() - Date.now();

  if (difference <= 0) {
    window.clearInterval(countdownInterval);

    elements.days.textContent = "00";

    elements.hours.textContent = "00";

    elements.minutes.textContent = "00";

    elements.seconds.textContent = "00";

    return;
  }

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor((totalSeconds % 86400) / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  elements.days.textContent = pad(days);

  elements.hours.textContent = pad(hours);

  elements.minutes.textContent = pad(minutes);

  elements.seconds.textContent = pad(seconds);
};

const configureCountdown = () => {
  if (!elements.days || !elements.hours || !elements.minutes || !elements.seconds) {
    return;
  }

  renderCountdown();

  countdownInterval = window.setInterval(renderCountdown, 1000);
};

/* ==========================================================
   MUSIC
========================================================== */

const updateMusicUI = () => {
  if (!elements.audio || !elements.musicToggle) {
    return;
  }

  const isPlaying = !elements.audio.paused;

  elements.musicToggle.setAttribute("aria-pressed", String(isPlaying));

  elements.musicToggle.setAttribute(
    "aria-label",
    isPlaying ? "Pausar música" : "Reproducir música",
  );
};

const playMusic = async () => {
  if (!elements.audio) {
    return false;
  }

  try {
    await elements.audio.play();

    updateMusicUI();

    return true;
  } catch {
    updateMusicUI();

    return false;
  }
};

const pauseMusic = () => {
  if (!elements.audio) {
    return;
  }

  elements.audio.pause();

  updateMusicUI();
};

const toggleMusic = async () => {
  if (!elements.audio) {
    return;
  }

  if (elements.audio.paused) {
    await playMusic();

    return;
  }

  pauseMusic();
};

const configureMusic = async () => {
  if (!elements.audio || !elements.musicToggle) {
    return;
  }

  elements.audio.loop = true;

  elements.audio.volume = 0.65;

  elements.musicToggle.addEventListener("click", toggleMusic);

  elements.audio.addEventListener("play", updateMusicUI);

  elements.audio.addEventListener("pause", updateMusicUI);

  const autoplaySucceeded = await playMusic();

  if (autoplaySucceeded) {
    return;
  }

  const retryAfterInteraction = async (event) => {
    const target = event.target;

    /*
     * Prevent:
     *
     * pointerdown -> play
     * click       -> immediately pause
     */

    if (target instanceof Element && target.closest("#music-toggle")) {
      return;
    }

    const succeeded = await playMusic();

    if (!succeeded) {
      return;
    }

    document.removeEventListener("pointerdown", retryAfterInteraction);

    document.removeEventListener("keydown", retryAfterInteraction);
  };

  document.addEventListener("pointerdown", retryAfterInteraction, {
    passive: true,
  });

  document.addEventListener("keydown", retryAfterInteraction);
};

/* ==========================================================
   RSVP
========================================================== */

const configureRSVP = () => {
  if (!elements.rsvp) {
    return;
  }

  const isPlaceholder = !config.rsvpNumber || config.rsvpNumber.includes("X");

  if (isPlaceholder) {
    elements.rsvp.addEventListener("click", (event) => {
      event.preventDefault();

      announce("El número de RSVP aún no está configurado.");

      console.warn("Complete data-rsvp-number in index.html.");
    });

    return;
  }

  const message = [
    "¡Hola! 👋",
    "",
    "Confirmo mi asistencia al cumpleaños de Alex 🎉",
    "",
    "¡Nos vemos para brincar juntos! 🦘",
  ].join("\n");

  elements.rsvp.href =
    `https://wa.me/${config.rsvpNumber}` + `?text=${encodeURIComponent(message)}`;

  elements.rsvp.target = "_blank";

  elements.rsvp.rel = "noopener noreferrer";
};

/* ==========================================================
   CALENDAR HELPERS
========================================================== */

const escapeICS = (value) =>
  value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

const toICSDate = (date) =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

/* ==========================================================
   CALENDAR
========================================================== */

const downloadCalendarEvent = () => {
  if (!config.start || !config.end) {
    return;
  }

  const start = new Date(config.start);

  const end = new Date(config.end);

  const description = "¡Ven a brincar, jugar y celebrar con Alex!";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Caele.mx//Invitacion Digital//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeICS(config.title)}`,
    `LOCATION:${escapeICS(config.location)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    `URL:${window.location.href}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const file = new Blob([ics], {
    type: "text/calendar;charset=utf-8",
  });

  const objectUrl = URL.createObjectURL(file);

  const link = document.createElement("a");

  link.href = objectUrl;

  link.download = "alex-cumple-8.ics";

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(objectUrl);

  announce("Evento descargado para agregarlo al calendario.");
};

/* ==========================================================
   SHARE
========================================================== */

const shareInvitation = async () => {
  const shareData = {
    title: config.title,

    text: "¡Alex cumple 8! Ven a brincar, jugar y celebrar con nosotros 🎉🦘",

    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);

      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  }

  if (!navigator.clipboard) {
    announce("Tu navegador no permite copiar el enlace automáticamente.");

    return;
  }

  try {
    await navigator.clipboard.writeText(window.location.href);

    announce("Enlace de la invitación copiado.");
  } catch {
    announce("No fue posible copiar el enlace.");
  }
};

/* ==========================================================
   EVENTS
========================================================== */

const configureCalendar = () => {
  elements.calendar?.addEventListener("click", downloadCalendarEvent);
};

const configureShare = () => {
  elements.share?.addEventListener("click", shareInvitation);
};

/* ==========================================================
   INIT
========================================================== */

const init = () => {
  configureStreamers();

  configureRibbon();

  configureParallax();

  configureMaps();

  configureCountdown();

  configureRSVP();

  configureCalendar();

  configureShare();

  configureMusic();
};

init();

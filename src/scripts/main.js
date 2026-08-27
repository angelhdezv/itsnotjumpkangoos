'use strict';

const invitation = document.querySelector('.invitation');

const config = {
    title: invitation?.dataset.eventTitle ?? 'Alex cumple 8',
    start: invitation?.dataset.eventStart ?? '',
    end: invitation?.dataset.eventEnd ?? '',
    location: invitation?.dataset.eventLocation ?? '',
    mapsUrl: invitation?.dataset.mapsUrl ?? '',
    rsvpNumber: invitation?.dataset.rsvpNumber ?? '',
};

const elements = {
    audio: document.querySelector('#background-music'),
    musicToggle: document.querySelector('#music-toggle'),
    days: document.querySelector('[data-countdown-days]'),
    hours: document.querySelector('[data-countdown-hours]'),
    minutes: document.querySelector('[data-countdown-minutes]'),
    seconds: document.querySelector('[data-countdown-seconds]'),
    rsvp: document.querySelector('[data-rsvp]'),
    mapsLinks: document.querySelectorAll('[data-maps-link]'),
    calendar: document.querySelector('[data-calendar]'),
    share: document.querySelector('[data-share]'),
    status: document.querySelector('#action-status'),
    ribbon: document.querySelector('[data-ribbon]'),
    ribbonSvg: document.querySelector('[data-ribbon-svg]'),
    ribbonPaths: document.querySelector('[data-ribbon-paths]'),
    ribbonNodes: document.querySelector('[data-ribbon-nodes]'),
    ribbonAnchors: document.querySelectorAll('[data-ribbon-anchor]'),
    ribbonLoops: document.querySelectorAll('[data-ribbon-loop]'),
    parallaxElements: document.querySelectorAll('[data-parallax-speed]'),
};

const announce = (message) => {
    if (elements.status) elements.status.textContent = message;
};

const pad = (value) => String(value).padStart(2, '0');

/* Coral ribbon: adapted from feat-paralax and redrawn as the user scrolls. */
const RIBBON_X_PATTERN = [0.50, 0.69, 0.55, 0.76, 0.29, 0.72, 0.52];
const RIBBON_MERGE_EXTRA_DROP = 36;

let ribbonWidth = 0;
let ribbonSegments = [];
let ribbonFrame = null;
let ribbonResizeObserver = null;

const buildRibbonPath = (points) => {
    if (points.length < 2) return '';

    const path = [`M ${points[0].x} ${points[0].y}`];

    for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1];
        const current = points[index];
        const verticalDistance = Math.max(1, current.y - previous.y);
        const bend = Math.min(verticalDistance * 0.55, 170);

        path.push(
            `C ${previous.x} ${previous.y + bend}, ` +
            `${current.x} ${current.y - bend}, ` +
            `${current.x} ${current.y}`,
        );
    }

    return path.join(' ');
};

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
        const isFork = 'ribbonFork' in anchor.dataset;
        const isMerge = 'ribbonMerge' in anchor.dataset;
        const y = isFork || isMerge
            ? rect.bottom + window.scrollY - invitationTop + (isMerge ? RIBBON_MERGE_EXTRA_DROP : 0)
            : rect.top + window.scrollY - invitationTop + rect.height / 2;

        let x;

        if (isFork || isMerge) {
            x = ribbonWidth * 0.5;
        } else {
            x = RIBBON_X_PATTERN[patternIndex % RIBBON_X_PATTERN.length] * ribbonWidth;
            patternIndex += 1;
        }

        return { x, y, isFork, isMerge };
    });
};

const createRibbonPath = (d) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'ribbon__path');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    path.setAttribute('d', d);
    return path;
};

const addRibbonSegment = (segments, path, startY, endY) => {
    elements.ribbonPaths.appendChild(path);
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    segments.push({ element: path, length, startY, endY });
};

const updateRibbonProgress = () => {
    if (!ribbonSegments.length || !invitation) return;

    const invitationTop = invitation.getBoundingClientRect().top + window.scrollY;
    const revealPoint = window.scrollY + window.innerHeight * 0.72 - invitationTop;

    ribbonSegments.forEach((segment) => {
        const span = segment.endY - segment.startY || 1;
        const progress = Math.min(Math.max((revealPoint - segment.startY) / span, 0), 1);
        segment.element.style.strokeDashoffset = String(segment.length * (1 - progress));
    });
};

const layoutRibbon = () => {
    if (!invitation || !elements.ribbon || !elements.ribbonSvg || !elements.ribbonPaths || !elements.ribbonAnchors.length) return;

    const invitationRect = invitation.getBoundingClientRect();
    const invitationTop = invitationRect.top + window.scrollY;
    const invitationLeft = invitationRect.left;
    ribbonWidth = elements.ribbon.clientWidth || invitation.clientWidth;

    const points = measureRibbonAnchors(invitationTop);
    const ribbonHeight = Math.max(1, points.at(-1)?.y ?? 1);
    elements.ribbon.style.height = `${ribbonHeight}px`;
    elements.ribbonSvg.setAttribute('viewBox', `0 0 ${ribbonWidth} ${ribbonHeight}`);
    elements.ribbonPaths.replaceChildren();

    const segments = [];
    const forkIndex = points.findIndex((point) => point.isFork);
    const mergeIndex = points.findIndex((point) => point.isMerge);
    const canBranch = forkIndex !== -1 && mergeIndex === forkIndex + 1 && elements.ribbonLoops.length > 0;

    if (!canBranch) {
        addRibbonSegment(segments, createRibbonPath(buildRibbonPath(points)), points[0]?.y ?? 0, ribbonHeight);
    } else {
        const forkPoint = points[forkIndex];
        const mergePoint = points[mergeIndex];
        addRibbonSegment(
            segments,
            createRibbonPath(buildRibbonPath(points.slice(0, forkIndex + 1))),
            points[0]?.y ?? 0,
            forkPoint.y,
        );

        elements.ribbonLoops.forEach((loopElement) => {
            const rect = loopElement.getBoundingClientRect();
            const center = {
                x: rect.left - invitationLeft + rect.width / 2,
                y: rect.top + window.scrollY - invitationTop + rect.height / 2,
            };
            addRibbonSegment(
                segments,
                createRibbonPath(buildBranchPath(forkPoint, mergePoint, center)),
                forkPoint.y,
                mergePoint.y,
            );
        });

        addRibbonSegment(
            segments,
            createRibbonPath(buildRibbonPath(points.slice(mergeIndex))),
            mergePoint.y,
            ribbonHeight,
        );
    }

    ribbonSegments = segments;
    updateRibbonProgress();
};

const requestRibbonUpdate = () => {
    if (ribbonFrame) return;
    ribbonFrame = window.requestAnimationFrame(() => {
        ribbonFrame = null;
        updateRibbonProgress();
    });
};

const configureRibbon = () => {
    if (!elements.ribbonAnchors.length) return;

    layoutRibbon();
    window.addEventListener('scroll', requestRibbonUpdate, { passive: true });
    window.addEventListener('resize', layoutRibbon);
    window.addEventListener('load', layoutRibbon, { once: true });
    document.fonts?.ready.then(layoutRibbon);

    if ('ResizeObserver' in window && invitation) {
        ribbonResizeObserver = new ResizeObserver(layoutRibbon);
        ribbonResizeObserver.observe(invitation);
    }
};

/* Gentle depth for the two large hero shapes. */
let parallaxFrame = null;

const updateParallax = () => {
    const viewportCenter = window.scrollY + window.innerHeight / 2;

    elements.parallaxElements.forEach((element) => {
        const speed = Number(element.dataset.parallaxSpeed) || 0;
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + window.scrollY + rect.height / 2;
        const offset = (viewportCenter - elementCenter) * speed;
        element.style.translate = `0 ${offset.toFixed(2)}px`;
    });
};

const requestParallaxUpdate = () => {
    if (parallaxFrame) return;
    parallaxFrame = window.requestAnimationFrame(() => {
        parallaxFrame = null;
        updateParallax();
    });
};

const configureParallax = () => {
    if (!elements.parallaxElements.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    updateParallax();
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    window.addEventListener('resize', requestParallaxUpdate);
};

const configureMaps = () => {
    if (!config.mapsUrl) return;
    elements.mapsLinks.forEach((link) => { link.href = config.mapsUrl; });
};

let countdownInterval = null;

const renderCountdown = () => {
    if (!config.start) return;

    const difference = new Date(config.start).getTime() - Date.now();

    if (difference <= 0) {
        window.clearInterval(countdownInterval);
        elements.days.textContent = '00';
        elements.hours.textContent = '00';
        elements.minutes.textContent = '00';
        elements.seconds.textContent = '00';
        return;
    }

    const totalSeconds = Math.floor(difference / 1000);
    elements.days.textContent = pad(Math.floor(totalSeconds / 86400));
    elements.hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
    elements.minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
    elements.seconds.textContent = pad(totalSeconds % 60);
};

const configureCountdown = () => {
    if (!elements.days || !elements.hours || !elements.minutes || !elements.seconds) return;
    renderCountdown();
    countdownInterval = window.setInterval(renderCountdown, 1000);
};

const updateMusicUI = () => {
    if (!elements.audio || !elements.musicToggle) return;
    const isPlaying = !elements.audio.paused;
    elements.musicToggle.setAttribute('aria-pressed', String(isPlaying));
    elements.musicToggle.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Reproducir música');
};

const playMusic = async () => {
    if (!elements.audio) return false;
    try {
        await elements.audio.play();
        updateMusicUI();
        return true;
    } catch {
        updateMusicUI();
        return false;
    }
};

const configureMusic = async () => {
    if (!elements.audio || !elements.musicToggle) return;

    elements.audio.loop = true;
    elements.audio.volume = 0.6;
    elements.musicToggle.addEventListener('click', async () => {
        if (elements.audio.paused) await playMusic();
        else elements.audio.pause();
        updateMusicUI();
    });
    elements.audio.addEventListener('play', updateMusicUI);
    elements.audio.addEventListener('pause', updateMusicUI);

    if (await playMusic()) return;

    const retryAfterInteraction = async (event) => {
        if (event.target instanceof Element && event.target.closest('#music-toggle')) return;
        if (!(await playMusic())) return;
        document.removeEventListener('pointerdown', retryAfterInteraction);
        document.removeEventListener('keydown', retryAfterInteraction);
    };

    document.addEventListener('pointerdown', retryAfterInteraction, { passive: true });
    document.addEventListener('keydown', retryAfterInteraction);
};

const configureRSVP = () => {
    if (!elements.rsvp) return;
    const isPlaceholder = !config.rsvpNumber || config.rsvpNumber.includes('X');

    if (isPlaceholder) {
        elements.rsvp.addEventListener('click', (event) => {
            event.preventDefault();
            announce('El número de confirmación aún no está configurado.');
        });
        return;
    }

    const message = [
        'Hola,',
        '',
        'Confirmo mi asistencia al cumpleaños de Alex.',
        '',
        'Nos vemos para brincar juntos.',
    ].join('\n');

    elements.rsvp.href = `https://wa.me/${config.rsvpNumber}?text=${encodeURIComponent(message)}`;
    elements.rsvp.target = '_blank';
    elements.rsvp.rel = 'noopener noreferrer';
};

const escapeICS = (value) => value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');

const toICSDate = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

const downloadCalendarEvent = () => {
    if (!config.start || !config.end) return;

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Caele.mx//Invitacion Digital//ES',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `DTSTART:${toICSDate(new Date(config.start))}`,
        `DTEND:${toICSDate(new Date(config.end))}`,
        `SUMMARY:${escapeICS(config.title)}`,
        `LOCATION:${escapeICS(config.location)}`,
        `DESCRIPTION:${escapeICS('Ven a brincar, jugar y celebrar con Alex.')}`,
        `URL:${window.location.href}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');

    const objectUrl = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = 'alex-cumple-8.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
    announce('Evento descargado para agregarlo al calendario.');
};

const shareInvitation = async () => {
    const shareData = {
        title: config.title,
        text: 'Alex cumple 8. Ven a brincar, jugar y celebrar con nosotros.',
        url: window.location.href,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
            return;
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') return;
        }
    }

    try {
        await navigator.clipboard.writeText(window.location.href);
        announce('Enlace de la invitación copiado.');
    } catch {
        announce('No fue posible copiar el enlace.');
    }
};

const init = () => {
    configureRibbon();
    configureParallax();
    configureMaps();
    configureCountdown();
    configureRSVP();
    elements.calendar?.addEventListener('click', downloadCalendarEvent);
    elements.share?.addEventListener('click', shareInvitation);
    configureMusic();
};

init();

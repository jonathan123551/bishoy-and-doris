import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventConfig } from '../config/eventConfig';
import { generateICS } from '../utils/calendar';

import finalSealImg from '../assets/decor/final_seal.png';
import foliageImg from '../assets/decor/botanical_foliage.png';

gsap.registerPlugin(ScrollTrigger);

// Clean inline vector SVG icons matching the reference luxury invitation
const TopFinial = () => (
  <svg viewBox="0 0 24 20" width="18" height="15" fill="#8e7345" aria-hidden="true" className="fi-top-finial">
    <path d="M12 2 C11.5 5 9 6.5 9 9 C9 11 10.5 12 12 12 C13.5 12 15 11 15 9 C15 6.5 12.5 5 12 2 Z" />
    <path d="M8 10 C6 10 4 11 4 13 C4 15 6 15.5 8 14.5 C8.5 13.5 8.5 11.5 8 10 Z" />
    <path d="M16 10 C18 10 20 11 20 13 C20 15 18 15.5 16 14.5 C15.5 13.5 15.5 11.5 16 10 Z" />
    <circle cx="12" cy="15" r="1.2" />
  </svg>
);

const BottomFinial = () => (
  <svg viewBox="0 0 32 16" width="22" height="11" fill="#8e7345" aria-hidden="true" className="fi-bottom-finial">
    <circle cx="16" cy="8" r="1.5" />
    <path d="M12 8 C9 6 6 8 3 8 C7 9 10 9 12 8 Z" />
    <path d="M20 8 C23 6 26 8 29 8 C25 9 22 9 20 8 Z" />
    <circle cx="8" cy="8" r="0.8" />
    <circle cx="24" cy="8" r="0.8" />
  </svg>
);

const RingsIcon = () => (
  <svg viewBox="0 0 36 18" width="32" height="16" fill="none" stroke="#cfad6b" strokeWidth="1.2" aria-hidden="true" className="fi-rings-icon">
    <circle cx="13" cy="9" r="6" />
    <circle cx="23" cy="9" r="6" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#8e7345" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="8" cy="14" r="0.75" fill="#8e7345" />
    <circle cx="12" cy="14" r="0.75" fill="#8e7345" />
    <circle cx="16" cy="14" r="0.75" fill="#8e7345" />
    <circle cx="8" cy="18" r="0.75" fill="#8e7345" />
    <circle cx="12" cy="18" r="0.75" fill="#8e7345" />
    <circle cx="16" cy="18" r="0.75" fill="#8e7345" />
  </svg>
);

const ChurchIcon = () => (
  <svg viewBox="0 0 24 26" width="20" height="22" fill="none" stroke="#8e7345" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="5" />
    <line x1="10" y1="3" x2="14" y2="3" />
    <path d="M12 5 L7 11 L17 11 Z" />
    <rect x="7" y="11" width="10" height="14" />
    <path d="M10 25 L10 19 A2 2 0 0 1 14 19 L14 25" />
    <path d="M7 14 L4 17 L4 25 L7 25" />
    <path d="M17 14 L20 17 L20 25 L17 25" />
  </svg>
);

const ReceptionIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#8e7345" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <g transform="rotate(-15 8 12)">
      <path d="M7 3 L9.5 9 C9.5 11 8.5 12 7.5 12 L7.5 18 L5 21 L10 21 L10 18 L9.5 12 C8.5 12 7.5 11 7.5 9 Z" />
    </g>
    <g transform="rotate(15 16 12)">
      <path d="M16.5 3 L19 9 C19 11 18 12 17 12 L17 18 L14.5 21 L19.5 21 L19.5 18 L19 12 C18 12 17 11 17 9 Z" />
    </g>
    <circle cx="12" cy="5" r="0.75" fill="#8e7345" />
  </svg>
);

const CornerFlourish = ({ className }) => (
  <svg viewBox="0 0 36 36" width="24" height="24" fill="none" stroke="rgba(197, 159, 81, 0.7)" strokeWidth="1.1" className={className} aria-hidden="true">
    <path d="M2,2 L14,2 M2,2 L2,14" />
    <path d="M6,6 C6,14 14,22 26,26" />
    <path d="M6,6 C14,6 22,14 26,26" />
    <circle cx="8" cy="8" r="1.1" fill="rgba(197, 159, 81, 0.7)" />
  </svg>
);

const CalendarBtnIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#cfad6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="8" cy="14" r="0.6" fill="#cfad6b" />
    <circle cx="12" cy="14" r="0.6" fill="#cfad6b" />
    <circle cx="16" cy="14" r="0.6" fill="#cfad6b" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#cfad6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2 C8.13 2 5 5.13 5 9 C5 14.25 12 22 12 22 C12 22 19 14.25 19 9 C19 5.13 15.87 2 12 2 Z" />
    <circle cx="12" cy="9" r="2.5" fill="#cfad6b" />
  </svg>
);

export default function FinalInvitation() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      // Initialize progressive elements
      gsap.set('.fi-border-outer, .fi-border-inner, .fi-corner', { autoAlpha: 0, scale: 0.98 });
      gsap.set('.fi-frame-header', { autoAlpha: 0, y: 10 });
      gsap.set('.fi-frame-names', { autoAlpha: 0, y: 14, scale: 0.96 });
      gsap.set('.fi-frame-message', { autoAlpha: 0, y: 8 });
      gsap.set('.fi-event-date', { autoAlpha: 0, y: 12, scale: 0.96 });
      gsap.set('.fi-event-ceremony', { autoAlpha: 0, y: 12, scale: 0.96 });
      gsap.set('.fi-event-reception', { autoAlpha: 0, y: 12, scale: 0.96 });
      gsap.set('.fi-col-divider', { scaleY: 0 });
      gsap.set('.fi-botanical-foliage', { autoAlpha: 0, scaleX: 0.9 });
      gsap.set('.fi-wax-seal', { autoAlpha: 0, scale: 1.25, y: -14 });
      gsap.set('.fi-frame-signoff', { autoAlpha: 0, y: 8 });
      gsap.set('.fi-frame-actions', { autoAlpha: 0, y: 10 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=220%',
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 0.00 -> 0.08: Paper borders & corner filigrees materialize
      tl.to('.fi-border-outer, .fi-border-inner, .fi-corner', {
        autoAlpha: 1,
        scale: 1,
        stagger: 0.015,
        duration: 0.08,
        ease: 'power2.out',
      }, 0.0);

      // 0.08 -> 0.20: FRAME 1 — Top Proclamation & B & D
      tl.to('.fi-frame-header', {
        autoAlpha: 1,
        y: 0,
        duration: 0.12,
        ease: 'power2.out',
      }, 0.08);

      // 0.20 -> 0.32: FRAME 2 — BISHOY & DORIS with wedding rings
      tl.to('.fi-frame-names', {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.12,
        ease: 'power2.out',
      }, 0.20);

      // 0.32 -> 0.44: FRAME 3 — Emotional Invitation Message
      tl.to('.fi-frame-message', {
        autoAlpha: 1,
        y: 0,
        duration: 0.12,
        ease: 'power2.out',
      }, 0.32);

      // 0.44 -> 0.58: FRAME 4 — Date & Time Column
      tl.to('.fi-event-date', {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.14,
        ease: 'power2.out',
      }, 0.44);

      // 0.54 -> 0.68: FRAME 5 — Ceremony Column
      tl.to('.fi-col-divider', {
        scaleY: 1,
        duration: 0.10,
        ease: 'power1.inOut',
      }, 0.54);

      tl.to('.fi-event-ceremony', {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.14,
        ease: 'power2.out',
      }, 0.56);

      // 0.68 -> 0.80: FRAME 6 — Reception Column
      tl.to('.fi-event-reception', {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.14,
        ease: 'power2.out',
      }, 0.68);

      // 0.80 -> 0.90: FRAME 7 — Wax Seal & Botanical Foliage
      tl.to('.fi-botanical-foliage', {
        autoAlpha: 1,
        scaleX: 1,
        duration: 0.10,
        ease: 'power2.out',
      }, 0.80);

      tl.to('.fi-wax-seal', {
        autoAlpha: 1,
        scale: 1.0,
        y: 0,
        duration: 0.12,
        ease: 'power2.out',
      }, 0.82);

      // 0.90 -> 0.96: FRAME 8 — "See you there." & Finial
      tl.to('.fi-frame-signoff', {
        autoAlpha: 1,
        y: 0,
        duration: 0.08,
        ease: 'power2.out',
      }, 0.90);

      // 0.96 -> 1.00: FRAME 9 — Action Buttons (Add to Calendar & View Map)
      tl.to('.fi-frame-actions', {
        autoAlpha: 1,
        y: 0,
        duration: 0.08,
        ease: 'power2.out',
      }, 0.96);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="fi-scene" aria-label="Wedding Invitation Card">
      {/* Deep Navy Velvet Stage Background */}
      <div className="fi-stage-bg" aria-hidden="true">
        <div className="fi-velvet-gradient" />
        <div className="fi-velvet-vignette" />
      </div>

      <div className="fi-container">
        {/* Luxury Printed Wedding Invitation Card */}
        <div className="fi-card">
          {/* Paper Texture Surface */}
          <div className="fi-card-paper" aria-hidden="true" />

          {/* Dual Inset Gold Border & Corner Filigrees */}
          <div className="fi-border-outer" aria-hidden="true" />
          <div className="fi-border-inner" aria-hidden="true">
            <CornerFlourish className="fi-corner fi-corner-tl" />
            <CornerFlourish className="fi-corner fi-corner-tr" />
            <CornerFlourish className="fi-corner fi-corner-bl" />
            <CornerFlourish className="fi-corner fi-corner-br" />
          </div>

          {/* Physical Invitation Content Body */}
          <div className="fi-card-body">
            {/* FRAME 1: Proclamation & B & D Monogram */}
            <div className="fi-frame fi-frame-header">
              <TopFinial />
              <div className="fi-header-row">
                <span className="fi-header-rule" />
                <span className="fi-monogram">B &amp; D</span>
                <span className="fi-header-rule" />
              </div>
              <p className="fi-proclamation">
                TOGETHER WITH THEIR FAMILIES<br />
                YOU ARE JOYFULLY INVITED TO<br />
                THE WEDDING OF
              </p>
              <span className="fi-proclamation-star">✦</span>
            </div>

            {/* FRAME 2: Bishoy & Doris Names Centerpiece */}
            <div className="fi-frame fi-frame-names">
              <h2 className="fi-names">{eventConfig.groomName} &amp; {eventConfig.brideName}</h2>
              <div className="fi-names-divider">
                <span className="fi-names-rule" />
                <RingsIcon />
                <span className="fi-names-rule" />
              </div>
            </div>

            {/* FRAME 3: Warm Message */}
            <div className="fi-frame fi-frame-message">
              <p className="fi-message">
                We look forward to sharing our beginning with you.
              </p>
            </div>

            {/* FRAMES 4, 5, 6: 3-Column Event Details Grid */}
            <div className="fi-events-grid">
              {/* FRAME 4: Date & Time */}
              <div className="fi-frame fi-event-col fi-event-date">
                <div className="fi-event-icon-wrap">
                  <CalendarIcon />
                </div>
                <span className="fi-event-label">{eventConfig.displayDay}</span>
                <p className="fi-event-highlight">14 &middot; 11 &middot; 2026</p>
                <span className="fi-event-sub">AT {eventConfig.displayTime}</span>
              </div>

              <div className="fi-col-divider" aria-hidden="true" />

              {/* FRAME 5: Ceremony */}
              <div className="fi-frame fi-event-col fi-event-ceremony">
                <div className="fi-event-icon-wrap">
                  <ChurchIcon />
                </div>
                <span className="fi-event-label">CEREMONY</span>
                <p className="fi-church-arabic">{eventConfig.church.arabicName}</p>
                <p className="fi-church-area">بالشيراتون</p>
                <span className="fi-event-sub">{eventConfig.church.area.toUpperCase()}, {eventConfig.church.city.toUpperCase()}</span>
              </div>

              <div className="fi-col-divider" aria-hidden="true" />

              {/* FRAME 6: Reception */}
              <div className="fi-frame fi-event-col fi-event-reception">
                <div className="fi-event-icon-wrap">
                  <ReceptionIcon />
                </div>
                <span className="fi-event-label">RECEPTION</span>
                <p className="fi-reception-name">{eventConfig.reception.name.toUpperCase()} &ndash; {eventConfig.reception.area.toUpperCase()}</p>
                <span className="fi-event-sub">ALMAZAH, CAIRO</span>
              </div>
            </div>

            {/* FRAME 7: Botanical Laurel Foliage & 3D Wax Seal */}
            <div className="fi-frame fi-frame-seal">
              <img src={foliageImg} className="fi-botanical-foliage" alt="" aria-hidden="true" />
              <div className="fi-seal-stamp-wrap">
                <img src={finalSealImg} className="fi-wax-seal" alt="Bishoy &amp; Doris Wax Seal" />
              </div>
            </div>

            {/* FRAME 8: "See you there." & Closing Finial */}
            <div className="fi-frame fi-frame-signoff">
              <p className="fi-signoff">See you there.</p>
              <BottomFinial />
            </div>

            {/* FRAME 9: Action Buttons (Add to Calendar & View Map) */}
            <div className="fi-frame fi-frame-actions">
              <div className="fi-actions-pill">
                <button
                  type="button"
                  className="fi-action-btn"
                  onClick={() => generateICS(eventConfig)}
                  aria-label="Add wedding to your calendar"
                >
                  <CalendarBtnIcon />
                  <span>ADD TO CALENDAR</span>
                </button>
                <span className="fi-btn-sep" aria-hidden="true" />
                <a
                  href={eventConfig.reception.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fi-action-btn"
                  aria-label="View reception on Google Maps"
                >
                  <MapPinIcon />
                  <span>VIEW MAP</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

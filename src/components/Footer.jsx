import { useState, useEffect } from 'react';
import styles from './Footer.module.css';

/* ──── Countdown Timer Hook ─────────────────────────────── */
function calcTime(targetDate) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    past:    false,
  };
}

function useCountdown(targetDate) {
  const [time, setTime] = useState(() => calcTime(targetDate));
  useEffect(() => {
    const id = setInterval(() => setTime(calcTime(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

/* ──── Timer Box ─────────────────────────────────────────── */
function TimerBox({ value, label }) {
  return (
    <div className={styles.timerBox}>
      <span className={styles.timerNum}>{String(value).padStart(2, '0')}</span>
      <span className={styles.timerLabel}>{label}</span>
    </div>
  );
}

/* ──── Footer Component ──────────────────────────────────── */
export default function Footer({ photographer, gallery }) {
  const eventDate = gallery?.event_date;
  const time = useCountdown(eventDate || '2030-01-01');

  const instagramHandle = photographer?.instagram?.replace('@', '');
  const whatsapp = photographer?.whatsapp;

  return (
    <footer className={styles.footer}>
      {/* Stars */}
      <div className={styles.stars}>
        {[...Array(30)].map((_, i) => (
          <div key={i} className={styles.star} style={{
            left: `${(i * 41 + 7) % 100}%`,
            top:  `${(i * 29 + 5) % 85}%`,
            width:  `${(i % 3) + 1}px`,
            height: `${(i % 3) + 1}px`,
            animationDelay: `${(i * 0.31).toFixed(2)}s`,
            animationDuration: `${2.5 + (i % 4) * 0.5}s`,
          }} />
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Title */}
        <p className={styles.label}>
          {time.past ? 'The celebration took place on' : 'Counting down to'}
        </p>
        <h2 className={styles.eventTitle}>
          {gallery?.groom_name && gallery?.bride_name
            ? `${gallery.groom_name} & ${gallery.bride_name}`
            : gallery?.title || 'Wedding'}
        </h2>
        {eventDate && (
          <p className={styles.eventDate}>
            {new Date(eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}

        {/* Countdown */}
        {!time.past && eventDate && (
          <div className={styles.countdown}>
            <TimerBox value={time.days}    label="Days" />
            <span className={styles.colon}>:</span>
            <TimerBox value={time.hours}   label="Hours" />
            <span className={styles.colon}>:</span>
            <TimerBox value={time.minutes} label="Minutes" />
            <span className={styles.colon}>:</span>
            <TimerBox value={time.seconds} label="Seconds" />
          </div>
        )}

        {/* Divider */}
        <div className={styles.divider} />

        {/* Photographer info */}
        <div className={styles.photographerInfo}>
          <p className={styles.photographedBy}>
            Photography by <span className={styles.photographerName}>{photographer?.name || 'Your Photographer'}</span>
          </p>
          {photographer?.tagline && (
            <p className={styles.tagline}>{photographer.tagline}</p>
          )}

          {/* Social / contact */}
          <div className={styles.socials}>
            {instagramHandle && (
              <a href={`https://instagram.com/${instagramHandle}`} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
                @{instagramHandle}
              </a>
            )}
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                WhatsApp
              </a>
            )}
            {photographer?.cta_text && (
              <span className={styles.ctaText}>{photographer.cta_text}</span>
            )}
          </div>
        </div>

        <p className={styles.copy}>© {new Date().getFullYear()} {photographer?.name} · All rights reserved</p>
      </div>
    </footer>
  );
}

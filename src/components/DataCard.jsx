import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './DataCard.module.css';

/**
 * DataCard — 3-layer framed sub-event card
 *
 * Layer 1: Square cover image
 * Layer 2: Text overlay (event name + photo count)
 * Layer 3: Frame.png ornamental border
 *
 * Props:
 *   to       – route to navigate (e.g. "/event/haldi")
 *   image    – cover image URL
 *   label    – event name
 *   count    – photo count
 *   icon     – optional emoji icon (unused visually, kept for API compat)
 *   delay    – optional animation delay in seconds
 */
export default function DataCard({ to, image, label, count, icon, delay = 0 }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.visible);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      to={to}
      className={styles.card}
      style={{ transitionDelay: `${delay}s` }}
      ref={cardRef}
    >
      <div className={styles.container}>
        {/* Layer 1: Square image */}
        {image ? (
          <img
            src={image}
            alt={label}
            className={styles.image}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={styles.placeholder}>
            <span>{icon || '📷'}</span>
          </div>
        )}

        {/* Layer 2: Text overlay */}
        <div className={styles.textOverlay}>
          <h3 className={styles.name}>{label}</h3>
          <p className={styles.count}>{count ?? 0} photos</p>
        </div>

        {/* Layer 3: Ornamental frame */}
        <img
          src="/Frame.png"
          alt=""
          className={styles.frame}
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

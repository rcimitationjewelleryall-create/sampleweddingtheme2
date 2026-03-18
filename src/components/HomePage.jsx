import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import galleryData from '../data.json';
import PhotographerBanner from './PhotographerBanner';
import SelfieFilter from './SelfieFilter';
import LoadingOverlay from './LoadingOverlay';
import HireUsFab from './HireUsFab';
import Footer from './Footer';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { gallery, photographer, event_sections, photos } = galleryData;
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(null);
  const [selfieMatchIds, setSelfieMatchIds] = useState(null);
  const momentsRef = useRef(null);

  // Site Loader State
  const [siteLoaded, setSiteLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        // Slide up after a short delay once it hits 100%
        setTimeout(() => setSiteLoaded(true), 500); 
      }
      setLoadProgress(progress);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const [perfectMoments] = useState(() => {
    // Basic randomness: sort randomly then slice on initial render only
    const shuffled = [...photos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5); // Changed to 5 for the exact bento grid layout
  });

  // Scroll to moments handler
  const scrollToMoments = () =>
    momentsRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleSelfieResult = (ids) => {
    setSelfieMatchIds(ids);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ── Site Loader ── */}
      <div className={`${styles.siteLoader} ${siteLoaded ? styles.hidden : ''}`}>
        <h1 className={styles.loaderNames}>
          {gallery?.groom_name || 'Groom'}
          <span className={styles.loaderWeds}>weds</span>
          {gallery?.bride_name || 'Bride'}
        </h1>
        <div className={styles.loaderBarContainer}>
          <div 
            className={styles.loaderBarFill} 
            style={{ width: `${loadProgress}%` }} 
          />
        </div>
        <p className={styles.loaderText}>Loading...</p>
      </div>

      <LoadingOverlay visible={loading} progress={loadingProgress} />

      {/* ── Hero ── */}
      <PhotographerBanner
        photographer={photographer}
        gallery={gallery}
        onYourPhotos={scrollToMoments}
      />

      {/* ── Showcase Image Section (Overlapping) ── */}
      <section className={styles.showcaseSection}>
        <picture>
          <source media="(max-width: 768px)" srcSet="/COULDB.png" />
          <img src="/COULDB.png" alt="Showcase" className={styles.showcaseBg} aria-hidden="true" />
        </picture>
      </section>

      {/* ── Consolidated Moments Wrapper ── */}
      <div className={styles.momentsWrapper} ref={momentsRef}>
        {/* ── Your Moments Section (Grid) ── */}
        <section className={styles.yourMomentsSection}>
          <h2 className={styles.yourMomentsText}>Your Moments</h2>

          <div className={styles.eventGrid}>
            {event_sections.map((section) => (
              <div key={section.id} className={styles.eventCard}>
                <Link to={`/event/${section.id}`} className={styles.carouselLink}>
                  <img 
                    src="/Frame.png" 
                    alt="Decorative frame" 
                    className={styles.carouselFrame} 
                    aria-hidden="true"
                  />
                  <div className={styles.carouselInfo}>
                    <h3 className={styles.carouselTitle}>{section.label}</h3>
                    <p className={styles.carouselCount}>{section.photo_count || 0} photos</p>
                    <span className={styles.clickNote}>Click to see photos</span>
                  </div>                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Perfect Moments — Masonry Grid ── */}
        <section className={styles.perfectMomentsSection}>
          <h2 className={styles.perfectMomentsText}>Perfect Moments</h2>
          
          <div className={styles.masonryGrid}>
            {perfectMoments.map((photo, i) => (
              <div key={photo.id || i} className={styles.masonryItem}>
                <img
                  src={photo.thumbnail_url || photo.url}
                  alt={`Perfect Moment ${i + 1}`}
                  loading="lazy"
                  className={styles.masonryImage}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Couple's Letter Section ── */}
        <section className={styles.letterSection}>
          <h2 className={styles.letterSectionText}>Couple&apos;s Latter</h2>
          
          <div className={styles.letterContainer}>
            <p className={styles.letterText}>
              <span className={styles.quoteMarkLeft}>“</span>
              To our dearest family and friends,
              <br /><br />
              Thank you for being part of our journey. From our first date to this incredible milestone, your love and support have meant the world to us. We are so thrilled to share the memories of our most special day with all the people who make our lives truly complete.
              <br /><br />
              With all our love,
              <br />
              {gallery.bride_name} & {gallery.groom_name}
              <span className={styles.quoteMarkRight}>”</span>
            </p>
          </div>
        </section>

        {/* ── Footer ── */}
        <Footer photographer={photographer} gallery={gallery} />
      </div>
    </div>
  );
}

// src/components/JikanPlaceholder.tsx
import styles from './JikanPlaceholder.module.css'; // CSS Modülünü import et

const JikanPlaceholder = () => {
  return (
    <div id="jikan-placeholder-content" className={styles.placeholderContainer}>
      {/* .left div'i kaldırıldı, doğrudan placeholderContainer kullanılacak */}
        <a href="https://patreon.com/jikan" target="_blank" rel="noopener noreferrer" className={styles.patreonBanner}>
          We rely on you! Support us on Patreon
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 7l-10 10"></path>
            <path d="M16 17l-9 0l0 -9"></path>
          </svg>
        </a>
        <div className={styles.headingGroup}>
          <h1>Jikan API</h1>
          <p>
            Jikan (時間) is an unofficial &amp; open-source API for the <strong>“most active online anime + manga community and database”</strong> — MyAnimeList.
          </p>
        </div>
        <div className={styles.infoDisplayGroup}>
          <a href="https://github.com/jikan-me/jikan-rest" target="_blank" rel="noopener noreferrer" className={styles.infoDisplay}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 13h5"></path><path d="M12 16v-8h3a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-3"></path><path d="M20 8v8"></path><path d="M9 16v-5.5a2.5 2.5 0 0 0 -5 0v5.5"></path>
            </svg>
            REST API
          </a>
          <a href="https://github.com/jikan-me/jikan" target="_blank" rel="noopener noreferrer" className={styles.infoDisplay}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 12m-10 0a10 9 0 1 0 20 0a10 9 0 1 0 -20 0"></path><path d="M5.5 15l.395 -1.974l.605 -3.026h1.32a1 1 0 0 1 .986 1.164l-.167 1a1 1 0 0 1 -.986 .836h-1.653"></path><path d="M15.5 15l.395 -1.974l.605 -3.026h1.32a1 1 0 0 1 .986 1.164l-.167 1a1 1 0 0 1 -.986 .836h-1.653"></path><path d="M12 7.5l-1 5.5"></path><path d="M11.6 10h2.4l-.5 3"></path>
            </svg>
            Parser API
          </a>
          <a href="#integrations" target="_self" className={styles.infoDisplay}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16.5l-5 -3l5 -3l5 3v5.5l-5 3z"></path><path d="M2 13.5v5.5l5 3"></path><path d="M7 16.545l5 -3.03"></path><path d="M17 16.5l-5 -3l5 -3l5 3v5.5l-5 3z"></path><path d="M12 19l5 3"></path><path d="M17 16.5l5 -3"></path><path d="M12 13.5v-5.5l-5 -3l5 -3l5 3v5.5"></path><path d="M7 5.03v5.455"></path><path d="M12 8l5 -3"></path>
            </svg>
            15+ Integrations
          </a>
          <a target="_self" className={styles.infoDisplay}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.17 6.159l2.316 -2.316a2.877 2.877 0 0 1 4.069 0l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.33 2.33"></path><path d="M14.931 14.948a2.863 2.863 0 0 1 -1.486 -.79l-.301 -.302l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.863 2.863 0 0 1 -.794 -1.504"></path><path d="M15 9h.01"></path><path d="M3 3l18 18"></path>
            </svg>
            Auth-less
          </a>
          <a href="https://discord.jikan.moe" target="_blank" rel="noopener noreferrer" className={styles.infoDisplay}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path><path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path><path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3"></path><path d="M7 16.5c3.5 1 6.5 1 10 0"></path>
            </svg>
            Community Support
          </a>
          <a target="_self" className={styles.infoDisplay}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19l16 0"></path><path d="M4 15l4 -6l4 2l4 -5l4 4"></path>
            </svg>
            100M+ requests / month
          </a>
        </div>
        <div className={styles.buttonGroup}>
          <a href="#features" target="_self" className={`${styles.button} ${styles.buttonPrimary}`}>Learn more</a>
          <a href="https://docs.api.jikan.moe/" target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.buttonSecondaryOutline}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 7l-10 10"></path>
              <path d="M16 17l-9 0l0 -9"></path>
            </svg>
            Get started
          </a>
        </div>
    </div>
  );
};

export default JikanPlaceholder;

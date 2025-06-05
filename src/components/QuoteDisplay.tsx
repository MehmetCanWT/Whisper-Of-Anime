// src/components/QuoteDisplay.tsx
import styles from './QuoteDisplay.module.css'; // Import the CSS Module

interface Props {
  quote: string;
  author: string;
  showName?: string; // Optional: if you want to display the anime name here too
}

const QuoteDisplay: React.FC<Props> = ({ quote, author, showName }) => {
  return (
    <>
      <h1 id="quote" className={styles.quoteText}>
        {quote}
      </h1>
      {author && (
        <h2 id="author" aria-live="polite" className={styles.authorText}>
          – {author}
        </h2>
      )}
      {/* The div with id="show" was in your original HTML but not actively used.
          If you want to use it to display the anime show name from the quote, you can.
          Otherwise, it can be removed from here and from page.tsx's quote-text div.
      */}
      {showName && (
         <div id="show" aria-live="polite" className={styles.showText}>
            From: {showName}
         </div>
      )}
    </>
  );
};

export default QuoteDisplay;

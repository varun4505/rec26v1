import React from "react";

export const AboutSection = () => {
  return (
    <>
      <section className="about-section">
        <h2 className="about-title font-array">About VinnovateIT</h2>
        <div className="about-content">
          <p>
            VinnovateIT is the official innovation and incubation lab of SITE
            School, VIT Vellore. To put it simply...we are the answer to the
            question &quot;What if Elon Musk and Albert Einstein had a brain
            child?&quot; We aim to be the one stop destination for all you
            curious cats and satisfy your hunger in the diverse world of
            computer science.
          </p>
        </div>
        <button className="cta-button secondary">Explore More</button>
      </section>

      <style jsx>{`
        /* --- Fonts --- */
        .font-array {
          font-family: var(--font-array), monospace;
        }

        /* --- Buttons --- */
        .cta-button.secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-radius: 9999px;
          font-family: var(--font-khand), sans-serif;
          line-height: 1;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.2s ease;
          opacity: 80%;
          cursor: pointer;
          border: none;
          position: relative;
          z-index: 5;
          text-decoration: none;
          text-transform: capitalize;
          background: linear-gradient(90deg, #ff9a5e 0%, #f86800 100%);
          color: #000;
          font-weight: 600;
          padding: 0.8rem 3.5rem;
          box-shadow: 0 4px 15px rgba(248, 104, 0, 0.2);
          font-size: 1.4rem;
        }
        .cta-button.secondary:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 10px 30px rgba(248, 104, 0, 0.4);
        }
        .cta-button.secondary:active {
          transform: scale(0.95);
        }

        /* --- About Section --- */
        .about-section {
          position: relative;
          z-index: 5;
          text-align: center;
          max-width: 900px;
          padding: 4rem 1.5rem;
        }

        .about-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin-bottom: 2rem;
          color: #000;
        }

        .about-content p {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          line-height: 1.6;
          color: #444;
          margin-bottom: 3rem;
          font-weight: 300;
        }
      `}</style>
    </>
  );
};

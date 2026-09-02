import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SplashScreen.css";
import logoTitle from "@/src/config/logoTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from 'react-helmet-async';
import { generateFAQSchema, generateCanonicalUrl, optimizeTitle } from "@/src/utils/seo.utils";

const FAQ_ITEMS = [
  {
    question: "Is Yokoso safe?",
    answer: "Yes, Yokoso is completely safe to use. We ensure all content is properly scanned and secured for our users."
  },
  {
    question: "What makes Yokoso the best site to watch anime free online?",
    answer: "Yokoso offers high-quality streaming, a vast library of anime, no intrusive ads, and a user-friendly interface - all completely free."
  },
  {
    question: "How do I request an anime?",
    answer: "You can submit anime requests through our contact form or by reaching out to our support team."
  }
];

function SplashScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleSearchSubmit = useCallback(() => {
    const trimmedSearch = search.trim();
    if (!trimmedSearch) return;
    const queryParam = encodeURIComponent(trimmedSearch);
    navigate(`/search?keyword=${queryParam}`);
  }, [search, navigate]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit]
  );

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqSchema = generateFAQSchema(FAQ_ITEMS);
  const canonicalUrl = generateCanonicalUrl('/');
  const pageTitle = optimizeTitle('Watch Anime Online Free | English Sub & Dub', false);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Yokoso is the best site to watch anime online for free. Stream thousands of English subbed and dubbed anime episodes in HD quality with no ads." />
        <meta name="keywords" content="yokoso, watch anime free, anime online sub dub, free anime streaming, no ads anime, best anime site" />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content="Watch high-quality anime online for free on Yokoso. No ads, daily updates, and a massive library of subbed and dubbed content." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content="Stream thousands of anime episodes for free in HD quality on Yokoso. The best ad-free experience for anime fans!" />

        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>
      <div className="splash-container">
        <div className="splash-overlay"></div>
        <div className="content-wrapper">
          <div className="logo-container">
            <img src="/yokoso-logo.svg" alt={logoTitle} className="logo" />
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search anime..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="search-button"
              onClick={handleSearchSubmit}
              aria-label="Search"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>

          <Link to="/home" className="enter-button">
            Enter Homepage <FontAwesomeIcon icon={faAngleRight} className="angle-icon" />
          </Link>

          <div className="faq-section">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <div className="faq-list">
              {FAQ_ITEMS.map((item, index) => (
                <div key={index} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{item.question}</span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`faq-toggle ${expandedFaq === index ? 'rotate' : ''}`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="faq-answer">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SplashScreen;

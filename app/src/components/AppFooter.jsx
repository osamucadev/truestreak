// app/src/components/AppFooter.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackModal from "./FeedbackModal";
import { APP_VERSION } from "../version";
import "./AppFooter.scss";

const AppFooter = () => {
  const navigate = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleFeedback = () => {
    setIsFeedbackOpen(true);
  };

  return (
    <>
      <footer className="app-footer">
        <div className="footer-content">
          <button className="footer-feedback" onClick={handleFeedback}>
            <span className="feedback-icon">💬</span>
            <span>Deixar Feedback</span>
          </button>

          <div className="footer-links">
            <a
              href="https://truestreak.life/privacidade"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacidade
            </a>
            <span className="separator">•</span>
            <a
              href="https://truestreak.life/termos"
              target="_blank"
              rel="noopener noreferrer"
            >
              Termos
            </a>
          </div>

          <div className="footer-meta">
            <p className="footer-version">v{APP_VERSION}</p>
            <p className="footer-credit">
              Feito com <span className="heart">💜</span> por Samuel
            </p>
          </div>
        </div>
      </footer>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
};

export default AppFooter;

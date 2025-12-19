import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Clock, Database, BookOpen } from 'lucide-react';

const AlgorithmInfo = ({ title, definition, complexity, hints, staticVisual }) => {
  return (
    <div className="algo-info-container">
      <div className="info-grid">
        {/* Definition Column */}
        <motion.div 
          className="info-card glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-header">
            <BookOpen size={20} className="icon" />
            <h3>Definition</h3>
          </div>
          <p>{definition}</p>
        </motion.div>

        {/* Complexity Column */}
        <motion.div 
          className="info-card glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <Clock size={20} className="icon" />
            <h3>Complexity</h3>
          </div>
          
          <div className="complexity-section">
            <h4 className="sub-header">Time Complexity</h4>
            <div className="complexity-grid">
                <div className="complexity-item">
                <span className="label">Best:</span>
                <span className="value">{complexity.time.best}</span>
                </div>
                <div className="complexity-item">
                <span className="label">Average:</span>
                <span className="value">{complexity.time.average}</span>
                </div>
                <div className="complexity-item">
                <span className="label">Worst:</span>
                <span className="value">{complexity.time.worst}</span>
                </div>
            </div>
          </div>

          <div className="complexity-section">
            <h4 className="sub-header">Space Complexity</h4>
            <div className="complexity-item large">
                <span className="value">{complexity.space}</span>
            </div>
          </div>
        </motion.div>

        {/* Hints - Full Width */}
        <motion.div 
          className="info-card glass-panel full-width"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-header">
            <Lightbulb size={20} className="icon" />
            <h3>Hints & Key Concepts</h3>
          </div>
          <ul className="hints-list">
            {hints.map((hint, idx) => (
              <li key={idx}>{hint}</li>
            ))}
          </ul>
        </motion.div>
        
        {/* Static Visual - Full Width */}
        {staticVisual && (
             <motion.div 
                className="info-card glass-panel full-width"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h3>Visual Explanation</h3>
                <div className="static-visual-wrapper">
                    {staticVisual}
                </div>
            </motion.div>
        )}
      </div>

      <style jsx="true">{`
        .algo-info-container {
          width: 100%;
          margin-top: 40px;
          padding-bottom: 40px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr; /* 2 Equal Columns */
          gap: 20px;
        }

        @media (max-width: 768px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
        }

        .info-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%; /* Match height */
        }

        .info-card.full-width {
          grid-column: 1 / -1;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--accent-primary);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .sub-header {
            font-size: 0.9rem;
            color: var(--text-muted);
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .complexity-section {
            margin-bottom: 16px;
        }

        .icon {
          color: var(--accent-primary);
        }

        h3 {
          font-size: 1.1rem;
          margin: 0;
        }

        p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .complexity-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .complexity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono);
        }

        .complexity-item.large {
            justify-content: flex-start;
            font-size: 1.2rem;
            color: var(--text-primary);
        }

        .label {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .value {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .hints-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .hints-list li {
          position: relative;
          padding-left: 24px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .hints-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--accent-secondary);
          font-size: 1.2rem;
          line-height: 1;
        }
        
        .static-visual-wrapper {
            margin-top: 10px;
            display: flex;
            justify-content: center;
            width: 100%;
            overflow-x: auto;
        }
      `}</style>
    </div>
  );
};

export default AlgorithmInfo;

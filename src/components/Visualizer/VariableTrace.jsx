import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VariableTrace = ({ variables }) => {
  return (
    <div className="variable-trace glass-panel">
      <h3>Dry Run / Trace</h3>
      <div className="vars-container">
        <AnimatePresence>
          {Object.entries(variables).map(([name, value]) => (
            <motion.div 
              key={name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="var-item"
            >
              <span className="var-name">{name}</span>
              <span className="var-separator">=</span>
              <span className="var-value">{value}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style jsx="true">{`
        .variable-trace {
          padding: 16px;
          min-width: 250px;
          background: rgba(0, 0, 0, 0.3);
        }

        h3 {
          font-size: 1rem;
          color: var(--accent-secondary);
          margin-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
        }

        .vars-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-family: var(--font-mono);
        }

        .var-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
        }

        .var-name {
          color: var(--accent-primary);
        }

        .var-separator {
          color: var(--text-muted);
        }

        .var-value {
          color: var(--text-primary);
          word-break: break-all;
        }
      `}</style>
    </div>
  );
};

export default VariableTrace;

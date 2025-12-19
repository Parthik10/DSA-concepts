import React from 'react';
import { motion } from 'framer-motion';

const CodeTrace = ({ code, activeLine, markers = {} }) => {
  return (
    <div className="code-trace glass-panel">
      <pre>
        <code>
          {code.split('\n').map((line, idx) => {
            const lineNumber = idx + 1;
            const isActive = activeLine === lineNumber;
            const marker = markers[lineNumber];

            return (
              <motion.div
                key={lineNumber}
                className={`code-line ${isActive ? 'active' : ''}`}
                initial={false}
                animate={{
                  backgroundColor: isActive ? 'rgba(0, 255, 157, 0.1)' : 'transparent',
                }}
              >
                <span className="line-number">{lineNumber}</span>
                <span className="line-content">{line}</span>
                {marker && <span className="line-marker">{marker}</span>}
              </motion.div>
            );
          })}
        </code>
      </pre>

      <style jsx="true">{`
        .code-trace {
          padding: 16px;
          font-family: var(--font-mono);
          font-size: 0.9rem;
          overflow-x: auto;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          min-width: 300px;
        }

        .code-line {
          display: flex;
          padding: 2px 8px;
          border-radius: 4px;
          position: relative;
        }

        .code-line.active {
          border-left: 2px solid var(--accent-primary);
        }

        .line-number {
          color: var(--text-muted);
          width: 24px;
          flex-shrink: 0;
          user-select: none;
        }

        .line-content {
          color: var(--text-secondary);
          white-space: pre;
        }

        .code-line.active .line-content {
          color: var(--text-primary);
        }

        .line-marker {
          margin-left: auto;
          color: var(--accent-secondary);
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default CodeTrace;

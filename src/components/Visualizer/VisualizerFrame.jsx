import React from 'react';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VisualizerFrame = ({
  title,
  children,
  dataSize,
  setDataSize,
  onRun,
  onReset,
  isRunning,
  isTLE,
  // New props for trace
  codeTrace,
  variableTrace
}) => {
  return (
    <div className="visualizer-frame">
      <header className="viz-header glass-panel">
        <div className="header-left">
          <h2>{title}</h2>
        </div>

        <div className="controls">
          <div className="control-group">
            <label>Data Size: {dataSize}</label>
            <select 
              value={dataSize} 
              onChange={(e) => setDataSize(parseInt(e.target.value))}
              disabled={isRunning}
              className="size-select"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="actions">
            <button 
              className="btn btn-secondary" 
              onClick={onReset}
              disabled={isRunning}
            >
              <RotateCcw size={18} />
              Reset
            </button>
            <button 
              className="btn btn-primary" 
              onClick={onRun}
              disabled={isRunning}
            >
              <Play size={18} />
              Run
            </button>
          </div>
        </div>
      </header>

      <div className="viz-content-wrapper">
        <div className="viz-canvas-container glass-panel">
          {children}
          
          <AnimatePresence>
            {isTLE && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="tle-alert"
              >
                <AlertTriangle size={24} />
                <div>
                  <h3>Time Limit Exceeded</h3>
                  <p>The algorithm took too long to execute.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {(codeTrace || variableTrace) && (
          <div className="viz-trace-container">
            {codeTrace}
            {variableTrace}
          </div>
        )}
      </div>

      <style jsx="true">{`
        .visualizer-frame {
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
        }

        .viz-header {
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        h2 {
          font-size: 1.5rem;
          color: var(--accent-primary);
        }

        .controls {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .control-group label {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .size-select {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: 6px;
          outline: none;
          cursor: pointer;
        }

        .actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-main);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: var(--accent-primary);
          color: #000;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }

        .viz-content-wrapper {
          display: flex;
          gap: 20px;
          flex: 1;
          min-height: 0; /* Important for scroll */
        }

        .viz-canvas-container {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 40px;
        }

        .viz-trace-container {
          width: 350px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .tle-alert {
          position: absolute;
          bottom: 30px;
          right: 30px;
          background: rgba(255, 77, 77, 0.15);
          border: 1px solid var(--accent-error);
          padding: 16px 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: var(--accent-error);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
};

export default VisualizerFrame;

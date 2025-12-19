import React from 'react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="welcome-card glass-panel"
      >
        <h1>Welcome to DSA Visualizer</h1>
        <p>Select a topic from the sidebar to start visualizing algorithms.</p>
      </motion.div>

      <style jsx="true">{`
        .dashboard {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .welcome-card {
          padding: 40px;
          text-align: center;
          max-width: 600px;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 16px;
          background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

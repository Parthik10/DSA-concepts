import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Search, Code2, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const topics = [
  {
    id: 'searching',
    label: 'Searching',
    subtopics: [
      { id: 'linear-search', label: 'Linear Search' },
      { id: 'binary-search', label: 'Binary Search' },
    ]
  },
  {
    id: 'sorting',
    label: 'Sorting',
    subtopics: [
      { id: 'bubble-sort', label: 'Bubble Sort' },
      { id: 'insertion-sort', label: 'Insertion Sort' },
      { id: 'selection-sort', label: 'Selection Sort' },
      { id: 'quick-sort', label: 'Quick Sort' },
      { id: 'merge-sort', label: 'Merge Sort' },
      { id: 'heap-sort', label: 'Heap Sort' },
      { id: 'counting-sort', label: 'Counting Sort' },
      { id: 'bucket-sort', label: 'Bucket Sort' },
    ]
  },
  { id: 'linked-list', label: 'Linked List' },
  { id: 'recursion', label: 'Recursion' },
  { id: 'backtracking', label: 'Backtracking' },
  { id: 'stack', label: 'Stack' },
  { id: 'queue', label: 'Queue' },
  { id: 'sliding-window', label: 'Sliding Window' },
  { id: 'two-pointers', label: 'Two Pointers' },
  { id: 'heaps', label: 'Heaps' },
  { id: 'greedy', label: 'Greedy' },
  { id: 'bst', label: 'Binary Search Tree' },
  { id: 'graphs', label: 'Graphs' },
  { id: 'dp', label: 'Dynamic Programming' },
  { id: 'tries', label: 'Tries' },
  { id: 'segment-tree', label: 'Segment Tree' },
  { id: 'fenwick-tree', label: 'Fenwick Tree' },
];

const Sidebar = () => {
  const [expandedTopics, setExpandedTopics] = useState(['searching', 'sorting']); // Default expanded
  const location = useLocation();

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo flex-center">
          <Code2 size={28} color="var(--accent-primary)" />
          <span className="logo-text">DSA Viz</span>
        </div>
        <div className="search-bar flex-center">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search topics..." />
        </div>
      </div>

      <nav className="sidebar-nav">
        {topics.map((topic) => {
          const isExpanded = expandedTopics.includes(topic.id);
          const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;

          return (
            <div key={topic.id} className="nav-group">
              {hasSubtopics ? (
                <>
                  <button 
                    className={`nav-item parent ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleTopic(topic.id)}
                  >
                    <span className="label">{topic.label}</span>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="subnav"
                      >
                        {topic.subtopics.map(sub => (
                          <NavLink
                            key={sub.id}
                            to={`/topic/${topic.id}/${sub.id}`}
                            className={({ isActive }) =>
                              `nav-item sub ${isActive ? 'active' : ''}`
                            }
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <NavLink
                  to={`/topic/${topic.id}`}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  {topic.label}
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>

      <style jsx="true">{`
        .sidebar {
          width: 280px;
          height: 100vh;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 10;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .logo {
          gap: 12px;
          margin-bottom: 20px;
          justify-content: flex-start;
        }

        .logo-text {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }

        .search-bar {
          background: var(--bg-tertiary);
          border-radius: 8px;
          padding: 8px 12px;
          gap: 10px;
          border: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .search-bar:focus-within {
          border-color: var(--accent-primary);
        }

        .search-bar input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          width: 100%;
          outline: none;
          font-size: 0.9rem;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-group {
          display: flex;
          flex-direction: column;
        }

        .nav-item {
          padding: 12px 16px;
          border-radius: 8px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: none;
          background: transparent;
          width: 100%;
          cursor: pointer;
          text-align: left;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: rgba(0, 255, 157, 0.1);
          color: var(--accent-primary);
          font-weight: 500;
        }

        .nav-item.parent {
          font-weight: 600;
          color: var(--text-primary);
        }

        .subnav {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-item.sub {
          padding-left: 32px;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .nav-item.sub:hover {
          color: var(--text-primary);
        }

        .nav-item.sub.active {
          color: var(--accent-primary);
          background: transparent; /* Sub-items don't need background highlight usually, or maybe subtle */
        }
        
        .nav-item.sub.active::before {
          content: '';
          position: absolute;
          left: 12px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent-primary);
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;

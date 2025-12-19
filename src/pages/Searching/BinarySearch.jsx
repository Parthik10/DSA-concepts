import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VisualizerFrame from '../../components/Visualizer/VisualizerFrame';
import CodeTrace from '../../components/Visualizer/CodeTrace';
import VariableTrace from '../../components/Visualizer/VariableTrace';
import AlgorithmInfo from '../../components/Visualizer/AlgorithmInfo';
import useVisualizer from '../../hooks/useVisualizer';

const BINARY_SEARCH_CODE = `let left = 0, right = n - 1;
while (left <= right) {
  let mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) left = mid + 1;
  else right = mid - 1;
}
return -1;`;

const binarySearchAlgo = (initialData, target) => {
  let arr = [...initialData];
  const steps = [];
  let n = arr.length;
  let left = 0;
  let right = n - 1;

  steps.push({
    array: [...arr],
    line: 1,
    vars: { left, right, mid: '?', target },
    markers: { [left]: 'L', [right]: 'R' }
  });

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    steps.push({
      array: [...arr],
      line: 3,
      vars: { left, right, mid, 'arr[mid]': arr[mid], target },
      markers: { [left]: 'L', [right]: 'R', [mid]: 'Mid' }
    });

    if (arr[mid] === target) {
      steps.push({
        array: [...arr],
        line: 4,
        vars: { left, right, mid, 'arr[mid]': arr[mid], result: 'FOUND' },
        markers: { [mid]: 'Found' }
      });
      return steps;
    }

    if (arr[mid] < target) {
      steps.push({
        array: [...arr],
        line: 5,
        vars: { left, right, mid, 'arr[mid]': arr[mid], action: 'left = mid + 1' },
        markers: { [left]: 'L', [right]: 'R', [mid]: 'Mid' }
      });
      left = mid + 1;
    } else {
      steps.push({
        array: [...arr],
        line: 6,
        vars: { left, right, mid, 'arr[mid]': arr[mid], action: 'right = mid - 1' },
        markers: { [left]: 'L', [right]: 'R', [mid]: 'Mid' }
      });
      right = mid - 1;
    }
  }

  steps.push({
    array: [...arr],
    line: 8,
    vars: { result: 'NOT FOUND' },
    markers: {}
  });

  return steps;
};

const BinarySearch = () => {
  const {
    data,
    dataSize,
    setDataSize,
    isRunning,
    isTLE,
    run,
    reset,
    activeLine,
    traceVars,
    markers
  } = useVisualizer(10);

  const [target, setTarget] = useState(45);
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    setSortedData([...data].sort((a, b) => a - b));
  }, [data]);

  const handleRun = () => {
    run((_) => binarySearchAlgo(sortedData, target));
  };

  const displayData = isRunning ? data : sortedData;

  return (
    <div className="page-container">
        <VisualizerFrame
        title="Binary Search"
        dataSize={dataSize}
        setDataSize={setDataSize}
        onRun={handleRun}
        onReset={reset}
        isRunning={isRunning}
        isTLE={isTLE}
        codeTrace={<CodeTrace code={BINARY_SEARCH_CODE} activeLine={activeLine} />}
        variableTrace={
            <div>
            <div style={{ marginBottom: 10, padding: 10 }} className="glass-panel">
                <label style={{ marginRight: 10, color: 'var(--text-secondary)' }}>Target:</label>
                <input 
                type="number" 
                value={target} 
                onChange={(e) => setTarget(parseInt(e.target.value))}
                style={{ 
                    background: 'var(--bg-tertiary)', 
                    border: '1px solid var(--border-color)', 
                    color: 'var(--text-primary)',
                    padding: '4px 8px',
                    borderRadius: 4,
                    width: 60
                }}
                />
            </div>
            <VariableTrace variables={traceVars} />
            </div>
        }
        >
        <div className="array-container">
            {displayData.map((value, idx) => (
            <motion.div
                key={idx}
                layout
                className="array-item"
                initial={false}
                animate={{
                backgroundColor: markers[idx] === 'Found' ? 'var(--accent-primary)' : 
                                markers[idx] === 'Mid' ? 'var(--accent-secondary)' : 
                                (idx >= traceVars.left && idx <= traceVars.right) ? 'var(--bg-tertiary)' : 'rgba(255,255,255,0.05)',
                borderColor: markers[idx] ? 'var(--accent-primary)' : 'var(--border-color)',
                opacity: (isRunning && (idx < traceVars.left || idx > traceVars.right)) ? 0.3 : 1,
                color: markers[idx] === 'Found' ? '#000' : 'var(--text-primary)'
                }}
            >
                <span className="value">{value}</span>
                <span className="index">{idx}</span>
                {markers[idx] && (
                <motion.div 
                    className="marker"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: markers[idx] === 'Found' ? '#000' : 'var(--accent-primary)' }}
                >
                    {markers[idx]}
                </motion.div>
                )}
            </motion.div>
            ))}
        </div>
        </VisualizerFrame>

        <AlgorithmInfo 
            title="Binary Search"
            definition="Binary Search is a search algorithm that finds the position of a target value within a sorted array. Binary search compares the target value to the middle element of the array."
            complexity={{
                time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
                space: 'O(1)'
            }}
            hints={[
                "Data MUST be sorted.",
                "Divide and Conquer approach.",
                "Eliminates half the search space in each step.",
                "Much faster than Linear Search for large datasets."
            ]}
            staticVisual={
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: 30, padding: '20px 0' }}>
                    {/* Step 1 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {[-5, -2, 0, 1, 2, 4, 5, 6, 7, 10].map((val, idx) => (
                                <div key={idx} style={{ position: 'relative', width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx === 0 || idx === 9 ? 'rgba(100, 100, 255, 0.1)' : idx === 4 ? 'rgba(255, 255, 0, 0.1)' : 'var(--bg-tertiary)' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{val}</span>
                                    <span style={{ position: 'absolute', top: -20, fontSize: '0.7rem', color: 'var(--text-muted)' }}>{idx}</span>
                                    {idx === 0 && <span style={{ position: 'absolute', bottom: -20, fontSize: '0.7rem', fontWeight: 'bold' }}>Low</span>}
                                    {idx === 4 && <span style={{ position: 'absolute', bottom: -20, fontSize: '0.7rem', fontWeight: 'bold' }}>Middle</span>}
                                    {idx === 9 && <span style={{ position: 'absolute', bottom: -20, fontSize: '0.7rem', fontWeight: 'bold' }}>High</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {[-5, -2, 0, 1, 2, 4, 5, 6, 7, 10].map((val, idx) => (
                                <div key={idx} style={{ position: 'relative', width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx < 5 ? '#222' : idx === 5 ? 'rgba(100, 100, 255, 0.1)' : idx === 7 ? 'rgba(255, 255, 0, 0.1)' : idx === 9 ? 'rgba(100, 100, 255, 0.1)' : 'var(--bg-tertiary)', opacity: idx < 5 ? 0.3 : 1 }}>
                                    <span style={{ fontSize: '0.9rem' }}>{val}</span>
                                    {idx === 5 && <span style={{ position: 'absolute', bottom: -20, fontSize: '0.7rem', fontWeight: 'bold' }}>Low</span>}
                                    {idx === 7 && <span style={{ position: 'absolute', bottom: -20, fontSize: '0.7rem', fontWeight: 'bold' }}>Middle</span>}
                                    {idx === 9 && <span style={{ position: 'absolute', bottom: -20, fontSize: '0.7rem', fontWeight: 'bold' }}>High</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {[-5, -2, 0, 1, 2, 4, 5, 6, 7, 10].map((val, idx) => (
                                <div key={idx} style={{ position: 'relative', width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx < 5 ? '#222' : idx === 8 ? 'var(--accent-primary)' : 'var(--bg-tertiary)', opacity: idx < 5 ? 0.3 : 1, color: idx === 8 ? '#000' : 'var(--text-primary)' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{val}</span>
                                    {idx === 8 && <div style={{ position: 'absolute', bottom: -35, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>Low</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>Middle</span>
                                    </div>}
                                    {idx === 9 && <span style={{ position: 'absolute', bottom: -20, fontSize: '0.7rem', fontWeight: 'bold' }}>High</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        />

        <style jsx="true">{`
            .page-container {
                display: flex;
                flex-direction: column;
                gap: 20px;
                width: 100%;
                max-width: 1200px;
                margin: 0 auto;
            }

            .array-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding: 20px;
            }

            .array-item {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            background: var(--bg-tertiary);
            position: relative;
            font-weight: 600;
            color: var(--text-primary);
            }

            .index {
            position: absolute;
            bottom: -20px;
            font-size: 0.7rem;
            color: var(--text-muted);
            }

            .marker {
            position: absolute;
            top: -25px;
            font-size: 0.8rem;
            font-weight: bold;
            white-space: nowrap;
            }
        `}</style>
    </div>
  );
};

export default BinarySearch;

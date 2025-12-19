import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VisualizerFrame from '../../components/Visualizer/VisualizerFrame';
import CodeTrace from '../../components/Visualizer/CodeTrace';
import VariableTrace from '../../components/Visualizer/VariableTrace';
import AlgorithmInfo from '../../components/Visualizer/AlgorithmInfo';
import useVisualizer from '../../hooks/useVisualizer';

const LINEAR_SEARCH_CODE = `for (let i = 0; i < n; i++) {
  if (arr[i] === target) {
    return i; // Found
  }
}
return -1; // Not Found`;

const linearSearchAlgo = (initialData, target) => {
  let arr = [...initialData];
  const steps = [];
  let n = arr.length;
  
  steps.push({
    array: [...arr],
    line: 1,
    vars: { i: 0, n, target },
    markers: {}
  });

  for (let i = 0; i < n; i++) {
    steps.push({
      array: [...arr],
      line: 2,
      vars: { i, 'arr[i]': arr[i], target },
      markers: { [i]: '?' }
    });

    if (arr[i] === target) {
      steps.push({
        array: [...arr],
        line: 3,
        vars: { i, 'arr[i]': arr[i], target, result: 'FOUND' },
        markers: { [i]: 'Found' }
      });
      
      // Final Found State
      steps.push({
        array: [...arr],
        line: 3,
        vars: { status: 'Found', index: i },
        markers: { [i]: 'Found' }
      });
      return steps;
    } else {
       steps.push({
        array: [...arr],
        line: 2,
        vars: { i, 'arr[i]': arr[i], target, result: 'Not Match' },
        markers: { [i]: 'X' }
      });
    }
  }

  steps.push({
    array: [...arr],
    line: 5,
    vars: { result: 'NOT FOUND' },
    markers: {}
  });

  return steps;
};

const LinearSearch = () => {
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

  const [target, setTarget] = useState(45); // Default target

  const handleRun = () => {
    // Pass wrapper to inject target
    run((d) => linearSearchAlgo(d, target));
  };

  const isFound = traceVars.status === 'Found';

  return (
    <div className="page-container">
        <VisualizerFrame
        title="Linear Search"
        dataSize={dataSize}
        setDataSize={setDataSize}
        onRun={handleRun}
        onReset={reset}
        isRunning={isRunning}
        isTLE={isTLE}
        codeTrace={<CodeTrace code={LINEAR_SEARCH_CODE} activeLine={activeLine} />}
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
            {data.map((value, idx) => (
            <motion.div
                key={idx}
                layout
                className="array-item"
                initial={false}
                animate={{
                backgroundColor: markers[idx] === 'Found' ? 'var(--accent-primary)' : 
                                markers[idx] === 'X' ? 'rgba(255, 77, 77, 0.2)' : 'var(--bg-tertiary)',
                borderColor: markers[idx] === 'Found' ? 'var(--accent-primary)' : 
                            markers[idx] === 'X' ? 'var(--accent-error)' : 'var(--border-color)',
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
                    style={{ color: markers[idx] === 'X' ? 'var(--accent-error)' : 'var(--accent-primary)' }}
                >
                    {markers[idx]}
                </motion.div>
                )}
            </motion.div>
            ))}
        </div>
        </VisualizerFrame>

        <AlgorithmInfo 
            title="Linear Search"
            definition="Linear Search is the simplest searching algorithm that checks every element in the list sequentially until the target element is found or the list ends."
            complexity={{
                time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
                space: 'O(1)'
            }}
            hints={[
                "Checks each element one by one.",
                "Does not require the array to be sorted.",
                "Simple but inefficient for large datasets."
            ]}
            staticVisual={
                <div style={{ width: '100%', maxWidth: '600px', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ alignSelf: 'flex-start', marginBottom: 30, fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500, marginLeft: 20 }}>Find '20'</div>
                    <div style={{ position: 'relative', display: 'flex', gap: 10, justifyContent: 'center' }}>
                        {/* Arrows SVG Overlay */}
                        <svg style={{ position: 'absolute', top: -35, left: 0, width: '100%', height: 40, pointerEvents: 'none', overflow: 'visible' }}>
                            <defs>
                                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                    <path d="M0,0 L8,3 L0,6" fill="var(--text-primary)" />
                                </marker>
                            </defs>
                            {/* Curved arrows for indices 0 to 6 */}
                            {[0, 1, 2, 3, 4, 5].map(i => {
                                const boxWidth = 40;
                                const gap = 10;
                                const startX = (i * (boxWidth + gap)) + (boxWidth / 2);
                                const endX = ((i + 1) * (boxWidth + gap)) + (boxWidth / 2);
                                return (
                                    <path 
                                        key={i}
                                        d={`M ${startX} 15 Q ${(startX+endX)/2} -10 ${endX} 15`}
                                        fill="none"
                                        stroke="var(--text-primary)"
                                        strokeWidth="1.5"
                                        markerEnd={i === 5 ? "url(#arrowhead)" : ""}
                                    />
                                );
                            })}
                        </svg>

                        {[10, 15, 30, 70, 80, 60, 20, 90, 40].map((val, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40 }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 5 }}>{idx}</span>
                                <div style={{ 
                                    width: 40, 
                                    height: 40, 
                                    border: `1px solid ${idx === 6 ? 'var(--accent-primary)' : 'var(--border-color)'}`, 
                                    borderRadius: 4,
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    background: idx === 6 ? 'rgba(0, 255, 157, 0.2)' : 'var(--bg-tertiary)',
                                    color: idx === 6 ? 'var(--accent-primary)' : 'var(--text-primary)',
                                    fontWeight: 'bold'
                                }}>
                                    {val}
                                </div>
                            </div>
                        ))}
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

export default LinearSearch;

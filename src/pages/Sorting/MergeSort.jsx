import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerFrame from '../../components/Visualizer/VisualizerFrame';
import CodeTrace from '../../components/Visualizer/CodeTrace';
import VariableTrace from '../../components/Visualizer/VariableTrace';
import AlgorithmInfo from '../../components/Visualizer/AlgorithmInfo';
import useVisualizer from '../../hooks/useVisualizer';

const MERGE_SORT_CODE = `function mergeSort(arr, left, right) {
  if (left >= right) return;
  let mid = Math.floor((left + right) / 2);
  mergeSort(arr, left, mid);
  mergeSort(arr, mid + 1, right);
  merge(arr, left, mid, right);
}

function merge(arr, left, mid, right) {
  let temp = [];
  let i = left, j = mid + 1;
  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) temp.push(arr[i++]);
    else temp.push(arr[j++]);
  }
  while (i <= mid) temp.push(arr[i++]);
  while (j <= right) temp.push(arr[j++]);
  for (let k = 0; k < temp.length; k++) {
    arr[left + k] = temp[k];
  }
}`;

const mergeSortAlgo = (initialData) => {
  let arr = [...initialData];
  const steps = [];
  
  const merge = (left, mid, right) => {
    let temp = [];
    let i = left;
    let j = mid + 1;
    
    steps.push({
      array: [...arr],
      line: 12,
      vars: { left, mid, right, i, j, action: 'Merge Start' },
      markers: { [left]: 'L', [mid]: 'M', [right]: 'R' },
      auxArray: []
    });

    while (i <= mid && j <= right) {
      steps.push({
        array: [...arr],
        line: 14,
        vars: { left, mid, right, i, j, 'arr[i]': arr[i], 'arr[j]': arr[j] },
        markers: { [i]: 'i', [j]: 'j' },
        auxArray: [...temp]
      });

      if (arr[i] <= arr[j]) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }
      
      steps.push({
        array: [...arr],
        line: 15, // or 16
        vars: { left, mid, right, i, j, action: 'Push to Temp' },
        markers: { [i]: 'i', [j]: 'j' },
        auxArray: [...temp]
      });
    }
    while (i <= mid) {
        temp.push(arr[i++]);
        steps.push({
            array: [...arr],
            line: 19,
            vars: { left, mid, right, i, j, action: 'Push Remaining Left' },
            markers: { [i-1]: 'Push' },
            auxArray: [...temp]
        });
    }
    while (j <= right) {
        temp.push(arr[j++]);
        steps.push({
            array: [...arr],
            line: 20,
            vars: { left, mid, right, i, j, action: 'Push Remaining Right' },
            markers: { [j-1]: 'Push' },
            auxArray: [...temp]
        });
    }

    // Copy back
    for (let k = 0; k < temp.length; k++) {
      arr[left + k] = temp[k];
      steps.push({
        array: [...arr],
        line: 21,
        vars: { left, mid, right, k, val: temp[k], action: 'Copy Back' },
        markers: { [left + k]: 'Update' },
        auxArray: [...temp]
      });
    }
    
    // Clear aux array after merge is done
     steps.push({
        array: [...arr],
        line: 23,
        vars: { left, mid, right, action: 'Merge Complete' },
        markers: {},
        auxArray: []
      });
  };

  const mergeSort = (left, right) => {
    if (left >= right) return;
    
    let mid = Math.floor((left + right) / 2);
    
    steps.push({
      array: [...arr],
      line: 3,
      vars: { left, right, mid, action: 'Divide' },
      markers: { [left]: 'L', [right]: 'R', [mid]: 'Mid' },
      auxArray: []
    });

    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  };

  mergeSort(0, arr.length - 1);
  
  steps.push({
    array: [...arr],
    line: 1, // Done
    vars: { status: 'Sorted' },
    markers: {},
    auxArray: []
  });

  return steps;
};

const MergeSort = () => {
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
    markers,
    auxArray
  } = useVisualizer(10);

  const handleRun = () => {
    run(mergeSortAlgo);
  };

  const isSorted = traceVars.status === 'Sorted';

  return (
    <div className="page-container">
        <VisualizerFrame
        title="Merge Sort"
        dataSize={dataSize}
        setDataSize={setDataSize}
        onRun={handleRun}
        onReset={reset}
        isRunning={isRunning}
        isTLE={isTLE}
        codeTrace={<CodeTrace code={MERGE_SORT_CODE} activeLine={activeLine} />}
        variableTrace={<VariableTrace variables={traceVars} />}
        >
        <div className="viz-container">
            <div className="array-container main-array">
                {data.map((value, idx) => (
                <motion.div
                    key={idx}
                    layout
                    className="array-item"
                    initial={false}
                    animate={{
                    backgroundColor: isSorted ? 'var(--accent-primary)' :
                                    markers[idx] === 'Update' ? 'var(--accent-secondary)' : 
                                    (idx >= traceVars.left && idx <= traceVars.right) ? 'var(--bg-tertiary)' : 'rgba(255,255,255,0.05)',
                    borderColor: isSorted ? 'var(--accent-primary)' :
                                 markers[idx] ? 'var(--accent-primary)' : 'var(--border-color)',
                    scale: markers[idx] === 'Update' ? 1.1 : 1,
                    color: isSorted ? '#000' : 'var(--text-primary)'
                    }}
                >
                    <span className="value">{value}</span>
                    <span className="index">{idx}</span>
                    {markers[idx] && (
                    <motion.div 
                        className="marker"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {markers[idx]}
                    </motion.div>
                    )}
                </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {auxArray && auxArray.length > 0 && (
                    <motion.div 
                        className="aux-array-wrapper"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <h4>Auxiliary Array (Temp)</h4>
                        <div className="array-container aux-array">
                            {auxArray.map((value, idx) => (
                                <motion.div
                                    key={`aux-${idx}`}
                                    layout
                                    className="array-item aux-item"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    <span className="value">{value}</span>
                                    <span className="index">{idx}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </VisualizerFrame>

        <AlgorithmInfo 
            title="Merge Sort"
            definition="Merge Sort is a divide-and-conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves. The merge() function is used for merging two halves."
            complexity={{
                time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
                space: 'O(n)'
            }}
            hints={[
                "Divide and Conquer strategy.",
                "Recursive division until single elements.",
                "Merge step combines sorted subarrays.",
                "Requires extra space for the auxiliary array."
            ]}
            staticVisual={
                <div style={{ width: '100%', maxWidth: '800px', padding: '20px 0' }}>
                    <svg viewBox="0 0 800 500" width="100%" height="auto" style={{ overflow: 'visible' }}>
                        <defs>
                            <marker id="arrowhead-ms" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="var(--border-color)" />
                            </marker>
                        </defs>

                        {/* Level 0: [38, 27, 43, 10] */}
                        <g transform="translate(400, 40)">
                            <g transform="translate(-70, -20)"> {/* 4 * 35 = 140. Center 70 */}
                                {[38, 27, 43, 10].map((val, idx) => (
                                    <g key={idx} transform={`translate(${idx * 35}, 0)`}>
                                        <rect width="35" height="35" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                        <text x="17.5" y="22" textAnchor="middle" fill="var(--text-primary)" fontSize="14">{val}</text>
                                    </g>
                                ))}
                            </g>
                        </g>

                        {/* Arrows L0 -> L1 */}
                        <path d="M 400 60 L 250 120" stroke="var(--border-color)" strokeWidth="1.5" markerEnd="url(#arrowhead-ms)" fill="none" />
                        <path d="M 400 60 L 550 120" stroke="var(--border-color)" strokeWidth="1.5" markerEnd="url(#arrowhead-ms)" fill="none" />

                        {/* Level 1 Left: [38, 27] */}
                        <g transform="translate(250, 140)">
                            <g transform="translate(-35, -20)">
                                {[38, 27].map((val, idx) => (
                                    <g key={idx} transform={`translate(${idx * 35}, 0)`}>
                                        <rect width="35" height="35" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                        <text x="17.5" y="22" textAnchor="middle" fill="var(--text-primary)" fontSize="14">{val}</text>
                                    </g>
                                ))}
                            </g>
                        </g>

                        {/* Level 1 Right: [43, 10] */}
                        <g transform="translate(550, 140)">
                            <g transform="translate(-35, -20)">
                                {[43, 10].map((val, idx) => (
                                    <g key={idx} transform={`translate(${idx * 35}, 0)`}>
                                        <rect width="35" height="35" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                        <text x="17.5" y="22" textAnchor="middle" fill="var(--text-primary)" fontSize="14">{val}</text>
                                    </g>
                                ))}
                            </g>
                        </g>

                        {/* Arrows L1 -> L2 */}
                        <path d="M 250 160 L 180 220" stroke="var(--border-color)" strokeWidth="1.5" markerEnd="url(#arrowhead-ms)" fill="none" />
                        <path d="M 250 160 L 320 220" stroke="var(--border-color)" strokeWidth="1.5" markerEnd="url(#arrowhead-ms)" fill="none" />
                        <path d="M 550 160 L 480 220" stroke="var(--border-color)" strokeWidth="1.5" markerEnd="url(#arrowhead-ms)" fill="none" />
                        <path d="M 550 160 L 620 220" stroke="var(--border-color)" strokeWidth="1.5" markerEnd="url(#arrowhead-ms)" fill="none" />

                        {/* Level 2 (Single Elements) */}
                        <g transform="translate(180, 240)">
                            <rect x="-17.5" y="-17.5" width="35" height="35" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                            <text x="0" y="5" textAnchor="middle" fill="var(--text-primary)" fontSize="14">38</text>
                        </g>
                        <g transform="translate(320, 240)">
                            <rect x="-17.5" y="-17.5" width="35" height="35" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                            <text x="0" y="5" textAnchor="middle" fill="var(--text-primary)" fontSize="14">27</text>
                        </g>
                        <g transform="translate(480, 240)">
                            <rect x="-17.5" y="-17.5" width="35" height="35" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                            <text x="0" y="5" textAnchor="middle" fill="var(--text-primary)" fontSize="14">43</text>
                        </g>
                        <g transform="translate(620, 240)">
                            <rect x="-17.5" y="-17.5" width="35" height="35" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                            <text x="0" y="5" textAnchor="middle" fill="var(--text-primary)" fontSize="14">10</text>
                        </g>

                        {/* Merge Arrows L2 -> L3 */}
                        <path d="M 180 260 L 250 320" stroke="var(--border-color)" strokeWidth="1.5" markerEnd="url(#arrowhead-ms)" fill="none" />
                        <path d="M 320 260 L 250 320" stroke="var(--border-color)" strokeWidth="1.5" markerEnd="url(#arrowhead-ms)" fill="none" />
                        <path d="M 480 260 L 550 320" stroke="var(--border-color)" strokeWidth="1.5" markerEnd="url(#arrowhead-ms)" fill="none" />
                        <path d="M 620 260 L 550 320" stroke="var(--border-color)" strokeWidth="1.5" markerEnd="url(#arrowhead-ms)" fill="none" />

                        {/* Level 3 (Merged Pairs) */}
                        <g transform="translate(250, 340)">
                            <g transform="translate(-35, -20)">
                                {[27, 38].map((val, idx) => (
                                    <g key={idx} transform={`translate(${idx * 35}, 0)`}>
                                        <rect width="35" height="35" fill="var(--bg-tertiary)" stroke="var(--accent-primary)" />
                                        <text x="17.5" y="22" textAnchor="middle" fill="var(--text-primary)" fontSize="14">{val}</text>
                                    </g>
                                ))}
                            </g>
                        </g>
                         <g transform="translate(550, 340)">
                            <g transform="translate(-35, -20)">
                                {[10, 43].map((val, idx) => (
                                    <g key={idx} transform={`translate(${idx * 35}, 0)`}>
                                        <rect width="35" height="35" fill="var(--bg-tertiary)" stroke="var(--accent-primary)" />
                                        <text x="17.5" y="22" textAnchor="middle" fill="var(--text-primary)" fontSize="14">{val}</text>
                                    </g>
                                ))}
                            </g>
                        </g>

                        {/* Merge Arrows L3 -> L4 */}
                        <path d="M 250 360 L 400 420" stroke="var(--border-color)" strokeWidth="1.5" markerEnd="url(#arrowhead-ms)" fill="none" />
                        <path d="M 550 360 L 400 420" stroke="var(--border-color)" strokeWidth="1.5" markerEnd="url(#arrowhead-ms)" fill="none" />

                        {/* Level 4 (Final Sorted) */}
                        <g transform="translate(400, 440)">
                            <g transform="translate(-70, -20)">
                                {[10, 27, 38, 43].map((val, idx) => (
                                    <g key={idx} transform={`translate(${idx * 35}, 0)`}>
                                        <rect width="35" height="35" fill="var(--bg-tertiary)" stroke="var(--accent-primary)" strokeWidth="2" />
                                        <text x="17.5" y="22" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="bold">{val}</text>
                                    </g>
                                ))}
                            </g>
                        </g>
                    </svg>
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

            .viz-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 40px;
                width: 100%;
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

            .aux-item {
                border-color: var(--accent-secondary);
                background: rgba(0, 255, 157, 0.1);
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
            color: var(--accent-primary);
            }

            .aux-array-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                width: 100%;
                padding-top: 20px;
                border-top: 1px dashed var(--border-color);
            }

            h4 {
                color: var(--text-secondary);
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
        `}</style>
    </div>
  );
};

export default MergeSort;

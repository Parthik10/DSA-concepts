import React from 'react';
import { motion } from 'framer-motion';
import VisualizerFrame from '../../components/Visualizer/VisualizerFrame';
import CodeTrace from '../../components/Visualizer/CodeTrace';
import VariableTrace from '../../components/Visualizer/VariableTrace';
import AlgorithmInfo from '../../components/Visualizer/AlgorithmInfo';
import useVisualizer from '../../hooks/useVisualizer';

const QUICK_SORT_CODE = `function quickSort(arr, low, high) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      swap(arr[i], arr[j]);
    }
  }
  swap(arr[i + 1], arr[high]);
  return i + 1;
}`;

const quickSortAlgo = (initialData) => {
  let arr = [...initialData];
  const steps = [];
  
  const partition = (low, high) => {
    let pivot = arr[high];
    let i = low - 1;
    
    steps.push({
      array: [...arr],
      line: 9,
      vars: { low, high, pivot, i, j: low },
      markers: { [high]: 'Pivot', [low]: 'Low', [high]: 'High' }
    });

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        line: 11,
        vars: { low, high, pivot, i, j, 'arr[j]': arr[j] },
        markers: { [high]: 'Pivot', [j]: '?', [i]: 'i' }
      });

      if (arr[j] < pivot) {
        i++;
        steps.push({
          array: [...arr],
          line: 13,
          vars: { low, high, pivot, i, j, action: 'Swap' },
          markers: { [high]: 'Pivot', [j]: 'Swap', [i]: 'Swap' }
        });

        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        
        steps.push({
          array: [...arr],
          line: 14,
          vars: { low, high, pivot, i, j, action: 'Swapped' },
          markers: { [high]: 'Pivot', [j]: 'Swapped', [i]: 'Swapped' }
        });
      }
    }
    
    steps.push({
      array: [...arr],
      line: 17,
      vars: { low, high, pivot, i, action: 'Place Pivot' },
      markers: { [high]: 'Pivot', [i+1]: 'Target' }
    });

    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    steps.push({
      array: [...arr],
      line: 18,
      vars: { low, high, pivot, pi: i + 1, action: 'Pivot Placed' },
      markers: { [i+1]: 'Sorted Pivot' }
    });

    return i + 1;
  };

  const quickSort = (low, high) => {
    if (low < high) {
      steps.push({
        array: [...arr],
        line: 2,
        vars: { low, high },
        markers: { [low]: 'L', [high]: 'H' }
      });

      let pi = partition(low, high);

      steps.push({
        array: [...arr],
        line: 3,
        vars: { low, high, pi },
        markers: { [pi]: 'Pivot' }
      });

      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  };

  quickSort(0, arr.length - 1);
  
  steps.push({
    array: [...arr],
    line: 1, // Done
    vars: { status: 'Sorted' },
    markers: {}
  });

  return steps;
};

const QuickSort = () => {
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

  const handleRun = () => {
    run(quickSortAlgo);
  };

  const isSorted = traceVars.status === 'Sorted';

  return (
    <div className="page-container">
        <VisualizerFrame
        title="Quick Sort"
        dataSize={dataSize}
        setDataSize={setDataSize}
        onRun={handleRun}
        onReset={reset}
        isRunning={isRunning}
        isTLE={isTLE}
        codeTrace={<CodeTrace code={QUICK_SORT_CODE} activeLine={activeLine} />}
        variableTrace={<VariableTrace variables={traceVars} />}
        >
        <div className="array-container">
            {data.map((value, idx) => (
            <motion.div
                key={idx}
                layout
                className="array-item"
                initial={false}
                animate={{
                backgroundColor: isSorted ? 'var(--accent-primary)' :
                                markers[idx] === 'Pivot' || markers[idx] === 'Sorted Pivot' ? 'var(--accent-secondary)' : 
                                markers[idx] === 'Swap' || markers[idx] === 'Swapped' ? 'var(--accent-error)' : 'var(--bg-tertiary)',
                borderColor: isSorted ? 'var(--accent-primary)' :
                             markers[idx] ? 'var(--accent-primary)' : 'var(--border-color)',
                scale: markers[idx] === 'Pivot' ? 1.1 : 1,
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
        </VisualizerFrame>

        <AlgorithmInfo 
            title="Quick Sort"
            definition="Quick Sort is a divide-and-conquer algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively."
            complexity={{
                time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
                space: 'O(log n)'
            }}
            hints={[
                "Key is the 'Partition' function.",
                "Choose a pivot (first, last, random, or median).",
                "Elements smaller than pivot go left, larger go right.",
                "Recursive calls on left and right partitions."
            ]}
            staticVisual={
                <div style={{ width: '100%', maxWidth: '800px', padding: '20px 0' }}>
                    <svg viewBox="0 0 800 400" width="100%" height="auto" style={{ overflow: 'visible' }}>
                        {/* Defs for arrow markers */}
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="var(--border-color)" />
                            </marker>
                        </defs>

                        {/* Level 0: Root [19, 17, 15, 12, 16, 18, 4, 11, 13] */}
                        <g transform="translate(400, 40)">
                            {/* Array Box */}
                            <g transform="translate(-157.5, -20)"> {/* 9 elements * 35px = 315px width. Center is 157.5 */}
                                {[19, 17, 15, 12, 16, 18, 4, 11, 13].map((val, idx) => (
                                    <g key={idx} transform={`translate(${idx * 35}, 0)`}>
                                        <rect width="35" height="35" fill={idx === 8 ? 'var(--accent-primary)' : 'var(--bg-tertiary)'} stroke="var(--border-color)" />
                                        <text x="17.5" y="22" textAnchor="middle" fill={idx === 8 ? '#000' : 'var(--text-primary)'} fontSize="14">{val}</text>
                                    </g>
                                ))}
                            </g>
                            <text x="0" y="35" textAnchor="middle" fill="var(--text-muted)" fontSize="12">Pivot: 13</text>
                        </g>

                        {/* Arrows L0 -> L1 */}
                        <path d="M 400 60 L 200 120" stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />
                        <path d="M 400 60 L 600 120" stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />

                        {/* Level 1 Left: [7, 12, 4, 11] Pivot: 11 */}
                        <g transform="translate(200, 140)">
                            <text x="0" y="-25" textAnchor="middle" fill="var(--text-muted)" fontSize="12">&lt;= 13</text>
                            <g transform="translate(-60, -20)"> {/* 4 elements * 30px = 120px. Center 60 */}
                                {[7, 12, 4, 11].map((val, idx) => (
                                    <g key={idx} transform={`translate(${idx * 30}, 0)`}>
                                        <rect width="30" height="30" fill={idx === 3 ? 'var(--accent-primary)' : 'var(--bg-tertiary)'} stroke="var(--border-color)" />
                                        <text x="15" y="20" textAnchor="middle" fill={idx === 3 ? '#000' : 'var(--text-primary)'} fontSize="12">{val}</text>
                                    </g>
                                ))}
                            </g>
                            <text x="0" y="25" textAnchor="middle" fill="var(--text-muted)" fontSize="12">Pivot: 11</text>
                        </g>

                        {/* Level 1 Center: 13 */}
                        <g transform="translate(400, 140)">
                             <rect x="-17.5" y="-17.5" width="35" height="35" fill="var(--accent-primary)" rx="4" />
                             <text x="0" y="5" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="14">13</text>
                        </g>

                        {/* Level 1 Right: [18, 15, 19, 16] Pivot: 16 */}
                        <g transform="translate(600, 140)">
                            <text x="0" y="-25" textAnchor="middle" fill="var(--text-muted)" fontSize="12">&gt; 13</text>
                            <g transform="translate(-60, -20)">
                                {[18, 15, 19, 16].map((val, idx) => (
                                    <g key={idx} transform={`translate(${idx * 30}, 0)`}>
                                        <rect width="30" height="30" fill={idx === 3 ? 'var(--accent-primary)' : 'var(--bg-tertiary)'} stroke="var(--border-color)" />
                                        <text x="15" y="20" textAnchor="middle" fill={idx === 3 ? '#000' : 'var(--text-primary)'} fontSize="12">{val}</text>
                                    </g>
                                ))}
                            </g>
                            <text x="0" y="25" textAnchor="middle" fill="var(--text-muted)" fontSize="12">Pivot: 16</text>
                        </g>

                        {/* Arrows L1 Left -> L2 */}
                        <path d="M 200 160 L 100 220" stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />
                        <path d="M 200 160 L 300 220" stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />

                        {/* Arrows L1 Right -> L2 */}
                        <path d="M 600 160 L 500 220" stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />
                        <path d="M 600 160 L 700 220" stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />

                        {/* Level 2 Left-Left: [7, 4] Pivot: 4 */}
                        <g transform="translate(100, 240)">
                            <text x="0" y="-20" textAnchor="middle" fill="var(--text-muted)" fontSize="10">&lt;= 11</text>
                            <g transform="translate(-25, -15)"> {/* 2 * 25px = 50px. Center 25 */}
                                {[7, 4].map((val, idx) => (
                                    <g key={idx} transform={`translate(${idx * 25}, 0)`}>
                                        <rect width="25" height="25" fill={idx === 1 ? 'var(--accent-primary)' : 'var(--bg-tertiary)'} stroke="var(--border-color)" />
                                        <text x="12.5" y="17" textAnchor="middle" fill={idx === 1 ? '#000' : 'var(--text-primary)'} fontSize="10">{val}</text>
                                    </g>
                                ))}
                            </g>
                            <text x="0" y="20" textAnchor="middle" fill="var(--text-muted)" fontSize="10">P: 4</text>
                        </g>

                        {/* Level 2 Left-Center: 11 */}
                        <g transform="translate(200, 240)">
                             <rect x="-12.5" y="-12.5" width="25" height="25" fill="var(--accent-primary)" rx="4" />
                             <text x="0" y="4" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="12">11</text>
                        </g>

                        {/* Level 2 Left-Right: [12] */}
                        <g transform="translate(300, 240)">
                            <text x="0" y="-20" textAnchor="middle" fill="var(--text-muted)" fontSize="10">&gt;= 11</text>
                            <g transform="translate(-12.5, -15)">
                                <rect width="25" height="25" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text x="12.5" y="17" textAnchor="middle" fill="var(--text-primary)" fontSize="10">12</text>
                            </g>
                        </g>

                        {/* Level 2 Right-Left: [15] */}
                        <g transform="translate(500, 240)">
                            <text x="0" y="-20" textAnchor="middle" fill="var(--text-muted)" fontSize="10">&lt;= 16</text>
                            <g transform="translate(-12.5, -15)">
                                <rect width="25" height="25" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text x="12.5" y="17" textAnchor="middle" fill="var(--text-primary)" fontSize="10">15</text>
                            </g>
                        </g>

                        {/* Level 2 Right-Center: 16 */}
                        <g transform="translate(600, 240)">
                             <rect x="-12.5" y="-12.5" width="25" height="25" fill="var(--accent-primary)" rx="4" />
                             <text x="0" y="4" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="12">16</text>
                        </g>

                        {/* Level 2 Right-Right: [19, 18] Pivot: 18 */}
                        <g transform="translate(700, 240)">
                            <text x="0" y="-20" textAnchor="middle" fill="var(--text-muted)" fontSize="10">&gt;= 16</text>
                            <g transform="translate(-25, -15)">
                                {[19, 18].map((val, idx) => (
                                    <g key={idx} transform={`translate(${idx * 25}, 0)`}>
                                        <rect width="25" height="25" fill={idx === 1 ? 'var(--accent-primary)' : 'var(--bg-tertiary)'} stroke="var(--border-color)" />
                                        <text x="12.5" y="17" textAnchor="middle" fill={idx === 1 ? '#000' : 'var(--text-primary)'} fontSize="10">{val}</text>
                                    </g>
                                ))}
                            </g>
                            <text x="0" y="20" textAnchor="middle" fill="var(--text-muted)" fontSize="10">P: 18</text>
                        </g>

                        {/* Arrows L2 Left-Left -> L3 */}
                        <path d="M 100 260 L 50 320" stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />
                        <path d="M 100 260 L 150 320" stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />

                         {/* Arrows L2 Right-Right -> L3 */}
                        <path d="M 700 260 L 650 320" stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />
                        <path d="M 700 260 L 750 320" stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />

                        {/* Level 3 Left Leaves */}
                        <g transform="translate(50, 340)">
                             <rect x="-12.5" y="-12.5" width="25" height="25" fill="var(--accent-primary)" rx="4" />
                             <text x="0" y="4" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="12">4</text>
                        </g>
                        <g transform="translate(150, 340)">
                            <g transform="translate(-12.5, -12.5)">
                                <rect width="25" height="25" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text x="12.5" y="17" textAnchor="middle" fill="var(--text-primary)" fontSize="10">7</text>
                            </g>
                        </g>

                        {/* Level 3 Right Leaves */}
                        <g transform="translate(650, 340)">
                             <rect x="-12.5" y="-12.5" width="25" height="25" fill="var(--accent-primary)" rx="4" />
                             <text x="0" y="4" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="12">18</text>
                        </g>
                        <g transform="translate(750, 340)">
                            <g transform="translate(-12.5, -12.5)">
                                <rect width="25" height="25" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text x="12.5" y="17" textAnchor="middle" fill="var(--text-primary)" fontSize="10">19</text>
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
            color: var(--accent-primary);
            }
        `}</style>
    </div>
  );
};

export default QuickSort;

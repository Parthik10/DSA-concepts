import React from 'react';
import { motion } from 'framer-motion';
import VisualizerFrame from '../../components/Visualizer/VisualizerFrame';
import CodeTrace from '../../components/Visualizer/CodeTrace';
import VariableTrace from '../../components/Visualizer/VariableTrace';
import AlgorithmInfo from '../../components/Visualizer/AlgorithmInfo';
import useVisualizer from '../../hooks/useVisualizer';

const HEAP_SORT_CODE = `function heapSort(arr) {
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    swap(arr[0], arr[i]);
    heapify(arr, i, 0);
  }
}

function heapify(arr, n, i) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest != i) {
    swap(arr[i], arr[largest]);
    heapify(arr, n, largest);
  }
}`;

const heapSortAlgo = (initialData) => {
  let arr = [...initialData];
  const steps = [];
  let n = arr.length;

  const heapify = (n, i) => {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    steps.push({
      array: [...arr],
      line: 12,
      vars: { n, i, largest, l, r },
      markers: { [i]: 'Node', [l]: 'L', [r]: 'R' }
    });

    if (l < n && arr[l] > arr[largest]) {
      largest = l;
      steps.push({
        array: [...arr],
        line: 15,
        vars: { n, i, largest, l, r, action: 'Left > Root' },
        markers: { [i]: 'Node', [l]: 'Largest' }
      });
    }

    if (r < n && arr[r] > arr[largest]) {
      largest = r;
      steps.push({
        array: [...arr],
        line: 16,
        vars: { n, i, largest, l, r, action: 'Right > Largest' },
        markers: { [i]: 'Node', [r]: 'Largest' }
      });
    }

    if (largest !== i) {
      steps.push({
        array: [...arr],
        line: 17,
        vars: { n, i, largest, action: 'Swap Needed' },
        markers: { [i]: 'Swap', [largest]: 'Swap' }
      });

      let temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;

      steps.push({
        array: [...arr],
        line: 18,
        vars: { n, i, largest, action: 'Swapped' },
        markers: { [i]: 'Swapped', [largest]: 'Swapped' }
      });

      heapify(n, largest);
    }
  };

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      array: [...arr],
      line: 3,
      vars: { i, n, action: 'Build Heap' },
      markers: { [i]: 'Heapify' }
    });
    heapify(n, i);
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      array: [...arr],
      line: 6,
      vars: { i, n, action: 'Extract Max' },
      markers: { [0]: 'Max', [i]: 'Swap' }
    });

    let temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    steps.push({
      array: [...arr],
      line: 7,
      vars: { i, n, action: 'Max Moved to End' },
      markers: { [0]: 'Swapped', [i]: 'Sorted' }
    });

    heapify(i, 0);
  }
  
  steps.push({
    array: [...arr],
    line: 1, // Done
    vars: { status: 'Sorted' },
    markers: {}
  });

  return steps;
};

const HeapSort = () => {
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
    run(heapSortAlgo);
  };

  const isSorted = traceVars.status === 'Sorted';

  return (
    <div className="page-container">
        <VisualizerFrame
        title="Heap Sort"
        dataSize={dataSize}
        setDataSize={setDataSize}
        onRun={handleRun}
        onReset={reset}
        isRunning={isRunning}
        isTLE={isTLE}
        codeTrace={<CodeTrace code={HEAP_SORT_CODE} activeLine={activeLine} />}
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
                                markers[idx] === 'Sorted' ? 'var(--accent-primary)' : 
                                markers[idx] === 'Max' ? 'var(--accent-secondary)' : 
                                markers[idx] === 'Swap' || markers[idx] === 'Swapped' ? 'var(--accent-error)' : 'var(--bg-tertiary)',
                borderColor: isSorted ? 'var(--accent-primary)' :
                             markers[idx] ? 'var(--accent-primary)' : 'var(--border-color)',
                scale: markers[idx] === 'Max' ? 1.1 : 1,
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
            title="Heap Sort"
            definition="Heap Sort is a comparison-based sorting technique based on Binary Heap data structure. It is similar to selection sort where we first find the maximum element and place the maximum element at the end. We repeat the same process for the remaining elements."
            complexity={{
                time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
                space: 'O(1)'
            }}
            hints={[
                "Uses a Binary Heap (Max Heap) structure.",
                "Build Max Heap first.",
                "Swap root (max) with last element.",
                "Heapify root to maintain heap property.",
                "Repeat until heap size is 1."
            ]}
            staticVisual={
                <div style={{ width: '100%', maxWidth: '1000px', padding: '20px 0' }}>
                    <svg viewBox="0 0 1000 350" width="100%" height="auto" style={{ overflow: 'visible' }}>
                        <defs>
                            <marker id="arrowhead-hs" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-muted)" />
                            </marker>
                        </defs>

                        {/* Step 1: Max Heap */}
                        <g transform="translate(125, 20)">
                            <text x="60" y="-10" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="bold">1. Max Heap</text>
                            {/* Root 9 */}
                            <g transform="translate(60, 30)">
                                <circle r="20" fill="var(--bg-tertiary)" stroke="var(--accent-primary)" strokeWidth="2" />
                                <text y="6" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="bold">9</text>
                            </g>
                            {/* Left 6 */}
                            <line x1="60" y1="50" x2="30" y2="90" stroke="var(--border-color)" strokeWidth="2" />
                            <g transform="translate(30, 90)">
                                <circle r="20" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="6" textAnchor="middle" fill="var(--text-primary)" fontSize="16">6</text>
                            </g>
                            {/* Right 8 */}
                            <line x1="60" y1="50" x2="90" y2="90" stroke="var(--border-color)" strokeWidth="2" />
                            <g transform="translate(90, 90)">
                                <circle r="20" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="6" textAnchor="middle" fill="var(--text-primary)" fontSize="16">8</text>
                            </g>
                            {/* Leaves */}
                            <line x1="30" y1="110" x2="10" y2="150" stroke="var(--border-color)" />
                            <g transform="translate(10, 150)">
                                <circle r="18" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="5" textAnchor="middle" fill="var(--text-primary)" fontSize="14">4</text>
                            </g>
                            <line x1="30" y1="110" x2="50" y2="150" stroke="var(--border-color)" />
                            <g transform="translate(50, 150)">
                                <circle r="18" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="5" textAnchor="middle" fill="var(--text-primary)" fontSize="14">1</text>
                            </g>
                            <line x1="90" y1="110" x2="70" y2="150" stroke="var(--border-color)" />
                            <g transform="translate(70, 150)">
                                <circle r="18" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="5" textAnchor="middle" fill="var(--text-primary)" fontSize="14">2</text>
                            </g>
                        </g>

                        {/* Arrow 1 -> 2 */}
                        <path d="M 260 110 L 310 110" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrowhead-hs)" />

                        {/* Step 2: Swap Max */}
                        <g transform="translate(375, 20)">
                            <text x="60" y="-10" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="bold">2. Swap Max</text>
                             {/* Root 2 (Swapped) */}
                            <g transform="translate(60, 30)">
                                <circle r="20" fill="var(--bg-tertiary)" stroke="var(--accent-error)" strokeWidth="2" />
                                <text y="6" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="bold">2</text>
                            </g>
                            {/* Left 6 */}
                            <line x1="60" y1="50" x2="30" y2="90" stroke="var(--border-color)" strokeWidth="2" />
                            <g transform="translate(30, 90)">
                                <circle r="20" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="6" textAnchor="middle" fill="var(--text-primary)" fontSize="16">6</text>
                            </g>
                            {/* Right 8 */}
                            <line x1="60" y1="50" x2="90" y2="90" stroke="var(--border-color)" strokeWidth="2" />
                            <g transform="translate(90, 90)">
                                <circle r="20" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="6" textAnchor="middle" fill="var(--text-primary)" fontSize="16">8</text>
                            </g>
                             {/* Leaves */}
                            <line x1="30" y1="110" x2="10" y2="150" stroke="var(--border-color)" />
                            <g transform="translate(10, 150)">
                                <circle r="18" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="5" textAnchor="middle" fill="var(--text-primary)" fontSize="14">4</text>
                            </g>
                            <line x1="30" y1="110" x2="50" y2="150" stroke="var(--border-color)" />
                            <g transform="translate(50, 150)">
                                <circle r="18" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="5" textAnchor="middle" fill="var(--text-primary)" fontSize="14">1</text>
                            </g>
                            <line x1="90" y1="110" x2="70" y2="150" stroke="var(--border-color)" />
                            <g transform="translate(70, 150)">
                                <rect x="-18" y="-18" width="36" height="36" fill="var(--accent-primary)" stroke="var(--border-color)" />
                                <text y="5" textAnchor="middle" fill="#000" fontSize="14" fontWeight="bold">9</text>
                            </g>
                        </g>

                        {/* Arrow 2 -> 3 */}
                        <path d="M 510 110 L 560 110" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrowhead-hs)" />

                        {/* Step 3: Sift Down */}
                        <g transform="translate(625, 20)">
                            <text x="60" y="-10" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="bold">3. Sift Down</text>
                            {/* Root 8 (Swapped with 2) */}
                            <g transform="translate(60, 30)">
                                <circle r="20" fill="var(--bg-tertiary)" stroke="var(--accent-secondary)" strokeWidth="2" />
                                <text y="6" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="bold">8</text>
                            </g>
                            {/* Left 6 */}
                            <line x1="60" y1="50" x2="30" y2="90" stroke="var(--border-color)" strokeWidth="2" />
                            <g transform="translate(30, 90)">
                                <circle r="20" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="6" textAnchor="middle" fill="var(--text-primary)" fontSize="16">6</text>
                            </g>
                            {/* Right 2 (Moved Down) */}
                            <line x1="60" y1="50" x2="90" y2="90" stroke="var(--border-color)" strokeWidth="2" />
                            <g transform="translate(90, 90)">
                                <circle r="20" fill="var(--bg-tertiary)" stroke="var(--accent-secondary)" />
                                <text y="6" textAnchor="middle" fill="var(--text-primary)" fontSize="16">2</text>
                            </g>
                             {/* Leaves */}
                            <line x1="30" y1="110" x2="10" y2="150" stroke="var(--border-color)" />
                            <g transform="translate(10, 150)">
                                <circle r="18" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="5" textAnchor="middle" fill="var(--text-primary)" fontSize="14">4</text>
                            </g>
                            <line x1="30" y1="110" x2="50" y2="150" stroke="var(--border-color)" />
                            <g transform="translate(50, 150)">
                                <circle r="18" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="5" textAnchor="middle" fill="var(--text-primary)" fontSize="14">1</text>
                            </g>
                            <line x1="90" y1="110" x2="70" y2="150" stroke="var(--border-color)" />
                            <g transform="translate(70, 150)">
                                <rect x="-18" y="-18" width="36" height="36" fill="var(--accent-primary)" stroke="var(--border-color)" />
                                <text y="5" textAnchor="middle" fill="#000" fontSize="14" fontWeight="bold">9</text>
                            </g>

                            {/* Swap Arrow */}
                            <path d="M 80 40 Q 100 60 95 70" stroke="var(--accent-secondary)" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead-hs)" strokeDasharray="4" />
                        </g>

                        {/* Arrow 3 -> 4 */}
                        <path d="M 760 110 L 810 110" stroke="var(--text-muted)" strokeWidth="2" markerEnd="url(#arrowhead-hs)" />

                        {/* Step 4: Repeat */}
                        <g transform="translate(875, 20)">
                            <text x="60" y="-10" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="bold">4. Repeat</text>
                             {/* Root 2 (Swapped with 8) */}
                            <g transform="translate(60, 30)">
                                <circle r="20" fill="var(--bg-tertiary)" stroke="var(--accent-error)" strokeWidth="2" />
                                <text y="6" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="bold">2</text>
                            </g>
                            {/* Left 6 */}
                            <line x1="60" y1="50" x2="30" y2="90" stroke="var(--border-color)" strokeWidth="2" />
                            <g transform="translate(30, 90)">
                                <circle r="20" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="6" textAnchor="middle" fill="var(--text-primary)" fontSize="16">6</text>
                            </g>
                            {/* Right 8 (Sorted) */}
                            <line x1="60" y1="50" x2="90" y2="90" stroke="var(--border-color)" strokeWidth="2" />
                            <g transform="translate(90, 90)">
                                <rect x="-18" y="-18" width="36" height="36" fill="var(--accent-primary)" stroke="var(--border-color)" />
                                <text y="5" textAnchor="middle" fill="#000" fontSize="14" fontWeight="bold">8</text>
                            </g>
                             {/* Leaves */}
                            <line x1="30" y1="110" x2="10" y2="150" stroke="var(--border-color)" />
                            <g transform="translate(10, 150)">
                                <circle r="18" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="5" textAnchor="middle" fill="var(--text-primary)" fontSize="14">4</text>
                            </g>
                            <line x1="30" y1="110" x2="50" y2="150" stroke="var(--border-color)" />
                            <g transform="translate(50, 150)">
                                <circle r="18" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                                <text y="5" textAnchor="middle" fill="var(--text-primary)" fontSize="14">1</text>
                            </g>
                            <line x1="90" y1="110" x2="70" y2="150" stroke="var(--border-color)" />
                            <g transform="translate(70, 150)">
                                <rect x="-18" y="-18" width="36" height="36" fill="var(--accent-primary)" stroke="var(--border-color)" />
                                <text y="5" textAnchor="middle" fill="#000" fontSize="14" fontWeight="bold">9</text>
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

export default HeapSort;

import React from 'react';
import { motion } from 'framer-motion';
import VisualizerFrame from '../../components/Visualizer/VisualizerFrame';
import CodeTrace from '../../components/Visualizer/CodeTrace';
import VariableTrace from '../../components/Visualizer/VariableTrace';
import AlgorithmInfo from '../../components/Visualizer/AlgorithmInfo';
import useVisualizer from '../../hooks/useVisualizer';

const BUBBLE_SORT_CODE = `for (let i = 0; i < n - 1; i++) {
  let swapped = false;
  for (let j = 0; j < n - i - 1; j++) {
    if (arr[j] > arr[j + 1]) {
      swap(arr[j], arr[j + 1]);
      swapped = true;
    }
  }
  if (!swapped) break;
}`;

const bubbleSortAlgo = (initialData) => {
  let arr = [...initialData];
  const steps = [];
  let n = arr.length;
  
  steps.push({
    array: [...arr],
    line: 1,
    vars: { i: 0, j: 0, n, swapped: 'false' },
    markers: {}
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    steps.push({
      array: [...arr],
      line: 2,
      vars: { i, j: 0, n, swapped: 'false' },
      markers: {}
    });

    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        line: 3,
        vars: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j+1], swapped: swapped.toString() },
        markers: { [j]: '↑', [j+1]: '↑' }
      });

      if (arr[j] > arr[j + 1]) {
        steps.push({
          array: [...arr],
          line: 4,
          vars: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j+1], condition: 'TRUE' },
          markers: { [j]: 'Swap', [j+1]: 'Swap' }
        });

        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
        
        steps.push({
          array: [...arr],
          line: 6,
          vars: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j+1], action: 'SWAPPED', swapped: 'true' },
          markers: { [j]: '↓', [j+1]: '↓' }
        });
      } else {
         steps.push({
          array: [...arr],
          line: 4,
          vars: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j+1], condition: 'FALSE' },
          markers: { [j]: 'Ok', [j+1]: 'Ok' }
        });
      }
    }

    if (!swapped) {
      steps.push({
        array: [...arr],
        line: 9,
        vars: { i, swapped: 'false', action: 'BREAK (Sorted)' },
        markers: {}
      });
      break;
    }
  }
  
  // Final Sorted State
  steps.push({
    array: [...arr],
    line: 1,
    vars: { status: 'Sorted' },
    markers: {}
  });
  
  return steps;
};

const BubbleSort = () => {
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
    run(bubbleSortAlgo);
  };

  const isSorted = traceVars.status === 'Sorted';

  return (
    <div className="page-container">
        <VisualizerFrame
        title="Bubble Sort"
        dataSize={dataSize}
        setDataSize={setDataSize}
        onRun={handleRun}
        onReset={reset}
        isRunning={isRunning}
        isTLE={isTLE}
        codeTrace={<CodeTrace code={BUBBLE_SORT_CODE} activeLine={activeLine} />}
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
                                markers[idx] === 'Swap' || markers[idx] === '↓' ? 'var(--accent-secondary)' : 'var(--bg-tertiary)',
                borderColor: isSorted ? 'var(--accent-primary)' :
                             markers[idx] ? 'var(--accent-primary)' : 'var(--border-color)',
                scale: markers[idx] ? 1.1 : 1,
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
            title="Bubble Sort"
            definition="Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted."
            complexity={{
                time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
                space: 'O(1)'
            }}
            hints={[
                "Think of it as 'bubbling' the largest element to the end in each pass.",
                "If no swaps occur in a pass, the array is already sorted (Optimization).",
                "It is a stable sort (does not change relative order of equal elements)."
            ]}
            staticVisual={
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 0' }}>
                    {/* Initial */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <span style={{ width: 60, fontWeight: 'bold', fontSize: '0.9rem' }}>Initial</span>
                        <div style={{ display: 'flex', gap: 2 }}>
                            {[5, 3, 8, 4, 6].map((val, idx) => (
                                <div key={idx} style={{ width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>{val}</div>
                            ))}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Initial Unsorted array</span>
                    </div>

                    {/* Step 1 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <span style={{ width: 60, fontWeight: 'bold', fontSize: '0.9rem' }}>Step 1</span>
                        <div style={{ display: 'flex', gap: 2 }}>
                            {[5, 3, 8, 4, 6].map((val, idx) => (
                                <div key={idx} style={{ width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx < 2 ? 'var(--accent-secondary)' : 'var(--bg-tertiary)', color: idx < 2 ? '#fff' : 'var(--text-primary)' }}>{val}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Compare 1st and 2nd</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Swap)</span>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <span style={{ width: 60, fontWeight: 'bold', fontSize: '0.9rem' }}>Step 2</span>
                        <div style={{ display: 'flex', gap: 2 }}>
                            {[3, 5, 8, 4, 6].map((val, idx) => (
                                <div key={idx} style={{ width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: (idx === 1 || idx === 2) ? 'var(--accent-secondary)' : 'var(--bg-tertiary)', color: (idx === 1 || idx === 2) ? '#fff' : 'var(--text-primary)' }}>{val}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Compare 2nd and 3rd</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Do not Swap)</span>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <span style={{ width: 60, fontWeight: 'bold', fontSize: '0.9rem' }}>Step 3</span>
                        <div style={{ display: 'flex', gap: 2 }}>
                            {[3, 5, 8, 4, 6].map((val, idx) => (
                                <div key={idx} style={{ width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: (idx === 2 || idx === 3) ? 'var(--accent-secondary)' : 'var(--bg-tertiary)', color: (idx === 2 || idx === 3) ? '#fff' : 'var(--text-primary)' }}>{val}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Compare 3rd and 4th</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Swap)</span>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <span style={{ width: 60, fontWeight: 'bold', fontSize: '0.9rem' }}>Step 4</span>
                        <div style={{ display: 'flex', gap: 2 }}>
                            {[3, 5, 4, 8, 6].map((val, idx) => (
                                <div key={idx} style={{ width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: (idx === 3 || idx === 4) ? 'var(--accent-secondary)' : 'var(--bg-tertiary)', color: (idx === 3 || idx === 4) ? '#fff' : 'var(--text-primary)' }}>{val}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Compare 4th and 5th</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Swap)</span>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <span style={{ width: 60, fontWeight: 'bold', fontSize: '0.9rem' }}>Step 5</span>
                        <div style={{ display: 'flex', gap: 2 }}>
                            {[3, 5, 4, 6, 8].map((val, idx) => (
                                <div key={idx} style={{ width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx === 4 ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: idx === 4 ? '#000' : 'var(--text-primary)' }}>{val}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Repeat Step 1-5 until</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>no more swaps required</span>
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
            color: var(--accent-primary);
            font-weight: bold;
            white-space: nowrap;
            }
        `}</style>
    </div>
  );
};

export default BubbleSort;

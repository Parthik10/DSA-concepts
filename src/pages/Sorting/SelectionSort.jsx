import React from 'react';
import { motion } from 'framer-motion';
import VisualizerFrame from '../../components/Visualizer/VisualizerFrame';
import CodeTrace from '../../components/Visualizer/CodeTrace';
import VariableTrace from '../../components/Visualizer/VariableTrace';
import AlgorithmInfo from '../../components/Visualizer/AlgorithmInfo';
import useVisualizer from '../../hooks/useVisualizer';

const SELECTION_SORT_CODE = `for (let i = 0; i < n - 1; i++) {
  let minIdx = i;
  for (let j = i + 1; j < n; j++) {
    if (arr[j] < arr[minIdx]) {
      minIdx = j;
    }
  }
  if (minIdx !== i) {
    swap(arr[i], arr[minIdx]);
  }
}`;

const selectionSortAlgo = (initialData) => {
  let arr = [...initialData];
  const steps = [];
  let n = arr.length;
  
  steps.push({
    array: [...arr],
    line: 1,
    vars: { i: 0, n },
    markers: {}
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    steps.push({
      array: [...arr],
      line: 2,
      vars: { i, minIdx, n },
      markers: { [i]: 'i', [minIdx]: 'Min' }
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        line: 3,
        vars: { i, minIdx, j, 'arr[j]': arr[j], 'arr[minIdx]': arr[minIdx] },
        markers: { [i]: 'i', [minIdx]: 'Min', [j]: '?' }
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          line: 5,
          vars: { i, minIdx, j, action: 'New Min' },
          markers: { [i]: 'i', [minIdx]: 'Min' }
        });
      }
    }

    if (minIdx !== i) {
      steps.push({
        array: [...arr],
        line: 9,
        vars: { i, minIdx, action: 'Swap' },
        markers: { [i]: 'Swap', [minIdx]: 'Swap' }
      });

      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      steps.push({
        array: [...arr],
        line: 10,
        vars: { i, minIdx, action: 'Swapped' },
        markers: { [i]: 'Sorted', [minIdx]: 'Swapped' }
      });
    } else {
      steps.push({
        array: [...arr],
        line: 8,
        vars: { i, minIdx, action: 'No Swap Needed' },
        markers: { [i]: 'Sorted' }
      });
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

const SelectionSort = () => {
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
    run(selectionSortAlgo);
  };

  const isSorted = traceVars.status === 'Sorted';

  return (
    <div className="page-container">
        <VisualizerFrame
        title="Selection Sort"
        dataSize={dataSize}
        setDataSize={setDataSize}
        onRun={handleRun}
        onReset={reset}
        isRunning={isRunning}
        isTLE={isTLE}
        codeTrace={<CodeTrace code={SELECTION_SORT_CODE} activeLine={activeLine} />}
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
                                markers[idx] === 'Min' ? 'var(--accent-secondary)' : 
                                markers[idx] === 'Sorted' ? 'var(--accent-primary)' : 
                                markers[idx] === 'Swap' ? 'var(--accent-error)' : 'var(--bg-tertiary)',
                borderColor: isSorted ? 'var(--accent-primary)' :
                             markers[idx] ? 'var(--accent-primary)' : 'var(--border-color)',
                scale: markers[idx] === 'Min' ? 1.1 : 1,
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
            title="Selection Sort"
            definition="Selection Sort divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items that occupy the rest of the list. From the unsorted sublist, the algorithm finds the minimum element and exchanges it with the leftmost unsorted element."
            complexity={{
                time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
                space: 'O(1)'
            }}
            hints={[
                "Finds the minimum element in the unsorted part and puts it at the beginning.",
                "Does less memory writes compared to Insertion Sort.",
                "Not stable, but in-place."
            ]}
            staticVisual={
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: 30, padding: '20px 0' }}>
                    {/* Step 1 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            {[64, 25, 12, 22, 11].map((val, idx) => (
                                <div key={idx} style={{ position: 'relative', width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx === 0 || idx === 4 ? 'var(--accent-secondary)' : 'var(--bg-tertiary)', color: idx === 0 || idx === 4 ? '#000' : 'var(--text-primary)' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{val}</span>
                                    {idx === 0 && <span style={{ position: 'absolute', top: -25, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>Min_index ↓</span>}
                                    {idx === 4 && <span style={{ position: 'absolute', top: -25, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>↓ Smallest element= 11</span>}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Swapping Elements</span>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            {[11, 25, 12, 22, 64].map((val, idx) => (
                                <div key={idx} style={{ position: 'relative', width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx === 0 ? 'var(--accent-primary)' : idx === 1 || idx === 2 ? 'var(--accent-secondary)' : 'var(--bg-tertiary)', color: idx === 0 || idx === 1 || idx === 2 ? '#000' : 'var(--text-primary)' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{val}</span>
                                    {idx === 1 && <span style={{ position: 'absolute', top: -25, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>Min_index ↓</span>}
                                    {idx === 2 && <span style={{ position: 'absolute', top: -25, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>↓ Smallest element= 12</span>}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Swapping Elements</span>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            {[11, 12, 25, 22, 64].map((val, idx) => (
                                <div key={idx} style={{ position: 'relative', width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx < 2 ? 'var(--accent-primary)' : idx === 2 || idx === 3 ? 'var(--accent-secondary)' : 'var(--bg-tertiary)', color: idx < 4 ? '#000' : 'var(--text-primary)' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{val}</span>
                                    {idx === 2 && <span style={{ position: 'absolute', top: -25, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>Min_index ↓</span>}
                                    {idx === 3 && <span style={{ position: 'absolute', top: -25, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>↓ Smallest element= 22</span>}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Swapping Elements</span>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            {[11, 12, 22, 25, 64].map((val, idx) => (
                                <div key={idx} style={{ position: 'relative', width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx < 3 ? 'var(--accent-primary)' : idx === 3 ? 'var(--accent-secondary)' : 'var(--bg-tertiary)', color: idx < 4 ? '#000' : 'var(--text-primary)' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{val}</span>
                                    {idx === 3 && <span style={{ position: 'absolute', top: -25, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>Min_index ↓</span>}
                                    {idx === 3 && <span style={{ position: 'absolute', top: -40, left: 20, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>↓ Smallest element= 25</span>}
                                    {idx === 3 && <span style={{ position: 'absolute', bottom: -35, fontSize: '0.7rem', textAlign: 'center', lineHeight: 1.2 }}>swapped<br/>with itself</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                     {/* Step 5 */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            {[11, 12, 22, 25, 64].map((val, idx) => (
                                <div key={idx} style={{ position: 'relative', width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx < 4 ? 'var(--accent-primary)' : idx === 4 ? 'var(--accent-secondary)' : 'var(--bg-tertiary)', color: idx < 5 ? '#000' : 'var(--text-primary)' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{val}</span>
                                    {idx === 4 && <span style={{ position: 'absolute', top: -25, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>Min_index ↓</span>}
                                    {idx === 4 && <span style={{ position: 'absolute', top: -25, left: 40, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>↓ Smallest element= 64</span>}
                                    {idx === 4 && <span style={{ position: 'absolute', bottom: -35, fontSize: '0.7rem', textAlign: 'center', lineHeight: 1.2 }}>swapped<br/>with itself</span>}
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
            color: var(--accent-primary);
            }
        `}</style>
    </div>
  );
};

export default SelectionSort;

import React from 'react';
import { motion } from 'framer-motion';
import VisualizerFrame from '../../components/Visualizer/VisualizerFrame';
import CodeTrace from '../../components/Visualizer/CodeTrace';
import VariableTrace from '../../components/Visualizer/VariableTrace';
import AlgorithmInfo from '../../components/Visualizer/AlgorithmInfo';
import useVisualizer from '../../hooks/useVisualizer';

const INSERTION_SORT_CODE = `for (let i = 1; i < n; i++) {
  let key = arr[i];
  let j = i - 1;
  while (j >= 0 && arr[j] > key) {
    arr[j + 1] = arr[j];
    j = j - 1;
  }
  arr[j + 1] = key;
}`;

const insertionSortAlgo = (initialData) => {
  let arr = [...initialData];
  const steps = [];
  let n = arr.length;
  
  steps.push({
    array: [...arr],
    line: 1,
    vars: { i: 1, n },
    markers: {}
  });

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      line: 2,
      vars: { i, key, j },
      markers: { [i]: 'Key' }
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: [...arr],
        line: 4,
        vars: { i, key, j, 'arr[j]': arr[j], condition: 'TRUE' },
        markers: { [i]: 'Key', [j]: '>' }
      });

      arr[j + 1] = arr[j];
      
      steps.push({
        array: [...arr],
        line: 5,
        vars: { i, key, j, action: 'Shift' },
        markers: { [j+1]: 'Shift', [j]: '>' }
      });

      j = j - 1;
    }

    steps.push({
      array: [...arr],
      line: 4,
      vars: { i, key, j, condition: 'FALSE' },
      markers: { [i]: 'Key' }
    });

    arr[j + 1] = key;
    
    steps.push({
      array: [...arr],
      line: 8,
      vars: { i, key, j, action: 'Insert Key' },
      markers: { [j+1]: 'Inserted' }
    });
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

const InsertionSort = () => {
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
    run(insertionSortAlgo);
  };

  const isSorted = traceVars.status === 'Sorted';

  return (
    <div className="page-container">
        <VisualizerFrame
        title="Insertion Sort"
        dataSize={dataSize}
        setDataSize={setDataSize}
        onRun={handleRun}
        onReset={reset}
        isRunning={isRunning}
        isTLE={isTLE}
        codeTrace={<CodeTrace code={INSERTION_SORT_CODE} activeLine={activeLine} />}
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
                                markers[idx] === 'Key' ? 'var(--accent-secondary)' : 
                                markers[idx] === 'Inserted' ? 'var(--accent-primary)' : 
                                markers[idx] === 'Shift' ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                borderColor: isSorted ? 'var(--accent-primary)' :
                             markers[idx] ? 'var(--accent-primary)' : 'var(--border-color)',
                y: markers[idx] === 'Key' ? -10 : 0,
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
            title="Insertion Sort"
            definition="Insertion Sort builds the final sorted array one item at a time. It iterates through the input elements and grows a sorted array behind it. At each iteration, it removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there."
            complexity={{
                time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
                space: 'O(1)'
            }}
            hints={[
                "Analogy: Sorting playing cards in your hand.",
                "Efficient for small data sets or substantially sorted data.",
                "It is a stable sort and in-place."
            ]}
            staticVisual={
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 0' }}>
                    {/* Step 1 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: 60 }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Pass 1</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Insert 3</span>
                        </div>
                        <div style={{ display: 'flex', gap: 2 }}>
                            {[4, 3, 2, 10, 12, 1].map((val, idx) => (
                                <div key={idx} style={{ width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx === 1 ? 'var(--accent-secondary)' : idx === 0 ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: idx === 1 || idx === 0 ? '#000' : 'var(--text-primary)' }}>{val}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>3 &lt; 4, swap</span>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: 60 }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Pass 2</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Insert 2</span>
                        </div>
                        <div style={{ display: 'flex', gap: 2 }}>
                            {[3, 4, 2, 10, 12, 1].map((val, idx) => (
                                <div key={idx} style={{ width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx === 2 ? 'var(--accent-secondary)' : idx < 2 ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: idx <= 2 ? '#000' : 'var(--text-primary)' }}>{val}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2 &lt; 4, 2 &lt; 3, insert at start</span>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: 60 }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Pass 3</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Insert 10</span>
                        </div>
                        <div style={{ display: 'flex', gap: 2 }}>
                            {[2, 3, 4, 10, 12, 1].map((val, idx) => (
                                <div key={idx} style={{ width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx === 3 ? 'var(--accent-secondary)' : idx < 3 ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: idx <= 3 ? '#000' : 'var(--text-primary)' }}>{val}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>10 &gt; 4, no shift</span>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: 60 }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Pass 4</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Insert 12</span>
                        </div>
                        <div style={{ display: 'flex', gap: 2 }}>
                            {[2, 3, 4, 10, 12, 1].map((val, idx) => (
                                <div key={idx} style={{ width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx === 4 ? 'var(--accent-secondary)' : idx < 4 ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: idx <= 4 ? '#000' : 'var(--text-primary)' }}>{val}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>12 &gt; 10, no shift</span>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: 60 }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Pass 5</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Insert 1</span>
                        </div>
                        <div style={{ display: 'flex', gap: 2 }}>
                            {[2, 3, 4, 10, 12, 1].map((val, idx) => (
                                <div key={idx} style={{ width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: idx === 5 ? 'var(--accent-secondary)' : idx < 5 ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: idx <= 5 ? '#000' : 'var(--text-primary)' }}>{val}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1 &lt; all, insert at start</span>
                        </div>
                    </div>

                    {/* Final */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: 60 }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Result</span>
                        </div>
                        <div style={{ display: 'flex', gap: 2 }}>
                            {[1, 2, 3, 4, 10, 12].map((val, idx) => (
                                <div key={idx} style={{ width: 40, height: 40, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--accent-primary)', color: '#000' }}>{val}</div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sorted Array</span>
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

export default InsertionSort;

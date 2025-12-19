import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerFrame from '../../components/Visualizer/VisualizerFrame';
import CodeTrace from '../../components/Visualizer/CodeTrace';
import VariableTrace from '../../components/Visualizer/VariableTrace';
import AlgorithmInfo from '../../components/Visualizer/AlgorithmInfo';
import useVisualizer from '../../hooks/useVisualizer';

const COUNTING_SORT_CODE = `function countingSort(arr) {
  let max = Math.max(...arr);
  let count = new Array(max + 1).fill(0);
  
  for (let i = 0; i < arr.length; i++)
    count[arr[i]]++;
    
  for (let i = 1; i <= max; i++)
    count[i] += count[i - 1];
    
  let output = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }
  return output;
}`;

const countingSortAlgo = (initialData) => {
  let arr = [...initialData];
  const steps = [];
  let n = arr.length;
  let max = Math.max(...arr);
  
  // Limit max for visualization purposes if needed, but datasets are usually small numbers
  // If random data has large numbers, this might break UI. 
  // Assuming datasets.json has reasonable numbers (0-50).
  
  let count = new Array(max + 1).fill(0);
  
  steps.push({
    array: [...arr],
    line: 2,
    vars: { max, action: 'Initialize Count Array' },
    markers: {},
    auxArray: [...count] // Using auxArray to show count array
  });

  // Count frequencies
  for (let i = 0; i < n; i++) {
    steps.push({
      array: [...arr],
      line: 4,
      vars: { i, val: arr[i], action: 'Count Frequency' },
      markers: { [i]: 'Count' },
      auxArray: [...count]
    });
    
    count[arr[i]]++;
    
    steps.push({
      array: [...arr],
      line: 5,
      vars: { i, val: arr[i], count: count[arr[i]], action: 'Increment Count' },
      markers: { [i]: 'Counted' },
      auxArray: [...count]
    });
  }

  // Cumulative count
  for (let i = 1; i <= max; i++) {
    steps.push({
      array: [...arr],
      line: 7,
      vars: { i, 'count[i]': count[i], 'count[i-1]': count[i-1], action: 'Cumulative Sum' },
      markers: {},
      auxArray: [...count]
    });
    
    count[i] += count[i - 1];
    
    steps.push({
      array: [...arr],
      line: 8,
      vars: { i, 'new_count[i]': count[i], action: 'Updated Sum' },
      markers: {},
      auxArray: [...count]
    });
  }

  let output = new Array(n).fill(0);
  
  // Build output
  for (let i = n - 1; i >= 0; i--) {
    steps.push({
      array: [...arr],
      line: 11,
      vars: { i, val: arr[i], action: 'Place in Output' },
      markers: { [i]: 'Process' },
      auxArray: [...count]
    });
    
    let index = count[arr[i]] - 1;
    output[index] = arr[i];
    count[arr[i]]--;
    
    steps.push({
      array: [...output], // Show output array in main view for this phase? 
      // Actually, standard is to show main array transforming. 
      // But here we are building a NEW array.
      // Let's swap 'data' to be 'output' gradually or just show output as main.
      // For visualization consistency, let's keep 'arr' as input and maybe use a second aux?
      // Our hook supports one auxArray. Let's use auxArray for Count, and main array for Input/Output transition.
      // Or better: Main Array = Input, Aux Array = Count. 
      // But we need to show Output. 
      // Let's replace 'arr' with 'output' as we build it? No, that's confusing.
      // Let's use the main array to show the OUTPUT being built, but we need to see INPUT too.
      // Complex visualization. 
      // Simplified: Show Input (arr), Count (aux), and we need a place for Output.
      // Let's overwrite 'arr' with 'output' values as they are placed? 
      // No, Counting sort is not in-place.
      // Let's stick to: Main View = Output (initially empty/zeros), Aux View = Count.
      // And we need to see Input. 
      // Maybe we can't easily visualize 3 arrays with current hook.
      // Let's repurpose: 
      // Main Array = Input (static during build) -> Output (final).
      // Aux Array = Count.
      // We need to see where elements go.
      
      // Alternative: 
      // Phase 1: Main = Input. Aux = Count.
      // Phase 2: Main = Output (gradually filled). Aux = Count.
      
      line: 12,
      vars: { i, val: arr[i], index, action: 'Placed' },
      markers: { [index]: 'Placed' },
      auxArray: [...count]
    });
  }
  
  // Copy output to arr (for final state)
  arr = [...output];
  
  steps.push({
    array: [...arr],
    line: 15,
    vars: { status: 'Sorted' },
    markers: {},
    auxArray: []
  });

  return steps;
};

const CountingSort = () => {
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
    run(countingSortAlgo);
  };

  const isSorted = traceVars.status === 'Sorted';

  return (
    <div className="page-container">
        <VisualizerFrame
        title="Counting Sort"
        dataSize={dataSize}
        setDataSize={setDataSize}
        onRun={handleRun}
        onReset={reset}
        isRunning={isRunning}
        isTLE={isTLE}
        codeTrace={<CodeTrace code={COUNTING_SORT_CODE} activeLine={activeLine} />}
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
                                    markers[idx] === 'Placed' ? 'var(--accent-primary)' : 
                                    markers[idx] === 'Count' ? 'var(--accent-secondary)' : 
                                    markers[idx] === 'Process' ? 'var(--accent-warning)' : 'var(--bg-tertiary)',
                    borderColor: isSorted ? 'var(--accent-primary)' :
                                 markers[idx] ? 'var(--accent-primary)' : 'var(--border-color)',
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
                        <h4>Count Array</h4>
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
            title="Counting Sort"
            definition="Counting Sort is an integer sorting algorithm that operates by counting the number of objects that have each distinct key value. It uses arithmetic on those counts to determine the positions of each key value in the output sequence."
            complexity={{
                time: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' },
                space: 'O(k)'
            }}
            hints={[
                "Efficient when the range of input values (k) is not significantly greater than the number of values (n).",
                "It is a non-comparison based sorting algorithm.",
                "It is often used as a subroutine in other sorting algorithms like Radix Sort."
            ]}
             staticVisual={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', padding: 20 }}>
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                        <span style={{ marginRight: 10, fontWeight: 'bold' }}>Input:</span>
                        {[2, 5, 3, 0, 2, 3, 0, 3].map((v, i) => (
                            <div key={i} style={{ width: 30, height: 30, border: '1px solid #555', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#222' }}>{v}</div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                        <span style={{ marginRight: 10, fontWeight: 'bold' }}>Count:</span>
                         {/* Index labels */}
                        <div style={{ display: 'flex', gap: 5 }}>
                            {[0, 1, 2, 3, 4, 5].map(i => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{ fontSize: 10, color: '#888' }}>{i}</span>
                                    <div style={{ width: 30, height: 30, border: '1px solid #0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#003300' }}>
                                        {i === 0 ? 2 : i === 2 ? 2 : i === 3 ? 3 : i === 5 ? 1 : 0}
                                    </div>
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

export default CountingSort;

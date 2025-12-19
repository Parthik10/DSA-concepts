import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VisualizerFrame from '../../components/Visualizer/VisualizerFrame';
import CodeTrace from '../../components/Visualizer/CodeTrace';
import VariableTrace from '../../components/Visualizer/VariableTrace';
import AlgorithmInfo from '../../components/Visualizer/AlgorithmInfo';
import useVisualizer from '../../hooks/useVisualizer';

const BUCKET_SORT_CODE = `function bucketSort(arr) {
  let n = arr.length;
  if (n <= 0) return;
  
  let buckets = new Array(n).fill(0).map(() => []);
  
  for (let i = 0; i < n; i++) {
    let idx = Math.floor(n * arr[i]); // Assuming 0-1 range, but we adapt
    buckets[idx].push(arr[i]);
  }
  
  for (let i = 0; i < n; i++) {
    buckets[i].sort((a, b) => a - b);
  }
  
  let index = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < buckets[i].length; j++) {
      arr[index++] = buckets[i][j];
    }
  }
}`;

const bucketSortAlgo = (initialData) => {
  let arr = [...initialData];
  const steps = [];
  let n = arr.length;
  
  // Normalize data to 0-1 range for standard bucket sort logic, or adapt logic.
  // Standard bucket sort often assumes uniform distribution [0, 1).
  // Our data is integers 10-100+. 
  // Let's adapt: buckets = n. Index = floor( (value / max_val) * n ).
  
  let maxVal = Math.max(...arr, 1);
  let buckets = new Array(n).fill(0).map(() => []);
  
  // Flatten buckets for auxArray visualization? 
  // We can't easily visualize 2D array in auxArray with current hook.
  // We will serialize it: [b0_val1, b0_val2, '|', b1_val1, ...] or just use markers.
  // Better: Use auxArray to show the currently active bucket or just flat list of all buckets?
  // Let's try to flatten it with separators.
  
  steps.push({
    array: [...arr],
    line: 4,
    vars: { n, maxVal, action: 'Initialize Buckets' },
    markers: {},
    auxArray: []
  });

  // Scatter
  for (let i = 0; i < n; i++) {
    let bucketIdx = Math.floor((arr[i] / (maxVal + 1)) * n);
    
    steps.push({
      array: [...arr],
      line: 7,
      vars: { i, val: arr[i], bucketIdx, action: 'Calculate Bucket Index' },
      markers: { [i]: 'Process' },
      auxArray: flattenBuckets(buckets)
    });
    
    buckets[bucketIdx].push(arr[i]);
    
    steps.push({
      array: [...arr],
      line: 8,
      vars: { i, val: arr[i], bucketIdx, action: 'Push to Bucket' },
      markers: { [i]: 'Pushed' },
      auxArray: flattenBuckets(buckets)
    });
  }

  // Sort Buckets
  for (let i = 0; i < n; i++) {
    if (buckets[i].length > 0) {
        steps.push({
            array: [...arr],
            line: 12,
            vars: { i, bucket: JSON.stringify(buckets[i]), action: 'Sort Bucket' },
            markers: {},
            auxArray: flattenBuckets(buckets)
        });
        
        buckets[i].sort((a, b) => a - b);
        
        steps.push({
            array: [...arr],
            line: 12,
            vars: { i, bucket: JSON.stringify(buckets[i]), action: 'Bucket Sorted' },
            markers: {},
            auxArray: flattenBuckets(buckets)
        });
    }
  }

  // Gather
  let index = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < buckets[i].length; j++) {
      steps.push({
        array: [...arr],
        line: 17,
        vars: { i, j, val: buckets[i][j], index, action: 'Gather from Bucket' },
        markers: { [index]: 'Target' },
        auxArray: flattenBuckets(buckets)
      });
      
      arr[index++] = buckets[i][j];
      
      steps.push({
        array: [...arr],
        line: 18,
        vars: { i, j, val: buckets[i][j], index, action: 'Placed in Array' },
        markers: { [index-1]: 'Placed' },
        auxArray: flattenBuckets(buckets)
      });
    }
  }
  
  steps.push({
    array: [...arr],
    line: 1,
    vars: { status: 'Sorted' },
    markers: {},
    auxArray: []
  });

  return steps;
};

const flattenBuckets = (buckets) => {
    // Helper to flatten buckets for visualization
    // We will use special values/objects to denote separators if needed, 
    // but for simple array viz, maybe just list them.
    // To make it clear, let's add a separator -1 or similar if data is positive.
    // Or just list them sequentially.
    // Let's try to map them to a flat array.
    let flat = [];
    buckets.forEach((b, i) => {
        if (b.length > 0) {
            flat.push(...b);
            // flat.push(-1); // Separator?
        }
    });
    return flat;
};

const BucketSort = () => {
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
    run(bucketSortAlgo);
  };

  const isSorted = traceVars.status === 'Sorted';

  return (
    <div className="page-container">
        <VisualizerFrame
        title="Bucket Sort"
        dataSize={dataSize}
        setDataSize={setDataSize}
        onRun={handleRun}
        onReset={reset}
        isRunning={isRunning}
        isTLE={isTLE}
        codeTrace={<CodeTrace code={BUCKET_SORT_CODE} activeLine={activeLine} />}
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
                                    markers[idx] === 'Process' ? 'var(--accent-secondary)' : 'var(--bg-tertiary)',
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
                        <h4>Buckets Content (Flattened)</h4>
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
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </VisualizerFrame>

        <AlgorithmInfo 
            title="Bucket Sort"
            definition="Bucket Sort is a sorting algorithm that divides the elements into several buckets which are then sorted individually using another sorting algorithm or recursively using the bucket sort algorithm."
            complexity={{
                time: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n²)' },
                space: 'O(n)'
            }}
            hints={[
                "Useful when input is uniformly distributed over a range.",
                "Scatter: Distribute elements into buckets.",
                "Sort: Sort each bucket individually.",
                "Gather: Concatenate sorted buckets."
            ]}
             staticVisual={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', padding: 20 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px dashed #555', padding: 10, borderRadius: 8 }}>
                            <span style={{ marginBottom: 5, color: '#aaa' }}>Bucket 0</span>
                            <div style={{ display: 'flex', gap: 5 }}>
                                <div style={{ width: 25, height: 25, background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>0.12</div>
                                <div style={{ width: 25, height: 25, background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>0.17</div>
                            </div>
                        </div>
                         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px dashed #555', padding: 10, borderRadius: 8 }}>
                            <span style={{ marginBottom: 5, color: '#aaa' }}>Bucket 1</span>
                            <div style={{ display: 'flex', gap: 5 }}>
                                <div style={{ width: 25, height: 25, background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>0.39</div>
                                <div style={{ width: 25, height: 25, background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>0.26</div>
                            </div>
                        </div>
                         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px dashed #555', padding: 10, borderRadius: 8 }}>
                            <span style={{ marginBottom: 5, color: '#aaa' }}>Bucket 2</span>
                            <div style={{ display: 'flex', gap: 5 }}>
                                <div style={{ width: 25, height: 25, background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>0.72</div>
                            </div>
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

export default BucketSort;

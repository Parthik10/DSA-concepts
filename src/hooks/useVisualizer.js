import { useState, useEffect, useRef } from 'react';
import datasets from '../data/datasets.json';

const useVisualizer = (initialSize = 10) => {
    const [dataSize, setDataSize] = useState(initialSize);
    const [data, setData] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isTLE, setIsTLE] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState([]);

    // Trace State
    const [activeLine, setActiveLine] = useState(null);
    const [traceVars, setTraceVars] = useState({});
    const [markers, setMarkers] = useState({});
    const [auxArray, setAuxArray] = useState([]);

    const timeoutRef = useRef(null);
    const speed = Math.max(50, 800 - dataSize * 10); // Slower speed for trace readability

    useEffect(() => {
        resetData();
    }, [dataSize]);

    const resetData = () => {
        stop();
        // Load data from JSON based on size, fallback to random if not found (or closest)
        const rawData = datasets[dataSize.toString()] || datasets["10"];
        setData([...rawData]);

        setIsTLE(false);
        setCurrentStep(0);
        setSteps([]);
        setActiveLine(null);
        setTraceVars({});
        setMarkers({});
        setAuxArray([]);
    };

    const stop = () => {
        setIsRunning(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const run = (algorithm) => {
        if (isRunning) return;

        const startTime = performance.now();
        // Algorithm should return an array of step objects:
        // { array: [], line: 1, vars: {}, markers: {}, auxArray: [] }
        const generatedSteps = algorithm([...data]);
        const endTime = performance.now();

        if (generatedSteps.length > 2000 || (endTime - startTime) > 100) {
            setIsTLE(true);
        } else {
            setIsTLE(false);
        }

        setSteps(generatedSteps);
        setIsRunning(true);
        setCurrentStep(0);
    };

    useEffect(() => {
        if (isRunning && currentStep < steps.length) {
            const step = steps[currentStep];

            timeoutRef.current = setTimeout(() => {
                setData(step.array);
                setActiveLine(step.line);
                setTraceVars(step.vars || {});
                setMarkers(step.markers || {});
                setAuxArray(step.auxArray || []);
                setCurrentStep(prev => prev + 1);
            }, speed);
        } else if (currentStep >= steps.length) {
            setIsRunning(false);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isRunning, currentStep, steps, speed]);

    return {
        data,
        dataSize,
        setDataSize,
        isRunning,
        isTLE,
        run,
        reset: resetData,
        activeLine,
        traceVars,
        markers,
        auxArray
    };
};

export default useVisualizer;

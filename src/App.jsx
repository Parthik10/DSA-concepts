import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import BubbleSort from './pages/Sorting/BubbleSort';
import InsertionSort from './pages/Sorting/InsertionSort';
import SelectionSort from './pages/Sorting/SelectionSort';
import QuickSort from './pages/Sorting/QuickSort';
import MergeSort from './pages/Sorting/MergeSort';
import HeapSort from './pages/Sorting/HeapSort';
import CountingSort from './pages/Sorting/CountingSort';
import BucketSort from './pages/Sorting/BucketSort';
import LinearSearch from './pages/Searching/LinearSearch';
import BinarySearch from './pages/Searching/BinarySearch';
import TopicPage from './pages/TopicPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="topic/sorting/bubble-sort" element={<BubbleSort />} />
          <Route path="topic/sorting/insertion-sort" element={<InsertionSort />} />
          <Route path="topic/sorting/selection-sort" element={<SelectionSort />} />
          <Route path="topic/sorting/quick-sort" element={<QuickSort />} />
          <Route path="topic/sorting/merge-sort" element={<MergeSort />} />
          <Route path="topic/sorting/heap-sort" element={<HeapSort />} />
          <Route path="topic/sorting/counting-sort" element={<CountingSort />} />
          <Route path="topic/sorting/bucket-sort" element={<BucketSort />} />
          <Route path="topic/searching/linear-search" element={<LinearSearch />} />
          <Route path="topic/searching/binary-search" element={<BinarySearch />} />
          <Route path="topic/:topicId/:subTopicId" element={<TopicPage />} />
          <Route path="topic/:topicId" element={<TopicPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { useParams } from 'react-router-dom';

const TopicPage = () => {
  const { topicId } = useParams();

  return (
    <div className="topic-page">
      <h1>Topic: {topicId}</h1>
      <p>Visualization for {topicId} coming soon...</p>
    </div>
  );
};

export default TopicPage;

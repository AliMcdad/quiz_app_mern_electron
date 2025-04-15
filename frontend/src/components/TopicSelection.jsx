const topics = [
  { _id: '1', name: 'Lebanese Songs', description: 'Test your knowledge of historical events', icon: '📚' },
  { _id: '2', name: 'General Knowledge', description: 'Explore scientific concepts and discoveries', icon: '🔬' },
  { _id: '3', name: 'Sports', description: 'Learn about countries and landmarks', icon: '🌎' },
];

export const TopicSelection = ({ onSelect }) => {
  const handleTopicSelect = (topic) => {
    onSelect(topic.name);
  };

  return (
    <div className="selection-container">
      <h2>Select a Topic</h2>
      <div className="topic-grid">
        {topics.map(topic => (
          <div
            key={topic._id}
            className="topic-card"
            onClick={() => handleTopicSelect(topic)}
          >
            <div className="topic-icon">{topic.icon}</div>
            <h3>{topic.name}</h3>
            <p>{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
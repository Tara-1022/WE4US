import React from 'react';
import MemoryCard from './MemoryCard';
import '../styles/MemoriesGallery.css'; 

interface Memory {
  imageUrl: string;
  title: string;
  description: string;
}

interface MemoriesGalleryProps {
  memories: Memory[];
}

const MemoriesGallery: React.FC<MemoriesGalleryProps> = ({ memories }) => {
  return (
    <div className="memories-container">
      <h2 className="memories-title">Our Memories</h2>
      <div className="memories-grid">
        {memories.map((memory, index) => (
          <MemoryCard
            key={index}
            imageUrl={memory.imageUrl}
            title={memory.title}
            description={memory.description}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoriesGallery;

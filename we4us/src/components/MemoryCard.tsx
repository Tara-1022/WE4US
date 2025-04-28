import React from 'react';
import '../styles/MemoryCard.css';

export interface Memory {
  imageUrl: string;
  title: string;
  description: string;
}

interface MemoryCardProps {
  memory: Memory;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory }) => {
  const { imageUrl, title, description } = memory;
  return (
    <div className="memory-card">
      <div className="memory-card-inner">
      <a href={imageUrl} target="_blank" rel="noopener noreferrer">
          <img 
            src={imageUrl} 
            alt={title || "Memory Image"} 
            className="memory-image"
            title="Click to view full image"
          />
        </a>
        <h3 className="memory-title">{title}</h3>
        <p className="memory-description">{description}</p>
      </div>
    </div>
  );
};

export default MemoryCard;

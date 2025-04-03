import React from 'react';
import '../styles/MemoryCard.css';

interface MemoryCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ imageUrl, title, description }) => {
  return (
    <div className="memory-card">
      <div className="memory-card-inner">
        <img 
          src={imageUrl} 
          alt={title} 
          className="memory-image"
        />
        <h3 className="memory-title">{title}</h3>
        <p className="memory-description">{description}</p>
      </div>
    </div>
  );
};

export default MemoryCard;

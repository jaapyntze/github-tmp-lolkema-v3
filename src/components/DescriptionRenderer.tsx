import React from 'react';

interface DescriptionRendererProps {
  text: string;
  className?: string;
}

const DescriptionRenderer: React.FC<DescriptionRendererProps> = ({ text, className }) => {
  const parts = text.split('\n');

  return (
    <p className={className}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
  );
};

export default DescriptionRenderer;
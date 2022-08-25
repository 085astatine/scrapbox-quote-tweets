import React from 'react';

export const Copy: React.FC = () => {
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    alert('WIP');
  };
  return <div onClick={onClick}>Copy</div>;
};

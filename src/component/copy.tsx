import React from 'react';

export interface CopyProps {
  tweetID: bigint | null;
}

export const Copy: React.FC<CopyProps> = (props) => {
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    alert(`tweet ID: ${props.tweetID}`);
  };
  return <div onClick={onClick}>Copy</div>;
};

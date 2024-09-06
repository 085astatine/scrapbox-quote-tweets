import classNames from 'classnames';
import React from 'react';
import SVG from '~/icon/x.svg';

export type XIconProps = {
  className?: string;
} & React.HTMLProps<HTMLElement & SVGElement>;

export const XIcon: React.FC<XIconProps> = ({ className, ...props }) => {
  const padding = 200;
  const minX = -(padding + 27) / 2;
  const minY = -padding / 2;
  const width = 1200 + (padding + 27);
  const height = 1227 + padding;
  return (
    <SVG
      className={classNames('x-icon', className)}
      width={undefined}
      height={undefined}
      viewBox={`${minX} ${minY} ${width} ${height}`}
    />
  );
};

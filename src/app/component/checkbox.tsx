import classNames from 'classnames';
import React from 'react';
import CheckIcon from '~/icon/bootstrap/check2.svg';

export interface CheckboxProps {
  checked: boolean;
  onClick: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onClick }) => {
  return (
    <button className={classNames('checkbox', { checked })} onClick={onClick}>
      <CheckIcon className="icon" width={undefined} height={undefined} />
    </button>
  );
};

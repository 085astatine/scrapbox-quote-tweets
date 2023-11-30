import classNames from 'classnames';
import React from 'react';
import CheckIcon from '~/icon/bootstrap/check2.svg';

export interface CheckboxProps {
  checked: boolean;
  onClick: () => void;
  id?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onClick,
  id,
  disabled = false,
}) => {
  return (
    <button
      className={classNames('checkbox', { checked, disabled })}
      id={id}
      onClick={onClick}
      disabled={disabled}>
      <CheckIcon className="icon" width={undefined} height={undefined} />
    </button>
  );
};

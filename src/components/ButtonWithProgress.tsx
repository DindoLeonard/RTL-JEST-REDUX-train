import React from 'react';
import Spinner from './Spinner';

type IProps = {
  disabled: boolean;
  apiProgress: boolean;
  onClick: (e: React.SyntheticEvent) => void;
  children?: React.ReactElement | string;
};

const ButtonWithProgress = (props: IProps): React.ReactElement => {
  const { disabled, apiProgress, onClick } = props;

  return (
    <button
      disabled={disabled || apiProgress}
      className="btn btn-primary"
      onClick={onClick}
    >
      {apiProgress && <Spinner />}
      {props.children}
    </button>
  );
};

export default ButtonWithProgress;

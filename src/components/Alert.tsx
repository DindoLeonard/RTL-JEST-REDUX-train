import React from 'react';

const Alert = (props: {
  type: string;
  children?: React.ReactElement | string;
  center?: boolean;
}): React.ReactElement => {
  const { type } = props;

  let classForAlert = `alert alert-${type}`;

  if (props.center) {
    classForAlert += ' text-center';
  }

  return (
    <div
      className={classForAlert}
      // data-testid="spinner-loading"
    >
      {props.children}
    </div>
  );
};

Alert.defaultProps = {
  type: 'success',
};

export default Alert;

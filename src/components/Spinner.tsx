import React from 'react';

const Spinner = (props: { size?: string }): React.ReactElement => {
  let spanClass = 'spinner-border';

  if (props.size !== 'big') {
    spanClass += ' spinner-border-sm';
  }
  return (
    <span
      className={spanClass}
      role="status"
      aria-hidden="true"
      data-testid="spinner-loading"
    ></span>
  );
};

export default Spinner;

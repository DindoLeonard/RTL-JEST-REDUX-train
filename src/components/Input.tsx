import React from 'react';

type IProps = {
  label?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  help?: string;
  type?: string;
};

const Input = (props: IProps): React.ReactElement => {
  const { label, id, onChange, help, type } = props;

  let inputClass = 'form-control';
  if (help) {
    inputClass += ' is-invalid';
  }

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        data-testid="input"
        id={id}
        placeholder="username"
        className={inputClass}
        onChange={onChange}
        type={type || 'text'}
      />
      {help && <span className="invalid-feedback">{help}</span>}
    </div>
  );
};

export default Input;

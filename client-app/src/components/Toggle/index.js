import React from "react";

const Toggle = (props) => {
  const {
    text,
    size = "default",
    checked,
    disabled,
    onChange,
    offstyle = "btn-danger",
    onstyle = "btn-success",
  } = props;

  let displayStyle = checked ? onstyle : offstyle;
  return (
    <>
      <label>
        <span className={`${size} switch-wrapper`}>
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e)}
          />
          <span className={`${displayStyle} switch`}>
            <span className="switch-handle" />
          </span>
        </span>
        <span className="switch-label">{text}</span>
      </label>
    </>
  );
};

export default Toggle;

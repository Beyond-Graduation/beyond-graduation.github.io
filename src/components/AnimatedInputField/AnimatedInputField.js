import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import "./AnimatedInputField.css";

function AnimatedInputField({
  id,
  name,
  title,
  type,
  onChange,
  className,
  defaultValue,
  ...rest
}) {
  const [value, setValue] = React.useState("");

  useEffect(() => {
    if (defaultValue) setValue(defaultValue);
    else if (rest.value) setValue(rest.value);
  }, [defaultValue]);

  return (
    <Form.Group
      className={`animated-in ${
        value === "" ? "" : "animate-input"
      }  ${className} ${type === "date" ? "animate-input" : ""}`}
    >
      <Form.Control
        id={id ? id : name}
        name={name}
        type={type ? type : "text"}
        className="animated-in-ip"
        autoComplete="off"
        defaultValue={defaultValue === null ? null : defaultValue}
        onChange={(e) => {
          setValue(e.target.value);
          if (onChange) {
            onChange(e);
          }
        }}
        {...rest}
      />
      <Form.Label for={id ? id : name} className="animated-in-label">
        {title}
      </Form.Label>
    </Form.Group>
  );
}

export default AnimatedInputField;

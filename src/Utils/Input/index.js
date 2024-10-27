import React, { useEffect, useImperativeHandle, useRef } from 'react';
import './index.css'; // Import the CSS file for the styles

function Index(props, ref) {

  const REF = useRef();

  useImperativeHandle(ref, () => ({
    getValue: () => REF.current.value,
    setValue: (value) => REF.current.value = value
  }));

  useEffect(() => {
    if (props.defaultValue) {
        REF.current.value = props.defaultValue;
    }
  }, [props.defaultValue]);

  return (
    <div style={props.style} className="input-wrapper">
      <label className="input-label" style={props.labelStyle ? props.labelStyle : { marginRight: '5px' }}>
        {props.label}
      </label>
      <input style={props.inputStyle ? props.inputStyle : {width:'200px'}} ref={REF} className="styled-input" />
    </div>
  );
}

export default React.forwardRef(Index);

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';
import {format} from 'date-fns'

const Index = forwardRef(({ label }, ref) => {

  const REF=useRef();
  const [selectedDate, setSelectedDate] = useState(null);

  useImperativeHandle(ref, () => ({
    getDate: (inputFormat) => format(selectedDate,inputFormat),
  }));

  return (
    <div className="date-input-container">
      {label && <label className="input-label">{label}</label>}
      <DatePicker
        selected={selectedDate}  
        onChange={(date) => setSelectedDate(date)}     
        dateFormat="yyyy/MM/dd"  
        className="date-picker"  
        placeholderText="Select a date"
        ref={REF}
      />
    </div>
  );
});

export default Index;

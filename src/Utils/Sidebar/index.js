import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Sidebar(props) {
  const navigate = useNavigate();
  return (
    <div className='sidebar' style={props?.style} >
      {props.items?.map((item) => {
        return (
          <button
            key={item.name}
            className={`sidebar-button ${item.active ? 'sidebar-button-active' : ''}`}
            onClick={() => {
            navigate(item.path)
          }}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
}

export default Sidebar;

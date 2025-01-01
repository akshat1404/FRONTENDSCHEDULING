import React, { useRef, useState } from 'react'
import Modal from '../../Utils/Modal';
import Input from '../../Utils/Input';

function Todo() {

  const [add, setAdd] = useState(false);
  const NAME=useRef(), DESCRIPTION=useRef();

  return (
    <div>
        <button className='button blue m-3' onClick={() => setAdd(true)}> 
          Add Item To List
        </button>
        {
          add &&
          <Modal
          
            isOpen={add}
            onClose={() => setAdd(false)}
            onSubmit={()=>{
              setAdd(false);
            }}
            title="Add Item To List"
            ButtonTitle="Add"
          >
            <Input label="Name" ref={NAME} />
            <Input label="Description" textArea={{row:'5',column:'20'}} ref={DESCRIPTION} />
          </Modal>
        }
    </div>
  )
}

export default Todo
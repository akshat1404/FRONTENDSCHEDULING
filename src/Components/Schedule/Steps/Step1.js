import React, { useImperativeHandle, useRef, useState } from 'react'
import Input from '../../../Utils/Input'
import Modal from '../../../Utils/Modal'
import Dropdown from '../../../Utils/Dropdown'
import { useNavigate } from 'react-router-dom'

function Step1({setStep,moveNext},ref) {

    const [isOpen, setIsOpen] = useState(true);
    const navigate=useNavigate();

    const ScheduleRef = useRef();
    const Type = useRef();
    const EmailRef = useRef();

    useImperativeHandle(ref, () => ({        
        getValue: () => {
            return {
                name: ScheduleRef.current.getValue(),
                type: Type.current.getValue(),
                email: EmailRef.current.getValue(),
                // startDate: StartDate.current.getDate('yyyy-MM-dd'),
                // endDate: EndDate.current.getDate('yyyy-MM-dd')
            }
        }
    }));

  return (
    <Modal
        ButtonTitle="Create Tasks"
        title="Create New Schedule"
        isOpen={isOpen}
        onSubmit={()=>{
            if(!ScheduleRef.current.getValue()){
                alert("Please Enter Schedule Name")
                return
            }
            if(!Type.current.getValue()){
                alert("Please Select Schedule Type")
                return
            }
            if(!EmailRef.current.getValue()){
                alert("Please Enter Email")
                return
            }
            moveNext()
        }}
        onClose={() => {
            setIsOpen(false)
            navigate('/schedule');
        }}
    >
        <Input ref={ScheduleRef} label="Schedule Name" />
        <Input ref={EmailRef} label="Get Emails In" />
        <Dropdown ref={Type} title="Schedule Type" options={["Strict", "Non-Strict"]} label={"Schedule Type"} />
        {/* <DatePicker
            label="Start Date"
            ref={StartDate}
        />
        <DatePicker
            label="End Date"
            ref={EndDate}
        /> */}
    </Modal>
  )
}

export default React.forwardRef(Step1)
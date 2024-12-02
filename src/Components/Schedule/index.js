import React, { useEffect, useRef, useState } from 'react';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import {post} from '../../Axios/Axios';
import generateNumericId from '../../Utils/Helper';
import { useNavigate } from 'react-router-dom';

export default function Schedule() {

    const navigate = useNavigate();
    const [payload, setPayload]=useState({})
    const stepData = useRef();
    const [step, setStep]= useState(1);

    const moveNext = async() => {

        const data = stepData.current.getValue();
        Object.entries(data).map(([key, value]) => {
            return setPayload((prev)=>({...prev, [key]: value}))
        })
        setStep(step + 1);
    };
    
    const sendData = async () => {  

        if(payload?.tasks?.length===0){
            alert("Please add atleast one task");
            return;
        }
        const ScheduleId ='Schedule'+generateNumericId();
        payload.id=ScheduleId;
        post('api/schedules', payload, (res) => {
            if(!res.error){
                alert("Schedule Created Successfully");
                navigate('/schedule');
            }
        })
    };

    useEffect(() => {

        if(step === 3){
            sendData();
        }
    }, [step]);

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height:'auto' }}>
            {
                step ===1 && <Step1 setStep={setStep} ref={stepData} moveNext={moveNext} />
            }
            {
                step ===2 && <Step2 setStep={setStep} ref={stepData} moveNext={moveNext}  />
            }
        </div>
    );
}


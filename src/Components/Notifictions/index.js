import React, { useEffect } from 'react'
import { get } from '../../Axios/Axios';
import { useSelector } from 'react-redux';

function Notifictions() {

    const followedSchedule=useSelector(state=>state.schedule);

    useEffect(() => {
        
        if(followedSchedule){
            console.log(followedSchedule)
            return ;
            get(`/notifications/${followedSchedule.id}`, (res) => {
                console.log(res)
            })
        }
    }, []);

    return (
        <div>Notifictions</div>
    )
}

export default Notifictions
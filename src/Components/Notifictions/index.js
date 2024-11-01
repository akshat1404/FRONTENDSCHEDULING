import React, { useEffect } from 'react'
import { get } from '../../Axios/Axios';

function Notifictions() {

    useEffect(() => {
        
        get('/notifications', (res) => {
            console.log(res)
        })
    }, []);

    return (
        <div>Notifictions</div>
    )
}

export default Notifictions
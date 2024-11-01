import { get } from '../../Axios/Axios';
import React, { useEffect, useState } from 'react'
import {Routes, Route, useLocation} from 'react-router-dom';
import Sidebar from '../../Utils/Sidebar';
import Schedule from './index';
import ViewSchedule from './ViewSchedule';

export default function Index() {

    const { pathname } = useLocation();
    const [loading, setLoading] = useState(true);

    const [items, setItems]=useState([])

    const getAllSchedules = () => {
        get('api/schedules', (res) => {
            const newItems=[]

            if(res?.response?.status === 500){
                alert(res?.response?.data?.message);
                return
            }

            res.length >0 && res?.map((item) => {
                return newItems.push({
                    name: item.name,
                    path: `/schedule/${item.id}`,
                    active: pathname.includes(`schedule/${item.id}`)
                })
            }) 
            setItems([ {
                name: "Create New Schedule",
                path: '/schedule/new',
                active: pathname.includes('/schedule/new')
            },...newItems]);
            setLoading(false);
        })
    }

    useEffect(() => {
        getAllSchedules();
    }, [])

    if(loading) return <></>

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar items={items} />
            <Routes>
                <Route exact path="/schedule/:id" element={<ViewSchedule/>} />
                <Route exact path="/schedule/new" element={<Schedule/>} />
            </Routes>
        </div> 
    )
}


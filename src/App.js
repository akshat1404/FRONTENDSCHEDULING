import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Utils/Sidebar';
import Todo from './Components/Todo';
import Auth from './Auth/auth';
import ScheduleRoutes from './Components/Schedule/routes';
import Schedule from './Components/Schedule';
import ViewSchedule from './Components/Schedule/ViewSchedule/ViewSchedule';
import Notifictions from './Components/Notifictions';
import store from 'store';
import { get } from './Axios/Axios';
import { setFollowedSchedule, setNotfied } from './Redux/Reducers/scheduleReducer';
import { useDispatch } from 'react-redux';
import { setUser } from './Redux/Reducers/userReducer';
import { IoIosNotifications } from "react-icons/io";
import { IoStatsChart } from "react-icons/io5";
import Scheduling from './schedulingLogo.png'
import Stats from './Components/Stats';

function App() {
    const token = store.get('token')?.token;
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {

        get('config', (res) => {
            dispatch(setFollowedSchedule({id: res.followedSchedule}));
            dispatch(setNotfied({submittedToday: res.submittedToday}));
            dispatch(setUser({name: res.name, email: res.email}));
        })
    },[])

    const items = [
        {
            name: "Schedule",
            path: '/schedule',
            active: pathname.includes('schedule')
        },
        {
            name: "To-Do List",
            path: '/todo',
            active: pathname.includes('todo')
        }
    ];

    return (
        <>
        {
            !token ?
            <Auth/>
            :
            <>
                <div
                    style={{
                        display: 'flex',
                        borderBottom: '1px solid #ddd',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 20px',
                        backgroundColor: '#f8f9fa',
                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div></div>
                    <img style={{width:'220px',height:'40px',padding:'5px'}} src={Scheduling} alt=''/>
                    <div
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center',gap:'10px' }}
                    >
                        <IoStatsChart onClick={() => navigate('/stats')} style={{ fontSize: '25px', padding: '10px', color: 'rgb(40 182 64)' }} />
                        <IoIosNotifications onClick={() => navigate('/notifictions')} style={{ fontSize: '25px', padding: '10px', color: '#007bff' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
                    <Sidebar
                        style={{
                            borderRight: '2px solid #ddd',
                            backgroundColor: '#f8f9fa',
                            width: '250px',
                            padding: '20px 10px',
                            height: '100%',
                        }}
                        items={items}
                    />
                    <div style={{ flex: 1, backgroundColor: '#ffffff', overflow: 'auto' }}>
                        <Routes>
                            <Route path="/schedule/new" element={<Schedule />} />
                            <Route path="/schedule/:id" element={<ViewSchedule />} />
                            <Route path="/schedule" element={<ScheduleRoutes />} />
                            <Route path="/todo" element={<Todo />} />
                            <Route path="/notifictions" element={<Notifictions />} />
                            <Route path="/stats" element={<Stats />} />
                        </Routes>
                    </div>
                </div>

            </>
        }
        </>
    );
}

export default App;

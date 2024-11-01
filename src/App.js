import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Utils/Sidebar';
import Todo from './Components/Todo';
import Auth from './Auth/auth';
import ScheduleRoutes from './Components/Schedule/routes';
import Schedule from './Components/Schedule';
import ViewSchedule from './Components/Schedule/ViewSchedule';
import Notifictions from './Components/Notifictions';
import store from 'store';

function App() {
    const token = store.get('token')?.token;
    const { pathname } = useLocation();
    const navigate = useNavigate();

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
                <div style={{ display: 'flex', borderBottom: '1px solid black', justifyContent:'space-between' }}>
                    <div>Akshat Tiwari</div>
                    <div>Schedule Management</div>
                    <div onClick={() => navigate('/notifictions')} >Notifications</div>
                </div>
                <div style={{ display: 'flex' }}>
                    <Sidebar style={{borderRight: '5px solid black'}} items={items} />
                    <Routes>
                        <Route path="/schedule/new" element={<Schedule />} />
                        <Route path="/schedule/:id" element={<ViewSchedule />} />
                        <Route path="/schedule" element={<ScheduleRoutes />} />
                        <Route path="/todo" element={<Todo />} />
                        <Route path="/notifictions" element={<Notifictions />} />
                    </Routes>
                </div>
            </>
        }
        </>
    );
}

export default App;

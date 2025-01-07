import React, { useEffect, useState } from 'react';
import { get, post } from '../../Axios/Axios';
import { useSelector } from 'react-redux';
import { Checkbox, Button, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Divider } from '@mui/material';

function Notifications() {
    const [data, setData] = useState();
    const [checkedTasks, setCheckedTasks] = useState([]);
    const {id: followedSchedule,submittedToday} = useSelector(state => state.schedule);

    const checkTimeAndFetchNotifications = () => {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        return hours === 23 && minutes >= 0 && minutes < 60;
    };

    useEffect(() => {
        if (followedSchedule && checkTimeAndFetchNotifications()) {
            get(`notifications/${followedSchedule}`, (res) => {
                setData(res);
            });
        }
    }, [followedSchedule]);

    const handleToggle = (taskId) => {
        setCheckedTasks((prevChecked) =>
            prevChecked.includes(taskId)
                ? prevChecked.filter((id) => id !== taskId)
                : [...prevChecked, taskId]
        );
    };

    const handleSubmit = () => {

        post('userTasks/submitTasks',{scheduleId: followedSchedule, completedTasks: checkedTasks}, (res) => {
            if(!res.error){
                window.location.href='/stats';
            }
        });
    };

    if(!data){
        return (
            <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
                <Typography variant="h5" gutterBottom>
                    Today's Tasks
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Tasks will be displayed here from 11:00 PM to 11:59 PM
                </Typography>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            {
                submittedToday ? 

                <Typography variant="h4" style={{width:'max-content'}}>
                    Tasks Already Submitted for today
                </Typography>
                :
                <>
                <Typography variant="h5" gutterBottom>
                    Today's Tasks
                </Typography>
                <List>
                    {data.map((task) => (
                        <div key={task.id}>
                            <ListItem>
                                <ListItemText
                                    primary={task.title}
                                    secondary={`Start: ${new Date(task.start).toLocaleTimeString()} - End: ${new Date(task.end).toLocaleTimeString()}`}
                                />
                                <ListItemSecondaryAction>
                                    <Checkbox
                                        edge="end"
                                        checked={checkedTasks.includes(task.id)}
                                        onChange={() => handleToggle(task.id)}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </List>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    style={{ marginTop: '20px' }}
                >
                    Submit
                </Button>
                </>
            }
        </div>
    );
}

export default Notifications;

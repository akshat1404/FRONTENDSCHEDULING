import React, { useEffect, useRef, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from '../../../Utils/Modal';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Input from '../../../Utils/Input';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'; // Adapter for moment.js
import generateNumericId from '../../../Utils/Helper';
import { useParams } from 'react-router-dom';
import { get, patch , put, Delete} from '../../../Axios/Axios';
import {useDispatch, useSelector} from 'react-redux';
import { setFollowedSchedule } from '../../../Redux/Reducers/scheduleReducer';
import './ViewSchedule.css';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

function ViewSchedule() {

  const {id} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const TASKNAME=useRef();
  const [edit, setEdit] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ startTime: new Date(), endTime: new Date(), name: '' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [type, setType] = useState(undefined);
  const followedSchedule=useSelector(state => state.schedule.id);

  const init = () =>{
    get(`api/schedules/${id}`, (res) => {
      const tasks = res.tasks;
      setType(res.type);
      const correctTaskForm = tasks.map((task) => ({
        start: new Date(task.start),
        end: new Date(task.end),      
        title: task.title,            
        id: task.id                   
      }));
      setTasks(correctTaskForm);
    });
  }

  useEffect(() => {
    init();
  }, [id]);
  

  const openModal = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setNewTask({
      startTime: slotInfo.start,
      endTime: slotInfo.end,
      name: '',
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewTask({ startTime: new Date(), endTime: new Date(), name: '' });
  };

  const addTask = () => {
    const { startTime, endTime } = newTask;
    let name = TASKNAME.current.getValue();
    const now = moment();
    const startMoment = moment(startTime);

    if (
        !name || moment(endTime).isSameOrBefore(startTime) ||(startMoment.isBefore(now, "day")) || (startMoment.isSame(now, "day") && startMoment.isBefore(now))
    ) return ;

    const taskId='task'+generateNumericId();
    const newTaskEntry = { start: startTime, end: endTime, title: name, id: taskId };

    const newTasks = tasks.filter((task) => {
      const cond1 = !moment(task.start).isBetween(startTime, endTime) && !moment(task.end).isBetween(startTime, endTime);
      const cond2 = !(moment(startTime).isBetween(task.start, task.end) || moment(endTime).isBetween(task.start, task.end));
      return cond1 && cond2;
    });
    
    setTasks([...newTasks, newTaskEntry]);
    closeModal();
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let style = {
      backgroundColor: '#7eb7ff',
      borderRadius: '5px',
      padding:0,
      margin:0,
      border: 'none',
      color: 'black',
      display: 'block',
    };
    return {
      style: style
    };
  };

  const editTask = () => {
    const { startTime, endTime } = newTask;
    let name = TASKNAME.current.getValue();
    if (!name || moment(endTime).isSameOrBefore(startTime)) return;
    const newTaskEntry = { start: startTime, end: endTime, title: name, id: edit.id };
    const newTasks = tasks.filter((task) => task.id !== edit.id);
    setTasks([...newTasks, newTaskEntry]);
    closeModal();
  };

  if(tasks.length===0) return <></>

  return (
    <div style={{padding:'20px'}} >
      <div className='flex mb-5 space-between' style={{gap:'10px'}} >
        <div className='flex' style={{gap:'10px'}} >
          <button className='button-blue'
            onClick={()=>{
              patch(`api/schedules/${id}`, {followed: true}, (res) => {
                dispatch(setFollowedSchedule({id}));
              }); 
            }}
          >
          {followedSchedule!==id ? "Follow This Schedule":"Followed Schedule"}
          </button>
          <button className='button-green'
            onClick={()=>{
              put(`api/schedules/${id}`, {tasks}, (res) => {
                if(!res.error){
                  init();
                }
              }); 
            }}
          >
          Update This Schedule</button>
        </div>
        <button className='button-red'
          onClick={()=>{
            Delete(`api/schedules/${id}`, {}, (res) => {
              return ;
              if(!res.error){
                navigate('/schedule')
              }
            }); 
          }}
        >
        Delete This Schedule</button>
    </div>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className="weekly-planner">
        <Calendar
          localizer={localizer}
          events={tasks}
          views={{ week: true }}
          defaultView="week"
          selectable
          onSelectSlot={openModal}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700, width: 1000, padding:20 }}
          step={60}
          timeslots={1}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) =>{setNewTask({startTime:event.start,endTime:event.end,name:event.title,id:event.id});setEdit(event)}}
          />
        
        <Modal
          isOpen={edit}
          onClose={() => setEdit(false)}
          onSubmit={() => {
            if(type==='Strict'){
              alert("You Cannot Edit Tasks In Strict Schedule");
              return;
            }
            editTask();
            setEdit(false)
          }}
          title="Edit Task"
          ButtonTitle="Edit Task"
          DeleteButtonTitle="Delete Task"
          onDelete={() => {
            if(type==='Strict'){
              alert("You Cannot Delete Tasks In Strict Schedule");
              return;
            }
            const newTasks = tasks.filter((task) => task.id !== edit.id);
            setTasks([...newTasks]);
            setEdit(false);
          }}
          >
           <Input
            label="Task Name"
            defaultValue={edit.title}
            ref={TASKNAME}
          />
          
          <div className="time-inputs">
            <p>Day: {moment(selectedSlot?.start).format('dddd')}</p>

            <TimePicker
              label="Start Time"
              value={moment(edit.start)}
              onChange={(newValue) => setNewTask({ ...newTask, startTime: newValue?.toDate() })}
              renderInput={(params) => <Input {...params} />}
              />

            <TimePicker
              label="End Time"
              value={moment(edit.end)}
              onChange={(newValue) => setNewTask({ ...newTask, endTime: newValue?.toDate() })}
              renderInput={(params) => <Input {...params} />}
              />
          </div>
        </Modal>
        <Modal
          isOpen={modalIsOpen && type==="Non-Strict"}
          onClose={closeModal}
          onSubmit={addTask}
          title="Add Task"
          ButtonTitle="Add Task"
          >
          <Input
            label="Task Name"
            value={newTask.name}
            ref={TASKNAME}
            />
          
          <div className="time-inputs">
            <p>Day: {moment(selectedSlot?.start).format('dddd')}</p>

            <TimePicker
              label="Start Time"
              value={moment(newTask.startTime)}
              onChange={(newValue) => setNewTask({ ...newTask, startTime: newValue?.toDate() })}
              renderInput={(params) => <Input {...params} />}
              />

            <TimePicker
              label="End Time"
              value={moment(newTask.endTime)}
              onChange={(newValue) => setNewTask({ ...newTask, endTime: newValue?.toDate() })}
              renderInput={(params) => <Input {...params} />}
              />
          </div>
        </Modal>
      </div>
    </LocalizationProvider>
  </div>
  );
}

export default ViewSchedule;

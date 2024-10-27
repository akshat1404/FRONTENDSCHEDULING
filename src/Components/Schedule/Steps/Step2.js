import React, { useImperativeHandle, useRef, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from '../../../Utils/Modal';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Input from '../../../Utils/Input';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'; // Adapter for moment.js
import generateNumericId from '../../../Utils/Helper';

const localizer = momentLocalizer(moment);

function Step2({moveNext, setStep},ref) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ startTime: new Date(), endTime: new Date(), name: '' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [edit, setEdit] = useState(false);
  const TASKNAME=useRef();

  useImperativeHandle(ref,()=>({
    getValue: ()=>{
      return ({
        tasks
      })
    }
  }))

  const openModal = (slotInfo) => {
    const currentDate = new Date();
    if(slotInfo.start>currentDate){

      setSelectedSlot(slotInfo);
      setNewTask({
        startTime: slotInfo.start,
        endTime: slotInfo.end,
        name: '',
      });
      setModalIsOpen(true);
      return ;
    }
    alert("Tasks Can be created only on future date");
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewTask({ startTime: new Date(), endTime: new Date(), name: '' });
  };

  const addTask = () => {
    const { startTime, endTime } = newTask;
    let name = TASKNAME.current.getValue();
    if(!name){
      alert("Please Enter Task Name");
      return
    }
    if (endTime < startTime) {
      alert("End time should be greater than start time");
      return
    }
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

  const editTask = () => {
    const { startTime, endTime } = newTask;
    console.log(startTime, endTime);
    let name = TASKNAME.current.getValue();
    if (!name || moment(endTime).isSameOrBefore(startTime)) return;
    const newTaskEntry = { start: startTime, end: endTime, title: name, id: edit.id };
    const newTasks = tasks.filter((task) => task.id !== edit.id);
    setTasks([...newTasks, newTaskEntry]);
    closeModal();
  };

  const CreateSchedule = async() => {

    const currentDate = new Date();

    const validTasks=tasks.filter((task) => {
      return task.start>currentDate;
    })

    await setTasks(validTasks);
    moveNext();
  }

  return (
    <div>
    <button onClick={()=>CreateSchedule()} style={{margin:'15px', fontSize:'20px'}} >
      Create Schedule
    </button>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className="weekly-planner">
        <Calendar
          localizer={localizer}
          events={tasks}
          views={{ week: true, month: true }}
          defaultView="week"
          selectable
          onSelectSlot={openModal}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600, width: 900 }}
          step={60}
          timeslots={1}
          onSelectEvent={(e) => {setEdit(e)}}
          />

        <Modal
          isOpen={edit}
          onClose={() => setEdit(false)}
          onSubmit={() => {
            editTask();
            setEdit(false)
          }}
          title="Edit Task"
          ButtonTitle="Edit Task"
          DeleteButtonTitle="Delete Task"
          onDelete={() => {
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
          isOpen={modalIsOpen}
          onClose={closeModal}
          onSubmit={addTask}
          title="Add Task"
          ButtonTitle="Add Task"
          >
          <Input
            label="Task Name"
            defaultValue={newTask.name}
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

export default React.forwardRef(Step2);

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import axios from "axios";
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done';

const { uuid } = require('uuidv4');

const socket = io("http://localhost:5000/");
function Main(){
    let { id } = useParams();
    const location = useLocation();
    const [active, setActive] = useState('');
    const [completedValue, setCompletedValue] = useState('');
    const [pendingValue, setPendingValue] = useState('');
    const [activeValue, setActiveValue] = useState('');
    const [pendingData, setPendingData] = useState([]);
    const [activeData, setActiveData] = useState([]);
    const [completedData, setCompletedData] = useState([]);
    const [refresh, setRefresh] = useState(true);

    useEffect(async() => {
        const res = await axios.get(`http://localhost:4000/getPendingData/${id}`)
        setPendingData(res.data.data.pending)
        setActiveData(res.data.data.ongoing)
        setCompletedData(res.data.data.finsished)
        console.log(res.data.data.pending)
        socket.on("Hey", (arg1) => {
            setActive(arg1.activeUsers);
        });
    }, [refresh])
    const addPending = async () => {
        var dt = new Date();
        var date = dt.getDate() + " / " + (dt.getMonth() + 1) + " / " + dt.getFullYear();
        await axios.post('http://localhost:4000/addData', { roomID: id, type:"Pending", taskID: uuid(), name: pendingValue, createdAt: date, createdBy: "AB" })
        setRefresh((curr) => !curr)
        setPendingValue('')
    }
    const addCompleted = async() => {
        var dt = new Date();
        var date = dt.getDate() + " / " + (dt.getMonth() + 1) + " / " + dt.getFullYear();
        await axios.post('http://localhost:4000/addData', { roomID: id, type:"Completed", taskID: uuid(), name: completedValue, createdAt: date, createdBy: "AB", completedAt: date })
        setRefresh((curr) => !curr)
        setCompletedValue('')
    }
    const addActive = async() => {
        var dt = new Date();
        var date = dt.getDate() + " / " + (dt.getMonth() + 1) + " / " + dt.getFullYear();
        await axios.post('http://localhost:4000/addData', { roomID: id, type:"Active", taskID: uuid(), name: activeValue, createdAt: date, createdBy: "AB" })
        setRefresh((curr) => !curr)
        setActiveValue('')
    }
    const removeData = async(taskID, type) => {
        if(taskID !== undefined && type !== undefined)
        await axios.post('http://localhost:4000/removeData', { id, taskID, type })
        setRefresh((curr) => !curr)
    }
    const nextLevel = async(taskID, createdBy, name, createdAt,type) => {
        var dt = new Date();
        var completedAt = dt.getDate() + " / " + (dt.getMonth() + 1) + " / " + dt.getFullYear();
        await axios.post('http://localhost:4000/nextLevel', { id, taskID, createdBy, name, createdAt,type, completedAt })
        setRefresh((curr) => !curr)
    }
    return (
        <div>
            <h1>{active}</h1>
            <h1>{location.state.roomID}</h1>
            <div class="search-container">
                <div class="search-item">
                    <Typography variant="h4">Pending</Typography>
                    <input type="text" value={pendingValue} onChange={(e) => setPendingValue(e.target.value)} />
                    <button onClick={addPending}>Add</button>
                    {pendingData.map((row) => (
                        <div>
                            <Typography variant="h6" display="inline" >{row.name}</Typography>
                            <DoneIcon onClick={() => nextLevel(row.taskID, row.createdBy, row.name, row.createdAt, "Pending")} />
                            <CancelIcon onClick={() => removeData(row.taskID, "Pending")} />
                        </div>
                    ))}
                </div>
                <div class="search-item">
                    <Typography variant="h4">Active</Typography>
                    <input type="text" value={activeValue} onChange={(e) => setActiveValue(e.target.value)} />
                    <button onClick={addActive}>Add</button>
                    {activeData.length > 0 && activeData.map((row) => (
                        <div>
                            <Typography variant="h6" display="inline" >{row.name}</Typography>
                            <DoneIcon onClick={() => nextLevel(row.taskID, row.createdBy, row.name, row.createdAt, "Active")} />
                            <CancelIcon onClick={() => removeData(row.taskID, "Active")} />
                        </div>
                    ))}
                </div>
                <div class="search-item">
                    <Typography variant="h4">Completed</Typography>
                    <input type="text" value={completedValue} onChange={(e) => setCompletedValue(e.target.value)} />
                    <button onClick={addCompleted}>Add</button>
                    {completedData.length > 0 && completedData.map((row) => (
                        <div>
                            <Typography variant="h6" display="inline" >{row.name}</Typography>
                            <CancelIcon onClick={() => removeData(row.taskID, "Completed")} />
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
    )
}

export default Main;
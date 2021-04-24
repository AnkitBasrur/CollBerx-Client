import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import axios from "axios";

const { uuid } = require('uuidv4');

const socket = io("http://localhost:5000/");
function Main(){
    let { id } = useParams();
    console.log(id)
    const location = useLocation();
    const [active, setActive] = useState('');
    const [completedValue, setCompletedValue] = useState('');
    const [pendingValue, setPendingValue] = useState('');
    const [activeValue, setActiveValue] = useState('');

    useEffect(async() => {
        const pendingData = await axios.get(`http://localhost:4000/getPendingData/${id}`)
        console.log(pendingData)
        socket.on("Hey", (arg1) => {
            setActive(arg1.activeUsers);
        });
    })
    const addPending = async () => {
        var dt = new Date();
        var date = dt.getDate() + " / " + (dt.getMonth() + 1) + " / " + dt.getFullYear();
        await axios.post('http://localhost:4000/addData', { roomID: id, type:"Pending", taskID: uuid(), name: pendingValue, createdAt: date, createdBy: "AB" })
    }
    const addCompleted = () => {
        console.log(completedValue)
    }
    const addActive = () => {
        console.log(activeValue)
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
                </div>
                <div class="search-item">
                    <Typography variant="h4">Active</Typography>
                    <input type="text" value={activeValue} onChange={(e) => setActiveValue(e.target.value)} />
                    <button onClick={addActive}>Add</button>
                </div>
                <div class="search-item">
                    <Typography variant="h4">Completed</Typography>
                    <input type="text" value={completedValue} onChange={(e) => setCompletedValue(e.target.value)} />
                    <button onClick={addCompleted}>Add</button>

                </div>
                
            </div>
        </div>
    )
}

export default Main;
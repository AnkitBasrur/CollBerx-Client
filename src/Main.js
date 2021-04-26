import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { useContext } from "react";
import {ThemeContext} from './contexts/ThemeContext'
import { useParams } from "react-router-dom";
import axios from "axios";
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done';

const { uuid } = require('uuidv4');

const socket = io("http://localhost:5000/");
function Main(){
    let { id } = useParams();
    const { isLightTheme, light, dark, toggleTheme } = useContext(ThemeContext);
    const theme = isLightTheme ? light : dark;

    const [completedValue, setCompletedValue] = useState('');
    const [pendingValue, setPendingValue] = useState('');
    const [activeValue, setActiveValue] = useState('');
    const [pendingData, setPendingData] = useState([]);
    const [activeData, setActiveData] = useState([]);
    const [completedData, setCompletedData] = useState([]);
    const [chatData, setChatData] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [chatValue, setChatValue] = useState('')

    const WhiteTextTypography = withStyles({
        root: {
          color: theme.text
        }
    })(Typography);

    useEffect(async() => {
        const res = await axios.get(`http://localhost:4000/getPendingData/${id}`)
        socket.emit("new data", { data: res.data.data })

        socket.on("new data from server", (arg1) => {
            setPendingData(arg1.data.data.pending)
            setActiveData(arg1.data.data.ongoing)
            setCompletedData(arg1.data.data.finsished)
            setChatData(arg1.data.data.chat);
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
    const addChat = async() => {
        await axios.post('http://localhost:4000/addChat', { id, text: chatValue, from: "Ankit", chatID: uuid() })
        setRefresh((curr) => !curr)
    }
    return (
        <div style={{height: "100vh", backgroundColor: theme.ui}}>
            <h1>{id}</h1>
            <button onClick={() => toggleTheme} >Toggle</button>
            <div class="search-container">
                <div class="search-item" style={{ backgroundColor: theme.box}}>
                    <WhiteTextTypography variant="h4">Pending</WhiteTextTypography>
                    <input type="text" value={pendingValue} onChange={(e) => setPendingValue(e.target.value)} />
                    <button onClick={addPending}>Add</button>
                    {pendingData.map((row) => (
                        <div key={row.taskID} style={{ backgroundColor: theme.innerBox, marginBottom: "10px"}}>
                            <WhiteTextTypography variant="h6" display="inline" >{row.name}</WhiteTextTypography>
                            <DoneIcon style={{color: theme.text, marginLeft: "3%"}} onClick={() => nextLevel(row.taskID, row.createdBy, row.name, row.createdAt, "Pending")} />
                            <CancelIcon style={{color: theme.text}} onClick={() => removeData(row.taskID, "Pending")} />
                        </div>
                    ))}
                </div>
                <div class="search-item" style={{ backgroundColor: theme.box}}>
                    <WhiteTextTypography variant="h4">Active</WhiteTextTypography>
                    <input type="text" value={activeValue} onChange={(e) => setActiveValue(e.target.value)} />
                    <button onClick={addActive}>Add</button>
                    {activeData.length > 0 && activeData.map((row) => (
                        <div key={row.taskID} style={{ backgroundColor: theme.innerBox, marginBottom: "10px"}}>
                            <WhiteTextTypography variant="h6" display="inline" >{row.name}</WhiteTextTypography>
                            <DoneIcon style={{color: theme.text, marginLeft: "3%"}} onClick={() => nextLevel(row.taskID, row.createdBy, row.name, row.createdAt, "Active")} />
                            <CancelIcon style={{color: theme.text}} onClick={() => removeData(row.taskID, "Active")} />
                        </div>
                    ))}
                </div>
                <div class="search-item" style={{ backgroundColor: theme.box }}>
                    <WhiteTextTypography variant="h4">Completed</WhiteTextTypography>
                    <input type="text" value={completedValue} onChange={(e) => setCompletedValue(e.target.value)} />
                    <button onClick={addCompleted}>Add</button>
                    {completedData.length > 0 && completedData.map((row) => (
                        <div key={row.taskID} style={{ backgroundColor: theme.innerBox, marginBottom: "10px"}}>
                            <WhiteTextTypography variant="h6" display="inline" >{row.name}</WhiteTextTypography>
                            <CancelIcon style={{color: theme.text, marginLeft: "3%"}} onClick={() => removeData(row.taskID, "Completed")} />
                        </div>
                    ))}
                </div>
                <div style={{marginLeft: "7%", marginRight: "5%", backgroundColor: theme.box}} class="search-item">
                    <WhiteTextTypography variant="h4">Chat</WhiteTextTypography>
                    {chatData.length > 0 && chatData.map((row) => (
                        <div style={{ textAlign: "left"}}>
                            <WhiteTextTypography variant="h6" display="inline" ><b>{row.from} : </b></WhiteTextTypography>
                            <WhiteTextTypography variant="h6" display="inline" >{row.text}</WhiteTextTypography>
                        </div>
                    ))}
                    <input type="text" value={chatValue} onChange={(e) => setChatValue(e.target.value)} />
                    <button onClick={addChat}>Add</button>
                    
                </div>
                
            </div>
        </div>
    )
}

export default Main;
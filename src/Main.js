import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import { useContext } from "react";
import {ThemeContext} from './contexts/ThemeContext'
import { useParams } from "react-router-dom";
import axios from "axios";
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done';
import NavBar from "./NavBar";
import Modal from 'react-modal'

const { uuid } = require('uuidv4');
const styles = {
    light: {
        color: "black",
        fontSize: "22px"
    },
    dark: {
        color: "white",
        fontSize: "22px"
    }
};
const socket = io("http://localhost:5000/");
function Main(props){
    let { id } = useParams();
    const { isLightTheme, light, dark } = useContext(ThemeContext);
    const theme = isLightTheme ? light : dark;
    const { classes } = props;

    const outerModal = { 
        modal: {
            backgroundColor: "green",
        },
        overlay: {
            backgroundColor: theme.modalBackground
        }, 
        content: {
            width:'40%',
            height: '70%',
            alignContent:'center',
            marginLeft: "28%",
            marginTop: "3%",
            overflow: 'auto',
            backgroundColor: theme.modalColor,
            border: 'none'
        }
    }
    const innerModal = { 
        modal: {
            backgroundColor: "green",
        },
        overlay: {
            backgroundColor: theme.modalBackground
        }, 
        content: {
            width:'10%',
            height: '10%',
            alignContent:'center',
            marginLeft: "28%",
            marginTop: "3%",
            overflow: 'auto',
            backgroundColor: theme.modalColor,
            border: 'none'
        }
    }
    const [completedValue, setCompletedValue] = useState('');
    const [pendingValue, setPendingValue] = useState('');
    const [activeValue, setActiveValue] = useState('');
    const [pendingData, setPendingData] = useState([]);
    const [activeData, setActiveData] = useState([]);
    const [completedData, setCompletedData] = useState([]);
    const [chatData, setChatData] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [chatValue, setChatValue] = useState('')
    const [authLevel, setAuthLevel] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [project, setProject] = useState("");

    const ThemeTextTypography = withStyles({
        root: {
          color: theme.text
        }
    })(Typography);

    useEffect(() => {
        const fetchData = async() => {
            const res = await axios.get(`http://localhost:4000/getPendingData/${id}/${sessionStorage.getItem("email")}`)
            setAuthLevel(res.data.authLevel)
            socket.emit("new data", { data: res.data.data })
            setRefresh(false)
            socket.on("new data from server", (arg1) => {
                console.log("fetchh")
                setProject(arg1.data.data)
                setPendingData(arg1.data.data.pending)
                setActiveData(arg1.data.data.ongoing)
                setCompletedData(arg1.data.data.finsished)
                setChatData(arg1.data.data.chat);
            });
            socket.on("Hey", (arg1) => {

            })
        }
        if(refresh)
            fetchData()
    }, [refresh])

    const changeAuthLevel = async(user, level) => {
        if(authLevel !== "Level X" || user === sessionStorage.getItem("email")) 
            return
        await axios.post('http://localhost:4000/changeAuth', {id, user, level});
        setRefresh(true)
    }
    const addPending = async () => {
        if(authLevel === "Level Z")
            return;
        var dt = new Date();
        var date = dt.getDate() + " / " + (dt.getMonth() + 1) + " / " + dt.getFullYear();
        await axios.post('http://localhost:4000/addData', { roomID: id, type:"Pending", taskID: uuid(), name: pendingValue, createdAt: date, createdBy: "AB" })
        setRefresh(true)
        setPendingValue('')
    }
    const addCompleted = async() => {
        if(authLevel === "Level Z")
            return;
        var dt = new Date();
        var date = dt.getDate() + " / " + (dt.getMonth() + 1) + " / " + dt.getFullYear();
        await axios.post('http://localhost:4000/addData', { roomID: id, type:"Completed", taskID: uuid(), name: completedValue, createdAt: date, createdBy: "AB", completedAt: date })
        setRefresh(true)
        setCompletedValue('')
    }
    const addActive = async() => {
        if(authLevel === "Level Z")
            return;
        var dt = new Date();
        var date = dt.getDate() + " / " + (dt.getMonth() + 1) + " / " + dt.getFullYear();
        await axios.post('http://localhost:4000/addData', { roomID: id, type:"Active", taskID: uuid(), name: activeValue, createdAt: date, createdBy: "AB" })
        setRefresh(true)
        setActiveValue('')
    }
    const removeData = async(taskID, type) => {
        if(authLevel === "Level Z")
            return;
        if(taskID !== undefined && type !== undefined)
        await axios.post('http://localhost:4000/removeData', { id, taskID, type })
        setRefresh(true)
    }
    const nextLevel = async(taskID, createdBy, name, createdAt,type) => {
        if(authLevel === "Level Z")
            return;
        var dt = new Date();
        var completedAt = dt.getDate() + " / " + (dt.getMonth() + 1) + " / " + dt.getFullYear();
        await axios.post('http://localhost:4000/nextLevel', { id, taskID, createdBy, name, createdAt,type, completedAt })
        setRefresh(true)
    }
    const addChat = async() => {
        await axios.post('http://localhost:4000/addChat', { id, text: chatValue, from: sessionStorage.getItem("email"), chatID: uuid() })
        setChatValue('')
        setRefresh(true)
    }
    if(showModal){
        return(
        <Modal scrollable={true} ariaHideApp={false} isOpen={showModal} onRequestClose={()=>setShowModal(false) }
        style={outerModal} >
          <div >
                {project.members.map((curr, i) => (
                    <div key={i}>
                        <ThemeTextTypography display="inline" style={{fontFamily: "serif"}} variant="h3">{curr.name}</ThemeTextTypography>
                        <div style={{display: 'inline', float: "right"}}>
                            <Button onClick={() => changeAuthLevel(curr.id, "Level X")}>{curr.authLevel === "Level X" ? <ThemeTextTypography variant="h6" style={{color: "#ed1c00", fontFamily: "fantasy"}}>Level X</ThemeTextTypography> : <ThemeTextTypography style={{fontFamily: "fantasy"}} variant="h6">Level X</ThemeTextTypography> }</Button>
                            <Button onClick={() => changeAuthLevel(curr.id, "Level Y")}>{curr.authLevel === "Level Y" ? <ThemeTextTypography variant="h6" style={{color: "#ed1c00", fontFamily: "fantasy"}}>Level Y</ThemeTextTypography> : <ThemeTextTypography style={{fontFamily: "fantasy"}} variant="h6">Level Y</ThemeTextTypography> }</Button>
                            <Button onClick={() => changeAuthLevel(curr.id, "Level Z")}>{curr.authLevel === "Level Z" ? <ThemeTextTypography variant="h6" style={{color: "#ed1c00", fontFamily: "fantasy"}}>Level Z</ThemeTextTypography> : <ThemeTextTypography style={{fontFamily: "fantasy"}} variant="h6">Level Z</ThemeTextTypography> }</Button>
                        </div>
                    </div>
                ))}
          </div>
          
        </Modal>
        )
    }
    else{
        return (
            <>
            <NavBar />
            <div style={{ minHeight: "100vh", backgroundColor: theme.ui}}>
            <ThemeTextTypography variant="h4">{project.name}</ThemeTextTypography>
            {project.members ? <ThemeTextTypography variant="h4" onClick={() => setShowModal(true)}>{project.members.length}</ThemeTextTypography> : null }

                <div class="search-container">
                    <div class="search-item" style={{ backgroundColor: theme.box}}>
                        <ThemeTextTypography variant="h4">Pending</ThemeTextTypography>
                        <TextField label="Add To Pending Tasks" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} style={{backgroundColor: theme.button }} type="text" value={pendingValue} onChange={(e) => setPendingValue(e.target.value)} />
                        <Button style={{backgroundColor: theme.button, color: theme.text }} onClick={addPending}>Add</Button>
                        {pendingData.map((row) => (
                            <div key={row.taskID} style={{ backgroundColor: theme.innerBox, marginBottom: "10px"}}>
                                <ThemeTextTypography variant="h6" display="inline" >{row.name}</ThemeTextTypography>
                                <DoneIcon style={{color: theme.text, marginLeft: "3%"}} onClick={() => nextLevel(row.taskID, row.createdBy, row.name, row.createdAt, "Pending")} />
                                <CancelIcon style={{color: theme.text}} onClick={() => removeData(row.taskID, "Pending")} />
                            </div>
                        ))}
                    </div>
                    <div class="search-item" style={{ backgroundColor: theme.box}}>
                        <ThemeTextTypography variant="h4">Active</ThemeTextTypography>
                        <TextField label="Add To Active Tasks" type="text" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} style={{backgroundColor: theme.button }} value={activeValue} onChange={(e) => setActiveValue(e.target.value)} />
                        <Button style={{backgroundColor: theme.button, color: theme.text }} onClick={addActive}>Add</Button>
                        {activeData.length > 0 && activeData.map((row) => (
                            <div key={row.taskID} style={{ backgroundColor: theme.innerBox, marginBottom: "10px"}}>
                                <ThemeTextTypography variant="h6" display="inline" >{row.name}</ThemeTextTypography>
                                <DoneIcon style={{color: theme.text, marginLeft: "3%"}} onClick={() => nextLevel(row.taskID, row.createdBy, row.name, row.createdAt, "Active")} />
                                <CancelIcon style={{color: theme.text}} onClick={() => removeData(row.taskID, "Active")} />
                            </div>
                        ))}
                    </div>
                    <div class="search-item" style={{ backgroundColor: theme.box }}>
                        <ThemeTextTypography variant="h4">Completed</ThemeTextTypography>
                        <TextField label="Add To Completed Tasks" type="text" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} style={{backgroundColor: theme.button }} value={completedValue} onChange={(e) => setCompletedValue(e.target.value)} />
                        <Button style={{backgroundColor: theme.button, color: theme.text }} onClick={addCompleted}>Add</Button>
                        {completedData.length > 0 && completedData.map((row) => (
                            <div key={row.taskID} style={{ backgroundColor: theme.innerBox, marginBottom: "10px"}}>
                                <ThemeTextTypography variant="h6" display="inline" >{row.name}</ThemeTextTypography>
                                <CancelIcon style={{color: theme.text, marginLeft: "3%"}} onClick={() => removeData(row.taskID, "Completed")} />
                            </div>
                        ))}
                    </div>
                    <div style={{marginLeft: "7%", marginRight: "5%", backgroundColor: theme.box}} class="search-item">
                        <ThemeTextTypography variant="h4">Chat</ThemeTextTypography>
                        {chatData.length > 0 && chatData.map((row) => (
                            <div style={{ textAlign: "left"}}>
                                <ThemeTextTypography variant="h6" display="inline" ><b>{row.from} : </b></ThemeTextTypography>
                                <ThemeTextTypography variant="h6" display="inline" >{row.text}</ThemeTextTypography>
                            </div>
                        ))}
                        <TextField label="Type Your Message Here" type="text" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} style={{backgroundColor: theme.button }} value={chatValue} onChange={(e) => setChatValue(e.target.value)} />
                        <Button style={{backgroundColor: theme.button, color: theme.text }} onClick={addChat}>Send</Button>
                        
                    </div>
                </div>
            </div>
            </>
        )
    }
}

export default withStyles(styles)(Main);
import { useEffect, useRef, useState } from "react";
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
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import InputAdornment from '@material-ui/core/InputAdornment';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
const socket = io("https://rooms-server-side.herokuapp.com/");
function Main(props){
    const divRef = useRef(null)
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
    const [pendingError, setPendingError] = useState('');
    const [activeError, setActiveError] = useState('');
    const [completedError, setCompletedError] = useState('');
    const [changeAuthError, setChangeAuthError] = useState('');
    const [chatError, setChatError] = useState('');

    const ThemeTextTypography = withStyles({
        root: {
          color: theme.text
        }
    })(Typography);

    useEffect(() => {
        const fetchData = async() => {
            const res = await axios.get(`https://rooms-server-side.herokuapp.com/getPendingData/${id}/${sessionStorage.getItem("email")}`)
            setAuthLevel(res.data.authLevel)
            socket.emit("new data", { data: res.data.data })
            setRefresh(false)
            socket.on("new data from server", (arg1) => {
                setProject(arg1.data.data)
                arg1.data.data.members.map(member => {if(member.id === sessionStorage.getItem("email")) setAuthLevel(member.authLevel)} )
                setPendingData(arg1.data.data.pending)
                setActiveData(arg1.data.data.ongoing)
                setCompletedData(arg1.data.data.finsished)
                setChatData(arg1.data.data.chat);
                divRef && divRef.current && divRef.current.scrollIntoView && divRef.current.scrollIntoView({ behavior: 'smooth', block: 'end'});
            });
        }
        if(refresh)
            fetchData()
    }, [refresh])

    const changeAuthLevel = async(user, level) => {
        if(user === sessionStorage.getItem("email")){
            setChangeAuthError("Cannot change your own level");
            setTimeout(() => {
                setChangeAuthError("");
            }, 5000)
            return;
        }
        if(authLevel !== "Level X") {
            setChangeAuthError("You dont have required permission");
            setTimeout(() => {
                setChangeAuthError("");
            }, 5000)
            return;
        }
        await axios.post('https://rooms-server-side.herokuapp.com/changeAuth', {id, user, level});
        setRefresh(true)
    }
    const addPending = async () => {
        if(pendingValue.length === 0) {
            setPendingError("Invalid task entered");
            setTimeout(() => {
                setPendingError("");
            }, 5000)
            return;
        }
        if(authLevel === "Level Z"){
            setPendingError("You dont have required permission");
            setTimeout(() => {
                setPendingError("");
            }, 5000)
            return;
        }
        var dt = new Date();
        var date = dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
        await axios.post('https://rooms-server-side.herokuapp.com/addData', { roomID: id, type:"Pending", taskID: uuid(), name: pendingValue, createdAt: date, createdBy: sessionStorage.getItem("email") })
        setRefresh(true)
        setPendingValue('')
    }
    const addCompleted = async() => {
        if(completedValue.length === 0) {
            setCompletedError("Invalid task entered");
            setTimeout(() => {
                setCompletedError("");
            }, 5000)
            return;
        }
        if(authLevel === "Level Z"){
            setCompletedError("You dont have required permission");
            setTimeout(() => {
                setCompletedError("");
            }, 5000)
            return;
        }
        var dt = new Date();
        var date = dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
        await axios.post('https://rooms-server-side.herokuapp.com/addData', { roomID: id, type:"Completed", taskID: uuid(), name: completedValue, createdAt: date, createdBy: sessionStorage.getItem("email"), completedAt: date })
        setRefresh(true)
        setCompletedValue('')
    }
    const addActive = async() => {
        if(activeValue.length === 0) {
            setActiveError("Invalid task entered");
            setTimeout(() => {
                setActiveError("");
            }, 5000)
            return;
        }
        if(authLevel === "Level Z"){
            setActiveError("You dont have required permission");
            setTimeout(() => {
                setActiveError("");
            }, 5000)
            return;
        }
        var dt = new Date();
        var date = dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
        await axios.post('https://rooms-server-side.herokuapp.com/addData', { roomID: id, type:"Active", taskID: uuid(), name: activeValue, createdAt: date, createdBy: sessionStorage.getItem("email") })
        setRefresh(true)
        setActiveValue('')
    }
    const removeData = async(taskID, type) => {
        if(authLevel === "Level Z"){
            if(type === "Pending"){
                setPendingError("You dont have required permission");
                setTimeout(() => {
                    setPendingError("");
                }, 5000)
            }
            else if(type === "Active"){
                setActiveError("You dont have required permission");
                setTimeout(() => {
                    setActiveError("");
                }, 5000)
            }
            else{
                setCompletedError("You dont have required permission");
                setTimeout(() => {
                    setCompletedError("");
                }, 5000)
            }
            return;
        }
        if(taskID !== undefined && type !== undefined){
            await axios.post('https://rooms-server-side.herokuapp.com/removeData', { id, taskID, type })
            setRefresh(true)
        }
    }
    const nextLevel = async(taskID, createdBy, name, createdAt,type) => {
        if(authLevel === "Level Z"){
            if(type === "Pending"){
                setPendingError("You dont have required permission");
                setTimeout(() => {
                    setPendingError("");
                }, 5000)
            }
            else if(type === "Active"){
                setActiveError("You dont have required permission");
                setTimeout(() => {
                    setActiveError("");
                }, 5000)
            }
            else{
                setCompletedError("You dont have required permission");
                setTimeout(() => {
                    setCompletedError("");
                }, 5000)
            }
            return;
        }
        var dt = new Date();
        var completedAt = dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
        await axios.post('https://rooms-server-side.herokuapp.com/nextLevel', { id, taskID, createdBy, name, createdAt,type, completedAt })
        setRefresh(true)
    }
    const addChat = async() => {
        if(chatValue.length === 0) {
            setChatError("Invalid message");
            setTimeout(() => {
                setChatError("");
            }, 5000)
            return;
        }
        await axios.post('https://rooms-server-side.herokuapp.com/addChat', { id, text: chatValue, from: sessionStorage.getItem("email"), chatID: uuid() })
        setChatValue('')
        setRefresh(true)
    }
    const onDragEnd = async(result) => {
        if(!result.destination) return;
        const { source, destination, droppableId } = result;
        await axios.post('https://rooms-server-side.herokuapp.com/drag', {source, destination, draggableId: result.draggableId, id});
        setRefresh(true)
    }
    if(showModal){
        return(
        <Modal scrollable={true} ariaHideApp={false} isOpen={showModal} onRequestClose={()=>setShowModal(false) }
        style={outerModal} >
          <div >
          {changeAuthError ? <ThemeTextTypography style={{color: "red"}} variant="h7"><b>{changeAuthError}</b></ThemeTextTypography> : null}
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
            <div style={{ minHeight: "93.5vh", backgroundColor: theme.ui}}>
                <div style={{textAlign: "center"}}>
                    <ThemeTextTypography display="inline" style={{fontWeight: "bold", fontFamily:"serif"}} variant="h3">{project.name}</ThemeTextTypography>
                    <ThemeTextTypography style={{ cursor: "pointer" }} display="inline" onClick={() => {navigator.clipboard.writeText(id)}} variant="h4">🔗</ThemeTextTypography>
                    {project.members ?<PeopleAltIcon style={{ cursor: "pointer", marginLeft: "5%", color: theme.text}} fontSize="large" onClick={() => setShowModal(true)}/> : null }
                </div>
                <DragDropContext onDragEnd={result => onDragEnd(result)}>

                <div class="search-container" style={{ minHeight: "30vh"}}>
                <div class="search-item" style={{  maxHeight: "70vh", minHeight: "70vh", backgroundColor: theme.innerBox}}>
                <ThemeTextTypography style={{fontFamily: "Georgia"}} variant="h4"><b>Pending</b></ThemeTextTypography>
                <TextField label="Add Pending Task" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ endAdornment: ( <InputAdornment><Button style={{ marginBottom: "25%", backgroundColor: theme.button, color: theme.text }} onClick={addPending}>Add</Button></InputAdornment>), className: isLightTheme ? classes.light: classes.dark }} style={{ backgroundColor: theme.input }} type="text" value={pendingValue} onChange={(e) => setPendingValue(e.target.value)} />
                {pendingError ? <ThemeTextTypography style={{color: "red"}} variant="h7"><b>{pendingError}</b></ThemeTextTypography> : null}
                <div style={{marginTop:"3%", overflowY: "auto", maxHeight: "85%", overflowX: "hidden"}}>
                <Droppable key="Pending" droppableId="Pending">
                {(provided, snapshot) => {
                    return (
                        <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: theme.innerBox,
                          padding: 4,
                          width: "100%"
                        }}
                      >
                                {pendingData.map((row,i) => (
                                    <div style={{ backgroundColor: theme.innerBox, marginBottom: "10px"}} >
                                    <Draggable
                                        key={row.taskID}
                                        draggableId={row.taskID}
                                        index={i}
                                    >
                                    {(provided, snapshot) => {
                                        return (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                    userSelect: "none",
                                                    padding: 16 ,
                                                    margin: "0 0 0px 0",
                                                    minHeight: "50px",
                                                    backgroundColor: snapshot.isDragging
                                                        ? "#7d7c7c"
                                                        : "#545353",
                                                    color: "white",
                                                    ...provided.draggableProps.style
                                                    }}
                                            >
                                                <ThemeTextTypography style={{fontFamily: "DejaVu Sans Mono, monospace"}} variant="h6" display="inline" >{row.name}</ThemeTextTypography>
                                                <div style={{float: "right"}}>
                                                    <DoneIcon style={{ cursor: "pointer", color: theme.text}} onClick={() => nextLevel(row.taskID, row.createdBy, row.name, row.createdAt, "Pending")} />
                                                    <CancelIcon style={{ cursor: "pointer", color: theme.text}} onClick={() => removeData(row.taskID, "Pending")} />
                                                </div><br />
                                                <ThemeTextTypography style={{fontFamily: "DejaVu Sans Mono, monospace", textAlign: "left",  float:"left", color: theme.textNotImp}} variant="h6" >- {row.createdBy}</ThemeTextTypography>
                                                <ThemeTextTypography style={{fontFamily: "DejaVu Sans Mono, monospace", textAlign: "right", float: "right", color: theme.textNotImp}} variant="h6">{row.createdAt}</ThemeTextTypography>
                                            </div>
                                        );
                                    }}
                                    </Draggable>
                                    </div>
                                ))}
                                
                        {provided.placeholder}
                      </div>                        
                    );
                    }}
                    </Droppable>
                    </div>
                    </div>
                    <div class="search-item" style={{  maxHeight: "70vh", minHeight: "70vh", backgroundColor: theme.innerBox}}>
                <ThemeTextTypography style={{fontFamily: "Georgia"}} variant="h4"><b>Active</b></ThemeTextTypography>
                <TextField label="Add Active Task" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ endAdornment: ( <InputAdornment><Button style={{ marginBottom: "25%", backgroundColor: theme.button, color: theme.text }} onClick={addActive}>Add</Button></InputAdornment>), className: isLightTheme ? classes.light: classes.dark }} style={{ backgroundColor: theme.input }} type="text" value={activeValue} onChange={(e) => setActiveValue(e.target.value)} />
                {activeError ? <ThemeTextTypography style={{color: "red"}} variant="h7"><b>{activeError}</b></ThemeTextTypography> : null}
                <div style={{marginTop:"3%", overflowY: "auto", maxHeight: "85%", overflowX: "hidden"}}>
                <Droppable key="Active" droppableId="Active">
                {(provided, snapshot) => {
                    return (
                        <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: theme.innerBox,
                          padding: 4,
                          width: "100%"
                        }}
                      >
                                {activeData.map((row,i) => (
                                    <div style={{ backgroundColor: theme.innerBox, marginBottom: "10px"}} >
                                    <Draggable
                                        key={row.taskID}
                                        draggableId={row.taskID}
                                        index={i}
                                    >
                                    {(provided, snapshot) => {
                                        return (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                    userSelect: "none",
                                                    padding: 16 ,
                                                    margin: "0 0 0px 0",
                                                    minHeight: "50px",
                                                    backgroundColor: snapshot.isDragging
                                                        ? "#7d7c7c"
                                                        : "#545353",
                                                    color: "white",
                                                    ...provided.draggableProps.style
                                                    }}
                                            >
                                                <ThemeTextTypography style={{fontFamily: "DejaVu Sans Mono, monospace"}} variant="h6" display="inline" >{row.name}</ThemeTextTypography>
                                                <div style={{float: "right"}}>
                                                    <DoneIcon style={{ cursor: "pointer", color: theme.text}} onClick={() => nextLevel(row.taskID, row.createdBy, row.name, row.createdAt, "Active")} />
                                                    <CancelIcon style={{ cursor: "pointer", color: theme.text}} onClick={() => removeData(row.taskID, "Active")} />
                                                </div><br />
                                                <ThemeTextTypography style={{fontFamily: "DejaVu Sans Mono, monospace", textAlign: "left",  float:"left", color: theme.textNotImp}} variant="h6" >- {row.createdBy}</ThemeTextTypography>
                                                <ThemeTextTypography style={{fontFamily: "DejaVu Sans Mono, monospace", textAlign: "right", float: "right", color: theme.textNotImp}} variant="h6">{row.createdAt}</ThemeTextTypography>
                                            </div>
                                        );
                                    }}
                                    </Draggable>
                                    </div>
                                ))}
                                
                        {provided.placeholder}
                      </div>                        
                    );
                    }}
                    </Droppable>
                    </div>
                    </div>
                    <div class="search-item" style={{  maxHeight: "70vh", minHeight: "70vh", backgroundColor: theme.innerBox}}>
                <ThemeTextTypography style={{fontFamily: "Georgia"}} variant="h4"><b>Completed</b></ThemeTextTypography>
                <TextField label="Add Completed Task" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ endAdornment: ( <InputAdornment><Button style={{ marginBottom: "25%", backgroundColor: theme.button, color: theme.text }} onClick={addCompleted}>Add</Button></InputAdornment>), className: isLightTheme ? classes.light: classes.dark }} style={{ backgroundColor: theme.input }} type="text" value={completedValue} onChange={(e) => setCompletedValue(e.target.value)} />
                {completedError ? <ThemeTextTypography style={{color: "red"}} variant="h7"><b>{completedError}</b></ThemeTextTypography> : null}
                <div style={{marginTop:"3%", overflowY: "auto", maxHeight: "85%", overflowX: "hidden"}}>
                <Droppable key="Completed" droppableId="Completed">
                {(provided, snapshot) => {
                    return (
                        <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: theme.innerBox,
                          padding: 4,
                          width: "100%"
                        }}
                      >
                                {completedData.map((row,i) => (
                                    <div style={{ backgroundColor: theme.innerBox, marginBottom: "10px"}} >
                                    <Draggable
                                        key={row.taskID}
                                        draggableId={row.taskID}
                                        index={i}
                                    >
                                    {(provided, snapshot) => {
                                        return (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                    userSelect: "none",
                                                    padding: 16 ,
                                                    margin: "0 0 0px 0",
                                                    minHeight: "50px",
                                                    backgroundColor: snapshot.isDragging
                                                        ? "#7d7c7c"
                                                        : "#545353",
                                                    color: "white",
                                                    ...provided.draggableProps.style
                                                    }}
                                            >
                                                <ThemeTextTypography style={{fontFamily: "DejaVu Sans Mono, monospace"}} variant="h6" display="inline" >{row.name}</ThemeTextTypography>
                                                <div style={{float: "right"}}>
                                                    <CancelIcon style={{ cursor: "pointer", color: theme.text}} onClick={() => removeData(row.taskID, "Completed")} />
                                                </div><br />
                                                <ThemeTextTypography style={{fontFamily: "DejaVu Sans Mono, monospace", textAlign: "left",  float:"left", color: theme.textNotImp}} variant="h6" >- {row.createdBy}</ThemeTextTypography>
                                                <ThemeTextTypography style={{fontFamily: "DejaVu Sans Mono, monospace", textAlign: "right", float: "right", color: theme.textNotImp}} variant="h6">{row.createdAt}</ThemeTextTypography>
                                            </div>
                                        );
                                    }}
                                    </Draggable>
                                    </div>
                                ))}
                                
                        {provided.placeholder}
                      </div>                        
                    );
                    }}
                    </Droppable>
                    </div>
                    </div>
                    
                    <div style={{ maxHeight: "50vh", minHeight: "50vh", marginLeft: "7%", marginRight: "5%", backgroundColor: theme.innerBox}} class="search-item">
                        <ThemeTextTypography style={{fontFamily: "Georgia"}} variant="h4"><b>Chat</b></ThemeTextTypography>
                        {chatError ? <ThemeTextTypography style={{color: "red"}} variant="h7"><b>{chatError}</b></ThemeTextTypography> : null}
                        <div style={{overflowY: "auto", maxHeight: "80%", overflowX: "hidden"}}>
                            {chatData.length > 0 && chatData.map((row) => (
                                <div style={{ textAlign: "left"}}>
                                    <ThemeTextTypography style={{fontFamily: "Georgia"}} variant="h6" display="inline" ><b>{row.from} : </b></ThemeTextTypography>
                                    <ThemeTextTypography style={{fontFamily: "DejaVu Sans Mono, monospace"}} variant="h6" display="inline" >{row.text}</ThemeTextTypography>
                                </div>
                            ))}
                            <div ref={divRef} className="list-bottom"></div>
                        </div>
                        <TextField label="Type Your Message" type="text" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ endAdornment: ( <InputAdornment><Button style={{ marginBottom: "25%", backgroundColor: theme.button, color: theme.text }} onClick={addChat}>Send</Button></InputAdornment>), className: isLightTheme ? classes.light: classes.dark }} style={{ position: "fixed", bottom: "27%", right: "4.8%", backgroundColor: theme.input }} value={chatValue} onChange={(e) => setChatValue(e.target.value)} />                        
                    </div>
                </div>
                </DragDropContext>
            </div>
            </>
        )
    }
}

export default withStyles(styles)(Main);
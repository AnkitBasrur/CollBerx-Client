import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";


const socket = io("http://localhost:5000/");
function Main(){
    const location = useLocation();
    const [active, setActive] = useState('');

    useEffect(() => {

        socket.on("Hey", (arg1) => {
            setActive(arg1.activeUsers);
        });

    })
    return (
        <div>
            <h1>{active}</h1>
            <h1>{location.state.roomID}</h1>
        </div>
    )
}

export default Main;
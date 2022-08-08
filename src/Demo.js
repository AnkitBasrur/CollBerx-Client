import { useContext } from "react";
import {ThemeContext} from './contexts/ThemeContext'
import { withStyles } from "@material-ui/core/styles";
import LoginNavBar from "./LoginNavBar";
import AspectRatio from '@mui/joy/AspectRatio';

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

function Logs(props) {
    
    const { isLightTheme, light, dark } = useContext(ThemeContext);
    const theme = isLightTheme ? light : dark;

    return(
        <div>
            <LoginNavBar />
            <div className="App" style={{ minHeight: "100vh", maxHeight:"auto", width: "100%", backgroundColor: theme.ui}}>
                <div style={{ paddingBottom: "1%", paddingTop: "5%", marginLeft:"20%", marginRight:"20%", textAlign: "left"}}>
                    <AspectRatio objectFit="contain">
                        <iframe src="https://www.youtube.com/embed/1Niwoq4A4iA" title="Demo" allowFullScreen></iframe>
                    </AspectRatio>
                </div>
            </div>
        </div>    
    )
}

export default withStyles(styles)(Logs);
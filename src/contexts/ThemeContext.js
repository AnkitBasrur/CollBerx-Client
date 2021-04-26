import { createContext, Component} from 'react';

export const ThemeContext = createContext();

class ThemeContextProvider extends Component {
    state = { 
        isLightTheme: false,
        light: {
            text: 'black',
            ui: '#ebe8e8',
            box: 'ebe8e8',
            innerBox: '#cccaca',
            button: '#d4d5d6'
        },
        dark: {
            text: '#ffffff',
            ui: 'black',
            box: '#4a4848',
            innerBox: 'black',
            button: '#343536'
        }
     }
     toggleTheme = () => { 
         console.log("jj")
         this.setState({ isLightTheme: !this.state.isLightTheme })
     }
    render() { 
        return (
            <ThemeContext.Provider value={{...this.state, toggleTheme: this.toggleTheme }}>
                {this.props.children}
            </ThemeContext.Provider>
        );
    }
}
 
export default ThemeContextProvider;
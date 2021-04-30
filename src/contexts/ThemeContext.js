import { createContext, Component} from 'react';

export const ThemeContext = createContext();

class ThemeContextProvider extends Component {
    state = { 
        isLightTheme: false,
        light: {
            text: 'black',
            ui: '#ebe8e8',
            box: '#828181',
            innerBox: '#cccaca',
            button: '#d4d5d6',
            placeholder: '#949392',
            navbar: '#c7c6c5',
            modalColor: '#fcfcfc',
            modalBackground: '#bab8b8',
            textNotImp: '#757474'
        },
        dark: {
            text: '#ffffff',
            ui: 'black',
            box: '#1f1f1f',
            innerBox: '#3d3d3d',
            button: '#343536',
            placeholder: '#949392',
            navbar: '#242323',
            modalColor: '#000000',
            modalBackground: '#454444',
            textNotImp: '#c4c2c2'
        }
     }
     toggleTheme = () => { 
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
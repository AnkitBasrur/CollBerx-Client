import { io } from "socket.io-client";
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import {useEffect, useState} from 'react';
import './App.css';
import Home from "./Home";
import Main from "./Main";
import Login from "./Login";
import ThemeContextProvider from "./contexts/ThemeContext";
import AddRoom from "./AddRoom";

function App() {
  function getProps(data){
    console.log(data)
  }
  return (
    <ThemeContextProvider>
          <Router>
            <Switch>
              <Route exact path="/">
                <Login />
              </Route>
              <Route exact path="/home">
                <Home getProps={getProps} />
              </Route>
              <Route exact path="/main/:id" component={Main} />
              <Route exact path="/addRoom">
                <AddRoom />
              </Route>
            </Switch>
          </Router>
    </ThemeContextProvider>
  );
}

export default App;

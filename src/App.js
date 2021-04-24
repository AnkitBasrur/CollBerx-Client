import { io } from "socket.io-client";
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import {useEffect, useState} from 'react';
import './App.css';
import Home from "./Home";
import Main from "./Main";
import Login from "./Login";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/main/:id">
          <Main />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

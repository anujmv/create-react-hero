import React from "react";
import ReactDOM from "react-dom";
import logo from "../public/assest/logo.svg";
import "./index.css";
const App = () => (
  <div className="container">
    <img src={logo} />
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));

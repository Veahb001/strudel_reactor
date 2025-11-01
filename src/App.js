import React from "react";
import StrudelDemo from './components/strudelDemo/StrudelDemo.jsx';
import "./App.css";
import Header from "./components/strudelDemo/Header.jsx";

function App() {
  return (
    <div className="App">
      <Header/>
      <StrudelDemo />
    </div>
  );
}

export default App;
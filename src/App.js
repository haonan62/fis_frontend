// import logo from './logo.svg';
// import './App.css';
import Navbar from "./Navbar";
// fix the blur link issue
// import BackupNavbar from "./BackupNavbar";
import Home from "./Home"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FFA from "./FFA";
import ExploratoryPage from "./ExploratoryPage";
import WhatIfPage from "./WhatIfPage";
import TestComponentPage from "./TestComponentPage";
function App() {
  return (
    <Router>
      <div className="App">
        
        {/* <Navbar /> */}
        {/* <BackupNavbar/> */}
        
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>
            <Route path="/ffa">
              <FFA/>
            </Route>
            <Route path="/explore">
              <ExploratoryPage/>
            </Route>
            <Route path="/what-if-scenario">
              <WhatIfPage/>
            </Route>

            <Route path="/test">
              <TestComponentPage/>
            </Route>
          </Switch>
          
        </div>
      </div>
    </Router>
  );
}

export default App;


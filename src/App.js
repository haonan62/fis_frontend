// import logo from './logo.svg';
// import './App.css';
import Navbar from "./Navbar";
import Home from "./Home"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FFA from "./FFA";
import ExploratoryPage from "./ExploratoryPage";
function App() {
  return (
    <Router>
      <div className="App">
        
        <Navbar />
        
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
          </Switch>
          
        </div>
      </div>
    </Router>
  );
}

export default App;


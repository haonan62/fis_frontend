// import css from './NavBar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h3>
                CITIC Commodities

            </h3>
            <div className="links">
                <a href="/">Home</a>
                <a href="/explore">Explore data</a>
                {/* <a href="/prediction">Prediction</a> */}
                <a href="/what-if-scenario">What-If Scenario</a>
                <a href="/FFA">FFA strategies</a>
                
            </div>
        </nav>
      );
}
 
export default Navbar;
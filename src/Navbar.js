const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>
                CITIC Commodities

            </h1>
            <div className="links">
                <a href="/">Home</a>
                <a href="/explore">Explore data</a>
                <a href="/prediction">Prediction</a>
                <a href="/FFA">FFA strategies</a>
                
            </div>
        </nav>
      );
}
 
export default Navbar;
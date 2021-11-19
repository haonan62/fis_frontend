// import css from './NavBar.css';
import { Navbar, Nav } from 'react-bootstrap';
const BackupNavbar = () => {
    return (
        <Navbar bg="light" variant="light">
            <Navbar.Brand href="/">Citic Commodities</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="./explore">Explore Data</Nav.Link>
                <Nav.Link href="./FFA">FFA</Nav.Link>
                <Nav.Link href="./prediction">Prediction</Nav.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default BackupNavbar;
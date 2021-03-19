import { useState } from "react";
import BlogList from "./BlogList";
// import useFetchGet from "./useFetchGet";

import { Container, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const Home = () => {

    // const [name, setName] = useState("sample");
    // const [age, setAge]= useState(30);
    // const handleClick=()=>{
    //     setName("another sample");
    //     setAge(100);
    // }
    const [blogs, setBlogs] = useState(
        [{ title: "sample1", body: "duang", author: "rua", id: 1 },
        { title: "sample2", body: "ding", author: "kuang", id: 2 },
        { title: "sample3", body: "kusuokusuo", author: "biang", id: 3 }]
    )

    //retrieve freight data
    // const { data: freightData, isDataLoading, error } = useFetchGet("http://localhost:5000/api/freights");

    // const handleDelete=(id)=>{
    //     const newBlogs=blogs.filter(blog=>blog.id!== id);
    //     setBlogs(newBlogs);
    // }

    const position = [51.505, -0.09]
    return (
        <div className="home">
            <h2>
                Homepage
            </h2>
            <Container fluid>
                <Row>
                    <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
                        </Marker>
                    </MapContainer>,
                </Row>
            </Container>
            {/* {error && <div>{error}</div>}
            {isDataLoading && <div>Loading Data</div>} */}
            {/* <BlogList blogs={blogs} handleDelete={handleDelete}></BlogList> */}

            {/* <p>{name} is {age} years old</p>
            <button onClick={handleClick}>Click</button> */}
        </div>
    );
}

export default Home;
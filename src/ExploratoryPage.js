import { useState } from "react";
import BlogList from "./BlogList";
// import useFetchGet from "./useFetchGet";

import LineChart from './LineChart';
import { Container, Row, Col } from 'react-bootstrap';

const ExploratoryPage = () => {
    const c5Fields = ["Week Ending On", "C5TC", "C5"];
    const bunkerFeild = ["Week Ending On","Bunker"];
    const chinaCongestion= ["Week Ending On","China Congestion"];
    const wausCongestion=["Week Ending On","WAus Congestion"];
    const australiaLoadings=["Week Ending On","Australia Loadings"];
    const brazilLoadings=["Week Ending On","Brazil Loadings"];
    return ( 
        <div className="explore">
            <Container fluid>
                <Row>
                    <Col><LineChart variables={c5Fields}></LineChart></Col>
                    <Col><LineChart variables={bunkerFeild}></LineChart></Col>
                    <Col><LineChart variables={chinaCongestion}></LineChart></Col>
                    
                </Row>
                <Row>
                    <Col><LineChart variables={wausCongestion}></LineChart></Col>
                    <Col><LineChart variables={australiaLoadings}></LineChart></Col>
                    <Col><LineChart variables={brazilLoadings}></LineChart></Col>
                </Row>
            </Container>
        </div>
     );
}
 
export default ExploratoryPage;
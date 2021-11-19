import { useState } from "react";
import BlogList from "./BlogList";
// import useFetchGet from "./useFetchGet";

import CanvasLineChart from './CanvasLineChart';
import PlotlyLineChart from './PlotlyLineChart';
import { Container, Row, Col } from 'react-bootstrap';

const ExploratoryPage = () => {
    const c5Fields = ["Week Ending On", "C5TC", "C5"];
    const bunkerFeild = ["Week Ending On", "Bunker"];
    const chinaCongestion = ["Week Ending On", "China Congestion"];
    const wausCongestion = ["Week Ending On", "WAus Congestion"];
    const australiaLoadings = ["Week Ending On", "Australia Loadings"];
    const brazilLoadings = ["Week Ending On", "Brazil Loadings"];

    const c5Configs={"fields":c5Fields,"breakdown_by_year":false};
    const bunkerConfigs={"fields":bunkerFeild,"breakdown_by_year":true};
    const chinaConfigs={"fields":chinaCongestion,"breakdown_by_year":false};
    const wausConfigs={"fields":wausCongestion,"breakdown_by_year":false};
    const australiaConfigs={"fields":australiaLoadings,"breakdown_by_year":false};
    const brazilConfigs={"fields":brazilLoadings,"breakdown_by_year":false};
    return (
        <div className="explore">
            <Container fluid>
                <Row>
                    {/* <Col><PlotlyLineChart variables={c5Fields}></PlotlyLineChart></Col> */}
                    <Col><PlotlyLineChart variables={bunkerConfigs}></PlotlyLineChart></Col>
                    <Col><PlotlyLineChart variables={chinaConfigs}></PlotlyLineChart></Col>

                </Row>
                <Row>
                    <Col><PlotlyLineChart variables={wausConfigs}></PlotlyLineChart></Col>
                    <Col><PlotlyLineChart variables={australiaConfigs}></PlotlyLineChart></Col>
                    <Col><PlotlyLineChart variables={brazilConfigs}></PlotlyLineChart></Col>
                </Row>
            </Container>
        </div>
    );
}

export default ExploratoryPage;
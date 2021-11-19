import { useState } from "react";
import BlogList from "./BlogList";
import useFetchPost from "./useFetchPost";

import { Container, Row, Col, Dropdown, DropdownButton, Button } from 'react-bootstrap';
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
// import FreightMap from "./FreightMap";
//temp indicator impact, later will be relocated to backend with real data
import { RouteConfigurations, tempIndicatorImpact, tempDates, tempDatesDict } from "./RouteConfigurations";

import Nouislider from "nouislider-react";

import Plot from 'react-plotly.js';
import PlotlyLineChart from './PlotlyLineChart';
import PlotlyRadarChart from './PlotlyRadarChart';
import StaticShipCoordinates from './StaticShipCoordinates';

const Home = () => {

    // const handleClick=()=>{
    //     setName("another sample");
    //     setAge(100);
    // }

    // const handleDelete=(id)=>{
    //     const newBlogs=blogs.filter(blog=>blog.id!== id);
    //     setBlogs(newBlogs);
    // }
    
    const routeRegionMapping={
        "C2":["North Atlantic"],
        "C3": ["Far East","South East Asia","Indian Ocean"],
        "C5":["Far East","South East Asia","Indian Ocean"],
        "C7":["North Atlantic"],

    };
    
    const { data: mainPageWeeklyDataForFreightMap, isDataLoading: isMapDataLoading, error } = useFetchPost("http://localhost:5000/api/weekly_data", ({ "main_page_normalised_data_config": true, "fields": null, "breakdown_by_year": false }));
    // const { data: mainPageWeeklyDates, isDataLoading:isDateLoading, error:dateLoadingError } = useFetchPost("http://localhost:5000/api/weekly_data", ({ "dates_for_frontend":true, "fields":null, "breakdown_by_year":false }));


    // console.log(Object.keys(mainPageWeeklyDataForFreightMap)[0]);
    // const [currentDate, setCurrentDate] = useState(mainPageWeeklyDataForFreightMap && Object.keys(mainPageWeeklyDataForFreightMap)[0]);

    const [currentMapAttributes, setCurrentMapAttributes] = useState(RouteConfigurations.C5);

    const [currentIndicatorImpact, setCurrentIndicatorImpact] = useState(tempIndicatorImpact.C5);

    const [currentIndicatorInFFAChart, setCurrentIndicatorInFFAChart] = useState("C5");

    const [mainPageWeeklyDates, setMainPageWeeklyDates] = useState(tempDates[0]);

    const [tempSliderValue, setTempSliderValue] = useState(0);

    const [allZoneFlag, setAllZoneFlag] = useState(false);

    const handleLocSelect = (e) => {
        // showing the desired regions of the map
        setCurrentMapAttributes(RouteConfigurations[e]);
        setCurrentIndicatorImpact(tempIndicatorImpact[e]);
        setCurrentIndicatorInFFAChart(e);

    };


    // const handleCompanyShipClick = () => {
    //     // show all company ships
    //     setCurrentMapAttributes(StaticShipCoordinates);


    // }

    const handleZoneClick=(e)=>{
        console.log(e);
        // setAllZoneFlag(true);
        setAllZoneFlag(e => !e);
        setCurrentMapAttributes(StaticShipCoordinates);
    }

    const handleDateSelect = (e) => {
        // showing the desired regions of the map
        // setCurrentMapAttributes(RouteConfigurations[e]);
        // setCurrentIndicatorImpact(tempIndicatorImpact[e]);
        // setCurrentIndicatorInFFAChart(e);
        setMainPageWeeklyDates(e);


    };
    

    const handleSlide = (e) => {
        // showing the desired regions of the map
        setTempSliderValue(parseInt(e));
        setMainPageWeeklyDates(tempDatesDict[parseInt(e)]);

    };



    return (
        <div className="home">
            <Container fluid>
                <Row >
                    <Col sm={2} >
                        <DropdownButton id="dropdown-basic-button" title="Select Route" onSelect={handleLocSelect}>
                            {/* add more once the i have gotten all the data, ps i doubt i'll ever have time to get the data */}
                            <Dropdown.Item eventKey={"C2"}>C2</Dropdown.Item>
                            <Dropdown.Item eventKey={"C3"}>C3</Dropdown.Item>
                            <Dropdown.Item eventKey={"C5"}>C5</Dropdown.Item>
                            <Dropdown.Item eventKey={"C7"}>C7</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    {/* <Col sm={2}>
                        <Button variant="primary" onClick={handleCompanyShipClick}>Company Ships</Button>
                    </Col> */}

                    <Col sm={2}>
                        <Button variant="primary" onClick={handleZoneClick}>Zone Status</Button>
                    </Col>

                    <Col sm={2}>
                        <DropdownButton id="dropdown-basic-button" title="Select date" onSelect={handleDateSelect}>
                            {/* add more once the i have gotten all the data, ps i doubt i'll ever have time to get the data */}
                            {(tempDates.slice(0, 10)).map((curDate) =>
                                <Dropdown.Item eventKey={curDate}>{curDate}</Dropdown.Item>
                            )}
                        </DropdownButton>
                    </Col>


                    <Col>Pred segment, will add in some btms as well</Col>

                </Row>
            </Container>

            <Container fluid>
                {/* <Row></Row> */}
                <Row>
                    <Col>
                        {/* this part houses the map*/}
                        {isMapDataLoading && <div>Map data loading...</div>}
                        {/* <FreightMap variables={currentMapAttributes} demandSupply={currentDemandSupply}></FreightMap> */}
                        {/* {mainPageWeeklyDataForFreightMap && <FreightMap variables={currentMapAttributes} weeklySnapShot={mainPageWeeklyDataForFreightMap[mainPageWeeklyDates]} allZoneFlag={allZoneFlag}></FreightMap>} */}
                        {/* careful! it always returns a double value, we need integer */}
                        <div className="slider" id="datepicker">
                            <Nouislider start={tempSliderValue} step={1} range={{ min: 1, max: 317 }} onUpdate={handleSlide}></Nouislider>

                        </div>
                        <div>date {tempDatesDict[tempSliderValue]}</div>
                    </Col>

                    <Col>
                        <Row>
                            <Col>
                                <PlotlyLineChart variables={{ "fields": ["Week Ending On", "C5"], "breakdown_by_year": false }} layout={{ height: 300, title: currentIndicatorInFFAChart + 'Prediction and FFA revenue' }} displayModeBar={false}>

                                </PlotlyLineChart>
                            </Col>
                            {/* <Col><PlotlyRadarChart variables={currentIndicatorImpact} displayModeBar={false} /></Col> */}
                        </Row>
                        {currentIndicatorInFFAChart && (routeRegionMapping[currentIndicatorInFFAChart]).map((curRegion) =><Row>
                            {/* temporary, for some other indocators like congestion and laden, ballaster */}
                            
                            {([0,1]).map((cur_status) =><Col>
                                
                                    {cur_status==0&&<PlotlyLineChart variables={{ "fields": ["Week Ending On", "C5",curRegion+"_ballast"], "breakdown_by_year": false, "axis_config":"dual"}} layout={{width:400, height: 300, title: currentIndicatorInFFAChart + " "+curRegion +"_ballast "+ " indicator impact" ,"yaxis": {"title": currentIndicatorInFFAChart},"yaxis2": {
                                        "title": 'y',
                                        "titlefont": {"color": 'rgb(148, 103, 189)'},
                                        "tickfont": {"color": 'rgb(148, 103, 189)'},
                                        "overlaying": 'y',
                                        "side": 'right'
                                      } }} displayModeBar={true}></PlotlyLineChart>}
                                    {cur_status==1&&<PlotlyLineChart variables={{ "fields": ["Week Ending On", "C5",curRegion+"_laden"], "breakdown_by_year": false, "axis_config":"dual"}} layout={{width:400, height: 300, title: currentIndicatorInFFAChart + " "+curRegion + "_laden"+ " indicator impact" ,"yaxis": {"title": currentIndicatorInFFAChart},"yaxis2": {
                                        "title": 'y',
                                        "titlefont": {"color": 'rgb(148, 103, 189)'},
                                        "tickfont": {"color": 'rgb(148, 103, 189)'},
                                        "overlaying": 'y',
                                        "side": 'right'
                                      } }} displayModeBar={true}></PlotlyLineChart>}
                                

                            </Col>)}
                        </Row>)}




                    </Col>


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
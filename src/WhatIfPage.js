import { Image, Table, Container, Row, Col, Dropdown, DropdownButton, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useState, useEffect, useRef } from "react";
import Nouislider from "nouislider-react";
// completly go away from plotly viz libraries
import PlotlyLineChart from './PlotlyLineChart';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { RouteConfigurations } from "./RouteConfigurations";
import WhatIfMap from './WhatIfMap';
import Plot from 'react-plotly.js';
import TimeSeriesLineChart from "./TimeSeriesLineChart";
import LineChartWithVerticalEdit from "./LineChartWithVerticalEdit";
import _ from "lodash";
import MultipleLineProduction from "./MultipleLineProduction";

import useFetchPost from "./useFetchPost";

import demandSupplyPic from "./images/demand_supply_snippet.png"
import NormalDistribution from './NormalDistribution';

const WhatIfPage = () => {
    // EXTRA polylines in this setting, won't use them
    const c3Config = RouteConfigurations.C3;
    const c5Config = RouteConfigurations.C5;
    const { data: dailyVesselLocations, isDataLoading: isMapDataLoading, error: errorVesselLoading } = useFetchPost("http://localhost:5000/api/daily_trajectories", ({ "date": "2021-04-07" }));
    const { data: modelVariables, isDataLoading: isModelVariablesLoading, error: errorModelVariableRetrieval } = useFetchPost("http://localhost:5000/api/model_variables", ({}));
    const { data: weeklyData, isDataLoading: isWeeklyDataLoading, error: errorWeeklyDataLoading } = useFetchPost("http://localhost:5000/api/weekly_data", ({ "main_page_normalised_data_config": true, "fields": null, "breakdown_by_year": false, "as_list": true }));

    // this is converted into an inpage hook to grant more flexibility to the states
    // const { data: predictionData, isDataLoading: isPredictionDataLoading, error: errorPredictionDataLoaing } = useFetchPost("http://localhost:5000/api/time_series_prediction_combined", ({ "lag": "2", "forcast_steps": "6" }));
    // console.log(modelVariables);
    const [currentRoute, setCurrentRoute] = useState("C5");
    // by default user will only have 1 draggable point
    const [currentTimeWindow, setCurrentTimeWindow] = useState(1);

    const [predictionData, setPredictionData] = useState(null);
    const [isPredictionDataLoading, setIsPredictionDataLoading] = useState(true);
    const [errorPredictionDataLoaing, setErrorPredictionDataLoaing] = useState(null);
    //temporay, only for dev purposes
    const [tempSliderValue, setTempSliderValue] = useState(0);

    const [whatIfDataInput, setWhatIfDataInput] = useState(null);
    const [volatileWhatIfInput, setVolatileWhatIfInput] = useState(null);
    const [whatIfDataOutput, setWhatIfDataOutput] = useState(null);
    const [whatIfSubmitClicked, setwhatIfSubmitClicked] = useState(false);
    const [historicTimeSeriesBeforeLag, setHistoricTimeSeriesBeforeLag] = useState(null);
    const [realSubmit, setRealSubmit] = useState(null);

    const [isWhatIfOutputLoading, setIsWhatIfOutputLoading] = useState(false);
    // this is to control how many points will be shown in the what if view
    const fixedTimeWindow = 4;



    const colorForModels = { "ARIMAX": "#0B84A5", "VECM": "#FFA056", "LSTM": "#8DDDD0", "MLR": "#9DD866", "DunUse": "#A4A7AB" };

    const tempResultTableData = [{ "Run": 0, "Value": 7.12, "Delta": 0 }];
    const tempC3ResultTableData = [{ "Run": 0, "Value": 18.53, "Delta": 0 }];


    const [resultStats, setResultStats] = useState(null);

    // this is to set what aggregate data we want to show beside the map
    const [mapHighlight, setMapHighlight] = useState("South East Asia");
    // aggregate data
    const [mapAggregateData, setMapAggregateData] = useState(null);

    // for visualising the error terms
    const normErrRange = [-5, 7];
    const errParams = [{ "Name": "Bunker", "Params": [-2, 1] }, { "Name": "Steel Price", "Params": [0.25, 0.3] }, { "Name": "Pig Iron", "Params": [3, 0.7] }, { "Name": "Steel Stock", "Params": [5, 0.4] }, { "Name": "China Port Stock", "Params": [0.3, 0.4] },
    { "Name": "australia loading", "Params": [2.5, 0.7] }, { "Name": "Brazil Loading", "Params": [5, 0.4] }, { "Name": "Indian Ocean Laden", "Params": [0.5, 0.4] }];
    const btmError = { "Name": "Waus Congestion", "Params": [3, 0.5] };


    function handleMapHighlight(newValue) {
        setMapHighlight(newValue);
    }


    const handleRouteSelect = (e) => {
        setCurrentRoute(e);
        setCurrentTimeWindow(1);

    };

    const handleTimeWindowSelect = (e) => {

        setCurrentTimeWindow(e);
    };

    // this is for passing on to the next level of the d3 viz to change the input value
    function handleWhatIfDragChange(newValue) {
        console.log(newValue);
        var variableName = newValue["Variable"];
        var volatileCopy = _.cloneDeep(volatileWhatIfInput);

        for (var a = 0; a < volatileCopy.length; a++) {
            // warning to maintainers:
            // Don't change, lots of black magics in this method!
            // this gist is
            // due to some pixel shift, the inverse function for d3 returns the wrong time
            // so we can only compare the dates without comparing the time
            var curVolatileObj = volatileCopy[a];
            var curVolatileObjOnlyDate = _.cloneDeep(curVolatileObj["Date"]).setHours(0, 0, 0, 0);
            var newValueOnlyDate = _.cloneDeep(newValue["Date"]).setHours(0, 0, 0, 0);
            console.log(curVolatileObjOnlyDate == newValueOnlyDate);


            if (curVolatileObjOnlyDate == newValueOnlyDate) {
                console.log("hit");
                curVolatileObj[variableName] = newValue["Value"];
                // set new value
                volatileCopy[a][variableName] = newValue["Value"];
            }

        }
        setVolatileWhatIfInput(volatileCopy);
    }

    const handleFormChange = (e) => {
        // console.log(e.target.value);
        // console.log(e.target.getAttribute("customdate"),e.target.getAttribute("customvariable"));
        var parsedDate = new Date(e.target.getAttribute("customdate"));
        var curVariable = e.target.getAttribute("customvariable");
        var tempWhatIfInput = JSON.parse(JSON.stringify(whatIfDataInput));

        for (var i = 0; i < tempWhatIfInput.length; i++) {
            var curDocObj = tempWhatIfInput[i];
            var curObjDate = new Date(curDocObj["Date"]);
            // console.log(parsedDate,curObjDate);

            var parsedDateString = parsedDate.toISOString();
            var curObjDateString = curObjDate.toISOString();
            console.log(parsedDateString, curObjDateString);
            if (parsedDateString == curObjDateString) {
                // console.log("hit date");
                curDocObj[curVariable] = parseFloat(e.target.value);
            }
            tempWhatIfInput[i] = curDocObj;
        }

        setWhatIfDataInput(tempWhatIfInput);
        var copy = _.cloneDeep(tempWhatIfInput);
        setVolatileWhatIfInput(copy);
    }


    const handleSlide = (e) => {
        // showing the desired regions of the map
        setTempSliderValue(parseInt(e));
        // setMainPageWeeklyDates(tempDatesDict[parseInt(e)]);

    };

    const handleWhatIfSubmit = (e) => {
        var toSubmit = { "what_if_data": [], "lag": 2, "forcast_steps": "6", "route": currentRoute };
        var dataList = []
        for (var i = 0; i < volatileWhatIfInput.length; i++) {
            var curObj = volatileWhatIfInput[i];
            if (modelVariables && volatileWhatIfInput && currentTimeWindow && currentRoute) {
                var tempObj = {}
                // console.log(modelVariables[currentRoute]);

                for (var m = 0; m < (modelVariables[currentRoute].length); m++) {
                    var curVariable = modelVariables[currentRoute][m];
                    tempObj[curVariable] = curObj[curVariable];
                }
                tempObj["Date"] = new Date(curObj["Date"].getTime() - (curObj["Date"].getTimezoneOffset() * 60000))
                    .toISOString()
                    .split("T")[0];
                // tempObj["Date"]=curObj["Date"].toISOString().slice(0, 10);
                // for (var curVariable in modelVariables[currentRoute]) {
                //     tempObj[curVariable] = curObj[curVariable];
                // }
                dataList.push(tempObj);
            }
        }
        toSubmit["what_if_data"] = dataList;

        setwhatIfSubmitClicked(true);
        setRealSubmit(toSubmit);

    }

    // To reset the dragged graph to original linechart
    const handleWhatIfReset = (e) => {
        setVolatileWhatIfInput(whatIfDataInput);
        setResultStats(null);
    }


    useEffect(() => {
        if (whatIfSubmitClicked == true) {
            setIsWhatIfOutputLoading(true);
            fetch("http://localhost:5000/api/what_if_scenario_combined", {
                method: 'POST', headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(realSubmit)
            }).then(res => {
                if (!res.ok) {
                    throw Error("Couldn't fetch data");
                }
                return res.json();
            }).then(data => {
                setWhatIfDataOutput(data);
                // console.log(setWhatIfDataOutput);
                setIsWhatIfOutputLoading(false);
                setwhatIfSubmitClicked(false);
                setRealSubmit(null);

                // construct the result stats table
                // first time submit
                if (!resultStats) {
                    setResultStats(tempResultTableData);

                } else {
                    // obtain the previous result
                    var prevRes = resultStats[resultStats.length - 1];
                    // generate a random number
                    var delta = Math.random() * (1.5 - (-1.5)) + (-1.5);
                    var roundedDelta = Math.round(delta * 100) / 100
                    // console.log(delta);
                    var roundedFinalValue = Math.round((prevRes["Value"] + roundedDelta) * 100) / 100
                    var curResToAppend = { "Run": prevRes["Run"] + 1, "Value": roundedFinalValue, "Delta": roundedDelta };
                    var copy = _.cloneDeep(resultStats);
                    copy.push(curResToAppend);
                    setResultStats(copy);
                }
            }).catch((e) => {
                console.log(e.message);
                setIsWhatIfOutputLoading(false);
                setErrorPredictionDataLoaing(e.message);

            })
        }


    }, [whatIfSubmitClicked])


    useEffect(() => {
        // only trigger when there exists weekydata
        if (currentTimeWindow && weeklyData && fixedTimeWindow) {
            var tempWhatIfInput = []
            // make a copy of the weekly data, ensure nothing got altered
            var tempWeeklyData = JSON.parse(JSON.stringify(weeklyData));
            // console.log(tempWeeklyData);
            for (var i = 0; i < tempWeeklyData.length; i++) {
                var tempDate = new Date(tempWeeklyData[i]["Date"]);
                tempWeeklyData[i]["Date"] = tempDate;
            }
            const sortedWeeklyData = tempWeeklyData.sort(function (a, b) {
                return a.Date - b.Date;
            });
            // add 4(one month worth of data to the what if)
            for (var j = 0; j < fixedTimeWindow; j++) {
                var curIndex = sortedWeeklyData.length - j - 1;
                var curObj = sortedWeeklyData[curIndex];
                tempWhatIfInput.push(curObj);

            }


            var tempHistoricData = []
            for (var k = 0; k < sortedWeeklyData.length - fixedTimeWindow; k++) {
                tempHistoricData.push(sortedWeeklyData[k]);
            }

            var tempHistoricData = [] = tempHistoricData.sort(function (a, b) {
                return a.Date - b.Date;
            });

            tempWhatIfInput = tempWhatIfInput.sort(function (a, b) {
                return a.Date - b.Date;
            });

            // console.log(tempWhatIfInput);

            var curLastEle=tempWhatIfInput[tempWhatIfInput.length-1];
            for (var l =1; l<=currentTimeWindow;l++){
                var curDayCopy=_.cloneDeep(curLastEle);
                var dateToReplace=curDayCopy["Date"];
                dateToReplace.setDate(dateToReplace.getDate() + 7*l);
                curDayCopy["Date"]=dateToReplace;
                tempWhatIfInput.push(curDayCopy);
            }

            setHistoricTimeSeriesBeforeLag(tempHistoricData);
            setWhatIfDataInput(tempWhatIfInput);
            var copy = _.cloneDeep(tempWhatIfInput);
            setVolatileWhatIfInput(copy);
        }


    }, [currentTimeWindow, weeklyData,fixedTimeWindow])

    // plenty of room for optimisation
    // this method asks the backend to retrieve prediction data when the lag OR route changes
    // it will only get worse once more models are incorporated
    useEffect(() => {
        fetch("http://localhost:5000/api/time_series_prediction_combined", {
            method: 'POST', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ "lag": 2, "forcast_steps": "6", "route": currentRoute })
        }).then(res => {
            if (!res.ok) {
                throw Error("Couldn't fetch data");
            }
            return res.json();
        }).then(data => {
            setPredictionData(data);
            // console.log(predictionData);
            setIsPredictionDataLoading(false);
            setErrorPredictionDataLoaing(null);
        }).catch((e) => {
            console.log(e.message);
            setIsPredictionDataLoading(false);
            setErrorPredictionDataLoaing(e.message);

        })

    }, [currentTimeWindow, currentRoute])

    return (
        <div className="what-if-scenario" >
            <Container fluid>

                <Row >
                    {/* left input part */}
                    <Col sm={6} >
                        {/* <h2>test</h2> */}
                        <Row >

                            <Col>
                                <DropdownButton id="dropdown-basic-button" variant="secondary" title={"Select Route (" + currentRoute + ")"} onSelect={handleRouteSelect} size="sm">
                                    {/* add more once the i have gotten all the data, ps i doubt i'll ever have time to get the data */}
                                    <Dropdown.Item eventKey={"C3"}>C3</Dropdown.Item>
                                    <Dropdown.Item eventKey={"C5"}>C5</Dropdown.Item>


                                </DropdownButton>
                            </Col>


                            {/* REDESIGN: definition changes, not lag, but future solid values */}
                            {/* Because past values can't be changed, we are doing what-if, not what could have happended */}
                            <Col>
                                <DropdownButton id="dropdown-basic-button" variant="secondary" title={"Future Time Window (" + currentTimeWindow + ")"} onSelect={handleTimeWindowSelect} size="sm">
                                    <Dropdown.Item eventKey={1}>1</Dropdown.Item>
                                    <Dropdown.Item eventKey={2}>2</Dropdown.Item>
                                    <Dropdown.Item eventKey={3}>3</Dropdown.Item>
                                    <Dropdown.Item eventKey={4}>4</Dropdown.Item>
                                </DropdownButton>
                            </Col>


                            <Button variant="secondary" onClick={handleWhatIfReset}>Reset</Button>{' '}
                        </Row>

                        {/* For the input component */}
                        <Scrollbars style={{ height: "40vh" }}>
                            <Row>
                                <Col>
                                    {/* <h3>Input section</h3> */}
                                    {weeklyData && modelVariables && currentRoute && whatIfDataInput && historicTimeSeriesBeforeLag && modelVariables[currentRoute].map((curRouteModelVariable, j) =>
                                        <Row className="justify-content-md-start">

                                            <Col md={1}>
                                                {/* hard coded to be this value */}
                                                <p style={{ fontSize: 14 }}>{curRouteModelVariable}</p>
                                            </Col>

                                            <Col md={4}>
                                                <TimeSeriesLineChart key={j.toString() + curRouteModelVariable + "Historical"} originaldata={weeklyData} data={historicTimeSeriesBeforeLag} variables={{ "fields": ["Week Ending On", curRouteModelVariable] }}></TimeSeriesLineChart>

                                            </Col>
                                            <Col md={4}>
                                                <LineChartWithVerticalEdit key={j.toString() + curRouteModelVariable + "WhatIfData"} updatewhatifdata={handleWhatIfDragChange} originaldata={weeklyData} whatifdata={whatIfDataInput} volatilewhatifdata={volatileWhatIfInput} activewindow={currentTimeWindow} variable={curRouteModelVariable}></LineChartWithVerticalEdit>
                                            </Col>

                                            <Col md={{ span: 3 }}>
                                                {/* <InputGroup className="mb-3">
                                                    {Array.apply(null, { length: currentTimeWindow }).map((e, i) => (
                                                        <FormControl key={weeklyData[currentTimeWindow - i]["Date"] + curRouteModelVariable} customdate={weeklyData[currentTimeWindow - i]["Date"]} customvariable={curRouteModelVariable} placeholder={weeklyData[currentTimeWindow - i][curRouteModelVariable]} type='float' onChange={handleFormChange}></FormControl>
                                                    ))}


                                                </InputGroup> */}
                                                {/* <Table responsive>
                                                <tbody>
                                                <tr>
                                                {Array.apply(null, { length: currentTimeWindow }).map((e, i) => (
                                                        <td key={weeklyData[currentTimeWindow - i]["Date"] + curRouteModelVariable}>{weeklyData[currentTimeWindow - i][curRouteModelVariable]}</td>
                                                    ))}
                                                </tr>
                                                </tbody>
                                                </Table> */}

                                                {/* <p>
                                                {Array.apply(null, { length: currentTimeWindow }).map((e, i) => (
                                                        {weeklyData[currentTimeWindow - i][curRouteModelVariable]}.toString()
                                                    ))}
                                                </p> */}

                                            </Col>
                                        </Row>

                                    )}
                                </Col>
                            </Row>
                        </Scrollbars>
                        {/* for the map component */}
                        <Row>
                            <Col sm={8}>
                                {isMapDataLoading && <div>Map data loading...</div>}
                                {c5Config && dailyVesselLocations && <WhatIfMap variables={c5Config} allShipLocationsByDay={dailyVesselLocations} tempSliderValue={tempSliderValue}></WhatIfMap>}
                            </Col>


                            <Col sm={4}>
                                {/* this buttom is in charge of submitting all changes in the what if data */}

                                <Row style={{ height: "35vh" }}>
                                    <Col>
                                        <div>

                                            {/* <img alt="panda" className="photo" style={{ width: 220, height: 250 }} src={demandSupplyPic} /> */}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button variant="success" onClick={handleWhatIfSubmit}>Submit Whatif Scenrio</Button>
                                    </Col>

                                </Row>

                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* hardcode the padding to be 6 pixels */}
                                <div className="slider" id="datepicker" style={{ padding: '6px' }}>
                                    <Nouislider start={tempSliderValue} step={1} range={{ min: 1, max: 29 }} onUpdate={handleSlide}></Nouislider>

                                </div>
                            </Col>
                        </Row>
                    </Col>
                    {/* right output part */}
                    {/* reformat into 3 parts */}



                    <Col sm={2.5} >

                        <Scrollbars style={{ height: "40vh" }}>
                            <h5>Variable coefficients</h5>
                            {errParams && errParams.map((curErr, i) =>

                                <Row style={{ height: "25px" }}>
                                    {/* <Col sm={0.5}style= {{ fontSize: 10 }}>
                                    {curErr["Name"]}
                                </Col> */}
                                    <Col sm={2}>
                                        <NormalDistribution name={curErr["Name"]} normparams={curErr["Params"]} xparams={normErrRange} islastcoeffcient={false} />
                                    </Col>
                                </Row>



                            )}

                            {btmError &&
                                <Row style={{ height: "25px" }}>
                                    {/* <Col sm={0.5}style= {{ fontSize: 10 }}>
                            {curErr["Name"]}
                        </Col> */}
                                    <Col sm={2}>
                                        <NormalDistribution name={btmError["Name"]} normparams={btmError["Params"]} xparams={normErrRange} islastcoeffcient={true} />
                                    </Col>
                                </Row>
                            }



                        </Scrollbars>

                        <Row>
                            <Col>
                                <h5>{currentRoute} Prediction output</h5>
                                {isPredictionDataLoading && <div>Prediction data loading...</div>}

                                {/* {predictionData &&

                                    <Plot data={predictionData["plotly_compatible_forecast"]["data"]} layout={{ height: 300, width: 500, title: currentRoute + ' Prediction' }} />
                                } */}
                                {predictionData && !isPredictionDataLoading &&
                                    <MultipleLineProduction data={predictionData}></MultipleLineProduction>
                                }
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <h5>{currentRoute} What if output</h5>
                                {isWhatIfOutputLoading && <div>What if data loading...</div>}
                                {/* {whatIfDataOutput && !isWhatIfOutputLoading &&
                                    <Plot data={whatIfDataOutput["plotly_compatible_forecast"]["data"]} layout={{ height: 300, width: 500, title: currentRoute + ' Prediction' }} />
                                } */}
                                {whatIfDataOutput && !isWhatIfOutputLoading &&
                                    <MultipleLineProduction data={whatIfDataOutput}></MultipleLineProduction>
                                }
                            </Col>
                        </Row>
                    </Col>

                    <Col sm={3.5} >
                        <Row style={{ height: "50vh" }}>
                            <Col>

                                <h5>Model comparison</h5>
                                {/* two ideas currently, one follow's tradao's strategy of line chart, the other follows the tabular form in the DFSeer */}


                                <div id="colorgradient">
                                    <svg height="20" width="80">
                                        <defs>
                                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" style={{ "stop-color": "rgb(255,255,255)", "stop-opacity": 1 }} />
                                                <stop offset="100%" style={{ "stop-color": "rgb(255,0,0)", "stop-opacity": 1 }} />
                                            </linearGradient>
                                        </defs>
                                        <rect x="0" y="0" width="60" height="20" fill="url(#grad1)" />
                                    </svg>
                                </div>
                                <Table borderless hover size="sm">
                                    <thead style={{ fontSize: 12 }}>
                                        <tr>
                                            <th>Model Name</th>
                                            <th>Short term mae</th>
                                            <th>Long term mae</th>
                                            <th>R squared</th>
                                            <th>Applicability</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: 12 }}>

                                        <tr>
                                            <td>VECM</td>
                                            <td>
                                                <svg width="80" height="20" id="vecm_short_mae">
                                                    <circle cx="40" cy="10" r="10" stroke="black" stroke-width="0" fill="red" />
                                                </svg>
                                            </td>
                                            <td>
                                                <svg width="80" height="20" id="vecm_long_mae">
                                                    <circle cx="40" cy="10" r="10" stroke="black" stroke-width="0" fill="#E34A44" />
                                                </svg>
                                            </td>
                                            <td>
                                                <svg width="80" height="20" id="vecm_r_squared">
                                                    <rect width="55" height="20" x="0" y="0" fill={colorForModels["VECM"]} />
                                                </svg>
                                            </td>
                                            <td>
                                                <svg width="80" height="20" id="vecm_applicability">
                                                    <rect width="60" height="20" x="0" y="0" fill={colorForModels["VECM"]} />
                                                </svg>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>LSTM</td>
                                            <td>
                                                <svg width="80" height="20" id="lstm_short_mae">
                                                    <circle cx="40" cy="10" r="10" stroke="black" stroke-width="0" fill="#E34A44" />
                                                </svg>
                                            </td>
                                            <td>
                                                <svg width="80" height="20" id="lstm_long_mae">
                                                    <circle cx="40" cy="10" r="10" stroke="black" stroke-width="0" fill="red" />
                                                </svg>
                                            </td>
                                            <td>
                                                <svg width="80" height="20" id="lstm_r_squared">
                                                    <rect width="52" height="20" x="0" y="0" fill={colorForModels["LSTM"]} />
                                                </svg>
                                            </td>
                                            <td>
                                                <svg width="80" height="20" id="lstm_applicability">
                                                    <rect width="55" height="20" x="0" y="0" fill={colorForModels["LSTM"]} />
                                                </svg>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>ARIMAX</td>
                                            <td>
                                                <svg width="80" height="20" id="arimax_short_mae">
                                                    <circle cx="40" cy="10" r="10" stroke="black" stroke-width="0" fill="red" />
                                                </svg>
                                            </td>
                                            <td>
                                                <svg width="80" height="20" id="arimax_long_mae">
                                                    <circle cx="40" cy="10" r="10" stroke="black" stroke-width="0" fill="red" />
                                                </svg>
                                            </td>
                                            <td>
                                                <svg width="80" height="20" id="arimax_r_squared">
                                                    <rect width="40" height="20" x="0" y="0" fill={colorForModels["ARIMAX"]} />
                                                </svg>
                                            </td>
                                            <td>
                                                <svg width="80" height="20" id="arimax_applicability">
                                                    <rect width="45" height="20" x="0" y="0" fill={colorForModels["ARIMAX"]} />
                                                </svg>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>MLR</td>
                                            <td>
                                                <svg width="80" height="20" id="mlr_short_mae">
                                                    <circle cx="40" cy="10" r="10" stroke="black" stroke-width="0" fill={colorForModels["DunUse"]} />
                                                </svg>
                                            </td>
                                            <td>
                                                <svg width="80" height="20" id="mlr_long_mae">
                                                    <circle cx="40" cy="10" r="10" stroke="black" stroke-width="0" fill={colorForModels["DunUse"]} />
                                                </svg>
                                            </td>
                                            <td>
                                                <svg width="80" height="20" id="mlr_r_squared">
                                                    <rect width="50" height="20" x="0" y="0" fill={colorForModels["DunUse"]} />
                                                </svg>
                                            </td>
                                            <td>
                                                <svg width="80" height="20" id="mlr_applicability">
                                                    <rect width="40" height="20" x="0" y="0" fill={colorForModels["DunUse"]} />
                                                </svg>
                                            </td>
                                        </tr>

                                    </tbody>

                                </Table>
                            </Col>
                        </Row>

                        <Row style={{ height: "50vh" }}>
                            <Col>
                                <h5>Whatif histories and freight index impacts</h5>
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Run</th>
                                            <th>Moving Average</th>
                                            <th>MA Delta</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultStats && resultStats.map((curRes) =>
                                            <tr>
                                                <td>{curRes["Run"]}</td>
                                                <td>{curRes["Value"]}
                                                    {curRes["Delta"] > 0 &&
                                                        <svg height="20" width="100">
                                                            <polygon points="90,20 100,20 95,0" style={{ "fill": "lime", "stroke": "purple", "strokeWidth": 1 }} />
                                                        </svg>
                                                    }
                                                    {curRes["Delta"] < 0 &&
                                                        <svg height="20" width="100">
                                                            <polygon points="90,0 100,0 95,20" style={{ "fill": "red", "stroke": "purple", "strokeWidth": 1 }} />
                                                        </svg>
                                                    }

                                                </td>
                                                <td>{curRes["Delta"]}</td>
                                            </tr>
                                        )
                                        }
                                    </tbody>

                                </Table>
                            </Col>
                        </Row>

                    </Col>

                </Row>
            </Container>

        </div>
    );
}

export default WhatIfPage;
import { Image, Table, Container, Row, Col, Dropdown, DropdownButton, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useState, useEffect, useRef } from "react";
import Nouislider from "nouislider-react";
// completly go away from plotly viz libraries
// import PlotlyLineChart from './PlotlyLineChart';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { RouteConfigurations } from "./RouteConfigurations";
import WhatIfMap from './WhatIfMap';
// import Plot from 'react-plotly.js';
import TimeSeriesLineChart from "./TimeSeriesLineChart";
import LineChartWithVerticalEdit from "./LineChartWithVerticalEdit";
import _ from "lodash";
// import MultipleLineProduction from "./MultipleLineProduction";

import useFetchPost from "./useFetchPost";

// import demandSupplyPic from "./images/demand_supply_snippet.png"
import CombinedPredictionAndWhatIfOutput from './CombinedPredictionAndWhatIfOutput';
import SeriesDiff from './SeriesDiff';
import MultiNormalDist from './MultiNormalDist';

const FFA = () => {
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


    const [diffStats, setDiffStats] = useState(null);



    const colorForModels = { "ARIMAX": "#0B84A5", "VECM": "#FFA056", "LSTM": "#8DDDD0", "MLR": "#A4A7AB", "DunUse": "#A4A7AB" };

    const tempResultTableData = [{ "Run": 0, "Value": 7.12, "Delta": 0 }];
    const tempC3ResultTableData = [{ "Run": 0, "Value": 18.53, "Delta": 0 }];


    const [resultStats, setResultStats] = useState(null);

    // this is to set what aggregate data we want to show beside the map
    const [mapHighlight, setMapHighlight] = useState("South East Asia");
    // aggregate data
    const [mapAggregateData, setMapAggregateData] = useState(null);

    // for visualising the error terms
    

    const [realXParam, setRealXParam] = useState(null);
    const [coefficientConfig, setCoefficientConfig] = useState(null);

    const [transformedCoefParam, setTransformedCoefParam] = useState(null);
    const [modelPerformances, setModelPerformances] = useState(null);

    function handleMapHighlight(newValue) {
        setMapHighlight(newValue);
    }


    const handleRouteSelect = (e) => {
        setCurrentRoute(e);
        setCurrentTimeWindow(1);

        setVolatileWhatIfInput(whatIfDataInput);
        setResultStats(null);
        setDiffStats(null);

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
        toSubmit["original_prediction_data"] = predictionData;

        setwhatIfSubmitClicked(true);
        setRealSubmit(toSubmit);

    }

    // To reset the dragged graph to original linechart
    const handleWhatIfReset = (e) => {
        setVolatileWhatIfInput(whatIfDataInput);
        setResultStats(null);
        setDiffStats(null);
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
                // if (!resultStats) {
                //     setResultStats(tempResultTableData);

                // } else {
                //     // obtain the previous result
                //     var prevRes = resultStats[resultStats.length - 1];
                //     // generate a random number
                //     var delta = Math.random() * (1.5 - (-1.5)) + (-1.5);
                //     var roundedDelta = Math.round(delta * 100) / 100
                //     // console.log(delta);
                //     var roundedFinalValue = Math.round((prevRes["Value"] + roundedDelta) * 100) / 100
                //     var curResToAppend = { "Run": prevRes["Run"] + 1, "Value": roundedFinalValue, "Delta": roundedDelta };
                //     var copy = _.cloneDeep(resultStats);
                //     copy.push(curResToAppend);
                //     setResultStats(copy);
                // }

                // here we need to get the diff between the previous what if value and the predicted values
                // only obtain the date and diff pair
                var predictionRes = (_.cloneDeep(predictionData))["plotly_compatible_forecast"]["data"];
                var whatIfToCompare = (_.cloneDeep(data))["plotly_compatible_forecast"]["data"];

                // console.log("1..pred",predictionRes);
                // console.log("2..whatif",whatIfToCompare);
                // backend order: arimax, vecm, linear regression, lstm, history
                // skip over history
                var curRecord = [];
                for (var m = 0; m < predictionRes.length - 1; m++) {
                    var curModelPredRes = predictionRes[m];
                    var curModelWhatIfRes = whatIfToCompare[m];
                    var curModelName = curModelPredRes["name"]
                    var curModelDiffData = []
                    // iterate through every x and y value in the what if and prediction output
                    for (var n = 0; n < curModelPredRes["x"].length; n++) {
                        var curDay = new Date(curModelPredRes["x"][n]);
                        var diff = curModelWhatIfRes["y"][n] - curModelPredRes["y"][n];
                        curModelDiffData.push([curDay, diff]);

                    }
                    var curDiffObj = { "name": curModelName, "data": curModelDiffData };
                    curRecord.push(curDiffObj);

                }
                console.log("diff here", curRecord);

                if (!diffStats) {
                    setDiffStats([{ "Run": 0, "Value": curRecord }]);
                    console.log("diff stats", diffStats);
                } else {
                    var runNumber = diffStats.length;
                    var copy = _.cloneDeep(diffStats);
                    copy.push({ "Run": runNumber, "Value": curRecord });
                    setDiffStats(copy);
                    console.log("diff stats", diffStats);
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

            var curLastEle = tempWhatIfInput[tempWhatIfInput.length - 1];
            for (var l = 1; l <= currentTimeWindow; l++) {
                var curDayCopy = _.cloneDeep(curLastEle);
                var dateToReplace = curDayCopy["Date"];
                dateToReplace.setDate(dateToReplace.getDate() + 7 * l);
                curDayCopy["Date"] = dateToReplace;
                tempWhatIfInput.push(curDayCopy);
            }

            setHistoricTimeSeriesBeforeLag(tempHistoricData);
            setWhatIfDataInput(tempWhatIfInput);
            var copy = _.cloneDeep(tempWhatIfInput);
            setVolatileWhatIfInput(copy);
        }


    }, [currentTimeWindow, weeklyData, fixedTimeWindow])

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
            setRealXParam(data["xParams"]);
            setCoefficientConfig(data["coefficients"]);
            setTransformedCoefParam(data["transformed_coef_para"]);
            setModelPerformances(data["model_performances"]);
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
                        <Row style={{ height:"45vh", borderStyle: "solid", borderWidth: "1px", borderColor: "#838383" }}>
                            <Col>
                                <Row style={{ height: "5vh" }}>

                                    <Col>
                                        <DropdownButton id="dropdown-basic-button" variant="secondary" title={"Select Route (" + currentRoute + ")"} onSelect={handleRouteSelect} size="sm">
                                            {/* add more once the i have gotten all the data, ps i doubt i'll ever have time to get the data */}
                                            <Dropdown.Item eventKey={"C3"}>C3</Dropdown.Item>
                                            <Dropdown.Item eventKey={"C5"}>C5</Dropdown.Item>


                                        </DropdownButton>
                                    </Col>
                                    <Col>
                                        <DropdownButton id="dropdown-basic-button" variant="secondary" title={"Future Time Window (" + currentTimeWindow + ")"} onSelect={handleTimeWindowSelect} size="sm">
                                            <Dropdown.Item eventKey={1}>1</Dropdown.Item>
                                            <Dropdown.Item eventKey={2}>2</Dropdown.Item>
                                            <Dropdown.Item eventKey={3}>3</Dropdown.Item>
                                            <Dropdown.Item eventKey={4}>4</Dropdown.Item>
                                        </DropdownButton>
                                    </Col>

                                    <Col>
                                        <Button variant="secondary" onClick={handleWhatIfReset}>Reset</Button>
                                    </Col>

                                    <Col><Button variant="success" onClick={handleWhatIfSubmit}>Submit Scenrio</Button></Col>

                                </Row>

                                <Row style={{ height: "40vh" }}>
                                    <Col>
                                        <Scrollbars >
                                            <Row >
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

                                                            <Col md={{ span: 2 }}>


                                                            </Col>
                                                        </Row>

                                                    )}
                                                </Col>
                                            </Row>
                                        </Scrollbars>

                                    </Col>

                                </Row>
                            </Col>
                        </Row>


                        <Row style={{ height: "45vh", borderStyle: "solid", borderWidth: "1px", borderColor: "#838383" }}>
                            <Col>
                                <Row>
                                    <Col>
                                        {isMapDataLoading && <div>Map data loading...</div>}
                                        {c5Config && dailyVesselLocations && <WhatIfMap variables={c5Config} allShipLocationsByDay={dailyVesselLocations} tempSliderValue={tempSliderValue}></WhatIfMap>}
                                    </Col>

                                </Row>

                                <Row>
                                    <Col>
                                        <div className="slider" id="datepicker" style={{ padding: '6px' }}>
                                            <Nouislider start={tempSliderValue} step={1} range={{ min: 1, max: 29 }} onUpdate={handleSlide}></Nouislider>

                                        </div>
                                    </Col>

                                </Row>

                            </Col>
                        </Row>
                    </Col>
                    {/* right output part */}
                    {/* reformat into 3 parts */}

                    <Col sm={3}>


                        <Row style={{ height: "45vh", borderStyle: "solid", borderWidth: "1px", borderColor: "#838383" }}>
                            <Col >
                                                        
                                <Scrollbars>
                                    <h5 style={{ textAlign: "center" }}>Variable coefficients</h5>

                                    {transformedCoefParam && transformedCoefParam.map((curParam, i) =>

                                        
                                            <Row style={{ height: "25px" }}>
                                            <Col >
                                                <MultiNormalDist name={curParam["Name"]} normparams={curParam} xparams={realXParam} islastcoeffcient={true} />
                                            </Col>
                                        </Row>


                                        
                                        

                                        
                                    )}
                                    
                                </Scrollbars>
                            </Col>
                        </Row>
                        <Row style={{ height: "45vh", borderStyle: "solid", borderWidth: "1px", borderColor: "#838383" }}>
                            <Col>
                                <h5 style={{ textAlign: "center" }}>{currentRoute} Prediction output</h5>
                                {isPredictionDataLoading && <div>Prediction data loading...</div>}

                                {predictionData && !isPredictionDataLoading &&
                                    <CombinedPredictionAndWhatIfOutput predictiondata={predictionData} whatifdata={whatIfDataOutput}></CombinedPredictionAndWhatIfOutput>
                                }
                            </Col>
                        </Row>
                    </Col>

                    <Col sm={3} >


                        <Row style={{ height: "45vh", borderStyle: "solid", borderWidth: "1px", borderColor: "#838383" }}>
                            <Col >

                                <h5 style={{ textAlign: "center" }}>Model comparison</h5>
                                {!modelPerformances && <h5>Model comparison stats loading</h5>}



                                {modelPerformances &&
                                    <div id="colorgradient">
                                        Error range {modelPerformances["mae_range"][1].toFixed(2)}
                                        <svg height="20" width="80">
                                            <defs>
                                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" style={{ "stopColor": "rgb(128,255,128)", "stopOpacity": 1 }} />
                                                    <stop offset="100%" style={{ "stopColor": "rgb(0,128,0)", "stopOpacity": 1 }} />
                                                </linearGradient>
                                            </defs>
                                            <rect x="0" y="0" width="60" height="20" fill="url(#grad1)" />
                                        </svg>
                                        {modelPerformances["mae_range"][0].toFixed(2)}
                                    </div>
                                }
                                <br></br>


                                {modelPerformances &&

                                    <Table borderless hover size="sm">
                                        <thead style={{ fontSize: 12 }}>
                                            <tr>
                                                <th>Model Name</th>
                                                <th>Short term mae</th>
                                                <th>Long term mae</th>
                                                <th>Monthly mae</th>
                                                {/* <th>R Squared</th> */}


                                            </tr>
                                        </thead>

                                        <tbody style={{ fontSize: 12 }}>

                                            <tr>
                                                <td>VECM</td>
                                                <td>
                                                    <svg width="70" height="20" id="vecm_short_mae">
                                                        <rect width={modelPerformances["raw_vecm_benchmarks"]["short_term_mae"][1] * 30 + 40} height="20" x="0" y="0" fill={"rgb(20,148,20)"} />
                                                    </svg>
                                                </td>
                                                <td>
                                                    <svg width="70" height="20" id="vecm_long_mae">
                                                        <rect width={modelPerformances["raw_vecm_benchmarks"]["long_term_mae"][1] * 30 + 40} height="20" x="0" y="0" fill={"rgb(70,198,70)"} />
                                                    </svg>
                                                </td>

                                                <td>
                                                    <svg width="70" height="20" id="vecm_standard_mae">
                                                        <rect width={modelPerformances["raw_vecm_benchmarks"]["standard_mae"][1] * 30 + 40} height="20" x="0" y="0" fill={"rgb(20,148,20)"} />
                                                    </svg>
                                                </td>
                                                {/* <td>
                                                <svg width="70" height="20" id="vecm_r_squared">
                                                    <rect width={modelPerformances["raw_vecm_benchmarks"]["rsquared"][0]*20+40} height="20" x="0" y="0" fill={colorForModels["VECM"]} />
                                                </svg>
                                            </td> */}

                                            </tr>


                                            <tr>
                                                <td>LSTM</td>
                                                <td>
                                                    <svg width="70" height="20" id="lstm_short_mae">
                                                        <rect width={modelPerformances["raw_lstm_benchmarks"]["short_term_mae"][1] * 30 + 40} height="20" x="0" y="0" fill={"rgb(70,198,70)"} />
                                                    </svg>
                                                </td>
                                                <td>
                                                    <svg width="70" height="20" id="lstm_long_mae">
                                                        <rect width={modelPerformances["raw_lstm_benchmarks"]["long_term_mae"][1] * 30 + 40} height="20" x="0" y="0" fill={"rgb(20,148,20)"} />
                                                    </svg>
                                                </td>

                                                <td>
                                                    <svg width="70" height="20" id="lstm_standard_mae">
                                                        <rect width={modelPerformances["raw_lstm_benchmarks"]["standard_mae"][1] * 30 + 40} height="20" x="0" y="0" fill={"rgb(30,158,30)"} />
                                                    </svg>
                                                </td>
                                                {/* <td>
                                                <svg width="70" height="20" id="lstm_r_squared">
                                                    <rect width={modelPerformances["raw_lstm_benchmarks"]["rsquared"][0]*20+40} height="20" x="0" y="0" fill={colorForModels["LSTM"]} />
                                                </svg>
                                            </td> */}

                                            </tr>


                                            <tr>
                                                <td>ARIMAX</td>
                                                <td>
                                                    <svg width="70" height="20" id="arimax_short_mae">
                                                        <rect width={modelPerformances["raw_arimax_benchmarks"]["short_term_mae"][1] * 30 + 40} height="20" x="0" y="0" fill={"rgb(40,168,40)"} />
                                                    </svg>
                                                </td>
                                                <td>
                                                    <svg width="70" height="20" id="arimax_long_mae">
                                                        <rect width={modelPerformances["raw_arimax_benchmarks"]["long_term_mae"][1] * 30 + 40} height="20" x="0" y="0" fill={"rgb(90,218,90)"} />
                                                    </svg>
                                                </td>

                                                <td>
                                                    <svg width="70" height="20" id="arimax_standard_mae">
                                                        <rect width={modelPerformances["raw_arimax_benchmarks"]["standard_mae"][1] * 30 + 40} height="20" x="0" y="0" fill={"rgb(70,198,70)"} />
                                                    </svg>
                                                </td>
                                                {/* <td>
                                                <svg width="70" height="20" id="arimax_r_squared">
                                                    <rect width={modelPerformances["raw_arimax_benchmarks"]["rsquared"][0]*20+40} height="20" x="0" y="0" fill={colorForModels["ARIMAX"]} />
                                                </svg>
                                            </td> */}

                                            </tr>


                                            <tr>
                                                <td>MLR</td>
                                                <td>
                                                    <svg width="70" height="20" id="lr_short_mae">
                                                        <rect width={modelPerformances["raw_lr_benchmarks"]["short_term_mae"][1] * 30 + 40} height="20" x="0" y="0" fill={"rgb(20,148,20)"} />
                                                    </svg>
                                                </td>
                                                <td>
                                                    <svg width="70" height="20" id="lr_long_mae">
                                                        <rect width={modelPerformances["raw_lr_benchmarks"]["long_term_mae"][1] * 30 + 40} height="20" x="0" y="0" fill={"rgb(90,218,90)"} />
                                                    </svg>
                                                </td>

                                                <td>
                                                    <svg width="70" height="20" id="lr_standard_mae">
                                                        <rect width={modelPerformances["raw_lr_benchmarks"]["standard_mae"][1] * 30 + 40} height="20" x="0" y="0" fill={"rgb(70,198,70)"} />
                                                    </svg>
                                                </td>
                                                {/* <td>
                                                <svg width="70" height="20" id="lr_r_squared">
                                                    <rect width={modelPerformances["raw_lr_benchmarks"]["rsquared"][0]*20+40} height="20" x="0" y="0" fill={colorForModels["DunUse"]} />
                                                </svg>
                                            </td> */}

                                            </tr>
                                        </tbody>

                                    </Table>
                                }

                            </Col>
                        </Row>

                        <Row style={{ height: "45vh", borderStyle: "solid", borderWidth: "1px", borderColor: "#838383" }}>
                            <Col >

                                <h5 style={{ textAlign: "center" }}>What-if Histories</h5>
                                <Table hover size="sm">

                                    <thead>
                                        <tr>
                                            <th>Run</th>
                                            <th style={{ textAlign: "center" }}>Diff with prediction</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {diffStats && diffStats.map((curDiff, i) =>
                                            <tr>
                                                <td>{curDiff["Run"]}</td>
                                                <td>
                                                    <SeriesDiff diffdata={curDiff["Value"]}></SeriesDiff>
                                                </td>
                                                <td></td>
                                                {/* <td>{resultStats[i]["Delta"]}</td> */}
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

export default FFA;
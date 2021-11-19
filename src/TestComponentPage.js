
import LineChartDragTest from './LineChartDragTest';
import LineChart from "./LineChart";
import LastLine from "./LastLine";
import MultipleLineTest from './MultipleLineTest';
import React, { useRef, useEffect, useState } from "react";
import useFetchPost from "./useFetchPost";
import WhatIfMapTest from "./WhatIfMapTest";
import { RouteConfigurations } from "./RouteConfigurations";
import NormalDistributionTest from './NormalDistributionTest';
import TimeSeriesLineChartWithBand from "./TimeSeriesLineChartWithBand";



import ZoomChart from './ZoomChart';
const TestComponentPage = () => {
    // temp ship location data
    const c5Config = RouteConfigurations.C5;
    const { data: dailyVesselLocations, isDataLoading: isMapDataLoading, error: errorVesselLoading } = useFetchPost("http://localhost:5000/api/daily_trajectories", ({ "date": "2021-04-07" }));
    
    // const { data: weeklyData, isDataLoading: isWeeklyDataLoading, error: errorWeeklyDataLoading } = useFetchPost("http://localhost:5000/api/weekly_data", ({ "main_page_normalised_data_config": true, "fields": null, "breakdown_by_year": false, "as_list": true }));
    var testDateA = new Date("2021-01-01");
    var testDateB = new Date("2021-01-08");
    var testDateC = new Date("2021-01-15");
    var testDateD = new Date("2021-01-22");
    
    const [testData, setTestData]=useState([[testDateA, 2000], [testDateB, 3000], [testDateC, 1000], [testDateD, 5000]]);
    const [data, setData] = useState(
        Array.from({ length: 50 }, () => Math.round(Math.random() * 100))
      );
    // console.log(testData);

    function handleChange(newTestValue){
        setTestData(newTestValue);
    }


    return (
        <div className="test-component">
            {c5Config && dailyVesselLocations && <WhatIfMapTest variables={c5Config} allShipLocationsByDay={dailyVesselLocations} tempSliderValue={10}></WhatIfMapTest>}
            {/* <LineChartWithVerticalEdit></LineChartWithVerticalEdit> */}
            {/* <h1>sample</h1> */}
            {/* <p>{testData}</p> */}
            {/* need to test how can we sync the graph drag and the parent page state values */}
            {/* {testData && testData.map((cur_ele,i)=>
                // <div>{i}</div>
                <h1 key={i}>{(cur_ele[1]).toString()}</h1>
            )} */}
            <NormalDistributionTest normparams={[5,1]} xparams={[-10,10]}></NormalDistributionTest>
            <br/>
            <br/>
            <LineChart/>
            <LineChartDragTest data={testData} changeParentMethod={handleChange}/>
            <LastLine></LastLine>
            <ZoomChart data={data}/>
            <MultipleLineTest/>

            
            {/* <TimeSeriesLineChart/> */}
        </div>
    );
}

export default TestComponentPage;
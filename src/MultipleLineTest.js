import useFetchPost from "./useFetchPost";
import React, { useRef, useEffect} from "react";
import {
    select,
    line,
    curveCardinal,
    axisBottom,
    axisLeft,
    scaleLinear,
    scaleTime,
    format,
    timeFormat,
    rgb
} from "d3";

const MultipleLineTest = () => {

    const { data: predictionData, isDataLoading: isPredictionDataLoading, error: errorPredictionDataLoaing } = useFetchPost("http://localhost:5000/api/time_series_prediction_combined", ({ "lag": "4", "forcast_steps": "6" }));
    const height = 150;
    const width = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const svgRef = useRef();

    var extractedData = null;
    var timeRange = null;
    var valueRange = null;
    // pre-process all the plotly stuff to d3 compatible, omg, i should have changed the backend
    if (predictionData) {
        var rawDataList = predictionData["plotly_compatible_forecast"]["data"];
        var tempStore = [];
        var tempTimeMin = null;
        var tempTimeMax = null;
        var tempValueMin = Number.MAX_SAFE_INTEGER;
        var tempValueMax = Number.MIN_SAFE_INTEGER;
        for (var i = 0; i < rawDataList.length; i++) {
            var toAppend = {};
            const curObj = rawDataList[i];
            toAppend["name"] = curObj["name"];
            var transformedData = [];
            var xList = curObj["x"];
            var yList = curObj["y"];
            for (var j = 0; j < xList.length; j++) {
                var transformedXValue = new Date(xList[j]);
                transformedData.push([transformedXValue, yList[j]]);

                if (yList[j] > tempValueMax) {
                    tempValueMax = yList[j];
                }
                if (yList[j] < tempValueMin) {
                    tempValueMin = yList[j];
                }
            }
            if (curObj["name"] === "history") {
                tempTimeMin = new Date(curObj["x"][0]);
            }

            if (curObj["name"] === "vecm") {
                tempTimeMax = new Date(curObj["x"][(curObj["x"]).length - 1]);
            }


            const sortedData = transformedData.sort(function (a, b) {
                return a[0] - b[0];
            });
            toAppend["data"] = sortedData;
            tempStore.push(toAppend);
        }

        timeRange = [tempTimeMin, tempTimeMax];
        valueRange = [tempValueMin, tempValueMax];
        extractedData = tempStore;
        // console.log(extractedData);
    }


    useEffect(() => {
        if (extractedData && timeRange && valueRange) {
            var svg = select(svgRef.current).append("svg").attr("width", width).attr("height", height);
            const xScale = scaleTime()
                .domain(timeRange)
                .rangeRound([0, width - margin.left - margin.right]);
            const yScale = scaleLinear()
                // some small twists might need to apply, i leave it for later
                .domain(valueRange)
                .range([height - margin.top - margin.bottom, 0]);

            // const xAxis = axisBottom(xScale).ticks(4).tickFormat(timeFormat("%Y/%m/%d"));
            const xAxis = axisBottom(xScale).ticks(4).tickFormat(timeFormat("%Y/%m/%d"));
            const yAxis = axisLeft(yScale).ticks(3).tickFormat(format("d"));
            // svg
            //     .select(".x-axis").attr("class", "axis")
            //     .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
            //     .call(xAxis);
            // svg.select(".y-axis").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")
            //     .call(yAxis);
            svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")").call(xAxis);
            svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (margin.top) + ")").call(yAxis);
            
                var myLine = line()
                .x(function (d) { return xScale(d[0]); })
                .y(function (d) { return yScale(d[1]); })
                .curve(curveCardinal);



            var colors = [rgb(20, 20, 255), rgb(20, 255, 20), rgb(255, 20, 20), rgb(255, 255, 20), rgb(255, 20, 255)];
            var path = svg.selectAll(".line")
                .data(extractedData)
                .enter()
                .append("path")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "line")
                .attr("d", function (d) {
                    return myLine(d['data'])
                })
                .attr("fill", "none")
                .attr("stroke", function (d, i) {
                    return colors[i]
                })
                .attr("stroke-width", "1px")

            // path.exit().remove()

        }
    }, [extractedData, timeRange, valueRange]);




    return (
        <div className="multiple-line">

            {extractedData &&
                <React.Fragment>
                    <svg ref={svgRef}>
                        {/* <g className="x-axis" />
                        <g className="y-axis" /> */}
                    </svg>


                </React.Fragment>
            }

        </div>
    );
}

export default MultipleLineTest;
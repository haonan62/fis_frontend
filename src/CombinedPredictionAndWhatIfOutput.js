import React, { useRef, useEffect } from "react";
import emergency from "./images/emer.png";
import {
    select,
    line,
    curveCardinal,
    axisBottom,
    axisLeft,
    scaleLinear,
    scaleTime,
    format,
    timeFormat
} from "d3";

const CombinedPredictionAndWhatIfOutput = (props) => {

    const predictionData = props.predictiondata;

    const whatIfData = props.whatifdata;
    const height = 300;
    const width = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const svgRef = useRef(null);

    var extractedData = null;
    var timeRange = null;
    var valueRange = null;
    var toSolder = null;
    // pre-process all the plotly stuff to d3 compatible, omg, i should have changed the backend

    var extractedWhatIfData = null;
    if (whatIfData) {
        var rawDataList = whatIfData["plotly_compatible_forecast"]["data"];
        var tempStore = [];

        for (var i = 0; i < rawDataList.length; i++) {
            var toAppend = {};
            const curObj = rawDataList[i];

            if (curObj["name"] != "history") {
                toAppend["name"] = curObj["name"];
                var transformedData = [];
                // transformedData.push(toSolder);
                var xList = curObj["x"];
                var yList = curObj["y"];
                for (var j = 0; j < xList.length; j++) {
                    var transformedXValue = new Date(xList[j]);
                    transformedData.push([transformedXValue, yList[j]]);

                }
                const sortedData = transformedData.sort(function (a, b) {
                    return a[0] - b[0];
                });
                toAppend["data"] = sortedData;
                tempStore.push(toAppend);
            }
        }
        extractedWhatIfData = tempStore;
        // console.log("attemtion here",extractedWhatIfData);

    }

    if (predictionData) {
        var rawDataList = predictionData["plotly_compatible_forecast"]["data"];
        var tempStore = [];
        var tempTimeMin = null;
        var tempTimeMax = null;
        var tempValueMin = Number.MAX_SAFE_INTEGER;
        var tempValueMax = Number.MIN_SAFE_INTEGER;
        // get the last element of the history data
        for (var i = 0; i < rawDataList.length; i++) {
            const curObj = rawDataList[i];
            if (curObj["name"] === "history") {
                var lastX = new Date(curObj["x"][curObj["x"].length - 1]);
                var lastY = curObj["y"][curObj["y"].length - 1];
                toSolder = [lastX, lastY];
            }
        }
        for (var i = 0; i < rawDataList.length; i++) {
            var toAppend = {};
            const curObj = rawDataList[i];
            toAppend["name"] = curObj["name"];
            var transformedData = [];
            var xList = curObj["x"];
            var yList = curObj["y"];
            if (curObj["name"] !== "history") {
                transformedData.push(toSolder);

            }
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

        // console.log("testshowformat",extractedData);
    }


    useEffect(() => {
        if (extractedData && timeRange && valueRange) {
            var svg = select(svgRef.current);

            svg.selectAll("*").remove();
            svg.attr("width", width).attr("height", height);
            const xScale = scaleTime()
                .domain(timeRange)
                .rangeRound([0, width - margin.left - margin.right]);
            const yScale = scaleLinear()
                // some small twists might need to apply, i leave it for later
                .domain(valueRange)
                .range([height - margin.top - margin.bottom, 0]);

            // const xAxis = axisBottom(xScale).ticks(4).tickFormat(timeFormat("%Y/%m/%d"));
            const xAxis = axisBottom(xScale).ticks(4).tickFormat(timeFormat("%m/%d"));
            const yAxis = axisLeft(yScale).ticks(3).tickFormat(format("d"));
            svg.append("g").attr("class", "x-axis").attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")").call(xAxis);
            svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (margin.top) + ")").call(yAxis);


            var myLine = line()
                .x(function (d) { return xScale(d[0]); })
                .y(function (d) { return yScale(d[1]); })
                .curve(curveCardinal);

            // var colors = [rgb(20, 20, 255), rgb(100, 255, 20), rgb(255, 20, 20), rgb(255, 255, 20), rgb(255, 20, 255)];
            var hexcolors = ["#0B84A5", "#FFA056", "#A4A7AB", "#8DDDD0", "#ff14ff"]


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
                    return hexcolors[i]
                })
                .attr("stroke-width", "1px")

            if (extractedWhatIfData) {
                svg.append("path").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("class", "line").attr("d", function (d) {
                    return myLine(extractedWhatIfData[0]['data'])
                }).attr("fill", "none")
                    .attr("stroke", hexcolors[0])
                    .attr("stroke-width", "1px").style("stroke-dasharray", ("3, 3"))

                svg.append("path").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("class", "line").attr("d", function (d) {
                    return myLine(extractedWhatIfData[1]['data'])
                }).attr("fill", "none")
                    .attr("stroke", hexcolors[1])
                    .attr("stroke-width", "1px").style("stroke-dasharray", ("3, 3"))

                svg.append("path").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("class", "line").attr("d", function (d) {
                    return myLine(extractedWhatIfData[2]['data'])
                }).attr("fill", "none")
                    .attr("stroke", hexcolors[2])
                    .attr("stroke-width", "1px").style("stroke-dasharray", ("3, 3"))

                svg.append("path").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("class", "line").attr("d", function (d) {
                    return myLine(extractedWhatIfData[3]['data'])
                }).attr("fill", "none")
                    .attr("stroke", hexcolors[3])
                    .attr("stroke-width", "1px").style("stroke-dasharray", ("3, 3"))

            }
            svg.append("svg:image")
                .attr('x', 230)
                .attr('y', 12)
                .attr('width', 80)
                .attr('height', 80)
                .attr("xlink:href", emergency)

        }
    }, [extractedData, timeRange, valueRange, extractedWhatIfData]);


    return (
        <div className="multiple-line">

            {extractedData &&
                <React.Fragment>
                    <svg ref={svgRef}>
                    </svg>
                </React.Fragment>
            }

        </div>
    );
}

export default CombinedPredictionAndWhatIfOutput;
import React, { useRef, useEffect, useState } from "react";
import {
    select,
    line,
    curveCardinal,
    axisBottom,
    axisRight,
    axisLeft,
    scaleLinear,
    scaleTime,
    drag,
    event,
    extent,
    format,
    timeFormat,
    zoom
} from "d3";

const TimeSeriesLineChartWithBand = (props) => {
    const variables = props.variables;
    const fields = variables.fields;
    const height = 120;
    const width = 300;
    const originalData = props.originaldata;
    const data = props.data;
    const targetSingleVariable = fields[1];
    const [currentZoomState, setCurrentZoomState] = useState();

    var extractedData = []
    var sortedExtractedData = []
    if (data) {
        for (var j = 0; j < data.length; j++) {
            extractedData.push([data[j]["Date"], data[j][targetSingleVariable]]);
        }
        sortedExtractedData = extractedData.sort(function (a, b) {
            return a[0] - b[0];
        });
    }
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const svgRef = useRef();
    // will be called initially and on every data change
    useEffect(() => {
        const svg = select(svgRef.current);
        // remove the existing svg components for data change
        svg.selectAll("*").remove();
        svg.attr("width",width).attr("height",height);
        const xScale = scaleTime()
            .domain(extent(sortedExtractedData, function (d) { return d[0]; }))
            .rangeRound([0, width - margin.left - margin.right]);
        if (currentZoomState) {
                const newXScale = currentZoomState.rescaleX(xScale);
                // console.log(newXScale.domain())
                xScale.domain(newXScale.domain());
        }
        const yScale = scaleLinear()
            // some small twists might need to apply, i leave it for later
            .domain(extent(originalData, function (d) { return d[targetSingleVariable]; }))
            .range([height - margin.top - margin.bottom, 0]);

        // const xAxis = axisBottom(xScale).ticks(4).tickFormat(timeFormat("%Y/%m/%d"));
        const xAxis = axisBottom(xScale);
        const yAxis = axisLeft(yScale).ticks(3).tickFormat(format("d"));
        // generates the "d" attribute of a path element
        // may have conflict when multiple g appear
        // this way it also solves the axis expansion problem
        svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")").call(xAxis);
        svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (margin.top) + ")").call(yAxis);
        
        
        var myLine = line()
            .x(function (d) { return xScale(d[0]); })
            .y(function (d) { return yScale(d[1]); })
            .curve(curveCardinal);


        svg.append("path");

        svg
            .selectAll(".line")
            .data([sortedExtractedData])
            .join("path")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", "black");
            
        
        // zoom
        const zoomBehavior = zoom()
            .scaleExtent([0.5, 5])
            .translateExtent([
                [0, 0],
                [width, height],
            ])
            .on("zoom", (event) => {
                const zoomState = event.transform;
                setCurrentZoomState(zoomState);
            });

        svg.call(zoomBehavior);
    }, [currentZoomState,sortedExtractedData]);

    return (
        <div className="time-series-line-chart">
            {!sortedExtractedData && <div>Loading Data</div>}
            {sortedExtractedData != [] &&
                // <div>{transformed.length}</div>
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

export default TimeSeriesLineChartWithBand;

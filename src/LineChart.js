import React, { useRef, useEffect, useState } from "react";
import useFetchPost from "./useFetchPost";
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
    zoom
} from "d3";

const LineChart = (props) => {
    const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);

    var test = [[1, 2], [2, 5], [3, 4], [4, 5]];
    const [currentZoomState, setCurrentZoomState] = useState();
    const height = 130;
    const width = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const svgRef = useRef();
    // console.log(extent(test, function (d) { return d[0]; }));
    // will be called initially and on every data change
    useEffect(() => {
        const svg = select(svgRef.current);
        const xScale = scaleLinear()
            .domain(extent(test, function (d) { return d[0]; }))
            .rangeRound([0, width - margin.left - margin.right]);

        if (currentZoomState) {
            const newXScale = currentZoomState.rescaleX(xScale);
            console.log(newXScale.domain())
            xScale.domain(newXScale.domain());
        }
        const yScale = scaleLinear()
            .domain(extent(test, function (d) { return d[1]; }))
            .range([height - margin.top - margin.bottom, 0]);

        const xAxis = axisBottom(xScale).ticks(4).tickFormat(format("d"));

        const yAxis = axisLeft(yScale);
        // generates the "d" attribute of a path element
        // may have conflict when multiple g appear
        // svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")").call(xAxis);
        // svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (margin.top) + ")").call(yAxis);
        
        svg
            .select(".x-axis").attr("class", "axis")
            .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
            .call(xAxis);
        svg.select(".y-axis").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")
            .call(yAxis);
        var myLine = line()
            .x(function (d) { return xScale(d[0]); })
            .y(function (d) { return yScale(d[1]); })
            .curve(curveCardinal);


        svg.append("path");

        svg
            .selectAll(".line")
            .data([test])
            .join("path")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", "blue");
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
    }, [test]);

    return (
        <React.Fragment>
            <svg ref={svgRef}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </React.Fragment>
    );
}

export default LineChart;

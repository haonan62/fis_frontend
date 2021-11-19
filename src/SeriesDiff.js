import React, { useRef, useEffect } from "react";
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
    area
} from "d3";

const SeriesDiff = (props) => {

    const diffData = props.diffdata;

    const sdheight = 50;
    const sdwidth = 300;
    const margin = { top: 2, right: 20, bottom: 2, left: 20 };
    const svgRef = useRef(null);

    var timeRange = null;
    var valueRange = null;
    var tempValueMin = Number.MAX_SAFE_INTEGER;
    var tempValueMax = Number.MIN_SAFE_INTEGER;
    // obtain the range for time and value under this record
    if (diffData) {
        for (var a = 0; a < diffData.length; a++) {
            var curModelDiffRes = diffData[a]["data"];
            var curModelName = diffData[a]["name"]
            if (curModelName === "vecm") {
                timeRange = [curModelDiffRes[0][0], curModelDiffRes[5][0]];
            }
            for (var b = 0; b < curModelDiffRes.length; b++) {
                var curRecord = curModelDiffRes[b];
                if (curRecord[1] < tempValueMin) {
                    tempValueMin = curRecord[1];
                }
                if (curRecord[1] > tempValueMax) {
                    tempValueMax = curRecord[1];
                }
            }
            valueRange = [tempValueMin, tempValueMax]
        }
        // console.log(timeRange, valueRange);
    }
    // pre-process all the plotly stuff to d3 compatible, omg, i should have changed the backend


    useEffect(() => {
        if (diffData && timeRange && valueRange) {
            // var svg = select(svgRef.current).append("svg").attr("width", width).attr("height", height);
            var svg = select(svgRef.current);

            svg.selectAll("*").remove();
            svg.attr("width", sdwidth).attr("height", sdheight);
            const xScale = scaleTime()
                .domain(timeRange)
                .rangeRound([0, sdwidth - margin.left - margin.right]);
            const yScale = scaleLinear()
                // some small twists might need to apply, i leave it for later
                .domain(valueRange)
                .range([sdheight - margin.top - margin.bottom, 0]);

            const xAxis = axisBottom(xScale).ticks(4).tickFormat(timeFormat("%d"));
            const yAxis = axisLeft(yScale).ticks(3).tickFormat(format("d"));

            // need to move x axis to middle of y scale
            // svg.append("g").attr("class", "x-axis").attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")").call(xAxis);
            // svg.append("g").attr("class", "x-axis").attr('transform', 'translate(0,' + (yScale(0))+ (margin.top) + ')').call(xAxis);
            var rX = svg.append("g").attr("class", "x-axis").attr("transform", "translate(" + margin.left + "," + (margin.bottom + yScale(0)) + ")").call(xAxis);
            svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (margin.top) + ")").call(yAxis);
            rX.selectAll("line")
                .style("stroke", "grey").style("opacity", "50%");
            rX.selectAll("path")
                .style("stroke", "grey").style("opacity", "50%");

            var myLine = line()
                .x(function (d) { return xScale(d[0]); })
                .y(function (d) { return yScale(d[1]); })
                .curve(curveCardinal);

            var myArea=area().x(function(d) { return xScale(d[0]); })
            .y0(yScale(0))
            .y1(function(d) { return yScale(d[1]); }).curve(curveCardinal);

            var hexcolors = ["#0B84A5", "#FFA056", "#A4A7AB", "#8DDDD0", "#ff14ff"]

            var path = svg.selectAll(".area")
                .data(diffData)
                .enter()
                .append("path")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "area")
                .attr("d", function (d) {
                    return myArea(d['data'])
                })
                // .attr("fill", "none")
                .attr("fill", function (d, i) {
                    return hexcolors[i]
                }).style("opacity", "50%")
                .attr("stroke-width", "1px")

            var path = svg.selectAll(".line")
                .data(diffData)
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


        }
    }, [diffData, timeRange, valueRange]);


    return (
        <div className="multiple-line">

            {diffData &&
                <React.Fragment>
                    <svg ref={svgRef}>
                    </svg>
                </React.Fragment>
            }

        </div>
    );
}

export default SeriesDiff;
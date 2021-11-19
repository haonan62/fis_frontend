import React, { useRef, useEffect, useState } from "react";
import useFetchPost from "./useFetchPost";
import _ from "lodash";
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
    extent,
    format,
    timeFormat,
    pointers
} from "d3";

const LineChartWithVerticalEditBackup = (props) => {
    const whatIfData=props.volatilewhatifdata;
    // const volatileWhatIfData=props.volatilewhatifdata;
    // original data only aims for searching y boundaries
    const originalData=props.originaldata;
    const activeWindow=props.activewindow;
    const variable=props.variable;
    const handleWhatIfDragChange=props.updatewhatifdata;
    var extractedData=[];
    var sortedExtractedData=[];
    var pointData=[];
    if (whatIfData && originalData && variable){  
        for (var j =0; j< whatIfData.length;j++){
            extractedData.push([whatIfData[j]["Date"],whatIfData[j][variable]]);
        }
        sortedExtractedData=extractedData.sort(function(a,b){
            return a[0] - b[0];
          });
        pointData=sortedExtractedData.slice(-activeWindow);
    }
    
    // console.log("test",activeWindow,pointData);
    const height = 120;
    const width = 250;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const svgRef = useRef();
    // will be called initially and on every data change
    useEffect(() => {
        // var svg = select(svgRef.current).append("svg").attr("width", width).attr("height", height);
        var svg = select(svgRef.current);
        // whenever there is a change in data, remove all
        svg.selectAll("*").remove();
        svg.attr("width",width).attr("height",height);
        const xScale = scaleTime()
            .domain(extent(sortedExtractedData, function (d) { return d[0]; }))
            .rangeRound([0, width - margin.left - margin.right]);

        const yScale = scaleLinear()
            .domain(extent(originalData, function (d) { return d[variable]; }))
            .range([height - margin.top - margin.bottom, 0]);

        const xAxis = axisBottom(xScale).ticks(sortedExtractedData.length).tickFormat(timeFormat("%m/%d"));

        const yAxis = axisLeft(yScale);
        svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")").call(xAxis);
        
        var myLine = line()
            .x(function (d) { return xScale(d[0]); })
            .y(function (d) { return yScale(d[1]); })
            .curve(curveCardinal);

        let dragA = drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
        svg.append("path");

        var alline=svg
            .selectAll(".line")
            .data([sortedExtractedData])
            .join("path")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", "black");

        // add points
        var dC=svg.selectAll('circle')
            .data(sortedExtractedData.slice(-activeWindow))
            .enter()
            .append('circle')
            .attr('r', 6.0)
            .attr('cx', function (d) { return xScale(d[0]); })
            .attr('cy', function (d) { return yScale(d[1]); })
            // make it fit with the margins, otherwise look pretty sad
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .style('cursor', 'pointer')
            .style('fill', '#58F700');

        var nC=svg.selectAll('rect')
        .data(sortedExtractedData.slice(0,-activeWindow))
        .enter()
        .append('rect')
        .attr('width', 8)
        .attr('height', 8)
        .attr('x', function (d) { return xScale(d[0]); })
        // shift the rectangle up a bit to make it appear on the line
        .attr('y', function (d) { return yScale(d[1])-3; })
        // make it fit with the margins, otherwise look pretty sad
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style('fill', 'red').style("opacity", "70%").append("svg:title")
        .text(function(d) { return d[1]; });


        const handleDrag = drag()
            .subject(function () {
                const me = select(this);
                return { x: me.attr('cx'), y: me.attr('cy') }
            })
            .on('drag', function (event, d) {
                const me = select(this);
                me.attr('cy', event.y);
                var a = yScale.invert(event.y);
                d[1]=yScale.invert(event.y)
                // this line is in charge of updating the line
                svg
                .selectAll(".line").join('path').attr('d', myLine);

            }).on("end",function (event,d){
                const me = select(this);

                var a = yScale.invert(event.y);
                // ensure that x value stays the same
                var curTime=xScale.invert(me.attr('cx'));

                var tempData=curTime.toLocaleDateString();
                var parsedDate=new Date(tempData);
                console.log("parsed date",parsedDate);
                var toModify={"Date":parsedDate, "Variable":variable, "Value":a};
                handleWhatIfDragChange(toModify);
            });

        // add drag function to the draggable pointz
        dC
            .call(handleDrag);


        function dragstarted(event, d) {
            select(this).raise().classed('active', true);
        }

        function dragged(event, d) {
            console.log(event, d);
            d[1] = yScale.invert(event.yScale);

            select(this)
                .attr('cy', yScale(d[1]))
        }

        function dragended(event, d) {
            select(this).classed('active', false);
        }
        function tooltipText(d) {
            return 'Color base';
        }

    }, [sortedExtractedData,whatIfData,activeWindow]);

    return (
        <React.Fragment>
            <svg ref={svgRef}>
                {/* <g className="x-axis" /> */}
                {/* <g className="y-axis" /> */}
            </svg>
            
        </React.Fragment>
    );
}

export default LineChartWithVerticalEditBackup;

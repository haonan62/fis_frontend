import React, { useRef, useEffect, useState } from "react";
import useFetchPost from "./useFetchPost";
import _ from "lodash";
import { jStat } from 'jstat';
import {
    select,
    line,
    curveCardinal,
    axisBottom,
    axisLeft,
    scaleLinear,
    extent,
    area
} from "d3";

// generate normal distribution from mean and std
function Random_normal_Dist(mean, sd) {
    var data = [];
    for (var i = mean - 2 * sd; i < mean + 2 * sd; i += 0.1) {
        var q = i
        var p = jStat.normal.pdf(i, mean, sd);
        var arr = [q,p];
        data.push(arr);
    };
    return data;
}

const MultiNormalDist = (props) => {
    const normParams=props.normparams;
    const xParams=props.xparams;
    
    var arimaxNormdata = Random_normal_Dist(normParams['arimax'][0],normParams['arimax'][1]);
    var linearRegressionData=Random_normal_Dist(normParams['linear regression'][0],normParams['linear regression'][1]);
    var processedData=[{"name":"arimax","data":arimaxNormdata},{"name":"linear regression","data":linearRegressionData}];
    var yParams=null;
    // i need to find the true y scale from both the arimax and linear regression 
    if (processedData&&xParams){

        var tempYMin=Number.MAX_SAFE_INTEGER;
        var tempYMax=Number.MIN_SAFE_INTEGER;
        for (var k =0; k<processedData.length; k++){
            var curObjData=processedData[k]["data"];
            // console.log("new attention",curObj["name"]);
            for (var l =0; l<curObjData.length;l++){
                var curY=curObjData[l][1];
                if(curY<tempYMin){
                    tempYMin=curY;
                }
                if(curY>tempYMax){
                    tempYMax=curY;
                }
            }

        }
        yParams=[tempYMin,tempYMax];
        // console.log(tempYMin,tempYMax);
    }
    

    var isBtm=props.islastcoeffcient;
    const name=props.name;
    // make it less high so that it can fit in
    const height = 20;
    const width = 300;
    const margin = { top: 2, right: 20, bottom: 2, left: 20 };
    const svgRef = useRef();
    // will be called initially and on every data change
    useEffect(() => {
        var svg = select(svgRef.current);
        // whenever there is a change in data, remove all
        svg.selectAll("*").remove();
        svg.attr("width",width).attr("height",height);
        const xScale = scaleLinear()
            .domain(xParams)
            .range([0, width - margin.left - margin.right]);

        
        const yScale = scaleLinear()
            .domain(yParams)
            .range([height - margin.top - margin.bottom, 0]);
        const xAxis = axisBottom(xScale).ticks(2);

        if (!isBtm){
            xAxis.tickFormat("");
        }

        const yAxis = axisLeft(yScale);
        var rX=svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")").call(xAxis);
        // svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (margin.top) + ")").call(yAxis);
        rX.selectAll("line")
            .style("stroke", "grey").style("opacity", "10%");
        rX.selectAll("path")
            .style("stroke", "grey").style("opacity", "10%");
         
        var myLine = line()
            .x(function (d) { return xScale(d[0]); })
            .y(function (d) { return yScale(d[1]); })
            .curve(curveCardinal);

        var myArea=area().x(function(d) { return xScale(d[0]); })
            .y0(yScale(0))
            .y1(function(d) { return yScale(d[1]); }).curve(curveCardinal);

        var hexcolors=["#0B84A5","#FFA056"];
        var allArea=svg
            .selectAll(".area")
            .data(processedData)
            .enter()
            .append("path")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "area")
            .attr("d", function (d) {
                return myArea(d['data'])
            })
            .attr("fill", function (d, i) {
                return hexcolors[i]
            })
            .style("opacity", "50%")
            .attr("stroke", "white");
        
        var alline=svg
            .selectAll(".line")
            .data(processedData)
            .enter()
            .append("path")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "line")
            .attr("d", function (d) {
                return myLine(d['data'])
            })
            .attr("fill", "none")
            .style("opacity", "50%")
            .attr("stroke", "white");

        var sText=svg.append("text")
            .attr("x", 0)
            .attr("y", height/2)
            .attr("dy", ".35em")
            .text(name).style("font-size", "8px");

    }, [processedData,xParams,name,yParams]);

    return (
        <React.Fragment>
            <svg ref={svgRef} >
            </svg>
        </React.Fragment>
    );
}

export default MultiNormalDist;

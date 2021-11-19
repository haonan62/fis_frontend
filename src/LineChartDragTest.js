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
    timeFormat
} from "d3";

const LineChartDragTest = (props) => {
    var testDateA = new Date("2021-01-01");
    var testDateB = new Date("2021-01-08");
    var testDateC = new Date("2021-01-15");
    var testDateD = new Date("2021-01-22");
    // const test = [[testDateA, 2000], [testDateB, 3000], [testDateC, 1000], [testDateD, 5000]]
    const test= props.data;
    const handleParentChange=props.changeParentMethod;

    var tempToReflect=_.cloneDeep(test);

    const [toReflect, setToReflect]=useState(null);

    const height = 120;
    const width = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const svgRef = useRef();
    // will be called initially and on every data change
    useEffect(() => {
        const svg = select(svgRef.current);


        const xScale = scaleTime()
            .domain(extent(test, function (d) { return d[0]; }))
            .rangeRound([0, width - margin.left - margin.right]);

        const yScale = scaleLinear()
            .domain(extent(test, function (d) { return d[1]; }))
            .range([height - margin.top - margin.bottom, 0]);

        const xAxis = axisBottom(xScale).ticks(3).tickFormat(timeFormat("%Y/%m/%d"));

        const yAxis = axisLeft(yScale);

        // generates the "d" attribute of a path element
        // may have conflict when multiple g appear
        // svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")").call(xAxis);
        // svg.append("g").attr("class", "axis").attr("transform", "translate(" + margin.left + "," + (margin.top) + ")").call(yAxis);


        //testing whether this will make the axis problem a little bit better
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

        let dragA = drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
        svg.append("path");

        svg
            .selectAll(".line")
            .data([test])
            .join("path")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", "black");

        // add points
        svg.selectAll('circle')
            .data(test)
            .enter()
            .append('circle')
            .attr('r', 3.0)
            .attr('cx', function (d) { return xScale(d[0]); })
            .attr('cy', function (d) { return yScale(d[1]); })
            // make it fit with the margins, otherwise look pretty sad
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .style('cursor', 'pointer')
            .style('fill', 'orange');
        
        // svg.selectAll(".val").data(test)
        //     .enter()
        //     .append('text')
        //       .attr("x", d => xScale(d[0]))
        //       .attr("y", d => yScale(d[1]))
        //       .attr("dy", "-0.5em").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        //       .attr("text-anchor", "middle")
        //       .text(d => d[1]);

        const handleDrag = drag()
        // have to set the subject, otherwise it will "jump a little bit on start"
            .subject(function () {
                const me = select(this);

                return { x: me.attr('cx'), y: me.attr('cy') }


            })
            .on('drag', function (event, d) {
                const me = select(this);
                // me.attr('cx', event.x);
                me.attr('cy', event.y);


                d[1] = yScale.invert(event.y);
                svg
                    .selectAll(".line").join('path').attr('d', myLine);
                // svg.selectAll(".val").append('text')
            }).on("end",function (event,d){

                var a = yScale.invert(event.y);
                var curTime = xScale.invert(event.x);
                // console.log(a,curTime);
                var toModify = JSON.parse(JSON.stringify(test));
                for (var i = 0; i < toModify.length; i++) {
                    toModify[i][0] = new Date(toModify[i][0]);
                    if (toModify[i][0] === curTime) {
                        toModify[i][1] = a;
                    }
                }
                // handleParentChange(toModify);
                // svg
                //     .selectAll(".line").join('path').attr('d', myLine);
                
            });


        // add drag function
        svg.selectAll('circle')
            .call(handleDrag);


        function dragstarted(event, d) {
            select(this).raise().classed('active', true);
        }

        function dragged(event, d) {
            // d[0] = x.invert(d3.event.x);
            console.log(event, d);
            d[1] = yScale.invert(event.yScale);
            // note, the number here as logged is infinity, i still having trouble finding out how to resolve

            console.log(d[1]);
            console.log(yScale(d[1]));
            select(this)
                // .attr('cx', x(d[0]))
                .attr('cy', yScale(d[1]))

            svg.selectAll(".line").join('path').attr('d', myLine);
        }

        function dragended(event, d) {
            select(this).classed('active', false);
        }



    }, [test]);

    // why this does not work? i am crying myself already!!!!
    // cry myself a river, this still cannot be resolved
    // do i need external backups already?
    // useEffect(()=>{
    //     console.log(select(svgRef.current));

    // },[select(svgRef.current)])

    return (
        <React.Fragment>
            <svg ref={svgRef}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </React.Fragment>
    );
}

export default LineChartDragTest;

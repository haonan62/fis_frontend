import React, { Component } from 'react';
import * as d3 from 'd3';
class Line extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount(){
        this.oneMethod()
    }

    oneMethod(){

        var width = 150;                        //SVG绘制区域的宽度
        var height = 100;                       //SVG绘制区域的高度

        var svg = d3.select("#body")            //选择id为body的div
                    .append("svg")              //在div中添加<svg>
                    .attr("width",width)        //设定<svg>的宽度
                    .attr("height",height)      //设定<svg>的高度

        //数据
        var dataList = [
            {
                coountry : "china",
                gdp : [
                    [2000,11920],[2001,13170],[2002,14550],[2003,16500],[2004,19440],[2005,22870],
                    [2006,27930],[2007,35040],[2008,45470],[2009,51050],[2010,59490],[2011,73140],
                    [2012,83860],[2013,103550]
                ]
            },
            {
                coountry : "japan",
                gdp : [
                    [2000,47310],[2001,41590],[2002,39800],[2003,43020],[2004,46500],[2005,45710],
                    [2006,43560],[2007,43560],[2008,48490],[2009,50350],[2010,54950],[2011,59050],
                    [2012,59370],[2013,48980]
                ]
            }
        ]

        //外边框
        var padding = {top : 20 , right : 20 , bottom : 20 , left : 20};

        //计算GDP的最大值
        var gdpmax = 0;
        for (var i = 0; i < dataList.length ; i++){
            var currGdp = d3.max(dataList[i].gdp,function(d){
                return d[1]
            })
            if(currGdp > gdpmax){
                gdpmax = currGdp
            }
        }


        //先选出年份的最小值与最大值
        for (var i = 0; i < dataList.length ; i++){
            var min = d3.min(dataList[i].gdp,function(d){return d[0]})
            var max = d3.max(dataList[i].gdp,function(d){return d[0]})
        }
       //定义比例尺,均为线性比例尺
        var xScale = d3.scaleLinear()                                  //定义一个比例尺
                        .domain([min,max])                              //设定x轴的值域
                        .range([0,width-padding.left - padding.right])  //设定x轴的定义域

        var yScale = d3.scaleLinear()                                  //定义一个比例尺
                        .domain([0,gdpmax*1.1])                         //设定y轴的值域
                        .range([height-padding.top-padding.bottom,0])   //设定y轴的定义域
        //创建一个线段生成器
        var linePath = d3.line()                        //使用basis插值模式
                        .x(function(d){return xScale(d[0])})            //设置x坐标的访问器
                        .y(function(d){return yScale(d[1])}).curve(d3.curveCardinal);           //设置y坐标的访问器

        //定义两个颜色
        var colors = [d3.rgb(0,0,255),d3.rgb(0,255,0)]

        //添加路径
        svg.selectAll("path")                   //选择svg中所有的path
            .data(dataList)                     //绑定数据
            .enter()                            //获取enter部分
            .append("path")                     //添加足够数量的<path>元素
            .attr("transform","translate("+padding.left + "," + padding.top + ")")  //平移
            .attr("d",function(d){
                return linePath(d.gdp)          //返回线段生成器得到的路径
            })
            .attr("fill","none")                //填充色为none
            .attr("stroke",function(d,i){
                return colors[i]                //设置折线颜色
            })
            .attr("stroke-width","3px")         //设置折线的宽度

        //坐标轴x轴
        var xAxis = d3.axisBottom(xScale)            //设定x坐标轴的比例尺
                    .ticks(6)                   //设定x坐标轴的分隔数
                    .tickFormat(d3.format("d")) 
        var yAxis = d3.axisLeft(yScale) 
        //添加一个<g>元素用于放x轴
        svg.append("g")                         //添加一个<g>元素
            .attr("class","axis")               //定义class名
            .attr("transform","translate("+padding.left + "," + (height-padding.bottom) + ")")  //平移
            .call(xAxis)                        //call()应用

        //添加一个<g>元素用于放y轴
        svg.append("g")                         //添加一个<g>元素
            .attr("class","axis")               //定义class名
            .attr("transform","translate("+ padding.left + "," + padding.top + ")")             //平移
            .call(yAxis)                        //call()应用

        //添加两个矩形标记
        var g = svg.selectAll("rect")           //将选择集赋值给变量g
            .data(dataList)                     //绑定数据
            .enter()                            //获取enter()部分
            .append("g")                        //添加<g>元素
        g.append("rect")                        //在<g>元素里添加<rect>矩形
            .attr("fill",function(d,i){         //设定颜色
                return colors[i]
            })
            .attr("transform",function(d,i){    //平移
                var x = padding.left + i*150
                var y = height - padding.bottom + 50
                return "translate(" +x + "," + y + ")"
            })
            .attr("width",20)                   //设定矩形的宽度
            .attr("height",20)                  //设定矩形的高度

        //添加注解
        g.append("text")                        //添加文字
            .attr("class","text")               //定义class名
            .attr("x",function(d,i){            //设定文字在x方向的位置
                return padding.left + i * 150 + 30
            })
            .attr("y",function(d,i){            //设定文字在y方向的位置
                return height - padding.bottom + 50 + 15
            })
            .text(function(d){                  //设定文字的内容
                return d.coountry
            })
            .attr("font-size","15px")           //设定文字的大小
            .attr("fill","black")               //设定文字的颜色

    }

    

    render() {
        return (
            <div id="body" >

            </div>
        );
    }
}

export default Line;
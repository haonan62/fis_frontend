import CanvasJSReact from './canvasjs.react';
// import useFetchGet from "./useFetchGet";
import useFetchPost from './useFetchPost';

const CanvasLineChart = (props) => {
    const variables=props.variables;
    
    const CanvasJS = CanvasJSReact.CanvasJS;
    const CanvasJSChart = CanvasJSReact.CanvasJSChart;
    
    const { data: weeklyData, isDataLoading, error}=useFetchPost("http://localhost:5000/api/weekly_data",({fields:variables}));
    console.log(weeklyData);
    return ( 
        <div className="line-chart">
            {isDataLoading && <div>Loading Data</div>}
            <CanvasJSChart options={weeklyData}></CanvasJSChart>
        </div>
     );
}
 
export default CanvasLineChart;
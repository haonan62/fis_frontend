
import useFetchPost from './useFetchPost';
import Plot from 'react-plotly.js';


const PlotlyLineChart = (props) => {
    const variables = props.variables;
    // console.log(variables);
    const layout = props.layout;
    const displayModeBar=props.displayModeBar;

    const { data: weeklyData, isDataLoading, error } = useFetchPost("http://localhost:5000/api/weekly_data", ({ fields:variables.fields, breakdown_by_year:variables.breakdown_by_year, axis_config:variables.axis_config}));

    // console.log(weeklyData);
    return (

        <div className="line-chart">
            {isDataLoading && <div>Loading Data</div>}
            {weeklyData && <Plot data={weeklyData["data"]} layout={layout} displayModeBar={displayModeBar} />}
        </div>
    );
}

export default PlotlyLineChart;



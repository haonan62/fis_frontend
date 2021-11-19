
import useFetchPost from './useFetchPost';
import Plot from 'react-plotly.js';


const PlotlyRadarChart = (props) => {
    const variables = props.variables;
    const layout = variables.layout;
    const data = variables.data;
    const displayModeBar = props.displayModeBar;

    // const { data: weeklyData, isDataLoading, error } = useFetchPost("http://localhost:5000/api/weekly_data", ({ fields: variables, "frontend_lib_config": "Plotlyjs" }));
    // const data = [{
    //     type: 'scatterpolar',
    //     r: [39, 28, 8, 7, 28, 39],
    //     theta: ['A', 'B', 'C', 'D', 'E', 'A'],
    //     fill: 'toself'
    // }];

    // const layout = {
    //     polar: {
    //         radialaxis: {
    //             visible: true,
    //             range: [0, 50]
    //         }
    //     },
    //     showlegend: false
    // }
    // console.log(weeklyData);
    return (

        <div className="radar-chart">
            {/* {isDataLoading && <div>Loading Data</div>} */}
            {/* {weeklyData && <Plot data={weeklyData["data"]} layout={layout} displayModeBar={displayModeBar} />} */}
            <Plot data={data} layout={layout} />
        </div>
    );
}

export default PlotlyRadarChart;



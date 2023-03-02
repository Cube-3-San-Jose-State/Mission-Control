import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Queue from '../../Components/Queue'
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
/*
    <TimeGraph title={} dataSets={[]} timestamp={[]}, maxMin={[]}/>
    title - "IMU Data"
    individual dataSet: { //will be overridden
        label: 'x',
        data: data.imu["ACCEL_X"],
        borderColor: 'red',
        showLine: true
    }

    ---
    for each dataset: 
        create a queue in state
    create empty graphData in state:

    create general options:
        title = props.title

    useEffect:
        let generatedDatasets = [];
        for each i-th queue:
            i-th_queue.enequeue({x: time, y: props.dataSets['data']})
            let generatedDataset = {}
            generatedData = {...props.dataSets[i]}
            generatedData['data] = i_th.queue.getArray();
            generatedDatasets.push(generatedData);
        setGraphData({datasets: [...generatedDatasets]});
    
    return:
        Line options={options} data={state.graphdata}
        
        
    
*/
function TimeGraph(props) {
    let queuesHolder = [];
    for ( let i = 0; i < props.datasets.length; i++ ){
        queuesHolder.push(new Queue(25));
    }
    const [queues, setQueues] = useState(queuesHolder);
    const [graphData, setGraphData] = useState({
		datasets: [{
			label: 'x',
			data: [],
			backgroundColor: 'rgb(255, 0, 0)',
		}]
	});
    
    let options = {
		type: 'line',
		responsive: true,
		animation: false,
		plugins: {
			title: {
				display: true,
				text: props.title
			},
			decimation: {
				enabled: true,
				algorithm: 'lttb',
				samples: 500
			}
		},
		scales: {
			x: {
				type: 'time',
				time: {
					unit: 'second'
				},
                ticks: {
                    maxRotation: 0
                }
			},
			y: {
				max: props.maxMin[0],
				min: props.maxMin[1],
				ticks: {
					callback: function(val, i, vals){
						return val + props.unit
					}
				},
			}
		},
		elements:{
			point: {
				radius: 0
			}
		}
    }

    useEffect(() => {
        let generatedDatasets = [];
        for (let i = 0; i < props.datasets.length; i++){
            let currentQueue = queues[i];
            currentQueue.enqueue( {x: props.timestamp, y: props.datasets[i]['data']} );
            let generatedData = {...props.datasets[i]};
            generatedData['data'] = currentQueue.getArray();
            generatedDatasets.push(generatedData);
        }   

        setGraphData( {datasets: [...generatedDatasets]} );
    }, [props]);
    
    return(
		<Line options={options} data={graphData}></Line>
    )
};

export default TimeGraph;

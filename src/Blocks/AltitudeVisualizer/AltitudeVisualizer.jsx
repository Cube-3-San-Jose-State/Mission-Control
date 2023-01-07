import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Queue from '../../Components/Queue'
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function AccelerometerGraph(props){
	const [xAccelQueue, setxAccelQueue] = useState(new Queue(75));
	const [yAccelQueue, setyAccelQueue] = useState(new Queue(75));
	const [zAccelQueue, setzAccelQueue] = useState(new Queue(75));
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
		animation: {
			duration: 0
		},
		plugins: {
			title: {
				display: true,
				text: "Accelerometer"
			},
			decimation: {
				enabled: true,
				algorithm: 'lttb',
				samples: 50
			}
		},
		scales: {
			x: {
				type: 'time',
				time: {
					unit: 'second'
				}
			},
			y: {
				max: 20,
				min: -20,
				ticks: {
					callback: function(val, i, vals){
						return val + ""
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
		xAccelQueue.enqueue( {x: props.timestamp, y: (props.imu.ACCEL_X * RAW_TO_MPH_RATIO)});
		yAccelQueue.enqueue( {x: props.timestamp, y: props.imu.ACCEL_Y * RAW_TO_MPH_RATIO});
		zAccelQueue.enqueue( {x: props.timestamp, y: props.imu.ACCEL_Z * RAW_TO_MPH_RATIO});

		setGraphData({
			datasets: [
				{
					label: 'x',
					data: xAccelQueue.getArray(),
					backgroundColor: 'rgb(255, 0, 0)',
					borderColor: 'rgb(255, 0, 0)',
					showLine: true
				},
				{
					label: 'y',
					data: yAccelQueue.getArray(),
					backgroundColor: 'rgb(0, 255, 0)',
					borderColor: 'rgb(0, 255, 0)',
					showLine: true
				}
				,
				{
					label: 'z',
					data: zAccelQueue.getArray(),
					backgroundColor: 'rgb(0, 0, 255)',
					borderColor: 'rgb(0, 0, 255)',
					showLine: true
				}
				
			]
		});

	}, [props])


	return(
		<Line options={options} data={graphData}></Line>
	)
}
export default AccelerometerGraph;
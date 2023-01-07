import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Queue from '../../Components/Queue';
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const RAW_TO_DPS_RATIO = 1/131.0; //Raw values range ±32750

function GyroscopeGraph(props){
	const [xGyroQueue, setxGyroQueue] = useState(new Queue(50));
	const [yGyroQueue, setyGyroQueue] = useState(new Queue(50));
	const [zGyroQueue, setzGyroQueue] = useState(new Queue(50));
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
				text: "Gyroscope"
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
				max: 360,
				min: -360,
				ticks: {
					callback: function(val, i, vals){
						return val + "°/s"
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
		xGyroQueue.enqueue( {x: props.timestamp, y: (props.imu.GYRO_X * RAW_TO_DPS_RATIO)});
		yGyroQueue.enqueue( {x: props.timestamp, y: props.imu.GYRO_Y * RAW_TO_DPS_RATIO});
		zGyroQueue.enqueue( {x: props.timestamp, y: props.imu.GYRO_Z * RAW_TO_DPS_RATIO});

		setGraphData({
			datasets: [
				{
					label: 'x',
					data: xGyroQueue.getArray(),
					backgroundColor: 'rgb(255, 0, 0)',
					borderColor: 'rgb(255, 0, 0)',
					showLine: true
				},
				{
					label: 'y',
					data: yGyroQueue.getArray(),
					backgroundColor: 'rgb(0, 255, 0)',
					borderColor: 'rgb(0, 255, 0)',
					showLine: true
				}
				,
				{
					label: 'z',
					data: zGyroQueue.getArray(),
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
export default GyroscopeGraph;
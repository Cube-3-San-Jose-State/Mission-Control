import React, { Component } from 'react'
import JSON5 from 'json5'
import PrettyData from "./Blocks/PrettyData/PrettyData.jsx"
import GyroscopeScene from './Blocks/GyroscopeScene/GryoscopeScene.jsx';
import IMUVisualizer from './Blocks/IMUVisualizer/IMUVisualizer.jsx';
import TimeGraph from './Blocks/TimeGraph/TimeGraph.jsx';
import FlightModeVisualizer from './Blocks/FlightModeVisualizer/FlightModeVisualizer.jsx';
import UpdateLog from './Blocks/UpdateLog/UpdateLog.jsx'

class App extends Component {
	constructor(props){	
		super(props);
		this.startingTime = new Date(Date.now());
		this.dateHolder = new Date();
		this.dateHolder.setTime(this.startingTime);
		this.state = {
			data: {
				"ID": null,
				"TIMESTAMP": null,
				"MILLIS": null,
				"HEARTBEAT": null,
				"CAMERA_STATUS": null,
				"GPS": {
					"LATITUDE": null,
					"LONGITUDE": null
				},
				"BAROMETER": {
					"ALTITUDE": null,
					"TEMPERATURE": null
				},
				"IMU": {
					"ACCEL_X": null,
					"ACCEL_Y": null,
					"ACCEL_Z": null,
					"GYRO_X": null,
					"GYRO_Y": null,
					"GYRO_Z": null,
					"PITCH": null,
					"ROLL": null,
					"YAW": null,
				}
			},
			rawSerial: ""
		}
	}

	render() {
    	return (
      		<>
				<div id="sidebar-l">
					<div id="menu">
						<img src="https://i.ibb.co/nzByFQw/icon.png" alt="icon" border="0"/>
						<h2>Project JAVELIN</h2>
						<h3 className="subheading">Mission Control</h3>	
						<button id="open" onClick={this.readSerial.bind(this)}>Connect</button>
						<button id="record">Record Data</button>
					</div>
				</div> 

				<div className="blocks-container">
					<div className="block">
						<PrettyData data={this.state.data}/>
					</div>
					<div className="block">
						<GyroscopeScene imu={this.state.data["IMU"]}/>
					</div>
					<div className="block">
						<IMUVisualizer imu={this.state.data["IMU"]} timestamp={this.state.data["TIMESTAMP"]}/>
					</div> 
					<div className="block">
					</div>
					<div className="block">
					<TimeGraph 
							title='Temperature' 
							timestamp={this.state.data["TIMESTAMP"]}
							maxMin={[90, 70]}
							unit='F'
							datasets={[
								{
									label: 'x',
									data: (this.state.data["BAROMETER"]["TEMPERATURE"]),
									backgroundColor: 'yellow',
									borderColor: 'yellow',
									showLine: true 
								}
							]}
					></TimeGraph>
					<TimeGraph 
							title='Altitude' 
							timestamp={this.state.data["TIMESTAMP"]}
							maxMin={[0, 20]}
							unit='m'
							datasets={[
								{
									label: 'x',
									data: this.state.data["BAROMETER"]["ALTITUDE"],
									borderColor: 'orange',
									backgroundColor: 'orange',
									showLine: true 
								}
							]}
					></TimeGraph>
					</div>
					<div className="block">
						<FlightModeVisualizer mode={this.state.data["FLIGHT_MODE"]}/>
					</div> 
				</div> 

				<div id="sidebar-r">
					<div id="logs">
						<UpdateLog data={this.state.data} rawSerial={this.state.rawSerial}/>
					</div>
				</div>
			</>
    	)
  	}

	componentDidMount(){
		if (!("serial" in navigator)){
			alert('Web Serial is not supported in this browser. Try opening this page in either Chrome or Edge.');
		}
	}


	async readSerial(){
		const port = await navigator.serial.requestPort();
		let builderString = '';
		await port.open({ baudRate: 9600, bufferSize: 600 });
		let prevHrtBeat = 0;
		
		while (port.readable){
			const textDecoder = new TextDecoderStream();
			const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
			const reader = textDecoder.readable.getReader();
			let buffer = 15;
			
			try { 
				while(true){
					const { value, done } = await reader.read();
					if (done) {
						reader.releaseLock();
						break;
					}
					
					if (buffer > 0) { 
						buffer--;
					}
					else {
						for (let char of value) {
							if (char !== "\n") {
								builderString += char;
								console.log(char);
							}

							if (char == "*")  {
								this.setState({ rawSerial: this.state.rawSerial + builderString });
								let fullDataString = builderString.substring(builderString.indexOf("{"), builderString.indexOf("*"));
								this.parseInput(fullDataString);
								builderString = "";
							}
						}
					}
				}
			} catch (error) {
				console.error(error);
			}
		}
	}

	parseInput(input){
		try{
			let parsed = JSON5.parse(input);
			let data = {};
			
			if (parsed["ID"] == "P") data["ID"] = "PAYLOAD"; 
			if (parsed["ID"] == "C") data["ID"] = "CONTAINER";
			
			data["SECONDS"] = performance.now() / 1000;
			this.dateHolder = new Date(this.startingTime.getTime() + data["SECONDS"] * 1000);
			
			data["TIMESTAMP"] = this.dateHolder;
			
			data["HEARTBEAT"] = parsed["HRB"];
			
			if (parsed["FLM"] == "U") data["FLIGHT_MODE"] = "PREFLIGHT";
			if (parsed["FLM"] == "A") data["FLIGHT_MODE"] = "ARMED"
			if (parsed["FLM"] == "L") data["FLIGHT_MODE"] = "LAUNCHED";
			if (parsed["FLM"] == "D") data["FLIGHT_MODE"] = "DEPLOYED";
			if (parsed["FLM"] == "S") data["FLIGHT_MODE"] = "PARACHUTE";
			if (parsed["FLM"] == "G") data["FLIGHT_MODE"] = "LANDED";

			if (parsed["CAM"] == "0") data["CAMERA_STATUS"] = "ON";
			if (parsed["CAM"] == "1") data["CAMERA_STATUS"] = "OFF";

			data["GPS"] = {
				LATITUDE: parsed["GPS"][0],
				LONGITUDE: parsed["GPS"][1],
			}

			data["BAROMETER"] = {
				ALTITUDE: parsed["BAR"][0],
				TEMPERATURE: parsed["BAR"][1]
			};

			data["IMU"] = {
				ACCEL_X: parsed["IMU"][0],
				ACCEL_Y: parsed["IMU"][1],
				ACCEL_Z: parsed["IMU"][2],
				GYRO_X: parsed["IMU"][3],
				GYRO_Y: parsed["IMU"][4],
				GYRO_Z: parsed["IMU"][5],
				PITCH: parsed["IMU"][6],
				ROLL: parsed["IMU"][7],
				YAW: parsed["IMU"][8]
			}
			this.setState({data: data});
		} catch (err){
			console.error(err);
		}
	}
}

export default App;
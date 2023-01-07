import React, { Component } from 'react'
import PrettyData from "./Blocks/PrettyData/PrettyData.jsx"
import GyroscopeScene from './Blocks/GyroscopeScene/GryoscopeScene.jsx';
import IMUVisualizer from './Blocks/IMUVisualizer/IMUVisualizer.jsx';
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
				"IS_OPERATIONAL": null,
				"AIR_SPEED": null,
				"CAMERA_STATUS": null,
				"BAROMETER": {
					"ALTITUDE": null,
					"PRESSURE": null,
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
				},
				"BATTERY": null
			}
		}
	}

	render() {
    	return (
      		<>
				<div className="menu">
					<button id="open" onClick={this.readSerial.bind(this)}>Connect</button>
					<button id="record">Record Data</button>
				</div>
				<div className="blocks-container">
					<div className="block">
						<PrettyData data={this.state.data}/>
					</div>
					<div className="block">
						<IMUVisualizer imu={this.state.data["IMU"]} timestamp={this.state.data["TIMESTAMP"]}/>
					</div>
					<div className="block">
						<GyroscopeScene imu={this.state.data["IMU"]}/>
					</div> 
					<div className="block">gps info</div>
					<div className="block">fuel gage</div>
					<div className="block">altitude data</div> 
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
		let builderString = "";
		await port.open({ baudRate: 9600, bufferSize: 600 });
		
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

					if (buffer >=0) {
						buffer--;
					} else {
						builderString += value;
					}
					
					if (value.includes("\n") && buffer <= 0){
						this.parseInput(builderString);
						builderString = "";
					}
				}
			} catch (error) {
				console.error(error);
			}
		}
	}

	parseInput(input){
		try{
			let parsed = JSON.parse(input);
			let data = {};
			
			if (parsed["ID"] == "P") data["ID"] = "PAYLOAD";
			if (parsed["ID"] == "C") data["ID"] = "CONTAINER";
			
			data["SECONDS"] = performance.now() / 1000;
			this.dateHolder = new Date(this.startingTime.getTime() + data["SECONDS"] * 1000);
			
			data["TIMESTAMP"] = this.dateHolder;
			
			data["HEARTBEAT"] = parsed["HRB"];
			
			if (parsed["ISO"] == "0") data["IS_OPERATIONAL"] = "YES";
			if (parsed["ISO"] == "1") data["IS_OPERATIONAL"] = "NO";

			if (parsed["FLM"] == "F") data["FLIGHT_MODE"] = "FLIGHT";
			if (parsed["FLM"] == "L") data["FLIGHT_MODE"] = "LANDING";
			if (parsed["FLM"] == "P") data["FLIGHT_MODE"] = "PREDEPLOYED";

			data["AIR_SPEED"] = parsed["SPD"];

			if (parsed["CAM"] == "0") data["CAMERA_STATUS"] = "ON";
			if (parsed["CAM"] == "1") data["CAMERA_STATUS"] = "OFF";

			data["BAROMETER"] = {
				ALTITUDE: parsed["BAR"][0],
				PRESSURE: parsed["BAR"][1],
				TEMPERATURE: parsed["BAR"][2]
			};

			data["IMU"] = {
				ACCEL_X: parsed["IMU"][0],
				ACCEL_Y: parsed["IMU"][1],
				ACCEL_Z: parsed["IMU"][2],
				GYRO_X: parsed["IMU"][3],
				GYRO_Y: parsed["IMU"][4],
				GYRO_Z: parsed["IMU"][5],
				PITCH: parsed["IMU"][6],
				ROLL: parsed["IMU"][7]
			}

			data["BATTERY"] = parsed["BAT"];

			this.setState({data: data});
		} catch (err){
			console.error(err);
		}
	}
}

export default App;
import React, { Component } from 'react'
import "./UpdateLog.css"

class UpdateLog extends Component {
		constructor(props){
			super(props);
			this.serialLog = React.createRef();

			this.state = {
				logs: [],
				operational: false,
				errorHeartbeat: 0,
				displayString: ""
			};
		}


		componentDidUpdate(previousProps){
			let previousData = previousProps.data;
			let currentData = this.props.data;
			if (currentData["ID"] !== null && this.state.operational == false){
				let initialConnectMessage = `[${currentData["HEARTBEAT"]}] Connection to MC initialized\n`;
				let messageElement = <UpdateMessage message={initialConnectMessage}/>;
				this.setState( {logs: [messageElement], operational: true} );
			}

			// logs when heartbeats skipped. keeps state var errorHeartbeat to avoid infinite loops
			if (currentData["HEARTBEAT"] != previousData["HEARTBEAT"] + 1 ) {
				let packetLost = currentData["HEARTBEAT"] - previousData["HEARTBEAT"];
				let errorMessage = `[${previousData["HEARTBEAT"]}] HRB skipped to ${currentData["HEARTBEAT"]} - Packets lost: ${packetLost-1}\n`;
				console.log(errorMessage);

				if (this.state.errorHeartbeat !== currentData["HEARTBEAT"] && this.state.operational == true && packetLost !== 0) {
					let messageElement = <UpdateMessage message={errorMessage}/>
					this.setState({logs: [messageElement, ...this.state.logs], errorHeartbeat: currentData["HEARTBEAT"]});
				}

			}
		}


    	render() { 
			return (
	    		<div id="update-log-container">
					<h2>Update Log</h2>
					<div id="update-log">
						{...this.state.logs}
					</div>
				</div>

    		)
		}
}

class UpdateMessage extends Component {
	render() {
		return (
			<div className="update-log-message">
				<span>{this.props.message}</span>
			</div>
		)
	}
}

export default UpdateLog;
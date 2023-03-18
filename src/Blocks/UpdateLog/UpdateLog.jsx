import React, { Component } from 'react'

class UpdateLog extends Component {
		constructor(props){
			super(props);
			this.state = {
				logs: [],
				displayString: ""
			};
		}

		

		componentDidUpdate(previousProps){
			let previousData = previousProps.data;
			let currentData = this.props.data;

			if (currentData["HEARTBEAT"] != previousData["HEARTBEAT"] + 1 ) {
				let packetLost = currentData["HEARTBEAT"] - previousData["HEARTBEAT"];
				console.log("TRANSMISSION ERROR at HB: "+previousData["HEARTBEAT"]+".\nTotal packets lost: "+packetLost);
			}
		}


    	render() { 
			return (
	    		<div>
					<h1>Update Log</h1>
					<div id="updateLog">
						{...this.state.logs}
					</div>
				</div>

    		)
		}
}

export default UpdateLog;
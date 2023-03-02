import React, { Component } from 'react'
import "../FlightModeVisualizer/FlightModeVisualizer.css"

export default class FlightModeVisualizer extends Component {
	render() {
    	return (
			<div id="flight-mode-visualizer">
				<div id="flight-mode-visualizer-container">
					<div className={(this.props.mode == "PREFLIGHT") ? "flight-mode-active" : null}>PREFLIGHT</div>
					<div className={(this.props.mode == "ASCENT") ? "flight-mode-active" : null}>ASCENT</div>
					<div className={(this.props.mode == "DEPLOYED") ? "flight-mode-active" : null}>DEPLOYED</div>
					<div className={(this.props.mode == "PARACHUTE") ? "flight-mode-active" : null}>PARACHUTE</div>
					<div className={(this.props.mode == "LANDED") ? "flight-mode-active" : null}>LANDED</div>
				</div>
			</div>
		)
	}
}

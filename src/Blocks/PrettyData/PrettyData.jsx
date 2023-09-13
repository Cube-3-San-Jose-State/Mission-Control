import React, { Component } from 'react'

class PrettyData extends Component {
    constructor(props) {
        super(props)        
    }

    units = {
        SECONDS: "s",
        LATITUDE: "°",
        LONGITUDE: "°",
        ALTITUDE: "ft",
        TEMPERATURE: "°F",
        ACCEL_X: "m/s²",
        ACCEL_Y: "m/s²",
        ACCEL_Z: "m/s²",
        GYRO_X: "°",
        GYRO_Y: "°",
        GYRO_Z: "°"
    }

    render() {
        return (
            <div>
                <pre style={{position: 'absolute'}}>{JSON.stringify(this.props.data, null, 4)}</pre>
            </div>
        )
    }
}

class DataLine extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <span className="data-name">{this.props.dataName}</span>
                <span className="data-value">{this.props.dataValue}</span>
                <span className="data-unit">{this.props.dataUnit}</span>
            </div>
        )
    }
}

export default PrettyData;